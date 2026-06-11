import React from 'react';
import { 
  Sliders, Building2, Coffee, TrendingUp, Briefcase, 
  Tag, ShoppingBag, Users, Target, MousePointer, 
  Facebook, Instagram, Search, Linkedin, Sparkles 
} from 'lucide-react';

export default function GeneratorForm({ 
  formData, 
  onChange, 
  onPreset, 
  onSubmit 
}) {
  const industries = [
    'Real Estate',
    'Food & Beverage',
    'Digital Marketing / IT',
    'Education & Coaching',
    'Healthcare & Wellness',
    'Retail & E-commerce'
  ];

  const goals = [
    'Lead Generation',
    'Brand Awareness',
    'Website Traffic',
    'Sales / Conversion'
  ];

  const ctaOptions = [
    'Book Site Visit',
    'Get Free Quote',
    'Learn More',
    'Claim Offer',
    'Sign Up Now',
    'Order Now'
  ];

  const platforms = [
    { id: 'Facebook', Icon: Facebook, className: 'icon-fb' },
    { id: 'Instagram', Icon: Instagram, className: 'icon-ig' },
    { id: 'Google Ads', Icon: Search, className: 'icon-google' },
    { id: 'LinkedIn', Icon: Linkedin, className: 'icon-li' }
  ];

  const tones = ['Professional', 'Friendly', 'Promotional', 'Luxury'];

  return (
    <section className="card form-card">
      <div className="card-header">
        <div className="card-title-group">
          <Sliders className="header-icon" size={18} />
          <h2>Campaign Parameters</h2>
        </div>
        <span className="badge">V2.0 Active</span>
      </div>

      {/* Presets Section */}
      <div className="presets-section">
        <span className="section-label">Quick Test Presets (Nagpur Businesses):</span>
        <div className="preset-buttons">
          <button 
            type="button" 
            className="preset-btn" 
            onClick={() => onPreset('realestate')}
          >
            <Building2 size={14} style={{ marginRight: '6px' }} /> Nagpur Real Estate
          </button>
          <button 
            type="button" 
            className="preset-btn" 
            onClick={() => onPreset('cafe')}
          >
            <Coffee size={14} style={{ marginRight: '6px' }} /> Orange Bistro Cafe
          </button>
          <button 
            type="button" 
            className="preset-btn" 
            onClick={() => onPreset('seo')}
          >
            <TrendingUp size={14} style={{ marginRight: '6px' }} /> BizLeap SEO Service
          </button>
        </div>
      </div>

      <form className="generator-form" onSubmit={onSubmit}>
        <div className="form-grid">
          
          {/* Business Name */}
          <div className="form-group">
            <label htmlFor="business-name">Business Name</label>
            <div className="input-wrapper">
              <Briefcase size={16} />
              <input 
                type="text" 
                id="business-name" 
                placeholder="e.g., Apex Heights" 
                value={formData.businessName}
                onChange={(e) => onChange('businessName', e.target.value)}
                required 
              />
            </div>
          </div>

          {/* Industry Type */}
          <div className="form-group">
            <label htmlFor="industry-type">Industry Type</label>
            <div className="input-wrapper">
              <Tag size={16} />
              <select 
                id="industry-type" 
                value={formData.industry} 
                onChange={(e) => onChange('industry', e.target.value)}
                required
              >
                <option value="" disabled>Select industry...</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Product/Service Name */}
          <div className="form-group col-span-2">
            <label htmlFor="product-name">Product / Service Name</label>
            <div className="input-wrapper">
              <ShoppingBag size={16} />
              <input 
                type="text" 
                id="product-name" 
                placeholder="e.g., Premium 2 & 3 BHK Apartments" 
                value={formData.productName}
                onChange={(e) => onChange('productName', e.target.value)}
                required 
              />
            </div>
          </div>

          {/* Target Audience */}
          <div className="form-group col-span-2">
            <label htmlFor="target-audience">Target Audience</label>
            <div className="input-wrapper">
              <Users className="textarea-icon" size={16} />
              <textarea 
                id="target-audience" 
                rows={2} 
                placeholder="e.g., Families looking for homes in Nagpur, Real Estate Investors" 
                value={formData.targetAudience}
                onChange={(e) => onChange('targetAudience', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campaign Goal */}
          <div className="form-group">
            <label htmlFor="campaign-goal">Campaign Goal</label>
            <div className="input-wrapper">
              <Target size={16} />
              <select 
                id="campaign-goal" 
                value={formData.campaignGoal}
                onChange={(e) => onChange('campaignGoal', e.target.value)}
                required
              >
                <option value="" disabled>Select goal...</option>
                {goals.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Call-to-Action Preference */}
          <div className="form-group">
            <label htmlFor="cta-preference">CTA Preference</label>
            <div className="input-wrapper">
              <MousePointer size={16} />
              <select 
                id="cta-preference" 
                value={formData.cta}
                onChange={(e) => onChange('cta', e.target.value)}
                required
              >
                <option value="" disabled>Select CTA...</option>
                {ctaOptions.map(ctaOpt => (
                  <option key={ctaOpt} value={ctaOpt}>{ctaOpt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ad Platform Selection */}
          <div className="form-group col-span-2">
            <label>Select Ad Platform</label>
            <div className="platform-selector">
              {platforms.map(({ id, Icon, className }) => (
                <React.Fragment key={id}>
                  <input 
                    type="radio" 
                    name="ad-platform" 
                    id={`platform-${id.toLowerCase().replace(/\s/g, '')}`} 
                    value={id}
                    checked={formData.platform === id}
                    onChange={(e) => onChange('platform', e.target.value)}
                  />
                  <label htmlFor={`platform-${id.toLowerCase().replace(/\s/g, '')}`} className="platform-pill">
                    <Icon className={className} size={16} />
                    <span>{id}</span>
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Tone of Ad Selection */}
          <div className="form-group col-span-2">
            <label>Tone of Ad</label>
            <div className="tone-selector">
              {tones.map(tone => (
                <React.Fragment key={tone}>
                  <input 
                    type="radio" 
                    name="ad-tone" 
                    id={`tone-${tone.toLowerCase()}`} 
                    value={tone}
                    checked={formData.tone === tone}
                    onChange={(e) => onChange('tone', e.target.value)}
                  />
                  <label htmlFor={`tone-${tone.toLowerCase()}`} className="tone-pill">{tone}</label>
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" id="btn-generate">
          <Sparkles size={16} style={{ marginRight: '6px' }} />
          <span>Generate Ad Copy</span>
        </button>
      </form>
    </section>
  );
}
