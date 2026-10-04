const content = {
  en: {
    eyebrow: "YOUR DIGITAL INVESTMENT SAFETY COMPANION",
    title: "Pause. Check. ",
    accent: "Invest safer.",
    description:
      "Understand the warning signs in suspicious investment messages, online offers, and conversations before taking action.",
    primary: "Check a message",
    secondary: "Analyze a conversation",
    smallNote: "Educational risk indicators only — not financial advice.",
    visualLabel: "Investment safety illustration",
    pauseVerify: "Pause and verify",
    checkClaims: "Check claims independently",
    warningSigns: "Spot warning signs",
    reviewBeforeActing: "Review before acting",
    featuresEyebrow: "YOUR SAFETY TOOLKIT",
    featuresTitle: "How NiveshRakshak helps",
    features: [
      {
        number: "01",
        title: "Message risk check",
        text: "Review investment messages for urgency, unrealistic promises, and requests for money or sensitive information.",
      },
      {
        number: "02",
        title: "Conversation review",
        text: "Review multiple messages together to identify patterns that may deserve closer attention.",
      },
      {
        number: "03",
        title: "Learn to verify",
        text: "Find practical checks and official resources to help you verify investment-related claims independently.",
      },
    ],
    reminderTitle: "Remember before you invest",
    reminder:
      "Guaranteed high returns, pressure to act immediately, and requests for OTPs or UPI PINs are warning signs. Verify independently before sending money.",
    learn: "Learn verification steps",
    help: "Get help",
  },
  hi: {
    eyebrow: "आपकी डिजिटल निवेश सुरक्षा का साथी",
    title: "रुकें। जाँचें। ",
    accent: "सुरक्षित निवेश करें।",
    description:
      "किसी निवेश संदेश, ऑनलाइन ऑफ़र या बातचीत पर कार्रवाई करने से पहले संभावित चेतावनी संकेतों को समझें।",
    primary: "मैसेज जाँचें",
    secondary: "बातचीत जाँचें",
    smallNote: "केवल शैक्षिक जोखिम संकेत — यह वित्तीय सलाह नहीं है।",
    visualLabel: "निवेश सुरक्षा का चित्रण",
    pauseVerify: "रुकें और सत्यापित करें",
    checkClaims: "दावों की स्वतंत्र रूप से जाँच करें",
    warningSigns: "चेतावनी संकेत पहचानें",
    reviewBeforeActing: "कार्रवाई से पहले समीक्षा करें",
    featuresEyebrow: "आपके सुरक्षा उपकरण",
    featuresTitle: "निवेश रक्षक कैसे मदद करता है",
    features: [
      {
        number: "01",
        title: "मैसेज जोखिम जाँच",
        text: "जल्दबाज़ी, अवास्तविक वादों और पैसे या संवेदनशील जानकारी माँगने जैसे संकेतों की जाँच करें।",
      },
      {
        number: "02",
        title: "बातचीत की समीक्षा",
        text: "कई संदेशों को साथ में देखकर ऐसे पैटर्न पहचानें जिनकी और जाँच ज़रूरी हो सकती है।",
      },
      {
        number: "03",
        title: "सत्यापन करना सीखें",
        text: "निवेश संबंधी दावों को स्वतंत्र रूप से जाँचने के लिए उपयोगी तरीके और आधिकारिक स्रोत देखें।",
      },
    ],
    reminderTitle: "निवेश से पहले याद रखें",
    reminder:
      "बहुत अधिक निश्चित रिटर्न, तुरंत कार्रवाई का दबाव और OTP या UPI PIN माँगना चेतावनी संकेत हैं। पैसे भेजने से पहले स्वतंत्र रूप से जाँच करें।",
    learn: "सत्यापन के तरीके सीखें",
    help: "सहायता लें",
  },
};

export default function Home({
  language = "en",
  navigateTo = () => {},
}) {
  const t = content[language] || content.en;

  return (
    <div className="page-container home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="status-dot" />
            {t.eyebrow}
          </span>

          <h1>
            {t.title}
            <span className="text-accent">{t.accent}</span>
          </h1>

          <p className="hero-description">{t.description}</p>

          <div className="hero-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() => navigateTo("check")}
            >
              {t.primary} <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className="button button-secondary"
              onClick={() => navigateTo("conversation")}
            >
              {t.secondary}
            </button>
          </div>

          <p className="small-note">{t.smallNote}</p>
        </div>

        <div
          className="hero-visual"
          aria-label={t.visualLabel}
        >
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="shield-illustration">
            <span className="shield-check">✓</span>
          </div>

          <div className="floating-card floating-card-top">
            <span className="mini-icon">✓</span>
            <div>
              <strong>{t.pauseVerify}</strong>
              <small>{t.checkClaims}</small>
            </div>
          </div>

          <div className="floating-card floating-card-bottom">
            <span className="mini-icon warning-icon">!</span>
            <div>
              <strong>{t.warningSigns}</strong>
              <small>{t.reviewBeforeActing}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <span className="eyebrow">{t.featuresEyebrow}</span>
          <h2>{t.featuresTitle}</h2>
        </div>

        <div className="feature-grid">
          {t.features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reminder-panel">
        <div className="reminder-icon">i</div>
        <div>
          <h3>{t.reminderTitle}</h3>
          <p>{t.reminder}</p>
        </div>
      </section>

      <section className="quick-actions">
        <button
          type="button"
          className="quick-action"
          onClick={() => navigateTo("learn")}
        >
          <span>01</span>
          <strong>{t.learn}</strong>
          <span aria-hidden="true">↗</span>
        </button>

        <button
          type="button"
          className="quick-action"
          onClick={() => navigateTo("help")}
        >
          <span>02</span>
          <strong>{t.help}</strong>
          <span aria-hidden="true">↗</span>
        </button>
      </section>
    </div>
  );
}
