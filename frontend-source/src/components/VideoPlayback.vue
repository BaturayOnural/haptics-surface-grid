<!-- Contributor(s): Erhan Baturay Onural, Jihong Zhang -->
<!-- Jihong Zhang: Developed inital version of the page. Developed main functionalities as displaying image and haptics grid, color schema and previous-next frame buttons -->
<!-- Erhan Baturay Onural: Improved the look and feel of the page, developed json download functionality and home navigation-->
<template>
  <div class="video-playback">
    <!-- Home Button -->
    <button @click="goHome" class="home-button">Home</button>
    <!-- Page Header -->
    <h1 class="page-title">🎥 Video Analysis</h1>
    <!-- Container for all elements -->
    <div class="content-container">
      <!-- Main Content (Frame and Grid) -->
      <div class="main-content">
        <!-- Video Frame Display with Grid Lines -->
        <div class="frame-container">
          <!-- Frame Information (Title and Timestamp) -->
          <div class="frame-info">
            <div class="frame-title">Frame ({{ frameIndex + 1 }}/{{ totalFrames }})</div>
            <div class="time-display">Time: {{ currentTimestamp }} ms</div>
          </div>
          <!-- Canvas for Video Frame -->
          <canvas ref="canvas" class="frame-image"></canvas>
          <!-- Previous Frame Button -->
          <button @click="previousFrame" :disabled="frameIndex === 0" class="nav-button">Previous Frame</button>
        </div>
        <!-- Wave Intensity Grid Display -->
        <div class="grid-container">
          <div class="grid-title">Wave Intensity Grid</div>
          <!-- Dynamic Grid Cells Colored by Intensity -->
          <div
            class="grid"
            :style="{
              gridTemplateColumns: 'repeat(' + gridCols + ', 1fr)',
              gridTemplateRows: 'repeat(' + gridRows + ', 1fr)',
            }"
          >
            <div
              v-for="(cell, index) in currentGridData"
              :key="index"
              :style="{ backgroundColor: getInterpolatedColor(cell) }"
              class="grid-cell"
            ></div>
          </div>
          <!-- Next Frame Button -->
          <button @click="nextFrame" :disabled="frameIndex >= totalFrames - 1" class="nav-button">Next Frame</button>
        </div>
      </div>
      <!-- Intensity Legend -->
      <div class="legend">
        <h4>Intensity Legend</h4>
        <canvas ref="legendCanvas" class="legend-bar"></canvas>
      </div>
      <!-- Download Button -->
      <button @click="downloadIntensityData" class="download-button">Download Intensity Data</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Import axios for HTTP requests
import { mapGetters } from 'vuex';

export default {
  name: 'VideoPlayback',
  computed: {
    // Access file names from Vuex getters
    ...mapGetters(['getMediaFilename', 'getDataFilename']),
  },
  data() {
    return {
      frameIndex: 0, // Current frame index
      framesData: [], // Array of intensity matrices for each frame
      currentGridData: [], // Current grid cell intensity data
      currentTimestamp: 0, // Current frame timestamp
      video: null, // Reference to video element
      isVideoLoaded: false, // Flag to check if video is loaded
      gridRows: 0, // Number of rows in intensity grid
      gridCols: 0, // Number of columns in intensity grid
      totalFrames: 0, // Total number of frames
      errorMessage: '', // Variable to store and display error messages
      onVideoSeeked: null, // Reference to the seeked event handler
    };
  },
  methods: {
    // Fetch video and intensity data from backend
    fetchData() {
      const mediaFilename = this.getMediaFilename;
      const dataFilename = this.getDataFilename;

      if (!mediaFilename || !dataFilename) {
        console.error('Media or data filename is missing.');
        this.errorMessage = 'Media or data filename is missing.';
        return;
      }

      // Set video source using the correct endpoint and backticks
      const videoUrl = `/api/media/${mediaFilename}`;

      // Create video element and load video from backend
      this.video = document.createElement('video');
      this.video.crossOrigin = 'anonymous'; // Handle CORS if necessary
      this.video.src = videoUrl;
      this.video.onloadeddata = () => {
        this.isVideoLoaded = true;
        this.captureFrame();
      };
      this.video.onerror = () => {
        console.error('Error loading video.');
        this.errorMessage = 'Error loading video.';
      };

      // Fetch intensity data
      axios
        .get(`/api/data/${dataFilename}`)
        .then((response) => {
          const intensityData = response.data;
          this.framesData = intensityData.intensity_matrices;
          this.gridRows = intensityData.grid_rows;
          this.gridCols = intensityData.grid_cols;
          this.totalFrames = this.framesData.length;
          this.updateFrame(0);
          this.drawLegend();
        })
        .catch((error) => {
          console.error('Error fetching intensity data:', error);
          this.errorMessage = 'Error fetching intensity data.';
        });
    },
    // Update the current frame based on index
    updateFrame(index) {
      this.frameIndex = index;
      this.currentGridData = this.framesData[index].intensity_grid.flat(); // Flatten grid data
      this.currentTimestamp = this.framesData[index].timestamp_ms; // Update current frame timestamp
      this.captureFrame();
    },
    // Get interpolated color based on intensity value
    getInterpolatedColor(value) {
      if (value <= 0.2) {
        return this.interpolateColor([0, 0, 139], [0, 0, 255], value / 0.2); // DarkBlue to Blue
      } else if (value <= 0.4) {
        return this.interpolateColor([0, 0, 255], [0, 255, 255], (value - 0.2) / 0.2); // Blue to Cyan
      } else if (value <= 0.6) {
        return this.interpolateColor([0, 255, 255], [255, 255, 0], (value - 0.4) / 0.2); // Cyan to Yellow
      } else if (value <= 0.8) {
        return this.interpolateColor([255, 255, 0], [255, 165, 0], (value - 0.6) / 0.2); // Yellow to Orange
      } else {
        return this.interpolateColor([255, 165, 0], [139, 0, 0], (value - 0.8) / 0.2); // Orange to DarkRed
      }
    },
    // Helper function to interpolate between two colors
    interpolateColor(color1, color2, factor) {
      const result = color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
      return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
    },
    // Capture the current frame and draw on canvas
    captureFrame() {
      if (this.isVideoLoaded) {
        const canvas = this.$refs.canvas;
        const context = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 360;

        const frameInterval = 150; // Frame interval set to 150 ms to match backend

        const frameTime = (this.frameIndex * frameInterval) / 1000; // Current frame time in seconds

        // Check if frameTime exceeds video duration
        if (frameTime > this.video.duration) {
          console.error('Frame time exceeds video duration.');
          return;
        }

        // Remove any existing 'seeked' event listener
        if (this.onVideoSeeked) {
          this.video.removeEventListener('seeked', this.onVideoSeeked);
        }

        // Define the 'seeked' event handler
        this.onVideoSeeked = () => {
          context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
          this.drawGridLines(context, canvas.width, canvas.height);
          // Remove the event listener after handling
          this.video.removeEventListener('seeked', this.onVideoSeeked);
          this.onVideoSeeked = null; // Reset the handler reference
        };

        // Add the event listener
        this.video.addEventListener('seeked', this.onVideoSeeked);

        // Set the currentTime to seek the video
        this.video.currentTime = frameTime;
      }
    },
    // Draw grid lines on the canvas
    drawGridLines(context, width, height) {
      context.strokeStyle = 'white';
      context.lineWidth = 1;

      for (let i = 1; i < this.gridCols; i++) {
        context.beginPath();
        context.moveTo((i * width) / this.gridCols, 0);
        context.lineTo((i * width) / this.gridCols, height);
        context.stroke();
      }

      for (let j = 1; j < this.gridRows; j++) {
        context.beginPath();
        context.moveTo(0, (j * height) / this.gridRows);
        context.lineTo(width, (j * height) / this.gridRows);
        context.stroke();
      }
    },
    // Draw the legend for intensity values
    drawLegend() {
      const legendCanvas = this.$refs.legendCanvas;
      const ctx = legendCanvas.getContext('2d');

      // Get device pixel ratio for high resolution
      const dpr = window.devicePixelRatio || 1;

      // Desired CSS size
      const cssWidth = 300;
      const cssHeight = 60;

      // Set actual canvas size based on device pixel ratio
      legendCanvas.width = cssWidth * dpr;
      legendCanvas.height = cssHeight * dpr;

      // Scale the context to account for the device pixel ratio
      ctx.scale(dpr, dpr);

      const gradientWidth = 260; // Gradient width
      const gradientOffset = 20; // Left offset

      // Clear the canvas before drawing
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Create horizontal color gradient for intensity legend
      const gradient = ctx.createLinearGradient(gradientOffset, 0, gradientOffset + gradientWidth, 0);
      gradient.addColorStop(0, 'DarkBlue');
      gradient.addColorStop(0.2, 'Blue');
      gradient.addColorStop(0.4, 'Cyan');
      gradient.addColorStop(0.6, 'Yellow');
      gradient.addColorStop(0.8, 'Orange');
      gradient.addColorStop(1, 'DarkRed');

      ctx.fillStyle = gradient;
      ctx.fillRect(gradientOffset, 20, gradientWidth, 20); // Draw horizontal bar

      // Draw ticks and labels
      const tickPositions = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
      tickPositions.forEach((value, index) => {
        const x = gradientOffset + (index * (gradientWidth / (tickPositions.length - 1)));
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        // Draw tick
        ctx.beginPath();
        ctx.moveTo(x, 40);
        ctx.lineTo(x, 50);
        ctx.stroke();

        // Draw label
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(value.toFixed(1), x, 52);
      });
    },
    // Navigate to previous frame
    previousFrame() {
      if (this.frameIndex > 0) {
        this.updateFrame(this.frameIndex - 1);
      }
    },
    // Navigate to next frame
    nextFrame() {
      if (this.frameIndex < this.totalFrames - 1) {
        this.updateFrame(this.frameIndex + 1);
      } else {
        console.log('No more frames.');
      }
    },
    // Navigate to home page
    goHome() {
      this.$router.push('/');
    },
    // Download intensity data
    downloadIntensityData() {
      const dataFilename = this.getDataFilename;
      if (!dataFilename) {
        console.error('Data filename is missing.');
        this.errorMessage = 'Data filename is missing.';
        return;
      }

      const dataUrl = `/api/data/${dataFilename}`;

      // Use axios to get the data as blob
      axios
        .get(dataUrl, { responseType: 'blob' })
        .then((response) => {
          const blob = new Blob([response.data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', dataFilename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error('Error downloading intensity data:', error);
          this.errorMessage = 'Error downloading intensity data.';
        });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
/* Container styling */
.video-playback {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}

/* Home button styling */
.home-button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  font-size: 16px;
  border: 2px solid #1e90ff;
  background-color: #fff;
  color: #1e90ff;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.home-button:hover {
  background-color: #1e90ff;
  color: #fff;
}

/* Download button styling */
.download-button {
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 16px;
  border: 2px solid #28a745;
  background-color: #fff;
  color: #28a745;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.download-button:hover {
  background-color: #28a745;
  color: #fff;
}

/* Page title styling */
.page-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #1e90ff;
}

/* Content container styling */
.content-container {
  display: flex;
  flex-direction: column; /* Column alignment */
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
}

/* Main content (frame and grid) styling */
.main-content {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  width: 100%;
  justify-content: center;
}

/* Frame container styling */
.frame-container,
.grid-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 640px; /* Set same width */
  position: relative;
}

/* Frame information styling */
.frame-info {
  display: flex;
  flex-direction: row; /* Arrange items horizontally */
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
}

/* Canvas styling */
.frame-image {
  width: 640px; /* Fixed width */
  height: 360px; /* Fixed height */
  border: 1px solid #000;
  object-fit: cover; /* Ensure video content fits well */
}

/* Grid styling */
.grid {
  display: grid;
  width: 640px; /* Same width as video frame */
  height: 360px; /* Same height as video frame */
  border: 1px solid #000;
}

/* Grid cells */
.grid-cell {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1); /* Thin border for cells */
}

/* Navigation buttons styling */
.nav-button {
  margin-top: 10px;
  padding: 8px 16px;
  font-size: 16px;
  border: 2px solid #1e90ff;
  background-color: #fff;
  color: #1e90ff;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.nav-button:hover {
  background-color: #1e90ff;
  color: #fff;
}

button:disabled {
  color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

/* Legend styling */
.legend {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.legend h4 {
  margin-bottom: 10px;
  font-weight: bold;
}

/* Horizontal legend bar */
.legend-bar {
  width: 300px; /* Wider for horizontal layout */
  height: 60px; /* Shorter height for horizontal layout */
  border: 1px solid #000;
}

/* Frame title styling */
.frame-title {
  font-size: 18px;
  font-weight: bold;
  margin-right: 20px; /* Space between title and timestamp */
}

/* Grid title styling */
.grid-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

/* Timestamp display styling */
.time-display {
  font-size: 14px;
  color: #000;
}

/* Error message styling */
.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 700px) {
  .frame-container,
  .grid-container {
    max-width: 100%;
  }

  .frame-image,
  .grid {
    width: 100%;
    height: auto;
  }

  .legend-bar {
    width: 80%; /* Responsive width */
  }

  .frame-info {
    flex-direction: column; /* Stack vertically on small screens */
    align-items: flex-start;
  }

  .frame-title {
    margin-right: 0;
    margin-bottom: 5px;
  }
}
</style>