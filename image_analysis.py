import cv2
import numpy as np
import json

def process_single_image(gray_image, grid_rows, grid_cols):
    """
    Process a single grayscale image and return intensity matrices.
    """
    # Apply Gaussian blur to reduce noise
    gray_blur = cv2.GaussianBlur(gray_image, (5, 5), 0)

    # Apply Sobel operator for edge detection
    grad_x = cv2.Sobel(gray_blur, cv2.CV_64F, 1, 0, ksize=3)
    grad_y = cv2.Sobel(gray_blur, cv2.CV_64F, 0, 1, ksize=3)
    grad_magnitude = cv2.magnitude(grad_x, grad_y)
    edge_strength = cv2.normalize(grad_magnitude, None, 0, 1, cv2.NORM_MINMAX)

    # Invert brightness and normalize
    inverted_brightness = 255 - gray_blur
    inverted_brightness_norm = inverted_brightness / 255.0

    # Resize matrices to grid size
    brightness_intensity_matrix = cv2.resize(
        inverted_brightness_norm, (grid_cols, grid_rows), interpolation=cv2.INTER_AREA)
    edge_intensity_matrix = cv2.resize(
        edge_strength, (grid_cols, grid_rows), interpolation=cv2.INTER_AREA)

    return brightness_intensity_matrix, edge_intensity_matrix

def process_image(image_path, grid_rows=5, grid_cols=8, scale_percent=50):
    """
    Process an image and generate intensity matrices.
    """
    # Read the image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Unable to read image.")

    # Reduce resolution
    width = int(image.shape[1] * scale_percent / 100)
    height = int(image.shape[0] * scale_percent / 100)
    dim = (width, height)
    image_resized = cv2.resize(image, dim, interpolation=cv2.INTER_AREA)

    # Convert to grayscale
    gray_image = cv2.cvtColor(image_resized, cv2.COLOR_BGR2GRAY)

    # Process the image
    brightness_intensity_matrix, edge_intensity_matrix = process_single_image(
        gray_image, grid_rows, grid_cols)

    # Normalize the intensity matrices
    brightness_intensity_matrix = cv2.normalize(
        brightness_intensity_matrix, None, 0, 1, cv2.NORM_MINMAX)
    edge_intensity_matrix = cv2.normalize(
        edge_intensity_matrix, None, 0, 1, cv2.NORM_MINMAX)

    # Calculate combined intensity
    combined_intensity_matrix = (0.5 * brightness_intensity_matrix +
                                 0.5 * edge_intensity_matrix)
    combined_intensity_matrix = np.clip(combined_intensity_matrix, 0, 1)

    return combined_intensity_matrix, grid_rows, grid_cols

def save_intensity_matrix_to_json(intensity_matrix, grid_rows, grid_cols, output_file='intensity_data.json'):
    """
    Save the intensity matrix to a JSON file.
    """
    data = {
        "grid_rows": grid_rows,
        "grid_cols": grid_cols,
        "intensity_matrices": [{
            "timestamp_ms": 0,  # Placeholder for timestamp
            "intensity_grid": intensity_matrix.tolist()
        }]
    }

    # Write to JSON file
    with open(output_file, 'w') as json_file:
        json.dump(data, json_file, indent=4)

    print(f"Intensity data saved to {output_file}")
