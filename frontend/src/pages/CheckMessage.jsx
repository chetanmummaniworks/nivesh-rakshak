
import { useEffect, useState } from "react";
import AnalysisResult from "../components/AnalysisResult";

const examples = [
  "Invest ₹5,000 today and get guaranteed 40% monthly returns! Send money now.",
  "Your account will be blocked. Share your OTP immediately to avoid suspension.",
];

export default function CheckMessage({
  language = "en",
  onAnalyze,
  loading = false,
  result,
  error = "",
  onAnalyzeImage,
  imageLoading = false,
  imageResult,
  imageError = "",
}) {
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageSelectionError, setImageSelectionError] = useState("");

  const hindi = language === "hi";

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!message.trim() && !url.trim()) {
      return;
    }

    onAnalyze?.({
      message: message.trim(),
      url: url.trim(),
    });
  }

  function handleImageChange(event) {
    const selectedFile = event.target.files?.[0];

    setImageSelectionError("");

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setImageFile(null);
      setImageSelectionError(
        hindi
          ? "कृपया एक मान्य इमेज फ़ाइल चुनें।"
          : "Please select a valid image file."
      );
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setImageFile(null);
      setImageSelectionError(
        hindi
          ? "इमेज का आकार 10 MB से कम होना चाहिए।"
          : "The image must be smaller than 10 MB."
      );
      event.target.value = "";
      return;
    }

    setImageFile(selectedFile);
  }

  function handleImageSubmit() {
    if (!imageFile || imageLoading) {
      return;
    }

    onAnalyzeImage?.(imageFile);
  }

  return (
    <div className="page-container tool-page">
      <div className="page-heading">
        <span className="eyebrow">
          {hindi ? "संदेश की जाँच" : "MESSAGE CHECK"}
        </span>

        <h1>
          {hindi
            ? "निवेश संदेश की जाँच करें"
            : "Check an investment message"}
        </h1>

        <p>
          {hindi
            ? "संदेश, वेबसाइट लिंक या स्क्रीनशॉट की जाँच करें। परिणाम धोखाधड़ी या वैधता का अंतिम प्रमाण नहीं है।"
            : "Check a message, website link, or screenshot for potential warning signs. Results are not proof of fraud or legitimacy."}
        </p>
      </div>

      <div className="tool-layout">
        <div className="panel analysis-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="message-input">
              {hindi ? "संदेश का टेक्स्ट" : "Message text"}
            </label>

            <textarea
              id="message-input"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={
                hindi
                  ? "संदिग्ध निवेश संदेश यहाँ पेस्ट करें..."
                  : "Paste the investment message here..."
              }
              rows={7}
            />

            <div className="example-list">
              <span className="field-hint">
                {hindi ? "उदाहरण आज़माएँ:" : "Try an example:"}
              </span>

              {examples.map((example) => (
                <button
                  type="button"
                  key={example}
                  className="example-button"
                  onClick={() => setMessage(example)}
                >
                  {example}
                </button>
              ))}
            </div>

            <div className="form-divider">
              <span>{hindi ? "या" : "OR"}</span>
            </div>

            <label htmlFor="url-input">
              {hindi
                ? "वेबसाइट URL (वैकल्पिक)"
                : "Website URL (optional)"}
            </label>

            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
            />

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="button button-primary full-width"
              disabled={loading || (!message.trim() && !url.trim())}
            >
              {loading
                ? hindi
                  ? "जाँच हो रही है..."
                  : "Analyzing..."
                : hindi
                  ? "जोखिम संकेत जाँचें"
                  : "Check for warning signs"}
            </button>

            <p className="form-disclaimer">
              {hindi
                ? "OTP, पासवर्ड, UPI PIN या बैंक विवरण न डालें।"
                : "Do not enter OTPs, passwords, UPI PINs, or bank account credentials."}
            </p>
          </form>

          <div className="form-divider">
            <span>{hindi ? "या स्क्रीनशॉट अपलोड करें" : "OR UPLOAD A SCREENSHOT"}</span>
          </div>

          <div className="image-upload-section">
            <label htmlFor="image-input">
              {hindi
                ? "संदेश या निवेश ऑफ़र की इमेज"
                : "Message or investment offer image"}
            </label>

            <input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={imageLoading}
            />

            <p className="field-hint">
              {hindi
                ? "JPG, PNG या अन्य इमेज फ़ाइल चुनें (अधिकतम 10 MB)।"
                : "Choose a JPG, PNG, or other image file (maximum 10 MB)."}
            </p>

            {imageSelectionError && (
              <div className="error-message" role="alert">
                {imageSelectionError}
              </div>
            )}

            {imagePreview && (
              <div className="image-preview">
                <img
                  src={imagePreview}
                  alt={hindi ? "अपलोड की गई इमेज का पूर्वावलोकन" : "Selected image preview"}
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    maxHeight: "320px",
                    objectFit: "contain",
                    marginTop: "12px",
                    borderRadius: "10px",
                  }}
                />

                <p className="field-hint">
                  {imageFile?.name}
                </p>
              </div>
            )}

            {imageError && (
              <div className="error-message" role="alert">
                {imageError}
              </div>
            )}

            <button
              type="button"
              className="button button-primary full-width"
              onClick={handleImageSubmit}
              disabled={!imageFile || imageLoading}
            >
              {imageLoading
                ? hindi
                  ? "इमेज की जाँच हो रही है..."
                  : "Analyzing image..."
                : hindi
                  ? "इमेज का विश्लेषण करें"
                  : "Analyze Image"}
            </button>

            <p className="form-disclaimer">
              {hindi
                ? "इमेज से टेक्स्ट निकाला जाएगा। यदि टेक्स्ट स्पष्ट नहीं है, तो परिणाम अधूरे हो सकते हैं।"
                : "Text is extracted from the image. Results may be incomplete if the text is unclear."}
            </p>
          </div>
        </div>

        <section className="panel result-panel" aria-live="polite">
          <span className="eyebrow">
            {hindi ? "विश्लेषण परिणाम" : "ANALYSIS RESULT"}
          </span>

          {!result && !loading && !imageResult && !imageLoading && (
            <div className="empty-result">
              <div className="empty-result-icon">⌕</div>

              <h2>
                {hindi ? "परिणाम यहाँ दिखेगा" : "Your result will appear here"}
              </h2>

              <p>
                {hindi
                  ? "संदेश, URL या इमेज जाँचने के बाद परिणाम यहाँ दिखाई देगा।"
                  : "Analyze a message, URL, or image to see the results here."}
              </p>
            </div>
          )}

          {loading && (
            <div className="loading-result">
              <div className="loading-spinner" />
              <p>
                {hindi
                  ? "संदेश के संकेतों की जाँच हो रही है..."
                  : "Reviewing the submitted information..."}
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="analysis-result-content">
              <AnalysisResult result={result} language={language} />
            </div>
          )}

          {imageLoading && (
            <div className="loading-result">
              <div className="loading-spinner" />
              <p>
                {hindi
                  ? "इमेज से टेक्स्ट निकाला और जाँचा जा रहा है..."
                  : "Extracting text and checking the image..."}
              </p>
            </div>
          )}

          {imageResult && !imageLoading && (
            <div className="image-analysis-result">
              <div className="form-divider">
                <span>
                  {hindi ? "इमेज विश्लेषण" : "IMAGE ANALYSIS"}
                </span>
              </div>

              <h2>
                {hindi ? "इमेज से निकाला गया टेक्स्ट" : "Text extracted from image"}
              </h2>

              {imageResult.extracted_text?.trim() ? (
                <div className="extracted-text">
                  <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                    {imageResult.extracted_text}
                  </p>
                </div>
              ) : (
                <p>
                  {hindi
                    ? "इमेज से कोई स्पष्ट टेक्स्ट नहीं निकाला जा सका। एक साफ़ इमेज अपलोड करके देखें।"
                    : "No readable text was extracted. Try uploading a clearer image."}
                </p>
              )}

              <h2>
                {hindi ? "जोखिम विश्लेषण" : "Risk analysis"}
              </h2>

              <AnalysisResult
                result={imageResult}
                language={language}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}