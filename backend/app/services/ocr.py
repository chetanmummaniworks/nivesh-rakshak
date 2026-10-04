import easyocr


reader = easyocr.Reader(
    ["en", "hi"],
    gpu=False,
    verbose=False,
)


def extract_text_from_image(image_path: str) -> str:
    results = reader.readtext(
        image_path,
        detail=1,
        paragraph=False,
        canvas_size=1600,
        mag_ratio=1.0,
        decoder="greedy",
        batch_size=1,
    )

    extracted_text = []

    for _, text, confidence in results:
        if confidence >= 0.4:
            text = text.strip()
            if text:
                extracted_text.append(text)

    return "\n".join(extracted_text)
