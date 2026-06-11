import React from 'react';
import { DollarSign, Percent, Eye, Layers, TrendingUp, Sparkles, List } from 'lucide-react';

export default function StatsDashboard({ statsData, isLoading }) {
  const { totals = { spend: 0, ctr: 0, impressions: 0, ads_count: 0 }, campaigns = [] } = statsData || {};

  const getPlatformClass = (platform) => {
    if (!platform) return '';
    return platform.toLowerCase().replace(/\s/g, '');
  };

  const getCtrPercent = () => {
    if (!totals || !totals.ctr) return 0;
    return Math.min((totals.ctr / 5) * 100, 100);
  };

  return (
    <div id="stats-view" className="view-panel">
      <div className="view-header">
        <div className="card-title-group">
          <List className="header-icon" size={18} />
          <h2>Campaign Stats Dashboard</h2>
        </div>
        <p className="subtitle">Analyze the performance metrics and spend distribution across all generated campaigns.</p>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="kpi-grid">
        {/* Card 1: Total Spend */}
        <div className="kpi-card card border-spend">
          <div className="kpi-card-content">
            <div className="kpi-info">
              <span className="kpi-title">Total Ad Budget Spent</span>
              <h3 className="kpi-value" id="kpi-spend">
                ${(totals.spend || 0).toLocaleString()}
              </h3>
              <span className="kpi-subtext" id="kpi-spend-sub">
                <TrendingUp size={12} style={{ display: 'inline', marginRight: '4px' }} /> Live Ad Simulation
              </span>
            </div>
            <div className="kpi-icon icon-spend">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="kpi-progress">
            <div className="kpi-progress-bar bg-spend" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Card 2: Average CTR */}
        <div className="kpi-card card border-ctr">
          <div className="kpi-card-content">
            <div className="kpi-info">
              <span className="kpi-title">Average Click-Through Rate</span>
              <h3 className="kpi-value" id="kpi-ctr">
                {totals.ctr}%
              </h3>
              <span className="kpi-subtext" id="kpi-ctr-sub">
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} /> Copywriting Efficiency
              </span>
            </div>
            <div className="kpi-icon icon-ctr">
              <Percent size={20} />
            </div>
          </div>
          <div className="kpi-progress">
            <div className="kpi-progress-bar bg-ctr" style={{ width: `${getCtrPercent()}%` }}></div>
          </div>
        </div>

        {/* Card 3: Total Impressions */}
        <div className="kpi-card card border-impressions">
          <div className="kpi-card-content">
            <div className="kpi-info">
              <span className="kpi-title">Total Ad Impressions</span>
              <h3 className="kpi-value" id="kpi-impressions">
                {(totals.impressions || 0).toLocaleString()}
              </h3>
              <span className="kpi-subtext" id="kpi-impressions-sub">
                <Eye size={12} style={{ display: 'inline', marginRight: '4px' }} /> Audience Footprint
              </span>
            </div>
            <div className="kpi-icon icon-impressions">
              <Eye size={20} />
            </div>
          </div>
          <div className="kpi-progress">
            <div className="kpi-progress-bar bg-impressions" style={{ width: '90%' }}></div>
          </div>
        </div>

        {/* Card 4: Total Ads Generated */}
        <div className="kpi-card card border-ads">
          <div className="kpi-card-content">
            <div className="kpi-info">
              <span className="kpi-title">Total Ads Generated</span>
              <h3 className="kpi-value" id="kpi-ads">
                {totals.ads_count}
              </h3>
              <span className="kpi-subtext" id="kpi-ads-sub">
                <Layers size={12} style={{ display: 'inline', marginRight: '4px' }} /> Saved to database
              </span>
            </div>
            <div className="kpi-icon icon-ads">
              <Layers size={20} />
            </div>
          </div>
          <div className="kpi-progress">
            <div className="kpi-progress-bar bg-ads" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Comparative Campaigns Table */}
      <div className="card table-card">
        <div className="table-card-header">
          <div className="card-title-group">
            <List className="header-icon accent-color" size={18} />
            <h2>Campaign Performance Comparison</h2>
          </div>
          <span className="badge badge-accent">Live Aggregation</span>
        </div>
        
        <div className="table-responsive">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Industry</th>
                <th>Platform</th>
                <th>Goal</th>
                <th className="text-right">Ads Generated</th>
                <th className="text-right">Budget Spent</th>
                <th className="text-right">Impressions</th>
                <th className="text-right">Avg CTR</th>
              </tr>
            </thead>
            <tbody id="stats-table-body">
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                    <div className="quantum-spinner" style={{ margin: '0 auto' }}></div>
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
                    No campaigns found. Generate copies to view statistics.
                  </td>
                </tr>
              ) : (
                campaigns.map((c, idx) => (
                  <tr key={idx}>
                    <td><strong>{c.name}</strong></td>
                    <td>
                      <span className="badge badge-outline" style={{ background: 'var(--bg-main)', color: 'var(--text-main)', fontWeight: 500, fontSize: '11px', textTransform: 'none', letterSpacing: 0 }}>
                        {c.industry}
                      </span>
                    </td>
                    <td>
                      <span className={`platform-indicator ${getPlatformClass(c.platform)}`}>
                        {c.platform}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-accent" style={{ fontWeight: 500, fontSize: '11px' }}>
                        {c.goal}
                      </span>
                    </td>
                    <td className="text-right">{c.ads_count}</td>
                    <td className="text-right"><strong>${(c.spend || 0).toLocaleString()}</strong></td>
                    <td className="text-right">{(c.impressions || 0).toLocaleString()}</td>
                    <td className="text-right" style={{ color: 'var(--primary)', fontWeight: 600 }}>{c.ctr}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
