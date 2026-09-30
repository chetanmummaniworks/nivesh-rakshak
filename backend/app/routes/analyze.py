from pathlib import Path
from tempfile import NamedTemporaryFile
from backend.app.ai.investigation import build_investigation
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from backend.app.services.verification import build_verification_items
from backend.app.services.ocr import extract_text_from_image
from backend.app.services.safety import build_before_you_pay
from backend.app.services.url_analysis import analyze_urls

router = APIRouter(prefix="/api", tags=["Analysis"])


class AnalyzeRequest(BaseModel):
    text: str


def analyze_text(text: str):
    signals = []
    lower_text = text.lower()

    # 1. Guaranteed returns / no-risk claims
    guaranteed_phrases = [
        "guaranteed return",
        "guaranteed profit",
        "guaranteed returns",
        "no risk",
        "risk free",
        "risk-free",
        "100% safe",
    ]

    if any(phrase in lower_text for phrase in guaranteed_phrases):
        signals.append({
            "type": "guaranteed_return",
            "severity": "high",
            "evidence": (
                "The message contains guaranteed-return or "
                "risk-free language."
            )
        })

    # 2. Urgency
    urgency_phrases = [
        "invest today",
        "act now",
        "limited time",
        "limited slots",
        "hurry",
        "immediately",
        "only this week",
    ]

    if any(phrase in lower_text for phrase in urgency_phrases):
        signals.append({
            "type": "urgency",
            "severity": "medium",
            "evidence": (
                "The message uses pressure or urgency "
                "to encourage quick action."
            )
        })

    # 3. Sensitive information
    sensitive_phrases = [
        "share otp",
        "send otp",
        "share password",
        "send password",
        "upi pin",
        "share pin",
        "send pin",
    ]

    if any(phrase in lower_text for phrase in sensitive_phrases):
        signals.append({
            "type": "sensitive_information",
            "severity": "high",
            "evidence": (
                "The message appears to request sensitive "
                "authentication information."
            )
        })

    # 4. Authority / approval claims
    authority_phrases = [
        "government approved",
        "govt approved",
        "sebi approved",
        "official scheme",
    ]

    if any(phrase in lower_text for phrase in authority_phrases):
        signals.append({
            "type": "authority_claim",
            "severity": "medium",
            "evidence": (
                "The message makes an authority or approval "
                "claim that should be independently verified."
            )
        })

    # Calculate overall risk
    if any(signal["severity"] == "high" for signal in signals):
        risk_level = "high"
    elif signals:
        risk_level = "medium"
    else:
        risk_level = "low"

    result = {
        "risk_level": risk_level,
        "summary": (
            "Multiple warning signals were detected."
            if len(signals) > 1
            else "A potential warning signal was detected."
            if signals
            else "No predefined warning signals were detected."
        ),
        "signals": signals,
        "safety_actions": [
            "Verify the sender independently.",
            "Do not share OTPs, passwords, PINs, or authentication information.",
            "Do not act under pressure or urgency.",
            "Verify important claims through trusted official sources."
        ]
    }

    investigation = build_investigation(text, signals)

    verification_items = build_verification_items(
      text,
      investigation.get("investigation", {}).get("claims", [])
)

    investigation["investigation"]["verification_items"] = (
     verification_items
)

    before_you_pay = build_before_you_pay(
    text,
    signals,
    verification_items
)

    url_analysis = analyze_urls(text)

    result.update(investigation)
    result.update(before_you_pay)
    result["url_analysis"] = url_analysis

    return result

# Text analysis endpoint
@router.post("/analyze")
def analyze_message(request: AnalyzeRequest):
    return analyze_text(request.text)


# Image analysis endpoint
@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file."
        )

    suffix = Path(file.filename or "image.jpg").suffix or ".jpg"
    temp_path = None

    try:
        with NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name

        # Step 1: OCR
        extracted_text = extract_text_from_image(temp_path)

        # Step 2: Risk analysis
        analysis = analyze_text(extracted_text)

        return {
            "filename": file.filename,
            "extracted_text": extracted_text,
            **analysis
        }

    finally:
        if temp_path:
            Path(temp_path).unlink(missing_ok=True)