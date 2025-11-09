import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from src.app_config import app_config

class TextToSummarizer:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(app_config.TTS_MODEL_NAME)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(
            app_config.TTS_MODEL_NAME
        )
        self.load_device()

    def load_device(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)

    def summarize(self, text: str) -> str:
        sentence = text + "</s>"
        encoding = self.tokenizer(sentence, return_tensors="pt")
        input_ids, attention_masks = encoding["input_ids"].to(self.device), encoding[
            "attention_mask"
        ].to(self.device)
        outputs = self.model.generate(
            input_ids=input_ids,
            attention_mask=attention_masks,
            max_length=256,
            early_stopping=True,
        )
        summary = ""
        for output in outputs:
            line = self.tokenizer.decode(
                output, skip_special_tokens=True, clean_up_tokenization_spaces=True
            )
            print(line)
            summary += line + " "
        return summary.strip()
