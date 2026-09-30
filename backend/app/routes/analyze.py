from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["Analysis"])


class AnalyzeRequest(BaseModel):
    text: str


@router.post("/analyze")
def analyze_message(request: AnalyzeRequest):
    text = request.text

    signals = []

    lower_text = text.lower()

    # Guaranteed-return signal
    guaranteed_phrases = [
        "guaranteed return",
        "guaranteed profit",
        "guaranteed returns",
        "no risk",
        "risk free",
        "risk-free",
    ]

    if any(phrase in lower_text for phrase in guaranteed_phrases):
        signals.append({
            "type": "guaranteed_return",
            "severity": "high",
            "evidence": "The message contains guaranteed-return or risk-free language."
        })

    # Urgency signal
    urgency_phrases = [
        "invest today",
        "act now",
        "limited time",
        "limited slots",
        "hurry",
        "immediately",
    ]

    if any(phrase in lower_text for phrase in urgency_phrases):
        signals.append({
            "type": "urgency",
            "severity": "medium",
            "evidence": "The message uses pressure or urgency to encourage quick action."
        })

    # Sensitive-information signal
    sensitive_phrases = [
        "share otp",
        "send otp",
        "share password",
        "send password",
        "pin",
        "upi pin",
    ]

    if any(phrase in lower_text for phrase in sensitive_phrases):
        signals.append({
            "type": "sensitive_information",
            "severity": "high",
            "evidence": "The message appears to request sensitive authentication information."
        })

    if any(signal["severity"] == "high" for signal in signals):
        risk_level = "high"
    elif signals:
        risk_level = "medium"
    else:
        risk_level = "low"

    return {
        "risk_level": risk_level,
        "summary": (
            "Multiple warning signals were detected."
            if signals
            else "No predefined warning signals were detected."
        ),
        "signals": signals,
        "safety_actions": [
            "Verify the sender independently.",
            "Do not share OTPs, passwords, PINs, or other authentication information.",
            "Do not act under pressure.",
            "Verify important claims through trusted official sources."
        ]
    }