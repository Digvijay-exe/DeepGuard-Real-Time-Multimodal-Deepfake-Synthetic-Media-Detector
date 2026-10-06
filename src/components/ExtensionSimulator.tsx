import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Sliders, 
  Bell, 
  Maximize2,
  MousePointer,
  Sparkles,
  Info
} from 'lucide-react';

interface SimulatedMedia {
  id: string;
  type: 'image' | 'video';
  title: string;
  url: string;
  isFake: boolean;
  confidence: number;
  visualScore: number;
  audioScore: number;
  explanation: string;
  analyzed: boolean;
}

export const ExtensionSimulator: React.FC = () => {
  // Page media items in the simulated webpage
  const [pageMedia, setPageMedia] = useState<SimulatedMedia[]>([
    {
      id: 'media_1',
      type: 'video',
      title: 'Breaking Video: CEO Statement on Corporate Merger',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      isFake: true,
      confidence: 0.92,
      visualScore: 0.89,
      audioScore: 0.94,
      explanation: 'ViT spatial attention identified facial warping along chin boundaries; Wav2Vec2 detected neural vocoder pitch flattening.',
      analyzed: false
    },
    {
      id: 'media_2',
      type: 'image',
      title: 'High-Res Studio Portrait for Keynote Speaker',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      isFake: true,
      confidence: 0.84,
      visualScore: 0.84,
      audioScore: 0.05,
      explanation: 'Corneal reflection mismatch between left and right iris; diffusion texture smoothing on earlobe contour.',
      analyzed: false
    },
    {
      id: 'media_3',
      type: 'image',
      title: 'Photojournalist Live Dispatch from City Hall Press Pool',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      isFake: false,
      confidence: 0.11,
      visualScore: 0.12,
      audioScore: 0.08,
      explanation: 'Natural ocular micro-tremors and coherent optical lens depth-of-field confirmed.',
      analyzed: false
    }
  ]);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    targetMedia: SimulatedMedia | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    targetMedia: null
  });

  // Popup state
  const [popupScan, setPopupScan] = useState({
    activeUrl: 'https://news-global-brief.internal/reports/2026/briefing-01',
    confidenceScore: 0.92,
    visualScore: 0.89,
    audioScore: 0.94,
    isFake: true,
    explanation: 'ViT facial warping identified on video element. Wav2Vec2 detected neural vocoder spectral cutoff above 12kHz.',
    hasScanned: true
  });

  const [notification, setNotification] = useState<{
    visible: boolean;
    title: string;
    message: string;
    isFake: boolean;
  } | null>(null);

  const [isScanningTab, setIsScanningTab] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://localhost:8000/api/v1/detect');

  // Right click handler on media
  const handleContextMenu = (e: React.MouseEvent, media: SimulatedMedia) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetMedia: media
    });
  };

  // Close context menu on outside click
  const closeContextMenu = () => {
    if (contextMenu.visible) {
      setContextMenu({ visible: false, x: 0, y: 0, targetMedia: null });
    }
  };

  // Trigger analysis from context menu
  const triggerContextMenuAnalysis = () => {
    if (!contextMenu.targetMedia) return;
    const media = contextMenu.targetMedia;
    closeContextMenu();

    // Trigger Chrome Notification toast
    showNotification(
      'DeepGuard Scanning Media...',
      `Extracting 5 keyframes & audio stream for ${media.type.toUpperCase()}...`,
      false
    );

    setTimeout(() => {
      // Mark as analyzed in page
      setPageMedia((prev) =>
        prev.map((item) =>
          item.id === media.id ? { ...item, analyzed: true } : item
        )
      );

      // Update extension popup state
      setPopupScan({
        activeUrl: 'https://news-global-brief.internal/reports/2026/briefing-01',
        confidenceScore: media.confidence,
        visualScore: media.visualScore,
        audioScore: media.audioScore,
        isFake: media.isFake,
        explanation: media.explanation,
        hasScanned: true
      });

      // Show verdict notification
      const riskPct = Math.round(media.confidence * 100);
      showNotification(
        media.isFake
          ? `⚠️ High Synthetic Risk Detected (${riskPct}%)`
          : `✅ Authentic Media Verified (${100 - riskPct}% Authentic)`,
        media.explanation,
        media.isFake
      );
    }, 700);
  };

  // Scan all media on active tab
  const handleScanActiveTab = () => {
    setIsScanningTab(true);
    setTimeout(() => {
      // Mark all as analyzed
      setPageMedia((prev) => prev.map((item) => ({ ...item, analyzed: true })));

      // Set popup to worst case on page
      setPopupScan({
        activeUrl: 'https://news-global-brief.internal/reports/2026/briefing-01',
        confidenceScore: 0.92,
        visualScore: 0.89,
        audioScore: 0.94,
        isFake: true,
        explanation: '3 media elements inspected on active tab: 1 synthetic video and 1 diffusion image flagged with high anomaly confidence.',
        hasScanned: true
      });

      showNotification(
        'DeepGuard Tab Scan Complete',
        'Scanned 3 embedded media elements. 2 flagged with synthetic manipulation.',
        true
      );
      setIsScanningTab(false);
    }, 900);
  };

  const showNotification = (title: string, message: string, isFake: boolean) => {
    setNotification({ visible: true, title, message, isFake });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // SVG Gauge calculations
  const CIRCUMFERENCE = 283;
  const riskPct = Math.round(popupScan.confidenceScore * 100);
  const strokeOffset = CIRCUMFERENCE - (riskPct / 100) * CIRCUMFERENCE;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8" onClick={closeContextMenu}>
      {/* Header explanation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <span>Manifest V3</span>
            <span aria-hidden="true">·</span>
            <span>Context Menus</span>
            <span aria-hidden="true">·</span>
            <span>ActiveTab Scripting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
            Chrome Extension Simulator & Live Testbed
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Test the DeepGuard Manifest V3 extension workflow in real time: right-click media to invoke the context menu,
            inspect in-page overlay badges, and evaluate the dark-themed circular gauge popup.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <MousePointer className="w-3.5 h-3.5 text-indigo-400" />
          <span>Tip: Right-click any media below</span>
        </div>
      </div>

      {/* Simulator Workspace: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Simulated Browser Tab (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/90 shadow-2xl">
            {/* Browser Window Header Chrome */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 text-xs text-slate-400 font-mono">Chrome 130 · Tab Preview</span>
              </div>

              {/* URL Address Bar */}
              <div className="flex-1 max-w-md bg-slate-900 border border-slate-800 rounded-md px-3 py-1 flex items-center gap-2 text-xs text-slate-300 font-mono">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">https://news-global-brief.internal/reports/2026/briefing-01</span>
              </div>

              {/* Extension Icon in Browser Toolbar */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-7 h-7 rounded-md bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400"
                  title="DeepGuard Extension Active"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Simulated Webpage Body */}
            <div className="p-6 space-y-6 bg-slate-950/60 min-h-[540px]">
              <div>
                <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                  World Investigative Dispatch
                </span>
                <h2 className="text-xl font-bold font-display text-white mt-1">
                  Global Financial Summit: Executive Press Briefing & Transcript
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>Published October 2, 2026</span>
                  <span aria-hidden="true">·</span>
                  <span>Press Pool Audio/Video Stream</span>
                </div>
              </div>

              {/* Media Items in Page */}
              <div className="space-y-6">
                {pageMedia.map((media) => (
                  <div
                    key={media.id}
                    onContextMenu={(e) => handleContextMenu(e, media)}
                    className="relative group rounded-xl border border-slate-800/90 overflow-hidden bg-slate-900/60 hover:border-slate-700 transition-all cursor-context-menu"
                  >
                    {/* Media Container */}
                    <div className="relative aspect-video max-h-72 w-full overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={media.url}
                        alt={media.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                      />

                      {/* Right-click prompt overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="bg-slate-950/90 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 font-mono">
                          <MousePointer className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Right-Click to Run DeepGuard</span>
                        </div>
                      </div>

                      {/* In-Page DeepGuard Overlay Badge when analyzed */}
                      {media.analyzed && (
                        <div
                          className={`absolute top-3 left-3 z-20 px-2.5 py-1 rounded text-xs font-bold font-mono shadow-lg flex items-center gap-1.5 backdrop-blur-md ${
                            media.isFake
                              ? 'bg-red-600/95 text-white border border-red-400'
                              : 'bg-emerald-600/95 text-white border border-emerald-400'
                          }`}
                        >
                          {media.isFake ? (
                            <>
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>⚠️ DeepGuard: Synthetic Media ({Math.round(media.confidence * 100)}%)</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>✓ DeepGuard: Authentic Media Verified</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="p-3.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{media.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Type: {media.type.toUpperCase()} · Status: {media.analyzed ? 'Inspected' : 'Right-click to analyze'}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContextMenu(e, media);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-mono text-[11px]"
                      >
                        Context Menu
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chrome Extension Popup (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Extension Popup UI (popup.html)</span>
            <span className="text-[10px] font-mono text-indigo-400">Width: 360px</span>
          </div>

          {/* The Actual Extension Popup Box (360px) */}
          <div className="w-full max-w-[360px] mx-auto bg-[#0b0f19] border border-slate-800 rounded-xl p-4 text-slate-100 shadow-2xl relative font-sans">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3.5">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>DeepGuard</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Backend Ready</span>
              </div>
            </div>

            {/* Active Target Page Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 mb-3.5 text-xs">
              <div className="font-semibold text-slate-300 text-[11px]">Active Target Page:</div>
              <div className="text-slate-400 font-mono text-[11px] truncate mt-0.5">
                {popupScan.activeUrl}
              </div>
            </div>

            {/* Circular Risk Gauge */}
            <div className="flex flex-col items-center justify-center relative py-2 mb-3">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={riskPct > 65 ? '#ef4444' : riskPct > 35 ? '#f59e0b' : '#10b981'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold font-mono text-white leading-none">
                  {riskPct}%
                </span>
                <span
                  className={`text-[9px] uppercase font-bold tracking-wider mt-1 ${
                    riskPct > 65 ? 'text-red-400' : riskPct > 35 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {riskPct > 65 ? 'SYNTHETIC / FAKE' : riskPct > 35 ? 'SUSPICIOUS' : 'VERIFIED AUTHENTIC'}
                </span>
              </div>
            </div>

            {/* Visual vs Audio Breakdown Bars */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 mb-3.5 space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">ViT Facial & Spatial Anomaly</span>
                  <span className="font-mono text-sky-400 font-semibold">
                    {Math.round(popupScan.visualScore * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${popupScan.visualScore * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Wav2Vec2 Spectral & Voice Clone</span>
                  <span className="font-mono text-amber-400 font-semibold">
                    {Math.round(popupScan.audioScore * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${popupScan.audioScore * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Verdict Explanation Box */}
            <div
              className={`text-[11px] leading-relaxed p-2.5 rounded-lg bg-slate-950 border-l-2 mb-3.5 text-slate-300 ${
                riskPct > 50 ? 'border-red-500' : 'border-emerald-500'
              }`}
            >
              {popupScan.explanation}
            </div>

            {/* Popup Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleScanActiveTab}
                disabled={isScanningTab}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Search className={`w-3.5 h-3.5 ${isScanningTab ? 'animate-spin' : ''}`} />
                <span>{isScanningTab ? 'Scanning DOM...' : 'Scan Active Tab'}</span>
              </button>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg border border-slate-700 transition-colors"
              >
                Settings
              </button>
            </div>

            {/* Settings Drawer */}
            {settingsOpen && (
              <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2">
                <label className="text-[11px] text-slate-400 block">FastAPI Backend Endpoint:</label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="w-full py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-medium"
                >
                  Save Settings
                </button>
              </div>
            )}

            <div className="text-[10px] text-slate-500 text-center mt-3 font-mono">
              ViT google/vit-base-patch16 · Wav2Vec2 facebook/wav2vec2
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Context Menu Popover */}
      {contextMenu.visible && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 text-xs text-slate-200 divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Chrome Context Menu</span>
            <span className="text-[10px]">Element: {contextMenu.targetMedia?.type}</span>
          </div>

          <div className="py-1">
            <button
              onClick={triggerContextMenuAnalysis}
              className="w-full text-left px-3 py-2 hover:bg-indigo-600 hover:text-white flex items-center gap-2.5 font-semibold text-sky-300 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Analyze for Synthetic/Deepfake Manipulation</span>
            </button>
          </div>

          <div className="py-1 text-slate-400">
            <div className="px-3 py-1 hover:bg-slate-800 cursor-pointer">Inspect Element</div>
            <div className="px-3 py-1 hover:bg-slate-800 cursor-pointer">Copy Media Address</div>
            <div className="px-3 py-1 hover:bg-slate-800 cursor-pointer">Save Media As...</div>
          </div>
        </div>
      )}

      {/* Simulated Chrome Desktop Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                notification.isFake
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate">{notification.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">Chrome Alert</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-3">
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
