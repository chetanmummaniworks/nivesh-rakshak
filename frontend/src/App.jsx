
import { useState } from "react";
import "./App.css";

const examples = [
  "Invest ₹5,000 today and get guaranteed 40% monthly returns! Limited offer. Send money now.",
  "Congratulations! You have been selected for an exclusive investment opportunity. Contact our registered advisor for details.",
];

function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

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
      summary:
        signals.length > 0
          ? `We found ${signals.length} potential warning signal${signals.length > 1 ? "s" : ""} in this message.`
          : "No warning signals from our current demo rules were detected. This does not mean the message is safe.",
    });
  }

  function clearAnalysis() {
    setMessage("");
    setResult(null);
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

        <section className="feature-strip">
          <div>
            <span className="feature-icon">⌕</span>
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

        <section className="analyzer-section" id="analyzer">
          <div className="section-heading">
            <div className="eyebrow">MESSAGE ANALYZER</div>
            <h2>Think it might be a scam?</h2>
            <p>Paste the investment message below to check for potential red flags.</p>
          </div>

          <div className="analyzer-card">
            <div className="card-heading">
              <div>
                <span className="card-icon">✳</span>
                <strong>Check an investment message</strong>
              </div>
              <span className="private-label">Demo analysis</span>
            </div>

            <form onSubmit={analyzeMessage}>
              <label htmlFor="message">Message or investment offer</label>
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
                  onClick={() =>
                    setMessage(examples[0])
                  }
                >
                  Try a sample message
                </button>
              </div>

              <button className="analyze-button" type="submit">
                Analyze for warning signs <span>→</span>
              </button>
            </form>

            {result && (
              <div className="results" aria-live="polite">
                <div className="results-heading">
                  <div>
                    <div className="eyebrow">ANALYSIS RESULTS</div>
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

                <p className="result-summary">{result.summary}</p>

                {result.signals.length > 0 ? (
                  <div className="signals-list">
                    {result.signals.map((signal) => (
                      <div className="signal" key={signal.title}>
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
                    No matching warning patterns found by the demo rules.
                    Do not treat this as proof that the message is legitimate.
                  </div>
                )}

                <div className="safety-callout">
                  <strong>Before you invest</strong>
                  <p>
                    Verify the company and relevant registration details
                    independently. Never rush into transferring money or
                    sharing sensitive banking information.
                  </p>
                </div>

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
              This is an educational demo using simple keyword rules, not a
              verified AI model or a guarantee of fraud detection. Results
              may be incomplete or incorrect.
            </p>
          </div>
        </section>

        <section className="safety-section" id="safety">
          <div className="section-heading">
            <div className="eyebrow">INVESTOR AWARENESS</div>
            <h2>Pause. Check. Then decide.</h2>
            <p>Keep these simple precautions in mind when evaluating an offer.</p>
          </div>

          <div className="tips-grid">
            <article className="tip-card">
              <span>01</span>
              <h3>Question guaranteed returns</h3>
              <p>Be cautious of promises of unusually high or risk-free profits.</p>
            </article>
            <article className="tip-card">
              <span>02</span>
              <h3>Verify independently</h3>
              <p>Check the organization using official sources, not just links in a message.</p>
            </article>
            <article className="tip-card">
              <span>03</span>
              <h3>Never share secret credentials</h3>
              <p>Keep your OTP, password, and UPI PIN private.</p>
            </article>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">N</span>
          <span>Nivesh<span className="brand-accent">Rakshak</span></span>
        </a>
        <p>Built for investor awareness and digital safety.</p>
        <span>© 2026 NiveshRakshak · Hackathon demo</span>
      </footer>
    </div>
  );
}

export default App;