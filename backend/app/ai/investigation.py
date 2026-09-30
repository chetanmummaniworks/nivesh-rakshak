def build_investigation(text: str, signals: list) -> dict:
    """
    Converts detected warning signals into an explainable
    investigation report.
    """

    claims = []
    evidence = []
    verification_items = []

    lower_text = text.lower()

    # Authority / approval claims
    if "sebi approved" in lower_text:
        claims.append({
            "claim": "SEBI approval is being claimed",
            "type": "authority_claim",
            "status": "requires_verification"
        })

        evidence.append({
            "text": "SEBI approved",
            "reason": "The message makes an approval claim involving a regulatory authority."
        })

        verification_items.append({
            "item": "Verify the claimed regulatory approval independently.",
            "reason": "Do not rely only on the message or sender for an approval claim."
        })

    elif "government approved" in lower_text or "govt approved" in lower_text:
        claims.append({
            "claim": "Government approval is being claimed",
            "type": "authority_claim",
            "status": "requires_verification"
        })

        evidence.append({
            "text": "Government approved",
            "reason": "The message uses government approval as a trust signal."
        })

        verification_items.append({
            "item": "Verify the claimed government approval through an independent official source.",
            "reason": "Authority claims should be independently checked."
        })

    # Guaranteed return claims
    guaranteed_phrases = [
        "guaranteed return",
        "guaranteed returns",
        "guaranteed profit",
        "no risk",
        "risk free",
        "risk-free",
        "100% safe",
    ]

    matched_guarantee = next(
        (phrase for phrase in guaranteed_phrases if phrase in lower_text),
        None
    )

    if matched_guarantee:
        claims.append({
            "claim": "A guaranteed or risk-free financial outcome is being claimed",
            "type": "guaranteed_return",
            "status": "warning"
        })

        evidence.append({
            "text": matched_guarantee,
            "reason": "The message uses certainty or risk-free language about an investment outcome."
        })

        verification_items.append({
            "item": "Do not treat guaranteed-return language as proof of safety.",
            "reason": "The claim itself should be independently evaluated rather than trusted at face value."
        })

    # Urgency
    urgency_phrases = [
        "invest today",
        "act now",
        "limited time",
        "limited slots",
        "hurry",
        "immediately",
        "only this week",
    ]

    matched_urgency = next(
        (phrase for phrase in urgency_phrases if phrase in lower_text),
        None
    )

    if matched_urgency:
        evidence.append({
            "text": matched_urgency,
            "reason": "The message creates pressure to act quickly."
        })

        verification_items.append({
            "item": "Pause before taking action.",
            "reason": "Urgency can reduce the time available for independent verification."
        })

    # Sensitive information
    sensitive_phrases = [
        "share otp",
        "send otp",
        "share password",
        "send password",
        "upi pin",
        "share pin",
        "send pin",
    ]

    matched_sensitive = next(
        (phrase for phrase in sensitive_phrases if phrase in lower_text),
        None
    )

    if matched_sensitive:
        evidence.append({
            "text": matched_sensitive,
            "reason": "The message appears to request sensitive authentication information."
        })

        verification_items.append({
            "item": "Do not share OTPs, passwords, PINs, or authentication information.",
            "reason": "Sensitive authentication information should not be disclosed through an unsolicited investment message."
        })

    # Build investigation summary
    if not signals:
        investigation_summary = (
            "No predefined warning signals were detected. "
            "This does not establish that the message is safe."
        )
    else:
        investigation_summary = (
            f"{len(signals)} warning signal(s) were detected. "
            "Review the evidence and independently verify important claims before acting."
        )

    return {
        "investigation": {
            "summary": investigation_summary,
            "claims": claims,
            "evidence": evidence,
            "verification_items": verification_items,
        }
    }