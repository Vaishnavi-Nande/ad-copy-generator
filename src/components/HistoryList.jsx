import React from 'react';
import { 
  Search, Trash2, Tag, Target, Smile, Calendar, 
  Copy, Facebook, Instagram, History as HistoryIcon,
  Linkedin, Globe, FolderOpen, AlertTriangle, RefreshCw 
} from 'lucide-react';

export default function HistoryList({ 
  campaigns, 
  searchQuery, 
  setSearchQuery, 
  platformFilter, 
  setPlatformFilter, 
  toneFilter, 
  setToneFilter, 
  onDeleteHistoryAd, 
  onCopyText, 
  isBackendConnected, 
  onRetryConnection, 
  isLoading 
}) {
  const getPlatformIcon = (platform) => {
    if (platform === 'Facebook') return <Facebook className="icon-fb" size={14} />;
    if (platform === 'Instagram') return <Instagram className="icon-ig" size={14} />;
    if (platform === 'Google Ads') return <Search className="icon-google" size={14} />;
    if (platform === 'LinkedIn') return <Linkedin className="icon-li" size={14} />;
    return <Globe size={14} />;
  };

  const filtered = campaigns.filter(ad => {
    const matchesSearch = 
      (ad.business_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ad.product_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ad.campaign_goal || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ad.headline || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlatform = !platformFilter || ad.ad_platform === platformFilter;
    const matchesTone = !toneFilter || ad.ad_tone === toneFilter;

    return matchesSearch && matchesPlatform && matchesTone;
  });

  return (
    <div id="history-view" className="view-panel">
      <div className="view-header">
        <div className="card-title-group">
          <HistoryIcon className="header-icon" size={18} />
          <h2>Saved Campaign History</h2>
        </div>
        <p className="subtitle">Access and manage all previously generated ad copies and their mock marketing performance metrics.</p>
      </div>

      <div className="history-controls-card card">
        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input 
              type="text" 
              id="history-search" 
              placeholder="Search by business, product, or campaign goal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-dropdowns">
            <select 
              id="filter-platform" 
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
            >
              <option value="">All Platforms</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Google Ads">Google Ads</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
            <select 
              id="filter-tone" 
              value={toneFilter}
              onChange={(e) => setToneFilter(e.target.value)}
            >
              <option value="">All Tones</option>
              <option value="Professional">Professional</option>
              <option value="Friendly">Friendly</option>
              <option value="Promotional">Promotional</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <div className="quantum-spinner" style={{ margin: '0 auto 20px' }}></div>
          Loading saved campaigns...
        </div>
      ) : filtered.length === 0 ? (
        <div id="history-empty" className="card empty-state">
          <div className="empty-content">
            <div className="icon-glow">
              <FolderOpen size={32} />
            </div>
            <h3>No History Found</h3>
            <p>Try clearing your filters or generate some ad copies to save them to your database.</p>
          </div>
        </div>
      ) : (
        <div id="history-list" className="history-grid">
          {filtered.map(ad => {
            const dateStr = new Date(ad.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const imageUrl = ad.selected_image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80";

            return (
              <div key={ad.id} className="card history-card" data-id={ad.id}>
                <div className="history-card-header">
                  <div className="history-card-title">
                    <div className={`platform-indicator ${(ad.ad_platform || '').toLowerCase().replace(/\s/g, '')}`}>
                      {getPlatformIcon(ad.ad_platform)}
                      <span>{ad.ad_platform}</span>
                    </div>
                    <h3>{ad.business_name}</h3>
                  </div>
                  <div className="history-card-actions">
                    <button 
                      className="btn-delete-history" 
                      onClick={() => onDeleteHistoryAd(ad.id)}
                      title="Delete Record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="history-card-image">
                  <img src={imageUrl} alt={ad.business_name} />
                </div>

                <div className="history-card-meta">
                  <span className="meta-tag"><Tag size={12} /> {ad.industry_type}</span>
                  <span className="meta-tag"><Target size={12} /> {ad.campaign_goal}</span>
                  <span className="meta-tag"><Smile size={12} /> {ad.ad_tone}</span>
                  <span className="meta-tag date-tag"><Calendar size={12} /> {dateStr}</span>
                </div>

                <div className="history-card-product">
                  <strong>Product/Service:</strong> {ad.product_name}
                </div>

                <div className="history-card-content">
                  <div className="history-content-section">
                    <span className="section-label">Headline</span>
                    <p className="history-headline">{ad.headline}</p>
                  </div>
                  <div className="history-content-section">
                    <span className="section-label">Primary Body Copy</span>
                    <p 
                      className="history-body-text"
                      dangerouslySetInnerHTML={{ __html: (ad.body_text || '').replace(/\n/g, '<br>') }}
                    />
                  </div>
                  <div className="history-content-section">
                    <span className="section-label">CTA</span>
                    <p className="history-cta-text">{ad.cta}</p>
                  </div>
                </div>

                <div className="history-metrics-banner">
                  <div className="metric-mini">
                    <span className="metric-mini-label">Spend</span>
                    <span className="metric-mini-val">${ad.mock_spend}</span>
                  </div>
                  <div className="metric-mini">
                    <span className="metric-mini-label">Impressions</span>
                    <span className="metric-mini-val">{ad.mock_impressions.toLocaleString()}</span>
                  </div>
                  <div className="metric-mini">
                    <span className="metric-mini-label">Avg CTR</span>
                    <span className="metric-mini-val">{ad.mock_ctr}%</span>
                  </div>
                  <div className="metric-mini">
                    <span className="metric-mini-label">Clicks</span>
                    <span className="metric-mini-val">{ad.mock_clicks}</span>
                  </div>
                </div>

                <div className="history-card-footer">
                  <button 
                    className="btn btn-sm btn-outline btn-copy-history"
                    onClick={() => onCopyText(`--- GENERATED AD COPY ---\nHeadline: ${ad.headline}\n\nAd Text:\n${ad.body_text}\n\nCall-To-Action: ${ad.cta}\n--------------------------`)}
                  >
                    <Copy size={12} style={{ marginRight: '6px' }} /> Copy Ad Copy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
