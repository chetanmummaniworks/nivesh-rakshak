import { useState } from "react";
import "./App.css";

const examples = [
  "Invest ₹5,000 today and get guaranteed 40% monthly returns! Limited offer. Send money now.",
  "Congratulations! You have been selected for an exclusive investment opportunity. Contact our registered advisor for details.",
];

function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Existing text analysis
  function analyzeMessage(event) {
    event.preventDefault();

    if (!message.trim()) return;

    const text = message.toLowerCase();

    const rules = [
      {
        words: ["guaranteed", "no risk", "risk-free"],
        title: "Guaranteed return claims",
        description:
          "Promises of guaranteed or risk-free investment returns can be a warning sign.",
      },
      {
        words: ["urgent", "limited offer", "act now", "today only"],
        title: "Urgency and pressure",
        description:
          "Pressure to act quickly may discourage careful research before investing.",
      },
      {
        words: ["send money", "transfer", "pay now", "deposit"],
        title: "Request to transfer money",
        description:
          "Verify the recipient and the investment independently before transferring funds.",
      },
      {
        words: ["40%", "double your money", "100% return", "monthly returns"],
        title: "Unusually high return claims",
        description:
          "Very high or fixed return claims deserve careful independent verification.",
      },
      {
        words: ["otp", "password", "upi pin", "bank details"],
        title: "Sensitive information request",
        description:
          "Never share your OTP, password, or UPI PIN with someone claiming to be an advisor.",
      },
    ];

    const signals = rules.filter((rule) =>
      rule.words.some((word) => text.includes(word))
    );

    const risk =
      signals.length >= 3
        ? "High"
        : signals.length >= 1
          ? "Moderate"
          : "Needs review";

    setResult({
      risk,
      signals,
      safetyActions: [
        "Verify the sender independently.",
        "Do not share OTPs, passwords, PINs, or authentication information.",
        "Do not act under pressure or urgency.",
        "Verify important claims through trusted official sources.",
      ],
      summary:
        signals.length > 0
          ? `We found ${signals.length} potential warning signal${
              signals.length > 1 ? "s" : ""
            } in this message.`
          : "No warning signals from our current demo rules were detected. This does not mean the message is safe.",
    });

    setError("");
  }

  // Real image analysis through FastAPI
  async function analyzeImage() {
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/api/analyze-image",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Unable to analyze the image."
        );
      }

      const data = await response.json();

      const frontendRisk =
        data.risk_level === "high"
          ? "High"
          : data.risk_level === "medium"
            ? "Moderate"
            : "Low";

      const formattedSignals = (data.signals || []).map((signal) => ({
        title: formatSignalTitle(signal.type),
        description: signal.evidence,
      }));

      setResult({
        risk: frontendRisk,
        summary: data.summary,
        signals: formattedSignals,
        safetyActions: data.safety_actions || [],
        extractedText: data.extracted_text || "",
      });
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while analyzing the image."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatSignalTitle(type) {
    const titles = {
      guaranteed_return: "Guaranteed return claims",
      urgency: "Urgency and pressure",
      sensitive_information: "Sensitive information request",
      authority_claim: "Authority or approval claim",
    };

    if (titles[type]) {
      return titles[type];
    }

    return type
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function clearAnalysis() {
    setMessage("");
    setResult(null);
    setFile(null);
    setError("");
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">N</span>

          <span>
            Nivesh<span className="brand-accent">Rakshak</span>
            <small>INVESTMENT SAFETY ASSISTANT</small>
          </span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#analyzer">Analyze message</a>
          <a href="#safety">Safety tips</a>
        </nav>

        <span className="status-badge">
          <span className="status-dot" />
          Demo mode
        </span>
      </header>

      <main id="home">
        {/* HERO */}
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span>✳</span> YOUR DIGITAL INVESTMENT GUARDIAN
            </div>

            <h1>
              Invest with confidence.
              <br />
              <span>Stay one step ahead.</span>
            </h1>

            <p className="hero-description">
              Spot suspicious investment messages before they put your money
              at risk. Understand warning signs and make informed decisions.
            </p>

            <a className="primary-button" href="#analyzer">
              Analyze a message <span>↗</span>
            </a>

            <div className="trust-note">
              <span>✓</span> Awareness first. Your financial safety matters.
            </div>
          </div>

          <div className="hero-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="shield">
              <div className="shield-inner">✓</div>
            </div>

            <div className="floating-card card-top">
              <span className="mini-icon green">✓</span>

              <span>
                <strong>Stay protected</strong>
                <small>Check before you invest</small>
              </span>
            </div>

            <div className="floating-card card-bottom">
              <span className="mini-icon orange">!</span>

              <span>
                <strong>Spot warning signs</strong>
                <small>Know what to look for</small>
              </span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="feature-strip">
          <div>
            <span className="feature-icon">◫</span>

            <span>
              <strong>Message screening</strong>
              <small>Check suspicious claims</small>
            </span>
          </div>

          <div>
            <span className="feature-icon">◎</span>

            <span>
              <strong>Clear explanations</strong>
              <small>Understand each warning</small>
            </span>
          </div>

          <div>
            <span className="feature-icon">♧</span>

            <span>
              <strong>Safety guidance</strong>
              <small>Know your next steps</small>
            </span>
          </div>
        </section>

        {/* ANALYZER */}
        <section className="analyzer-section" id="analyzer">
          <div className="section-heading">
            <div className="eyebrow">MESSAGE ANALYZER</div>

            <h2>Think it might be a scam?</h2>

            <p>
              Paste the investment message or upload a screenshot to check for
              potential red flags.
            </p>
          </div>

          <div className="analyzer-card">
            <div className="card-heading">
              <div>
                <span className="card-icon">✳</span>

                <strong>Check an investment message</strong>
              </div>

              <span className="private-label">
                Demo analysis
              </span>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="image-upload">
              <label htmlFor="image-upload">
                Screenshot or image
              </label>

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setFile(event.target.files?.[0] || null);
                  setError("");
                  setResult(null);
                }}
              />

              {file && (
                <small>
                  Selected: {file.name}
                </small>
              )}

              <button
                type="button"
                className="analyze-button"
                onClick={analyzeImage}
                disabled={!file || loading}
              >
                {loading
                  ? "Analyzing image..."
                  : "Analyze screenshot"}

                <span>→</span>
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <div className="error-message" role="alert">
                <strong>Analysis failed</strong>
                <p>{error}</p>
              </div>
            )}

            {/* TEXT ANALYSIS */}
            <form onSubmit={analyzeMessage}>
              <label htmlFor="message">
                Message or investment offer
              </label>

              <textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Paste a WhatsApp message, SMS, email, or investment offer here..."
                rows={5}
              />

              <div className="input-footer">
                <span>{message.length} characters</span>

                <button
                  type="button"
                  className="text-button"
                  onClick={() => setMessage(examples[0])}
                >
                  Try a sample message
                </button>
              </div>

              <button
                className="analyze-button"
                type="submit"
              >
                Analyze for warning signs <span>→</span>
              </button>
            </form>

            {/* RESULTS */}
            {result && (
              <div className="results" aria-live="polite">
                <div className="results-heading">
                  <div>
                    <div className="eyebrow">
                      ANALYSIS RESULTS
                    </div>

                    <h3>What we found</h3>
                  </div>

                  <span
                    className={`risk-badge ${result.risk
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {result.risk}
                  </span>
                </div>

                <p className="result-summary">
                  {result.summary}
                </p>

                {/* OCR TEXT */}
                {result.extractedText && (
                  <div className="extracted-text">
                    <strong>Text detected from image</strong>

                    <p>{result.extractedText}</p>
                  </div>
                )}

                {/* SIGNALS */}
                {result.signals.length > 0 ? (
                  <div className="signals-list">
                    {result.signals.map((signal, index) => (
                      <div
                        className="signal"
                        key={`${signal.title}-${index}`}
                      >
                        <span className="signal-icon">!</span>

                        <div>
                          <strong>{signal.title}</strong>

                          <p>{signal.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-signals">
                    No matching warning patterns found by the current
                    analysis rules. Do not treat this as proof that the
                    message is legitimate.
                  </div>
                )}

                {/* SAFETY ACTIONS */}
                {result.safetyActions &&
                  result.safetyActions.length > 0 && (
                    <div className="safety-callout">
                      <strong>
                        Recommended safety steps
                      </strong>

                      <ul>
                        {result.safetyActions.map(
                          (action, index) => (
                            <li key={`${action}-${index}`}>
                              {action}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                <button
                  className="text-button"
                  type="button"
                  onClick={clearAnalysis}
                >
                  Clear and analyze another message
                </button>
              </div>
            )}

            <p className="disclaimer">
              This is an educational demo. Results are intended to highlight
              potential warning signals and should not be treated as proof that
              a message is fraudulent or legitimate. Always verify important
              claims independently.
            </p>
          </div>
        </section>

        {/* SAFETY TIPS */}
        <section className="safety-section" id="safety">
          <div className="section-heading">
            <div className="eyebrow">
              INVESTOR AWARENESS
            </div>

            <h2>Pause. Check. Then decide.</h2>

            <p>
              Keep these simple precautions in mind when evaluating an offer.
            </p>
          </div>

          <div className="tips-grid">
            <article className="tip-card">
              <span>01</span>

              <h3>Question guaranteed returns</h3>

              <p>
                Be cautious of promises of unusually high or risk-free
                profits.
              </p>
            </article>

            <article className="tip-card">
              <span>02</span>

              <h3>Verify independently</h3>

              <p>
                Check the organization using official sources, not just links
                in a message.
              </p>
            </article>

            <article className="tip-card">
              <span>03</span>

              <h3>Never share secret credentials</h3>

              <p>
                Keep your OTP, password, and UPI PIN private.
              </p>
            </article>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">N</span>

          <span>
            Nivesh<span className="brand-accent">Rakshak</span>
          </span>
        </a>

        <p>
          Built for investor awareness and digital safety.
        </p>

        <span>
          © 2026 NiveshRakshak · Hackathon demo
        </span>
      </footer>
    </div>
  );
}

export default App;