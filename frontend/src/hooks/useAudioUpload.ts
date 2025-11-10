import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setCurrentFile,
  setUploadProgress,
  setUploading,
  setUploadError,
  addToQueue
} from '../store/slices/audioSlice';
import { AudioFile } from '../types';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = [
  'audio/wav',
  'audio/mpeg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/ogg',
  'audio/flac',
  'video/mp4',
  'video/x-msvideo',
];

export const useAudioUpload = () => {
  const dispatch = useDispatch();
  const { currentFile, uploadProgress, isUploading, uploadError } = useSelector(
    (state: RootState) => state.audio
  );

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 100MB limit';
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Unsupported file type. Please upload audio files.';
    }

    return null;
  }, []);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const error = validateFile(file);

    if (error) {
      dispatch(setUploadError(error));
      return;
    }

    const audioFile: AudioFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    };

    dispatch(setCurrentFile(audioFile));
    dispatch(setUploadError(null));
  }, [validateFile, dispatch]);

  const simulateUploadProgress = useCallback(() => {
    dispatch(setUploading(true));
    dispatch(setUploadProgress(0));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        dispatch(setUploading(false));
      }
      dispatch(setUploadProgress(Math.round(progress)));
    }, 200);

    return () => clearInterval(interval);
  }, [dispatch]);

  const addToProcessingQueue = useCallback((file: AudioFile) => {
    dispatch(addToQueue(file));
  }, [dispatch]);

  const resetUpload = useCallback(() => {
    dispatch(setCurrentFile(null));
    dispatch(setUploadProgress(0));
    dispatch(setUploading(false));
    dispatch(setUploadError(null));
  }, [dispatch]);

  return {
    currentFile,
    uploadProgress,
    isUploading,
    uploadError,
    handleFileSelect,
    simulateUploadProgress,
    addToProcessingQueue,
    resetUpload,
  };
};