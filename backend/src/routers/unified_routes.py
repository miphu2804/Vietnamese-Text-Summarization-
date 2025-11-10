import logging
import tempfile
from fastapi import APIRouter, HTTPException, UploadFile, File
from src.unified_service import UnifiedService
from src.schemas.unified_schema import UnifiedProcessingResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/unified", tags=["unified-processing"])


@router.post("/transcribe-and-summarize", response_model=UnifiedProcessingResponse)
async def transcribe_and_summarize(file: UploadFile = File(...)):
    """Complete pipeline: Transcribe audio to text and then summarize"""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name

        try:
            result = UnifiedService().transcribe_and_summarize(tmp_file_path)

            return UnifiedProcessingResponse(
                transcription=result["transcription"],
                summary=result["summary"],
                original_audio_path=result["original_audio_path"]
            )

        finally:
            import os
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)

    except Exception as e:
        logger.error(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")