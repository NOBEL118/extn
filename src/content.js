// ================================
// ReplyAI Content Script
// ================================

(function () {

  if (window.__replyAIInjected)
    return;

  window.__replyAIInjected = true;

  // -----------------------------------
  // Scan reply boxes
  // -----------------------------------

  function scanReplyBoxes() {

    const boxes = document.querySelectorAll(
      '[role="textbox"][contenteditable="true"]'
    );

    boxes.forEach(addAIButton);
  }

  // -----------------------------------
  // Add floating AI button
  // -----------------------------------
function addAIButton(box) {

  if (box.dataset.replyAiInjected)
    return;

  box.dataset.replyAiInjected =
    "true";

  // Find nearest composer wrapper
  const wrapper =
    box.closest('[data-testid="toolBar"]')
    || box.parentElement;

  if (!wrapper) return;

  // Prevent duplicates
  if (
    wrapper.querySelector(
      ".rai-floating-btn"
    )
  ) return;

  // Make wrapper relative
  wrapper.style.position =
    "relative";

  // Create button
  const btn =
    document.createElement("button");

  btn.className =
    "rai-floating-btn";

  btn.type = "button";

  btn.innerText = "⚡";

  btn.onclick = (e) => {

    e.preventDefault();
    e.stopPropagation();

    openPanel(box);
  };

  wrapper.appendChild(btn);
}
  // -----------------------------------
  // Get current article
  // -----------------------------------

  function getArticle(box) {

    const closest =
      box.closest("article");

    if (closest) return closest;

    const all =
      document.querySelectorAll(
        "article"
      );

    if (all.length > 0)
      return all[0];

    return null;
  }

  // -----------------------------------
  // Get post text
  // -----------------------------------

  function getPostText(article) {

    const tweet =
      article?.querySelector(
        '[data-testid="tweetText"]'
      );

    return tweet?.innerText?.trim()

      || "Could not detect post.";
  }

  // -----------------------------------
  // Get author
  // -----------------------------------

  function getAuthor(article) {

    const author =
      article?.querySelector(
        'div[data-testid="User-Name"]'
      );

    return author?.innerText?.trim()

      || "Unknown";
  }

  // -----------------------------------
  // Detect post type
  // -----------------------------------

  function detectPostType(postText) {

    const lower =
      postText.toLowerCase();

    if (lower.includes("?"))
      return "question";

    if (
      /launch|shipped|released|built/i
        .test(lower)
    ) {
      return "launch";
    }

    if (
      /connect|looking for|hiring/i
        .test(lower)
    ) {
      return "networking";
    }

    if (
      /rant|hate|annoying/i
        .test(lower)
    ) {
      return "rant";
    }

    return "general";
  }

  // -----------------------------------
  // Insert reply
  // -----------------------------------

  function insertReply(box, text) {

    box.focus();

    document.execCommand(
      "selectAll",
      false,
      null
    );

    document.execCommand(
      "insertText",
      false,
      text
    );
  }

  // -----------------------------------
  // Escape HTML
  // -----------------------------------

  function escapeHtml(str) {

    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // -----------------------------------
  // Open AI panel
  // -----------------------------------

  function openPanel(box) {

    document
      .getElementById("rai-panel")
      ?.remove();

    const article =
      getArticle(box);

    const postText =
      getPostText(article);

    const author =
      getAuthor(article);

    const postType =
      detectPostType(postText);

    const existingReply =
      box.innerText.trim();

    const panel =
      document.createElement("div");

    panel.id = "rai-panel";

    panel.innerHTML = `

      <div id="rai-header">

        <span>⚡ ReplyAI</span>

        <button id="rai-close">
          ✕
        </button>

      </div>

      <!-- AUTHOR -->

      <div class="rai-label">
        AUTHOR
      </div>

      <div class="rai-box-wrap">

        <div id="rai-author">
          ${escapeHtml(author)}
        </div>

        <button id="rai-clear-author">
          Clear
        </button>

      </div>

      <!-- POST -->

      <div class="rai-label">
        CURRENT POST
      </div>

      <div class="rai-box-wrap">

        <div id="rai-post">
          ${escapeHtml(postText)}
        </div>

        <button id="rai-clear-post">
          Clear
        </button>

      </div>

      <!-- REPLY -->

      <div class="rai-label">
        YOUR REPLY
      </div>

      <div class="rai-box-wrap">

        <textarea
          id="rai-myreply"
          placeholder="Write your own reply..."
        >${escapeHtml(existingReply)}</textarea>

        <button id="rai-clear-reply">
          Clear
        </button>

      </div>

      <!-- TONES -->

      <div class="rai-label">
        SELECT TONE
      </div>

      <div id="rai-tones">

        <button
          class="rai-tone selected"
          data-tone="friendly"
        >
          😊 Friendly
        </button>

        <button
          class="rai-tone"
          data-tone="funny"
        >
          😂 Funny
        </button>

        <button
          class="rai-tone"
          data-tone="professional"
        >
          💼 Professional
        </button>

        <button
          class="rai-tone"
          data-tone="casual"
        >
          💬 Casual
        </button>

        <button
          class="rai-tone"
          data-tone="savage"
        >
          🔥 Savage
        </button>

      </div>

      <!-- GENERATE -->

      <button id="rai-generate">
        ⚡ Generate Reply
      </button>

      <!-- OUTPUT -->

      <div
        id="rai-output"
        style="display:none"
      >

        <div class="rai-label">
          GENERATED REPLY
        </div>

        <div class="rai-box-wrap rai-generated-wrap">

          <div id="rai-result"></div>

          <button id="rai-clear-generated">
            Clear
          </button>

        </div>

        <button id="rai-insert">
          Insert Into Reply
        </button>

      </div>
    `;

    document.body.appendChild(panel);

    // -----------------------------------
    // Close panel
    // -----------------------------------

    panel.querySelector("#rai-close")
      .onclick = () => {

        panel.remove();
      };

    // -----------------------------------
    // Tone selection
    // -----------------------------------

    let selectedTone =
      "friendly";

    panel.querySelectorAll(".rai-tone")
      .forEach(btn => {

        btn.onclick = () => {

          panel.querySelectorAll(
            ".rai-tone"
          ).forEach(b => {

            b.classList.remove(
              "selected"
            );
          });

          btn.classList.add(
            "selected"
          );

          selectedTone =
            btn.dataset.tone;
        };
      });

    // -----------------------------------
    // Clear buttons
    // -----------------------------------

    panel.querySelector(
      "#rai-clear-author"
    ).onclick = () => {

      panel.querySelector(
        "#rai-author"
      ).textContent = "";
    };

    panel.querySelector(
      "#rai-clear-post"
    ).onclick = () => {

      panel.querySelector(
        "#rai-post"
      ).textContent = "";
    };

    panel.querySelector(
      "#rai-clear-reply"
    ).onclick = () => {

      panel.querySelector(
        "#rai-myreply"
      ).value = "";
    };

    panel.querySelector(
      "#rai-clear-generated"
    ).onclick = () => {

      panel.querySelector(
        "#rai-result"
      ).textContent = "";
    };

    // -----------------------------------
    // Generate reply
    // -----------------------------------

    panel.querySelector(
      "#rai-generate"
    ).onclick = async () => {

      const generateBtn =
        panel.querySelector(
          "#rai-generate"
        );

      generateBtn.textContent =
        "Generating...";

      generateBtn.disabled =
        true;

      const myReply =
        panel.querySelector(
          "#rai-myreply"
        ).value.trim();

      const intent = myReply

        ? `Improve or continue this draft reply naturally:\n${myReply}`

        : "Write a natural engaging reply";

      try {

        const response =
          await chrome.runtime.sendMessage({

            type:
              "GENERATE_REPLY",

            postText,

            author,

            postType,

            intent,

            tone:
              selectedTone,

            platform:
              "X/Twitter",

            platformRules:
              "Be concise, natural, engaging, and sound like real Tech Twitter users.",

            charLimit:
              280
          });

        panel.querySelector(
          "#rai-output"
        ).style.display =
          "block";

        if (response.success) {

          panel.querySelector(
            "#rai-result"
          ).textContent =

            response.reply;

        } else {

          panel.querySelector(
            "#rai-result"
          ).textContent =

            response.error ||

            "Error generating reply";
        }

      } catch (error) {

        panel.querySelector(
          "#rai-result"
        ).textContent =
          "Something went wrong";
      }

      generateBtn.textContent =
        "⚡ Generate Reply";

      generateBtn.disabled =
        false;
    };

    // -----------------------------------
    // Insert reply
    // -----------------------------------

    panel.querySelector(
      "#rai-insert"
    ).onclick = () => {

      const text =
        panel.querySelector(
          "#rai-result"
        ).textContent;

      insertReply(box, text);

      panel.remove();
    };
  }

  // -----------------------------------
  // Initial scan
  // -----------------------------------

  setTimeout(
    scanReplyBoxes,
    1000
  );

  setTimeout(
    scanReplyBoxes,
    3000
  );

  // -----------------------------------
  // Observe X SPA changes
  // -----------------------------------

  new MutationObserver(() => {

    scanReplyBoxes();

  }).observe(document.body, {

    childList: true,

    subtree: true
  });

})();