from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
model = SentenceTransformer('sentence-transformers/paraphrase-MiniLM-L6-v2')

@app.route('/embed', methods=['POST'])
def embed():
    data = request.json
    sentences = data.get('sentences')
    if not sentences:
        return jsonify({"error": "No sentences provided"}), 400

    embeddings = model.encode(sentences)
    embeddings_list = embeddings.tolist() if hasattr(embeddings, 'tolist') else embeddings
    return jsonify({"embeddings": embeddings_list})

if __name__ == '__main__':
    app.run(port=5001)
