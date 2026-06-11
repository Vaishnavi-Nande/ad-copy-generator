import React from 'react';
import { Cpu, Calendar, FileEdit, Inbox, CalendarDays, Edit3, Trash2, Edit, Clock, Send as LucideSend, Facebook, Instagram, Search, Linkedin, Globe } from 'lucide-react';

export default function PublisherColumns({ 
  campaigns, 
  publishingProgress, 
  onResumeDraft, 
  onDeleteCampaign, 
  onCancelSchedule, 
  onLaunchNow 
}) {
  const queueItems = campaigns.filter(ad => ad.status === 'publishing' || ad.status === 'published');
  const scheduledItems = campaigns.filter(ad => ad.status === 'scheduled');
  const draftsItems = campaigns.filter(ad => ad.status === 'draft');

  const getPlatformIcon = (platform) => {
    if (platform === 'Facebook') return <Facebook style={{ width: '11px', height: '11px' }} />;
    if (platform === 'Instagram') return <Instagram style={{ width: '11px', height: '11px' }} />;
    if (platform === 'Google Ads') return <Search style={{ width: '11px', height: '11px' }} />;
    if (platform === 'LinkedIn') return <Linkedin style={{ width: '11px', height: '11px' }} />;
    return <Globe style={{ width: '11px', height: '11px' }} />;
  };

  const getQueueStatusText = (ad) => {
    if (ad.status === 'published') return 'Campaign deployed';
    
    const pct = publishingProgress[ad.id] || 0;
    if (pct <= 25) return 'Verifying campaign policy...';
    if (pct <= 50) return 'Optimizing bid strategies...';
    if (pct <= 75) return 'Uploading creative media assets...';
    return 'Deploying campaign to channels...';
  };

  return (
    <div className="publishing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'start' }}>
      
      {/* Column 1: Live Publish Queue Simulation */}
      <section className="card publishing-column" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '600px' }}>
        <div className="card-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="card-title-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu className="header-icon accent-color" style={{ width: '18px', height: '18px' }} />
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Active Publish Queue
            </h3>
          </div>
          <span className="badge badge-accent" style={{ padding: '2px 8px', fontSize: '11px' }}>Simulator Live</span>
        </div>
        
        <div className="card-body-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <p className="section-desc" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
            Real-time pipeline queue showing asset verification, bidding setup, and channel deployment.
          </p>
          
          <div id="queue-list" className="queue-stack" style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {queueItems.length === 0 ? (
              <div className="empty-column-state" id="queue-empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', flex: 1, color: 'var(--text-muted)', textAlign: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                <Inbox style={{ width: '32px', height: '32px', opacity: 0.5 }} />
                <p style={{ fontSize: '13px', margin: 0 }}>No active publish operations in progress</p>
              </div>
            ) : (
              queueItems.map(ad => {
                const isPublishing = ad.status === 'publishing';
                const progressPct = isPublishing ? `${publishingProgress[ad.id] || 0}%` : '100%';
                
                return (
                  <div key={ad.id} className="campaign-hub-card" id={`hub-card-${ad.id}`}>
                    <div className="hub-card-header">
                      <span className="hub-card-biz">{ad.business_name}</span>
                      <span 
                        className="badge" 
                        style={{ 
                          background: isPublishing ? 'rgba(249, 115, 22, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                          color: isPublishing ? '#f97316' : '#10b981', 
                          border: 'none' 
                        }}
                      >
                        {isPublishing ? 'Publishing' : 'Active'}
                      </span>
                    </div>
                    <div className="hub-card-prod">{ad.product_name}</div>
                    <div className={`hub-card-platform badge-platform-${(ad.ad_platform || '').toLowerCase().replace(/\s/g, '')}`}>
                      {getPlatformIcon(ad.ad_platform)}
                      <span>{ad.ad_platform}</span>
                    </div>
                    
                    <div className="queue-progress-container">
                      <div className="queue-progress-label-row">
                        <span className="queue-progress-status">{getQueueStatusText(ad)}</span>
                        <span className="queue-progress-pct">{progressPct}</span>
                      </div>
                      <div className="queue-progress-bar">
                        <div className="queue-progress-fill" style={{ width: progressPct }}></div>
                      </div>
                    </div>
                    
                    <div className="hub-card-actions">
                      <button 
                        className="btn btn-sm btn-outline btn-hub-delete" 
                        style={{ padding: '4px 8px', fontSize: '11px' }} 
                        onClick={() => onDeleteCampaign(ad.id)}
                      >
                        <Trash2 style={{ width: '12px', height: '12px', marginRight: '4px' }} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Column 2: Scheduled Campaigns */}
      <section className="card publishing-column" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '600px' }}>
        <div className="card-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="card-title-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar className="header-icon" style={{ width: '18px', height: '18px', color: 'var(--accent-color)' }} />
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Scheduled Campaigns
            </h3>
          </div>
          <span className="badge" style={{ padding: '2px 8px', fontSize: '11px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            {scheduledItems.length}
          </span>
        </div>
        
        <div className="card-body-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <p className="section-desc" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
            Campaigns configured to launch automatically at a future datetime.
          </p>
          
          <div id="scheduled-list" className="schedule-stack" style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {scheduledItems.length === 0 ? (
              <div className="empty-column-state" id="scheduled-empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', flex: 1, color: 'var(--text-muted)', textAlign: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                <CalendarDays style={{ width: '32px', height: '32px', opacity: 0.5 }} />
                <p style={{ fontSize: '13px', margin: 0 }}>No campaigns scheduled</p>
              </div>
            ) : (
              scheduledItems.map(ad => {
                const dateStr = new Date(ad.scheduled_time).toLocaleString();
                
                return (
                  <div key={ad.id} className="campaign-hub-card" id={`hub-card-${ad.id}`}>
                    <div className="hub-card-header">
                      <span className="hub-card-biz">{ad.business_name}</span>
                      <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none' }}>
                        Scheduled
                      </span>
                    </div>
                    <div className="hub-card-prod">{ad.product_name}</div>
                    <div className={`hub-card-platform badge-platform-${ad.ad_platform.toLowerCase().replace(/\s/g, '')}`}>
                      {getPlatformIcon(ad.ad_platform)}
                      <span>{ad.ad_platform}</span>
                    </div>
                    
                    <div className="hub-card-time" style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '8px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock style={{ width: '12px', height: '12px' }} /> Launch: {dateStr}
                    </div>
                    
                    <div className="hub-card-actions">
                      <button 
                        className="btn btn-sm btn-outline btn-hub-cancel-schedule" 
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => onCancelSchedule(ad.id)}
                      >
                        Cancel Schedule
                      </button>
                      <button 
                        className="btn btn-sm btn-primary btn-hub-publish-now" 
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        onClick={() => onLaunchNow(ad.id)}
                      >
                        <LucideSend style={{ width: '12px', height: '12px', marginRight: '4px' }} /> Launch Now
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Column 3: Campaign Drafts */}
      <section className="card publishing-column" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '600px' }}>
        <div className="card-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="card-title-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileEdit className="header-icon" style={{ width: '18px', height: '18px', color: '#10b981' }} />
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Campaign Drafts
            </h3>
          </div>
          <span className="badge" style={{ padding: '2px 8px', fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            {draftsItems.length}
          </span>
        </div>
        
        <div className="card-body-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <p className="section-desc" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
            Saved copies stored in draft state to configure, edit, or launch later.
          </p>
          
          <div id="drafts-list" className="drafts-stack" style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {draftsItems.length === 0 ? (
              <div className="empty-column-state" id="drafts-empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', flex: 1, color: 'var(--text-muted)', textAlign: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                <Edit3 style={{ width: '32px', height: '32px', opacity: 0.5 }} />
                <p style={{ fontSize: '13px', margin: 0 }}>No campaign drafts stored</p>
              </div>
            ) : (
              draftsItems.map(ad => (
                <div key={ad.id} className="campaign-hub-card" id={`hub-card-${ad.id}`}>
                  <div className="hub-card-header">
                    <span className="hub-card-biz">{ad.business_name}</span>
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'none' }}>
                      Draft
                    </span>
                  </div>
                  <div className="hub-card-prod">{ad.product_name}</div>
                  <div className={`hub-card-platform badge-platform-${(ad.ad_platform || '').toLowerCase().replace(/\s/g, '')}`}>
                    {getPlatformIcon(ad.ad_platform)}
                    <span>{ad.ad_platform}</span>
                  </div>
                  
                  <div className="hub-card-actions">
                    <button 
                      className="btn btn-sm btn-outline btn-hub-delete" 
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      onClick={() => onDeleteCampaign(ad.id)}
                    >
                      <Trash2 style={{ width: '12px', height: '12px', marginRight: '4px' }} /> Delete
                    </button>
                    <button 
                      className="btn btn-sm btn-primary btn-hub-resume" 
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                      onClick={() => onResumeDraft(ad)}
                    >
                      <Edit style={{ width: '12px', height: '12px', marginRight: '4px' }} /> Resume Draft
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      
    </div>
  );
}
