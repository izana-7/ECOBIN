import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
  Mail,
  Phone,
  Building,
  Award,
  ShieldCheck,
  Edit2,
  Save,
  CheckCircle2,
  Activity,
  Sparkles
} from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [pointsData, setPointsData] = useState({ ecoPoints: 0, level: '', badges: [], transactions: [] });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setDepartment(user.department || '');
      fetchPointsData();
    }
  }, [user]);

  const fetchPointsData = async () => {
    try {
      const res = await api.get('/users/points');
      setPointsData(res.data);
    } catch (err) {
      console.error('Error fetching points data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', { name, phone, department });
      setMessage('Profile updated successfully!');
      setEditing(false);
      await refreshProfile();
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Bio Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-eco-950/40">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-eco-500 to-emerald-300 p-1 shadow-xl shrink-0">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-extrabold text-eco-400">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>

              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 justify-center transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" /> {editing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-eco-500/10 text-eco-400 border border-eco-500/20 font-bold">
                {user?.level || 'Eco Starter'}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-500" /> {user?.department}
              </span>
              {user?.phone && (
                <span className="text-slate-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> {user?.phone}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-eco-500/10 border border-eco-500/30 text-eco-400 text-xs font-bold text-center">
          {message}
        </div>
      )}

      {/* Profile Edit Form */}
      {editing && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white">Edit Profile Details</h3>
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Badges Gallery */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Unlocked Eco Badges
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {pointsData.badges?.map((badge) => (
            <div
              key={badge.key}
              className={`p-4 rounded-2xl border text-center transition-all ${
                badge.unlocked
                  ? 'bg-slate-900/90 border-eco-500/40 shadow-lg'
                  : 'bg-slate-950/40 border-slate-800 opacity-40 grayscale'
              }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h4 className="font-extrabold text-xs text-white mb-1">{badge.name}</h4>
              <p className="text-[10px] text-slate-400 leading-tight">{badge.description}</p>
              <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded ${
                badge.unlocked ? 'bg-eco-500/20 text-eco-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {badge.unlocked ? 'Unlocked ✓' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Point Transactions History */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-eco-400" /> Eco Points Ledger History
        </h3>

        <div className="space-y-2">
          {pointsData.transactions?.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-6">No point transactions recorded yet.</div>
          ) : (
            pointsData.transactions?.map((tx) => (
              <div key={tx._id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">{tx.reason}</div>
                  <div className="text-[10px] text-slate-500">{new Date(tx.createdAt).toLocaleString()}</div>
                </div>
                <div className="font-extrabold text-eco-400 text-sm">+{tx.points} PTS</div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
