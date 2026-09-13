import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Sparkles, Trash2, MapPin, Award, ShieldAlert } from 'lucide-react';

export default function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const links = [
    { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { path: '/scan', label: 'AI Scan', icon: Sparkles },
    { path: '/report', label: 'Report', icon: Trash2 },
    { path: '/bins', label: 'Bins', icon: MapPin },
    { path: '/clean-earn', label: 'Clean', icon: Award },
  ];

  if (user.role === 'admin') {
    links.push({ path: '/admin', label: 'Admin', icon: ShieldAlert });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-slate-800 bg-slate-950/90 backdrop-blur-xl px-2 py-2">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-eco-400 bg-eco-500/10 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px]">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
