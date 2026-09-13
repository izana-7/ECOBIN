import React from 'react';
import { Leaf, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/60 py-10 mt-auto text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-eco-500/20 text-eco-400 flex items-center justify-center font-bold">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-wide">EcoBin</span>
            <p className="text-[11px] text-slate-500">Smart Waste Management for a Cleaner Campus</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <a href="#how-it-works" className="hover:text-eco-400 transition-colors">How it Works</a>
          <a href="#impact" className="hover:text-eco-400 transition-colors">Campus Impact</a>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">Detect → Report → Find → Clean → Verify → Reward</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
          <span>Built for Campus Cleanliness</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>© 2026 EcoBin</span>
        </div>

      </div>
    </footer>
  );
}
