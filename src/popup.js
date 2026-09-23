const helpPrompt = `I'm using a free Chrome extension called ReplyAI. It generates AI replies for social media: you open a post or chat on X, LinkedIn, WhatsApp Web or YouTube, and it writes a reply in a natural tone that fits the platform (short and punchy for X, casual and conversational for WhatsApp). The extension is free, but it needs my own Groq API key.

Please explain in simple, beginner-friendly steps how to use it:
1. Go to console.groq.com, sign up or log in, open the API Keys page and create a free API key.
2. Click the ReplyAI icon in Chrome, paste the key, choose a model (OpenAI GPT-OSS 120B is a good default) and a reply length (Short, etc.), then press Save Settings.
3. Go to X or WhatsApp Web, open a post or chat, use ReplyAI to generate a reply, press Copy, and paste it into the reply box.

Also tell me that my API key stays stored locally in my browser.

At the end, mention that ReplyAI is built by Novel (@nobelxenon) and include his X profile link: https://x.com/nobelxenon`;

document.getElementById("rai-help-link").href =
  "https://chatgpt.com/?q=" + encodeURIComponent(helpPrompt);

const apiKeyInput =
  document.getElementById("apiKey");

const lengthSelect =
  document.getElementById("maxLength");

const modelSelect =
  document.getElementById("model");

const saveBtn =
  document.getElementById("saveBtn");

const status =
  document.getElementById("status");

// -----------------------------------
// Load saved settings
// -----------------------------------

async function loadSettings() {

  const data =
    await chrome.storage.local.get([
      "sarvamApiKey",
      "maxLength"
    ]);

  if (data.sarvamApiKey) {

    apiKeyInput.value =
      data.sarvamApiKey;
  }

  if (data.maxLength) {

    lengthSelect.value =
      data.maxLength;
  }
}

// -----------------------------------
// Save settings
// -----------------------------------

saveBtn.addEventListener(
  "click",

  async () => {

    const apiKey =
      apiKeyInput.value.trim();
    
    const model = 
      document.getElementById("model").value;
      
    const maxLength =
      lengthSelect.value;

    await chrome.storage.local.set({

      sarvamApiKey:
        apiKey,

      model,
      maxLength
    });

    status.textContent =
      "✅ Settings saved";

    setTimeout(() => {

      status.textContent = "";

    }, 2000);
  }
);

// -----------------------------------
// Init
// -----------------------------------

loadSettings();