import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Trash2,
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  User,
  Check,
  X
} from 'lucide-react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  const [updateStatus, setUpdateStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const statuses = ['All', 'Pending', 'Assigned', 'Collected', 'Resolved', 'Rejected'];

  useEffect(() => {
    fetchReports();
  }, [selectedStatus]);

  const fetchReports = async () => {
    try {
      const params = {};
      if (selectedStatus !== 'All') params.status = selectedStatus;
      const res = await api.get('/reports', { params });
      setReports(res.data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedReport || !updateStatus) return;

    try {
      await api.put(`/reports/${selectedReport._id}/status`, {
        status: updateStatus,
        assignedTo,
        adminNotes
      });

      setMessage(`Report ${selectedReport.reportId} status updated to ${updateStatus}!`);
      setSelectedReport(null);
      await fetchReports();
    } catch (err) {
      console.error('Error updating report:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-2">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Waste Reports Management</h1>
          <p className="text-xs text-slate-400 mt-1">Review student waste submissions, assign collection teams, and mark resolved.</p>
        </div>

        {/* Status Pills Filter */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedStatus === st
                  ? 'bg-blue-500 text-slate-950 border-blue-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-eco-500/10 border border-eco-500/30 text-eco-400 text-xs font-bold text-center">
          {message}
        </div>
      )}

      {/* Reports Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Report ID</th>
                <th className="px-6 py-3.5">Category & Quantity</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Reporter</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">No reports found matching criteria.</td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-extrabold text-white">{r.reportId}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{r.wasteType}</div>
                      <div className="text-[10px] text-slate-400">Qty: {r.quantity}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 max-w-[200px] truncate">{r.location}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{r.userId?.name || 'Student'}</div>
                      <div className="text-[10px] text-slate-500">{r.userId?.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        r.status === 'Resolved' ? 'bg-eco-500/20 text-eco-400 border border-eco-500/30' :
                        r.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        r.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReport(r);
                          setUpdateStatus(r.status);
                          setAssignedTo(r.assignedTo || '');
                          setAdminNotes(r.adminNotes || '');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                      >
                        Inspect & Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect & Update Status Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-lg w-full relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Report {selectedReport.reportId} Details</h3>
              <button onClick={() => setSelectedReport(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedReport.imageUrl && (
              <img src={selectedReport.imageUrl} alt="Waste Report" className="w-full h-44 object-cover rounded-2xl border border-slate-800" />
            )}

            <div className="text-xs space-y-2 text-slate-300">
              <div><strong className="text-white">Category:</strong> {selectedReport.wasteType} ({selectedReport.quantity})</div>
              <div><strong className="text-white">Location:</strong> {selectedReport.location}</div>
              <div><strong className="text-white">Reporter:</strong> {selectedReport.userId?.name} ({selectedReport.userId?.email})</div>
              {selectedReport.description && <div><strong className="text-white">User Description:</strong> "{selectedReport.description}"</div>}
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Update Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Collected">Collected</option>
                  <option value="Resolved">Resolved (+25 User Points)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Assign Collection Team</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g. Groundskeeping Team 2"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Admin Notes</label>
                <textarea
                  rows="2"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes for grounds team or reporter..."
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs shadow-lg shadow-eco-500/20"
              >
                Save Status Update
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
