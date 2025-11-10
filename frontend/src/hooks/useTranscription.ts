import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setTranscriptionResult,
  setLoading,
  setError,
  setProcessingTime,
  addToHistory
} from '../store/slices/transcriptionSlice';
import { sttAPI, handleAPIError } from '../services/api';

export const useTranscription = () => {
  const dispatch = useDispatch();
  const { result, isLoading, error, history } = useSelector(
    (state: RootState) => state.transcription
  );

  const transcribeAudio = useCallback(async (file: File) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const startTime = Date.now();

      const response = await sttAPI.transcribe(file);
      const processingTime = Date.now() - startTime;

      dispatch(setTranscriptionResult(response.data.transcription));
      dispatch(setProcessingTime(processingTime));

      // Add to history
      dispatch(addToHistory({
        id: Date.now().toString(),
        transcription: response.data.transcription,
        audioPath: response.data.original_audio_path,
        timestamp: Date.now(),
      }));

    } catch (err) {
      const apiError = handleAPIError(err);
      dispatch(setError(apiError.detail));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const batchTranscribe = useCallback(async (files: File[]) => {
    // Implementation for batch transcription
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const startTime = Date.now();

      const response = await sttAPI.batchTranscribe(files);
      const processingTime = Date.now() - startTime;

      // Handle batch results
      response.data.forEach((result, index) => {
        dispatch(addToHistory({
          id: `${Date.now()}-${index}`,
          transcription: result.transcription,
          audioPath: result.original_audio_path,
          timestamp: Date.now(),
        }));
      });

      dispatch(setProcessingTime(processingTime));

    } catch (err) {
      const apiError = handleAPIError(err);
      dispatch(setError(apiError.detail));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const resetTranscription = useCallback(() => {
    dispatch(setTranscriptionResult(''));
    dispatch(setError(null));
    dispatch(setProcessingTime(null));
  }, [dispatch]);

  return {
    transcription: result,
    isLoading,
    error,
    history,
    transcribeAudio,
    batchTranscribe,
    resetTranscription,
  };
};