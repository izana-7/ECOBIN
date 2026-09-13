import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Trophy,
  Award,
  Crown,
  Medal,
  Users,
  Filter,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [filterTime, setFilterTime] = useState('Overall');
  const [loading, setLoading] = useState(true);

  const departments = [
    'All',
    'Computer Science',
    'Mechanical Engineering',
    'Biotechnology',
    'Electrical Engineering',
    'Environmental Services'
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedDepartment, filterTime]);

  const fetchLeaderboard = async () => {
    try {
      const params = {
        department: selectedDepartment,
        filter: filterTime
      };
      const res = await api.get('/users/leaderboard', { params });
      setLeaderboard(res.data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const remainingList = leaderboard.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Campus Sustainability Ranking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Campus Leaderboard</h1>
          <p className="text-xs text-slate-400 mt-1">Recognizing top student contributors and departments driving campus cleanliness.</p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          {['Overall', 'This Month'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterTime(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTime === t ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Department:
        </span>
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              selectedDepartment === dept
                ? 'bg-slate-800 text-amber-400 border-amber-500'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center relative flex flex-col items-center justify-between order-2 md:order-1">
              <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-700 text-slate-200 font-extrabold text-sm flex items-center justify-center border-2 border-slate-500 shadow-lg">
                2
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-xl font-bold text-slate-200 mt-2 mb-3">
                {top3[1].avatar ? (
                  <img src={top3[1].avatar} alt={top3[1].name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  top3[1].name[0]
                )}
              </div>
              <h3 className="font-extrabold text-white text-base truncate max-w-[180px]">{top3[1].name}</h3>
              <p className="text-xs text-slate-400 mb-2">{top3[1].department}</p>
              <div className="text-xl font-extrabold text-amber-400">{top3[1].ecoPoints} PTS</div>
              <span className="text-[10px] text-slate-400 mt-1">{top3[1].level}</span>
            </div>
          )}

          {/* Rank 1 (Gold - Center & Highlighted) */}
          {top3[0] && (
            <div className="glass-panel p-8 rounded-3xl border-2 border-amber-500/50 text-center relative flex flex-col items-center justify-between order-1 md:order-2 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20 shadow-2xl scale-105">
              <div className="absolute -top-5 w-11 h-11 rounded-full bg-amber-500 text-slate-950 font-extrabold text-base flex items-center justify-center shadow-xl shadow-amber-500/30 border-2 border-amber-300">
                <Crown className="w-6 h-6 fill-slate-950 stroke-[2]" />
              </div>
              <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-2xl font-extrabold text-amber-300 mt-2 mb-3">
                {top3[0].avatar ? (
                  <img src={top3[0].avatar} alt={top3[0].name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  top3[0].name[0]
                )}
              </div>
              <h3 className="font-extrabold text-white text-lg truncate max-w-[200px]">{top3[0].name}</h3>
              <p className="text-xs text-amber-400 font-semibold mb-3">{top3[0].department}</p>
              <div className="text-3xl font-extrabold text-amber-400">{top3[0].ecoPoints} PTS</div>
              <span className="inline-block text-[11px] font-bold px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 mt-2">
                🏆 Campus Eco Champion
              </span>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center relative flex flex-col items-center justify-between order-3">
              <div className="absolute -top-4 w-9 h-9 rounded-full bg-amber-900 text-amber-300 font-extrabold text-sm flex items-center justify-center border-2 border-amber-700 shadow-lg">
                3
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-800 flex items-center justify-center text-xl font-bold text-slate-200 mt-2 mb-3">
                {top3[2].avatar ? (
                  <img src={top3[2].avatar} alt={top3[2].name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  top3[2].name[0]
                )}
              </div>
              <h3 className="font-extrabold text-white text-base truncate max-w-[180px]">{top3[2].name}</h3>
              <p className="text-xs text-slate-400 mb-2">{top3[2].department}</p>
              <div className="text-xl font-extrabold text-amber-400">{top3[2].ecoPoints} PTS</div>
              <span className="text-[10px] text-slate-400 mt-1">{top3[2].level}</span>
            </div>
          )}

        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 font-extrabold text-sm text-white">
          Full Rankings Index
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Rank</th>
                <th className="px-6 py-3.5">Contributor</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Eco Level</th>
                <th className="px-6 py-3.5 text-center">Reports Logged</th>
                <th className="px-6 py-3.5 text-center">Cleanups Done</th>
                <th className="px-6 py-3.5 text-right">Eco Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {leaderboard.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 font-extrabold text-sm">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                      u.rank === 1 ? 'bg-amber-500 text-slate-950 font-bold' :
                      u.rank === 2 ? 'bg-slate-700 text-slate-100 font-bold' :
                      u.rank === 3 ? 'bg-amber-900 text-amber-200 font-bold' : 'text-slate-400'
                    }`}>
                      #{u.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-eco-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {u.name[0]}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{u.department}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-eco-500/10 text-eco-400 border border-eco-500/20">
                      {u.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-300">{u.reportsSubmitted}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-300">{u.missionsCompleted}</td>
                  <td className="px-6 py-4 text-right font-extrabold text-amber-400 text-sm">{u.ecoPoints} PTS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
