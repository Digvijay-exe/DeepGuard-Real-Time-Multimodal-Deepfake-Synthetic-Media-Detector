import React from 'react';
import { ShieldCheck, Activity, Download, Play, Terminal, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: 'lab' | 'simulator' | 'code' | 'deployment' | 'api';
  setActiveTab: (tab: 'lab' | 'simulator' | 'code' | 'deployment' | 'api') => void;
  onQuickScan?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onQuickScan }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold font-display tracking-tight text-white">
            DeepGuard
          </span>
          <span className="hidden sm:inline text-xs text-slate-500 font-mono">
            ViT·Wav2Vec2
          </span>
        </div>

        {/* Zone 2: 5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('lab')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'lab'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Forensic Lab
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Extension Simulator
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'code'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Code & Export
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'deployment'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deployment Guide
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'api'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            API Playground
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-950/30 border border-emerald-800/40 px-2.5 py-1 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API :3000 Active</span>
          </div>
          <button
            onClick={() => setActiveTab('code')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .zip</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden items-center justify-around pt-2.5 mt-2.5 border-t border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('lab')}
          className={`py-1 ${activeTab === 'lab' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Lab
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`py-1 ${activeTab === 'simulator' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Simulator
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`py-1 ${activeTab === 'code' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Code
        </button>
        <button
          onClick={() => setActiveTab('deployment')}
          className={`py-1 ${activeTab === 'deployment' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Guide
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`py-1 ${activeTab === 'api' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          API
        </button>
      </div>
    </header>
  );
};
