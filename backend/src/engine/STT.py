import logging

from chunkformer import ChunkFormerModel
from pydub import AudioSegment

from src.app_config import app_config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SpeechToText:
    def __init__(self, model_name: str = app_config.STT_MODEL_NAME):
        self.model_name = model_name
        self.model = ChunkFormerModel.from_pretrained(self.model_name)

    def convert_to_wav(self, input_path, output_path=None):
        if output_path is None:
            output_path = input_path.rsplit(".", 1)[0] + ".wav"

        audio = AudioSegment.from_file(input_path)
        audio = audio.set_frame_rate(16000).set_channels(1)
        audio.export(output_path, format="wav")
        return output_path

    def transcribe(
        self,
        audio_path: str,
        chunk_size: int = 64,
        left_context_size: int = 128,
        right_context_size: int = 128,
        total_batch_duration: int = 14400,
        return_timestamps: bool = False,
    ) -> str:
        """
        Convert audio file to Vietnamese text using ChunkFormer
        """
        try:
            logger.info(f"Transcribing audio file: {audio_path}")

            transcription = self.model.endless_decode(
                audio_path=audio_path,
                chunk_size=chunk_size,
                left_context_size=left_context_size,
                right_context_size=right_context_size,
                total_batch_duration=total_batch_duration,
                return_timestamps=return_timestamps,
            )

            logger.info(f"Transcription completed: '{transcription}'")
            return transcription

        except Exception as e:
            logger.error(f"Error in transcription: {e}")
            raise

    def batch_transcribe(
        self,
        audio_paths: list,
        chunk_size: int = 64,
        left_context_size: int = 128,
        right_context_size: int = 128,
        total_batch_duration: int = 1800,
    ) -> list:
        """
        Batch transcribe multiple audio files
        """
        try:
            logger.info(f"Batch transcribing {len(audio_paths)} audio files")

            transcriptions = self.model.batch_decode(
                audio_paths=audio_paths,
                chunk_size=chunk_size,
                left_context_size=left_context_size,
                right_context_size=right_context_size,
                total_batch_duration=total_batch_duration,
            )

            logger.info(
                f"Batch transcription completed for {len(transcriptions)} files"
            )
            return transcriptions

        except Exception as e:
            logger.error(f"Error in batch transcription: {e}")
            raise

