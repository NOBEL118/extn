# ⚡ ReplyAI – Smart Context-Aware Reply Generator

A Chrome extension that analyzes social media posts and generates tailored replies using Sarvam AI — all with your own API key, nothing stored on any server.

---

## 🚀 How to Install (Developer Mode)

1. **Download / clone this folder** to your computer
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **"Load unpacked"**
5. Select the `reply-ai-extension` folder
6. The extension icon appears in your toolbar ✅

---

## 🔑 Setup

1. Click the ⚡ ReplyAI icon in your toolbar
2. Go to the **Settings** tab
3. Paste your **Sarvam API key** (get one at https://dashboard.sarvam.ai)
4. Hit **Save Settings**

---

## 💡 How to Use

### Method 1: Popup (works anywhere)
1. Navigate to any post/tweet you want to reply to
2. Open the extension popup
3. Click **"Detect Post from Tab"** to auto-grab the post text
4. Type your intent (e.g. "congratulate them on the launch")
5. Pick a tone, hit **Generate Reply**
6. Copy and paste into the reply box!

### Method 2: Inline Button (X/Twitter, LinkedIn, Reddit)
1. When you click into a reply box on supported sites, an **⚡ AI Reply** button appears
2. Click it → a floating panel opens with the post context pre-filled
3. Enter your intent, pick tone, generate, then click **Insert** to fill the reply box automatically

---

## 🌐 Supported Platforms
- ✅ X / Twitter (x.com)
- ✅ LinkedIn
- ✅ Reddit
- ✅ Any site (via popup manual mode)

---

## 🔒 Privacy
- Your API key is stored **locally in Chrome storage only**
- API calls go **directly from your browser to Sarvam AI** — no middleman server
- No data is collected or logged by this extension

---

## 🛠 File Structure

```
reply-ai-extension/
├── manifest.json          # Extension config
├── popup.html             # Popup UI
├── icons/                 # Extension icons
└── src/
    ├── popup.js           # Popup logic + direct API calls
    ├── background.js      # Service worker (API calls from content scripts)
    ├── content.js         # Injected into pages (detects reply boxes, adds button)
    └── content.css        # Styles for injected UI
```

---

## 🔧 Extending to Other AI Providers

The API call is in `src/background.js` → `handleGenerateReply()`.
To swap Sarvam for another provider (OpenAI, Anthropic, etc.), just update:
- The fetch URL
- The auth header
- The request body format

---

## 📦 Building for Production

To publish to the Chrome Web Store:
1. Zip the entire `reply-ai-extension/` folder
2. Submit at https://chrome.google.com/webstore/devconsole
3. Add proper 128×128 icons (PNG)
