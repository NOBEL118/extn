const apiKeyInput =
  document.getElementById("apiKey");

const modelSelect =
  document.getElementById("model");

const lengthSelect =
  document.getElementById("maxLength");

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
      "model",
      "maxLength"
    ]);

  if (data.sarvamApiKey) {

    apiKeyInput.value =
      data.sarvamApiKey;
  }

  if (data.model) {

    modelSelect.value =
      data.model;
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
      modelSelect.value;

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