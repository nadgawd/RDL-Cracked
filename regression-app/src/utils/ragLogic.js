// Local Python Flask Backend URL
const RAG_SERVER_URL = "http://127.0.0.1:5001/query";

export const queryOllama = async (query, _context) => {
    // Note: The context generation is now handled by the Python backend natively.
    // The frontend only passes the raw query.
    try {
        const response = await fetch(RAG_SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`RAG Server error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        
        // Let's log the Python backend context to the console for verification during development
        console.log("--- Authentic RAG Context Retrieved ---");
        console.log(data.context_used);
        
        return data.response;
        
    } catch (error) {
        console.error("RAG pipeline error:", error);
        return `[Connection Error] Could not query authentic RAG backend.\n\nDetails: ${error.message}\n\nPlease ensure your Python Flask server (rag_server.py) is running on port 5000.`;
    }
};

// We keep a dummy export here just to prevent breaking any legacy imports, 
// though the component implementation can just pass empty strings for context now.
export const ragFilter = (query) => {
    return ""; 
};
