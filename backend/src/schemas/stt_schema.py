from typing import Optional

from pydantic import BaseModel, Field

class STTResponse(BaseModel):
    """Response model for Speech-to-Text"""

    transcription: str = Field(..., description="Transcribed text")
    confidence: Optional[float] = Field(None, description="Confidence score")
    processing_time: Optional[float] = Field(
        None, description="Processing time in seconds"
    )
