/**
 * DeepGuard Content Script
 * Injected into active pages to scan media elements and display forensic overlay tags.
 */

(() => {
  // Listen for background worker messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "DEEPGUARD_ANALYSIS_COMPLETE") {
      const { mediaUrl, is_fake, confidence_score } = message.data;
      highlightAnalyzedElement(mediaUrl, is_fake, confidence_score);
      sendResponse({ status: "badge_attached" });
    }

    if (message.action === "GET_PAGE_MEDIA") {
      const mediaList = [];
      document.querySelectorAll("video").forEach((v) => {
        const src = v.currentSrc || v.src;
        if (src) mediaList.push({ type: "video", url: src });
      });
      document.querySelectorAll("img").forEach((img) => {
        const src = img.currentSrc || img.src;
        if (src && img.width > 120) mediaList.push({ type: "image", url: src });
      });
      sendResponse({ media: mediaList });
    }
    return true;
  });

  function highlightAnalyzedElement(targetUrl, isFake, confidence) {
    const candidates = Array.from(document.querySelectorAll("img, video"));
    const matched = candidates.find((el) => {
      const src = el.currentSrc || el.src;
      return src === targetUrl;
    });

    if (!matched) return;

    // Check if badge already exists
    if (matched.dataset.deepguardTagged) return;
    matched.dataset.deepguardTagged = "true";

    const container = matched.parentElement;
    if (!container) return;

    // Position wrapper
    const currentPos = window.getComputedStyle(container).position;
    if (currentPos === "static") {
      container.style.position = "relative";
    }

    const badge = document.createElement("div");
    badge.className = "deepguard-overlay-badge";
    const riskPct = Math.round(confidence * 100);

    badge.style.position = "absolute";
    badge.style.top = "10px";
    badge.style.left = "10px";
    badge.style.zIndex = "99999";
    badge.style.padding = "4px 8px";
    badge.style.borderRadius = "4px";
    badge.style.fontSize = "11px";
    badge.style.fontWeight = "700";
    badge.style.fontFamily = "-apple-system, sans-serif";
    badge.style.boxShadow = "0 2px 8px rgba(0,0,0,0.5)";
    badge.style.backdropFilter = "blur(4px)";
    badge.style.pointerEvents = "none";

    if (isFake) {
      badge.style.backgroundColor = "rgba(220, 38, 38, 0.9)";
      badge.style.color = "#ffffff";
      badge.style.border = "1px solid #f87171";
      badge.innerText = `⚠️ DeepGuard: Synthetic Media (${riskPct}%)`;
    } else {
      badge.style.backgroundColor = "rgba(16, 185, 129, 0.9)";
      badge.style.color = "#ffffff";
      badge.style.border = "1px solid #34d399";
      badge.innerText = `✓ DeepGuard: Authentic Media`;
    }

    container.appendChild(badge);
  }
})();
