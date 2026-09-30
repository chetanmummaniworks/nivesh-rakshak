import easyocr


reader = easyocr.Reader(
    ["en"],
    gpu=False
)


def extract_text_from_image(image_path: str) -> str:
    results = reader.readtext(image_path)

    extracted_text = []

    for _, text, confidence in results:
        if confidence >= 0.4:
            extracted_text.append(text)

    return "\n".join(extracted_text)