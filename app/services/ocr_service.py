from io import BytesIO

from PIL import Image
import pytesseract

from app.core.config import get_settings


class OCRService:
    def __init__(self) -> None:
        settings = get_settings()
        if settings.tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd

    def extract_text_from_bytes(self, content: bytes) -> str:
        image = Image.open(BytesIO(content))
        return pytesseract.image_to_string(image).strip()
