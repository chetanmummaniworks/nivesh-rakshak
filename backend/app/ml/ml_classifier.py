
from pathlib import Path
import joblib

BACKEND_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BACKEND_DIR / "models" / "investor_safety_model.joblib"

_bundle = None


def load_model():
    global _bundle

    if _bundle is None and MODEL_PATH.exists():
        _bundle = joblib.load(MODEL_PATH)

    return _bundle


def predict_scam_text(text: str):
    """Return an experimental ML assessment, or None if unavailable."""
    bundle = load_model()

    if not bundle or not isinstance(text, str) or not text.strip():
        return None

    model = bundle["pipeline"]
    probabilities = model.predict_proba([text])[0]
    classes = list(model.classes_)

    scam_index = classes.index("scam")
    scam_probability = float(probabilities[scam_index])

    # These are provisional review bands, not validated risk probabilities.
    if scam_probability >= 0.80:
        risk_level = "likely_scam"
        review_message = "Strong scam indicators detected. Verify independently."
    elif scam_probability >= 0.20:
        risk_level = "needs_review"
        review_message = "Uncertain result. Verify the sender and claims independently."
    else:
        risk_level = "lower_model_concern"
        review_message = "No strong scam signal from this model. Still verify independently."

    return {
        "label": risk_level,
        "scam_probability": round(scam_probability, 4),
        "model_type": bundle["model_type"],
        "experimental": bundle["experimental"],
        "review_message": review_message,
    }


def diagnose_messages(messages):
    """Compare model scores for sample messages."""
    bundle = load_model()
    if not bundle:
        print("Model unavailable.")
        return

    model = bundle["pipeline"]
    classes = list(model.classes_)
    scam_index = classes.index("scam")

    for text in messages:
        probabilities = model.predict_proba([text])[0]
        score = float(probabilities[scam_index])

        if score >= 0.80:
            label = "likely_scam"
        elif score >= 0.20:
            label = "needs_review"
        else:
            label = "lower_model_concern"

        print(f"\nMessage: {text}")
        print(f"Assessment: {label}")
        print(f"Model scam score: {score:.4f} ({score * 100:.2f}%)")