<!-- Contributor(s): Erhan Baturay Onural, Jihong Zhang -->
<!-- Jihong Zhang: Developed inital version of the page. Developed main functionalities as uploading the video file and forwarding to videoPlayback page -->
<!-- Erhan Baturay Onural: Developed image upload and distinguishment mechanism between image and video. Improved the look and feel of the page, included github link and brief explanation -->
<template>
  <div class="media-upload">
    <!-- Project Title -->
    <h1 class="project-title">🌊 Synchronous Haptics Grid Mapping from Top-down Videos and Images of Water Surface</h1>
    <!-- Explanatory Text -->
    <p class="project-description">
      This project presents a method for analyzing water waves in video and image footage to simulate the tactile sensations one would experience by haptic expressions on their hand. The primary goal is to track the progression of a wave and continuously calculate its intensity.
    </p>
    <!-- GitHub Link -->
    <a href="https://github.com/BaturayOnural/haptics-surface-grid" target="_blank" class="github-link">
      <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" class="github-logo">
      View Project on GitHub
    </a>
    <!-- Upload Section -->
    <div class="upload-section">
      <h2>Upload Media</h2>
      <!-- Custom File Input Button -->
      <div class="custom-file-input">
        <button @click="triggerFileSelect" class="upload-btn">Select Media</button>
        <input
          type="file"
          ref="fileInput"
          @change="handleFileUpload"
          accept="video/*,image/*"
          style="display: none;"
        >
      </div>
      <!-- Processing Message -->
      <div v-if="isProcessing" class="processing-message">
        <p>⏳ Processing...</p>
      </div>
      <!-- Error Message -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Import axios for HTTP requests
import { mapGetters } from 'vuex';

export default {
  name: 'MediaUpload', // Updated component name
  computed: {
    // Access file names from Vuex getters
    ...mapGetters(['getMediaFilename', 'getDataFilename']),
  },
  data() {
    return {
      errorMessage: '', // Variable to store and display error messages
      isProcessing: false, // To track the processing state
    };
  },
  methods: {
    // Trigger file selection dialog
    triggerFileSelect() {
      this.$refs.fileInput.click();
    },
    // Handle file upload
    handleFileUpload(event) {
      const file = event.target.files[0]; // Get the selected file
      if (file) {
        // Check if file size exceeds 100MB
        if (file.size > 100 * 1024 * 1024) {
          this.errorMessage = 'File size exceeds 100MB. Please select a smaller file.';
          return;
        }

        // Determine MIME type
        const mimeType = file.type;

        if (mimeType.startsWith('video')) {
          // Handle video file
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.src = URL.createObjectURL(file);
          video.onloadedmetadata = () => {
            // Check if video duration exceeds 30 seconds
            if (video.duration > 30) {
              this.errorMessage = 'Video duration exceeds 30 seconds. Please select a shorter video.';
            } else {
              // Clear any previous error messages
              this.errorMessage = '';

              // Set processing state to true
              this.isProcessing = true;

              // Create form data to send the media file
              const formData = new FormData();
              formData.append('file', file); // Updated key from 'video' to 'file'

              // Send the media to the backend API
              axios.post('/api/upload', formData)
                .then(response => {
                  // Extract filenames and type from response
                  const { filename, data_filename, type } = response.data;

                  // Commit to Vuex store based on media type
                  this.$store.commit('setMediaFilename', filename);
                  this.$store.commit('setDataFilename', data_filename);

                  // Set processing state to false
                  this.isProcessing = false;

                  // Redirect based on media type
                  if (type === 'video') {
                    this.$router.push('/video-playback');
                  } else if (type === 'image') {
                    this.$router.push('/image-playback');
                  } else {
                    this.errorMessage = 'Unsupported media type.';
                  }
                })
                .catch(error => {
                  this.errorMessage = 'An error occurred while uploading the media. Please try again.';
                  console.error(error);
                  // Set processing state to false
                  this.isProcessing = false;
                });
            }
          };
          video.onerror = () => {
            this.errorMessage = 'Invalid media file. Please select a valid video or image.';
          };
        } else if (mimeType.startsWith('image')) {
          // Handle image file
          // Clear any previous error messages
          this.errorMessage = '';

          // Set processing state to true
          this.isProcessing = true;

          // Create form data to send the media file
          const formData = new FormData();
          formData.append('file', file);

          // Send the media to the backend API
          axios.post('/api/upload', formData)
            .then(response => {
              // Extract filenames and type from response
              const { filename, data_filename, type } = response.data;

              // Commit to Vuex store based on media type
              this.$store.commit('setMediaFilename', filename);
              this.$store.commit('setDataFilename', data_filename);

              // Set processing state to false
              this.isProcessing = false;

              // Redirect based on media type
              if (type === 'video') {
                this.$router.push('/video-playback');
              } else if (type === 'image') {
                this.$router.push('/image-playback');
              } else {
                this.errorMessage = 'Unsupported media type.';
              }
            })
            .catch(error => {
              this.errorMessage = 'An error occurred while uploading the media. Please try again.';
              console.error(error);
              // Set processing state to false
              this.isProcessing = false;
            });
        } else {
          // Unsupported file type
          this.errorMessage = 'Unsupported file type. Please upload a video or image.';
        }
      }
    },
  },
};
</script>

<style scoped>
/* Overall container styling */
.media-upload {
  margin: 20px auto;
  padding: 20px;
  width: 90%;
  max-width: 800px;
  text-align: center;
  background-color: #f0f8ff;
  border-radius: 15px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

/* Project title styling */
.project-title {
  font-size: 28px;
  margin-bottom: 15px;
  color: #1e90ff;
}

/* Project description styling */
.project-description {
  font-size: 16px;
  margin-bottom: 20px;
  color: #333;
  line-height: 1.6;
}

/* GitHub link styling */
.github-link {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  color: #24292e;
  text-decoration: none;
  margin-bottom: 30px;
}

.github-link:hover {
  text-decoration: underline;
}

.github-logo {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

/* Upload section styling */
.upload-section {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
}

/* Upload heading styling */
.upload-section h2 {
  font-size: 22px;
  margin-bottom: 20px;
  color: #1e90ff;
}

/* Custom file input button styling */
.custom-file-input {
  position: relative;
}

.upload-btn {
  padding: 12px 25px;
  font-size: 16px;
  border: 2px solid #1e90ff;
  background-color: #fff;
  color: #1e90ff;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

/* Hover effect for upload button */
.upload-btn:hover {
  background-color: #1e90ff;
  color: #fff;
}

/* Processing message styling */
.processing-message {
  margin-top: 20px;
  font-size: 18px;
  color: #1e90ff;
}

/* Error message styling */
.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}
</style>