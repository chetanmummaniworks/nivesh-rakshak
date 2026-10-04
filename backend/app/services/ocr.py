import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types


# Load local .env during development.
# Render will use its environment variables directly.
BACKEND_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BACKEND_DIR / ".env"
load_dotenv(ENV_FILE)

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")


def extract_text_from_image(image_path: str) -> str:
    """
    Extract readable text from an uploaded image using Gemini vision.

    This replaces EasyOCR so the backend does not need to load
    PyTorch/CUDA/EasyOCR and can run within Render's memory limit.
    """

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured on the server."
        )

    image_path = Path(image_path)

    if not image_path.exists():
        raise RuntimeError("Uploaded image could not be found.")

    mime_type = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
    }.get(image_path.suffix.lower(), "image/jpeg")

    try:
        image_bytes = image_path.read_bytes()

        client = genai.Client(api_key=api_key)

        prompt = """
Extract all readable text from this image.

This may be an Indian financial, investment, banking, loan,
UPI, or scam-related message.

Requirements:
- Preserve the original wording as closely as possible.
- Include English text.
- Include Hindi/Devanagari text when present.
- Preserve numbers, percentages, URLs, phone numbers, names,
  bank names, UPI IDs, and important financial terms.
- Do not summarize.
- Do not analyze whether it is a scam.
- Return ONLY the extracted text.
- If no readable text exists, return an empty string.
"""

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type,
                ),
                prompt,
            ],
        )

        extracted_text = (response.text or "").strip()

        return extracted_text

    except Exception as exc:
        raise RuntimeError(
            f"Image text extraction failed: {exc}"
        ) from exc