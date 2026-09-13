import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  Award,
  Trash2,
  Building
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const departments = [
    'All',
    'Computer Science',
    'Mechanical Engineering',
    'Biotechnology',
    'Electrical Engineering',
    'Environmental Services'
  ];

  useEffect(() => {
    fetchUsers();
  }, [search, selectedDepartment]);

  const fetchUsers = async () => {
    try {
      const params = { search, department: selectedDepartment };
      const res = await api.get('/admin/users', { params });
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setMessage(`User role updated to ${newRole}!`);
      fetchUsers();
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Admin User Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Campus User Registry</h1>
          <p className="text-xs text-slate-400 mt-1">Manage registered students, view activity stats, and update admin permissions.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-eco-500"
          />
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-eco-500/10 border border-eco-500/30 text-eco-400 text-xs font-bold text-center">
          {message}
        </div>
      )}

      {/* Users Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Eco Level</th>
                <th className="px-6 py-3.5 text-center">Reports</th>
                <th className="px-6 py-3.5 text-center">Cleanups</th>
                <th className="px-6 py-3.5 text-right">Points</th>
                <th className="px-6 py-3.5 text-right">Role Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-extrabold text-white">{u.name}</div>
                    <div className="text-[10px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{u.department}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-eco-500/10 text-eco-400 border border-eco-500/20">
                      {u.level || 'Eco Starter'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-300">{u.reportsCount || 0}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-300">{u.missionsCount || 0}</td>
                  <td className="px-6 py-4 text-right font-extrabold text-amber-400">{u.ecoPoints || 0} PTS</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleRole(u._id, u.role)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        u.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {u.role === 'admin' ? 'Admin (Demote)' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
