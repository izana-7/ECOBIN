import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Leaf,
  Bell,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  Award,
  Sparkles,
  CheckCheck,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-eco-600 to-eco-400 flex items-center justify-center shadow-lg shadow-eco-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-eco-400 bg-clip-text text-transparent">
                EcoBin
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-eco-500/10 text-eco-400 border border-eco-500/20">
                Smart Campus
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {user ? (
            <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard' ? 'bg-eco-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/scan"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/scan' ? 'bg-eco-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Scanner
              </Link>
              <Link
                to="/report"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/report' ? 'bg-eco-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Report Waste
              </Link>
              <Link
                to="/bins"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/bins' ? 'bg-eco-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Bin Locator
              </Link>
              <Link
                to="/clean-earn"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/clean-earn' ? 'bg-eco-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Clean & Earn
              </Link>
              <Link
                to="/leaderboard"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/leaderboard' ? 'bg-eco-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Leaderboard
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    location.pathname.startsWith('/admin') ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-400 hover:bg-amber-500/10'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link to="/#how-it-works" className="hover:text-eco-400 transition-colors">How it Works</Link>
              <Link to="/#impact" className="hover:text-eco-400 transition-colors">Campus Impact</Link>
            </div>
          )}

          {/* User Right Menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Eco Points Badge */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-bold">
                  <Award className="w-4 h-4 text-eco-400" />
                  <span>{user.ecoPoints || 0} PTS</span>
                </div>

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                    className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-eco-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                        <h4 className="font-bold text-sm text-white flex items-center gap-2">
                          <Bell className="w-4 h-4 text-eco-400" /> Notifications
                        </h4>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-eco-400 hover:underline flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-6">No notifications yet</p>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => markAsRead(n._id)}
                              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                !n.read ? 'bg-slate-800/90 border-eco-500/30' : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                              }`}
                            >
                              <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
                                <span>{n.title}</span>
                                <span className="text-[10px] text-slate-500">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-slate-400 leading-relaxed">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar Menu */}
                <div className="relative">
                  <button
                    onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                    className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-eco-500/20 text-eco-400 flex items-center justify-center font-bold text-xs">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline-block text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-slate-800 mb-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-eco-500/20 text-eco-400">
                          {user.level || 'Eco Starter'}
                        </span>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-eco-400" />
                        My Profile
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          Admin Portal
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors mt-1 border-t border-slate-800"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold bg-eco-500 hover:bg-eco-400 text-slate-950 px-4 py-2 rounded-xl transition-all shadow-lg shadow-eco-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}
