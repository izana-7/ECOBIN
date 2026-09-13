import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CampusMap from '../components/CampusMap';
import {
  MapPin,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
  Search
} from 'lucide-react';

export default function BinLocatorPage() {
  const [bins, setBins] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedBin, setSelectedBin] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Plastic', 'Paper', 'Organic/Food', 'Glass', 'Metal', 'E-waste'];
  const statuses = ['All', 'Available', 'Nearly Full', 'Full'];

  useEffect(() => {
    fetchBins();
  }, [selectedCategory, selectedStatus]);

  const fetchBins = async () => {
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await api.get('/bins', { params });
      setBins(res.data || []);
    } catch (err) {
      console.error('Error fetching bins:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Campus Waste Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Campus Bin Locator</h1>
          <p className="text-xs text-slate-400 mt-1">Locate nearby smart bins, check live fill levels, and filter by accepted waste type.</p>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedStatus === st
                  ? 'bg-eco-500 text-slate-950 border-eco-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              selectedCategory === cat
                ? 'bg-slate-800 text-eco-400 border-eco-500'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Map + Bins Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-2 space-y-4">
          <CampusMap bins={bins} selectedBin={selectedBin} onSelectBin={setSelectedBin} />
        </div>

        {/* Right Column: Bin List */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 max-h-[480px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-eco-400" /> Bins List ({bins.length})
            </h3>
          </div>

          {bins.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No bins match the selected filter.
            </div>
          ) : (
            <div className="space-y-3">
              {bins.map((bin) => (
                <div
                  key={bin._id || bin.binId}
                  onClick={() => setSelectedBin(bin)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedBin && (selectedBin._id === bin._id || selectedBin.binId === bin.binId)
                      ? 'bg-slate-800/90 border-eco-500 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-xs text-white">{bin.binId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      bin.status === 'Available' ? 'bg-eco-500/20 text-eco-400 border border-eco-500/30' :
                      bin.status === 'Nearly Full' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {bin.status === 'Available' && <CheckCircle2 className="w-3 h-3" />}
                      {bin.status === 'Nearly Full' && <AlertTriangle className="w-3 h-3" />}
                      {bin.status === 'Full' && <XCircle className="w-3 h-3" />}
                      {bin.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-300 mb-2">{bin.location}</p>

                  <div className="space-y-1 mb-2">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Fill Level</span>
                      <span className="font-bold text-white">{bin.fillLevel}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          bin.fillLevel >= 90 ? 'bg-rose-500' :
                          bin.fillLevel >= 65 ? 'bg-amber-500' : 'bg-eco-500'
                        }`}
                        style={{ width: `${bin.fillLevel}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {bin.acceptedWasteTypes?.map((t, idx) => (
                      <span key={idx} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
