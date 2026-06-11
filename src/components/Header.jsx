import React from 'react';

export default function Header({ isBackendConnected, dbModeChecked }) {
  const getBadgeStyle = () => {
    if (!dbModeChecked) {
      return {
        textTransform: 'none',
        letterSpacing: 0,
        padding: '2px 8px',
        fontSize: '11px',
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        color: '#64748b',
        border: '1px solid rgba(100, 116, 139, 0.2)'
      };
    }
    
    if (isBackendConnected) {
      return {
        textTransform: 'none',
        letterSpacing: 0,
        padding: '2px 8px',
        fontSize: '11px',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      };
    } else {
      return {
        textTransform: 'none',
        letterSpacing: 0,
        padding: '2px 8px',
        fontSize: '11px',
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        color: '#64748b',
        border: '1px solid rgba(100, 116, 139, 0.2)'
      };
    }
  };

  const getBadgeText = () => {
    if (!dbModeChecked) return 'Checking...';
    return isBackendConnected ? 'Cloud Sync' : 'Browser Storage';
  };

  return (
    <header className="top-header">
      <div className="header-titles">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          AI Ad Copy Generator
          <span id="db-mode-badge" className="badge" style={getBadgeStyle()}>
            {getBadgeText()}
          </span>
        </h1>
        <p className="subtitle">Generate high-converting ad copies using advanced copywriting models</p>
      </div>
      <div className="user-profile">
        <div className="avatar">BL</div>
        <div className="profile-info">
          <span className="profile-name">BizLeap Agency</span>
          <span className="profile-role">Campaign Manager</span>
        </div>
      </div>
    </header>
  );
}
