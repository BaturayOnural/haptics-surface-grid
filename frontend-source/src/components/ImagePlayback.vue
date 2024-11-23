<!-- Contributor(s): Erhan Baturay Onural -->
<template>
    <div class="image-playback">
      <!-- Home Button -->
      <button @click="goHome" class="home-button">Home</button>
      <!-- Page Header -->
      <h1 class="page-title">🖼️ Image Analysis</h1>
      <!-- Container for all elements -->
      <div class="content-container">
        <!-- Main Content (Image and Grid) -->
        <div class="main-content">
          <!-- Media Display with Grid Lines -->
          <div class="media-container">
            <!-- Media Information (Title) -->
            <div class="media-info">
              <div class="media-title">Frame</div>
            </div>
            <!-- Canvas for Image -->
            <canvas ref="canvas" class="media-canvas"></canvas>
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
                v-for="(cell, index) in gridData"
                :key="index"
                :style="{ backgroundColor: getInterpolatedColor(cell) }"
                class="grid-cell"
              ></div>
            </div>
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
  import axios from 'axios';
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'ImagePlayback',
    computed: {
      ...mapGetters(['getMediaFilename', 'getDataFilename']),
    },
    data() {
      return {
        gridData: [],
        gridRows: 0,
        gridCols: 0,
        errorMessage: '', // Variable to store and display error messages
        isMediaLoaded: false, // Flag to check if media is loaded
      };
    },
    methods: {
      fetchData() {
        const mediaFilename = this.getMediaFilename;
        const dataFilename = this.getDataFilename;
  
        if (!mediaFilename) {
          console.error('Media filename is missing.');
          this.errorMessage = 'Media filename is missing.';
          return;
        }
  
        // Set media source with correct backticks
        const mediaUrl = `/api/media/${mediaFilename}`;
  
        // Load image
        this.loadImage(mediaUrl);
  
        // Fetch intensity data
        if (dataFilename) {
          axios
            .get(`/api/data/${dataFilename}`)
            .then((response) => {
              const intensityData = response.data;
              this.gridData = intensityData.intensity_matrices[0].intensity_grid.flat();
              this.gridRows = intensityData.grid_rows;
              this.gridCols = intensityData.grid_cols;
              this.drawLegend();
            })
            .catch((error) => {
              console.error('Error fetching intensity data:', error);
              this.errorMessage = 'Error fetching intensity data.';
            });
        }
      },
      loadImage(url) {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Handle CORS if necessary
        img.src = url;
        img.onload = () => {
          this.isMediaLoaded = true;
          this.drawImage(img);
        };
        img.onerror = () => {
          console.error('Error loading image.');
          this.errorMessage = 'Error loading image.';
        };
      },
      drawImage(img) {
        const canvas = this.$refs.canvas;
        const context = canvas.getContext('2d');
  
        // Set canvas size to fixed dimensions
        canvas.width = 640; // Fixed width
        canvas.height = 360; // Fixed height
  
        // Draw image on canvas with scaling
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        // Optionally, draw grid lines on the image
        this.drawGridLines(context, canvas.width, canvas.height);
      },
      getInterpolatedColor(value) {
        if (value <= 0.2) {
          return this.interpolateColor([0, 0, 139], [0, 0, 255], value / 0.2);
        } else if (value <= 0.4) {
          return this.interpolateColor([0, 0, 255], [0, 255, 255], (value - 0.2) / 0.2);
        } else if (value <= 0.6) {
          return this.interpolateColor([0, 255, 255], [255, 255, 0], (value - 0.4) / 0.2);
        } else if (value <= 0.8) {
          return this.interpolateColor([255, 255, 0], [255, 165, 0], (value - 0.6) / 0.2);
        } else {
          return this.interpolateColor([255, 165, 0], [139, 0, 0], (value - 0.8) / 0.2);
        }
      },
      interpolateColor(color1, color2, factor) {
        const result = color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
        return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
      },
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
      drawLegend() {
        const legendCanvas = this.$refs.legendCanvas;
        const ctx = legendCanvas.getContext('2d');
  
        const dpr = window.devicePixelRatio || 1;
        const cssWidth = 300;
        const cssHeight = 60;
  
        legendCanvas.width = cssWidth * dpr;
        legendCanvas.height = cssHeight * dpr;
  
        ctx.scale(dpr, dpr);
  
        const gradientWidth = 260;
        const gradientOffset = 20;
  
        ctx.clearRect(0, 0, cssWidth, cssHeight);
  
        const gradient = ctx.createLinearGradient(gradientOffset, 0, gradientOffset + gradientWidth, 0);
        gradient.addColorStop(0, 'DarkBlue');
        gradient.addColorStop(0.2, 'Blue');
        gradient.addColorStop(0.4, 'Cyan');
        gradient.addColorStop(0.6, 'Yellow');
        gradient.addColorStop(0.8, 'Orange');
        gradient.addColorStop(1, 'DarkRed');
  
        ctx.fillStyle = gradient;
        ctx.fillRect(gradientOffset, 20, gradientWidth, 20);
  
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
  .image-playback {
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
  
  /* Main content (image and grid) styling */
  .main-content {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    width: 100%;
    justify-content: center;
  }
  
  /* Media container styling */
  .media-container,
  .grid-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    max-width: 640px; /* Set same width */
    position: relative;
  }
  
  /* Media information styling */
  .media-info {
    display: flex;
    flex-direction: row; /* Arrange items horizontally */
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
  }
  
  /* Media title styling */
  .media-title {
    font-size: 18px;
    font-weight: bold;
    color: black; /* Changed color to black */
  }
  
  /* Canvas styling */
  .media-canvas {
    width: 640px; /* Fixed width */
    height: 360px; /* Fixed height */
    border: 1px solid #000;
    object-fit: cover; /* Ensure image fits well */
  }
  
  /* Grid styling */
  .grid {
    display: grid;
    width: 640px; /* Same width as image */
    height: 360px; /* Same height as image */
    border: 1px solid #000;
  }
  
  /* Grid cells */
  .grid-cell {
    width: 100%;
    height: 100%;
    border: 1px solid rgba(0, 0, 0, 0.1); /* Thin border for cells */
  }
  
  /* Grid title styling */
  .grid-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
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
  
  /* Responsive Design */
  @media (max-width: 700px) {
    .media-container,
    .grid-container {
      max-width: 100%;
    }
  
    .media-canvas,
    .grid {
      width: 100%;
      height: auto;
    }
  
    .legend-bar {
      width: 80%; /* Responsive width */
    }
  }
  </style>