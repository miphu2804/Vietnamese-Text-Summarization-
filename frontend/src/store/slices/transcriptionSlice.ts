import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TranscriptionResponse } from '../../types';

interface TranscriptionState {
  result: string | null;
  isLoading: boolean;
  error: string | null;
  processingTime: number | null;
  history: Array<{
    id: string;
    transcription: string;
    audioPath: string;
    timestamp: number;
  }>;
}

const initialState: TranscriptionState = {
  result: null,
  isLoading: false,
  error: null,
  processingTime: null,
  history: [],
};

const transcriptionSlice = createSlice({
  name: 'transcription',
  initialState,
  reducers: {
    setTranscriptionResult: (state, action: PayloadAction<string>) => {
      state.result = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProcessingTime: (state, action: PayloadAction<number | null>) => {
      state.processingTime = action.payload;
    },
    addToHistory: (state, action: PayloadAction<{
      id: string;
      transcription: string;
      audioPath: string;
      timestamp: number;
    }>) => {
      state.history.unshift(action.payload);
      // Keep only last 20 items
      if (state.history.length > 20) {
        state.history = state.history.slice(0, 20);
      }
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter(item => item.id !== action.payload);
    },
    clearHistory: (state) => {
      state.history = [];
    },
    resetTranscriptionState: () => initialState,
  },
});

export const {
  setTranscriptionResult,
  setLoading,
  setError,
  setProcessingTime,
  addToHistory,
  removeFromHistory,
  clearHistory,
  resetTranscriptionState,
} = transcriptionSlice.actions;

export default transcriptionSlice.reducer;