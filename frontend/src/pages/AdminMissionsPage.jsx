import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Award,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Camera,
  X,
  AlertCircle
} from 'lucide-react';

export default function AdminMissionsPage() {
  const [missions, setMissions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newReward, setNewReward] = useState('100');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('Medium');

  const [adminFeedback, setAdminFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'missions'

  useEffect(() => {
    fetchAdminMissionsData();
  }, []);

  const fetchAdminMissionsData = async () => {
    try {
      const [missionsRes, reportsRes] = await Promise.all([
        api.get('/missions'),
        api.get('/reports') // for general stats
      ]);
      setMissions(missionsRes.data || []);
      
      // Fetch submissions for review by querying missions/my-submissions equivalent for admin
      // For demo, we get all submissions by calling mission controller endpoint
      const subRes = await api.get('/missions/my-submissions'); // returns user's or admin view
      setSubmissions(subRes.data || []);
    } catch (err) {
      console.error('Error fetching admin mission data:', err);
    }
  };

  const handleCreateMission = async (e) => {
    e.preventDefault();
    try {
      await api.post('/missions', {
        title: newTitle,
        description: newDesc,
        location: newLocation,
        rewardPoints: Number(newReward),
        deadline: newDeadline,
        difficulty: newDifficulty
      });

      setMessage('New cleaning mission created successfully!');
      setShowCreateModal(false);
      fetchAdminMissionsData();
    } catch (err) {
      console.error('Error creating mission:', err);
    }
  };

  const handleReview = async (submissionId, status) => {
    try {
      await api.put(`/missions/submissions/${submissionId}/review`, {
        status,
        adminFeedback
      });

      setMessage(`Submission ${status.toLowerCase()}! Eco Points ledger updated.`);
      setSelectedSubmission(null);
      fetchAdminMissionsData();
    } catch (err) {
      console.error('Error reviewing submission:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Admin Cleaning Missions Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Missions & Submissions Review</h1>
          <p className="text-xs text-slate-400 mt-1">Review student Before/After proof, approve points rewards, and post new missions.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-eco-500/20"
        >
          <Plus className="w-4 h-4" /> Create New Mission
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-eco-500/10 border border-eco-500/30 text-eco-400 text-xs font-bold text-center">
          {message}
        </div>
      )}

      {/* Active Missions Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-white">Active Campus Missions ({missions.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missions.map((m) => (
            <div key={m._id} className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{m.title}</span>
                <span className="text-xs font-extrabold text-amber-400">+{m.rewardPoints} PTS</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
              <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-800/80 pt-2">
                <span>{m.location}</span>
                <span>{m.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Mission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-md w-full relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Create Campus Mission</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMission} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Clean College Garden"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description *</label>
                <textarea
                  rows="2"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Mission details and goals..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Botanical Garden"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Reward Eco Points *</label>
                  <input
                    type="number"
                    required
                    value={newReward}
                    onChange={(e) => setNewReward(e.target.value)}
                    placeholder="100"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Deadline *</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs shadow-lg shadow-eco-500/20 mt-2"
              >
                Publish Mission
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
