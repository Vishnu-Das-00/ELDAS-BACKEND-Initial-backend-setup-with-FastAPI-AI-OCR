from io import BytesIO

try:
    from PIL import Image
    import pytesseract
except ModuleNotFoundError:  # pragma: no cover - optional dependency until image OCR is needed
    Image = None
    pytesseract = None

from app.core.config import get_settings


class OCRService:
    def __init__(self) -> None:
        settings = get_settings()
        if settings.tesseract_cmd and pytesseract is not None:
            pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd

    def extract_text_from_bytes(self, content: bytes) -> str:
        if Image is None or pytesseract is None:
            raise RuntimeError("OCR dependencies are not installed.")
        image = Image.open(BytesIO(content))
        return pytesseract.image_to_string(image).strip()
