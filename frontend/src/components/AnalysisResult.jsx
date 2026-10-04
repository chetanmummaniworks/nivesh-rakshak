
import { useEffect, useRef, useState } from "react";

function getRiskDisplay(level = "unknown", hindi = false) {
  const risk = String(level).toLowerCase();

  if (risk.includes("high") || risk.includes("critical")) {
    return {
      label: hindi ? "उच्च जोखिम" : "High Risk",
      icon: "🚨",
      color: "#b42318",
      background: "#fef3f2",
    };
  }

  if (risk.includes("medium") || risk.includes("moderate")) {
    return {
      label: hindi ? "मध्यम जोखिम" : "Medium Risk",
      icon: "⚠️",
      color: "#b54708",
      background: "#fffaeb",
    };
  }

  if (risk.includes("low")) {
    return {
      label: hindi ? "कम जोखिम" : "Low Risk",
      icon: "🟢",
      color: "#067647",
      background: "#ecfdf3",
    };
  }

  return {
    label: hindi ? "जाँच आवश्यक" : "Needs Review",
    icon: "🔎",
    color: "#475467",
    background: "#f2f4f7",
  };
}

function asList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

function Section({ title, children }) {
  return (
    <section className="report-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}


function getSpeechText(result, hindi = false) {
  if (!result) return "";


  const investigation = result.investigation || {};
  const beforePay = result.before_you_pay || {};
  const risk = getRiskDisplay(
    result.risk_level || result.risk || result.classification,
    hindi
  );

  const parts = [
    hindi
      ? `निवेश रक्षक सुरक्षा रिपोर्ट। जोखिम संकेतक: ${risk.label}।`
      : `Nivesh Rakshak safety report. Risk indicator: ${risk.label}.`,
    translateReportText(result.summary || result.explanation || "", hindi),
    translateReportText(investigation.summary || "", hindi),
  ];

  const signals = asList(result.signals);
  if (signals.length) {
    parts.push(hindi ? "चेतावनी के संकेत मिले हैं।" : "Warning signals detected.");
    signals.forEach((signal) => {
      if (!signal || typeof signal !== "object") return;
      parts.push(
        `${String(signal.type || (hindi ? "चेतावनी संकेत" : "Warning signal")).replaceAll("_", " ")}.`
      );
      if (Array.isArray(signal.evidence) && signal.evidence.length) {
        parts.push(hindi ? `आपके संदेश से प्रमाण: ${signal.evidence.join(", ")}।` : `Evidence from your message: ${signal.evidence.join(", ")}.`);
      } else if (typeof signal.evidence === "string" && signal.evidence) {
        parts.push(signal.evidence);
      }
    });
  }

  const evidence = asList(investigation.evidence);
  if (evidence.length) {
    parts.push(hindi ? "प्रमाण और कारण।" : "Evidence and reasons.");
    evidence.forEach((item) => {
      if (!item || typeof item !== "object") return;
      if (item.text) parts.push(hindi ? `निष्कर्ष: ${item.text}।` : `Finding: ${item.text}.`);
      if (item.reason) parts.push(hindi ? `यह क्यों महत्वपूर्ण है: ${item.reason}।` : `Why it matters: ${item.reason}.`);
    });
  }

  const actions = asList(result.safety_actions);
  if (actions.length) {
    parts.push(hindi ? "सुझाए गए कदम।" : "Recommended actions.");
    actions.forEach((action) => parts.push(String(action)));
  }

  if (beforePay.title) {
    parts.push(beforePay.title, beforePay.description || "");
    asList(beforePay.checks).forEach((check) => {
      if (!check || typeof check !== "object") return;
      parts.push(`${check.title || (hindi ? "सुरक्षा जाँच" : "Safety check")}। ${check.action || ""}`);
    });
    if (beforePay.disclaimer) parts.push(beforePay.disclaimer);
  }

  parts.push(
    hindi ? "यह स्वचालित सुरक्षा आकलन है। यह धोखाधड़ी या सुरक्षा का प्रमाण नहीं है और वित्तीय सलाह भी नहीं है। महत्वपूर्ण दावों की स्वतंत्र रूप से पुष्टि करें।" : "This is an automated safety assessment, not proof of fraud or safety, and not financial advice. Verify important claims independently."
  );

  return parts.filter(Boolean).join(" ");
}


function getSimpleSpeechText(result, hindi = false) {
  if (!result) return "";

  const risk = getRiskDisplay(
    result.risk_level || result.risk || result.classification,
    hindi
  );
  const investigation = result.investigation || {};
  const beforePay = result.before_you_pay || {};
  const signals = asList(result.signals);
  const actions = asList(result.safety_actions);
  const checks = asList(beforePay.checks);

  const parts = [
    hindi ? "यह आपकी निवेश रक्षक सुरक्षा रिपोर्ट का सरल सारांश है।" : "Here is your simple Nivesh Rakshak safety summary.",
    hindi ? `जोखिम संकेतक ${risk.label} है।` : `The risk indicator is ${risk.label}.`,
  ];

  const summary = result.summary || result.explanation || investigation.summary;
  if (summary) parts.push(translateReportText(String(summary), hindi));

  if (signals.length) {
    parts.push(hindi ? "मुख्य चेतावनी संकेत हैं:" : "The main warning signs are:");
    signals.slice(0, 3).forEach((signal) => {
      if (!signal || typeof signal !== "object") return;
      const name = String(signal.type || (hindi ? "चेतावनी संकेत" : "warning sign"))
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
      parts.push(name + ".");
      if (Array.isArray(signal.evidence) && signal.evidence.length) {
        parts.push(hindi ? `संदेश में लिखा है: ${signal.evidence[0]}।` : `The message says: ${signal.evidence[0]}.`);
      } else if (typeof signal.evidence === "string" && signal.evidence.trim()) {
        parts.push(signal.evidence);
      }
    });
  } else {
    parts.push(hindi ? "कोई विशेष चेतावनी संकेत नहीं मिला, लेकिन इससे यह साबित नहीं होता कि संदेश सुरक्षित है।" : "No specific warning signal was detected, but that does not prove the message is safe.");
  }

  const firstAction = actions.find((action) => String(action).trim());
  if (firstAction) {
    parts.push(hindi ? "अब क्या करें।" : "What to do next.");
    parts.push(String(firstAction));
  } else if (checks.length) {
    parts.push(hindi ? "आपकी अगली सुरक्षा जाँच:" : "Your next safety check is:");
    parts.push(`${checks[0].title || "Safety check"}. ${checks[0].action || ""}`);
  } else {
    parts.push(hindi ? "दावे की स्वतंत्र रूप से जाँच करने से पहले पैसे न भेजें और संवेदनशील जानकारी साझा न करें।" : "Do not send money or share sensitive information until you have checked the claim independently.");
  }

  if (beforePay.can_proceed === false) {
    parts.push(hindi ? "भुगतान करने या जानकारी साझा करने से पहले रुकें। पहले सभी सुरक्षा जाँच पूरी करें।" : "Pause before paying or sharing information. Complete the safety checks first.");
  }

  parts.push(
    hindi ? "याद रखें, यह स्वचालित आकलन है। यह साबित नहीं करता कि संदेश धोखाधड़ी है या सुरक्षित है। महत्वपूर्ण दावों की पुष्टि स्वयं खोजे गए आधिकारिक स्रोत से करें।" : "Remember, this is an automated assessment. It is not proof that a message is fraudulent or safe. Verify important claims through an official source you find independently."
  );

  return parts.filter(Boolean).join(" ");
}


const hindiPhrases = [
  [/The message is likely high risk based on the warning signals found\./gi, "मिले चेतावनी संकेतों के आधार पर यह संदेश उच्च जोखिम वाला हो सकता है।"],
  [/The message is likely medium risk based on the warning signals found\./gi, "मिले चेतावनी संकेतों के आधार पर यह संदेश मध्यम जोखिम वाला हो सकता है।"],
  [/The message is likely low risk based on the warning signals found\./gi, "मिले चेतावनी संकेतों के आधार पर यह संदेश कम जोखिम वाला हो सकता है।"],
  [/The ML model identified this message as resembling scam messages, with an experimental scam score of ([^.]*)\./gi, "ML मॉडल के अनुसार यह संदेश धोखाधड़ी वाले संदेशों जैसा है। प्रायोगिक स्कोर: $1।"],
  [/The ML model identified this message as resembling legitimate messages, with an experimental scam score of ([^.]*)\./gi, "ML मॉडल के अनुसार यह संदेश वैध संदेशों जैसा है। प्रायोगिक स्कोर: $1।"],
  [/The ML model could not provide a reliable classification for this message\./gi, "ML मॉडल इस संदेश का विश्वसनीय वर्गीकरण नहीं कर सका।"],
  [/The model returned an experimental scam score of /gi, "मॉडल ने धोखाधड़ी का प्रायोगिक स्कोर दिया: "],
  [/The current backend maps this score to the risk indicator using provisional reference bands: below 30% is Low, 30% to below 70% is Medium, and 70% or above is High\./gi, "वर्तमान बैकएंड इस स्कोर को अस्थायी संदर्भ स्तरों से जोखिम संकेतक में बदलता है: 30% से कम कम, 30% से 70% से कम मध्यम, और 70% या अधिक उच्च।"],
  [/This explains how the displayed risk band was assigned; it does not reveal which exact words influenced the model\. The score is not a verified real-world fraud probability\./gi, "यह बताता है कि दिखाया गया जोखिम स्तर कैसे तय हुआ; इससे यह पता नहीं चलता कि किन शब्दों ने मॉडल को प्रभावित किया। यह स्कोर वास्तविक दुनिया में धोखाधड़ी की सत्यापित संभावना नहीं है।"],
  [/A model score is unavailable, so this result cannot be explained using the ML score\. Treat the risk indicator as unknown and use the checks below to verify the message independently\./gi, "मॉडल का स्कोर उपलब्ध नहीं है, इसलिए इस परिणाम को ML स्कोर से नहीं समझाया जा सकता। जोखिम संकेतक को अज्ञात मानें और संदेश की स्वतंत्र पुष्टि के लिए नीचे दी गई जाँचों का उपयोग करें।"],
  [/These are separate rule-based indicators found during analysis\. They provide context, but they are not necessarily the reasons the ML model produced its score\./gi, "विश्लेषण के दौरान नियमों से ये अलग संकेत मिले। ये संदर्भ देते हैं, लेकिन ज़रूरी नहीं कि ML मॉडल ने इन्हीं कारणों से यह स्कोर दिया हो।"],
  [/No separate rule-based warning indicators were identified\. That does not prove the message is safe, and it does not mean the model score is error-free\./gi, "नियम-आधारित कोई अलग चेतावनी संकेत नहीं मिला। इससे यह साबित नहीं होता कि संदेश सुरक्षित है या मॉडल का स्कोर त्रुटिरहित है।"],
  [/Verify the sender and any registration or investment claims using an official source you find independently\./gi, "स्वयं खोजे गए आधिकारिक स्रोत से भेजने वाले तथा पंजीकरण या निवेश संबंधी दावों की पुष्टि करें।"],
  [/Do not use contact details or payment links supplied only in the message\./gi, "केवल संदेश में दिए गए संपर्क विवरण या भुगतान लिंक का उपयोग न करें।"],
  [/Do not share OTPs, UPI PINs, passwords, or account details\./gi, "OTP, UPI PIN, पासवर्ड या खाते का विवरण साझा न करें।"],
  [/The score is an experimental model estimate, not a verified probability that this message is fraudulent\. The model can make mistakes\. Use the evidence and safety checks below, and verify claims independently\./gi, "यह स्कोर मॉडल का प्रायोगिक अनुमान है, इस बात की सत्यापित संभावना नहीं कि संदेश धोखाधड़ी है। मॉडल से गलती हो सकती है। नीचे दिए गए प्रमाण और सुरक्षा जाँच देखें तथा दावों की स्वतंत्र पुष्टि करें।"],
  [/message evidence/gi, "संदेश से प्रमाण"],
  [/Suggested questions/gi, "सुझाए गए प्रश्न"],
  [/Listen to simple safety summary/gi, "सुरक्षा सारांश सुनें"],
  [/Listen to full safety report/gi, "पूरी सुरक्षा रिपोर्ट सुनें"],
  [/Resume report audio/gi, "रिपोर्ट ऑडियो फिर शुरू करें"],
  [/Pause report audio/gi, "रिपोर्ट ऑडियो रोकें"],
  [/Stop report audio/gi, "रिपोर्ट ऑडियो बंद करें"],
  [/high reference band/gi, "उच्च संदर्भ स्तर"],
  [/^guaranteed_return$/gi, "गारंटीकृत रिटर्न का दावा"],
  [/^payment_request$/gi, "भुगतान का अनुरोध"],
  [/^high$/gi, "उच्च"],
  [/^medium$/gi, "मध्यम"],
  [/^low$/gi, "कम"],
  [/^unverified$/gi, "असत्यापित"],
  [/^warning$/gi, "चेतावनी"],
  [/^high_priority$/gi, "उच्च प्राथमिकता"],
  [/^return_guarantee$/gi, "रिटर्न की गारंटी"],
  [/^payment_call_to_action$/gi, "भुगतान करने का अनुरोध"],
  [/^return_claim$/gi, "रिटर्न का दावा"],
  [/^payment$/gi, "भुगतान"],
  [/^word char tfidf calibrated logistic regression$/gi, "Word/Character TF-IDF आधारित कैलिब्रेटेड लॉजिस्टिक रिग्रेशन मॉडल"],
  [/The ML model detected a strong scam-like text pattern\. Treat the message cautiously and independently verify the sender and claims before taking action\. This is not proof of fraud\. Supporting rule-based indicators found: (\d+)\./gi, "ML मॉडल ने संदेश में धोखाधड़ी-जैसा मज़बूत पैटर्न पाया। कोई कदम उठाने से पहले सावधानी बरतें और भेजने वाले तथा दावों की स्वतंत्र रूप से पुष्टि करें। यह धोखाधड़ी का प्रमाण नहीं है। नियम-आधारित सहायक संकेत मिले: $1।"],
  [/The ML model detected some scam-like text patterns\. Verify the sender and claims independently before taking action\./gi, "ML मॉडल ने कुछ धोखाधड़ी-जैसे टेक्स्ट पैटर्न पाए हैं। कोई कदम उठाने से पहले भेजने वाले और दावों की स्वतंत्र रूप से पुष्टि करें।"],
  [/The ML model detected fewer scam-like text patterns\. This does not establish that the message is safe; verify important claims independently\./gi, "ML मॉडल ने कम धोखाधड़ी-जैसे टेक्स्ट पैटर्न पाए हैं। इससे यह साबित नहीं होता कि संदेश सुरक्षित है। महत्वपूर्ण दावों की स्वतंत्र रूप से पुष्टि करें।"],
  [/An ML-based risk level could not be calculated\. Do not treat the message as safe; try again later or review it manually\./gi, "ML आधारित जोखिम स्तर की गणना नहीं हो सकी। संदेश को सुरक्षित न मानें। बाद में फिर कोशिश करें या इसे मैन्युअल रूप से जाँचें।"],
  [/The ML model detected a strong scam-like text pattern\. Treat the message cautiously and independently verify the sender and claims before taking action\. This is not proof of fraud\./gi, "ML मॉडल ने संदेश में धोखाधड़ी-जैसा मज़बूत पैटर्न पाया। संदेश के साथ सावधानी बरतें और कोई कदम उठाने से पहले भेजने वाले तथा दावों की स्वतंत्र रूप से पुष्टि करें। यह धोखाधड़ी का प्रमाण नहीं है।"],
  [/The message contains guaranteed, assured, fixed-return, or risk-free language about a financial outcome\./gi, "संदेश में वित्तीय परिणाम के बारे में गारंटी, आश्वासन, निश्चित रिटर्न या जोखिम-मुक्त होने जैसी भाषा है।"],
  [/^Send money$/gi, "पैसे भेजें"],
  [/^Send money$/gi, "पैसे भेजें"],
  [/Verify the sender independently\./gi, "भेजने वाले की स्वतंत्र रूप से पुष्टि करें।"],
  [/^Verify the sender independently\.$/gi, "भेजने वाले की स्वतंत्र रूप से पुष्टि करें।"],
  [/Do not treat guaranteed or risk-free return language as proof of safety\./gi, "गारंटीकृत या जोखिम-मुक्त रिटर्न के दावे को सुरक्षा का प्रमाण न मानें।"],
  [/Pause before making a payment or transferring money\./gi, "भुगतान करने या पैसे ट्रांसफर करने से पहले रुकें।"],
  [/Do not act under pressure or urgency\./gi, "दबाव या जल्दबाज़ी में कोई कदम न उठाएँ।"],
  [/Verify important claims through trusted official sources\./gi, "महत्वपूर्ण दावों की पुष्टि विश्वसनीय आधिकारिक स्रोतों से करें।"],
  [/Strong scam indicators detected\. Verify independently\./gi, "धोखाधड़ी के मज़बूत संकेत मिले हैं। स्वतंत्र रूप से पुष्टि करें।"],
  [/2 safety warning signal\(s\) were detected\. Review the evidence and verify the claims independently\./gi, "सुरक्षा से जुड़े 2 चेतावनी संकेत मिले हैं। प्रमाण देखें और दावों की स्वतंत्र रूप से पुष्टि करें।"],
  [/The message makes a guaranteed or risk-free financial claim\./gi, "संदेश में गारंटीकृत या जोखिम-मुक्त वित्तीय रिटर्न का दावा किया गया है।"],
  [/The message asks the recipient to send money or transfer funds\./gi, "संदेश प्राप्तकर्ता से पैसे भेजने या फंड ट्रांसफर करने को कहता है।"],
  [/Guaranteed or risk-free return language detected\./gi, "गारंटीकृत या जोखिम-मुक्त रिटर्न का दावा मिला।"],
  [/Investment returns are uncertain, so a guarantee deserves independent scrutiny\./gi, "निवेश पर मिलने वाला रिटर्न निश्चित नहीं होता, इसलिए किसी गारंटी की स्वतंत्र जाँच ज़रूरी है।"],
  [/The requested transfer creates a financial action that should be checked before proceeding\./gi, "पैसे ट्रांसफर करने का अनुरोध एक वित्तीय कदम है, जिसकी आगे बढ़ने से पहले जाँच करनी चाहिए।"],
  [/A guaranteed or risk-free return is being claimed\./gi, "गारंटीकृत या जोखिम-मुक्त रिटर्न का दावा किया जा रहा है।"],
  [/What evidence supports the claimed return\?/gi, "दावा किए गए रिटर्न के समर्थन में क्या प्रमाण है?"],
  [/Independently verify the provider, product, terms and stated risks\./gi, "सेवा प्रदाता, उत्पाद, शर्तों और बताए गए जोखिमों की स्वतंत्र रूप से पुष्टि करें।"],
  [/The message requests a payment or transfer\./gi, "संदेश में भुगतान या पैसे ट्रांसफर करने का अनुरोध है।"],
  [/Have the recipient and payment destination been independently verified\?/gi, "क्या प्राप्तकर्ता और भुगतान के गंतव्य की स्वतंत्र रूप से पुष्टि की गई है?"],
  [/Pause before sending money and verify the recipient through a separate trusted channel\./gi, "पैसे भेजने से पहले रुकें और किसी अलग, विश्वसनीय माध्यम से प्राप्तकर्ता की पुष्टि करें।"],
  [/The AI investigation service was unavailable\. This report uses deterministic safety rules\. The available text does not establish whether the message is genuine or fraudulent\./gi, "AI जाँच सेवा उपलब्ध नहीं थी। यह रिपोर्ट निश्चित सुरक्षा नियमों पर आधारित है। उपलब्ध संदेश से यह साबित नहीं होता कि संदेश असली है या धोखाधड़ी है।"],
  [/Your Personalized Safety Plan/gi, "आपकी व्यक्तिगत सुरक्षा योजना"],
  [/These steps are tailored to the warning signals and verification items detected in the message\. Complete the relevant checks before sending money, sharing information, or proceeding with the offer\./gi, "ये कदम संदेश में मिले चेतावनी संकेतों और सत्यापन बिंदुओं के अनुसार हैं। पैसे भेजने, जानकारी साझा करने या प्रस्ताव पर आगे बढ़ने से पहले संबंधित जाँच पूरी करें।"],
  [/Verify the sender/gi, "भेजने वाले की पुष्टि करें"],
  [/Confirm who sent the message using an official website or contact channel you find independently\. Do not rely only on the sender's name, profile, links, or screenshots\./gi, "स्वयं खोजी गई आधिकारिक वेबसाइट या संपर्क माध्यम से पुष्टि करें कि संदेश किसने भेजा है। केवल भेजने वाले के नाम, प्रोफ़ाइल, लिंक या स्क्रीनशॉट पर भरोसा न करें।"],
  [/Question guaranteed-return claims/gi, "गारंटीकृत रिटर्न के दावों पर सवाल करें"],
  [/Do not treat guaranteed, fixed, or risk-free language as proof that an investment is safe\. Ask for the full terms and independently verify the claim before making a decision\./gi, "गारंटी, निश्चित या जोखिम-मुक्त होने की भाषा को निवेश सुरक्षित होने का प्रमाण न मानें। निर्णय लेने से पहले पूरी शर्तें माँगें और दावे की स्वतंत्र रूप से पुष्टि करें।"],
  [/Pause before making a payment/gi, "भुगतान करने से पहले रुकें"],
  [/Do not transfer money while the offer or recipient is unverified\. Independently confirm the recipient and payment details using a trusted channel, not details provided only in the message\./gi, "जब तक प्रस्ताव या प्राप्तकर्ता की पुष्टि न हो, पैसे ट्रांसफर न करें। केवल संदेश में दिए गए विवरणों पर निर्भर न रहें; विश्वसनीय माध्यम से प्राप्तकर्ता और भुगतान विवरण की पुष्टि करें।"],
  [/Check the report's verification items/gi, "रिपोर्ट के सत्यापन बिंदुओं की जाँच करें"],
  [/Review each claim listed in the investigation report\. Look for confirmation from the relevant official source and note any claim you cannot independently verify\./gi, "जाँच रिपोर्ट में दिए गए प्रत्येक दावे को देखें। संबंधित आधिकारिक स्रोत से पुष्टि खोजें और जिन दावों की स्वतंत्र पुष्टि नहीं कर सकते, उन्हें नोट करें।"],
  [/Verify independently before proceeding/gi, "आगे बढ़ने से पहले स्वतंत्र रूप से पुष्टि करें"],
  [/Open the relevant official website yourself or find its contact details independently\. Avoid relying on contact details, QR codes, or links supplied only by the sender\./gi, "संबंधित आधिकारिक वेबसाइट स्वयं खोलें या संपर्क विवरण स्वतंत्र रूप से खोजें। केवल भेजने वाले द्वारा दिए गए संपर्क विवरण, QR कोड या लिंक पर भरोसा न करें।"],
  [/If you have already paid or shared information/gi, "यदि आप पहले ही भुगतान कर चुके हैं या जानकारी साझा कर चुके हैं"],
  [/Contact your bank or payment provider promptly through its official channel\. If credentials were shared, use the official service to secure the affected account\. In India, you can contact the national cybercrime helpline at 1930 or visit cybercrime\.gov\.in to report suspected cybercrime\./gi, "अपने बैंक या भुगतान सेवा प्रदाता से तुरंत उसके आधिकारिक माध्यम से संपर्क करें। यदि लॉगिन विवरण साझा किए हैं, तो आधिकारिक सेवा के माध्यम से प्रभावित खाते को सुरक्षित करें। भारत में संदिग्ध साइबर अपराध की रिपोर्ट करने के लिए राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 पर संपर्क करें या cybercrime.gov.in पर जाएँ।"],
  [/This is safety guidance, not financial advice\. Warning signals do not by themselves prove fraud, and the absence of warning signals does not prove that an offer is safe\./gi, "यह सुरक्षा मार्गदर्शन है, वित्तीय सलाह नहीं। केवल चेतावनी संकेतों से धोखाधड़ी साबित नहीं होती, और चेतावनी संकेत न मिलने से प्रस्ताव सुरक्षित साबित नहीं होता।"],
  [/high risk/gi, "उच्च जोखिम"],
  [/medium risk/gi, "मध्यम जोखिम"],
  [/low risk/gi, "कम जोखिम"],
  [/needs review/gi, "जाँच आवश्यक"],
  [/warning signal(s)? detected/gi, "चेतावनी संकेत मिले हैं"],
  [/warning signals?/gi, "चेतावनी संकेत"],
  [/supporting warning indicators/gi, "सहायक चेतावनी संकेत"],
  [/warning indicator/gi, "चेतावनी संकेत"],
  [/evidence from your message/gi, "आपके संदेश से प्रमाण"],
  [/evidence and reasons/gi, "प्रमाण और कारण"],
  [/recommended actions/gi, "सुझाए गए कदम"],
  [/what to do next/gi, "अब क्या करें"],
  [/why it matters/gi, "यह क्यों महत्वपूर्ण है"],
  [/finding/gi, "निष्कर्ष"],
  [/\\bclaim\\b/gi, "दावा"],
  [/unverified/gi, "असत्यापित"],
  [/verify independently/gi, "स्वतंत्र रूप से सत्यापित करें"],
  [/safety check/gi, "सुरक्षा जाँच"],
  [/\\breview\\b/gi, "समीक्षा करें"],
  [/\\burgent\\b/gi, "तत्काल"],
  [/guaranteed returns/gi, "गारंटीकृत रिटर्न"],
  [/guaranteed high returns/gi, "बहुत अधिक निश्चित रिटर्न"],
  [/share sensitive information/gi, "संवेदनशील जानकारी साझा करें"],
  [/do not send money/gi, "पैसे न भेजें"],
  [/do not share/gi, "साझा न करें"],
  [/verify the sender/gi, "भेजने वाले की पुष्टि करें"],
  [/official source/gi, "आधिकारिक स्रोत"],
  [/payment details/gi, "भुगतान विवरण"],
  [/investment advice/gi, "निवेश सलाह"],
  [/financial advice/gi, "वित्तीय सलाह"],
  [/automated safety assessment/gi, "स्वचालित सुरक्षा आकलन"],
  [/scam-like pattern detected/gi, "धोखाधड़ी जैसे पैटर्न का संकेत मिला"],
  [/no scam pattern detected/gi, "धोखाधड़ी जैसा कोई पैटर्न नहीं मिला"],
  [/prediction unavailable/gi, "अनुमान उपलब्ध नहीं"],
  [/low reference band/gi, "कम संदर्भ स्तर"],
  [/medium reference band/gi, "मध्यम संदर्भ स्तर"],

  // Common-chat / investigation report text returned dynamically by the backend.
  [/conversation analysis/gi, "बातचीत का विश्लेषण"],
  [/conversation review/gi, "बातचीत की समीक्षा"],
  [/messages? analyzed/gi, "विश्लेषित संदेश"],
  [/other person/gi, "दूसरा व्यक्ति"],
  [/no evidence found/gi, "कोई प्रमाण नहीं मिला"],
  [/evidence found/gi, "प्रमाण मिले"],
  [/potential scam/gi, "संभावित धोखाधड़ी"],
  [/possible fraud/gi, "संभावित धोखाधड़ी"],
  [/likely scam/gi, "धोखाधड़ी की आशंका"],
  [/not enough information/gi, "पर्याप्त जानकारी नहीं है"],
  [/insufficient information/gi, "पर्याप्त जानकारी नहीं है"],
  [/overall risk/gi, "कुल जोखिम"],
  [/risk level/gi, "जोखिम स्तर"],
  [/risk assessment/gi, "जोखिम आकलन"],
  [/investigation summary/gi, "जाँच का सारांश"],
  [/key findings/gi, "मुख्य निष्कर्ष"],
  [/verification items?/gi, "सत्यापन बिंदु"],
  [/safety actions?/gi, "सुरक्षा के कदम"],
  [/red flags?/gi, "चेतावनी संकेत"],
  [/patterns? detected/gi, "पैटर्न मिले"],
  [/no patterns? detected/gi, "कोई पैटर्न नहीं मिला"],
  [/\\bsender\\b/gi, "भेजने वाला"],
  [/recipient/gi, "प्राप्तकर्ता"],
  [/investment opportunity/gi, "निवेश का अवसर"],
  [/personal information/gi, "व्यक्तिगत जानकारी"],
  [/bank account/gi, "बैंक खाता"],
  [/payment link/gi, "भुगतान लिंक"],
  [/money transfer/gi, "पैसे का हस्तांतरण"],
  [/act immediately/gi, "तुरंत कार्रवाई करें"],
  [/limited time/gi, "सीमित समय"],
  [/guaranteed profit/gi, "गारंटीकृत मुनाफ़ा"],
  [/unrealistic promise/gi, "अवास्तविक वादा"],
  [/official registration/gi, "आधिकारिक पंजीकरण"],
  [/independent verification/gi, "स्वतंत्र पुष्टि"],
  [/not financial advice/gi, "वित्तीय सलाह नहीं"],
  [/\\bhigh\\b/gi, "उच्च"],
  [/\\bmedium\\b/gi, "मध्यम"],
  [/\\blow\\b/gi, "कम"],
  [/\\bunknown\\b/gi, "अज्ञात"],
  [/\\bdetected\\b/gi, "पता चला"],
  [/\\bavailable\\b/gi, "उपलब्ध"],
  [/\\bunavailable\\b/gi, "उपलब्ध नहीं"],
  [/\\bmessage\\b/gi, "संदेश"],
  [/\\bconversation\\b/gi, "बातचीत"],
  [/\\bsummary\\b/gi, "सारांश"],
  [/\\binvestigation\\b/gi, "जाँच"],
  [/\\bevidence\\b/gi, "प्रमाण"],
  [/\\bseverity\\b/gi, "गंभीरता"],
  [/\\bconfidence\\b/gi, "विश्वसनीयता"],
  [/\\bclaim\\b/gi, "दावा"],
  [/\\bverify\\b/gi, "पुष्टि करें"],
  [/\\bverified\\b/gi, "सत्यापित"],
  [/\\bwarning\\b/gi, "चेतावनी"],
  [/\\brisk\\b/gi, "जोखिम"],
  [/\\bpayment\\b/gi, "भुगतान"],
  [/\\btransfer\\b/gi, "हस्तांतरण"],
  [/\\burgent\\b/gi, "तत्काल"],
  [/\\bsafe\\b/gi, "सुरक्षित"],
  [/\\bunsafe\\b/gi, "असुरक्षित"],
  [/\\bfraudulent\\b/gi, "धोखाधड़ी वाला"],
  [/\\bfraud\\b/gi, "धोखाधड़ी"],
  [/\\bscam\\b/gi, "घोटाला"],
  [/\\binvestment\\b/gi, "निवेश"],
  [/\\breturn\\b/gi, "रिटर्न"],
  [/\\bsender\\b/gi, "भेजने वाला"],
  [/\\bofficial\\b/gi, "आधिकारिक"],
  [/\\bdetails\\b/gi, "विवरण"],
  [/\\baction\\b/gi, "कदम"],
  [/\\breview\\b/gi, "समीक्षा"],
  [/\\bunknown\\b/gi, "अज्ञात"],


  [/^Guaranteed or risk-free return claim$/gi, "गारंटीकृत या जोखिम-मुक्त रिटर्न का दावा"],
  [/^Direct request to transfer or send funds$/gi, "पैसे ट्रांसफर करने या भेजने का सीधा अनुरोध"],
  [/^Guaranteed Return$/gi, "गारंटीकृत रिटर्न"],
  [/^Payment Request$/gi, "भुगतान का अनुरोध"],
  [/The ML model could not provide a reliable classification for this message\.\s*This is an experimental prediction, not proof that the message is fraudulent or safe\.\s*Verify the claims independently before acting\./gi, "ML मॉडल इस संदेश का विश्वसनीय वर्गीकरण नहीं कर सका। यह एक प्रायोगिक अनुमान है, इस बात का प्रमाण नहीं कि संदेश धोखाधड़ी वाला है या सुरक्षित है। कोई कदम उठाने से पहले दावों की स्वतंत्र रूप से पुष्टि करें।"],
  [/The model returned an experimental scam score of\s*/gi, "मॉडल ने धोखाधड़ी का प्रायोगिक स्कोर दिया: "],
  [/The current backend maps this score to the risk indicator using provisional reference bands:\s*below 30% is Low,\s*30% to below 70% is Medium,\s*and 70% or above is High\./gi, "वर्तमान बैकएंड इस स्कोर के आधार पर जोखिम संकेतक तय करने के लिए अस्थायी स्तरों का उपयोग करता है: 30% से कम कम जोखिम, 30% से 70% से कम मध्यम जोखिम, और 70% या अधिक उच्च जोखिम।"],
  [/This explains how the displayed risk band was assigned;\s*it does not reveal which exact words influenced the model\.\s*The score is not a verified real-world fraud probability\./gi, "इससे पता चलता है कि दिखाया गया जोखिम स्तर कैसे तय हुआ। इससे यह पता नहीं चलता कि किन खास शब्दों ने मॉडल को प्रभावित किया। यह स्कोर वास्तविक दुनिया में धोखाधड़ी की सत्यापित संभावना नहीं है।"],
  [/These are separate rule-based indicators found during analysis\.\s*They provide context, but they are not necessarily the reasons the ML model produced its score\./gi, "ये विश्लेषण के दौरान मिले अलग नियम-आधारित संकेत हैं। ये संदर्भ देते हैं, लेकिन ज़रूरी नहीं कि ML मॉडल ने इन्हीं कारणों से अपना स्कोर दिया हो।"],
  [/Do not treat this checklist as proof that the offer is safe\.\s*Complete independent verification before considering any payment\./gi, "इस जाँच-सूची को इस बात का प्रमाण न मानें कि प्रस्ताव सुरक्षित है। भुगतान करने पर विचार करने से पहले स्वतंत्र रूप से पूरी पुष्टि करें।"],
  [/^The message contains guaranteed, assured, fixed-return, or risk-free language about a financial outcome\.$/gi, "संदेश में वित्तीय लाभ की गारंटी, आश्वासन, निश्चित रिटर्न या जोखिम-मुक्त परिणाम जैसी भाषा है।"],
  [/^The ML model identified this message as resembling scam messages, with an experimental scam score of (.*)\.$/gi, "ML मॉडल के अनुसार यह संदेश धोखाधड़ी वाले संदेशों जैसा है। प्रायोगिक धोखाधड़ी स्कोर: $1।"],
  [/^The ML model identified this message as resembling legitimate messages, with an experimental scam score of (.*)\.$/gi, "ML मॉडल के अनुसार यह संदेश वैध संदेशों जैसा है। प्रायोगिक धोखाधड़ी स्कोर: $1।"],
  [/^The ML prediction is unavailable\. Please verify the message independently before taking action\.$/gi, "ML अनुमान उपलब्ध नहीं है। कोई कदम उठाने से पहले संदेश की स्वतंत्र रूप से पुष्टि करें।"],

];

function translateReportText(value, hindi = false) {
  if (!hindi || value == null) return value;
  if (typeof value !== "string") return value;
  return hindiPhrases.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

export default function AnalysisResult({ result, language = "en" }) {
  const hindi = language === "hi";
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState({});
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState("");
  const [assistantWaiting, setAssistantWaiting] = useState(false);
  const [speechStatus, setSpeechStatus] = useState("idle");
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState("");
  const utteranceRef = useRef(null);
  const speechChunksRef = useRef([]);
  const speechIndexRef = useRef(0);
  const speechPausedRef = useRef(false);
  const speechRunIdRef = useRef(0);

  async function askAssistant(questionOverride) {
    const question = String(questionOverride ?? assistantQuestion).trim();
    if (!question || assistantLoading) return;

    setAssistantQuestion("");
    setAssistantError("");
    setAssistantMessages((previous) => [...previous, { role: "user", text: question }]);
    setAssistantLoading(true);
    setAssistantWaiting(true);

    // Keep the loading indicator visible briefly, even when a local fallback
    // answers almost instantly, for a more consistent interaction.
    const minimumLoadingTime = new Promise((resolve) => {
      window.setTimeout(resolve, 1400);
    });

    try {
      const response = await fetch("/api/assistant/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          original_text: result.original_text || result.extracted_text || result.text || "",
          analysis: {
            risk_level: result.risk_level || result.risk || result.classification || "unknown",
            summary: result.summary || result.explanation || "",
            signals: asList(result.signals),
            investigation: result.investigation || {},
            safety_actions: asList(result.safety_actions),
            before_you_pay: result.before_you_pay || {},
            url_analysis: result.url_analysis || {},
          },
          history: assistantMessages.slice(-8).map(({ role, text }) => ({ role, text })),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || "The assistant could not answer right now.");
      }
      await minimumLoadingTime;
      setAssistantMessages((previous) => [...previous, {
        role: "assistant",
        text: data.answer || "I couldn't form an answer. Please use the safety checklist and verify independently.",
        fallback: Boolean(data.fallback),
      }]);
    } catch (error) {
      await minimumLoadingTime;
      setAssistantError(error.message || "Unable to reach the assistant. Please try again.");
    } finally {
      setAssistantLoading(false);
      setAssistantWaiting(false);
    }
  }


  useEffect(() => {
    return () => {
      // Invalidate pending utterance callbacks before cancelling speech.
      speechRunIdRef.current += 1;
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      setSelectedVoiceName((current) => {
        // Keep Google Hindi as the default voice in both English and Hindi UI modes.
        // Preserve a user's manual voice choice only if it is still available.
        if (current && voices.some((voice) => voice.name === current)) return current;

        const preferred =
          voices.find((voice) => /^hi-IN$/i.test(voice.lang) && /google/i.test(voice.name)) ||
          voices.find((voice) => /^hi-IN$/i.test(voice.lang) && /हिन्दी|hindi/i.test(voice.name)) ||
          voices.find((voice) => /^hi-IN$/i.test(voice.lang));

        return preferred?.name || voices[0]?.name || "";
      });
    };

    loadVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", loadVoices);
    };
  }, [hindi]);

  useEffect(() => {
    // Stop an old report if the analysis result changes.
    speechRunIdRef.current += 1;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    speechChunksRef.current = [];
    speechIndexRef.current = 0;
    speechPausedRef.current = false;
    setSpeechStatus("idle");
  }, [result]);

  if (!result) return null;

  const speechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  function speakCurrentChunk(runId) {
    if (
      runId !== speechRunIdRef.current ||
      speechPausedRef.current
    ) {
      return;
    }

    const chunks = speechChunksRef.current;
    const index = speechIndexRef.current;

    if (index >= chunks.length) {
      utteranceRef.current = null;
      setSpeechStatus("idle");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    const chosenVoice = availableVoices.find(
      (voice) => voice.name === selectedVoiceName
    );
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang || (hindi ? "hi-IN" : "en-IN");
    } else {
      utterance.lang = hindi ? "hi-IN" : (document.documentElement.lang || "en-IN");
    }
    utterance.rate = 0.92;
    utterance.pitch = 1.02;

    utterance.onstart = () => {
      if (runId === speechRunIdRef.current) {
        setSpeechStatus("playing");
      }
    };

    utterance.onend = () => {
      if (runId !== speechRunIdRef.current) return;
      utteranceRef.current = null;
      speechIndexRef.current += 1;

      if (speechPausedRef.current) return;
      speakCurrentChunk(runId);
    };

    utterance.onerror = (event) => {
      if (runId !== speechRunIdRef.current) return;
      if (event.error === "canceled" || event.error === "interrupted") return;
      utteranceRef.current = null;
      setSpeechStatus("error");
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function startSpeech(mode = "full") {
    if (!speechSupported) {
      setSpeechStatus("unsupported");
      return;
    }

    // Invalidate callbacks from any previous playback session.
    speechRunIdRef.current += 1;
    const runId = speechRunIdRef.current;
    window.speechSynthesis.cancel();

    const fullText = mode === "simple"
      ? getSimpleSpeechText(result, hindi)
      : getSpeechText(result, hindi);
    // Short utterances are generally more reliable across browsers than
    // one very long utterance. Keep each chunk at a sentence boundary.
    speechChunksRef.current = fullText
      .match(/[^.!?。！？]+[.!?。！？]*/g)
      ?.map((chunk) => chunk.trim())
      .filter(Boolean) || [fullText];

    speechIndexRef.current = 0;
    speechPausedRef.current = false;
    utteranceRef.current = null;

    if (!fullText.trim()) {
      setSpeechStatus("idle");
      return;
    }

    setSpeechStatus("playing");
    speakCurrentChunk(runId);
  }

  function pauseSpeech() {
    if (!speechSupported) return;

    if (speechStatus === "paused") {
      speechPausedRef.current = false;
      window.speechSynthesis.resume();

      // Some browser speech engines report a paused state but fail to resume.
      // If there is no active utterance after the resume attempt, replay only
      // the current sentence rather than restarting the whole report.
      window.setTimeout(() => {
        if (
          !speechPausedRef.current &&
          !window.speechSynthesis.speaking &&
          !window.speechSynthesis.pending
        ) {
          speakCurrentChunk(speechRunIdRef.current);
        }
      }, 250);

      setSpeechStatus("playing");
      return;
    }

    if (speechStatus === "playing") {
      speechPausedRef.current = true;
      window.speechSynthesis.pause();
      setSpeechStatus("paused");
    }
  }

  function stopSpeech() {
    // Invalidate queued onend/onerror callbacks so they cannot restart speech.
    speechRunIdRef.current += 1;
    if (speechSupported) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    speechChunksRef.current = [];
    speechIndexRef.current = 0;
    speechPausedRef.current = false;
    setSpeechStatus("idle");
  }

  const investigation = result.investigation || {};
  const beforePay = result.before_you_pay || {};
  const risk = getRiskDisplay(
    result.risk_level || result.risk || result.classification,
    hindi
  );

  const summary =
    result.summary ||
    result.explanation ||
    "Review the findings and verify important claims independently.";

  // Translate known backend summaries. If a new/unrecognized English summary
  // arrives, show a clear Hindi risk summary instead of leaving the banner in English.
  const translatedSummary = translateReportText(String(summary), hindi);
  const summaryHasHindi = /[\u0900-\u097F]/.test(translatedSummary);
  const displaySummary = !hindi || summaryHasHindi
    ? translatedSummary
    : (() => {
        const level = String(
          result.risk_level || result.risk || result.classification || "unknown"
        ).toLowerCase();

        if (level.includes("high") || level.includes("critical")) {
          return "विश्लेषण में कुछ चेतावनी संकेत मिले हैं। कोई कदम उठाने से पहले भेजने वाले और दावों की स्वतंत्र रूप से पुष्टि करें। यह धोखाधड़ी का अंतिम प्रमाण नहीं है।";
        }
        if (level.includes("medium") || level.includes("moderate")) {
          return "विश्लेषण में कुछ संभावित चेतावनी संकेत मिले हैं। पैसे भेजने या जानकारी साझा करने से पहले भेजने वाले और दावों की स्वतंत्र रूप से पुष्टि करें।";
        }
        if (level.includes("low")) {
          return "विश्लेषण में कम चेतावनी संकेत मिले हैं, लेकिन इससे संदेश सुरक्षित साबित नहीं होता। महत्वपूर्ण दावों की स्वतंत्र रूप से पुष्टि करें।";
        }
        return "इस परिणाम का पूरा सारांश हिंदी में उपलब्ध नहीं है। संदेश को सुरक्षित न मानें और महत्वपूर्ण दावों की स्वतंत्र रूप से पुष्टि करें।";
      })();

  const signals = asList(result.signals);
  const claims = asList(investigation.claims);
  const evidence = asList(investigation.evidence);
  const verificationItems = asList(investigation.verification_items);
  const actions = asList(result.safety_actions);
  const checks = asList(beforePay.checks);

  const urlAnalysis = result.url_analysis || {};
  const urls = asList(urlAnalysis.urls);
  const urlSignals = asList(urlAnalysis.signals);

  // The ML score determines the displayed risk level in the current backend.
  // The score is experimental and is not a verified real-world fraud probability.
  const mlPrediction = result.ml_prediction || null;
  const mlLabel = String(mlPrediction?.label || "").toLowerCase();
  const mlProbability = Number(mlPrediction?.scam_probability);
  const hasMlProbability =
    Number.isFinite(mlProbability) && mlProbability >= 0 && mlProbability <= 1;
  const mlProbabilityPercent = hasMlProbability
    ? `${Math.round(mlProbability * 100)}%`
    : null;
  const mlRiskBand = hasMlProbability
    ? mlProbability < 0.3
      ? { label: "Low reference band", explanation: "below 30%" }
      : mlProbability < 0.7
        ? { label: "Medium reference band", explanation: "30% to below 70%" }
        : { label: "High reference band", explanation: "70% or above" }
    : null;
  const mlDisplayLabel =
    mlLabel === "scam"
      ? "Scam-like pattern detected"
      : mlLabel === "legitimate"
        ? "No scam pattern detected"
        : mlPrediction?.label
          ? String(mlPrediction.label).replaceAll("_", " ")
          : "Prediction unavailable";

  return (
    <div className="analysis-result">
      {/* QUICK RESULT: always visible */}
      <div className="analysis-result-heading">
        <div>
          <p className="analysis-eyebrow">{hindi ? "आपकी सुरक्षा जाँच" : "YOUR SAFETY CHECK"}</p>
          <h2>{hindi ? "जाँच का परिणाम" : "Analysis Result"}</h2>
        </div>
        <span className="analysis-result-icon">🔍</span>
      </div>

      <div
        className="risk-banner"
        style={{
          color: risk.color,
          backgroundColor: risk.background,
          borderColor: risk.color,
        }}
      >
        <span className="risk-banner-icon">{risk.icon}</span>
        <div>
          <p className="risk-label">{hindi ? "जोखिम संकेतक" : "Risk indicator"}</p>
          <h3>{risk.label}</h3>
          <p>{displaySummary}</p>
        </div>
      </div>

      {mlPrediction && (
        <section
          className="ml-prediction-card"
          aria-labelledby="ml-prediction-title"
        >
          <div className="ml-prediction-heading">
            <span aria-hidden="true">🧪</span>
            <div>
              <p className="analysis-eyebrow">{hindi ? "मॉडल की अतिरिक्त जाँच" : "ADDITIONAL MODEL CHECK"}</p>
              <h3 id="ml-prediction-title">{hindi ? "प्रायोगिक ML अनुमान" : "Experimental ML Prediction"}</h3>
            </div>
          </div>
          <p className="ml-prediction-label">{translateReportText(mlDisplayLabel, hindi)}</p>
          {mlProbabilityPercent && (
            <p className="ml-prediction-probability">
              {hindi ? "मॉडल द्वारा अनुमानित धोखाधड़ी की संभावना:" : "Model-estimated scam probability:"} <strong>{mlProbabilityPercent}</strong>
            </p>
          )}
          {mlRiskBand && (
            <p className="ml-prediction-band">
              {hindi ? "संदर्भ स्तर:" : "Reference band:"} <strong>{hindi ? (mlProbability < 0.3 ? "कम" : mlProbability < 0.7 ? "मध्यम" : "उच्च") : mlRiskBand.label}</strong> ({hindi ? (mlProbability < 0.3 ? "30% से कम" : mlProbability < 0.7 ? "30% से 70% से कम" : "70% या अधिक") : mlRiskBand.explanation}). {hindi ? "ये सीमाएँ अस्थायी हैं और वास्तविक धोखाधड़ी पहचान के लिए सत्यापित नहीं हैं।" : "These thresholds are provisional and have not been validated for real-world fraud detection."}
            </p>
          )}
          <p className="ml-prediction-disclaimer">
            {hindi
              ? "यह स्कोर मॉडल का प्रायोगिक अनुमान है, इस बात की सत्यापित संभावना नहीं कि संदेश धोखाधड़ी है। मॉडल से गलती हो सकती है। नीचे दिए गए प्रमाण और सुरक्षा जाँच देखें तथा दावों की स्वतंत्र पुष्टि करें।"
              : "The score is an experimental model estimate, not a verified probability that this message is fraudulent. The model can make mistakes. Use the evidence and safety checks below, and verify claims independently."}
          </p>
          {mlPrediction.model_type && (
            <p className="ml-prediction-meta">
              {hindi ? "मॉडल: " : "Model: "}{translateReportText(String(mlPrediction.model_type).replaceAll("_", " "), hindi)}
            </p>
          )}
        </section>
      )}

      <style>{`
        .ml-prediction-card {
          margin: 16px 0;
          padding: 16px;
          border: 1px solid #c7d7fe;
          border-radius: 16px;
          background: #f8faff;
          color: #172033;
        }
        .ml-prediction-heading {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ml-prediction-heading > span {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          border-radius: 12px;
          background: #e0e7ff;
          font-size: 21px;
        }
        .ml-prediction-heading h3 {
          margin: 2px 0 0;
          font-size: 17px;
        }
        .ml-prediction-card .analysis-eyebrow { margin: 0; }
        .ml-prediction-label {
          margin: 14px 0 6px;
          font-size: 16px;
          font-weight: 700;
        }
        .ml-prediction-probability { margin: 0 0 10px; }
        .ml-prediction-band {
          margin: 8px 0;
          padding: 10px 12px;
          border-radius: 10px;
          background: #eef2ff;
          font-size: 13px;
          line-height: 1.45;
        }
        .ml-prediction-disclaimer {
          margin: 10px 0 0;
          color: #475569;
          font-size: 13px;
          line-height: 1.5;
        }
        .ml-prediction-meta {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 12px;
          text-transform: capitalize;
        }
        .speech-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin: 18px 0;
          padding: 14px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
        }
        .speech-controls .speech-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 10px 16px;
          border: 1px solid transparent;
          border-radius: 11px;
          font: inherit;
          font-size: 14px;
          font-weight: 650;
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }
        .speech-controls .speech-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 5px 14px rgba(15, 23, 42, 0.12);
        }
        .speech-controls .speech-button:focus-visible {
          outline: 3px solid #93c5fd;
          outline-offset: 2px;
        }
        .speech-controls .speech-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        .speech-controls .speech-button-primary {
          color: #fff;
          background: #166534;
          border-color: #166534;
        }
        .speech-controls .speech-button-primary:hover:not(:disabled) { background: #14532d; }
        .speech-controls .speech-button-secondary {
          color: #1e40af;
          background: #fff;
          border-color: #bfdbfe;
        }
        .speech-controls .speech-button-stop {
          color: #b42318;
          background: #fff;
          border-color: #fecaca;
        }
        .speech-controls .speech-button-stop:hover:not(:disabled) { background: #fef2f2; }
        .speech-controls .speech-status {
          flex-basis: 100%;
          margin: 2px 0 0;
          color: #475569;
          font-size: 13px;
        }
        @media (max-width: 480px) {
          .speech-controls { padding: 12px; gap: 8px; }
          .speech-controls .speech-button { flex: 1 1 auto; padding: 10px 12px; }
        }

        .guided-assistant { margin: 20px 0; padding: 18px; border: 1px solid #dbe5f0; border-radius: 16px; background: #fff; color: #172033; }
        .guided-assistant-heading h3 { margin: 2px 0 6px; }
        .guided-assistant-heading p { margin: 0; color: #475569; font-size: 14px; }
        .assistant-suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0; }
        .assistant-suggestions button { border: 1px solid #bfdbfe; background: #eff6ff; color: #1e40af; border-radius: 999px; padding: 8px 11px; font: inherit; font-size: 13px; cursor: pointer; }
        .assistant-suggestions button:disabled { opacity: .55; cursor: not-allowed; }
        .assistant-chat-history { display: grid; gap: 10px; max-height: 360px; overflow-y: auto; margin: 14px 0; }
        .assistant-message { padding: 12px 14px; border-radius: 12px; overflow-wrap: anywhere; }
        .assistant-message.user { background: #eff6ff; margin-left: 8%; }
        .assistant-message.assistant { background: #f8fafc; border: 1px solid #e2e8f0; margin-right: 4%; }
        .assistant-message p { margin: 5px 0 0; white-space: pre-wrap; line-height: 1.5; }
        .assistant-message small { display: block; margin-top: 7px; color: #64748b; }
        .assistant-loading { color: #475569; font-size: 14px; display: flex; align-items: center; gap: 8px; }
        .assistant-loading-dots { display: inline-block; letter-spacing: 2px; font-weight: 800; animation: assistant-dots-pulse 1s ease-in-out infinite; }
        @keyframes assistant-dots-pulse { 0%, 100% { opacity: .35; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-2px); } }
        @media (prefers-reduced-motion: reduce) { .assistant-loading-dots { animation: none; } }
        .assistant-error { color: #b42318; font-size: 14px; }
        .assistant-question-form { display: flex; gap: 8px; }
        .assistant-question-form input { flex: 1; min-width: 0; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font: inherit; }
        .assistant-question-form button { border: 0; border-radius: 10px; padding: 0 18px; background: #166534; color: white; font: inherit; font-weight: 650; cursor: pointer; }
        .assistant-question-form button:disabled { opacity: .55; cursor: not-allowed; }
        .assistant-privacy-note { margin: 10px 0 0; color: #64748b; font-size: 12px; line-height: 1.45; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        @media (max-width: 480px) { .guided-assistant { padding: 13px; } .assistant-question-form { flex-direction: column; } .assistant-question-form button { min-height: 42px; } }
      `}</style>
      <div className="speech-controls" aria-label={hindi ? "रिपोर्ट ऑडियो नियंत्रण" : "Report audio controls"}>
        <label className="speech-voice-picker">
          <span>{hindi ? "आवाज़" : "Voice"}</span>
          <select
            value={selectedVoiceName}
            onChange={(event) => setSelectedVoiceName(event.target.value)}
            disabled={!speechSupported || availableVoices.length === 0 || speechStatus === "playing" || speechStatus === "paused"}
            aria-label={hindi ? "रिपोर्ट की आवाज़ चुनें" : "Choose report voice"}
          >
            {availableVoices.length === 0 && <option value="">{hindi ? "डिवाइस की डिफ़ॉल्ट आवाज़" : "Device default"}</option>}
            {availableVoices.map((voice) => (
              <option key={`${voice.name}-${voice.lang}`} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="speech-button speech-button-primary"
          onClick={() => startSpeech("simple")}
          disabled={!speechSupported}
          aria-label={hindi ? "सुरक्षा सारांश सुनें" : "Listen to simple safety summary"}
        >
          <span aria-hidden="true">🗣️</span> {hindi ? "सरल सारांश" : "Simple summary"}
        </button>
        <button
          type="button"
          className="speech-button speech-button-secondary"
          onClick={() => startSpeech("full")}
          disabled={!speechSupported}
          aria-label={hindi ? "पूरी सुरक्षा रिपोर्ट सुनें" : "Listen to full safety report"}
        >
          <span aria-hidden="true">🔊</span> {hindi ? "पूरी रिपोर्ट" : "Full report"}
        </button>
        <button
          type="button"
          className="speech-button speech-button-secondary"
          onClick={pauseSpeech}
          disabled={!speechSupported || !["playing", "paused"].includes(speechStatus)}
          aria-label={speechStatus === "paused" ? "Resume report audio" : "Pause report audio"}
        >
          <span aria-hidden="true">{speechStatus === "paused" ? "▶" : "⏸"}</span>
          {speechStatus === "paused" ? (hindi ? "फिर शुरू करें" : "Resume") : (hindi ? "रोकें" : "Pause")}
        </button>
        <button
          type="button"
          className="speech-button speech-button-stop"
          onClick={stopSpeech}
          disabled={!speechSupported || speechStatus === "idle"}
          aria-label={hindi ? "रिपोर्ट ऑडियो बंद करें" : "Stop report audio"}
        >
          <span aria-hidden="true">■</span> {hindi ? "बंद करें" : "Stop"}
        </button>
        <p className="speech-status" role="status" aria-live="polite">
          {speechStatus === "playing" && (hindi ? "रिपोर्ट पढ़कर सुनाई जा रही है।" : "Reading the report aloud.")}
          {speechStatus === "paused" && (hindi ? "रिपोर्ट का ऑडियो रुका हुआ है।" : "Report audio paused.")}
          {speechStatus === "unsupported" && (hindi ? "इस ब्राउज़र में आवाज़ चलाने की सुविधा उपलब्ध नहीं है।" : "Speech playback is not supported in this browser.")}
          {speechStatus === "error" && (hindi ? "ऑडियो शुरू नहीं हो सका। कृपया फिर कोशिश करें।" : "Audio playback could not start. Please try again.")}
        </p>
      </div>

      <p className="analysis-disclaimer">
        {hindi
          ? "यह स्वचालित आकलन है, धोखाधड़ी या सुरक्षा का प्रमाण नहीं। निर्णय लेने से पहले महत्वपूर्ण दावों की स्वतंत्र रूप से पुष्टि करें।"
          : "This is an automated assessment, not proof of fraud or safety. Verify important claims independently before making decisions."}
      </p>

      {/* FULL REPORT: expandable */}
      <div className="full-report">
        <button
          type="button"
          className="report-toggle"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <span>
            <strong>📋 {hindi ? "पूरी जाँच रिपोर्ट देखें" : "View Full Investigation Report"}</strong>
            <small>
              {hindi ? "प्रमाण, चेतावनी संकेत और अगले कदम" : "Evidence, warning signs and steps to take"}
            </small>
          </span>
          <span className="report-chevron">
            {expanded ? "−" : "+"}
          </span>
        </button>

        {expanded && (
          <div className="report-content">
            <Section title={hindi ? "💡 यह परिणाम क्यों?" : "💡 Why this result?"}>
              {mlPrediction && hasMlProbability ? (
                <>
                  <p>
                    {hindi
                      ? <>मॉडल ने धोखाधड़ी का प्रायोगिक स्कोर <strong>{mlProbabilityPercent}</strong> दिया। वर्तमान बैकएंड इस स्कोर के आधार पर जोखिम संकेतक तय करने के लिए अस्थायी स्तरों का उपयोग करता है: 30% से कम कम जोखिम, 30% से 70% से कम मध्यम जोखिम, और 70% या अधिक उच्च जोखिम।</>
                      : <>The model returned an experimental scam score of <strong>{mlProbabilityPercent}</strong>. The current backend maps this score to the risk indicator using provisional reference bands: below 30% is Low, 30% to below 70% is Medium, and 70% or above is High.</>}
                  </p>
                  <p>
                    {hindi
                      ? "इससे पता चलता है कि दिखाया गया जोखिम स्तर कैसे तय हुआ। इससे यह पता नहीं चलता कि किन खास शब्दों ने मॉडल को प्रभावित किया। यह स्कोर वास्तविक दुनिया में धोखाधड़ी की सत्यापित संभावना नहीं है।"
                      : "This explains how the displayed risk band was assigned; it does not reveal which exact words influenced the model. The score is not a verified real-world fraud probability."}
                  </p>
                </>
              ) : (
                <p>
                  {hindi
                    ? "मॉडल का स्कोर उपलब्ध नहीं है, इसलिए इस परिणाम को ML स्कोर से नहीं समझाया जा सकता। जोखिम संकेतक को अज्ञात मानें और संदेश की स्वतंत्र पुष्टि के लिए नीचे दी गई जाँचों का उपयोग करें।"
                    : "A model score is unavailable, so this result cannot be explained using the ML score. Treat the risk indicator as unknown and use the checks below to verify the message independently."}
                </p>
              )}
              {signals.length > 0 ? (
                <>
                  <h4>{hindi ? "सहायक चेतावनी संकेत" : "Supporting warning indicators"}</h4>
                  <p>
                    {hindi
                      ? "ये विश्लेषण के दौरान मिले अलग नियम-आधारित संकेत हैं। ये संदर्भ देते हैं, लेकिन ज़रूरी नहीं कि ML मॉडल ने इन्हीं कारणों से अपना स्कोर दिया हो।"
                      : "These are separate rule-based indicators found during analysis. They provide context, but they are not necessarily the reasons the ML model produced its score."}
                  </p>
                  <ul>
                    {signals.slice(0, 5).map((signal, index) => (
                      <li key={`why-signal-${index}`}>
                        <strong>
                          {translateReportText(String(signal.type || "Warning indicator").replaceAll("_", " "), hindi)}
                        </strong>
                        {Array.isArray(signal.evidence) && signal.evidence.length > 0
                          ? <>{hindi ? " — संदेश से प्रमाण: " : " — message evidence: "}{signal.evidence.map((item) => translateReportText(String(item), hindi)).join("; ")}</>
                          : typeof signal.evidence === "string" && signal.evidence.trim()
                            ? <> — {translateReportText(signal.evidence, hindi)}</>
                            : signal.description
                              ? <> — {translateReportText(signal.description, hindi)}</>
                              : null}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>
                  {hindi
                    ? "नियम-आधारित कोई अलग चेतावनी संकेत नहीं मिला। इससे यह साबित नहीं होता कि संदेश सुरक्षित है और न ही यह कि मॉडल का स्कोर त्रुटिरहित है।"
                    : "No separate rule-based warning indicators were identified. That does not prove the message is safe, and it does not mean the model score is error-free."}
                </p>
              )}
              <h4>{hindi ? "अब क्या करें" : "What to do next"}</h4>
              <ul>
                <li>{hindi ? "स्वयं खोजे गए आधिकारिक स्रोत से भेजने वाले तथा पंजीकरण या निवेश संबंधी दावों की पुष्टि करें।" : "Verify the sender and any registration or investment claims using an official source you find independently."}</li>
                <li>{hindi ? "केवल संदेश में दिए गए संपर्क विवरण या भुगतान लिंक का उपयोग न करें।" : "Do not use contact details or payment links supplied only in the message."}</li>
                <li>{hindi ? "OTP, UPI PIN, पासवर्ड या खाते का विवरण साझा न करें।" : "Do not share OTPs, UPI PINs, passwords, or account details."}</li>
                {actions.length > 0 && <li>{String(actions[0])}</li>}
              </ul>
            </Section>

{investigation.summary && (
  <Section title={hindi ? "📝 जाँच का सारांश" : "📝 Investigation Summary"}>
    {mlPrediction ? (
      <p>
        {hindi
          ? mlLabel === "scam"
            ? `ML मॉडल के अनुसार यह संदेश धोखाधड़ी वाले संदेशों जैसा है। प्रायोगिक धोखाधड़ी स्कोर: ${mlProbabilityPercent || "उपलब्ध नहीं"}। यह एक प्रायोगिक अनुमान है, इस बात का प्रमाण नहीं कि संदेश धोखाधड़ी वाला है या सुरक्षित है। कोई कदम उठाने से पहले दावों की स्वतंत्र रूप से पुष्टि करें।`
            : mlLabel === "legitimate"
              ? `ML मॉडल के अनुसार यह संदेश वैध संदेशों जैसा है। प्रायोगिक धोखाधड़ी स्कोर: ${mlProbabilityPercent || "उपलब्ध नहीं"}। यह एक प्रायोगिक अनुमान है, इस बात का प्रमाण नहीं कि संदेश धोखाधड़ी वाला है या सुरक्षित है। कोई कदम उठाने से पहले दावों की स्वतंत्र रूप से पुष्टि करें।`
              : "ML मॉडल इस संदेश का विश्वसनीय वर्गीकरण नहीं कर सका। यह एक प्रायोगिक अनुमान है, इस बात का प्रमाण नहीं कि संदेश धोखाधड़ी वाला है या सुरक्षित है। कोई कदम उठाने से पहले दावों की स्वतंत्र रूप से पुष्टि करें।"
          : mlLabel === "scam"
            ? `The ML model identified this message as resembling scam messages, with an experimental scam score of ${mlProbabilityPercent || "unavailable"}. This is an experimental prediction, not proof that the message is fraudulent or safe. Verify the claims independently before acting.`
            : mlLabel === "legitimate"
              ? `The ML model identified this message as resembling legitimate messages, with an experimental scam score of ${mlProbabilityPercent || "unavailable"}. This is an experimental prediction, not proof that the message is fraudulent or safe. Verify the claims independently before acting.`
              : "The ML model could not provide a reliable classification for this message. This is an experimental prediction, not proof that the message is fraudulent or safe. Verify the claims independently before acting."}
      </p>
    ) : (
      <p>
        The ML prediction is unavailable. Please verify the message
        independently before taking action.
      </p>
    )}
  </Section>
)}

            {signals.length > 0 && (
              <Section title={hindi ? "🚩 चेतावनी संकेत मिले" : "🚩 Warning Signals Detected"}>
                <div className="report-item-list">
                  {signals.map((signal, index) => (
                    <article className="report-item" key={index}>
                      <div className="report-item-heading">
                        <strong>
                          {translateReportText(String(signal.type || "Warning signal").replaceAll("_", " "), hindi)}
                        </strong>
                        <span
                          className={`severity-tag ${
                            String(signal.severity).toLowerCase()
                          }`}
                        >
                          {translateReportText(String(signal.severity || "Review"), hindi)}
                        </span>
                      </div>

{Array.isArray(signal.evidence) && signal.evidence.length > 0 ? (
  <div className="signal-evidence">
    <strong>{hindi ? "आपके संदेश से प्रमाण:" : "Evidence from your message:"}</strong>
    <ul>
      {signal.evidence.map((phrase, evidenceIndex) => (
        <li key={evidenceIndex}>
          <q>{translateReportText(String(phrase), hindi)}</q>
        </li>
      ))}
    </ul>
  </div>
) : (
  <p>
    {typeof signal.evidence === "string" && signal.evidence
      ? translateReportText(signal.evidence, hindi)
      : translateReportText(signal.description ||
        "Review this signal and verify it independently.", hindi)}
  </p>
)}
                    </article>
                  ))}
                </div>
              </Section>
            )}

            {claims.length > 0 && (
              <Section title={hindi ? "🔎 सत्यापन की आवश्यकता वाले दावे" : "🔎 Claims That Need Verification"}>
                <div className="report-item-list">
                  {claims.map((claim, index) => (
                    <article className="report-item" key={index}>
                      <p><strong>{hindi ? "दावा:" : "Claim:"}</strong> {translateReportText(claim.claim, hindi)}</p>
                      <p>
                        <strong>{hindi ? "स्थिति:" : "Status:"}</strong>{" "}
                        {translateReportText(String(claim.status || "unverified")
                          .replaceAll("_", " "), hindi)}
                      </p>
                    </article>
                  ))}
                </div>
              </Section>
            )}

            {evidence.length > 0 && (
              <Section title={hindi ? "📌 प्रमाण और कारण" : "📌 Evidence and Reasons"}>
                <div className="report-item-list">
                  {evidence.map((item, index) => (
                    <article className="report-item" key={index}>
                      <p><strong>{hindi ? "निष्कर्ष:" : "Finding:"}</strong> {translateReportText(item.text, hindi)}</p>
                      <p><strong>{hindi ? "यह क्यों महत्वपूर्ण है:" : "Why it matters:"}</strong> {translateReportText(item.reason, hindi)}</p>
                    </article>
                  ))}
                </div>
              </Section>
            )}

            {verificationItems.length > 0 && (
              <Section title={hindi ? "✅ सत्यापन के चरण" : "✅ Verification Steps"}>
                <div className="report-item-list">
                  {verificationItems.map((item, index) => (
                    <article className="report-item" key={index}>
                      <p className="step-category">
                        {hindi ? "चरण" : "STEP"} {index + 1} ·{" "}
                        {String(item.category || "VERIFY")
                          .replaceAll("_", " ")
                          .toUpperCase()}
                      </p>
                      <h4>{translateReportText(item.claim, hindi)}</h4>
                      {item.question && (
                        <p><strong>{hindi ? "खुद से पूछें:" : "Ask yourself:"}</strong> {translateReportText(item.question, hindi)}</p>
                      )}
                      {item.action && <p>{translateReportText(item.action, hindi)}</p>}
                    </article>
                  ))}
                </div>
              </Section>
            )}

            {actions.length > 0 && (
              <Section title={hindi ? "🛡️ सुझाए गए कदम" : "🛡️ Recommended Actions"}>
                <ol className="report-ordered-list">
                  {actions.map((action, index) => (
                    <li key={index}>{translateReportText(String(action), hindi)}</li>
                  ))}
                </ol>
              </Section>
            )}

            {beforePay.title && (
              <Section title={`💳 ${translateReportText(beforePay.title, hindi)}`}>
                <p>{translateReportText(beforePay.description, hindi)}</p>

                <div className="safety-checklist">
                  {checks.map((check) => (
                    <label
                      className="safety-check"
                      key={check.id}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(completed[check.id])}
                        onChange={(event) =>
                          setCompleted((previous) => ({
                            ...previous,
                            [check.id]: event.target.checked,
                          }))
                        }
                      />
                      <span>
                        <strong>{translateReportText(check.title, hindi)}</strong>
                        <small>{translateReportText(check.action, hindi)}</small>
                      </span>
                    </label>
                  ))}
                </div>

                {beforePay.can_proceed === false && (
                  <p className="report-warning">
                    {hindi
                    ? "⚠️ इस जाँच-सूची को इस बात का प्रमाण न मानें कि प्रस्ताव सुरक्षित है। भुगतान करने पर विचार करने से पहले स्वतंत्र रूप से पूरी पुष्टि करें।"
                    : "⚠️ Do not treat this checklist as proof that the offer is safe. Complete independent verification before considering any payment."}
                  </p>
                )}

                {beforePay.disclaimer && (
                  <p className="report-muted">{translateReportText(beforePay.disclaimer, hindi)}</p>
                )}
              </Section>
            )}

            {(urls.length > 0 || urlSignals.length > 0) && (
              <Section title={hindi ? "🌐 वेबसाइट और लिंक से जुड़े निष्कर्ष" : "🌐 Website and Link Findings"}>
                {urls.map((url, index) => (
                  <div className="report-item" key={index}>
                    {typeof url === "string" ? (
                      <p>{url}</p>
                    ) : (
                      <pre>{JSON.stringify(url, null, 2)}</pre>
                    )}
                  </div>
                ))}

                {urlSignals.map((signal, index) => (
                  <div className="report-item" key={index}>
                    {typeof signal === "string" ? (
                      <p>{signal}</p>
                    ) : (
                      <pre>{JSON.stringify(signal, null, 2)}</pre>
                    )}
                  </div>
                ))}
              </Section>
            )}

            <Section title={hindi ? "🔗 आधिकारिक सत्यापन स्रोत" : "🔗 Official Verification Resources"}>
              <p>
                {hindi
                  ? "निवेश संबंधी दावों की जाँच और संदिग्ध साइबर अपराध की रिपोर्ट करने के लिए आधिकारिक स्रोतों का उपयोग करें। संबंधित व्यक्ति, संस्था, पंजीकरण या दावे को स्वयं इन वेबसाइटों पर खोजें। केवल लिंक होने से कोई ऑफ़र असली साबित नहीं होता।"
                  : "Use official sources to check investment-related claims and report suspected cybercrime. Open these sites yourself and search for the relevant person, firm, registration, or claim. A link alone does not verify that an offer is genuine."}
              </p>
              <div className="report-item-list">
                <article className="report-item">
                  <strong>{hindi ? "SEBI — प्रतिभूति बाज़ार नियामक" : "SEBI — Securities market regulator"}</strong>
                  <p>{hindi ? "निवेशक संबंधी जानकारी देखें और प्रतिभूति बाज़ार के दावों की पुष्टि के लिए SEBI के आधिकारिक स्रोतों का उपयोग करें।" : "Check investor information and use SEBI's official resources to verify securities-market claims."}</p>
                  <a href="https://www.sebi.gov.in/" target="_blank" rel="noopener noreferrer">
                    {hindi ? "SEBI की आधिकारिक वेबसाइट देखें ↗" : "Visit SEBI official website ↗"}
                  </a>
                </article>
                <article className="report-item">
                  <strong>{hindi ? "NSE — नेशनल स्टॉक एक्सचेंज ऑफ़ इंडिया" : "NSE — National Stock Exchange of India"}</strong>
                  <p>{hindi ? "बाज़ार और सूचीबद्ध कंपनियों की जानकारी देखने के लिए एक्सचेंज की आधिकारिक वेबसाइट का उपयोग करें।" : "Use the exchange's official website to look up market and listed-company information."}</p>
                  <a href="https://www.nseindia.com/" target="_blank" rel="noopener noreferrer">
                    {hindi ? "NSE की आधिकारिक वेबसाइट देखें ↗" : "Visit NSE official website ↗"}
                  </a>
                </article>
                <article className="report-item">
                  <strong>{hindi ? "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल" : "National Cyber Crime Reporting Portal"}</strong>
                  <p>{hindi ? "ऑनलाइन वित्तीय धोखाधड़ी का संदेह होने पर आधिकारिक पोर्टल पर रिपोर्ट करें। भारत में साइबर वित्तीय धोखाधड़ी सहायता के लिए 1930 पर भी कॉल कर सकते हैं।" : "For suspected online financial fraud, use the official reporting portal. In India, you can also call 1930 for cyber financial fraud assistance."}</p>
                  <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">
                    {hindi ? "cybercrime.gov.in देखें ↗" : "Visit cybercrime.gov.in ↗"}
                  </a>
                </article>
              </div>
              <p className="report-muted">
                {hindi
                  ? "गोपनीयता संबंधी याद दिलाना: निवेश सत्यापित करने का दावा करने वाले किसी भी व्यक्ति के साथ OTP, UPI PIN, पासवर्ड या खाते का पूरा विवरण साझा न करें। यह रिपोर्ट केवल चेतावनी के लिए है, संदेश के धोखाधड़ी वाला या सुरक्षित होने का प्रमाण नहीं।"
                  : "Privacy reminder: never share your OTP, UPI PIN, password, or full account details with anyone offering to verify an investment. This report is a warning aid, not proof that a message is fraudulent or safe."}
              </p>
            </Section>

            {investigation.patterns?.length > 0 && (
              <Section title={hindi ? "🧩 पहचाने गए पैटर्न" : "🧩 Detected Patterns"}>
                <ul className="report-ordered-list">
                  {investigation.patterns.map((pattern, index) => (
                    <li key={index}>{translateReportText(pattern, hindi)}</li>
                  ))}
                </ul>
              </Section>
            )}

           
{(investigation.uncertainty || result.ai_available === false) && (
  <div className="report-warning">
    <strong>{hindi ? "ℹ️ इस विश्लेषण के बारे में" : "ℹ️ About this analysis"}</strong>
    <p>
      {translateReportText(
        investigation.uncertainty ||
          "The AI investigation service was unavailable. This report may rely on automated safety rules rather than an AI-generated investigation.",
        hindi
      )}
    </p>
  </div>
)}

        <section className="guided-assistant" aria-labelledby="guided-assistant-title">
          <div className="guided-assistant-heading">
            <div>
              <p className="analysis-eyebrow">{hindi ? "स्पष्टता चाहिए?" : "NEED CLARITY?"}</p>
              <h3 id="guided-assistant-title">💬 {hindi ? "निवेश रक्षक से पूछें" : "Ask Nivesh Rakshak"}</h3>
              <p>{hindi ? "इस रिपोर्ट, चेतावनी संकेतों या अगली जाँच के बारे में पूछें।" : "Ask about this report, its warning signs, or what to verify next."}</p>
            </div>
          </div>
          <div className="assistant-suggestions" aria-label={hindi ? "सुझाए गए प्रश्न" : "Suggested questions"}>
            {(hindi
              ? [
                  "इसे चिह्नित क्यों किया गया?",
                  "भुगतान से पहले मुझे क्या जाँचना चाहिए?",
                  "अगर मैंने पहले ही जानकारी साझा कर दी है तो क्या करूँ?",
                ]
              : ["Why was this flagged?", "What should I verify before paying?", "What if I already shared details?"]
            ).map((question) => (
              <button key={question} type="button" onClick={() => askAssistant(question)} disabled={assistantLoading}>
                {question}
              </button>
            ))}
          </div>
          {assistantMessages.length > 0 && (
            <div className="assistant-chat-history" aria-live="polite">
              {assistantMessages.map((message, index) => (
                <article className={`assistant-message ${message.role}`} key={`${index}-${message.role}`}>
                  <strong>{message.role === "user" ? (hindi ? "आप" : "You") : "Nivesh Rakshak"}</strong>
                  <p>{message.text}</p>
                  {message.fallback && <small>{hindi ? "सुरक्षा नियमों पर आधारित उत्तर · AI सेवा उपलब्ध नहीं" : "Safety-rule response · AI service unavailable"}</small>}
                </article>
              ))}
              {assistantLoading && (
                <p className="assistant-loading" role="status" aria-live="polite">
                  <span className="assistant-loading-dots" aria-hidden="true">•••</span>
                  {assistantWaiting ? (hindi ? "निवेश रक्षक सोच रहा है…" : "Nivesh Rakshak is thinking…") : (hindi ? "रिपोर्ट जाँची जा रही है…" : "Checking the report…")}
                </p>
              )}
            </div>
          )}
          {assistantError && <p className="assistant-error" role="alert">{assistantError}</p>}
          <form className="assistant-question-form" onSubmit={(event) => { event.preventDefault(); askAssistant(); }}>
            <label className="sr-only" htmlFor="assistant-question">{hindi ? "आपका प्रश्न" : "Your question"}</label>
            <input
              id="assistant-question"
              type="text"
              value={assistantQuestion}
              onChange={(event) => setAssistantQuestion(event.target.value)}
              placeholder={hindi ? "इस रिपोर्ट के बारे में प्रश्न पूछें…" : "Ask a question about this report…"}
              maxLength={500}
              disabled={assistantLoading}
            />
            <button type="submit" disabled={assistantLoading || !assistantQuestion.trim()}>
              {assistantLoading ? (hindi ? "सोच रहा है…" : "Thinking…") : (hindi ? "पूछें" : "Ask")}
            </button>
          </form>
          <p className="assistant-privacy-note">{hindi ? "इन प्रश्नों के उत्तर देने के लिए प्रश्न और रिपोर्ट का विवरण निवेश रक्षक बैकएंड को भेजा जाता है। पासवर्ड, OTP, PIN या खाता नंबर न लिखें।" : "Questions are sent to the Nivesh Rakshak backend to answer using this report. Do not enter passwords, OTPs, PINs or account numbers."}</p>
        </section>

            <p className="analysis-disclaimer">
              {hindi
                ? "यह रिपोर्ट सुरक्षा संबंधी मार्गदर्शन देती है, वित्तीय सलाह नहीं। निष्कर्ष यह साबित नहीं करते कि संदेश असली है या धोखाधड़ी। स्वतंत्र रूप से प्राप्त आधिकारिक स्रोतों से भेजने वाले, दावों और भुगतान विवरण की पुष्टि करें।"
                : "This report provides safety guidance, not financial advice. The findings do not establish whether a message is genuine or fraudulent. Verify the sender, claims and payment details using independently accessed official sources."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}