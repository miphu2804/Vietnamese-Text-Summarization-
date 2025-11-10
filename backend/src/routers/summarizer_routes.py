import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from src.engine.summarizer import TextToSummarizer
from src.schemas.summarizer_schema import SummarizerRequest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/summarizer", tags=["text-to-summary"])
summarizer_service = TextToSummarizer()


@router.post("/summarize")
async def summarize_text(request: SummarizerRequest):
    """Summarize Vietnamese text using ViT5 model"""
    if not summarizer_service:
        raise HTTPException(status_code=503, detail="Summarizer service not available")

    try:
        summary = summarizer_service.summarize(request.text)

        logger.info(f"Summarization completed for text length: {len(request.text)}")
        return JSONResponse(
            content={"summary": summary, "original_text_length": len(request.text)}
        )

    except Exception as e:
        logger.error(f"Summarization error: {e}")
        raise HTTPException(status_code=500, detail=f"Summarization error: {str(e)}")


