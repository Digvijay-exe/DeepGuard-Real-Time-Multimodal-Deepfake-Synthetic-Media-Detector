/**
 * DeepGuard Chrome Extension Popup Controller
 */

document.addEventListener("DOMContentLoaded", async () => {
  const CIRCUMFERENCE = 283; // 2 * Math.PI * 45
  const gaugeCircle = document.getElementById("gauge-circle");
  const riskPercentage = document.getElementById("risk-percentage");
  const riskVerdict = document.getElementById("risk-verdict");
  const visualScoreText = document.getElementById("visual-score-text");
  const visualProgress = document.getElementById("visual-progress");
  const audioScoreText = document.getElementById("audio-score-text");
  const audioProgress = document.getElementById("audio-progress");
  const verdictExplanation = document.getElementById("verdict-explanation");
  const activeTabUrlEl = document.getElementById("active-tab-url");
  const apiStatusEl = document.getElementById("api-status");
  const statusText = document.getElementById("status-text");

  const btnScanTab = document.getElementById("btn-scan-tab");
  const btnToggleSettings = document.getElementById("btn-toggle-settings");
  const btnSaveSettings = document.getElementById("btn-save-settings");
  const settingsDrawer = document.getElementById("settings-drawer");
  const apiUrlInput = document.getElementById("api-url-input");

  // Load backend configuration
  chrome.storage.local.get(["apiUrl", "latestScan"], (data) => {
    if (data.apiUrl) {
      apiUrlInput.value = data.apiUrl;
    }
    checkApiHealth(data.apiUrl || "http://localhost:8000/api/v1/detect");

    if (data.latestScan) {
      renderScanResult(data.latestScan);
    }
  });

  // Query Active Tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      const url = tabs[0].url || "about:blank";
      activeTabUrlEl.textContent = url;
    }
  });

  // Toggle Settings Drawer
  btnToggleSettings.addEventListener("click", () => {
    settingsDrawer.classList.toggle("open");
  });

  // Save Settings
  btnSaveSettings.addEventListener("click", () => {
    const newUrl = apiUrlInput.value.trim();
    if (newUrl) {
      chrome.storage.local.set({ apiUrl: newUrl }, () => {
        checkApiHealth(newUrl);
        settingsDrawer.classList.remove("open");
      });
    }
  });

  // Scan Active Tab Media
  btnScanTab.addEventListener("click", async () => {
    btnScanTab.disabled = true;
    btnScanTab.textContent = "Scanning Elements...";
    verdictExplanation.textContent = "Querying DOM for video & image elements...";

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab || !activeTab.id) {
        verdictExplanation.textContent = "No active web page detected.";
        btnScanTab.disabled = false;
        btnScanTab.textContent = "Scan Active Tab";
        return;
      }

      try {
        // Execute media collector in active tab
        const results = await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: extractPageMediaElements
        });

        const mediaList = results?.[0]?.result || [];
        if (mediaList.length === 0) {
          verdictExplanation.textContent = "No video or image elements found on the current page to analyze.";
          btnScanTab.disabled = false;
          btnScanTab.textContent = "Scan Active Tab";
          return;
        }

        // Analyze first candidate media
        const targetMedia = mediaList[0];
        verdictExplanation.textContent = `Analyzing ${targetMedia.type}: ${targetMedia.url.substring(0, 50)}...`;

        const { apiUrl = "http://localhost:8000/api/v1/detect" } = await chrome.storage.local.get("apiUrl");
        const apiResponse = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            media_url: targetMedia.url,
            media_type: targetMedia.type
          })
        });

        if (!apiResponse.ok) {
          throw new Error(`Server returned HTTP ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        const scanRecord = {
          id: "scan_" + Date.now(),
          mediaUrl: targetMedia.url,
          mediaType: targetMedia.type,
          isFake: data.is_fake,
          confidenceScore: data.confidence_score,
          visualScore: data.visual_score,
          audioScore: data.audio_score,
          frameAnomalies: data.frame_anomalies_detected,
          explanation: data.explanation
        };

        await chrome.storage.local.set({ latestScan: scanRecord });
        renderScanResult(scanRecord);
      } catch (err) {
        console.error("Tab scan failed:", err);
        verdictExplanation.textContent = `Scan failed: ${err.message}. Ensure backend server is running.`;
      } finally {
        btnScanTab.disabled = false;
        btnScanTab.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Scan Active Tab
        `;
      }
    });
  });

  /**
   * Updates UI components to reflect scan verdict
   */
  function renderScanResult(data) {
    const risk = Math.round((data.confidenceScore || 0) * 100);
    const visual = Math.round((data.visualScore || 0) * 100);
    const audio = Math.round((data.audioScore || 0) * 100);

    riskPercentage.textContent = `${risk}%`;

    // Gauge circle animation
    const offset = CIRCUMFERENCE - (risk / 100) * CIRCUMFERENCE;
    gaugeCircle.style.strokeDashoffset = offset;

    // Palette changes based on threshold
    if (risk > 65) {
      gaugeCircle.style.stroke = "#ef4444"; // red
      riskVerdict.textContent = "SYNTHETIC / FAKE";
      riskVerdict.style.color = "#f87171";
      verdictExplanation.style.borderLeftColor = "#ef4444";
    } else if (risk > 35) {
      gaugeCircle.style.stroke = "#f59e0b"; // amber
      riskVerdict.textContent = "SUSPICIOUS MEDIA";
      riskVerdict.style.color = "#fbbf24";
      verdictExplanation.style.borderLeftColor = "#f59e0b";
    } else {
      gaugeCircle.style.stroke = "#10b981"; // green
      riskVerdict.textContent = "VERIFIED AUTHENTIC";
      riskVerdict.style.color = "#34d399";
      verdictExplanation.style.borderLeftColor = "#10b981";
    }

    visualScoreText.textContent = `${visual}%`;
    visualProgress.style.width = `${visual}%`;

    audioScoreText.textContent = `${audio}%`;
    audioProgress.style.width = `${audio}%`;

    verdictExplanation.textContent = data.explanation || "Detection analysis complete.";
  }

  /**
   * Health ping to the configured backend API
   */
  async function checkApiHealth(url) {
    try {
      const baseUrl = url.replace(/\/api\/v1\/detect\/?$/, "");
      const res = await fetch(`${baseUrl}/docs`, { method: "HEAD", mode: "no-cors" });
      statusText.textContent = "Backend Connected";
      statusText.style.color = "#10b981";
    } catch {
      statusText.textContent = "Backend Offline";
      statusText.style.color = "#ef4444";
    }
  }
});

/**
 * Injected helper executed directly inside the inspected tab
 */
function extractPageMediaElements() {
  const mediaItems = [];

  const videos = Array.from(document.querySelectorAll("video"));
  for (const v of videos) {
    const src = v.currentSrc || v.src;
    if (src && !src.startsWith("blob:") && !src.startsWith("data:")) {
      mediaItems.push({ type: "video", url: src });
    }
  }

  const images = Array.from(document.querySelectorAll("img"));
  for (const img of images) {
    const src = img.currentSrc || img.src;
    if (src && src.startsWith("http") && img.naturalWidth > 150) {
      mediaItems.push({ type: "image", url: src });
    }
  }

  return mediaItems;
}
