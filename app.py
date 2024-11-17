from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
import uuid
import shutil
import mimetypes

from surface_analysis import process_frames_combined_optimized, save_intensity_matrices_to_json
from image_analysis import process_image, save_intensity_matrix_to_json

app = Flask(__name__, static_folder='dist', static_url_path='/')
CORS(app, resources={r"/api/*": {"origins": "*"}})

UPLOAD_FOLDER = 'uploads'
DATA_FOLDER = 'data'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DATA_FOLDER, exist_ok=True)

def clear_folder(folder_path):
    """
    Deletes all files and subdirectories in the specified folder.
    """
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            app.logger.error(f'Failed to delete {file_path}. Reason: {e}')

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    clear_folder(UPLOAD_FOLDER)
    clear_folder(DATA_FOLDER)

    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    mime_type, _ = mimetypes.guess_type(file.filename)

    if mime_type and mime_type.startswith('video'):
        # Process video
        result = process_frames_combined_optimized(file_path)
        if result is None:
            return jsonify({'error': 'Error processing video'}), 500

        combined_intensity_matrices, grid_rows, grid_cols, timestamps = result
        data_filename = "intensity_data.json"
        data_path = os.path.join(DATA_FOLDER, data_filename)
        save_intensity_matrices_to_json(combined_intensity_matrices, timestamps, grid_rows, grid_cols, output_file=data_path)

        return jsonify({
            'type': 'video',
            'filename': filename,
            'data_filename': data_filename
        }), 200

    elif mime_type and mime_type.startswith('image'):
        # Process image
        try:
            combined_intensity_matrix, grid_rows, grid_cols = process_image(file_path)
            data_filename = "intensity_data.json"
            data_path = os.path.join(DATA_FOLDER, data_filename)
            save_intensity_matrix_to_json(combined_intensity_matrix, grid_rows, grid_cols, output_file=data_path)

            return jsonify({
                'type': 'image',
                'filename': filename,
                'data_filename': data_filename
            }), 200
        except Exception as e:
            app.logger.error(f'Error processing image: {e}')
            return jsonify({'error': 'Error processing image'}), 500

    return jsonify({'error': 'Unsupported file type'}), 400

@app.route('/api/data/<filename>')
def get_data(filename):
    return send_from_directory(DATA_FOLDER, filename)

@app.route('/api/media/<filename>')
def get_media(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/')
def serve_index():
    return send_file(os.path.join(app.static_folder, 'index.html'))

@app.route('/<path:path>')
def serve_vue_app(path):
    if os.path.isfile(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_file(os.path.join(app.static_folder, 'index.html'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5710)