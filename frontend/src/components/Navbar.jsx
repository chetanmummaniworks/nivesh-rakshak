import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({
  t,
  currentPage,
  navigateTo,
  language,
  changeLanguage,
}) {
  const links = [
    { id: "home", label: t.home },
    { id: "check", label: t.check },
    { id: "voice", label: t.voice },
    { id: "conversation", label: t.conversation },
    { id: "learn", label: t.learn },
    { id: "help", label: t.help },
  ];

  return (
    <nav className="navbar">
      <button
        type="button"
        className="brand-button"
        onClick={() => navigateTo("home")}
        aria-label="Go to home"
      >
        <span className="brand-mark">N</span>

        <span className="brand-text">
          <strong>{t.brand}</strong>
          <small>{t.tagline}</small>
        </span>
      </button>

      <div className="nav-links">
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            className={`nav-link ${
              currentPage === link.id ? "active" : ""
            }`}
            onClick={() => navigateTo(link.id)}
            aria-current={currentPage === link.id ? "page" : undefined}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="desktop-language">
        <LanguageSwitcher
          language={language}
          changeLanguage={changeLanguage}
        />
      </div>
    </nav>
  );
}