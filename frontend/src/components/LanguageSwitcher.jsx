export default function LanguageSwitcher({
  language,
  changeLanguage,
}) {
  return (
    <div className="language-switcher" aria-label="Language">
      <button
        type="button"
        className={language === "en" ? "active" : ""}
        aria-pressed={language === "en"}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>

      <button
        type="button"
        className={language === "hi" ? "active" : ""}
        aria-pressed={language === "hi"}
        onClick={() => changeLanguage("hi")}
      >
        हिंदी
      </button>
    </div>
  );
}