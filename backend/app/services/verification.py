def build_verification_items(text: str, claims: list) -> list:
    """
    Build safe, actionable verification guidance from detected claims.

    Important:
    This service does NOT verify whether a claim is true.
    It only explains what the user should independently verify.
    """

    lower_text = text.lower()
    verification_items = []

    if "sebi approved" in lower_text:
        verification_items.append({
            "category": "regulatory_approval",
            "claim": "SEBI approval is being claimed",
            "question": "Is the claimed regulatory approval genuine?",
            "action": (
                "Independently check the relevant information through "
                "an official SEBI source rather than relying on the message."
            ),
            "status": "requires_verification",
        })

    elif (
        "government approved" in lower_text
        or "govt approved" in lower_text
    ):
        verification_items.append({
            "category": "government_approval",
            "claim": "Government approval is being claimed",
            "question": "Is the claimed government approval genuine?",
            "action": (
                "Verify the claim through an independently accessed "
                "official government source."
            ),
            "status": "requires_verification",
        })

    guaranteed_phrases = [
        "guaranteed return",
        "guaranteed returns",
        "guaranteed profit",
        "guaranteed profits",
        "no risk",
        "risk free",
        "risk-free",
        "100% safe",
    ]

    if any(
        phrase in lower_text
        for phrase in guaranteed_phrases
    ):
        verification_items.append({
            "category": "return_claim",
            "claim": "A guaranteed or risk-free return is being claimed",
            "question": "What is the basis for the claimed return?",
            "action": (
                "Do not treat guaranteed-return language as proof of safety. "
                "Independently research the investment and its risks."
            ),
            "status": "warning",
        })

    if (
        "registered advisor" in lower_text
        or "registered adviser" in lower_text
    ):
        verification_items.append({
            "category": "advisor_registration",
            "claim": "The sender claims to be a registered advisor",
            "question": "Is the person or entity actually registered?",
            "action": (
                "Independently verify the person's or entity's "
                "registration using the relevant official source. "
                "Do not rely only on registration numbers or links "
                "provided in the message."
            ),
            "status": "requires_verification",
        })

    urgency_phrases = [
        "invest today",
        "act now",
        "limited time",
        "limited slots",
        "hurry",
        "immediately",
        "only this week",
    ]

    if any(
        phrase in lower_text
        for phrase in urgency_phrases
    ):
        verification_items.append({
            "category": "urgency",
            "claim": "The message creates pressure to act quickly",
            "question": "Can the decision safely wait for independent verification?",
            "action": (
                "Pause before acting. Take time to verify the sender, "
                "claims, and payment details independently."
            ),
            "status": "warning",
        })

    sensitive_phrases = [
        "share otp",
        "send otp",
        "share password",
        "send password",
        "upi pin",
        "share pin",
        "send pin",
    ]

    if any(
        phrase in lower_text
        for phrase in sensitive_phrases
    ):
        verification_items.append({
            "category": "sensitive_information",
            "claim": "The message requests sensitive authentication information",
            "question": "Is the sender asking for credentials that should remain private?",
            "action": (
                "Do not share OTPs, passwords, UPI PINs, or other "
                "authentication information."
            ),
            "status": "high_priority",
        })

    return verification_items