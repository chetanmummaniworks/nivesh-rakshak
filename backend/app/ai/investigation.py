import json
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types


# ---------------------------------------------------------
# ENVIRONMENT
# ---------------------------------------------------------

BACKEND_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BACKEND_DIR / ".env"

load_dotenv(ENV_FILE)


# ---------------------------------------------------------
# GEMINI CONFIGURATION
# ---------------------------------------------------------

API_KEY = None

try:
    import os

    API_KEY = os.getenv("GEMINI_API_KEY")
except Exception:
    API_KEY = None


MODEL_NAME = "gemini-3.8-flash"

MAX_RETRIES = 2
RETRY_DELAYS = [1, 2]


# ---------------------------------------------------------
# INVESTIGATION SCHEMA
# ---------------------------------------------------------

INVESTIGATION_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {
            "type": "string",
        },
        "claims": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "claim": {"type": "string"},
                    "type": {"type": "string"},
                    "status": {"type": "string"},
                },
                "required": [
                    "claim",
                    "type",
                    "status",
                ],
            },
        },
        "evidence": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "text": {"type": "string"},
                    "reason": {"type": "string"},
                },
                "required": [
                    "text",
                    "reason",
                ],
            },
        },
        "verification_items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "category": {"type": "string"},
                    "claim": {"type": "string"},
                    "question": {"type": "string"},
                    "action": {"type": "string"},
                    "status": {"type": "string"},
                },
                "required": [
                    "category",
                    "claim",
                    "question",
                    "action",
                    "status",
                ],
            },
        },
        "patterns": {
            "type": "array",
            "items": {
                "type": "string",
            },
        },
        "uncertainty": {
            "type": "string",
        },
    },
    "required": [
        "summary",
        "claims",
        "evidence",
        "verification_items",
        "patterns",
        "uncertainty",
    ],
}


# ---------------------------------------------------------
# SYSTEM PROMPT
# ---------------------------------------------------------

SYSTEM_PROMPT = """
You are NiveshRakshak, an investor safety assistant.

Your job is to investigate potentially risky investment messages.

You are NOT a financial advisor.

You must NOT:
- recommend investments
- predict investment returns
- tell users what to buy or sell
- definitively declare that a message is a scam without sufficient evidence
- invent regulatory registrations or approvals

Instead:

1. Identify important claims made by the message.
2. Extract evidence directly from the provided text.
3. Explain why the evidence deserves attention.
4. Identify suspicious or risky patterns.
5. Explain what the user should independently verify.
6. Clearly communicate uncertainty.

Treat claims such as "SEBI approved", "government approved",
"guaranteed returns", or "official scheme" as CLAIMS that require
independent verification.

Do not treat a claim as proof that it is true.

Return ONLY valid JSON matching the provided schema.
"""


# ---------------------------------------------------------
# SAFE FALLBACK INVESTIGATION
# ---------------------------------------------------------

def build_fallback_investigation(signals: list) -> dict:
    """
    Build a useful structured investigation when Gemini is
    unavailable.

    This is deterministic safety analysis.

    It is intentionally marked ai_available=False so the
    application never pretends that an LLM generated it.
    """

    claims = []
    evidence = []
    patterns = []
    verification_items = []

    signal_types = {
        signal.get("type")
        for signal in signals
        if isinstance(signal, dict)
    }

    # -----------------------------------------------------
    # GUARANTEED RETURNS
    # -----------------------------------------------------

    if "guaranteed_return" in signal_types:

        claims.append({
            "claim": (
                "The message makes a guaranteed, assured, "
                "fixed-return, or risk-free financial claim."
            ),
            "type": "return_guarantee",
            "status": "unverified",
        })

        evidence.append({
            "text": "Guaranteed or risk-free return language detected.",
            "reason": (
                "The message presents a financial outcome as "
                "guaranteed or risk-free."
            ),
        })

        patterns.append(
            "Guaranteed or risk-free return claim"
        )

        verification_items.append({
            "category": "return_claim",
            "claim": (
                "A guaranteed or risk-free financial return "
                "is being claimed."
            ),
            "question": (
                "What evidence supports the claimed return?"
            ),
            "action": (
                "Do not treat guaranteed-return language as "
                "proof of safety. Independently verify the "
                "investment and its risks."
            ),
            "status": "warning",
        })

    # -----------------------------------------------------
    # AUTHORITY CLAIM
    # -----------------------------------------------------

    if "authority_claim" in signal_types:

        claims.append({
            "claim": (
                "The message claims approval, authorization, "
                "government backing, or official status."
            ),
            "type": "regulatory_approval",
            "status": "unverified",
        })

        evidence.append({
            "text": "Authority or approval claim detected.",
            "reason": (
                "The message presents an authority, regulatory, "
                "or government association that should be "
                "independently verified."
            ),
        })

        patterns.append(
            "Claim of regulatory or government endorsement "
            "without independently verified evidence"
        )

        verification_items.append({
            "category": "regulatory_approval",
            "claim": (
                "Regulatory or government approval is being claimed."
            ),
            "question": (
                "Is the claimed approval or authorization genuine?"
            ),
            "action": (
                "Independently verify the claim using the relevant "
                "official source rather than relying on the message."
            ),
            "status": "requires_verification",
        })

    # -----------------------------------------------------
    # PAYMENT REQUEST
    # -----------------------------------------------------

    if "payment_request" in signal_types:

        claims.append({
            "claim": (
                "The recipient is being asked to send money, "
                "make a payment, or transfer funds."
            ),
            "type": "payment_call_to_action",
            "status": "unverified",
        })

        evidence.append({
            "text": "Payment or money-transfer request detected.",
            "reason": (
                "The message asks the recipient to take a "
                "financial action involving transfer of funds."
            ),
        })

        patterns.append(
            "Direct request to transfer or send funds"
        )

        verification_items.append({
            "category": "payment",
            "claim": (
                "The message requests a payment or transfer."
            ),
            "question": (
                "Has the recipient and payment destination "
                "been independently verified?"
            ),
            "action": (
                "Pause before sending money. Independently "
                "verify the recipient and payment details."
            ),
            "status": "high_priority",
        })

    # -----------------------------------------------------
    # URGENCY
    # -----------------------------------------------------

    if "urgency" in signal_types:

        claims.append({
            "claim": (
                "The message pressures the recipient "
                "to act quickly."
            ),
            "type": "urgency",
            "status": "unverified",
        })

        evidence.append({
            "text": "Urgency or pressure language detected.",
            "reason": (
                "The message encourages quick action instead "
                "of allowing time for independent verification."
            ),
        })

        patterns.append(
            "Artificial urgency or pressure to act quickly"
        )

        verification_items.append({
            "category": "urgency",
            "claim": (
                "The message creates pressure to act quickly."
            ),
            "question": (
                "Can the decision safely wait for independent verification?"
            ),
            "action": (
                "Pause before acting and independently verify "
                "the sender, claims, and payment details."
            ),
            "status": "warning",
        })

    # -----------------------------------------------------
    # SENSITIVE INFORMATION
    # -----------------------------------------------------

    if "sensitive_information" in signal_types:

        claims.append({
            "claim": (
                "The message requests sensitive authentication "
                "or financial information."
            ),
            "type": "credential_request",
            "status": "unverified",
        })

        evidence.append({
            "text": (
                "Sensitive authentication or financial "
                "information request detected."
            ),
            "reason": (
                "The message appears to request information "
                "that should remain private."
            ),
        })

        patterns.append(
            "Request for sensitive authentication or financial information"
        )

        verification_items.append({
            "category": "sensitive_information",
            "claim": (
                "Sensitive authentication information is being requested."
            ),
            "question": (
                "Is the sender asking for information that "
                "should remain private?"
            ),
            "action": (
                "Do not share OTPs, passwords, PINs, CVVs, "
                "or other authentication information."
            ),
            "status": "high_priority",
        })

    # -----------------------------------------------------
    # SUMMARY
    # -----------------------------------------------------

    if signals:
        summary = (
            f"{len(signals)} safety warning signal(s) were detected. "
            "The automated investigation fallback identified "
            "claims and actions that should be independently verified "
            "before the user takes action."
        )
    else:
        summary = (
            "No predefined warning signals were detected. "
            "This does not establish that the message is safe."
        )

    # -----------------------------------------------------
    # UNCERTAINTY
    # -----------------------------------------------------

    uncertainty = (
        "The AI investigation service was temporarily unavailable. "
        "This report was generated using deterministic safety rules. "
        "The available text alone does not establish whether the "
        "message is genuine or fraudulent."
    )

    return {
        "investigation": {
            "summary": summary,
            "claims": claims,
            "evidence": evidence,
            "verification_items": verification_items,
            "patterns": patterns,
            "uncertainty": uncertainty,
        },
        "ai_available": False,
    }


# ---------------------------------------------------------
# GEMINI INVESTIGATION
# ---------------------------------------------------------

def build_investigation(
    text: str,
    signals: list,
) -> dict:

    if not text or not text.strip():
        return build_fallback_investigation(signals)

    if not API_KEY:
        return build_fallback_investigation(signals)

    try:
        client = genai.Client(
            api_key=API_KEY
        )
    except Exception:
        return build_fallback_investigation(signals)

    prompt = f"""
Analyze the following investment-related message.

MESSAGE:
{text}

DETERMINISTIC SAFETY SIGNALS:
{json.dumps(signals, indent=2)}

Use the deterministic signals as safety evidence,
but perform your own contextual investigation of the message.

Identify:
- important claims
- exact supporting evidence
- suspicious patterns
- what should be independently verified
- uncertainty and limitations

Do not declare fraud as a certainty.
Do not invent facts that are not present in the message.

Return JSON matching the requested schema.
"""

    for attempt in range(MAX_RETRIES + 1):

        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    response_schema=INVESTIGATION_SCHEMA,
                    temperature=0.1,
                ),
            )

            raw_text = response.text

            if not raw_text:
                raise ValueError(
                    "Gemini returned an empty response."
                )

            parsed = json.loads(raw_text)

            return {
                "investigation": parsed,
                "ai_available": True,
            }

        except Exception:

            if attempt < MAX_RETRIES:
                time.sleep(
                    RETRY_DELAYS[
                        min(
                            attempt,
                            len(RETRY_DELAYS) - 1,
                        )
                    ]
                )

    return build_fallback_investigation(signals)