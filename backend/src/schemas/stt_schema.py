from typing import Optional

from pydantic import BaseModel, Field


class STTRequest(BaseModel):
    """Request model for Speech-to-Text"""

    model_path: Optional[str] = Field(None, description="Optional path to local model")
    sample_rate: Optional[int] = Field(16000, description="Audio sample rate")


class STTResponse(BaseModel):
    """Response model for Speech-to-Text"""

    transcription: str = Field(..., description="Transcribed text")
    confidence: Optional[float] = Field(None, description="Confidence score")
    processing_time: Optional[float] = Field(
        None, description="Processing time in seconds"
    )
