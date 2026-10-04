
import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import LanguageSwitcher from "./components/LanguageSwitcher";

import Home from "./pages/Home";
import CheckMessage from "./pages/CheckMessage";
import VoiceAssistant from "./pages/VoiceAssistant";
import ConversationSafety from "./pages/ConversationSafety";
import LearnVerify from "./pages/LearnVerify";
import GetHelp from "./pages/GetHelp";

import {
  analyzeMessage,
  analyzeImage,
  analyzeConversation,
} from "./services/api";

const translations = {
  en: {
    home: "Home",
    check: "Check a message",
    voice: "Voice assistant",
    conversation: "Chat safety",
    learn: "Learn & verify",
    help: "Get help",
    brand: "NiveshRakshak",
    tagline: "Your investment safety companion",
    footerText: "Built to support safer, more informed investment decisions.",
    disclaimer:
      "NiveshRakshak provides educational risk indicators, not financial, legal, or investment advice. An analysis result cannot prove that an offer is genuine or fraudulent.",
    messageError:
      "Could not analyze the message. Check that the backend is running and try again.",
    imageError:
      "Could not analyze the image. Check that the backend is running and try again.",
    voiceError:
      "Could not analyze the voice message. Check that the backend is running and try again.",
    conversationError:
      "Could not analyze this conversation. Check that the backend is running and try again.",
  },
  hi: {
    home: "होम",
    check: "मैसेज जाँचें",
    voice: "वॉइस सहायक",
    conversation: "चैट सुरक्षा",
    learn: "सीखें और सत्यापित करें",
    help: "सहायता लें",
    brand: "निवेश रक्षक",
    tagline: "आपकी निवेश सुरक्षा का साथी",
    footerText:
      "सुरक्षित और सोच-समझकर निवेश संबंधी निर्णय लेने में सहायता के लिए बनाया गया।",
    disclaimer:
      "निवेश रक्षक केवल शैक्षिक जोखिम संकेत देता है; यह वित्तीय, कानूनी या निवेश सलाह नहीं है। विश्लेषण का परिणाम यह साबित नहीं कर सकता कि कोई ऑफ़र असली है या धोखाधड़ी।",
    messageError:
      "मैसेज का विश्लेषण नहीं हो सका। जाँचें कि बैकएंड चल रहा है और फिर कोशिश करें।",
    imageError:
      "इमेज का विश्लेषण नहीं हो सका। जाँचें कि बैकएंड चल रहा है और फिर कोशिश करें।",
    voiceError:
      "वॉइस मैसेज का विश्लेषण नहीं हो सका। जाँचें कि बैकएंड चल रहा है और फिर कोशिश करें।",
    conversationError:
      "इस बातचीत का विश्लेषण नहीं हो सका। जाँचें कि बैकएंड चल रहा है और फिर कोशिश करें।",
  },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [language, setLanguage] = useState("en");

  // Independent results
  const [messageResult, setMessageResult] = useState(null);
  const [imageResult, setImageResult] = useState(null);
  const [voiceResult, setVoiceResult] = useState(null);
  const [conversationResult, setConversationResult] = useState(null);

  // Independent loading states
  const [messageLoading, setMessageLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);

  // Independent errors
  const [messageError, setMessageError] = useState("");
  const [imageError, setImageError] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [conversationError, setConversationError] = useState("");

  const t = translations[language] || translations.en;

  function navigateTo(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
  }

  async function handleAnalyzeMessage(input) {
    setMessageLoading(true);
    setMessageError("");
    setMessageResult(null);

    try {
      const result = await analyzeMessage(input);
      setMessageResult(result);
    } catch (error) {
      setMessageError(error.message || t.messageError);
    } finally {
      setMessageLoading(false);
    }
  }

  // Image analysis uses its own API call and result state.
  async function handleAnalyzeImage(file) {
    setImageLoading(true);
    setImageError("");
    setImageResult(null);

    try {
      const result = await analyzeImage(file);
      setImageResult(result);
    } catch (error) {
      setImageError(error.message || t.imageError);
    } finally {
      setImageLoading(false);
    }
  }

  async function handleAnalyzeVoice(input) {
    setVoiceLoading(true);
    setVoiceError("");
    setVoiceResult(null);

    try {
      const result = await analyzeMessage(input);
      setVoiceResult(result);
    } catch (error) {
      setVoiceError(error.message || t.voiceError);
    } finally {
      setVoiceLoading(false);
    }
  }

  async function handleAnalyzeConversation(messages) {
    setConversationLoading(true);
    setConversationError("");
    setConversationResult(null);

    try {
      const result = await analyzeConversation(messages);
      setConversationResult(result);
    } catch (error) {
      setConversationError(error.message || t.conversationError);
    } finally {
      setConversationLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <Navbar
          t={t}
          currentPage={currentPage}
          navigateTo={navigateTo}
          language={language}
          changeLanguage={changeLanguage}
        />

        <div className="mobile-language">
          <LanguageSwitcher
            language={language}
            changeLanguage={changeLanguage}
          />
        </div>
      </header>

      <main>
        {currentPage === "home" && (
          <Home
            t={t}
            language={language}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === "check" && (
          <CheckMessage
            language={language}
            onAnalyze={handleAnalyzeMessage}
            loading={messageLoading}
            result={messageResult}
            error={messageError}
            onAnalyzeImage={handleAnalyzeImage}
            imageLoading={imageLoading}
            imageResult={imageResult}
            imageError={imageError}
          />
        )}

        {currentPage === "voice" && (
          <VoiceAssistant
            language={language}
            onAnalyze={handleAnalyzeVoice}
            loading={voiceLoading}
            result={voiceResult}
            error={voiceError}
          />
        )}

        {currentPage === "conversation" && (
          <ConversationSafety
            language={language}
            onAnalyze={handleAnalyzeConversation}
            loading={conversationLoading}
            result={conversationResult}
            error={conversationError}
          />
        )}

        {currentPage === "learn" && (
          <LearnVerify
            language={language}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === "help" && (
          <GetHelp language={language} />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-brand">
          <span className="brand-mark">N</span>
          <strong>{t.brand}</strong>
        </div>

        <p>{t.footerText}</p>
        <p className="footer-disclaimer">{t.disclaimer}</p>

        <span>
          © {new Date().getFullYear()} {t.brand}
        </span>
      </footer>
    </div>
  );
}