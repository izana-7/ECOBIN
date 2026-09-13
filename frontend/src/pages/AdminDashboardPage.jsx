import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  ShieldAlert,
  Users,
  Trash2,
  CheckCircle2,
  Award,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = stats?.metrics || {};
  const charts = stats?.charts || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Campus Administrative Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Dashboard & Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time overview of campus waste reports, cleaning missions, and user engagement.</p>
        </div>

        {/* Quick Admin Links */}
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/reports"
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-blue-400" /> Manage Reports
          </Link>
          <Link
            to="/admin/missions"
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Award className="w-4 h-4 text-amber-400" /> Manage Missions
          </Link>
          <Link
            to="/admin/bins"
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-4 h-4 text-eco-400" /> Manage Bins
          </Link>
          <Link
            to="/admin/users"
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-4 h-4 text-purple-400" /> Manage Users
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block mb-1">Total Users</span>
          <div className="text-2xl font-extrabold text-white">{metrics.totalUsers || 0}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block mb-1">Total Reports</span>
          <div className="text-2xl font-extrabold text-blue-400">{metrics.totalReports || 0}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block mb-1">Pending Reports</span>
          <div className="text-2xl font-extrabold text-amber-400">{metrics.pendingReports || 0}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block mb-1">Resolved Reports</span>
          <div className="text-2xl font-extrabold text-eco-400">{metrics.resolvedReports || 0}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block mb-1">Pending Submissions</span>
          <div className="text-2xl font-extrabold text-purple-400">{metrics.pendingSubmissions || 0}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block mb-1">Total Eco Points</span>
          <div className="text-2xl font-extrabold text-amber-300">{metrics.totalEcoPointsAwarded || 0}</div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Waste Category Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-eco-400" /> Waste Category Distribution
          </h3>
          <div className="h-64">
            {charts.categoryDistribution && charts.categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    label={({ name, count }) => `${name}: ${count}`}
                  >
                    {charts.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">No chart data</div>
            )}
          </div>
        </div>

        {/* Department Participation Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" /> Department Eco Points Leaderboard
          </h3>
          <div className="h-64">
            {charts.departmentStats && charts.departmentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.departmentStats}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="points" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">No chart data</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
