const officialResources = [
  {
    title: "SEBI Investor",
    description:
      "Investor education and information about securities-market concerns.",
    url: "https://investor.sebi.gov.in/",
    action: "Open SEBI Investor",
    hiTitle: "SEBI निवेशक",
    hiDescription:
      "निवेशक शिक्षा और प्रतिभूति बाज़ार से जुड़ी चिंताओं के बारे में जानकारी।",
    hiAction: "SEBI निवेशक पोर्टल खोलें",
  },
  {
    title: "National Cyber Crime Reporting Portal",
    description:
      "Report suspected online financial fraud through the official portal.",
    url: "https://www.cybercrime.gov.in/",
    action: "Report cybercrime",
    hiTitle: "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल",
    hiDescription:
      "संदिग्ध ऑनलाइन वित्तीय धोखाधड़ी की रिपोर्ट आधिकारिक पोर्टल के माध्यम से करें।",
    hiAction: "साइबर अपराध की रिपोर्ट करें",
  },
  {
    title: "Report a suspicious identifier",
    description:
      "The official portal provides options for reporting suspicious online identifiers.",
    url: "https://www.cybercrime.gov.in/Webform/cyber_suspect.aspx",
    action: "Report a suspicious identifier",
    hiTitle: "संदिग्ध ऑनलाइन पहचान की रिपोर्ट करें",
    hiDescription:
      "आधिकारिक पोर्टल पर संदिग्ध ऑनलाइन पहचान की रिपोर्ट करने के विकल्प उपलब्ध हैं।",
    hiAction: "संदिग्ध पहचान की रिपोर्ट करें",
  },
];

export default function GetHelp({ language = "en" }) {
  const hindi = language === "hi";

  return (
    <div className="page-container content-page">
      <div className="page-heading">
        <span className="eyebrow">
          {hindi ? "सहायता और रिपोर्टिंग" : "HELP AND REPORTING"}
        </span>

        <h1>
          {hindi
            ? "यदि आपको निवेश धोखाधड़ी का संदेह है"
            : "Know where to get help"}
        </h1>

        <p>
          {hindi
            ? "शांत रहें, संबंधित रिकॉर्ड सुरक्षित रखें और आधिकारिक माध्यमों का उपयोग करें।"
            : "If you suspect online financial fraud, preserve relevant records and contact the appropriate official channel."}
        </p>
      </div>

      <section className="urgent-panel">
        <div className="urgent-icon">!</div>
        <div>
          <span className="eyebrow">
            {hindi ? "तत्काल वित्तीय साइबर धोखाधड़ी" : "URGENT FINANCIAL CYBER FRAUD"}
          </span>

          <h2>
            {hindi
              ? "यदि पैसे ट्रांसफर हो गए हैं, तो तुरंत कार्रवाई करें"
              : "If money has been transferred, act promptly"}
          </h2>

          <p>
            {hindi ? (
              <>
                भारत में, जल्द से जल्द साइबर वित्तीय धोखाधड़ी हेल्पलाइन{" "}
                <strong>1930</strong> पर कॉल करें और आधिकारिक राष्ट्रीय साइबर
                अपराध रिपोर्टिंग पोर्टल पर रिपोर्ट दर्ज करें।
              </>
            ) : (
              <>
                In India, call the cyber financial fraud helpline{" "}
                <strong>1930</strong> as soon as possible and submit a report
                through the official National Cyber Crime Reporting Portal.
              </>
            )}
          </p>

          <a
            className="button button-primary"
            href="https://www.cybercrime.gov.in/"
            target="_blank"
            rel="noreferrer"
          >
            {hindi ? "आधिकारिक पोर्टल खोलें ↗" : "Open official portal ↗"}
          </a>
        </div>
      </section>

      <section className="help-steps">
        <h2>{hindi ? "आप क्या कर सकते हैं" : "What you can do"}</h2>

        <article className="help-step">
          <span>01</span>
          <div>
            <h3>
              {hindi
                ? "अपने बैंक या भुगतान सेवा प्रदाता से संपर्क करें"
                : "Contact your bank or payment provider"}
            </h3>
            <p>
              {hindi
                ? "यदि आपने भुगतान किया है, तो बैंक या भुगतान सेवा प्रदाता के आधिकारिक संपर्क विवरण का उपयोग करके तुरंत संपर्क करें।"
                : "If you made a payment, contact your bank or payment provider promptly using its official contact details."}
            </p>
          </div>
        </article>

        <article className="help-step">
          <span>02</span>
          <div>
            <h3>
              {hindi ? "संबंधित सबूत सुरक्षित रखें" : "Preserve relevant evidence"}
            </h3>
            <p>
              {hindi
                ? "लेन-देन संदर्भ, तारीखें, संदेश, URL और स्क्रीनशॉट सुरक्षित रखें। निजी जानकारी सार्वजनिक रूप से साझा न करें।"
                : "Keep transaction references, dates, messages, URLs, and screenshots. Do not publish private information publicly."}
            </p>
          </div>
        </article>

        <article className="help-step">
          <span>03</span>
          <div>
            <h3>{hindi ? "अपने खाते सुरक्षित करें" : "Secure your accounts"}</h3>
            <p>
              {hindi
                ? "यदि आपने लॉगिन विवरण साझा किए हैं, तो संबंधित सेवा प्रदाता के आधिकारिक माध्यम से संपर्क करें और प्रभावित पासवर्ड बदलें। मदद करने वाले किसी व्यक्ति के साथ OTP या UPI PIN साझा न करें।"
                : "If you shared credentials, contact the relevant provider through its official channel and change affected passwords. Never share OTPs or UPI PINs with anyone helping you."}
            </p>
          </div>
        </article>

        <article className="help-step">
          <span>04</span>
          <div>
            <h3>
              {hindi
                ? "आधिकारिक माध्यमों से रिपोर्ट करें"
                : "Report through official channels"}
            </h3>
            <p>
              {hindi
                ? "संबंधित नियामक या सरकारी रिपोर्टिंग पोर्टल का उपयोग करें। पैसे वापस दिलाने के बदले शुल्क माँगने वालों से सावधान रहें।"
                : "Use the relevant regulator or government reporting portal. Avoid paying anyone who promises to recover your money for a fee."}
            </p>
          </div>
        </article>
      </section>

      <section className="resources-section">
        <div className="section-heading">
          <span className="eyebrow">
            {hindi ? "आधिकारिक लिंक" : "OFFICIAL LINKS"}
          </span>
          <h2>{hindi ? "उपयोगी संसाधन" : "Useful resources"}</h2>
        </div>

        <div className="resource-grid">
          {officialResources.map((resource) => (
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
                {hindi ? resource.hiAction : resource.action} ↗
              </a>
            </article>
          ))}
        </div>
      </section>

      <p className="small-note">
        {hindi
          ? "NiveshRakshak एक शैक्षिक टूल है, आधिकारिक रिपोर्टिंग सेवा नहीं। यहाँ जानकारी जमा करने से किसी प्राधिकरण के पास शिकायत दर्ज नहीं होती।"
          : "NiveshRakshak is an educational tool, not an official reporting service. Submitting information here does not file a complaint with any authority."}
      </p>
    </div>
  );
}
