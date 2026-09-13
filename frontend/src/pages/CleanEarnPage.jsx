import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Camera,
  Upload,
  Sparkles,
  Clock,
  Flame,
  X,
  AlertCircle
} from 'lucide-react';

export default function CleanEarnPage() {
  const { user, refreshProfile } = useAuth();
  const [missions, setMissions] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [proofDescription, setProofDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMissionsData();
  }, []);

  const fetchMissionsData = async () => {
    try {
      const [missionsRes, submissionsRes] = await Promise.all([
        api.get('/missions'),
        api.get('/missions/my-submissions')
      ]);
      setMissions(missionsRes.data || []);
      setMySubmissions(submissionsRes.data || []);
    } catch (err) {
      console.error('Error fetching missions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMission = async (missionId) => {
    setError('');
    setMessage('');
    setActionLoading(true);

    try {
      const res = await api.post(`/missions/${missionId}/join`);
      setMessage(res.data.message || 'Joined mission successfully!');
      await fetchMissionsData();
      await refreshProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Error joining mission.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBeforeImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBeforeImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAfterImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAfterImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!beforeImage || !afterImage) {
      return setError('Both Before and After photos are required for verification.');
    }

    setError('');
    setActionLoading(true);

    try {
      await api.post(`/missions/${selectedMission._id}/submit`, {
        beforeImageUrl: beforeImage,
        afterImageUrl: afterImage,
        description: proofDescription
      });

      setMessage('Cleaning proof submitted successfully! Pending Admin verification.');
      setShowSubmitModal(false);
      setBeforeImage('');
      setAfterImage('');
      setProofDescription('');
      await fetchMissionsData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting proof.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 mb-3">
            <Award className="w-4 h-4" />
            <span>Voluntary Campus Cleanliness Program</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Clean & Earn Eco Points</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Join campus cleaning drives, submit Before & After proof photos, and earn verified Eco Points upon Admin approval.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-eco-500/10 border border-eco-500/30 text-eco-400 text-xs font-bold text-center">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
          {error}
        </div>
      )}

      {/* Active Missions Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" /> Active Campus Missions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((m) => {
            const hasJoined = m.participants?.some(p => (p._id || p) === user?._id || p === user?._id);
            const mySubmission = mySubmissions.find(s => (s.missionId?._id || s.missionId) === m._id);

            return (
              <div key={m._id} className="glass-panel glass-panel-hover p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                      m.difficulty === 'Easy' ? 'bg-eco-500/10 text-eco-400 border-eco-500/30' :
                      m.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {m.difficulty} Difficulty
                    </span>
                    
                    <div className="flex items-center gap-1 text-amber-400 font-extrabold text-xs px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Award className="w-3.5 h-3.5" /> +{m.rewardPoints} PTS
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-white mb-2">{m.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{m.description}</p>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-eco-400" />
                      <span>{m.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Deadline: {new Date(m.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>{m.participants?.length || 0} / {m.maxParticipants} Volunteers Joined</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  {mySubmission ? (
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block mb-1">Submission Status:</span>
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full inline-block ${
                        mySubmission.status === 'Approved' ? 'bg-eco-500/20 text-eco-400 border border-eco-500/30' :
                        mySubmission.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {mySubmission.status}
                      </span>
                    </div>
                  ) : hasJoined ? (
                    <button
                      onClick={() => { setSelectedMission(m); setShowSubmitModal(true); }}
                      className="w-full py-3 rounded-2xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-eco-500/20"
                    >
                      <Camera className="w-4 h-4" /> Upload Before & After Proof
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinMission(m._id)}
                      disabled={actionLoading}
                      className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                    >
                      Join Mission (+{m.rewardPoints} PTS)
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Proof Modal */}
      {showSubmitModal && selectedMission && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-lg w-full relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-eco-400" /> Submit Cleaning Proof
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Uploading proof for <strong>"{selectedMission.title}"</strong> (+{selectedMission.rewardPoints} PTS). Admin will review your photos before awarding points.
            </p>

            <form onSubmit={handleSubmitProof} className="space-y-4">
              
              {/* Before Photo */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Before Photo (Littered Area) *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBeforeImageUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200"
                />
                {beforeImage && (
                  <img src={beforeImage} alt="Before" className="mt-2 h-28 w-full object-cover rounded-xl border border-slate-800" />
                )}
              </div>

              {/* After Photo */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">After Photo (Cleaned Area) *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAfterImageUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200"
                />
                {afterImage && (
                  <img src={afterImage} alt="After" className="mt-2 h-28 w-full object-cover rounded-xl border border-slate-800" />
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cleaning Summary</label>
                <textarea
                  rows="2"
                  value={proofDescription}
                  onChange={(e) => setProofDescription(e.target.value)}
                  placeholder="Describe your cleaning activity, items collected, bags filled..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-eco-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3.5 rounded-2xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-eco-500/20"
              >
                {actionLoading ? 'Uploading Proof...' : 'Submit Proof for Admin Review'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
