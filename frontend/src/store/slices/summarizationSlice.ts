import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SummarizationResponse } from '../../types';

interface SummarizationState {
  summary: string | null;
  originalText: string;
  isLoading: boolean;
  error: string | null;
  maxLength: number;
  processingTime: number | null;
  history: Array<{
    id: string;
    originalText: string;
    summary: string;
    timestamp: number;
  }>;
}

const initialState: SummarizationState = {
  summary: null,
  originalText: '',
  isLoading: false,
  error: null,
  maxLength: 256,
  processingTime: null,
  history: [],
};

const summarizationSlice = createSlice({
  name: 'summarization',
  initialState,
  reducers: {
    setSummary: (state, action: PayloadAction<string>) => {
      state.summary = action.payload;
    },
    setOriginalText: (state, action: PayloadAction<string>) => {
      state.originalText = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMaxLength: (state, action: PayloadAction<number>) => {
      state.maxLength = action.payload;
    },
    setProcessingTime: (state, action: PayloadAction<number | null>) => {
      state.processingTime = action.payload;
    },
    addToHistory: (state, action: PayloadAction<{
      id: string;
      originalText: string;
      summary: string;
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
    resetSummarizationState: () => initialState,
  },
});

export const {
  setSummary,
  setOriginalText,
  setLoading,
  setError,
  setMaxLength,
  setProcessingTime,
  addToHistory,
  removeFromHistory,
  clearHistory,
  resetSummarizationState,
} = summarizationSlice.actions;

export default summarizationSlice.reducer;