# surface_analysis.py

import cv2
import numpy as np
import json
from multiprocessing import Pool, cpu_count

def process_single_frame_optimized(args):
    (prev_gray, curr_gray, frame_height, frame_width, grid_rows, grid_cols) = args

    # Apply Gaussian blur to reduce noise
    prev_gray_blur = cv2.GaussianBlur(prev_gray, (5, 5), 0)
    curr_gray_blur = cv2.GaussianBlur(curr_gray, (5, 5), 0)

    # Calculate optical flow (simplified parameters)
    flow = cv2.calcOpticalFlowFarneback(prev_gray_blur, curr_gray_blur, None,
                                        pyr_scale=0.5, levels=1, winsize=9,
                                        iterations=3, poly_n=5, poly_sigma=1.2, flags=0)

    # Compute magnitude and angle of flow vectors
    mag, ang = cv2.cartToPolar(flow[..., 0], flow[..., 1])

    # Normalize magnitude
    mag_norm = cv2.normalize(mag, None, 0, 1, cv2.NORM_MINMAX)

    # Apply Sobel operator for edge detection
    grad_x = cv2.Sobel(curr_gray_blur, cv2.CV_64F, 1, 0, ksize=3)
    grad_y = cv2.Sobel(curr_gray_blur, cv2.CV_64F, 0, 1, ksize=3)
    grad_magnitude = cv2.magnitude(grad_x, grad_y)
    edge_strength = cv2.normalize(grad_magnitude, None, 0, 1, cv2.NORM_MINMAX)

    # Invert brightness and normalize
    inverted_brightness = 255 - curr_gray_blur
    inverted_brightness_norm = inverted_brightness / 255.0

    # Resize matrices to grid size
    flow_intensity_matrix = cv2.resize(mag_norm, (grid_cols, grid_rows), interpolation=cv2.INTER_AREA)
    brightness_intensity_matrix = cv2.resize(inverted_brightness_norm, (grid_cols, grid_rows), interpolation=cv2.INTER_AREA)
    edge_intensity_matrix = cv2.resize(edge_strength, (grid_cols, grid_rows), interpolation=cv2.INTER_AREA)

    return flow_intensity_matrix, brightness_intensity_matrix, edge_intensity_matrix

def process_frames_combined_optimized(video_path, frame_interval_ms=300, scale_percent=50):
    # Video capture object
    cap = cv2.VideoCapture(video_path)

    # Video frame rate (fps) and total frame count
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_duration_ms = (total_frames / fps) * 1000  # Total video duration in ms

    if fps == 0:
        print("Unable to retrieve video FPS.")
        cap.release()
        return None

    # Frame interval corresponding to the desired time interval
    frame_interval = int((frame_interval_ms / 1000) * fps)

    # Calculate total number of frames to process
    num_frames = int(video_duration_ms // frame_interval_ms)

    # Set current frame number to -frame_interval so that the first increment brings it to 0
    current_frame_number = -frame_interval

    # Lists to collect frames and previous grayscale frames
    prev_grays = []
    curr_grays = []
    timestamps = []

    # Read the first frame
    ret, prev_frame = cap.read()
    if not ret:
        print("Unable to read video or retrieve frame.")
        cap.release()
        return None

    # Reduce resolution
    width = int(prev_frame.shape[1] * scale_percent / 100)
    height = int(prev_frame.shape[0] * scale_percent / 100)
    dim = (width, height)
    prev_frame = cv2.resize(prev_frame, dim, interpolation=cv2.INTER_AREA)

    # Convert the first frame to grayscale
    prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)

    frame_height, frame_width = prev_frame.shape[:2]

    # Set grid dimensions
    grid_cols = 8  # You can adjust this number
    grid_rows = 5  # You can adjust this number

    for i in range(num_frames):
        # Increment current frame number
        current_frame_number += frame_interval

        if current_frame_number >= total_frames:
            print(f"Frame {i+1} does not exist.")
            break

        # Set the position to read the current frame
        cap.set(cv2.CAP_PROP_POS_FRAMES, current_frame_number)
        ret, curr_frame = cap.read()
        if not ret:
            print(f"Unable to read frame {i+1}.")
            break

        # Reduce resolution
        curr_frame = cv2.resize(curr_frame, dim, interpolation=cv2.INTER_AREA)

        # Convert to grayscale
        curr_gray = cv2.cvtColor(curr_frame, cv2.COLOR_BGR2GRAY)

        # Calculate and append timestamp
        timestamp_ms = current_frame_number * (1000 / fps)
        timestamps.append(timestamp_ms)

        # Append to lists
        prev_grays.append(prev_gray)
        curr_grays.append(curr_gray)

        # Update for the next iteration
        prev_gray = curr_gray.copy()

    cap.release()

    if not prev_grays:
        print("No frames were processed.")
        return None

    # Create a processing pool based on the number of CPUs
    pool = Pool(processes=cpu_count())

    # Process frames in parallel
    args_list = [(prev_grays[i], curr_grays[i], frame_height, frame_width, grid_rows, grid_cols)
                 for i in range(len(prev_grays))]

    results = pool.map(process_single_frame_optimized, args_list)

    pool.close()
    pool.join()

    # Collect values for normalization
    all_flow_intensities = []
    all_brightness_intensities = []
    all_edge_intensities = []

    intensity_matrices = []

    for res in results:
        flow_intensity_matrix, brightness_intensity_matrix, edge_intensity_matrix = res
        all_flow_intensities.extend(flow_intensity_matrix.flatten())
        all_brightness_intensities.extend(brightness_intensity_matrix.flatten())
        all_edge_intensities.extend(edge_intensity_matrix.flatten())
        intensity_matrices.append((flow_intensity_matrix, brightness_intensity_matrix, edge_intensity_matrix))

    # Normalization
    max_flow_intensity = np.max(all_flow_intensities)
    min_flow_intensity = np.min(all_flow_intensities)

    max_brightness_intensity = np.max(all_brightness_intensities)
    min_brightness_intensity = np.min(all_brightness_intensities)

    max_edge_intensity = np.max(all_edge_intensities)
    min_edge_intensity = np.min(all_edge_intensities)

    combined_intensity_matrices = []

    for idx in range(len(intensity_matrices)):
        flow_intensity_matrix, brightness_intensity_matrix, edge_intensity_matrix = intensity_matrices[idx]

        # Normalize optical flow intensity
        flow_intensity_matrix = (flow_intensity_matrix - min_flow_intensity) / (max_flow_intensity - min_flow_intensity + 1e-8)

        # Normalize brightness intensity
        brightness_intensity_matrix = (brightness_intensity_matrix - min_brightness_intensity) / (max_brightness_intensity - min_brightness_intensity + 1e-8)

        # Normalize edge intensity
        edge_intensity_matrix = (edge_intensity_matrix - min_edge_intensity) / (max_edge_intensity - min_edge_intensity + 1e-8)

        # Calculate combined wave intensity
        combined_intensity_matrix = (0.20 * flow_intensity_matrix +
                                     0.40 * brightness_intensity_matrix +
                                     0.40 * edge_intensity_matrix)

        # Clip values to [0, 1]
        combined_intensity_matrix = np.clip(combined_intensity_matrix, 0, 1)

        combined_intensity_matrices.append(combined_intensity_matrix)

    return combined_intensity_matrices, grid_rows, grid_cols, timestamps

def save_intensity_matrices_to_json(intensity_matrices, timestamps, grid_rows, grid_cols, output_file='intensity_data.json'):
    data = {
        "grid_rows": grid_rows,
        "grid_cols": grid_cols,
        "intensity_matrices": []
    }

    for idx, (matrix, timestamp_ms) in enumerate(zip(intensity_matrices, timestamps)):
        # Convert the matrix to a list of lists (rows)
        matrix_list = matrix.tolist()
        data_entry = {
            "timestamp_ms": int(timestamp_ms),
            "intensity_grid": matrix_list
        }
        data["intensity_matrices"].append(data_entry)

    # Write to JSON file
    with open(output_file, 'w') as json_file:
        json.dump(data, json_file, indent=4)

    print(f"Intensity data saved to {output_file}")
