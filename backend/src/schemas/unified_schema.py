from typing import List, Dict, Any
from pydantic import BaseModel, Field


class UnifiedProcessingResponse(BaseModel):
    """Response model for unified audio processing results"""
    transcription: str = Field(..., description="Transcribed text from audio")
    summary: str = Field(..., description="Summarized text")
    original_audio_path: str = Field(..., description="Original audio file path")


