import React from 'react';
import { Sparkles, Send as LucideSend, History as HistoryIcon, BarChart2, MapPin } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, onLocationClick }) {
  const menuItems = [
    { id: 'btn-nav-generator', label: 'Ad Copy Generator', Icon: Sparkles },
    { id: 'btn-nav-publisher', label: 'Publishing Hub', Icon: LucideSend },
    { id: 'btn-nav-history', label: 'Saved & History', Icon: HistoryIcon },
    { id: 'btn-nav-analytics', label: 'Campaign Stats', Icon: BarChart2 }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <svg className="brand-logo" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="30" height="40" rx="6" fill="url(#logoGrad)" />
          <path d="M22 20h8a5 5 0 0 1 0 10h-8v-10z M22 30h9a5 5 0 0 1 0 10h-9v-10z" fill="#ffffff" />
          <path d="M32 12 l15 -6 l0 15 z" fill="url(#accentGrad)" />
          <path d="M42 20 l12 -8 l2 12 z" fill="url(#accentGrad)" opacity="0.8" />
          <text x="55" y="34" fontFamily="'Outfit', sans-serif" fontWeight="800" fontSize="20" fill="#0f172a">BizLeap</text>
          <text x="55" y="48" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="10" fill="#f97316" letterSpacing="1.5">TECHNOLOGIES</text>
        </svg>
      </div>

      <nav className="nav-menu">
        {menuItems.map(({ id, label, Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`nav-item ${currentView === id ? 'active' : ''}`}
            id={id}
            onClick={(e) => {
              e.preventDefault();
              setCurrentView(id);
            }}
          >
            <Icon size={18} />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="location-badge" onClick={onLocationClick} style={{ cursor: 'pointer' }}>
          <MapPin size={14} />
          <span>Nagpur, India</span>
        </div>
      </div>
    </aside>
  );
}
