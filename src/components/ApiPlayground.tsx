import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  Copy, 
  Check, 
  Clock, 
  Cpu, 
  Code, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const ApiPlayground: React.FC = () => {
  const [endpointUrl, setEndpointUrl] = useState('/api/v1/detect');
  const [mediaUrl, setMediaUrl] = useState('https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [mediaType, setMediaType] = useState<'video' | 'image' | 'audio'>('video');
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseDuration, setResponseDuration] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleSendRequest = async () => {
    setIsLoading(true);
    const startTime = performance.now();

    try {
      const payload = {
        media_url: mediaUrl,
        media_type: mediaType
      };

      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const duration = Math.round(performance.now() - startTime);
      setResponseStatus(res.status);
      setResponseDuration(duration);

      const json = await res.json();
      setResponseData(JSON.stringify(json, null, 2));
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      setResponseStatus(500);
      setResponseDuration(duration);
      setResponseData(JSON.stringify({ error: err.message || 'Request failed' }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const curlCommand = `curl -X POST "${window.location.origin}${endpointUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "media_url": "${mediaUrl}",
    "media_type": "${mediaType}"
  }'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
          <span>Live API /v1/detect</span>
          <span aria-hidden="true">·</span>
          <span>CORS Enabled</span>
          <span aria-hidden="true">·</span>
          <span>JSON Schema</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
          API Testing Playground
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Test the live multimodal deepfake detection API directly from your browser.
          Inspect payloads, response latency, and generation confidence scores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Request Builder (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>HTTP Request Constructor</span>
            </h2>

            {/* Method + URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Endpoint URL:</label>
              <div className="flex rounded-lg overflow-hidden border border-slate-800">
                <span className="bg-slate-800 px-3 py-2 text-xs font-mono font-bold text-emerald-400 flex items-center">
                  POST
                </span>
                <input
                  type="text"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  className="flex-1 bg-slate-950 px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Media Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Media Type:</label>
              <div className="flex gap-2">
                {(['video', 'image', 'audio'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setMediaType(type)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      mediaType === type
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Media URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Media URL:</label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Quick Preset Buttons */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <span className="text-[11px] text-slate-400 block font-medium">Quick Presets:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => {
                    setMediaUrl('https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                    setMediaType('video');
                  }}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 font-mono text-[11px]"
                >
                  Deepfake Video
                </button>
                <button
                  onClick={() => {
                    setMediaUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800');
                    setMediaType('image');
                  }}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 font-mono text-[11px]"
                >
                  AI Diffusion Face
                </button>
                <button
                  onClick={() => {
                    setMediaUrl('https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
                    setMediaType('video');
                  }}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 font-mono text-[11px]"
                >
                  Authentic Broadcast
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={handleSendRequest}
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching Request to ViT + Wav2Vec2 Pipeline...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute POST /api/v1/detect</span>
                </>
              )}
            </button>
          </div>

          {/* cURL Snippet */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 font-mono">cURL Command</span>
              <button
                onClick={copyCurl}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-900 p-3 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800/80">
              {curlCommand}
            </pre>
          </div>
        </div>

        {/* Right Column: Live Response Inspector (6 cols) */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[480px]">
          {/* Response Header */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white font-mono">HTTP Response</span>
              {responseStatus !== null && (
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : 'bg-red-950/80 text-red-400 border border-red-800'
                  }`}
                >
                  Status: {responseStatus}
                </span>
              )}
            </div>

            {responseDuration !== null && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{responseDuration} ms</span>
              </div>
            )}
          </div>

          {/* Response Body */}
          <div className="p-4 flex-1 overflow-x-auto bg-[#070b14] text-xs font-mono text-slate-200">
            {responseData ? (
              <pre className="leading-relaxed">{responseData}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16 space-y-2">
                <Code className="w-8 h-8 opacity-40" />
                <p className="text-xs">Click "Execute POST /api/v1/detect" to inspect the live response body.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
