const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

async function postJSON(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const rawText = await response.text();

  let data = {};

  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = { detail: rawText };
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

export function analyzeMessage(input = {}) {
  const message = String(input.message || "").trim();
  const url = String(input.url || "").trim();

  if (!message && !url) {
    return Promise.reject(
      new Error("Enter a message or a website URL to analyze.")
    );
  }

  return postJSON("/api/analyze", {
    text: message,
    message,
    url,
  });
}

export function analyzeImage(file) {
  if (!file) {
    return Promise.reject(new Error("Please select an image to analyze."));
  }

  if (!file.type.startsWith("image/")) {
    return Promise.reject(new Error("Please select a valid image file."));
  }

  const formData = new FormData();
  formData.append("file", file);

  return fetch(`${API_BASE_URL}/api/analyze-image`, {
    method: "POST",
    body: formData,
  }).then(async (response) => {
    const rawText = await response.text();

    let data = {};

    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = { detail: rawText };
    }

    if (!response.ok) {
      throw new Error(
        data.detail ||
          data.message ||
          `Request failed with status ${response.status}`
      );
    }

    return data;
  });
}

export function analyzeConversation(messages = []) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return Promise.reject(
      new Error("Add at least one conversation message.")
    );
  }

  return postJSON("/api/conversation/analyze", {
    messages: messages.map((item) => ({
      sender: item.sender || "unknown",
      text: String(item.text || "").trim(),
    })),
  });
}