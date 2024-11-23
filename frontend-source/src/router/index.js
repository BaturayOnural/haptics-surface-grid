// Contributor(s): Erhan Baturay Onural, Jihong Zhang
// Jihong Zhang: Developed media upload and video playback routes
// Erhan Baturay Onural: Developed image playback route
import { createRouter, createWebHistory } from 'vue-router';
import MediaUpload from '../components/MediaUpload.vue';
import VideoPlayback from '../components/VideoPlayback.vue';
import ImagePlayback from '../components/ImagePlayback.vue';

const routes = [
  {
    path: '/',
    name: 'MediaUpload',
    component: MediaUpload,
  },
  {
    path: '/video-playback',
    name: 'VideoPlayback',
    component: VideoPlayback,
  },
  {
    path: '/image-playback',
    name: 'ImagePlayback',
    component: ImagePlayback,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;