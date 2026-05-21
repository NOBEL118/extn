// ================================
// ReplyAI Background Service Worker
// ================================

// --------------------------------
// Listen for messages
// --------------------------------

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {

    if (message.type === "GENERATE_REPLY") {

      handleGenerate(message)

        .then(reply => {

          sendResponse({
            success: true,
            reply
          });
        })

        .catch(err => {

          sendResponse({
            success: false,
            error: err.message
          });
        });

      return true;
    }
  }
);

// --------------------------------
// Main generation handler
// --------------------------------

async function handleGenerate({
  postText,
  author,
  postType,
  intent,
  tone,
  platform,
  platformRules,
  charLimit
}) {

  // --------------------------------
  // Get saved settings
  // --------------------------------

  const {
    sarvamApiKey,
    model,
    maxLength
  } = await chrome.storage.local.get([
    "sarvamApiKey",
    "model",
    "maxLength"
  ]);

  // --------------------------------
  // Validate API key
  // --------------------------------

  const finalApiKey =
    sarvamApiKey;

  if (!finalApiKey) {

    throw new Error(
      "No Sarvam API key found."
    );
  }

  // --------------------------------
  // Reply length guide
  // --------------------------------

  const lengthGuide = {

    short:
      "1 short sentence",

    medium:
      "2-3 concise sentences",

    long:
      "a detailed paragraph",

  }[maxLength || "medium"];

  // --------------------------------
  // Build context
  // --------------------------------

  const context = postText

    ? `ORIGINAL POST:
"${postText.slice(0, 500)}"`

    : "(No post context provided)";

  const intentLine = intent

    ? `USER DRAFT / INTENT:
"${intent}"`

    : "Write a natural engaging reply.";

  // --------------------------------
  // Final Prompt
  // --------------------------------

  const prompt = `
You are an elite AI reply assistant for Tech Twitter.

Your replies should feel:
- human
- natural
- witty when appropriate
- emotionally aware
- concise
- never robotic

PLATFORM:
${platform}

AUTHOR:
${author || "Unknown"}

POST TYPE:
${postType || "general"}

${context}

${intentLine}

SELECTED TONE:
${tone}

PLATFORM RULES:
${platformRules || "Be concise and engaging."}

REPLY LENGTH:
${lengthGuide}

STRICT RULES:
- No hashtags
- No quotes
- No markdown
- No cringe AI phrasing
- No corporate tone
- Match the vibe of the tweet
- Sound like a real founder/builder on X
- Never use placeholders like [idea], [product], [name]
- Never generate template replies
- Always write complete natural replies
- Output ONLY the final reply

Generate the reply now.
`;

  // --------------------------------
  // API Call
  // --------------------------------

  const response = await fetch(
    "https://api.sarvam.ai/v1/chat/completions",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        "api-subscription-key":
          finalApiKey,
      },

      body: JSON.stringify({

        model:
          model || "sarvam-m",

        messages: [

          {
            role: "system",

            content:
              "You output only the final reply text."
          },

          {
            role: "user",

            content: prompt
          }
        ],

        max_tokens: 400,

        temperature: 0.82,
      }),
    }
  );

  // --------------------------------
  // Handle API Errors
  // --------------------------------

  if (!response.ok) {

    const err =
      await response
        .json()
        .catch(() => ({}));

    throw new Error(

      err?.error?.message ||

      `API error ${response.status}`
    );
  }

  // --------------------------------
  // Parse Response
  // --------------------------------

  const data =
    await response.json();

  let text =
    data?.choices?.[0]
      ?.message?.content
      ?.trim();

  if (!text) {

    throw new Error(
      "Empty response from API"
    );
  }

  // --------------------------------
  // Remove <think> blocks
  // --------------------------------

  text = text
    .replace(
      /<think>[\s\S]*?<\/think>/gi,
      ""
    )
    .trim();
  text = text
  .replace(/\[.*?\]/g, "")
  .replace(/\s{2,}/g, " ")
  .trim();

  // --------------------------------
  // Cleanup quotes
  // --------------------------------

  text = text
    .replace(/^["']|["']$/g, "")
    .trim();

  return text;
}