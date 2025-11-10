from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class UnifiedProcessingResponse(BaseModel):
    """Response model for unified audio processing results"""
    transcription: str = Field(..., description="Transcribed text from audio")
    summary: str = Field(..., description="Summarized text")
    original_audio_path: str = Field(..., description="Original audio file path")


class BatchProcessingResponse(BaseModel):
    """Response model for batch processing results"""
    results: List[Dict[str, Any]] = Field(..., description="Processing results for each file")
    total_files: int = Field(..., description="Total number of files processed")
    successful_files: int = Field(..., description="Number of successfully processed files")


class TextSummarizationRequest(BaseModel):
    """Request model for text-only summarization"""
    text: str = Field(..., min_length=10, description="Text to summarize")
    max_length: Optional[int] = Field(256, description="Maximum summary length")


class TextSummarizationResponse(BaseModel):
    """Response model for text summarization results"""
    summary: str = Field(..., description="Summarized text")
    original_text_length: int = Field(..., description="Length of original text")


class TranscriptionOnlyResponse(BaseModel):
    """Response model for transcription-only results"""
    transcription: str = Field(..., description="Transcribed text from audio")
    original_audio_path: str = Field(..., description="Original audio file path")