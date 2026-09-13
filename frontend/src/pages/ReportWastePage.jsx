import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import {
  Trash2,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';

export default function ReportWastePage() {
  const locationState = useLocation().state || {};

  const [wasteType, setWasteType] = useState(locationState.prefilledType || 'Plastic');
  const [location, setLocation] = useState(locationState.prefilledLocation || 'Tech Block A Annex');
  const [description, setDescription] = useState(locationState.prefilledDescription || '');
  const [quantity, setQuantity] = useState('Medium');
  const [imageUrl, setImageUrl] = useState(locationState.prefilledImage || '');
  const [aiDetectedType] = useState(locationState.aiDetectedType || '');
  const [aiConfidence] = useState(locationState.aiConfidence || 0);

  const [loading, setLoading] = useState(false);
  const [successReport, setSuccessReport] = useState(null);
  const [error, setError] = useState('');

  const [myReports, setMyReports] = useState([]);
  const [activeTab, setActiveTab] = useState('form');

  const categories = ['Plastic', 'Paper', 'Organic/Food', 'Glass', 'Metal', 'E-waste', 'Other'];
  const quantities = ['Small', 'Medium', 'Large', 'Bulk'];

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const res = await api.get('/reports/my');
      setMyReports(res.data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/reports', {
        wasteType,
        location,
        description,
        quantity,
        imageUrl,
        aiDetectedType,
        aiConfidence
      });

      setSuccessReport(res.data.report);
      fetchMyReports();
      // Reset form fields
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting waste report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-eco-400 bg-eco-500/10 px-3 py-1 rounded-full border border-eco-500/20 mb-2">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Campus Cleanliness Reporting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Report Waste Hotspot</h1>
          <p className="text-xs text-slate-400 mt-1">Log campus waste with photos & location to alert environmental services.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'form' ? 'bg-eco-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Submit Report
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history' ? 'bg-eco-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Reports ({myReports.length})
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            
            {successReport && (
              <div className="p-4 rounded-2xl bg-eco-500/10 border border-eco-500/30 text-eco-400 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <CheckCircle2 className="w-5 h-5 text-eco-400" />
                  <span>Report Created Successfully! (+25 Eco Points)</span>
                </div>
                <p>Generated Report ID: <span className="font-extrabold text-white px-2 py-0.5 rounded bg-eco-500/20">{successReport.reportId}</span></p>
                <p>Status: <span className="font-bold text-slate-200">{successReport.status}</span></p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Waste Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setWasteType(cat)}
                      className={`p-3 rounded-2xl text-xs font-bold border text-center transition-all ${
                        wasteType === cat
                          ? 'bg-eco-500/20 text-eco-300 border-eco-500 shadow-md shadow-eco-500/10'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Campus Location *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Library Quad - West Wing near Bench #3"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-eco-500"
                  />
                </div>
              </div>

              {/* Quantity selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Approximate Quantity
                </label>
                <div className="flex gap-2">
                  {quantities.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuantity(q)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        quantity === q
                          ? 'bg-slate-800 text-eco-400 border-eco-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description & Details
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the waste items, severity, or special handling required..."
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-eco-500"
                ></textarea>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Waste Photo Proof
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Camera className="w-4 h-4 text-eco-400" />
                    Upload Photo File
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <span className="text-xs text-slate-500">or paste photo URL:</span>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-eco-500"
                  />
                </div>

                {imageUrl && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-slate-800 max-h-48">
                    <img src={imageUrl} alt="Waste Preview" className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-eco-500/20 disabled:opacity-50 transition-all"
              >
                {loading ? 'Submitting Report...' : 'Submit Waste Report (+25 Eco Points)'}
              </button>

            </form>

          </div>

          {/* Info Card */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-eco-400" /> What Happens Next?
              </h3>
              <ul className="text-xs text-slate-400 space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-eco-500/20 text-eco-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Your report generates a unique ID (e.g. ECO-2026-00124) saved directly in MongoDB.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-eco-500/20 text-eco-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span>You instantly earn <strong>+25 Eco Points</strong> for reporting campus waste.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-eco-500/20 text-eco-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Campus Admin reviews the report, assigns collection staff, and updates status to Resolved (+25 bonus points).</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      ) : (
        /* History View */
        <div className="space-y-4">
          {myReports.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-400 text-xs rounded-3xl border border-slate-800">
              No reports submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReports.map((r) => (
                <div key={r._id} className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-white">{r.reportId}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      r.status === 'Resolved' ? 'bg-eco-500/20 text-eco-400 border border-eco-500/30' :
                      r.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {r.status}
                    </span>
                  </div>

                  {r.imageUrl && (
                    <img src={r.imageUrl} alt="Report Waste" className="w-full h-36 object-cover rounded-xl border border-slate-800" />
                  )}

                  <div className="text-xs space-y-1">
                    <div className="text-slate-300 font-bold">{r.wasteType} ({r.quantity} Quantity)</div>
                    <div className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-eco-400 shrink-0" /> {r.location}
                    </div>
                    {r.description && <p className="text-slate-400 italic">"{r.description}"</p>}
                  </div>

                  <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 flex justify-between">
                    <span>Logged on: {new Date(r.createdAt).toLocaleDateString()}</span>
                    {r.assignedTo && <span className="text-eco-400 font-semibold">Assigned: {r.assignedTo}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
