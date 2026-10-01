from typing import Any


ESCALATION_ORDER = [
    "authority_claim",
    "guaranteed_return",
    "urgency",
    "payment_request",
    "sensitive_information",
]


STAGE_DETAILS = {
    "authority_claim": {
        "title": "Authority claim",
        "description": (
            "The conversation introduces a regulatory, government, "
            "or official-status claim that should be independently verified."
        ),
    },
    "guaranteed_return": {
        "title": "Guaranteed return",
        "description": (
            "The conversation presents a financial outcome as "
            "guaranteed, fixed, assured, or risk-free."
        ),
    },
    "urgency": {
        "title": "Urgency or pressure",
        "description": (
            "The conversation begins pressuring the recipient "
            "to act quickly."
        ),
    },
    "payment_request": {
        "title": "Payment request",
        "description": (
            "The conversation asks the recipient to transfer money "
            "or make a payment."
        ),
    },
    "sensitive_information": {
        "title": "Sensitive information request",
        "description": (
            "The conversation requests sensitive authentication "
            "or financial information."
        ),
    },
}


def _signal_types(
    signals: list[dict[str, Any]],
) -> set[str]:
    return {
        str(signal.get("type", "")).strip()
        for signal in signals
        if isinstance(signal, dict)
    }


def _highest_risk(
    risk_levels: list[str],
) -> str:
    priority = {
        "low": 1,
        "medium": 2,
        "high": 3,
    }

    highest = "low"

    for level in risk_levels:
        if priority.get(level, 0) > priority.get(highest, 0):
            highest = level

    return highest


def _detect_escalation(
    timeline: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Detect warning stages in their actual chronological order.

    This describes observed sequence patterns.
    It does not determine whether the conversation is fraudulent.
    """

    first_seen: dict[str, int] = {}

    # ---------------------------------------------------------
    # Find the first chronological occurrence of each stage
    # ---------------------------------------------------------

    for item in timeline:
        message_number = item["message_number"]

        for signal_type in _signal_types(
            item.get("signals", [])
        ):
            if signal_type in ESCALATION_ORDER:
                if signal_type not in first_seen:
                    first_seen[signal_type] = message_number

    # ---------------------------------------------------------
    # Build stages in ACTUAL conversation order
    # ---------------------------------------------------------

    chronological_stages = sorted(
        first_seen.items(),
        key=lambda item: item[1],
    )

    detected_stages = []

    for signal_type, message_number in chronological_stages:
        details = STAGE_DETAILS[signal_type]

        detected_stages.append({
            "type": signal_type,
            "title": details["title"],
            "description": details["description"],
            "message_number": message_number,
        })

    # ---------------------------------------------------------
    # Compare the actual sequence against the expected
    # escalation sequence
    # ---------------------------------------------------------

    stage_positions = [
        ESCALATION_ORDER.index(stage["type"])
        for stage in detected_stages
    ]

    ordered_progression = (
        len(stage_positions) >= 2
        and stage_positions == sorted(stage_positions)
    )

    has_action_escalation = any(
        stage["type"] in {
            "payment_request",
            "sensitive_information",
        }
        for stage in detected_stages
    )

    # ---------------------------------------------------------
    # Generate explanation
    # ---------------------------------------------------------

    if ordered_progression and has_action_escalation:
        pattern = "escalating_action_pressure"

        summary = (
            "The conversation shows a chronological sequence in which "
            "trust or authority signals are followed by return claims, "
            "urgency, and requests for action."
        )

    elif len(detected_stages) >= 2:
        pattern = "multiple_warning_stages"

        summary = (
            "Multiple warning stages appear across the conversation. "
            "Review the sequence and independently verify important claims."
        )

    elif len(detected_stages) == 1:
        pattern = "single_warning_stage"

        summary = (
            "One warning stage appears in the conversation. "
            "Review the relevant message before taking action."
        )

    else:
        pattern = "no_known_progression"

        summary = (
            "No predefined conversation progression was detected. "
            "This does not establish that the conversation is safe."
        )

    return {
        "pattern": pattern,
        "summary": summary,
        "stages": detected_stages,
        "stage_count": len(detected_stages),
    }


def analyze_conversation(
    messages: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Build a conversation timeline from already-computed
    NiveshRakshak message analyses.

    Each message should contain:

        text
        analysis
    """

    timeline = []
    risk_levels = []

    for index, item in enumerate(messages):
        text = str(
            item.get("text", "")
        ).strip()

        analysis = item.get(
            "analysis",
            {},
        )

        signals = analysis.get(
            "signals",
            [],
        )

        risk_level = analysis.get(
            "risk_level",
            "low",
        )

        risk_levels.append(risk_level)

        timeline.append({
            "message_number": index + 1,
            "text": text,
            "risk_level": risk_level,
            "signals": signals,
            "signal_count": len(signals),
        })

    escalation = _detect_escalation(
        timeline
    )

    return {
        "conversation": {
            "message_count": len(timeline),
            "overall_risk_level": _highest_risk(
                risk_levels
            ),
            "timeline": timeline,
            "escalation": escalation,
        }
    }