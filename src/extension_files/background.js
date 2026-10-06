/**
 * DeepGuard - Multimodal Deepfake Detector
 * Background Service Worker (Manifest V3)
 * 
 * Handles context menu registration, media analysis dispatch to FastAPI backend,
 * response caching in chrome.storage, and desktop notifications.
 */

const DEFAULT_API_URL = "http://localhost:8000/api/v1/detect";

// Initialize Context Menu on Extension Installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "deepguard_analyze_media",
    title: "Analyze for Synthetic/Deepfake Manipulation",
    contexts: ["image", "video", "audio"]
  });

  // Set default backend configuration
  chrome.storage.local.get(["apiUrl", "recentScans"], (result) => {
    if (!result.apiUrl) {
      chrome.storage.local.set({ apiUrl: DEFAULT_API_URL });
    }
    if (!result.recentScans) {
      chrome.storage.local.set({ recentScans: [] });
    }
  });

  console.log("[DeepGuard] Background worker initialized. Context menus registered.");
});

// Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "deepguard_analyze_media") {
    const mediaUrl = info.srcUrl || info.linkUrl || info.pageUrl;
    const mediaType = info.mediaType || (info.srcUrl && info.srcUrl.match(/\.(mp4|webm|mov|mkv)$/i) ? "video" : "image");

    if (!mediaUrl) {
      triggerNotification({
        title: "DeepGuard Analysis Failed",
        message: "No valid media URL could be extracted from this element."
      });
      return;
    }

    // Show ongoing analysis notification
    triggerNotification({
      title: "DeepGuard Scanning Media...",
      message: `Analyzing ${mediaType.toUpperCase()} stream with ViT & Wav2Vec2 models...`
    });

    try {
      const result = await analyzeMedia(mediaUrl, mediaType);
      await storeScanResult(mediaUrl, mediaType, result);
      presentVerdictNotification(result);

      // If active tab exists, notify content script to show overlay badge
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          action: "DEEPGUARD_ANALYSIS_COMPLETE",
          data: { mediaUrl, ...result }
        }).catch(() => {
          // Content script may not be loaded on internal pages
        });
      }
    } catch (err) {
      console.error("[DeepGuard] Detection request error:", err);
      triggerNotification({
        title: "DeepGuard Analysis Error",
        message: err.message || "Failed to reach detection backend. Check if FastAPI server is running."
      });
    }
  }
});

// Listen for messages from popup.js or content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ANALYZE_MEDIA") {
    analyzeMedia(request.mediaUrl, request.mediaType)
      .then(async (result) => {
        await storeScanResult(request.mediaUrl, request.mediaType, result);
        sendResponse({ success: true, data: result });
      })
      .catch((err) => {
        sendResponse({ success: false, error: err.message });
      });
    return true; // Indicates async response
  }

  if (request.action === "GET_LATEST_SCAN") {
    chrome.storage.local.get(["latestScan", "recentScans"], (data) => {
      sendResponse({ latestScan: data.latestScan, recentScans: data.recentScans || [] });
    });
    return true;
  }
});

/**
 * Dispatch media detection request to FastAPI backend
 */
async function analyzeMedia(mediaUrl, mediaType) {
  const { apiUrl = DEFAULT_API_URL } = await chrome.storage.local.get("apiUrl");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      media_url: mediaUrl,
      media_type: mediaType || "video"
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
  }

  return await response.json();
}

/**
 * Cache scan results into chrome.storage.local
 */
async function storeScanResult(mediaUrl, mediaType, result) {
  const scanRecord = {
    id: "scan_" + Date.now(),
    mediaUrl,
    mediaType,
    timestamp: new Date().toISOString(),
    isFake: result.is_fake,
    confidenceScore: result.confidence_score,
    visualScore: result.visual_score,
    audioScore: result.audio_score,
    frameAnomalies: result.frame_anomalies_detected,
    explanation: result.explanation
  };

  const { recentScans = [] } = await chrome.storage.local.get("recentScans");
  const updatedScans = [scanRecord, ...recentScans.slice(0, 19)]; // Keep last 20

  await chrome.storage.local.set({
    latestScan: scanRecord,
    recentScans: updatedScans
  });
}

/**
 * Trigger Chrome Desktop Notification
 */
function presentVerdictNotification(result) {
  const riskPct = Math.round(result.confidence_score * 100);
  const isFake = result.is_fake;

  const title = isFake
    ? `⚠️ High Synthetic Risk Detected (${riskPct}%)`
    : `✅ Authentic Media Verified (${100 - riskPct}% authentic)`;

  const message = isFake
    ? `Anomalies: Visual ${Math.round(result.visual_score * 100)}% | Audio ${Math.round(result.audio_score * 100)}%. ${result.explanation.substring(0, 90)}...`
    : `ViT & Wav2Vec2 detected natural biometric patterns and uncorrupted acoustic harmonics.`;

  triggerNotification({ title, message });
}

function triggerNotification({ title, message }) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: title,
    message: message,
    priority: 2
  });
}
