def build_before_you_pay(text: str, signals: list, verification_items: list) -> dict:
    """
    Build an actionable safety checklist before the user takes
    a potentially risky financial action.

    This is safety guidance, not financial advice.
    """

    lower_text = text.lower()

    checks = []

    # 1. Sender verification
    checks.append({
        "id": "sender",
        "title": "Verify the sender",
        "action": (
            "Confirm who sent the message using an independently "
            "accessed official source."
        ),
        "priority": "high",
        "completed": False,
    })

    # 2. Regulatory / authority claims
    authority_claim = (
        "sebi approved" in lower_text
        or "government approved" in lower_text
        or "govt approved" in lower_text
        or "official scheme" in lower_text
    )

    if authority_claim:
        checks.append({
            "id": "authority",
            "title": "Verify the authority claim",
            "action": (
                "Check the claimed approval or association through "
                "the relevant official website. Do not rely on links "
                "or screenshots supplied in the message."
            ),
            "priority": "high",
            "completed": False,
        })

    # 3. Guaranteed returns
    guaranteed_return = any(
        phrase in lower_text
        for phrase in [
            "guaranteed return",
            "guaranteed returns",
            "guaranteed profit",
            "no risk",
            "risk free",
            "risk-free",
            "100% safe",
        ]
    )

    if guaranteed_return:
        checks.append({
            "id": "returns",
            "title": "Question guaranteed-return claims",
            "action": (
                "Do not treat guaranteed or risk-free language as "
                "proof that an investment is safe."
            ),
            "priority": "high",
            "completed": False,
        })

    # 4. Payment request
    payment_words = [
        "pay",
        "payment",
        "transfer",
        "send money",
        "deposit",
        "upi",
        "bank account",
    ]

    if any(word in lower_text for word in payment_words):
        checks.append({
            "id": "payment",
            "title": "Pause before making a payment",
            "action": (
                "Independently confirm the recipient and payment "
                "details before transferring money."
            ),
            "priority": "high",
            "completed": False,
        })

    # 5. Sensitive credentials
    sensitive_request = any(
        phrase in lower_text
        for phrase in [
            "share otp",
            "send otp",
            "share password",
            "send password",
            "upi pin",
            "share pin",
            "send pin",
        ]
    )

    if sensitive_request:
        checks.append({
            "id": "credentials",
            "title": "Protect your authentication information",
            "action": (
                "Do not share OTPs, passwords, UPI PINs, or other "
                "authentication information."
            ),
            "priority": "critical",
            "completed": False,
        })

    # 6. Urgency
    urgency = any(
        phrase in lower_text
        for phrase in [
            "invest today",
            "act now",
            "limited time",
            "limited slots",
            "hurry",
            "immediately",
            "only this week",
        ]
    )

    if urgency:
        checks.append({
            "id": "urgency",
            "title": "Do not let urgency make the decision",
            "action": (
                "Pause and take time to independently verify the "
                "message before taking action."
            ),
            "priority": "medium",
            "completed": False,
        })

    # Always provide an independent-verification step.
    checks.append({
        "id": "independent",
        "title": "Verify independently",
        "action": (
            "Use an official website or contact channel that you "
            "find independently rather than relying on information "
            "provided in the message."
        ),
        "priority": "high",
        "completed": False,
    })

    return {
        "before_you_pay": {
            "title": "Before You Pay",
            "description": (
                "Complete these safety checks before sending money, "
                "sharing credentials, or proceeding with the offer."
            ),
            "checks": checks,
            "can_proceed": False,
            "disclaimer": (
                "These checks provide safety guidance only. "
                "They do not establish whether an offer is genuine "
                "or fraudulent."
            ),
        }
    }