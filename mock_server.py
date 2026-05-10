from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/query', methods=['POST'])
def query_rag():
    data = request.json
    print(f"Received query: {data.get('query')}")
    return jsonify({
        "response": "This is a detailed mock answer used for testing the UI. It simulates the output of the local Llama 3.1 model. It explains that the user interface correctly triggered the backend and displayed this dynamic slide successfully.",
        "context_used": "Mock context from the presentation."
    })

if __name__ == '__main__':
    print("Mock Server running on port 5001")
    app.run(port=5001, debug=False)
