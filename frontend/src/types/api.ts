export interface TranscriptionResponse {
  transcription: string;
  original_audio_path: string;
}

export interface SummarizationResponse {
  summary: string;
  original_text_length: number;
}

export interface UnifiedProcessingResponse {
  transcription: string;
  summary: string;
  original_audio_path: string;
}

export interface ErrorResponse {
  detail: string;
  error_code?: string;
  timestamp?: string;
}

export interface ProcessingStatus {
  status: 'idle' | 'loading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

export interface AudioFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}