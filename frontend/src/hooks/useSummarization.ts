import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setSummary,
  setOriginalText,
  setLoading,
  setError,
  setProcessingTime,
  addToHistory,
  setMaxLength,
} from '../store/slices/summarizationSlice';
import { summarizerAPI, handleAPIError } from '../services/api';

export const useSummarization = () => {
  const dispatch = useDispatch();
  const {
    summary,
    originalText,
    isLoading,
    error,
    maxLength,
    history
  } = useSelector((state: RootState) => state.summarization);

  const summarizeText = useCallback(async (text: string, maxLen?: number) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      dispatch(setOriginalText(text));

      const startTime = Date.now();

      const response = await summarizerAPI.summarize(text, maxLen || maxLength);
      const processingTime = Date.now() - startTime;

      dispatch(setSummary(response.data.summary));
      dispatch(setProcessingTime(processingTime));

      // Add to history
      dispatch(addToHistory({
        id: Date.now().toString(),
        originalText: text,
        summary: response.data.summary,
        timestamp: Date.now(),
      }));

    } catch (err) {
      const apiError = handleAPIError(err);
      dispatch(setError(apiError.detail));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, maxLength]);

  const summarizeForm = useCallback(async (text: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      dispatch(setOriginalText(text));

      const startTime = Date.now();

      const response = await summarizerAPI.summarizeForm(text);
      const processingTime = Date.now() - startTime;

      dispatch(setSummary(response.data.summary));
      dispatch(setProcessingTime(processingTime));

    } catch (err) {
      const apiError = handleAPIError(err);
      dispatch(setError(apiError.detail));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const setMaxLengthValue = useCallback((length: number) => {
    dispatch(setMaxLength(length));
  }, [dispatch]);

  const resetSummarization = useCallback(() => {
    dispatch(setSummary(''));
    dispatch(setOriginalText(''));
    dispatch(setError(null));
    dispatch(setProcessingTime(null));
  }, [dispatch]);

  return {
    summary,
    originalText,
    isLoading,
    error,
    maxLength,
    history,
    summarizeText,
    summarizeForm,
    setMaxLengthValue,
    resetSummarization,
  };
};
