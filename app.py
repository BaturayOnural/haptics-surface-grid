# app.py

from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
import uuid
import shutil  # For file and directory management

# Import necessary functions from surface_analysis.py
from surface_analysis import process_frames_combined_optimized, save_intensity_matrices_to_json

app = Flask(__name__, static_folder='dist', static_url_path='/')
CORS(app)

UPLOAD_FOLDER = 'uploads'
DATA_FOLDER = 'data'

# Ensure necessary directories exist
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
                os.unlink(file_path)  # Delete the file or symbolic link
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)  # Delete the subdirectory
        except Exception as e:
            app.logger.error(f'Failed to delete {file_path}. Reason: {e}')

# API endpoint for uploading video
@app.route('/api/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video part'}), 400
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # When a new video is uploaded, delete all previous videos and data
    clear_folder(UPLOAD_FOLDER)
    clear_folder(DATA_FOLDER)

    # Generate a unique filename for the uploaded video
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    # Process the video and generate intensity data
    result = process_frames_combined_optimized(file_path)

    if result is None:
        return jsonify({'error': 'Error processing video'}), 500

    combined_intensity_matrices, grid_rows, grid_cols, timestamps = result

    # Save intensity data to a JSON file named intensity_data.json
    data_filename = "intensity_data.json"
    data_path = os.path.join(DATA_FOLDER, data_filename)
    save_intensity_matrices_to_json(combined_intensity_matrices, timestamps, grid_rows, grid_cols, output_file=data_path)

    # Return the filenames to the frontend
    return jsonify({
        'video_filename': filename,
        'data_filename': data_filename
    }), 200

# API endpoint to serve video files
@app.route('/api/video/<filename>')
def get_video(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# API endpoint to serve intensity data
@app.route('/api/data/<filename>')
def get_data(filename):
    return send_from_directory(DATA_FOLDER, filename)

# Route for serving the index.html file
@app.route('/')
def serve_index():
    return send_file(os.path.join(app.static_folder, 'index.html'))

# Catch-all route to handle Vue.js router paths
@app.route('/<path:path>')
def serve_vue_app(path):
    if os.path.isfile(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_file(os.path.join(app.static_folder, 'index.html'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)