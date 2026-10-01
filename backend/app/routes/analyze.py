import re
from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

from backend.app.ai.investigation import build_investigation
from backend.app.services.verification import build_verification_items
from backend.app.services.ocr import extract_text_from_image
from backend.app.services.safety import build_before_you_pay
from backend.app.services.url_analysis import analyze_urls


router = APIRouter(prefix="/api", tags=["Analysis"])


class AnalyzeRequest(BaseModel):
    text: str


def add_signal(
    signals: list,
    signal_type: str,
    severity: str,
    evidence: str,
):
    """
    Add a signal only once.
    """
    if any(
        signal["type"] == signal_type
        for signal in signals
    ):
        return

    signals.append({
        "type": signal_type,
        "severity": severity,
        "evidence": evidence,
    })


def contains_any(
    text: str,
    phrases: list[str],
) -> bool:
    return any(
        phrase in text
        for phrase in phrases
    )


def has_guaranteed_return_pattern(text: str) -> bool:
    """
    Detect guaranteed/fixed/risk-free financial return language
    even when a percentage or number appears between the words.

    Examples:
    - guaranteed 25% monthly returns
    - guaranteed 30 percent returns
    - guaranteed monthly profit
    - fixed 20% return
    - risk-free 15% profit
    """

    patterns = [
        r"\bguaranteed\b.{0,40}\b(return|returns|profit|profits|income|earnings)\b",
        r"\bguaranteed\b.{0,40}\b\d+(?:\.\d+)?\s*%\b",
        r"\bguaranteed\b.{0,40}\b\d+(?:\.\d+)?\s*percent\b",
        r"\bfixed\b.{0,40}\b(return|returns|profit|profits|income|earnings)\b",
        r"\bfixed\b.{0,40}\b\d+(?:\.\d+)?\s*%\b",
        r"\bassured\b.{0,40}\b(return|returns|profit|profits|income|earnings)\b",
        r"\brisk[- ]?free\b.{0,40}\b(return|returns|profit|profits|income|earnings)\b",
        r"\brisk[- ]?free\b.{0,40}\b\d+(?:\.\d+)?\s*%\b",
        r"\bno[- ]?risk\b.{0,40}\b(return|returns|profit|profits|income|earnings)\b",
        r"\bzero[- ]?risk\b.{0,40}\b(return|returns|profit|profits|income|earnings)\b",
    ]

    return any(
        re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )
        for pattern in patterns
    )


def merge_verification_items(
    ai_items: list,
    rule_items: list,
) -> list:
    """
    Combine AI and deterministic verification guidance.

    Deterministic safety guidance gets priority.
    AI provides additional contextual categories.
    """

    merged = []
    seen_categories = set()

    # Deterministic safety guidance first.
    for item in rule_items:
        if not isinstance(item, dict):
            continue

        category = str(
            item.get("category", "")
        ).strip().lower()

        if not category:
            continue

        if category in seen_categories:
            continue

        seen_categories.add(category)
        merged.append(item)

    # Add genuinely new AI categories.
    for item in ai_items:
        if not isinstance(item, dict):
            continue

        category = str(
            item.get("category", "")
        ).strip().lower()

        if not category:
            continue

        if category in seen_categories:
            continue

        seen_categories.add(category)
        merged.append(item)

    return merged


def analyze_text(text: str):
    signals = []
    lower_text = text.lower()

    # ---------------------------------------------------------
    # 1. GUARANTEED RETURN / NO-RISK CLAIMS
    # ---------------------------------------------------------

    guaranteed_phrases = [
        "guaranteed return",
        "guaranteed returns",
        "guaranteed profit",
        "guaranteed profits",
        "guaranteed income",
        "guaranteed earnings",
        "fixed return",
        "fixed returns",
        "fixed profit",
        "fixed profits",
        "risk free",
        "risk-free",
        "no risk",
        "zero risk",
        "100% safe",
        "100% guaranteed",
        "assured return",
        "assured returns",
        "assured profit",
        "assured profits",
    ]

    if (
        contains_any(
            lower_text,
            guaranteed_phrases,
        )
        or has_guaranteed_return_pattern(
            lower_text
        )
    ):
        add_signal(
            signals,
            "guaranteed_return",
            "high",
            (
                "The message contains guaranteed, assured, "
                "fixed-return, or risk-free language about "
                "a financial outcome."
            ),
        )

    # ---------------------------------------------------------
    # 2. URGENCY / PRESSURE
    # ---------------------------------------------------------

    urgency_phrases = [
        "invest today",
        "act now",
        "act immediately",
        "limited time",
        "limited slots",
        "limited offer",
        "limited period",
        "hurry",
        "immediately",
        "only today",
        "only this week",
        "last chance",
        "offer ends today",
        "offer expires today",
        "don't miss",
        "dont miss",
        "urgent",
        "do it now",
        "pay now",
        "transfer now",
        "send now",
    ]

    if contains_any(
        lower_text,
        urgency_phrases,
    ):
        add_signal(
            signals,
            "urgency",
            "medium",
            (
                "The message uses pressure or urgency "
                "to encourage quick action."
            ),
        )

    # ---------------------------------------------------------
    # 3. PAYMENT / MONEY TRANSFER REQUEST
    # ---------------------------------------------------------

    payment_phrases = [
        "send money",
        "send the money",
        "send the payment",
        "transfer money",
        "transfer the money",
        "transfer the payment",
        "pay now",
        "make payment",
        "make a payment",
        "payment now",
        "deposit now",
        "deposit money",
        "send payment",
        "pay immediately",
        "transfer immediately",
        "upi payment",
        "upi transfer",
        "bank transfer",
        "send funds",
        "transfer funds",
        "pay us",
        "pay today",
        "deposit today",
    ]

    if contains_any(
        lower_text,
        payment_phrases,
    ):
        add_signal(
            signals,
            "payment_request",
            "high",
            (
                "The message asks the recipient to send money, "
                "make a payment, or transfer funds."
            ),
        )

    # ---------------------------------------------------------
    # 4. SENSITIVE INFORMATION
    # ---------------------------------------------------------

    sensitive_phrases = [
        "share otp",
        "send otp",
        "provide otp",
        "give otp",
        "enter otp",
        "share password",
        "send password",
        "provide password",
        "share your password",
        "send your password",
        "upi pin",
        "share pin",
        "send pin",
        "provide pin",
        "share your pin",
        "send your pin",
        "share cvv",
        "send cvv",
        "share card details",
        "send card details",
        "share bank details",
        "send bank details",
    ]

    if contains_any(
        lower_text,
        sensitive_phrases,
    ):
        add_signal(
            signals,
            "sensitive_information",
            "high",
            (
                "The message appears to request sensitive "
                "authentication or financial information."
            ),
        )

    # ---------------------------------------------------------
    # 5. AUTHORITY / APPROVAL CLAIMS
    # ---------------------------------------------------------

    authority_phrases = [
        "government approved",
        "government-approved",
        "govt approved",
        "govt-approved",
        "government authorised",
        "government-authorised",
        "government authorized",
        "government-authorized",
        "govt authorised",
        "govt-authorised",
        "govt authorized",
        "govt-authorized",
        "sebi approved",
        "sebi-approved",
        "sebi authorised",
        "sebi-authorised",
        "sebi authorized",
        "sebi-authorized",
        "official scheme",
        "official investment scheme",
        "government scheme",
        "government backed",
        "government-backed",
    ]

    if contains_any(
        lower_text,
        authority_phrases,
    ):
        add_signal(
            signals,
            "authority_claim",
            "medium",
            (
                "The message makes an authority or approval "
                "claim that should be independently verified."
            ),
        )

    # ---------------------------------------------------------
    # 6. OVERALL RULE-BASED RISK
    # ---------------------------------------------------------

    if any(
        signal["severity"] == "high"
        for signal in signals
    ):
        risk_level = "high"

    elif any(
        signal["severity"] == "medium"
        for signal in signals
    ):
        risk_level = "medium"

    else:
        risk_level = "low"

    # ---------------------------------------------------------
    # 7. RULE-BASED SUMMARY
    # ---------------------------------------------------------

    if len(signals) >= 3:
        summary = (
            f"{len(signals)} warning signal(s) were detected. "
            "Review the evidence and independently verify "
            "important claims before taking action."
        )

    elif len(signals) == 2:
        summary = (
            "Multiple warning signals were detected. "
            "Review the evidence and verify important claims "
            "before taking action."
        )

    elif len(signals) == 1:
        summary = (
            "A potential warning signal was detected. "
            "Review the evidence and verify the relevant "
            "claim before taking action."
        )

    else:
        summary = (
            "No predefined warning signals were detected. "
            "This does not establish that the message is safe."
        )

    # ---------------------------------------------------------
    # 8. SAFETY ACTIONS
    # ---------------------------------------------------------

    safety_actions = [
        "Verify the sender independently.",
        "Do not act under pressure or urgency.",
        "Verify important claims through trusted official sources.",
    ]

    if any(
        signal["type"] == "payment_request"
        for signal in signals
    ):
        safety_actions.insert(
            1,
            "Pause before making a payment or transferring money.",
        )

    if any(
        signal["type"] == "sensitive_information"
        for signal in signals
    ):
        safety_actions.insert(
            1,
            "Do not share OTPs, passwords, PINs, or authentication information.",
        )

    if any(
        signal["type"] == "guaranteed_return"
        for signal in signals
    ):
        safety_actions.insert(
            1,
            "Do not treat guaranteed or risk-free return language as proof of safety.",
        )

    # ---------------------------------------------------------
    # 9. GEMINI INVESTIGATION
    # ---------------------------------------------------------

    investigation = build_investigation(
        text,
        signals,
    )

    investigation_data = investigation.get(
        "investigation",
        {},
    )

    # ---------------------------------------------------------
    # 10. DETERMINISTIC VERIFICATION
    # ---------------------------------------------------------

    rule_verification_items = build_verification_items(
        text,
        investigation_data.get(
            "claims",
            [],
        ),
    )

    # ---------------------------------------------------------
    # 11. AI + RULE VERIFICATION FUSION
    # ---------------------------------------------------------

    ai_verification_items = investigation_data.get(
        "verification_items",
        [],
    )

    merged_verification_items = merge_verification_items(
        ai_verification_items,
        rule_verification_items,
    )

    investigation_data["verification_items"] = (
        merged_verification_items
    )

    investigation["investigation"] = investigation_data

    # ---------------------------------------------------------
    # 12. BEFORE YOU PAY
    # ---------------------------------------------------------

    before_you_pay = build_before_you_pay(
        text,
        signals,
        merged_verification_items,
    )

    # ---------------------------------------------------------
    # 13. URL ANALYSIS
    # ---------------------------------------------------------

    url_analysis = analyze_urls(text)

    # ---------------------------------------------------------
    # 14. FINAL RESPONSE
    # ---------------------------------------------------------

    result = {
        "risk_level": risk_level,
        "summary": summary,
        "signals": signals,
        "safety_actions": safety_actions,
    }

    result.update(investigation)
    result.update(before_you_pay)
    result["url_analysis"] = url_analysis

    return result


# -------------------------------------------------------------
# TEXT ANALYSIS ENDPOINT
# -------------------------------------------------------------

@router.post("/analyze")
def analyze_message(request: AnalyzeRequest):
    return analyze_text(request.text)


# -------------------------------------------------------------
# IMAGE ANALYSIS ENDPOINT
# -------------------------------------------------------------

@router.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(...),
):

    if (
        not file.content_type
        or not file.content_type.startswith("image/")
    ):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file.",
        )

    suffix = (
        Path(
            file.filename or "image.jpg"
        ).suffix
        or ".jpg"
    )

    temp_path = None

    try:
        with NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:

            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name

        extracted_text = extract_text_from_image(
            temp_path
        )

        analysis = analyze_text(
            extracted_text
        )

        return {
            "filename": file.filename,
            "extracted_text": extracted_text,
            **analysis,
        }

    finally:
        if temp_path:
            Path(temp_path).unlink(
                missing_ok=True
            )