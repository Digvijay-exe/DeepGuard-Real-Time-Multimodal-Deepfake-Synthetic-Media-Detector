import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FolderArchive, 
  Terminal, 
  Layers, 
  FileText,
  PackageCheck
} from 'lucide-react';
import { CODE_FILES, CodeFile } from '../data/extensionFiles';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(CODE_FILES[0]);
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Chrome Extension' | 'FastAPI Backend'>('All');
  const [copied, setCopied] = useState(false);
  const [downloadingExtension, setDownloadingExtension] = useState(false);
  const [downloadingBackend, setDownloadingBackend] = useState(false);

  const filteredFiles = CODE_FILES.filter(
    (f) => categoryFilter === 'All' || f.category === categoryFilter
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate and download Chrome Extension ZIP package
  const downloadExtensionZip = async () => {
    setDownloadingExtension(true);
    try {
      const zip = new JSZip();
      const extFolder = zip.folder('deepguard-chrome-extension');

      // Add extension files
      const extensionFiles = CODE_FILES.filter((f) => f.category === 'Chrome Extension');
      extensionFiles.forEach((file) => {
        extFolder?.file(file.filename, file.content);
      });

      // Add a clean README.txt
      extFolder?.file(
        'README.txt',
        `DeepGuard - Chrome Extension (Manifest V3)
===========================================

Installation Instructions:
1. Open Google Chrome and navigate to chrome://extensions/
2. Toggle on "Developer mode" in the top-right corner.
3. Click "Load unpacked" in the top-left toolbar.
4. Select this extracted "deepguard-chrome-extension" folder.
5. The DeepGuard shield icon will appear in your Chrome toolbar!

Configuring Backend API:
- By default, the extension points to http://localhost:8000/api/v1/detect
- You can change this to your deployed Hugging Face Spaces or Render endpoint
  by clicking the extension icon and opening "Settings".
`
      );

      // Generate SVG icons
      const iconFolder = extFolder?.folder('icons');
      const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#0f172a"/><path d="M64 20 L100 36 L100 68 C100 88 84 104 64 112 C44 104 28 88 28 68 L28 36 Z" fill="none" stroke="#38bdf8" stroke-width="8"/><path d="M50 64 L60 74 L80 50" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/></svg>`;
      iconFolder?.file('icon16.png', iconSvg);
      iconFolder?.file('icon48.png', iconSvg);
      iconFolder?.file('icon128.png', iconSvg);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'deepguard-chrome-extension.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create extension zip:', err);
    } finally {
      setDownloadingExtension(false);
    }
  };

  // Generate and download FastAPI Backend ZIP package
  const downloadBackendZip = async () => {
    setDownloadingBackend(true);
    try {
      const zip = new JSZip();
      const backendFolder = zip.folder('deepguard-fastapi-backend');

      const backendFiles = CODE_FILES.filter((f) => f.category === 'FastAPI Backend');
      backendFiles.forEach((file) => {
        backendFolder?.file(file.filename, file.content);
      });

      backendFolder?.file(
        'docker-compose.yml',
        `version: '3.8'
services:
  deepguard-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
    restart: unless-stopped
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'deepguard-fastapi-backend.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create backend zip:', err);
    } finally {
      setDownloadingBackend(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <span>Manifest V3</span>
            <span aria-hidden="true">·</span>
            <span>FastAPI Uvicorn</span>
            <span aria-hidden="true">·</span>
            <span>PyTorch Transformers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
            Source Code Package & Export Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Production-ready code artifacts for both the Chrome Extension (Manifest V3) and the FastAPI backend server.
            Copy individual files or generate ready-to-deploy zip bundles.
          </p>
        </div>

        {/* 1-Click ZIP Download Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={downloadExtensionZip}
            disabled={downloadingExtension}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingExtension ? 'Packaging...' : 'Download Extension (.zip)'}</span>
          </button>

          <button
            onClick={downloadBackendZip}
            disabled={downloadingBackend}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>{downloadingBackend ? 'Packaging...' : 'Download Backend (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Main Code View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File Tree Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Segmented Filter */}
          <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            {(['All', 'Chrome Extension', 'FastAPI Backend'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex-1 py-1.5 font-medium rounded-md transition-colors ${
                  categoryFilter === cat
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl divide-y divide-slate-800/80 overflow-hidden">
            {filteredFiles.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-3 flex items-start gap-3 transition-colors ${
                  selectedFile.path === file.path
                    ? 'bg-slate-800/90 text-white'
                    : 'bg-transparent text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div className="mt-0.5 text-indigo-400 shrink-0">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="font-mono text-white">{file.filename}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{file.language}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {file.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Package Summary Box */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              <span>Manifest V3 Compliance</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Fully compliant with Chrome Web Store Manifest V3 guidelines. Uses background service workers
              instead of persistent background pages, and scoped context menu event dispatching.
            </p>
          </div>
        </div>

        {/* Right Column: Code Editor / Display (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          {/* File Header */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500">{selectedFile.category} /</span>
              <span className="text-indigo-300 font-semibold">{selectedFile.filename}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 text-[11px]">{selectedFile.content.split('\n').length} lines</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Description bar */}
          <div className="bg-slate-900/40 px-4 py-2 text-xs text-slate-400 border-b border-slate-800/80">
            {selectedFile.description}
          </div>

          {/* Code Body with line numbers */}
          <div className="p-4 overflow-x-auto max-h-[580px] bg-[#070b14] text-xs font-mono leading-relaxed select-text">
            <table className="w-full border-collapse">
              <tbody>
                {selectedFile.content.split('\n').map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="w-10 pr-4 text-right text-slate-600 select-none tabular-nums font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="text-slate-200 whitespace-pre">
                      {line}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
