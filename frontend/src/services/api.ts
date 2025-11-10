import axios, { AxiosResponse } from 'axios';
import {
  TranscriptionResponse,
  SummarizationResponse,
  UnifiedProcessingResponse,
  ErrorResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for large files
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

// API Endpoints
export const sttAPI = {
  transcribe: (file: File): Promise<AxiosResponse<TranscriptionResponse>> => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/stt/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  batchTranscribe: (files: File[]): Promise<AxiosResponse<TranscriptionResponse[]>> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    return api.post('/stt/batch-transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const summarizerAPI = {
  summarize: (text: string, maxLength?: number): Promise<AxiosResponse<SummarizationResponse>> => {
    return api.post('/summarizer/summarize', {
      text,
      max_length: maxLength,
      language: 'vi'
    });
  },

  summarizeForm: (text: string): Promise<AxiosResponse<SummarizationResponse>> => {
    return api.post('/summarizer/summarize-form', { text });
  },
};

export const unifiedAPI = {
  transcribeAndSummarize: (file: File): Promise<AxiosResponse<UnifiedProcessingResponse>> => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/unified/transcribe-and-summarize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Utility function to handle API errors
export const handleAPIError = (error: any): ErrorResponse => {
  if (error.response) {
    // Server responded with error status
    return error.response.data as ErrorResponse;
  } else if (error.request) {
    // Request was made but no response received
    return {
      detail: 'Network error. Please check your connection.',
      error_code: 'NETWORK_ERROR'
    };
  } else {
    // Something else happened
    return {
      detail: error.message || 'An unexpected error occurred',
      error_code: 'UNKNOWN_ERROR'
    };
  }
};

export default api;