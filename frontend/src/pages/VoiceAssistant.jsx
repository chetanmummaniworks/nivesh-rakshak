import { useEffect, useRef, useState } from "react";
import AnalysisResult from "../components/AnalysisResult";
import "./VoiceAssistant.css";

export default function VoiceAssistant({
  language = "en",
  onAnalyze,
  loading = false,
  result,
  error = "",
}) {
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef(null);
  const shouldKeepListeningRef = useRef(false);
  const manuallyStoppingRef = useRef(false);
  const transcriptRef = useRef("");
  const finalizedTranscriptRef = useRef("");
  const interimTranscriptRef = useRef("");

  const hindi = language === "hi";

  const speechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window ||
      "webkitSpeechRecognition" in window);

  useEffect(() => {
    transcriptRef.current = message;
  }, [message]);

  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;
      manuallyStoppingRef.current = true;
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  function startListening() {
    setVoiceError("");
    shouldKeepListeningRef.current = true;
    manuallyStoppingRef.current = false;

    // Start a fresh dictation without reusing results from an earlier session.
    finalizedTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    transcriptRef.current = "";
    setMessage("");

    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceError(
        hindi
          ? "इस ब्राउज़र में वॉइस पहचान उपलब्ध नहीं है। नीचे टेक्स्ट लिखें।"
          : "Speech recognition is unavailable in this browser. Type your message below."
      );
      return;
    }

    recognitionRef.current?.abort();

    const recognition = new Recognition();
    recognition.lang = hindi ? "hi-IN" : "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      setVoiceError("");
    };

    recognition.onresult = (event) => {
      // Rebuild the transcript from this recognition session's result list.
      // Do not append transcriptRef.current: it already contains earlier results.
      const finalizedParts = [];
      const interimParts = [];

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const spokenText = result[0]?.transcript?.trim();

        if (!spokenText) continue;

        if (result.isFinal) {
          finalizedParts.push(spokenText);
        } else {
          interimParts.push(spokenText);
        }
      }

      finalizedTranscriptRef.current = finalizedParts.join(" ");
      interimTranscriptRef.current = interimParts.join(" ");

      const combinedTranscript = [
        finalizedTranscriptRef.current,
        interimTranscriptRef.current,
      ].filter(Boolean).join(" ");

      transcriptRef.current = combinedTranscript;
      setMessage(combinedTranscript);
    };

    recognition.onerror = (event) => {
      if (event.error !== "aborted") {
        setVoiceError(
          event.error === "not-allowed"
            ? hindi
              ? "माइक्रोफ़ोन की अनुमति दें या टेक्स्ट लिखें।"
              : "Allow microphone access or type your message instead."
            : hindi
              ? "आवाज़ पहचान नहीं हो सकी। दोबारा प्रयास करें।"
              : "Speech could not be recognized. Please try again."
        );
      }
    };

    recognition.onend = () => {
      // Some browsers end speech recognition after a short pause.
      // Restart while the user still wants to dictate; only the Stop button ends it.
      if (shouldKeepListeningRef.current && !manuallyStoppingRef.current) {
        window.setTimeout(() => {
          if (!shouldKeepListeningRef.current || manuallyStoppingRef.current) return;

          try {
            recognition.start();
          } catch {
            // A browser may still be transitioning between recognition sessions.
            // Keep the transcript safe and let the user restart manually if needed.
            setListening(false);
          }
        }, 250);
        return;
      }

      setListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setListening(false);
      setVoiceError(
        hindi
          ? "माइक्रोफ़ोन शुरू नहीं हो सका। दोबारा प्रयास करें।"
          : "Could not start the microphone. Please try again."
      );
    }
  }

  function stopListening() {
    shouldKeepListeningRef.current = false;
    manuallyStoppingRef.current = true;
    recognitionRef.current?.stop();
    setListening(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!message.trim() || loading) return;

    if (listening || shouldKeepListeningRef.current) stopListening();

    onAnalyze?.({
      message: message.trim(),
      url: "",
    });
  }

  return (
    <div className="page-container tool-page voice-page">
      <div className="page-heading">
        <span className="eyebrow">
          {hindi ? "वॉइस सुरक्षा सहायक" : "VOICE SAFETY ASSISTANT"}
        </span>

        <h1>
          {hindi
            ? "बोलें, जाँचें और सुरक्षित रहें"
            : "Speak, check and stay safe"}
        </h1>

        <p>
          {hindi
            ? "संदिग्ध निवेश संदेश के बारे में बोलें। हम उसके चेतावनी संकेतों और अगले सुरक्षित कदमों की जाँच करेंगे।"
            : "Describe a suspicious investment message. NiveshRakshak will check for warning signs and explain practical safety steps."}
        </p>
      </div>

      <div className="voice-workspace">
        <section className="panel voice-input-panel">
          <div className="voice-mic-icon" aria-hidden="true">
            {listening ? "🎙️" : "🎤"}
          </div>

          <h2>
            {listening
              ? hindi
                ? "सुन रहे हैं..."
                : "Listening..."
              : hindi
                ? "अपना संदेश बोलें"
                : "Speak your message"}
          </h2>

          <p className="voice-help">
            {hindi
              ? "उदाहरण: किसी ने गारंटीड रिटर्न का वादा करके आज पैसे भेजने को कहा।"
              : "Example: Someone promised guaranteed returns and asked me to send money today."}
          </p>

          <div className="voice-actions">
            {!listening ? (
              <button
                type="button"
                className="button button-primary"
                onClick={startListening}
                disabled={loading}
              >
                🎤 {hindi ? "बोलना शुरू करें" : "Start speaking"}
              </button>
            ) : (
              <button
                type="button"
                className="button button-secondary"
                onClick={stopListening}
              >
                ■ {hindi ? "सुनना रोकें" : "Stop listening"}
              </button>
            )}
          </div>

          {!speechSupported && (
            <p className="voice-note">
              {hindi
                ? "इस ब्राउज़र में वॉइस पहचान उपलब्ध नहीं है। आप टेक्स्ट लिख सकते हैं।"
                : "Voice recognition is not supported here. You can type your message instead."}
            </p>
          )}

          {voiceError && (
            <p className="voice-error" role="alert">
              {voiceError}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="voice-message">
              {hindi
                ? "पहचाना गया टेक्स्ट (आप इसे बदल सकते हैं)"
                : "Recognized text (you can edit it)"}
            </label>

            <textarea
              id="voice-message"
              rows={6}
              value={message}
              onChange={(event) => {
                const editedText = event.target.value;
                transcriptRef.current = editedText;
                setMessage(editedText);
              }}
              placeholder={
                hindi
                  ? "यहाँ संदेश बोलें या टाइप करें..."
                  : "Speak or type the suspicious message here..."
              }
            />

            {error && (
              <p className="voice-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="button button-primary full-width"
              disabled={loading || !message.trim()}
            >
              {loading
                ? hindi
                  ? "जाँच हो रही है..."
                  : "Analyzing..."
                : hindi
                  ? "सुरक्षा जाँच करें"
                  : "Analyze for safety"}
            </button>
          </form>

          <p className="form-disclaimer">
            {hindi
              ? "OTP, पासवर्ड, UPI PIN या बैंक विवरण न बोलें।"
              : "Do not speak OTPs, passwords, UPI PINs, or bank credentials."}
          </p>
        </section>

        <section className="panel voice-result-panel" aria-live="polite">
          <span className="eyebrow">
            {hindi ? "सुरक्षा रिपोर्ट" : "SAFETY REPORT"}
          </span>

          {!result && !loading && (
            <div className="empty-result">
              <div className="empty-result-icon">🔊</div>
              <h2>
                {hindi
                  ? "आपकी रिपोर्ट यहाँ दिखेगी"
                  : "Your report will appear here"}
              </h2>
              <p>
                {hindi
                  ? "पहले संदेश बोलें या टाइप करें और उसकी जाँच करें।"
                  : "Analyze a message to see the findings and listen to the report."}
              </p>
            </div>
          )}

          {loading && (
            <div className="loading-result">
              <div className="loading-spinner" />
              <p>
                {hindi
                  ? "संदेश की जाँच हो रही है..."
                  : "Checking the message for warning signs..."}
              </p>
            </div>
          )}

          {result && !loading && <AnalysisResult result={result} language={language} />}
        </section>
      </div>
    </div>
  );
}
