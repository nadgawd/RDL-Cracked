import os
import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

app = Flask(__name__)
CORS(app)

# Configuration
MATERIAL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'material')
PDF_PATHS = [
    os.path.join(MATERIAL_DIR, 'major.pdf'),
    os.path.join(MATERIAL_DIR, 'e-book.pdf'),
]
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "qwen2.5:3b"  # Fast local model, non-reasoning (no <think> gibberish)
CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

# Global variables for vector store
vector_store = None

def initialize_rag():
    global vector_store

    # 1. Load all PDFs
    all_documents = []
    for pdf_path in PDF_PATHS:
        print(f"Loading PDF: {pdf_path}...")
        if not os.path.exists(pdf_path):
            print(f"  WARNING: PDF not found at {pdf_path}, skipping.")
            continue
        loader = PyPDFLoader(pdf_path)
        docs = loader.load()
        print(f"  Loaded {len(docs)} pages.")
        all_documents.extend(docs)

    if not all_documents:
        raise FileNotFoundError("No PDFs found in material folder!")

    print(f"Total pages across all PDFs: {len(all_documents)}")


    # 2. Split the text into manageable chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )
    chunks = text_splitter.split_documents(all_documents)
    print(f"Split into {len(chunks)} chunks.")

    # 3. Create Vector Store with HuggingFace Embeddings (runs locally, no API key needed)
    print("Initializing embedding model (this may take a moment to download on first run)...")
    embeddings = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
        show_progress=True
    )
    
    print("Building Chroma vector store...")
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_PERSIST_DIR
    )
    # vector_store.persist() is automatic in modern chromadb
    print("RAG System Initialized and Ready.")

@app.route('/query', methods=['POST'])
def query_rag():
    if not vector_store:
        return jsonify({"error": "Vector store not initialized"}), 500

    data = request.json
    user_query = data.get('query')
    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    print(f"Received query: {user_query}")

    # 1. Retrieve relevant chunks (fewer for small model)
    retriever = vector_store.as_retriever(search_kwargs={"k": 5})
    relevant_docs = retriever.invoke(user_query)
    
    # Deduplicate documents based on content
    unique_contents = []
    seen = set()
    for doc in relevant_docs:
        if doc.page_content not in seen:
            seen.add(doc.page_content)
            unique_contents.append(doc.page_content)
    
    # 2. Compile context
    context = "\n\n".join(unique_contents[:4])
    
    # 3. Format Prompt
    prompt = f"""You are a helpful assistant. Answer the question based ONLY on the provided context.
Provide a detailed, comprehensive answer in 2-3 paragraphs. Do NOT repeat the question.

Context:
{context}

Question: {user_query}

Answer:"""

    print(f"Querying {MODEL_NAME} via Ollama...")
    
    # 4. Request Ollama
    try:
        response = requests.post(OLLAMA_URL, json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.3,
                "num_predict": 512  # Cap output length to avoid rambling
            }
        })
        response.raise_for_status()
        ollama_data = response.json()
        
        raw_response = ollama_data.get("response", "").strip()
        print(f"Raw response length: {len(raw_response)} chars")

        # Strip DeepSeek-R1 thinking tokens — handle all variants:
        # 1. Normal: <think>...</think>answer
        # 2. Missing opening tag: garbled...</think>answer
        # 3. Multiple think blocks
        clean_response = re.sub(r'<think>.*?</think>', '', raw_response, flags=re.DOTALL).strip()
        # If </think> exists but <think> was missing/malformed, strip everything before it
        if '</think>' in clean_response:
            clean_response = clean_response.split('</think>')[-1].strip()

        # Strip residual markdown junk (e.g. lone ** or *)
        clean_response = re.sub(r'^[\s\*\_#>]+$', '', clean_response, flags=re.MULTILINE).strip()

        if not clean_response:
            clean_response = "The model could not produce a clear answer. Try rephrasing your query or using a larger model."

        print(f"Clean response ({len(clean_response)} chars): {clean_response[:120]}...")

        return jsonify({
            "response": clean_response,
            "context_used": context
        })
        
    except requests.exceptions.RequestException as e:
        print(f"Ollama Error: {e}")
        return jsonify({"error": f"Failed to connect to Ollama. Ensure '{MODEL_NAME}' is running locally. Details: {str(e)}"}), 502

if __name__ == '__main__':
    # Initialize the RAG pipeline before starting the server
    initialize_rag()
    app.run(port=5001, debug=False)
