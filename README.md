# RDL Cracked - RAG Presentation Application

A modern, browser-native presentation application powered by a local Retrieval-Augmented Generation (RAG) system. This project allows users to seamlessly query academic materials directly from the presentation slides using a custom `Cmd+F` interface, generating intelligent, context-aware answers dynamically.

## 🌟 Features

- **Seamless AI Integration**: Replaces the standard browser search with a custom `Cmd+F` find bar to query the local LLM.
- **Dynamic Answer Slides**: AI-generated answers are seamlessly appended as a clean, dismissible slide at the end of your presentation.
- **100% Local Processing**: Runs entirely offline for complete privacy, utilizing a local LLM via Ollama and local HuggingFace embeddings.
- **Document Ingestion**: Automatically ingests and indexes PDF study materials (e.g., `major.pdf`, `e-book.pdf`) into a vector database for accurate, context-grounded answers.
- **No UI Clutter**: Clean, PDF-viewer style aesthetic optimized for academic presentations.

## 🛠️ Technology Stack

**Frontend:**
- React (via Vite)
- TailwindCSS for styling
- Custom secret interfaces & slide components

**Backend:**
- Python & Flask
- LangChain (Document loaders, Text splitters)
- ChromaDB (Vector database)
- HuggingFace Embeddings (`all-MiniLM-L6-v2`)
- Ollama (running the fast, non-reasoning `qwen2.5:3b` model)

## 🚀 Setup Instructions

### Prerequisites
- Node.js and npm installed
- Python 3.x installed
- [Ollama](https://ollama.com/) installed and running on your machine.

### 1. Model Preparation
Make sure you have pulled the required Ollama model locally:
```bash
ollama pull qwen2.5:3b
```

### 2. Backend Setup
The backend handles the RAG pipeline, document embedding, and LLM querying.
```bash
cd backend
python3 -m venv venv
source venv/bin/activate

# Install required dependencies
pip install flask flask-cors langchain_community langchain_huggingface chromadb pypdf requests

# Start the Flask server (runs on port 5001)
python rag_server.py
```
*Note: Ensure your PDFs are placed in the `material/` directory at the project root before starting the server so they can be indexed.*

### 3. Frontend Setup
The frontend serves the React presentation deck.
```bash
cd regression-app
npm install

# Start the Vite development server
npm run dev
```

## 🎮 Usage

1. Open the frontend URL provided by Vite (usually `http://localhost:5173`).
2. Navigate through your presentation slides.
3. Press `Cmd+F` (or `Ctrl+F` on Windows/Linux) to trigger the AI query bar.
4. Type your question related to the indexed PDF materials and press Enter.
5. A clean new slide will instantly appear containing the generated answer. Press `Escape` to dismiss it and return to the presentation.
