import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Award,
  TrendingUp,
  Trash2,
  CheckCircle2,
  Sparkles,
  MapPin,
  Flame,
  ArrowRight,
  ShieldCheck,
  Activity,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const { user, refreshProfile } = useAuth();
  const [myReports, setMyReports] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      await refreshProfile();
      const [reportsRes, submissionsRes] = await Promise.all([
        api.get('/reports/my'),
        api.get('/missions/my-submissions')
      ]);
      setMyReports(reportsRes.data || []);
      setMySubmissions(submissionsRes.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getNextLevelTarget = (points) => {
    if (points >= 2500) return { title: 'Eco Champion (Max)', target: 2500, current: points };
    if (points >= 1000) return { title: 'Eco Champion', target: 2500, current: points };
    if (points >= 500) return { title: 'Eco Warrior', target: 1000, current: points };
    return { title: 'Eco Helper', target: 500, current: points };
  };

  const levelInfo = getNextLevelTarget(user?.ecoPoints || 0);
  const progressPercent = Math.min(100, Math.round((levelInfo.current / levelInfo.target) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-eco-950/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-eco-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-eco-400 bg-eco-500/10 px-3 py-1 rounded-full border border-eco-500/20 mb-3">
              <span>{user?.department || 'Campus Contributor'}</span>
              <span>•</span>
              <span>{user?.role === 'admin' ? 'Admin Access' : 'Verified Student'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Welcome back, {user?.name || 'Student'}! 🌱
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Your environmental actions are keeping campus clean & sustainable.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/scan"
              className="px-5 py-2.5 rounded-2xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-eco-500/20"
            >
              <Sparkles className="w-4 h-4" /> AI Waste Scanner
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Eco Points Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Eco Points</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{user?.ecoPoints || 0}</div>
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Total Points Ledger
          </span>
        </div>

        {/* Level Card & Progress */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Current Eco Level</span>
            <span className="text-xs font-bold text-eco-400 px-2.5 py-0.5 rounded-full bg-eco-500/10 border border-eco-500/20">
              {user?.level || 'Eco Starter'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1.5">
            <span>Next Rank: {levelInfo.title}</span>
            <span className="font-bold text-white">{levelInfo.current} / {levelInfo.target} PTS</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-eco-500 to-emerald-300 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Reports Submitted */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Reports Submitted</span>
            <Trash2 className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{user?.stats?.reportsSubmitted || myReports.length}</div>
          <span className="text-[10px] text-slate-400">Logged Hotspots</span>
        </div>

        {/* Cleanups Completed */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Cleanups Done</span>
            <CheckCircle2 className="w-5 h-5 text-eco-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{user?.stats?.cleanupsCompleted || mySubmissions.filter(s => s.status === 'Approved').length}</div>
          <span className="text-[10px] text-slate-400">Approved Missions</span>
        </div>

      </div>

      {/* Quick Action Buttons Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <Link
            to="/report"
            className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-white">Report Waste</h4>
            <p className="text-[11px] text-slate-400 mt-1">Log campus waste hotspot</p>
          </Link>

          <Link
            to="/scan"
            className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-eco-500/10 text-eco-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-white">AI Waste Scanner</h4>
            <p className="text-[11px] text-slate-400 mt-1">Detect waste category</p>
          </Link>

          <Link
            to="/bins"
            className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-white">Find a Bin</h4>
            <p className="text-[11px] text-slate-400 mt-1">Locate nearby campus bins</p>
          </Link>

          <Link
            to="/clean-earn"
            className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-white">Clean & Earn</h4>
            <p className="text-[11px] text-slate-400 mt-1">Join voluntary missions</p>
          </Link>

        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-eco-400" /> Recent Activity Stream
          </h3>
          <Link to="/profile" className="text-xs text-eco-400 hover:underline font-semibold flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myReports.length === 0 && mySubmissions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No recent activity logged yet. Submit a waste report or join a cleaning mission to start earning points!
          </div>
        ) : (
          <div className="space-y-3">
            {myReports.slice(0, 3).map((r) => (
              <div key={r._id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-200">Waste Report Submitted ({r.reportId})</div>
                    <div className="text-slate-400 text-[11px]">{r.wasteType} at {r.location}</div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  r.status === 'Resolved' ? 'bg-eco-500/20 text-eco-400 border border-eco-500/30' :
                  r.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}

            {mySubmissions.slice(0, 3).map((s) => (
              <div key={s._id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-eco-500/10 text-eco-400 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-200">Cleaning Proof Uploaded</div>
                    <div className="text-slate-400 text-[11px]">{s.missionId ? s.missionId.title : 'Cleaning Drive'}</div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  s.status === 'Approved' ? 'bg-eco-500/20 text-eco-400 border border-eco-500/30' :
                  s.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
