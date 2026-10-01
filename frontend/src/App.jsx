import { useRef, useState } from "react";
import "./App.css";

const examples = [
  "Invest ₹5,000 today and get guaranteed 40% monthly returns! Limited offer. Send money now.",
  "Congratulations! You have been selected for an exclusive investment opportunity. Contact our registered advisor for details.",
];

const translations = {
  en: {
    home: "Home",
    analyzeMessage: "Analyze message",
    safetyTips: "Safety tips",
    demoMode: "Demo mode",

    digitalGuardian: "YOUR DIGITAL INVESTMENT GUARDIAN",
    heroTitle: "Invest with confidence.",
    heroTitleAccent: "Stay one step ahead.",
    heroDescription:
      "Spot suspicious investment messages before they put your money at risk. Understand warning signs and make informed decisions.",
    analyzeButton: "Analyze a message",

    messageAnalyzer: "MESSAGE ANALYZER",
    analyzerTitle: "Think it might be a scam?",
    analyzerDescription:
      "Paste the investment message or upload a screenshot to check for potential red flags.",

    screenshot: "Screenshot or image",
    analyzeScreenshot: "Analyze screenshot",
    analyzingImage: "Analyzing image...",

    messageOffer: "Message or investment offer",
    messagePlaceholder:
      "Paste a WhatsApp message, SMS, email, or investment offer here...",

    speakMessage: "Speak message",
    stopListening: "Stop Listening",

    analyzeWarning: "Analyze for warning signs",
    analyzingMessage: "Analyzing message...",

    analysisResults: "ANALYSIS RESULTS",
    whatFound: "What we found",

    investigationReport: "INVESTIGATION REPORT",
    investigationTitle: "Why this deserves attention",
    explainableAnalysis: "Explainable analysis",

    claimsDetected: "Claims detected",
    claimsDescription:
      "Claims are not treated as verified facts.",

    evidenceMessage: "Evidence from the message",
    evidenceDescription:
      "These are the specific phrases that triggered attention.",

    verificationCenter: "VERIFICATION CENTER",
    verificationTitle: "Check these points before you act",
    verificationDescription:
      "These are claims or behaviors that deserve independent verification. NiveshRakshak does not treat them as verified facts.",

    verificationQuestion: "What should I check?",
    safeNextStep: "Safe next step",

    linkAnalysis: "LINK ANALYSIS",
    urlIntelligence: "URL Intelligence",
    urlDescription:
      "The link contains characteristics that may deserve additional verification.",

    safetyCheck: "SAFETY CHECK",
    beforeYouPay: "Before You Pay",

    recommendedSafety: "Recommended safety steps",

    clearAnalysis: "Clear and analyze another message",

    investorAwareness: "INVESTOR AWARENESS",
    safetyTitle: "Pause. Check. Then decide.",
    safetyDescription:
      "Keep these simple precautions in mind when evaluating an offer.",

    tip1Title: "Question guaranteed returns",
    tip1Description:
      "Be cautious of promises of unusually high or risk-free profits.",

    tip2Title: "Verify independently",
    tip2Description:
      "Check the organization using official sources, not just links in a message.",

    tip3Title: "Never share secret credentials",
    tip3Description:
      "Keep your OTP, password, and UPI PIN private.",

    footerDescription:
      "Built for investor awareness and digital safety.",

    highRisk: "High",
    moderateRisk: "Moderate",
    lowRisk: "Low",
    needsReview: "Needs review",

    noSignals:
      "No matching warning patterns found by the current analysis rules. Do not treat this as proof that the message is legitimate.",

    investigationNoSignals:
      "No predefined warning signals were detected. This does not establish that the message is safe.",

    investigationSignals:
      "warning signal(s) were detected. Review the evidence and independently verify important claims before acting.",

    requiresVerification: "Requires independent verification",
    warningClaim: "Warning claim",

    verificationCountOne: "check",
    verificationCountMany: "checks",

    important: "Important:",
    detectedClaimNotVerified:
      "A detected claim is not the same as a verified fact. Always use independently accessed trusted sources before making financial decisions.",

    urlCountOne: "link",
    urlCountMany: "links",

    urlNoSignals:
      "No predefined URL characteristics were detected. This does not establish that the link is safe.",

    urlEvidence: "Evidence:",

    urlDisclaimer:
      "URL characteristics are signals for review, not proof that a website is fraudulent or legitimate.",

    priorityHigh: "HIGH",
    priorityCritical: "CRITICAL",
    priorityMedium: "MEDIUM",

    beforeYouPayDisclaimer:
      "These checks provide safety guidance only. They do not establish whether an offer is genuine or fraudulent.",

    extractedText: "Text detected from image",

    selected: "Selected:",

    checkAnalysisFailed: "Analysis failed",

    disclaimer:
      "This is an educational demo. Results are intended to highlight potential warning signals and should not be treated as proof that a message is fraudulent or legitimate. Always verify important claims independently.",
  },

  hi: {
    home: "होम",
    analyzeMessage: "संदेश का विश्लेषण करें",
    safetyTips: "सुरक्षा सुझाव",
    demoMode: "डेमो मोड",

    digitalGuardian: "आपका डिजिटल निवेश सुरक्षा सहायक",
    heroTitle: "विश्वास के साथ निवेश करें।",
    heroTitleAccent: "एक कदम आगे रहें।",
    heroDescription:
      "संदिग्ध निवेश संदेशों को पहचानें और अपने पैसे को जोखिम में पड़ने से पहले चेतावनी संकेत समझें।",
    analyzeButton: "संदेश का विश्लेषण करें",

    messageAnalyzer: "संदेश विश्लेषक",
    analyzerTitle: "क्या यह धोखाधड़ी हो सकती है?",
    analyzerDescription:
      "संभावित चेतावनी संकेतों की जांच करने के लिए निवेश संदेश पेस्ट करें या स्क्रीनशॉट अपलोड करें।",

    screenshot: "स्क्रीनशॉट या चित्र",
    analyzeScreenshot: "स्क्रीनशॉट का विश्लेषण करें",
    analyzingImage: "चित्र का विश्लेषण हो रहा है...",

    messageOffer: "संदेश या निवेश प्रस्ताव",
    messagePlaceholder:
      "WhatsApp संदेश, SMS, ईमेल या निवेश प्रस्ताव यहां पेस्ट करें...",

    speakMessage: "संदेश बोलें",
    stopListening: "सुनना बंद करें",

    analyzeWarning: "चेतावनी संकेतों के लिए विश्लेषण करें",
    analyzingMessage: "संदेश का विश्लेषण हो रहा है...",

    analysisResults: "विश्लेषण परिणाम",
    whatFound: "क्या पाया गया",

    investigationReport: "जांच रिपोर्ट",
    investigationTitle: "इस पर ध्यान क्यों देना चाहिए",
    explainableAnalysis: "व्याख्यात्मक विश्लेषण",

    claimsDetected: "दावे पाए गए",
    claimsDescription:
      "दावों को सत्यापित तथ्य नहीं माना जाता है।",

    evidenceMessage: "संदेश से प्राप्त प्रमाण",
    evidenceDescription:
      "ये वे विशेष शब्द या वाक्य हैं जिनसे चेतावनी मिली।",

    verificationCenter: "सत्यापन केंद्र",
    verificationTitle: "आगे बढ़ने से पहले इन बिंदुओं की जांच करें",
    verificationDescription:
      "इन दावों या व्यवहारों का स्वतंत्र रूप से सत्यापन किया जाना चाहिए। NiveshRakshak इन्हें सत्यापित तथ्य नहीं मानता।",

    verificationQuestion: "मुझे क्या जांचना चाहिए?",
    safeNextStep: "सुरक्षित अगला कदम",

    linkAnalysis: "लिंक विश्लेषण",
    urlIntelligence: "URL जानकारी",
    urlDescription:
      "इस लिंक में कुछ ऐसी विशेषताएं हैं जिनका अतिरिक्त सत्यापन आवश्यक हो सकता है।",

    safetyCheck: "सुरक्षा जांच",
    beforeYouPay: "भुगतान करने से पहले",

    recommendedSafety: "अनुशंसित सुरक्षा कदम",

    clearAnalysis: "साफ करें और दूसरा संदेश जांचें",

    investorAwareness: "निवेशक जागरूकता",
    safetyTitle: "रुकें। जांचें। फिर निर्णय लें।",
    safetyDescription:
      "किसी प्रस्ताव का मूल्यांकन करते समय इन सरल सावधानियों को ध्यान में रखें।",

    tip1Title: "गारंटीड रिटर्न पर सवाल करें",
    tip1Description:
      "बहुत अधिक या जोखिम-मुक्त मुनाफे के वादों से सावधान रहें।",

    tip2Title: "स्वतंत्र रूप से सत्यापित करें",
    tip2Description:
      "किसी संदेश में दिए गए लिंक के बजाय आधिकारिक स्रोतों से संगठन की जांच करें।",

    tip3Title: "गुप्त जानकारी कभी साझा न करें",
    tip3Description:
      "अपना OTP, पासवर्ड और UPI PIN निजी रखें।",

    footerDescription:
      "निवेशक जागरूकता और डिजिटल सुरक्षा के लिए बनाया गया।",

    highRisk: "उच्च",
    moderateRisk: "मध्यम",
    lowRisk: "कम",
    needsReview: "जांच आवश्यक",

    noSignals:
      "वर्तमान विश्लेषण नियमों में कोई निर्धारित चेतावनी पैटर्न नहीं मिला। इसे संदेश के सही या सुरक्षित होने का प्रमाण न मानें।",

    investigationNoSignals:
      "कोई निर्धारित चेतावनी संकेत नहीं मिला। इसका अर्थ यह नहीं है कि संदेश सुरक्षित है।",

    investigationSignals:
      "चेतावनी संकेत मिले हैं। प्रमाण की समीक्षा करें और महत्वपूर्ण दावों को स्वतंत्र रूप से सत्यापित करने के बाद ही आगे बढ़ें।",

    requiresVerification: "स्वतंत्र सत्यापन आवश्यक",
    warningClaim: "चेतावनी वाला दावा",

    verificationCountOne: "जांच",
    verificationCountMany: "जांचें",

    important: "महत्वपूर्ण:",

    detectedClaimNotVerified:
      "पाया गया दावा सत्यापित तथ्य के समान नहीं है। वित्तीय निर्णय लेने से पहले स्वतंत्र रूप से प्राप्त विश्वसनीय स्रोतों का उपयोग करें।",

    urlCountOne: "लिंक",
    urlCountMany: "लिंक",

    urlNoSignals:
      "कोई निर्धारित URL विशेषता नहीं मिली। इसका अर्थ यह नहीं है कि लिंक सुरक्षित है।",

    urlEvidence: "प्रमाण:",

    urlDisclaimer:
      "URL की विशेषताएं केवल समीक्षा के लिए संकेत हैं; वे किसी वेबसाइट को धोखाधड़ी वाला या वैध साबित नहीं करतीं।",

    priorityHigh: "उच्च",
    priorityCritical: "अत्यंत महत्वपूर्ण",
    priorityMedium: "मध्यम",

    beforeYouPayDisclaimer:
      "ये जांच केवल सुरक्षा मार्गदर्शन देती हैं। इनसे यह साबित नहीं होता कि कोई प्रस्ताव वास्तविक है या धोखाधड़ी वाला।",

    extractedText: "चित्र से प्राप्त टेक्स्ट",

    selected: "चयनित:",

    checkAnalysisFailed: "विश्लेषण विफल",

    disclaimer:
      "यह एक शैक्षणिक डेमो है। परिणाम संभावित चेतावनी संकेतों को दिखाने के लिए हैं और इन्हें संदेश के धोखाधड़ी वाला या वैध होने का प्रमाण नहीं माना जाना चाहिए। महत्वपूर्ण दावों को हमेशा स्वतंत्र रूप से सत्यापित करें।",
  },
};

function App() {
  const [language, setLanguage] = useState("en");

  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);

  const recognitionRef = useRef(null);
  const shouldKeepListeningRef = useRef(false);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const t = translations[language];

  // -----------------------------
  // TEXT ANALYSIS
  // -----------------------------
  async function analyzeMessage(event) {
    event.preventDefault();

    if (!message.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: message,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Unable to analyze the message."
        );
      }

      const data = await response.json();

      setResult({
        riskLevel: data.risk_level,
        summary: data.summary,
        signalCount: (data.signals || []).length,
        signals: data.signals || [],
        safetyActions: data.safety_actions || [],
        investigation: data.investigation || null,
        beforeYouPay: data.before_you_pay || null,
        urlAnalysis: data.url_analysis || null,
      });
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while analyzing the message."
      );
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // IMAGE ANALYSIS
  // -----------------------------
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

      setResult({
        riskLevel: data.risk_level,
        summary: data.summary,
        signalCount: (data.signals || []).length,
        signals: data.signals || [],
        safetyActions: data.safety_actions || [],
        extractedText: data.extracted_text || "",
        investigation: data.investigation || null,
        beforeYouPay: data.before_you_pay || null,
        urlAnalysis: data.url_analysis || null,
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

  // -----------------------------
  // RISK LOCALIZATION
  // -----------------------------
  function formatRisk(riskLevel) {
    if (riskLevel === "high") return t.highRisk;
    if (riskLevel === "medium") return t.moderateRisk;
    if (riskLevel === "low") return t.lowRisk;

    return t.needsReview;
  }

  function getRiskClass(riskLevel) {
    if (riskLevel === "high") return "high";
    if (riskLevel === "medium") return "moderate";
    if (riskLevel === "low") return "low";

    return "needs-review";
  }

  // -----------------------------
  // SUMMARY LOCALIZATION
  // -----------------------------
  function formatSummary(summary, riskLevel, signalCount) {
    if (language === "en") {
      return summary;
    }

    if (!signalCount || signalCount === 0) {
      return t.investigationNoSignals;
    }

    if (riskLevel === "high") {
      return `${signalCount} ${t.investigationSignals}`;
    }

    if (riskLevel === "medium") {
      return `${signalCount} चेतावनी संकेत मिले हैं। संदेश की सावधानीपूर्वक समीक्षा करें और महत्वपूर्ण दावों को स्वतंत्र रूप से सत्यापित करें।`;
    }

    return `${signalCount} चेतावनी संकेत मिले हैं। आगे बढ़ने से पहले संदेश और उसके दावों की जांच करें।`;
  }

  // -----------------------------
  // SIGNAL LOCALIZATION
  // -----------------------------
  function formatSignalTitle(type) {
    const titles = {
      guaranteed_return: {
        en: "Guaranteed return claims",
        hi: "गारंटीड रिटर्न का दावा",
      },

      urgency: {
        en: "Urgency and pressure",
        hi: "जल्दी करने का दबाव",
      },

      sensitive_information: {
        en: "Sensitive information request",
        hi: "संवेदनशील जानकारी की मांग",
      },

      authority_claim: {
        en: "Authority or approval claim",
        hi: "प्राधिकरण या मंजूरी का दावा",
      },
    };

    if (titles[type]) {
      return titles[type][language];
    }

    return type
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  // -----------------------------
  // CLAIM LOCALIZATION
  // -----------------------------
  function formatClaim(claim) {
    if (language === "en") {
      return claim;
    }

    const claims = {
      "SEBI approval is being claimed":
        "SEBI की मंजूरी का दावा किया जा रहा है",

      "Government approval is being claimed":
        "सरकार की मंजूरी का दावा किया जा रहा है",

      "A guaranteed or risk-free financial outcome is being claimed":
        "गारंटीड या जोखिम-मुक्त वित्तीय परिणाम का दावा किया जा रहा है",
    };

    return claims[claim] || claim;
  }

  function formatClaimStatus(status) {
    if (status === "requires_verification") {
      return t.requiresVerification;
    }

    return t.warningClaim;
  }

  // -----------------------------
  // EVIDENCE REASON LOCALIZATION
  // -----------------------------
  function formatEvidenceReason(reason) {
    if (language === "en") {
      return reason;
    }

    const reasons = {
      "The message makes an approval claim involving a regulatory authority.":
        "संदेश किसी नियामक प्राधिकरण की मंजूरी का दावा करता है।",

      "The message uses government approval as a trust signal.":
        "संदेश भरोसा पैदा करने के लिए सरकारी मंजूरी का उल्लेख करता है।",

      "The message uses certainty or risk-free language about an investment outcome.":
        "संदेश निवेश के परिणाम के बारे में निश्चित या जोखिम-मुक्त भाषा का उपयोग करता है।",

      "The message creates pressure to act quickly.":
        "संदेश जल्दी कार्रवाई करने का दबाव बनाता है।",

      "The message appears to request sensitive authentication information.":
        "संदेश संवेदनशील प्रमाणीकरण जानकारी मांगता हुआ दिखाई देता है।",
    };

    return reasons[reason] || reason;
  }

  // -----------------------------
  // VERIFICATION HELPERS
  // -----------------------------
  function formatVerificationCategory(category) {
    const categories = {
      regulatory_approval: {
        en: "REGULATORY CLAIM",
        hi: "नियामक दावा",
      },

      government_approval: {
        en: "GOVERNMENT CLAIM",
        hi: "सरकारी दावा",
      },

      return_claim: {
        en: "RETURN CLAIM",
        hi: "रिटर्न का दावा",
      },

      advisor_registration: {
        en: "ADVISOR CLAIM",
        hi: "सलाहकार का दावा",
      },

      urgency: {
        en: "URGENCY",
        hi: "जल्दबाजी",
      },

      sensitive_information: {
        en: "SECURITY",
        hi: "सुरक्षा",
      },
    };

    if (categories[category]) {
      return categories[category][language];
    }

    return category
      .replaceAll("_", " ")
      .toUpperCase();
  }

  function formatVerificationClaim(claim) {
    if (language === "en") {
      return claim;
    }

    const claims = {
      "SEBI approval is being claimed":
        "SEBI की मंजूरी का दावा किया जा रहा है",

      "Government approval is being claimed":
        "सरकारी मंजूरी का दावा किया जा रहा है",

      "A guaranteed or risk-free return is being claimed":
        "गारंटीड या जोखिम-मुक्त रिटर्न का दावा किया जा रहा है",

      "The sender claims to be a registered advisor":
        "प्रेषक स्वयं को पंजीकृत सलाहकार बताता है",

      "The message creates pressure to act quickly":
        "संदेश जल्दी कार्रवाई करने का दबाव बनाता है",

      "The message requests sensitive authentication information":
        "संदेश संवेदनशील प्रमाणीकरण जानकारी मांगता है",
    };

    return claims[claim] || claim;
  }

  function formatVerificationQuestion(question) {
    if (language === "en") {
      return question;
    }

    const questions = {
      "Is the claimed regulatory approval genuine?":
        "क्या बताई गई नियामक मंजूरी वास्तव में सही है?",

      "Is the claimed government approval genuine?":
        "क्या बताई गई सरकारी मंजूरी वास्तव में सही है?",

      "What is the basis for the claimed return?":
        "बताए गए रिटर्न का आधार क्या है?",

      "Is the person or entity actually registered?":
        "क्या व्यक्ति या संस्था वास्तव में पंजीकृत है?",

      "Can the decision safely wait for independent verification?":
        "क्या स्वतंत्र सत्यापन होने तक निर्णय को रोका जा सकता है?",

      "Is the sender asking for credentials that should remain private?":
        "क्या प्रेषक ऐसी जानकारी मांग रहा है जिसे निजी रखा जाना चाहिए?",
    };

    return questions[question] || question;
  }

  function formatVerificationAction(action) {
    if (language === "en") {
      return action;
    }

    const actions = {
      "Independently check the relevant information through an official SEBI source rather than relying on the message.":
        "संदेश पर निर्भर रहने के बजाय संबंधित जानकारी को आधिकारिक SEBI स्रोत से स्वतंत्र रूप से जांचें।",

      "Verify the claim through an independently accessed official government source.":
        "इस दावे को स्वतंत्र रूप से खोले गए आधिकारिक सरकारी स्रोत से सत्यापित करें।",

      "Do not treat guaranteed-return language as proof of safety. Independently research the investment and its risks.":
        "गारंटीड रिटर्न की भाषा को सुरक्षा का प्रमाण न मानें। निवेश और उससे जुड़े जोखिमों की स्वतंत्र रूप से जानकारी लें।",

      "Independently verify the person's or entity's registration using the relevant official source. Do not rely only on registration numbers or links provided in the message.":
        "संबंधित आधिकारिक स्रोत से व्यक्ति या संस्था का पंजीकरण स्वतंत्र रूप से जांचें। संदेश में दिए गए पंजीकरण नंबर या लिंक पर अकेले निर्भर न रहें।",

      "Pause before acting. Take time to verify the sender, claims, and payment details independently.":
        "आगे बढ़ने से पहले रुकें। प्रेषक, दावों और भुगतान विवरण को स्वतंत्र रूप से सत्यापित करने के लिए समय लें।",

      "Do not share OTPs, passwords, UPI PINs, or other authentication information.":
        "OTP, पासवर्ड, UPI PIN या अन्य प्रमाणीकरण जानकारी साझा न करें।",
    };

    return actions[action] || action;
  }

  function formatVerificationStatus(status) {
    const statuses = {
      requires_verification: {
        en: "VERIFY INDEPENDENTLY",
        hi: "स्वतंत्र रूप से सत्यापित करें",
      },

      warning: {
        en: "REVIEW CAREFULLY",
        hi: "सावधानी से समीक्षा करें",
      },

      high_priority: {
        en: "HIGH PRIORITY",
        hi: "उच्च प्राथमिकता",
      },
    };

    if (statuses[status]) {
      return statuses[status][language];
    }

    return language === "hi"
      ? "समीक्षा करें"
      : "REVIEW";
  }

  // -----------------------------
  // URL LOCALIZATION
  // -----------------------------
  function formatUrlSignalTitle(type, title) {
    if (language === "en") {
      return title;
    }

    const titles = {
      no_https: "कनेक्शन HTTPS पर नहीं है",
      ip_address: "URL में IP पता इस्तेमाल हुआ है",
      shortened_url: "Shortened URL इस्तेमाल हुआ है",
      unusual_port: "URL में असामान्य पोर्ट है",
      many_subdomains: "कई subdomains मौजूद हैं",
      investment_path: "निवेश से संबंधित URL path",
    };

    return titles[type] || title;
  }

  // -----------------------------
  // BEFORE YOU PAY LOCALIZATION
  // -----------------------------
  function formatBeforeYouPayTitle(id, title) {
    if (language === "en") {
      return title;
    }

    const titles = {
      sender: "प्रेषक को सत्यापित करें",
      authority: "प्राधिकरण के दावे को सत्यापित करें",
      returns: "गारंटीड रिटर्न के दावे पर सवाल करें",
      payment: "भुगतान करने से पहले रुकें",
      credentials: "अपनी प्रमाणीकरण जानकारी सुरक्षित रखें",
      urgency: "जल्दबाजी को निर्णय पर हावी न होने दें",
      independent: "स्वतंत्र रूप से सत्यापित करें",
    };

    return titles[id] || title;
  }

  function formatBeforeYouPayAction(id, action) {
    if (language === "en") {
      return action;
    }

    const actions = {
      sender:
        "स्वतंत्र रूप से प्राप्त आधिकारिक स्रोत से पुष्टि करें कि संदेश किसने भेजा है।",

      authority:
        "संबंधित आधिकारिक वेबसाइट से बताई गई मंजूरी या संबद्धता की जांच करें। संदेश में दिए गए लिंक या स्क्रीनशॉट पर निर्भर न रहें।",

      returns:
        "गारंटीड या जोखिम-मुक्त भाषा को निवेश की सुरक्षा का प्रमाण न मानें।",

      payment:
        "पैसे ट्रांसफर करने से पहले प्राप्तकर्ता और भुगतान विवरण की स्वतंत्र रूप से पुष्टि करें।",

      credentials:
        "OTP, पासवर्ड, UPI PIN या अन्य प्रमाणीकरण जानकारी साझा न करें।",

      urgency:
        "रुकें और कार्रवाई करने से पहले संदेश को स्वतंत्र रूप से सत्यापित करने के लिए समय लें।",

      independent:
        "संदेश में दी गई जानकारी पर निर्भर रहने के बजाय स्वतंत्र रूप से प्राप्त आधिकारिक वेबसाइट या संपर्क माध्यम का उपयोग करें।",
    };

    return actions[id] || action;
  }

  function formatPriority(priority) {
    if (priority === "critical") return t.priorityCritical;
    if (priority === "high") return t.priorityHigh;

    return t.priorityMedium;
  }

  function formatBeforeYouPayDescription(description) {
    if (language === "en") {
      return description;
    }

    return "पैसे भेजने, क्रेडेंशियल साझा करने या प्रस्ताव पर आगे बढ़ने से पहले इन सुरक्षा जांचों को पूरा करें।";
  }

  // -----------------------------
  // SAFETY ACTION LOCALIZATION
  // -----------------------------
  function formatSafetyAction(action) {
    if (language === "en") {
      return action;
    }

    const actions = {
      "Pause before making a payment.":
        "भुगतान करने से पहले रुकें।",

      "Do not share OTPs, passwords, PINs, or authentication information.":
        "OTP, पासवर्ड, PIN या प्रमाणीकरण जानकारी साझा न करें।",

      "Independently verify important claims before acting.":
        "आगे बढ़ने से पहले महत्वपूर्ण दावों को स्वतंत्र रूप से सत्यापित करें।",

      "Verify the sender independently.":
        "प्रेषक को स्वतंत्र रूप से सत्यापित करें।",

      "Do not rely only on links or contact details provided in the message.":
        "संदेश में दिए गए लिंक या संपर्क विवरण पर अकेले निर्भर न रहें।",
    };

    return actions[action] || action;
  }

  // -----------------------------
  // VOICE ANALYSIS
  // -----------------------------
  function startVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);

      setError(
        language === "hi"
          ? "इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। Chrome या Edge आज़माएं।"
          : "Voice input is not supported in this browser. Try Chrome or Edge."
      );

      return;
    }

    if (recognitionRef.current) {
      return;
    }

    setError("");

    const speech = new SpeechRecognition();

    speech.lang =
      language === "hi"
        ? "hi-IN"
        : "en-IN";

    speech.continuous = true;
    speech.interimResults = false;
    speech.maxAlternatives = 1;

    shouldKeepListeningRef.current = true;

    speech.onstart = () => {
      setIsListening(true);
      setError("");
    };

    speech.onresult = (event) => {
      let finalText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        }
      }

      if (finalText.trim()) {
        setMessage((previous) => {
          const separator = previous.trim() ? " " : "";

          return (
            previous +
            separator +
            finalText.trim()
          );
        });
      }
    };

    speech.onerror = (event) => {
      console.log(
        "Speech recognition error:",
        event.error
      );

      if (event.error === "no-speech") {
        return;
      }

      if (event.error === "not-allowed") {
        shouldKeepListeningRef.current = false;
        recognitionRef.current = null;

        setIsListening(false);

        setError(
          language === "hi"
            ? "माइक्रोफ़ोन की अनुमति नहीं दी गई। माइक्रोफ़ोन की अनुमति दें और फिर प्रयास करें।"
            : "Microphone permission was denied. Please allow microphone access and try again."
        );

        return;
      }

      if (event.error === "aborted") {
        return;
      }

      setError(
        language === "hi"
          ? `वॉइस इनपुट में समस्या हुई: ${event.error}`
          : `Voice input failed: ${event.error}`
      );
    };

    speech.onend = () => {
      if (
        shouldKeepListeningRef.current &&
        recognitionRef.current === speech
      ) {
        try {
          speech.start();
          return;
        } catch (restartError) {
          console.log(
            "Speech recognition restart failed:",
            restartError
          );
        }
      }

      recognitionRef.current = null;
      setIsListening(false);
    };

    recognitionRef.current = speech;

    try {
      speech.start();
    } catch (startError) {
      console.log(
        "Could not start speech recognition:",
        startError
      );

      recognitionRef.current = null;
      shouldKeepListeningRef.current = false;

      setIsListening(false);

      setError(
        language === "hi"
          ? "वॉइस इनपुट शुरू नहीं हो सका। कृपया फिर प्रयास करें।"
          : "Could not start voice input. Please try again."
      );
    }
  }

  function stopVoiceInput() {
    shouldKeepListeningRef.current = false;

    const speech = recognitionRef.current;

    recognitionRef.current = null;

    if (speech) {
      try {
        speech.stop();
      } catch (stopError) {
        console.log(
          "Speech recognition already stopped."
        );
      }
    }

    setIsListening(false);
  }

  function changeLanguage(nextLanguage) {
    if (isListening) {
      stopVoiceInput();
    }

    setLanguage(nextLanguage);
  }

  function clearAnalysis() {
    stopVoiceInput();

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
          <a href="#home">{t.home}</a>
          <a href="#analyzer">{t.analyzeMessage}</a>
          <a href="#safety">{t.safetyTips}</a>
        </nav>

        <div className="navbar-actions">
          <div className="language-switcher">
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => changeLanguage("en")}
            >
              EN
            </button>

            <button
              type="button"
              className={language === "hi" ? "active" : ""}
              onClick={() => changeLanguage("hi")}
            >
              हिंदी
            </button>
          </div>

          <span className="status-badge">
            <span className="status-dot" />
            {t.demoMode}
          </span>
        </div>
      </header>

      <main id="home">
        {/* HERO */}
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span>✳</span> {t.digitalGuardian}
            </div>

            <h1>
              {t.heroTitle}
              <br />
              <span>{t.heroTitleAccent}</span>
            </h1>

            <p className="hero-description">
              {t.heroDescription}
            </p>

            <a className="primary-button" href="#analyzer">
              {t.analyzeButton} <span>↗</span>
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
            <div className="eyebrow">
              {t.messageAnalyzer}
            </div>

            <h2>{t.analyzerTitle}</h2>

            <p>
              {t.analyzerDescription}
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
                {t.screenshot}
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
                  {t.selected} {file.name}
                </small>
              )}

              <button
                type="button"
                className="analyze-button"
                onClick={analyzeImage}
                disabled={!file || loading}
              >
                {loading
                  ? t.analyzingImage
                  : t.analyzeScreenshot}

                <span>→</span>
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <div className="error-message" role="alert">
                <strong>{t.checkAnalysisFailed}</strong>
                <p>{error}</p>
              </div>
            )}

            {/* TEXT ANALYSIS */}
            <form onSubmit={analyzeMessage}>
              <label htmlFor="message">
                {t.messageOffer}
              </label>

              <textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t.messagePlaceholder}
                rows={5}
              />

              <div className="input-footer">
                <span>{message.length} characters</span>

                <button
                  type="button"
                  className={`voice-button ${
                    isListening ? "listening" : ""
                  }`}
                  onClick={
                    isListening
                      ? stopVoiceInput
                      : startVoiceInput
                  }
                  disabled={!voiceSupported}
                >
                  <span>
                    {isListening ? "■" : "🎙"}
                  </span>

                  {isListening
                    ? t.stopListening
                    : t.speakMessage}
                </button>
              </div>

              <button
                className="analyze-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? t.analyzingMessage
                  : t.analyzeWarning}

                <span>→</span>
              </button>
            </form>

            {/* RESULTS */}
            {result && (
              <div className="results" aria-live="polite">
                <div className="results-heading">
                  <div>
                    <div className="eyebrow">
                      {t.analysisResults}
                    </div>

                    <h3>{t.whatFound}</h3>
                  </div>

                  <span
                    className={`risk-badge ${getRiskClass(
                      result.riskLevel
                    )}`}
                  >
                    {formatRisk(result.riskLevel)}
                  </span>
                </div>

                <p className="result-summary">
                  {formatSummary(
                    result.summary,
                    result.riskLevel,
                    result.signalCount
                  )}
                </p>

                {/* OCR TEXT */}
                {result.extractedText && (
                  <div className="extracted-text">
                    <strong>{t.extractedText}</strong>

                    <p>{result.extractedText}</p>
                  </div>
                )}

                {/* WARNING SIGNALS */}
                {result.signals.length > 0 ? (
                  <div className="signals-list">
                    {result.signals.map((signal, index) => (
                      <div
                        className="signal"
                        key={`${signal.type}-${index}`}
                      >
                        <span className="signal-icon">!</span>

                        <div>
                          <strong>
                            {formatSignalTitle(signal.type)}
                          </strong>

                          <p>{signal.evidence}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-signals">
                    {t.noSignals}
                  </div>
                )}

                {/* INVESTIGATION REPORT */}
                {result.investigation && (
                  <div className="investigation-report">
                    <div className="investigation-header">
                      <div>
                        <div className="eyebrow">
                          {t.investigationReport}
                        </div>

                        <h3>{t.investigationTitle}</h3>
                      </div>

                      <span className="investigation-badge">
                        {t.explainableAnalysis}
                      </span>
                    </div>

                    <p className="investigation-summary">
                      {result.investigation.summary
                        ? language === "en"
                          ? result.investigation.summary
                          : result.signalCount === 0
                          ? t.investigationNoSignals
                          : `${result.signalCount} ${t.investigationSignals}`
                        : formatSummary(
                            result.summary,
                            result.riskLevel,
                            result.signalCount
                          )}
                    </p>

                    {/* CLAIMS */}
                    {result.investigation.claims?.length > 0 && (
                      <div className="investigation-block">
                        <div className="investigation-block-title">
                          <span className="investigation-icon">
                            C
                          </span>

                          <div>
                            <strong>
                              {t.claimsDetected}
                            </strong>

                            <small>
                              {t.claimsDescription}
                            </small>
                          </div>
                        </div>

                        <div className="claims-list">
                          {result.investigation.claims.map(
                            (claim, index) => (
                              <div
                                className="claim-card"
                                key={`${claim.claim}-${index}`}
                              >
                                <strong>
                                  {formatClaim(claim.claim)}
                                </strong>

                                <span>
                                  {formatClaimStatus(
                                    claim.status
                                  )}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* EVIDENCE */}
                    {result.investigation.evidence?.length > 0 && (
                      <div className="investigation-block">
                        <div className="investigation-block-title">
                          <span className="investigation-icon">
                            E
                          </span>

                          <div>
                            <strong>
                              {t.evidenceMessage}
                            </strong>

                            <small>
                              {t.evidenceDescription}
                            </small>
                          </div>
                        </div>

                        <div className="evidence-list">
                          {result.investigation.evidence.map(
                            (item, index) => (
                              <div
                                className="evidence-card"
                                key={`${item.text}-${index}`}
                              >
                                <div className="evidence-quote">
                                  “{item.text}”
                                </div>

                                <p>
                                  {formatEvidenceReason(
                                    item.reason
                                  )}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* VERIFICATION CENTER */}
                    {result.investigation.verification_items?.length > 0 && (
                      <div className="verification-center">
                        <div className="verification-center-header">
                          <div>
                            <div className="eyebrow">
                              {t.verificationCenter}
                            </div>

                            <h3>
                              {t.verificationTitle}
                            </h3>

                            <p>
                              {t.verificationDescription}
                            </p>
                          </div>

                          <span className="verification-count">
                            {result.investigation.verification_items.length}{" "}
                            {result.investigation.verification_items.length ===
                            1
                              ? t.verificationCountOne
                              : t.verificationCountMany}
                          </span>
                        </div>

                        <div className="verification-items">
                          {result.investigation.verification_items.map(
                            (item, index) => (
                              <div
                                className="verification-item"
                                key={`${item.category}-${index}`}
                              >
                                <div className="verification-item-top">
                                  <span className="verification-number">
                                    {String(index + 1).padStart(2, "0")}
                                  </span>

                                  <div>
                                    <span className="verification-category">
                                      {formatVerificationCategory(
                                        item.category
                                      )}
                                    </span>

                                    <h4>
                                      {formatVerificationClaim(
                                        item.claim
                                      )}
                                    </h4>
                                  </div>
                                </div>

                                <div className="verification-question">
                                  <span>?</span>

                                  <div>
                                    <strong>
                                      {t.verificationQuestion}
                                    </strong>

                                    <p>
                                      {formatVerificationQuestion(
                                        item.question
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div className="verification-action">
                                  <span>✓</span>

                                  <div>
                                    <strong>
                                      {t.safeNextStep}
                                    </strong>

                                    <p>
                                      {formatVerificationAction(
                                        item.action
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <span
                                  className={`verification-status ${item.status}`}
                                >
                                  {formatVerificationStatus(
                                    item.status
                                  )}
                                </span>
                              </div>
                            )
                          )}
                        </div>

                        <div className="verification-disclaimer">
                          <strong>{t.important}</strong>{" "}
                          {t.detectedClaimNotVerified}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* URL INTELLIGENCE */}
                {result.urlAnalysis?.urls?.length > 0 && (
                  <section className="url-intelligence">
                    <div className="url-intelligence-header">
                      <div>
                        <span className="section-kicker">
                          {t.linkAnalysis}
                        </span>

                        <h3>
                          {t.urlIntelligence}
                        </h3>

                        <p>
                          {t.urlDescription}
                        </p>
                      </div>

                      <span className="url-count">
                        {result.urlAnalysis.urls.length}{" "}
                        {result.urlAnalysis.urls.length === 1
                          ? t.urlCountOne
                          : t.urlCountMany}
                      </span>
                    </div>

                    <div className="url-list">
                      {result.urlAnalysis.urls.map(
                        (urlInfo, index) => (
                          <div
                            className="url-card"
                            key={`${urlInfo.url}-${index}`}
                          >
                            <div className="url-card-top">
                              <span className="url-number">
                                {String(index + 1).padStart(2, "0")}
                              </span>

                              <div className="url-details">
                                <strong>
                                  {urlInfo.hostname}
                                </strong>

                                <small>
                                  {urlInfo.url}
                                </small>
                              </div>
                            </div>

                            {urlInfo.signals?.length > 0 ? (
                              <div className="url-signals">
                                {urlInfo.signals.map(
                                  (
                                    signal,
                                    signalIndex
                                  ) => (
                                    <div
                                      className="url-signal"
                                      key={`${signal.type}-${signalIndex}`}
                                    >
                                      <span className="url-signal-icon">
                                        !
                                      </span>

                                      <div>
                                        <strong>
                                          {formatUrlSignalTitle(
                                            signal.type,
                                            signal.title
                                          )}
                                        </strong>

                                        <p>
                                          {t.urlEvidence}{" "}
                                          {signal.evidence}
                                        </p>
                                      </div>

                                      <span
                                        className={`url-severity ${signal.severity}`}
                                      >
                                        {language === "hi"
                                          ? signal.severity ===
                                            "high"
                                            ? "उच्च"
                                            : signal.severity ===
                                              "medium"
                                            ? "मध्यम"
                                            : "कम"
                                          : signal.severity.toUpperCase()}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <div className="url-no-signals">
                                {t.urlNoSignals}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>

                    <div className="url-disclaimer">
                      <strong>{t.important}</strong>{" "}
                      {t.urlDisclaimer}
                    </div>
                  </section>
                )}

                {/* BEFORE YOU PAY */}
                {result.beforeYouPay && (
                  <section className="before-you-pay">
                    <div className="before-you-pay-header">
                      <div>
                        <span className="section-kicker">
                          {t.safetyCheck}
                        </span>

                        <h3>
                          {t.beforeYouPay}
                        </h3>

                        <p>
                          {formatBeforeYouPayDescription(
                            result.beforeYouPay.description
                          )}
                        </p>
                      </div>

                      <span className="before-you-pay-shield">
                        🛡
                      </span>
                    </div>

                    <div className="before-you-pay-list">
                      {result.beforeYouPay.checks?.map(
                        (check, index) => (
                          <div
                            className="before-you-pay-item"
                            key={check.id || index}
                          >
                            <div className="before-you-pay-number">
                              {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className="before-you-pay-content">
                              <div className="before-you-pay-item-top">
                                <h4>
                                  {formatBeforeYouPayTitle(
                                    check.id,
                                    check.title
                                  )}
                                </h4>

                                <span
                                  className={`before-you-pay-priority ${
                                    check.priority || "medium"
                                  }`}
                                >
                                  {formatPriority(
                                    check.priority
                                  )}
                                </span>
                              </div>

                              <p>
                                {formatBeforeYouPayAction(
                                  check.id,
                                  check.action
                                )}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {result.beforeYouPay.disclaimer && (
                      <div className="before-you-pay-disclaimer">
                        <strong>{t.important}</strong>{" "}
                        {language === "hi"
                          ? t.beforeYouPayDisclaimer
                          : result.beforeYouPay.disclaimer}
                      </div>
                    )}
                  </section>
                )}

                {/* SAFETY ACTIONS */}
                {result.safetyActions &&
                  result.safetyActions.length > 0 && (
                    <div className="safety-callout">
                      <strong>
                        {t.recommendedSafety}
                      </strong>

                      <ul>
                        {result.safetyActions.map(
                          (action, index) => (
                            <li
                              key={`${action}-${index}`}
                            >
                              {formatSafetyAction(action)}
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
                  {t.clearAnalysis}
                </button>
              </div>
            )}

            <p className="disclaimer">
              {t.disclaimer}
            </p>
          </div>
        </section>

        {/* SAFETY TIPS */}
        <section className="safety-section" id="safety">
          <div className="section-heading">
            <div className="eyebrow">
              {t.investorAwareness}
            </div>

            <h2>{t.safetyTitle}</h2>

            <p>{t.safetyDescription}</p>
          </div>

          <div className="tips-grid">
            <article className="tip-card">
              <span>01</span>

              <h3>{t.tip1Title}</h3>

              <p>{t.tip1Description}</p>
            </article>

            <article className="tip-card">
              <span>02</span>

              <h3>{t.tip2Title}</h3>

              <p>{t.tip2Description}</p>
            </article>

            <article className="tip-card">
              <span>03</span>

              <h3>{t.tip3Title}</h3>

              <p>{t.tip3Description}</p>
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

        <p>{t.footerDescription}</p>

        <span>
          © 2026 NiveshRakshak · Hackathon demo
        </span>
      </footer>
    </div>
  );
}

export default App;