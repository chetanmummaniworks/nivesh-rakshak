import { useState } from "react";
import AnalysisResult from "../components/AnalysisResult";

export default function ConversationSafety({
  language = "en",
  onAnalyze,
  loading = false,
  result,
  error = "",
}) {
  const hindi = language === "hi";

  const [messages, setMessages] = useState([
    { sender: "Other person", text: "" },
    { sender: "Me", text: "" },
  ]);

  function updateMessage(index, field, value) {
    setMessages((previous) =>
      previous.map((message, i) =>
        i === index ? { ...message, [field]: value } : message
      )
    );
  }

  function addMessage() {
    if (messages.length < 20) {
      setMessages((previous) => [
        ...previous,
        { sender: "Other person", text: "" },
      ]);
    }
  }

  function removeMessage(index) {
    setMessages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  }

  function submit(event) {
    event.preventDefault();

    const filledMessages = messages
      .map((message) => ({
        sender: message.sender,
        text: message.text.trim(),
      }))
      .filter((message) => message.text);

    if (filledMessages.length > 0) {
      onAnalyze?.(filledMessages);
    }
  }

  return (
    <div className="page-container tool-page">
      <div className="page-heading">
        <span className="eyebrow">
          {hindi ? "बातचीत की समीक्षा" : "CONVERSATION REVIEW"}
        </span>

        <h1>
          {hindi
            ? "पूरी बातचीत की जाँच करें"
            : "Review an investment conversation"}
        </h1>

        <p>
          {hindi
            ? "संदेशों को क्रम में जोड़ें ताकि दबाव बनाने, अवास्तविक वादों या निजी जानकारी माँगने जैसे संभावित चेतावनी संकेतों की समीक्षा की जा सके।"
            : "Add messages in order to review possible patterns such as pressure, unrealistic promises, or requests for sensitive information."}
        </p>
      </div>

      <div className="tool-layout">
        <form className="panel analysis-form" onSubmit={submit}>
          <div className="conversation-heading">
            <h2>
              {hindi ? "बातचीत के संदेश" : "Conversation messages"}
            </h2>

            <span className="field-hint">
              {messages.length}/20
            </span>
          </div>

          {messages.map((message, index) => (
            <div className="message-entry" key={index}>
              <div className="message-entry-top">
                <label htmlFor={`sender-${index}`}>
                  {hindi ? "भेजने वाला" : "Sender"}
                </label>

                {messages.length > 1 && (
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => removeMessage(index)}
                  >
                    {hindi ? "हटाएँ" : "Remove"}
                  </button>
                )}
              </div>

              <select
                id={`sender-${index}`}
                value={message.sender}
                onChange={(event) =>
                  updateMessage(index, "sender", event.target.value)
                }
              >
                <option value="Other person">
                  {hindi ? "दूसरा व्यक्ति" : "Other person"}
                </option>

                <option value="Me">
                  {hindi ? "मैं" : "Me"}
                </option>

                <option value="Unknown">
                  {hindi ? "अज्ञात" : "Unknown"}
                </option>
              </select>

              <label htmlFor={`text-${index}`}>
                {hindi ? "संदेश" : "Message"}
              </label>

              <textarea
                id={`text-${index}`}
                rows={3}
                value={message.text}
                onChange={(event) =>
                  updateMessage(index, "text", event.target.value)
                }
                placeholder={
                  hindi
                    ? "संदेश का टेक्स्ट यहाँ डालें..."
                    : "Enter the message text..."
                }
              />
            </div>
          ))}

          <button
            type="button"
            className="button button-secondary full-width"
            onClick={addMessage}
            disabled={messages.length >= 20}
          >
            + {hindi ? "एक और संदेश जोड़ें" : "Add another message"}
          </button>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="button button-primary full-width"
            disabled={
              loading || !messages.some((item) => item.text.trim())
            }
          >
            {loading
              ? hindi
                ? "जाँच हो रही है..."
                : "Analyzing conversation..."
              : hindi
                ? "बातचीत की जाँच करें"
                : "Analyze conversation"}
          </button>

          <p className="form-disclaimer">
            {hindi
              ? "भेजने से पहले नाम, फोन नंबर, OTP, खाता विवरण और अन्य निजी जानकारी हटा दें।"
              : "Remove names, phone numbers, OTPs, account details, and other private information before submitting."}
          </p>
        </form>

        <section className="panel result-panel" aria-live="polite">
          <span className="eyebrow">
            {hindi ? "समीक्षा परिणाम" : "REVIEW RESULT"}
          </span>

          {!result && !loading && (
            <div className="empty-result">
              <div className="empty-result-icon">☷</div>

              <h2>
                {hindi
                  ? "परिणाम यहाँ दिखेगा"
                  : "Your review will appear here"}
              </h2>

              <p>
                {hindi
                  ? "बातचीत जमा करने के बाद परिणाम यहाँ दिखाई देगा।"
                  : "Submit the conversation to see the available analysis."}
              </p>
            </div>
          )}

          {loading && (
            <div className="loading-result">
              <div className="loading-spinner" />

              <p>
                {hindi
                  ? "बातचीत की समीक्षा हो रही है..."
                  : "Reviewing the conversation..."}
              </p>
            </div>
          )}

          {result && !loading && (
            <AnalysisResult
              result={result}
              language={language}
            />
          )}
        </section>
      </div>
    </div>
  );
}
