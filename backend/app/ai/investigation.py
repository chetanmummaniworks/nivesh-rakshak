import json
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
import logging

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


def build_fallback_investigation(
    signals: list,
    text: str = "",
) -> dict:
    """Build a deterministic investigation with message-specific evidence."""

    claims = []
    evidence = []
    patterns = []
    verification_items = []

    signal_types = {
        signal.get("type")
        for signal in signals
        if isinstance(signal, dict)
    }

    lower_text = text.lower()

    evidence_phrases = {
        "guaranteed_return": [
            "guaranteed returns",
            "guaranteed return",
            "guaranteed profits",
            "guaranteed profit",
            "guaranteed income",
            "guaranteed earnings",
            "fixed returns",
            "fixed return",
            "risk-free",
            "risk free",
            "no risk",
            "zero risk",
            "assured returns",
            "assured return",
            "assured profits",
            "assured profit",
        ],
        "authority_claim": [
            "sebi approved",
            "government approved",
            "official scheme",
            "government backed",
            "government-backed",
            "authorized by",
            "authorised by",
        ],
        "payment_request": [
            "send money",
            "send the money",
            "send payment",
            "transfer money",
            "transfer funds",
            "send funds",
            "pay now",
            "pay today",
            "deposit now",
            "upi payment",
            "upi transfer",
            "bank transfer",
        ],
        "urgency": [
            "act now",
            "act immediately",
            "limited time",
            "limited slots",
            "last chance",
            "only today",
            "send money today",
            "secure your profit",
            "act fast",
            "right away",
            "before it's too late",
            "don't wait",
            "dont wait",
        ],
    }

    def matching_evidence(signal_type):
        matches = []
        for phrase in evidence_phrases.get(signal_type, []):
            start = 0
            while True:
                index = lower_text.find(phrase, start)
                if index == -1:
                    break

                original_phrase = text[index:index + len(phrase)]
                if original_phrase not in matches:
                    matches.append(original_phrase)

                start = index + len(phrase)

        return matches

    def add_evidence(signal_type, fallback_text, reason):
        matches = matching_evidence(signal_type)
        evidence.append({
            "text": "; ".join(matches) if matches else fallback_text,
            "reason": reason,
        })

    if "guaranteed_return" in signal_types:
        claims.append({
            "claim": "The message makes a guaranteed or risk-free financial claim.",
            "type": "return_guarantee",
            "status": "unverified",
        })
        add_evidence(
            "guaranteed_return",
            "Guaranteed or risk-free return language detected.",
            "Investment returns are uncertain, so a guarantee deserves independent scrutiny.",
        )
        patterns.append("Guaranteed or risk-free return claim")
        verification_items.append({
            "category": "return_claim",
            "claim": "A guaranteed or risk-free return is being claimed.",
            "question": "What evidence supports the claimed return?",
            "action": "Independently verify the provider, product, terms and stated risks.",
            "status": "warning",
        })

    if "authority_claim" in signal_types:
        claims.append({
            "claim": "The message claims approval, authorization or official status.",
            "type": "regulatory_approval",
            "status": "unverified",
        })
        add_evidence(
            "authority_claim",
            "An authority or approval claim was detected.",
            "A statement of approval in a message does not independently establish that the approval is genuine.",
        )
        patterns.append("Claim of regulatory or government endorsement")
        verification_items.append({
            "category": "regulatory_approval",
            "claim": "Regulatory or government approval is being claimed.",
            "question": "Can the claimed approval be confirmed through an official source?",
            "action": "Check the relevant regulator's official website independently.",
            "status": "requires_verification",
        })

    if "loan_advance_fee" in signal_types:
        claims.append({
            "claim": "The message contains a loan offer or approval claim, possibly linked to a fee.",
            "type": "loan_offer_or_fee",
            "status": "unverified",
        })
        loan_evidence = []
        for phrase in [
            "loan approved", "approved for a loan", "you got a loan",
            "you have been approved for a loan",
            "congratulations you got a loan", "instant loan approved",
            "pre-approved loan", "preapproved loan", "processing fee",
            "advance fee", "upfront fee", "pay a fee", "release fee",
            "disbursement fee", "pay to receive the loan", "pay to get the loan",
            "pay before receiving the loan",
        ]:
            start = 0
            while True:
                index = lower_text.find(phrase, start)
                if index < 0:
                    break
                match = text[index:index + len(phrase)]
                if match not in loan_evidence:
                    loan_evidence.append(match)
                start = index + len(phrase)

        evidence.append({
            "text": "; ".join(loan_evidence) if loan_evidence else "Loan offer or fee-related wording detected.",
            "reason": (
                "An unexpected loan offer combined with a fee request deserves careful verification. "
                "This wording alone does not prove fraud."
            ),
        })
        patterns.append("Loan offer or possible advance-fee request")
        verification_items.append({
            "category": "loan_offer",
            "claim": "A loan offer or approval is being presented.",
            "question": "Did you apply for this loan, and can the lender and terms be verified independently?",
            "action": "Contact the lender using contact details obtained independently. Review the written interest rate, fees and repayment terms; do not pay an unexpected fee to release a loan.",
            "status": "high_priority",
        })

    if "loan_terms_claim" in signal_types:
        claims.append({
            "claim": "The message advertises zero-interest or unusually favorable loan terms.",
            "type": "loan_terms",
            "status": "unverified",
        })
        matching_terms = [
            text[index:index + len(phrase)]
            for phrase in ["zero interest", "zero percent interest", "0% interest", "free loan"]
            for index in [lower_text.find(phrase)]
            if index >= 0
        ]
        evidence.append({
            "text": "; ".join(dict.fromkeys(matching_terms)) or "Unusually favorable loan terms detected.",
            "reason": "Check the full written terms, fees and lender identity; promotional wording alone does not establish the true cost.",
        })
        patterns.append("Unusually favorable loan terms")
        verification_items.append({
            "category": "loan_terms",
            "claim": "The loan is advertised as zero-interest or free.",
            "question": "Are all fees, penalties and repayment terms clearly stated in the lender's official documents?",
            "action": "Verify the lender and calculate the total repayment from written terms before accepting.",
            "status": "warning",
        })

    if "payment_request" in signal_types:
        claims.append({
            "claim": "The message asks the recipient to send money or transfer funds.",
            "type": "payment_call_to_action",
            "status": "unverified",
        })
        add_evidence(
            "payment_request",
            "A payment or money-transfer request was detected.",
            "The requested transfer creates a financial action that should be checked before proceeding.",
        )
        patterns.append("Direct request to transfer or send funds")
        verification_items.append({
            "category": "payment",
            "claim": "The message requests a payment or transfer.",
            "question": "Have the recipient and payment destination been independently verified?",
            "action": "Pause before sending money and verify the recipient through a separate trusted channel.",
            "status": "high_priority",
        })

    if "urgency" in signal_types:
        claims.append({
            "claim": "The message pressures the recipient to act quickly.",
            "type": "urgency",
            "status": "unverified",
        })
        add_evidence(
            "urgency",
            "Urgency or pressure language was detected.",
            "Pressure to act quickly can make it harder to review a claim carefully.",
        )
        patterns.append("Urgency or pressure to act quickly")
        verification_items.append({
            "category": "urgency",
            "claim": "The message creates pressure to act quickly.",
            "question": "Can the decision wait until the claims are independently checked?",
            "action": "Do not let a deadline prevent independent verification.",
            "status": "warning",
        })

    if "sensitive_information" in signal_types:
        claims.append({
            "claim": "The message may request sensitive authentication or financial information.",
            "type": "credential_request",
            "status": "unverified",
        })
        add_evidence(
            "sensitive_information",
            "A sensitive-information request was detected.",
            "Authentication details should not be shared with an unverified sender.",
        )
        patterns.append("Request for sensitive authentication or financial information")
        verification_items.append({
            "category": "sensitive_information",
            "claim": "Sensitive authentication information may be requested.",
            "question": "Is the sender asking for information that should remain private?",
            "action": "Never share OTPs, passwords, PINs or CVVs with an unverified person.",
            "status": "high_priority",
        })

    summary = (
        f"{len(signals)} safety warning signal(s) were detected. "
        "Review the evidence and verify the claims independently."
        if signals
        else "No predefined warning signals were detected. This does not establish that the message is safe."
    )

    uncertainty = (
        "The AI investigation service was unavailable. This report uses deterministic safety rules. "
        "The available text does not establish whether the message is genuine or fraudulent."
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

    # These signals already have deterministic, message-grounded guidance.
    # Return it immediately so users do not wait for a generative call for core safety advice.
    fast_safety_types = {
        "loan_advance_fee",
        "loan_terms_claim",
        "payment_request",
        "sensitive_information",
        "guaranteed_return",
    }
    if any(
        isinstance(signal, dict) and signal.get("type") in fast_safety_types
        for signal in signals
    ):
        return build_fallback_investigation(signals, text)

    try:
        client = genai.Client(api_key=API_KEY)
    except Exception as exc:
        logging.warning(
            "Could not initialize Gemini client: %s",
            exc,
        )
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

        except Exception as exc:
            error_text = str(exc)
            error_upper = error_text.upper()

            # Immediately fall back for quota exhaustion or
            # temporary Gemini service unavailability.
            is_quota_error = (
                "429" in error_text
                or "RESOURCE_EXHAUSTED" in error_upper
            )

            is_unavailable = (
                "503" in error_text
                or "UNAVAILABLE" in error_upper
            )

            if is_quota_error or is_unavailable:
                logging.warning(
                    "Gemini quota exhausted or service unavailable; "
                    "using deterministic fallback."
                )
                return build_fallback_investigation(signals)

            logging.warning(
                "Gemini investigation failed (attempt %s/%s): %s",
                attempt + 1,
                MAX_RETRIES + 1,
                error_text,
            )

            if attempt < MAX_RETRIES:
                time.sleep(
                    RETRY_DELAYS[
                        min(attempt, len(RETRY_DELAYS) - 1)
                    ]
                )

    return build_fallback_investigation(signals)
