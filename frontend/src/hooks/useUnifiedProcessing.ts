import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setTranscriptionResult,
  setLoading as setTranscriptionLoading,
  setError as setTranscriptionError,
  resetTranscriptionState,
} from '../store/slices/transcriptionSlice';
import {
  setSummary,
  setOriginalText,
  setLoading as setSummarizationLoading,
  setError as setSummarizationError,
  resetSummarizationState,
} from '../store/slices/summarizationSlice';
import { unifiedAPI, handleAPIError } from '../services/api';

interface ProcessingState {
  stage: 'idle' | 'transcribing' | 'summarizing' | 'completed' | 'error';
  progress: number;
  error: string | null;
}

export const useUnifiedProcessing = () => {
  const dispatch = useDispatch();
  const transcription = useSelector((state: RootState) => state.transcription);
  const summarization = useSelector((state: RootState) => state.summarization);

  const [processingState, setProcessingState] = useState<ProcessingState>({
    stage: 'idle',
    progress: 0,
    error: null,
  });

  const processAudio = useCallback(async (file: File) => {
    try {
      // Clear previous results immediately when a new file is selected
      dispatch(resetTranscriptionState());
      dispatch(resetSummarizationState());

      setProcessingState({
        stage: 'transcribing',
        progress: 0,
        error: null,
      });

      dispatch(setTranscriptionLoading(true));
      dispatch(setTranscriptionError(null));
      dispatch(setSummarizationLoading(false));
      dispatch(setSummarizationError(null));

      const startTime = Date.now();

      // Step 1: Transcribe
      const response = await unifiedAPI.transcribeAndSummarize(file);

      setProcessingState({
        stage: 'summarizing',
        progress: 50,
        error: null,
      });

      // Step 2: Update both states with results
      dispatch(setTranscriptionResult(response.data.transcription));
      dispatch(setSummary(response.data.summary));
      dispatch(setOriginalText(response.data.transcription));

      setProcessingState({
        stage: 'completed',
        progress: 100,
        error: null,
      });

    } catch (err) {
      const apiError = handleAPIError(err);
      setProcessingState({
        stage: 'error',
        progress: 0,
        error: apiError.detail,
      });

      dispatch(setTranscriptionError(apiError.detail));
      dispatch(setSummarizationError(apiError.detail));
    } finally {
      dispatch(setTranscriptionLoading(false));
      dispatch(setSummarizationLoading(false));
    }
  }, [dispatch]);

  const resetProcessing = useCallback(() => {
    setProcessingState({
      stage: 'idle',
      progress: 0,
      error: null,
    });
  }, []);

  return {
    transcription: transcription.result,
    summary: summarization.summary,
    processingState,
    isLoading: transcription.isLoading || summarization.isLoading,
    error: processingState.error || transcription.error || summarization.error,
    processAudio,
    resetProcessing,
  };
};
