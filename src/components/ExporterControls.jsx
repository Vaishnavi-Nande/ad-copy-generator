import React from 'react';
import { Send as LucideSend, FileCode, Image as ImageIcon, FileText, Facebook, Instagram, Search, Linkedin } from 'lucide-react';

export default function ExporterControls({ 
  onExportJson, 
  onDownloadImage, 
  onDownloadPdf, 
  onOpenPublishWizard 
}) {
  return (
    <div className="card exporter-card" style={{ marginBottom: '24px' }}>
      <div className="card-header" style={{ marginBottom: '16px' }}>
        <div className="card-title-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LucideSend className="header-icon accent-color" style={{ width: '18px', height: '18px' }} />
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
            Export & Publish Campaign
          </h2>
        </div>
        <span className="badge">Local Channels</span>
      </div>
      
      <div className="exporter-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '16px' }}>
        {/* Actions */}
        <div className="export-actions-group">
          <span className="sub-label" style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Document & Asset Exports
          </span>
          <div className="export-btn-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn btn-sm btn-outline" 
              onClick={onExportJson}
              style={{ padding: '8px 12px', fontSize: '13px' }}
            >
              <FileCode style={{ width: '14px', height: '14px', marginRight: '6px' }} /> Export JSON
            </button>
            <button 
              type="button" 
              className="btn btn-sm btn-outline" 
              onClick={onDownloadImage}
              style={{ padding: '8px 12px', fontSize: '13px' }}
            >
              <ImageIcon style={{ width: '14px', height: '14px', marginRight: '6px' }} /> Download Image
            </button>
            <button 
              type="button" 
              className="btn btn-sm btn-outline" 
              onClick={onDownloadPdf}
              style={{ padding: '8px 12px', fontSize: '13px' }}
            >
              <FileText style={{ width: '14px', height: '14px', marginRight: '6px' }} /> Download PDF
            </button>
          </div>
        </div>
        
        {/* Channel Links */}
        <div className="publish-channels-group">
          <span className="sub-label" style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Official Ad Portals
          </span>
          <div className="channel-links-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <a 
              href="https://adsmanager.facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="channel-link-btn btn-fb"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                textDecoration: 'none', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
                transition: 'all 0.2s'
              }}
            >
              <Facebook style={{ width: '12px', height: '12px' }} /> FB Manager
            </a>
            <a 
              href="https://business.instagram.com/advertising" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="channel-link-btn btn-ig"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                textDecoration: 'none', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899',
                transition: 'all 0.2s'
              }}
            >
              <Instagram style={{ width: '12px', height: '12px' }} /> IG Ads
            </a>
            <a 
              href="https://ads.google.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="channel-link-btn btn-google"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                textDecoration: 'none', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308',
                transition: 'all 0.2s'
              }}
            >
              <Search style={{ width: '12px', height: '12px' }} /> Google Ads
            </a>
            <a 
              href="https://www.linkedin.com/campaignmanager" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="channel-link-btn btn-li"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                textDecoration: 'none', background: 'rgba(10, 102, 194, 0.1)', color: '#0a66c2',
                transition: 'all 0.2s'
              }}
            >
              <Linkedin style={{ width: '12px', height: '12px' }} /> LI Campaign
            </a>
          </div>
        </div>
      </div>
      
      <div className="publisher-cta-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={onOpenPublishWizard}
          style={{ width: 'auto', padding: '10px 20px' }}
        >
          <LucideSend size={14} style={{ marginRight: '6px' }} /> Publish / Schedule Campaign
        </button>
      </div>
    </div>
  );
}
