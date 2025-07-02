from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from agent import run_agent  # Your existing agent
from werkzeug.utils import secure_filename

# Load env vars
load_dotenv()

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Make sure upload dir exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Handle multipart/form-data (image + query)
        if request.content_type and "multipart/form-data" in request.content_type:
            query = request.form.get('query')
            file = request.files.get('file')

            file_url = None
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                file_url = f"/uploads/{filename}"  # for client preview, optional

                # For actual image processing, insert your model or code here
                # For example: result = my_ocr_function(filepath)
                # For now, let's just echo that an image was received

            # Compose a bot response (use the image if you wish)
            if query and file_url:
                response_text = f"Received your question: '{query}' and image '{filename}'. (Backend doesn't process images yet.)"
            elif file_url:
                response_text = f"Received your image '{filename}'. (No question text sent.)"
            elif query:
                response_text = run_agent(query)
            else:
                return jsonify({"error": "No query or file sent."}), 400

            return jsonify({"response": response_text})

        # Handle plain JSON (text-only)
        data = request.get_json()
        query = data.get('query')
        if not query:
            return jsonify({"error": "Missing 'query' in request"}), 400

        response = run_agent(query)
        return jsonify({"response": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Static route to serve uploads (for dev only!)
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return flask.send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
