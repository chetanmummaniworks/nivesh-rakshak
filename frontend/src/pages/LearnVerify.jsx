import { useState } from "react";

const resources = [
  {
    title: "SEBI Investor",
    description:
      "Learn about investor rights, common investment risks, and ways to make informed decisions.",
    url: "https://investor.sebi.gov.in/",
    label: "Open SEBI Investor",
    hiTitle: "SEBI Investor",
    hiDescription: "निवेशक शिक्षा के लिए SEBI के संसाधन देखें।",
    hiLabel: "SEBI निवेशक पोर्टल खोलें",
  },
  {
    title: "SEBI registered intermediaries",
    description:
      "Use SEBI's official resources to check registration details. Match the information independently.",
    url: "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes",
    label: "Check registration",
    hiTitle: "SEBI registered intermediaries",
    hiDescription: "पंजीकरण विवरण के लिए SEBI के आधिकारिक संसाधन देखें और जानकारी की स्वतंत्र पुष्टि करें।",
    hiLabel: "पंजीकरण जाँचें",
  },
  {
    title: "National Cyber Crime Reporting Portal",
    description:
      "Use the official government portal to report suspected cybercrime.",
    url: "https://www.cybercrime.gov.in/",
    label: "Open reporting portal",
    hiTitle: "National Cyber Crime Reporting Portal",
    hiDescription: "संदिग्ध साइबर अपराध की रिपोर्ट करने के लिए आधिकारिक सरकारी पोर्टल का उपयोग करें।",
    hiLabel: "रिपोर्टिंग पोर्टल खोलें",
  },
];

const checks = [
  {
    title: "Check registration independently",
    text: "Look up the intermediary using an official regulator's website. Do not rely only on a screenshot or registration number sent by a stranger.",
    hiTitle: "स्वतंत्र रूप से पंजीकरण जाँचें",
    hiText: "आधिकारिक नियामक की वेबसाइट पर मध्यस्थ का विवरण खोजें। केवल किसी अजनबी द्वारा भेजे गए स्क्रीनशॉट या पंजीकरण संख्या पर भरोसा न करें।",
  },
  {
    title: "Be cautious of guaranteed returns",
    text: "Claims of unusually high or guaranteed profits with little or no risk deserve careful scrutiny.",
    hiTitle: "गारंटीड रिटर्न के दावों से सावधान रहें",
    hiText: "बहुत कम या बिना जोखिम के असामान्य रूप से अधिक या गारंटीड मुनाफ़े के दावों की सावधानी से जाँच करें।",
  },
  {
    title: "Resist urgency and pressure",
    text: "Pause if someone says you must transfer money immediately or lose a special opportunity.",
    hiTitle: "जल्दबाज़ी और दबाव में निर्णय न लें",
    hiText: "यदि कोई तुरंत पैसे भेजने या विशेष अवसर खोने की बात कहता है, तो रुकें और जाँच करें।",
  },
  {
    title: "Protect sensitive information",
    text: "Never share your OTP, password, UPI PIN, or remote access to your device with someone offering investment help.",
    hiTitle: "संवेदनशील जानकारी सुरक्षित रखें",
    hiText: "OTP, पासवर्ड, UPI PIN या अपने डिवाइस का रिमोट एक्सेस किसी के साथ साझा न करें।",
  },
  {
    title: "Verify payment details",
    text: "Check who receives the money. Be cautious if you are asked to pay a personal account for an investment service.",
    hiTitle: "भुगतान विवरण सत्यापित करें",
    hiText: "जाँचें कि पैसा किसे मिल रहा है। निवेश सेवा के लिए किसी व्यक्ति के निजी खाते में भुगतान माँगे जाने पर सावधान रहें।",
  },
  {
    title: "Use contact details you find yourself",
    text: "Open official websites directly instead of relying on links, phone numbers, or QR codes sent by an unknown person.",
    hiTitle: "संपर्क विवरण स्वयं खोजें",
    hiText: "अज्ञात व्यक्ति द्वारा भेजे गए लिंक, फोन नंबर या QR कोड पर निर्भर रहने के बजाय आधिकारिक वेबसाइट स्वयं खोलें।",
  },
];

const quizQuestions = [
  {
    scenario:
      "A message promises to double your money in 20 days with “zero risk” and asks you to join a private investment group.",
    question: "What is the safest next step?",
    options: [
      "Join quickly before the opportunity closes",
      "Treat the promise as a warning sign and verify the firm and offer independently",
      "Trust it if the group has many members",
      "Send a small amount first to test it",
    ],
    correctIndex: 1,
    hiScenario: "एक संदेश 20 दिनों में पैसे दोगुने करने का “बिना जोखिम” वादा करता है और निजी निवेश समूह में शामिल होने को कहता है।",
    hiQuestion: "सबसे सुरक्षित अगला कदम क्या है?",
    hiOptions: ["अवसर खत्म होने से पहले जल्दी शामिल हो जाएँ", "इस वादे को चेतावनी संकेत मानें और कंपनी तथा ऑफ़र की स्वतंत्र जाँच करें", "यदि समूह में बहुत सदस्य हैं तो भरोसा करें", "पहले जाँचने के लिए थोड़ी रकम भेजें"],
    hiExplanation: "बहुत अधिक या गारंटीड रिटर्न के दावे चेतावनी संकेत हैं। ऑफ़र जाँचने के लिए पैसे न भेजें। स्वयं खोजे गए आधिकारिक स्रोतों से कंपनी और दावों की जाँच करें।",
    explanation:
      "Unusually high or guaranteed returns with little or no risk are warning signs. Do not pay to test an offer. Check the firm and claims using official sources you find yourself.",
  },
  {
    scenario:
      "Someone claiming to be your investment adviser messages you from a new number and asks for your OTP to “secure” your account.",
    question: "What should you do?",
    options: [
      "Share the OTP if they know your name",
      "Share only half the OTP",
      "Do not share it; contact the adviser using contact details you independently verify",
      "Send your UPI PIN instead",
    ],
    correctIndex: 2,
    hiScenario: "आपका निवेश सलाहकार होने का दावा करने वाला व्यक्ति नए नंबर से संदेश भेजता है और खाता “सुरक्षित” करने के लिए OTP माँगता है।",
    hiQuestion: "आपको क्या करना चाहिए?",
    hiOptions: ["यदि उसे आपका नाम पता है तो OTP साझा करें", "OTP का केवल आधा हिस्सा साझा करें", "OTP साझा न करें; स्वतंत्र रूप से सत्यापित संपर्क विवरण से सलाहकार से संपर्क करें", "इसके बजाय अपना UPI PIN भेजें"],
    hiExplanation: "OTP, पासवर्ड या UPI PIN कभी साझा न करें। परिचित नाम या प्रोफ़ाइल तस्वीर से पहचान साबित नहीं होती। स्वयं खोजे गए संपर्क माध्यम से पुष्टि करें।",
    explanation:
      "Never share an OTP, password, or UPI PIN. A familiar name or profile picture does not prove who is contacting you. Verify through a contact method you find independently.",
  },
  {
    scenario:
      "An online group says you must transfer money to an individual's personal bank account within 10 minutes or lose a special allocation.",
    question: "Which response is safest?",
    options: [
      "Pause and independently verify the offer and recipient before taking any action",
      "Pay immediately because the deadline is short",
      "Ask the group admin to send a screenshot of their ID and then pay",
      "Transfer the money to reserve your place, then verify later",
    ],
    correctIndex: 0,
    hiScenario: "एक ऑनलाइन समूह कहता है कि विशेष अवसर पाने के लिए 10 मिनट में किसी व्यक्ति के निजी बैंक खाते में पैसे भेजने होंगे।",
    hiQuestion: "सबसे सुरक्षित प्रतिक्रिया क्या है?",
    hiOptions: ["कोई कदम उठाने से पहले ऑफ़र और प्राप्तकर्ता की स्वतंत्र जाँच करें", "समय कम है, इसलिए तुरंत भुगतान करें", "एडमिन से ID का स्क्रीनशॉट माँगकर भुगतान करें", "पहले पैसे भेजें और बाद में जाँच करें"],
    hiExplanation: "जल्दबाज़ी और निजी खाते में भुगतान की माँग की सावधानी से जाँच करें। स्क्रीनशॉट और पहचान-पत्र भ्रामक हो सकते हैं। भुगतान पर विचार करने से पहले प्राप्तकर्ता और ऑफ़र की स्वतंत्र पुष्टि करें।",
    explanation:
      "Urgency and payment to a personal account deserve scrutiny. Screenshots and IDs sent by the same person can be misleading. Verify the recipient and offer independently before considering payment.",
  },
  {
    scenario:
      "A website displays a registration certificate and says this proves its investment plan cannot lose money.",
    question: "What does the certificate prove?",
    options: [
      "It guarantees profits",
      "It proves every message from the website is genuine",
      "Nothing needs to be checked further",
      "The claim still needs independent verification; registration does not guarantee profits",
    ],
    correctIndex: 3,
    hiScenario: "एक वेबसाइट पंजीकरण प्रमाणपत्र दिखाती है और कहती है कि इससे साबित होता है कि उसकी निवेश योजना में नुकसान नहीं हो सकता।",
    hiQuestion: "प्रमाणपत्र क्या साबित करता है?",
    hiOptions: ["यह मुनाफ़े की गारंटी देता है", "यह साबित करता है कि वेबसाइट का हर संदेश असली है", "अब आगे कुछ जाँचने की ज़रूरत नहीं", "दावे की स्वतंत्र जाँच ज़रूरी है; पंजीकरण मुनाफ़े की गारंटी नहीं देता"],
    hiExplanation: "प्रमाणपत्र या पंजीकरण संख्या की नकल की जा सकती है या उसका दुरुपयोग हो सकता है। संबंधित आधिकारिक नियामक से सीधे विवरण जाँचें। पंजीकरण रिटर्न की गारंटी नहीं देता।",
    explanation:
      "A certificate or registration number can be copied or misused. Check details directly through the relevant official regulator, and remember that registration does not guarantee returns or make every offer safe.",
  },
  {
    scenario:
      "You think you may have been tricked into making an online investment payment in India.",
    question: "What should you do next?",
    options: [
      "Pay an additional “recovery fee” to get the money back",
      "Keep communicating only with the person who contacted you",
      "Contact your bank/payment provider promptly and report the suspected cyber financial fraud through official channels; 1930 may be used in India",
      "Share your banking password with a recovery agent",
    ],
    correctIndex: 2,
    hiScenario: "आपको लगता है कि भारत में ऑनलाइन निवेश भुगतान के ज़रिए आपके साथ धोखा हुआ हो सकता है।",
    hiQuestion: "अब आपको क्या करना चाहिए?",
    hiOptions: ["पैसे वापस पाने के लिए अतिरिक्त “रिकवरी शुल्क” दें", "केवल संपर्क करने वाले व्यक्ति से बात करते रहें", "तुरंत बैंक/भुगतान सेवा प्रदाता से संपर्क करें और आधिकारिक माध्यम से रिपोर्ट करें; भारत में 1930 का उपयोग किया जा सकता है", "रिकवरी एजेंट के साथ बैंकिंग पासवर्ड साझा करें"],
    hiExplanation: "रिकवरी शुल्क न दें और लॉगिन विवरण साझा न करें। तुरंत बैंक या भुगतान सेवा प्रदाता से संपर्क करें और cybercrime.gov.in जैसे आधिकारिक माध्यमों का उपयोग करें। भारत में साइबर वित्तीय धोखाधड़ी सहायता के लिए 1930 पर कॉल किया जा सकता है।",
    explanation:
      "Do not pay recovery fees or share credentials. Contact your bank or payment provider promptly and use official reporting channels such as cybercrime.gov.in. In India, call 1930 for cyber financial fraud assistance.",
  },
];

function Section({ title, children }) {
  return (
    <section className="learn-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export default function LearnVerify({ language = "en", navigateTo }) {
  const hindi = language === "hi";
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = quizQuestions[currentQuestion];
  const answeredCount = Object.keys(selectedAnswers).length;
  const score = quizQuestions.reduce(
    (total, item, index) =>
      total + (selectedAnswers[index] === item.correctIndex ? 1 : 0),
    0
  );

  function startQuiz() {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setShowFeedback(false);
    setQuizFinished(false);
    setQuizStarted(true);
  }

  function chooseAnswer(index) {
    if (showFeedback) return;
    setSelectedAnswers((previous) => ({ ...previous, [currentQuestion]: index }));
    setShowFeedback(true);
  }

  function nextQuestion() {
    if (currentQuestion >= quizQuestions.length - 1) {
      setQuizFinished(true);
      return;
    }
    setCurrentQuestion((previous) => previous + 1);
    setShowFeedback(false);
  }

  return (
    <div className="page-container content-page">
      <div className="page-heading">
        <span className="eyebrow">
          {hindi ? "जानकारी और सत्यापन" : "LEARN AND VERIFY"}
        </span>
        <h1>
          {hindi
            ? "निवेश से पहले स्वतंत्र रूप से जाँचें"
            : "Verify before you trust"}
        </h1>
        <p>
          {hindi
            ? "किसी भी ऑफ़र पर भरोसा करने से पहले इन व्यावहारिक चरणों का उपयोग करें।"
            : "Use these practical checks before trusting an investment offer, adviser, or website."}
        </p>
      </div>

      <section className="sebi-intro-section">
        <div className="sebi-intro-heading">
          <div className="sebi-icon">🛡️</div>
          <div>
            <h2>{hindi ? "SEBI को जानें" : "Know SEBI"}</h2>
            <p>{hindi ? "सुरक्षित निवेश के लिए मार्गदर्शिका" : "Your guide to safer investing"}</p>
          </div>
        </div>

        <div className="sebi-meaning">
          <h3>{hindi ? "SEBI क्या है?" : "What is SEBI?"}</h3>
          <p>
            {hindi ? "SEBI का पूरा नाम भारतीय प्रतिभूति और विनिमय बोर्ड है। यह भारत के प्रतिभूति बाज़ार का नियामक है। इसके कार्यों में निवेशकों की सुरक्षा और प्रतिभूति बाज़ार का नियमन शामिल है।" : "SEBI stands for Securities and Exchange Board of India. It is India’s stock market regulator. Its job includes protecting investors and regulating the securities market."}
          </p>
        </div>

        <h3>{hindi ? "SEBI आपकी कैसे मदद कर सकता है?" : "How can SEBI help you?"}</h3>
        <div className="sebi-examples">
          <article className="sebi-example">
            <span>🔎</span>
            <h4>{hindi ? "सलाहकार की पुष्टि करें" : "Verify an adviser"}</h4>
            <p>
              {hindi ? "शुल्क लेकर निवेश सलाह देने वाले व्यक्ति पर भरोसा करने से पहले आधिकारिक रिकॉर्ड जाँचें।" : "Check official records before trusting someone who offers paid investment advice."}
            </p>
          </article>
          <article className="sebi-example">
            <span>⚠️</span>
            <h4>{hindi ? "चेतावनी संकेत पहचानें" : "Spot warning signs"}</h4>
            <p>
              {hindi ? "गारंटीड मुनाफ़े का वादा करने या तुरंत निवेश का दबाव डालने वाले संदेशों से सावधान रहें।" : "Be cautious of messages promising guaranteed profits or pressuring you to invest immediately."}
            </p>
          </article>
          <article className="sebi-example">
            <span>📩</span>
            <h4>{hindi ? "शिकायत कहाँ करें" : "Know where to complain"}</h4>
            <p>
              {hindi ? "नियंत्रित प्रतिभूति-बाज़ार संस्था के बारे में शिकायत दर्ज करने का तरीका जानें।" : "Learn how to raise a complaint about a regulated securities-market entity."}
            </p>
          </article>
        </div>

        <div className="sebi-resources">
          <h3>{hindi ? "SEBI के आधिकारिक संसाधन देखें" : "Explore official SEBI resources"}</h3>
          <a href="https://investor.sebi.gov.in/" target="_blank" rel="noreferrer">
            {hindi ? "निवेशक शिक्षा ↗" : "Investor education ↗"}
          </a>
          <a
            href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes"
            target="_blank"
            rel="noreferrer"
          >
            {hindi ? "पंजीकृत मध्यस्थ जाँचें ↗" : "Check registered intermediaries ↗"}
          </a>
          <a href="https://scores.sebi.gov.in/" target="_blank" rel="noreferrer">
            {hindi ? "SCORES शिकायत पोर्टल ↗" : "SCORES complaint portal ↗"}
          </a>
        </div>

        <p className="sebi-disclaimer">
          {hindi
            ? "याद रखें: SEBI पंजीकरण मुनाफ़े की गारंटी नहीं देता और न ही हर निवेश ऑफ़र को सुरक्षित साबित करता है। व्यक्ति और ऑफ़र की हमेशा पुष्टि करें।"
            : "Remember: SEBI registration does not guarantee profits or mean every investment offer is safe. Always verify the person and the offer."}
        </p>
      </section>

      <Section title={hindi ? "निवेश सुरक्षा जाँच सूची" : "Investment safety checklist"}>
        <div className="checklist-grid">
          {checks.map((item, index) => (
            <article className="checklist-card" key={item.title}>
              <span className="checklist-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{hindi ? item.hiTitle : item.title}</h3>
              <p>{hindi ? item.hiText : item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="learn-quiz" aria-labelledby="learn-quiz-title">
        <div className="learn-quiz-heading">
          <span className="eyebrow">{hindi ? "सुरक्षित अभ्यास करें" : "PRACTISE SAFELY"}</span>
          <h2 id="learn-quiz-title">{hindi ? "धोखाधड़ी जागरूकता प्रश्नोत्तरी" : "Scam Awareness Quiz"}</h2>
          <p>
            {hindi ? "पाँच उदाहरणों के माध्यम से सीखी गई बातों का अभ्यास करें। ये अभ्यास प्रश्न हैं, वित्तीय ज्ञान की परीक्षा नहीं।" : "Test what you’ve learned with five example scenarios. These are practice questions, not a test of financial knowledge."}
          </p>
        </div>

        {!quizStarted && (
          <div className="learn-quiz-start">
            <div className="learn-quiz-start-icon" aria-hidden="true">🧠</div>
            <div>
              <h3>{hindi ? "अभ्यास के लिए तैयार हैं?" : "Ready to practise?"}</h3>
              <p>{hindi ? "पाँच प्रश्नों के उत्तर दें, हर स्पष्टीकरण पढ़ें और अंत में अपना स्कोर देखें।" : "Answer 5 questions, read each explanation, and see your score at the end."}</p>
              <button type="button" className="button button-primary" onClick={startQuiz}>
                {hindi ? "प्रश्नोत्तरी शुरू करें" : "Start quiz"}
              </button>
            </div>
          </div>
        )}

        {quizStarted && !quizFinished && (
          <div className="learn-quiz-card">
            <div className="learn-quiz-progress-row">
              <span>{hindi ? `प्रश्न ${currentQuestion + 1} / ${quizQuestions.length}` : `Question ${currentQuestion + 1} of ${quizQuestions.length}`}</span>
              <span>{hindi ? `${answeredCount} के उत्तर दिए` : `${answeredCount} answered`}</span>
            </div>
            <div
              className="learn-quiz-progress-track"
              role="progressbar"
              aria-label={hindi ? "प्रश्नोत्तरी की प्रगति" : "Quiz progress"}
              aria-valuemin={0}
              aria-valuemax={quizQuestions.length}
              aria-valuenow={currentQuestion + (showFeedback ? 1 : 0)}
            >
              <span
                style={{
                  width: `${((currentQuestion + (showFeedback ? 1 : 0)) / quizQuestions.length) * 100}%`,
                }}
              />
            </div>

            <p className="learn-quiz-scenario">{hindi ? question.hiScenario : question.scenario}</p>
            <h3 className="learn-quiz-question">{hindi ? question.hiQuestion : question.question}</h3>

            <div className="learn-quiz-options">
              {(hindi ? question.hiOptions : question.options).map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index;
                const isCorrect = index === question.correctIndex;
                let className = "learn-quiz-option";
                if (showFeedback && isCorrect) className += " correct";
                else if (showFeedback && isSelected) className += " incorrect";

                return (
                  <button
                    key={option}
                    type="button"
                    className={className}
                    onClick={() => chooseAnswer(index)}
                    disabled={showFeedback}
                    aria-pressed={isSelected}
                  >
                    <span className="learn-quiz-option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showFeedback && isCorrect && <span aria-hidden="true">✓</span>}
                    {showFeedback && isSelected && !isCorrect && (
                      <span aria-hidden="true">×</span>
                    )}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div
                className={`learn-quiz-feedback ${
                  selectedAnswers[currentQuestion] === question.correctIndex
                    ? "feedback-correct"
                    : "feedback-review"
                }`}
                role="status"
                aria-live="polite"
              >
                <strong>
                  {selectedAnswers[currentQuestion] === question.correctIndex
                    ? (hindi ? "सही जवाब — आपने अच्छा पहचाना!" : "Correct — well spotted!")
                    : (hindi ? "अभ्यास से सीखने का अवसर" : "Good practice opportunity")}
                </strong>
                <p>{hindi ? question.hiExplanation : question.explanation}</p>
              </div>
            )}

            {showFeedback && (
              <button
                type="button"
                className="button button-primary learn-quiz-next"
                onClick={nextQuestion}
              >
                {currentQuestion === quizQuestions.length - 1
                  ? (hindi ? "परिणाम देखें" : "See results")
                  : (hindi ? "अगला प्रश्न" : "Next question")}
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        )}

        {quizFinished && (
          <div className="learn-quiz-results" role="status" aria-live="polite">
            <div className="learn-quiz-result-icon" aria-hidden="true">
              {score === quizQuestions.length ? "🏆" : score >= 3 ? "🛡️" : "📘"}
            </div>
            <p className="eyebrow">{hindi ? "प्रश्नोत्तरी पूरी हुई" : "QUIZ COMPLETE"}</p>
            <h3>{hindi ? `आपका स्कोर ${quizQuestions.length} में से ${score} है` : `You scored ${score} out of ${quizQuestions.length}`}</h3>
            <p>
              {score === quizQuestions.length
                ? (hindi ? "बहुत अच्छा! निवेश ऑफ़र पर भरोसा करने से पहले स्वतंत्र जाँच करते रहें।" : "Excellent work. Keep using independent checks before trusting an investment offer.")
                : (hindi ? "स्पष्टीकरण दोबारा पढ़ें और अभ्यास जारी रखें। संदेह होने पर रुकें और स्वतंत्र रूप से पुष्टि करें।" : "Review the explanations and keep practising. When in doubt, pause and verify independently.")}
            </p>
            <div className="learn-quiz-score-track" aria-label={`${score} out of ${quizQuestions.length} correct`}>
              <span style={{ width: `${(score / quizQuestions.length) * 100}%` }} />
            </div>
            <button type="button" className="button button-primary" onClick={startQuiz}>
              {hindi ? "फिर से प्रयास करें" : "Try again"}
            </button>
          </div>
        )}
      </section>

      <section className="resources-section">
        <div className="section-heading">
          <span className="eyebrow">{hindi ? "आधिकारिक संसाधन" : "OFFICIAL RESOURCES"}</span>
          <h2>{hindi ? "पुष्टि करने के आधिकारिक स्रोत" : "Trusted places to verify"}</h2>
          <p>
            {hindi ? "ये लिंक आधिकारिक संसाधनों तक ले जाते हैं। केवल लिंक होने से कोई ऑफ़र असली साबित नहीं होता।" : "These links lead to official resources. A link itself does not establish that a particular offer is genuine."}
          </p>
        </div>
        <div className="resource-grid">
          {resources.map((resource) => (
            <article className="resource-card" key={resource.url}>
              <div className="resource-icon">↗</div>
              <h3>{hindi ? resource.hiTitle : resource.title}</h3>
              <p>{hindi ? resource.hiDescription : resource.description}</p>
              <a
                className="resource-link"
                href={resource.url}
                target="_blank"
                rel="noreferrer"
              >
                {hindi ? resource.hiLabel : resource.label} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="reminder-panel">
        <div className="reminder-icon">!</div>
        <div>
          <h3>{hindi ? "संदेश के बारे में संदेह है?" : "Not sure about a message?"}</h3>
          <p>
            {hindi ? "कोई कदम उठाने से पहले चेतावनी संकेतों की समीक्षा करें। यह टूल जागरूकता में मदद करता है, लेकिन किसी ऑफ़र के सुरक्षित होने की गारंटी नहीं देता।" : "Review its warning signs before taking action. The tool supports awareness and cannot guarantee that an offer is safe."}
          </p>
          <button
            type="button"
            className="button button-primary"
            onClick={() => navigateTo?.("check")}
          >
            {hindi ? "संदेश की जाँच करें" : "Check a message"}
          </button>
        </div>
      </section>
    </div>
  );
}
