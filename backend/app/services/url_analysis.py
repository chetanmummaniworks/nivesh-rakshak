import re
from urllib.parse import urlparse


URL_PATTERN = re.compile(
    r"https?://[^\s<>()]+",
    re.IGNORECASE,
)


SHORTENERS = {
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "ow.ly",
    "is.gd",
    "cutt.ly",
    "rb.gy",
}


INVESTMENT_PATH_TERMS = [
    "invest",
    "investment",
    "profit",
    "returns",
    "trading",
    "wealth",
    "deposit",
    "payment",
    "account",
]


def extract_urls(text: str) -> list[str]:
    """
    Extract HTTP/HTTPS URLs from user-provided text.
    """

    if not text:
        return []

    return URL_PATTERN.findall(text)


def analyze_url(url: str) -> dict:
    """
    Analyze URL characteristics.

    This does not determine whether a website is legitimate
    or fraudulent. It only identifies characteristics that
    deserve review.
    """

    parsed = urlparse(url)

    hostname = parsed.hostname or ""

    signals = []

    if parsed.scheme.lower() != "https":
        signals.append({
            "type": "no_https",
            "severity": "medium",
            "title": "Connection is not HTTPS",
            "evidence": url,
        })

    if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", hostname):
        signals.append({
            "type": "ip_address",
            "severity": "medium",
            "title": "URL uses an IP address",
            "evidence": hostname,
        })

    if hostname.lower() in SHORTENERS:
        signals.append({
            "type": "shortened_url",
            "severity": "medium",
            "title": "Shortened URL",
            "evidence": hostname,
        })

    if parsed.port:
        signals.append({
            "type": "unusual_port",
            "severity": "medium",
            "title": "URL contains a non-default port",
            "evidence": str(parsed.port),
        })

    if hostname.count(".") >= 3:
        signals.append({
            "type": "many_subdomains",
            "severity": "low",
            "title": "Multiple subdomains",
            "evidence": hostname,
        })

    if any(
        term in parsed.path.lower()
        for term in INVESTMENT_PATH_TERMS
    ):
        signals.append({
            "type": "investment_path",
            "severity": "low",
            "title": "Investment-related URL path",
            "evidence": parsed.path,
        })

    return {
        "url": url,
        "hostname": hostname,
        "scheme": parsed.scheme,
        "signals": signals,
    }


def analyze_urls(text: str) -> dict:
    """
    Extract and analyze all URLs found in text.
    """

    urls = extract_urls(text)

    analyses = [
        analyze_url(url)
        for url in urls
    ]

    all_signals = []

    for analysis in analyses:
        all_signals.extend(
            analysis["signals"]
        )

    return {
        "urls": analyses,
        "signals": all_signals,
    }