import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioFile } from '../../types';

interface AudioState {
  currentFile: AudioFile | null;
  uploadProgress: number;
  isUploading: boolean;
  uploadError: string | null;
  queue: AudioFile[];
}

const initialState: AudioState = {
  currentFile: null,
  uploadProgress: 0,
  isUploading: false,
  uploadError: null,
  queue: [],
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setCurrentFile: (state, action: PayloadAction<AudioFile | null>) => {
      state.currentFile = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    setUploadError: (state, action: PayloadAction<string | null>) => {
      state.uploadError = action.payload;
    },
    addToQueue: (state, action: PayloadAction<AudioFile>) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action: PayloadAction<number>) => {
      state.queue.splice(action.payload, 1);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    resetAudioState: () => initialState,
  },
});

export const {
  setCurrentFile,
  setUploadProgress,
  setUploading,
  setUploadError,
  addToQueue,
  removeFromQueue,
  clearQueue,
  resetAudioState,
} = audioSlice.actions;

export default audioSlice.reducer;