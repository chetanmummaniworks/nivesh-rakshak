def build_before_you_pay(text: str, signals: list, verification_items: list) -> dict:
    """
    Build a personalized, actionable safety checklist based on the
    warning signals and verification items found in the message.

    This is safety guidance, not financial advice.
    """

    lower_text = text.casefold()

    # Read signal types defensively so this function can handle
    # incomplete or unexpected analysis results.
    signal_types = {
        str(signal.get("type", "")).strip().lower()
        for signal in signals
        if isinstance(signal, dict)
    }

    checks = []
    seen_ids = set()

    def add_check(
        check_id: str,
        title: str,
        action: str,
        priority: str = "high",
    ) -> None:
        """Add a checklist item only once."""
        if check_id in seen_ids:
            return

        seen_ids.add(check_id)
        checks.append({
            "id": check_id,
            "title": title,
            "action": action,
            "priority": priority,
            "completed": False,
        })

    # 1. Always begin by verifying the sender independently.
    add_check(
        "sender",
        "Verify the sender",
        (
            "Confirm who sent the message using an official website "
            "or contact channel you find independently. Do not rely "
            "only on the sender's name, profile, links, or screenshots."
        ),
    )

    # 2. Regulatory or authority claims.
    authority_phrases = (
        "sebi approved",
        "sebi-approved",
        "sebi authorised",
        "sebi-authorised",
        "sebi authorized",
        "sebi-authorized",
        "government approved",
        "government-approved",
        "govt approved",
        "govt-approved",
        "government authorised",
        "government-authorised",
        "government authorized",
        "government-authorized",
        "official scheme",
        "government scheme",
        "government backed",
        "government-backed",
    )
    authority_claim = (
        "authority_claim" in signal_types
        or any(phrase in lower_text for phrase in authority_phrases)
    )

    if authority_claim:
        add_check(
            "authority",
            "Verify the authority or approval claim",
            (
                "Check the claimed registration, approval, or association "
                "through the relevant regulator's or organisation's "
                "official website. A message, logo, certificate image, "
                "or forwarded link is not proof by itself."
            ),
        )

    # 3. Guaranteed, fixed, or risk-free return claims.
    return_phrases = (
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
    )
    guaranteed_return = (
        "guaranteed_return" in signal_types
        or any(phrase in lower_text for phrase in return_phrases)
    )

    if guaranteed_return:
        add_check(
            "returns",
            "Question guaranteed-return claims",
            (
                "Do not treat guaranteed, fixed, or risk-free language "
                "as proof that an investment is safe. Ask for the full "
                "terms and independently verify the claim before making "
                "a decision."
            ),
        )

    # 4. Payment request.
    payment_phrases = (
        "send money",
        "send the money",
        "send payment",
        "send the payment",
        "transfer money",
        "transfer the money",
        "transfer funds",
        "pay now",
        "pay today",
        "payment",
        "deposit",
        "upi",
        "bank transfer",
        "bank account",
    )
    payment_request = (
        "payment_request" in signal_types
        or any(phrase in lower_text for phrase in payment_phrases)
    )

    if payment_request:
        add_check(
            "payment",
            "Pause before making a payment",
            (
                "Do not transfer money while the offer or recipient is "
                "unverified. Independently confirm the recipient and "
                "payment details using a trusted channel, not details "
                "provided only in the message."
            ),
        )

    # 5. Requests for sensitive credentials or financial information.
    sensitive_phrases = (
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
    )
    sensitive_request = (
        "sensitive_information" in signal_types
        or any(phrase in lower_text for phrase in sensitive_phrases)
    )

    if sensitive_request:
        add_check(
            "credentials",
            "Protect your authentication information",
            (
                "Never share OTPs, passwords, UPI PINs, or card security "
                "codes with someone who contacts you. Do not enter them "
                "through a link supplied in an unsolicited message."
            ),
            priority="critical",
        )

    # 6. Urgency or pressure to act quickly.
    urgency_phrases = (
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
        "send money today",
        "secure your profit",
        "act fast",
        "right away",
        "before it's too late",
        "don't wait",
        "dont wait",
    )
    urgency = (
        "urgency" in signal_types
        or any(phrase in lower_text for phrase in urgency_phrases)
    )

    if urgency:
        add_check(
            "urgency",
            "Take time; do not act under pressure",
            (
                "Pause and independently verify the claims before acting. "
                "A deadline or demand for immediate action is not proof "
                "that the offer is genuine."
            ),
            priority="high",
        )

    # 7. Tailor a check to claims that the report says need verification.
    if isinstance(verification_items, list) and verification_items:
        add_check(
            "claims",
            "Check the report's verification items",
            (
                "Review each claim listed in the investigation report. "
                "Look for confirmation from the relevant official source "
                "and note any claim you cannot independently verify."
            ),
            priority="high",
        )

    # 8. Always include independent verification.
    add_check(
        "independent",
        "Verify independently before proceeding",
        (
            "Open the relevant official website yourself or find its "
            "contact details independently. Avoid relying on contact "
            "details, QR codes, or links supplied only by the sender."
        ),
    )

    # 9. If the user may already have acted, provide a safe recovery step.
    add_check(
        "already_acted",
        "If you have already paid or shared information",
        (
            "Contact your bank or payment provider promptly through its "
            "official channel. If credentials were shared, use the "
            "official service to secure the affected account. In India, "
            "you can contact the national cybercrime helpline at 1930 "
            "or visit cybercrime.gov.in to report suspected cybercrime."
        ),
        priority="high",
    )

    return {
        "before_you_pay": {
            "title": "Your Personalized Safety Plan",
            "description": (
                "These steps are tailored to the warning signals and "
                "verification items detected in the message. Complete "
                "the relevant checks before sending money, sharing "
                "information, or proceeding with the offer."
            ),
            "checks": checks,
            "can_proceed": False,
            "disclaimer": (
                "This is safety guidance, not financial advice. Warning "
                "signals do not by themselves prove fraud, and the absence "
                "of warning signals does not prove that an offer is safe."
            ),
        }
    }
