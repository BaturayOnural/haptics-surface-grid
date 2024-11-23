// Contributor(s): Erhan Baturay Onural, Jihong Zhang
// Jihong Zhang: Made initial store structure for video type inputs
// Erhan Baturay Onural: Extended initial store structure to handle both video and image type inputs
import { createStore } from 'vuex';

const store = createStore({
  state: {
    mediaFilename: '', // Name of the uploaded media file
    dataFilename: '', // Name of the generated intensity data file
  },
  mutations: {
    setMediaFilename(state, filename) {
      state.mediaFilename = filename;
    },
    setDataFilename(state, filename) {
      state.dataFilename = filename;
    },
  },
  actions: {
    // No actions needed for now
  },
  getters: {
    getMediaFilename: (state) => state.mediaFilename,
    getDataFilename: (state) => state.dataFilename,
  },
});

export default store;