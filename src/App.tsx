/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { EvaluationLab } from './components/EvaluationLab';
import { ExtensionSimulator } from './components/ExtensionSimulator';
import { CodeViewer } from './components/CodeViewer';
import { DeploymentGuide } from './components/DeploymentGuide';
import { ApiPlayground } from './components/ApiPlayground';
import { ShieldCheck, Github, ExternalLink, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lab' | 'simulator' | 'code' | 'deployment' | 'api'>('lab');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-300">
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {activeTab === 'lab' && <EvaluationLab />}
        {activeTab === 'simulator' && <ExtensionSimulator />}
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'deployment' && <DeploymentGuide />}
        {activeTab === 'api' && <ApiPlayground />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300 font-display">DeepGuard Detection System</span>
            <span aria-hidden="true">·</span>
            <span>Manifest V3 Extension & FastAPI Backend</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>ViT: google/vit-base-patch16-224</span>
            <span aria-hidden="true">·</span>
            <span>Audio: facebook/wav2vec2-base-960h</span>
            <span aria-hidden="true">·</span>
            <span>Express :3000 Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
