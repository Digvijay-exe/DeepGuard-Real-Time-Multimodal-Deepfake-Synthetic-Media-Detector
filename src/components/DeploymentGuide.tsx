import React, { useState } from 'react';
import { 
  Terminal, 
  Layers, 
  Cloud, 
  Chrome, 
  Check, 
  Copy, 
  ExternalLink, 
  Server,
  Cpu,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const DeploymentGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyCommand = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
          <span>Step-by-Step Production Guide</span>
          <span aria-hidden="true">·</span>
          <span>FastAPI + Chrome MV3</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
          Deployment & Installation Guide
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Follow these sequential steps to run the FastAPI PyTorch server locally, install the Chrome Extension
          into your browser, and deploy the detection endpoint to Hugging Face Spaces or Render.
        </p>
      </div>

      {/* 3 Main Steps Grid */}
      <div className="space-y-8">
        {/* Step 1: Local FastAPI Setup */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold font-mono text-sm shrink-0">
              01
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <span>Local FastAPI Backend Setup</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Set up a Python 3.10+ virtual environment and run the Uvicorn asynchronous ASGI server.
              </p>
            </div>
          </div>

          <div className="space-y-4 pl-0 sm:pl-13 text-xs">
            {/* Step 1.1 */}
            <div>
              <span className="font-semibold text-slate-300">
                1. Create workspace folder and virtual environment:
              </span>
              <div className="mt-1.5 bg-slate-950 rounded-lg border border-slate-800 p-3 font-mono text-slate-300 flex items-center justify-between">
                <code>
                  mkdir deepfake-detector && cd deepfake-detector<br />
                  python -m venv venv<br />
                  source venv/bin/activate  # On Windows: venv\Scripts\activate
                </code>
                <button
                  onClick={() =>
                    copyCommand(
                      'mkdir deepfake-detector && cd deepfake-detector\npython -m venv venv\nsource venv/bin/activate',
                      'step1'
                    )
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 shrink-0 ml-3"
                >
                  {copiedIndex === 'step1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 1.2 */}
            <div>
              <span className="font-semibold text-slate-300">
                2. Install PyTorch, Hugging Face Transformers, OpenCV, and Librosa:
              </span>
              <div className="mt-1.5 bg-slate-950 rounded-lg border border-slate-800 p-3 font-mono text-slate-300 flex items-center justify-between">
                <code>pip install fastapi uvicorn torch transformers opencv-python-headless librosa pillow requests pydantic</code>
                <button
                  onClick={() =>
                    copyCommand(
                      'pip install fastapi uvicorn torch transformers opencv-python-headless librosa pillow requests pydantic',
                      'step2'
                    )
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 shrink-0 ml-3"
                >
                  {copiedIndex === 'step2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 1.3 */}
            <div>
              <span className="font-semibold text-slate-300">
                3. Save the generated <code className="text-indigo-400 font-mono">app.py</code> and launch Uvicorn:
              </span>
              <div className="mt-1.5 bg-slate-950 rounded-lg border border-slate-800 p-3 font-mono text-slate-300 flex items-center justify-between">
                <code>uvicorn app:app --reload --host 0.0.0.0 --port 8000</code>
                <button
                  onClick={() =>
                    copyCommand('uvicorn app:app --reload --host 0.0.0.0 --port 8000', 'step3')
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 shrink-0 ml-3"
                >
                  {copiedIndex === 'step3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 1.4 */}
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-slate-400">
              <span className="font-semibold text-slate-200">Verification: </span>
              Navigate to <code className="text-sky-400 font-mono">http://localhost:8000/docs</code> in your browser to inspect the interactive Swagger API documentation and execute test payloads against <code className="text-sky-400 font-mono">/api/v1/detect</code>.
            </div>
          </div>
        </section>

        {/* Step 2: Chrome Extension Installation */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono text-sm shrink-0">
              02
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Chrome className="w-4 h-4 text-blue-400" />
                <span>Chrome Extension Installation (Manifest V3)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Load the unpacked extension directory into Google Chrome Developer Mode.
              </p>
            </div>
          </div>

          <div className="space-y-4 pl-0 sm:pl-13 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <div className="font-semibold text-white">1. Extract Extension Files</div>
                <p className="text-slate-400 leading-relaxed">
                  Download the extension zip from the <strong>Code & Export</strong> tab, or place <code className="text-indigo-400">manifest.json</code>, <code className="text-indigo-400">background.js</code>, and <code className="text-indigo-400">popup.html</code> in an <code className="text-slate-200">extension/</code> folder.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <div className="font-semibold text-white">2. Open Extension Manager</div>
                <p className="text-slate-400 leading-relaxed">
                  Open Google Chrome and navigate to <code className="text-sky-400">chrome://extensions/</code> in the address bar. Enable <strong>Developer mode</strong> in the top-right corner toggle.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <div className="font-semibold text-white">3. Click Load Unpacked</div>
                <p className="text-slate-400 leading-relaxed">
                  Click the <strong>Load unpacked</strong> button in the top-left toolbar, and select the folder containing your extension files. The DeepGuard shield badge is now active!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: Deploying Backend to Cloud */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm shrink-0">
              03
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span>Deploying Backend to Cloud (Hugging Face Spaces / Render)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Deploy a public HTTPS inference endpoint with PyTorch and FFmpeg system dependencies.
              </p>
            </div>
          </div>

          <div className="space-y-4 pl-0 sm:pl-13 text-xs">
            {/* Hugging Face Spaces */}
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-2">
              <div className="font-semibold text-white flex items-center justify-between">
                <span>Option A: Hugging Face Spaces (Recommended for Machine Learning)</span>
                <span className="text-[10px] text-emerald-400 font-mono">Free CPU/GPU Runtime</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed">
                <li>Create a new Space on <a href="https://huggingface.co/spaces" target="_blank" rel="noreferrer" className="text-sky-400 underline">huggingface.co/spaces</a> selecting <strong>Docker</strong> SDK.</li>
                <li>Upload the provided <code className="text-indigo-300">Dockerfile</code>, <code className="text-indigo-300">requirements.txt</code>, and <code className="text-indigo-300">app.py</code> files to the repository.</li>
                <li>Hugging Face automatically builds the container and provides an HTTPS endpoint: <code className="text-emerald-400 font-mono">https://&lt;username&gt;-deepfake-api.hf.space</code>.</li>
              </ol>
            </div>

            {/* Render / Railway */}
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-2">
              <div className="font-semibold text-white flex items-center justify-between">
                <span>Option B: Render or Railway</span>
                <span className="text-[10px] text-slate-400 font-mono">Web Service</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed">
                <li>Connect your GitHub repository containing <code className="text-indigo-300">Dockerfile</code>.</li>
                <li>Set environment variable <code className="text-indigo-300">PORT=8000</code>.</li>
                <li>Deploy as a Web Service. Use the generated <code className="text-sky-400">onrender.com</code> URL.</li>
              </ol>
            </div>

            {/* Updating Endpoint */}
            <div className="p-3 bg-indigo-950/30 rounded-lg border border-indigo-800/40 text-slate-300 space-y-1">
              <div className="font-semibold text-indigo-300">Update Extension Endpoint:</div>
              <p className="text-slate-400">
                Once deployed, open the Chrome Extension, click <strong>Settings</strong>, and replace <code className="text-slate-200 font-mono">http://localhost:8000/api/v1/detect</code> with your live HTTPS cloud URL (e.g. <code className="text-sky-400 font-mono">https://my-space.hf.space/api/v1/detect</code>).
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
