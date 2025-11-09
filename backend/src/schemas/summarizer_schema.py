from typing import Optional

from pydantic import BaseModel, Field


class SummarizerRequest(BaseModel):
    """Request model for Text-to-Summary"""

    text: str = Field(..., description="Vietnamese text to summarize")
    language: str = Field("vi", description="Language code")
    max_length: Optional[int] = Field(
        256, description="Maximum summary length"
    )
