import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import {
  Sparkles,
  Trash2,
  MapPin,
  Award,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp,
  Leaf,
  Users
} from 'lucide-react';

export default function LandingPage() {
  const stats = [
    { label: 'Total Reports Logged', value: '1,420+', icon: Trash2, color: 'text-eco-400' },
    { label: 'Active Student Volunteers', value: '850+', icon: Users, color: 'text-blue-400' },
    { label: 'Cleanups Completed', value: '320+', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Eco Points Awarded', value: '45,800+', icon: Award, color: 'text-amber-400' },
  ];

  const steps = [
    { number: '01', title: 'Detect Waste', desc: 'Scan any waste using our AI computer vision model to identify its category & recyclability in seconds.', icon: Sparkles },
    { number: '02', title: 'Report Hotspots', desc: 'Log litter or overflowing bins with location details and photos to alert campus administration.', icon: Trash2 },
    { number: '03', title: 'Find the Right Bin', desc: 'Locate nearby available bins filtered by waste type (Plastic, E-waste, Organic, Paper) on the campus map.', icon: MapPin },
    { number: '04', title: 'Clean & Earn', desc: 'Join voluntary campus cleaning drives, upload before/after proof, and earn verified Eco Points.', icon: Award },
    { number: '05', title: 'Compete & Unlock', desc: 'Rise up the campus leaderboard, level up from Eco Starter to Eco Champion, and unlock exclusive badges.', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-eco-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold mb-6">
            <Leaf className="w-3.5 h-3.5" />
            <span>Next-Generation Smart Campus Cleanliness</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            EcoBin
            <span className="block mt-2 bg-gradient-to-r from-eco-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Smart Waste Management for a Cleaner Campus
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Detect waste with AI, report hotspots, locate smart bins, join voluntary campus cleanups, upload before/after proof, and earn verified Eco Points on the campus leaderboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-eco-500/25 hover:scale-105"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-slate-800 text-slate-200 font-bold text-base flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              Login to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Counter */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="glass-panel p-6 rounded-2xl text-center border border-slate-800">
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How EcoBin Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-eco-400 mb-2">Simple 5-Step Process</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How EcoBin Works</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="glass-panel glass-panel-hover p-6 rounded-2xl relative border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold text-eco-400 bg-eco-500/10 px-2.5 py-1 rounded-full border border-eco-500/20 mb-4 inline-block">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-eco-400 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Features Overview */}
      <section id="impact" className="py-16 bg-slate-900/30 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-eco-500/30 transition-all">
              <Sparkles className="w-10 h-10 text-eco-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AI Waste Computer Vision</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Snap or upload any waste photo. EcoBin’s AI model instantly classifies Plastic, Paper, Organic, Glass, Metal, or E-waste with high confidence ratings.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-eco-500/30 transition-all">
              <MapPin className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Interactive Bin Locator</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Real-time campus map showing bin locations, accepted waste categories, and fill levels (🟢 Available, 🟡 Nearly Full, 🔴 Full).
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-eco-500/30 transition-all">
              <Award className="w-10 h-10 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Verified Clean & Earn Rewards</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Participate in voluntary cleaning missions, submit Before & After proof for Admin review, and earn verified Eco Points to climb campus ranks.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
