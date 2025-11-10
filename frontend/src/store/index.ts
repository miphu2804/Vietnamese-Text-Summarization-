import { configureStore } from '@reduxjs/toolkit';
import audioSlice from './slices/audioSlice';
import transcriptionSlice from './slices/transcriptionSlice';
import summarizationSlice from './slices/summarizationSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    audio: audioSlice,
    transcription: transcriptionSlice,
    summarization: summarizationSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;