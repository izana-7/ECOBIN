import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Save
} from 'lucide-react';

export default function AdminBinsPage() {
  const [bins, setBins] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBin, setEditingBin] = useState(null);

  const [binId, setBinId] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('12.9716');
  const [longitude, setLongitude] = useState('77.5946');
  const [fillLevel, setFillLevel] = useState(0);
  const [acceptedTypes, setAcceptedTypes] = useState(['Plastic', 'Paper']);
  const [status, setStatus] = useState('Available');

  const [message, setMessage] = useState('');

  const allCategories = ['Plastic', 'Paper', 'Organic/Food', 'Glass', 'Metal', 'E-waste'];

  useEffect(() => {
    fetchBins();
  }, []);

  const fetchBins = async () => {
    try {
      const res = await api.get('/bins');
      setBins(res.data || []);
    } catch (err) {
      console.error('Error fetching bins:', err);
    }
  };

  const handleAddBin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bins', {
        binId,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        acceptedWasteTypes: acceptedTypes,
        fillLevel: Number(fillLevel),
        status
      });

      setMessage(`Bin ${binId} created successfully!`);
      setShowAddModal(false);
      resetForm();
      fetchBins();
    } catch (err) {
      console.error('Error adding bin:', err);
    }
  };

  const handleUpdateBin = async (e) => {
    e.preventDefault();
    if (!editingBin) return;

    try {
      await api.put(`/bins/${editingBin._id}`, {
        location,
        fillLevel: Number(fillLevel),
        status,
        acceptedWasteTypes: acceptedTypes
      });

      setMessage(`Bin ${editingBin.binId} updated successfully!`);
      setEditingBin(null);
      resetForm();
      fetchBins();
    } catch (err) {
      console.error('Error updating bin:', err);
    }
  };

  const handleDeleteBin = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bin?')) return;
    try {
      await api.delete(`/bins/${id}`);
      setMessage('Bin deleted successfully!');
      fetchBins();
    } catch (err) {
      console.error('Error deleting bin:', err);
    }
  };

  const resetForm = () => {
    setBinId('');
    setLocation('');
    setFillLevel(0);
    setStatus('Available');
    setAcceptedTypes(['Plastic', 'Paper']);
  };

  const toggleCategory = (cat) => {
    if (acceptedTypes.includes(cat)) {
      setAcceptedTypes(acceptedTypes.filter(c => c !== cat));
    } else {
      setAcceptedTypes([...acceptedTypes, cat]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-eco-400 bg-eco-500/10 px-3 py-1 rounded-full border border-eco-500/20 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Admin Bin Infrastructure Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Campus Bins Management</h1>
          <p className="text-xs text-slate-400 mt-1">Configure campus bin locations, update fill levels %, and toggle availability status.</p>
        </div>

        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="px-4 py-2.5 rounded-2xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-eco-500/20"
        >
          <Plus className="w-4 h-4" /> Add Campus Bin
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-eco-500/10 border border-eco-500/30 text-eco-400 text-xs font-bold text-center">
          {message}
        </div>
      )}

      {/* Bins Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Bin ID</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Accepted Waste</th>
                <th className="px-6 py-3.5">Fill Level</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {bins.map((b) => (
                <tr key={b._id || b.binId} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 font-extrabold text-white">{b.binId}</td>
                  <td className="px-6 py-4">{b.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {b.acceptedWasteTypes?.map((t, idx) => (
                        <span key={idx} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${b.fillLevel >= 90 ? 'bg-rose-500' : b.fillLevel >= 65 ? 'bg-amber-500' : 'bg-eco-500'}`}
                          style={{ width: `${b.fillLevel}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-white">{b.fillLevel}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      b.status === 'Available' ? 'bg-eco-500/20 text-eco-400 border border-eco-500/30' :
                      b.status === 'Nearly Full' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingBin(b);
                        setLocation(b.location);
                        setFillLevel(b.fillLevel);
                        setStatus(b.status);
                        setAcceptedTypes(b.acceptedWasteTypes || []);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBin(b._id)}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Bin Modal */}
      {(showAddModal || editingBin) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-md w-full relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">
                {editingBin ? `Edit Bin ${editingBin.binId}` : 'Add Campus Bin'}
              </h3>
              <button onClick={() => { setShowAddModal(false); setEditingBin(null); }} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingBin ? handleUpdateBin : handleAddBin} className="space-y-4 text-xs">
              {!editingBin && (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Bin ID *</label>
                  <input
                    type="text"
                    required
                    value={binId}
                    onChange={(e) => setBinId(e.target.value)}
                    placeholder="e.g. BIN-107"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold mb-1">Location *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Library Quad East Wing"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Fill Level: {fillLevel}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fillLevel}
                  onChange={(e) => setFillLevel(Number(e.target.value))}
                  className="w-full accent-eco-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Accepted Waste Types</label>
                <div className="flex flex-wrap gap-1.5">
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                        acceptedTypes.includes(cat)
                          ? 'bg-eco-500/20 text-eco-400 border-eco-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs shadow-lg shadow-eco-500/20 mt-2"
              >
                {editingBin ? 'Save Changes' : 'Create Bin'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
