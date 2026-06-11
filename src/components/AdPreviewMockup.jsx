import React, { useState, useEffect } from 'react';
import { 
  Globe, MoreHorizontal, Image as ImageIcon, ThumbsUp, 
  MessageSquare, Share2, Heart, MessageCircle, Send, 
  MoreVertical, Linkedin 
} from 'lucide-react';

const clientGenericFallback = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
];

export default function AdPreviewMockup({ 
  formData, 
  results, 
  selectedImageUrl 
}) {
  const { businessName, platform } = formData;
  
  // States to handle image loader callbacks
  const [fbImgSrc, setFbImgSrc] = useState('');
  const [fbLoaded, setFbLoaded] = useState(false);
  const [fbFailed, setFbFailed] = useState(false);

  const [igImgSrc, setIgImgSrc] = useState('');
  const [igLoaded, setIgLoaded] = useState(false);
  const [igFailed, setIgFailed] = useState(false);

  const [liImgSrc, setLiImgSrc] = useState('');
  const [liLoaded, setLiLoaded] = useState(false);
  const [liFailed, setLiFailed] = useState(false);

  useEffect(() => {
    const activeImg = selectedImageUrl || clientGenericFallback[0];
    
    setFbImgSrc(activeImg);
    setFbLoaded(false);
    setFbFailed(false);

    setIgImgSrc(activeImg);
    setIgLoaded(false);
    setIgFailed(false);

    setLiImgSrc(activeImg);
    setLiLoaded(false);
    setLiFailed(false);
  }, [selectedImageUrl]);

  const handleImgLoad = (type) => {
    if (type === 'fb') setFbLoaded(true);
    if (type === 'ig') setIgLoaded(true);
    if (type === 'li') setLiLoaded(true);
  };

  const handleImgError = (type, currentSrc) => {
    const fallback = clientGenericFallback[0];
    if (currentSrc !== fallback) {
      if (type === 'fb') setFbImgSrc(fallback);
      if (type === 'ig') setIgImgSrc(fallback);
      if (type === 'li') setLiImgSrc(fallback);
    } else {
      if (type === 'fb') setFbFailed(true);
      if (type === 'ig') setIgFailed(true);
      if (type === 'li') setLiFailed(true);
    }
  };

  const formatInstagramUsername = (name) => {
    if (!name) return 'bizleap_client';
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
  };

  const formatDomainName = (name) => {
    if (!name) return 'bizleap';
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const formattedInstaName = formatInstagramUsername(businessName);
  const formattedDomain = formatDomainName(businessName);

  return (
    <div className="card preview-card">
      <div className="card-header">
        <div className="card-title-group">
          <Globe className="header-icon" size={18} />
          <h2>Live Ad Mockup Preview</h2>
        </div>
        <span className="badge badge-accent" id="preview-platform-badge">
          {platform}
        </span>
      </div>

      <div className="preview-stage">
        
        {/* Facebook Mockup */}
        <div 
          className={`mockup-container fb-mockup ${platform !== 'Facebook' ? 'hidden' : ''}`} 
          id="mockup-facebook"
        >
          <div className="mock-header">
            <div className="mock-avatar">
              <svg viewBox="0 0 40 40" className="mini-logo">
                <rect width="40" height="40" rx="8" fill="#2563eb"/>
                <text x="12" y="26" fontFamily="'Outfit', sans-serif" fontWeight="bold" fontSize="20" fill="white">B</text>
              </svg>
            </div>
            <div className="mock-header-info">
              <span className="mock-profile-name" id="fb-mock-biz-name">
                {businessName || 'BizLeap Client'}
              </span>
              <span className="mock-meta">
                Sponsored · <Globe size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </span>
            </div>
            <button className="mock-more-btn"><MoreHorizontal size={16} /></button>
          </div>
          <div className="mock-body">
            <p className="mock-text" id="fb-mock-body">
              {results.body || 'This is where the ad body text will appear. Create copies via generator to see preview...'}
            </p>
            <div className="mock-media-box">
              <div className="mockup-image-wrapper">
                {fbImgSrc && !fbFailed && (
                  <img 
                    id="fb-mock-img" 
                    src={fbImgSrc}
                    className={`mockup-img ${fbLoaded ? '' : 'hidden'}`} 
                    onLoad={() => handleImgLoad('fb')}
                    onError={() => handleImgError('fb', fbImgSrc)}
                    alt="Ad Creative" 
                  />
                )}
                {(!fbImgSrc || fbFailed || !fbLoaded) && (
                  <div className="mock-img-placeholder" id="fb-mock-placeholder">
                    <ImageIcon size={32} />
                    <span id="fb-mock-img-text">Real Estate Campaign Visual</span>
                  </div>
                )}
              </div>
              <div className="mock-link-bar">
                <div className="link-meta">
                  <span className="link-url" id="fb-mock-url">WWW.{formattedDomain.toUpperCase()}.IN</span>
                  <span className="link-headline" id="fb-mock-headline">
                    {results.headline || 'Engaging headline goes here'}
                  </span>
                </div>
                <button className="fb-cta-btn" id="fb-mock-cta">
                  {results.cta || 'Learn More'}
                </button>
              </div>
            </div>
          </div>
          <div className="mock-footer">
            <div className="mock-actions">
              <span><ThumbsUp size={14} /> Like</span>
              <span><MessageSquare size={14} /> Comment</span>
              <span><Share2 size={14} /> Share</span>
            </div>
          </div>
        </div>

        {/* Instagram Mockup */}
        <div 
          className={`mockup-container ig-mockup ${platform !== 'Instagram' ? 'hidden' : ''}`} 
          id="mockup-instagram"
        >
          <div className="mock-header">
            <div className="mock-avatar-ig"></div>
            <span className="mock-profile-name-ig" id="ig-mock-biz-name">{formattedInstaName}</span>
            <button className="mock-more-btn"><MoreHorizontal size={16} /></button>
          </div>
          <div className="mock-media-box-ig">
            <div className="mockup-image-wrapper">
              {igImgSrc && !igFailed && (
                <img 
                  id="ig-mock-img" 
                  src={igImgSrc}
                  className={`mockup-img ${igLoaded ? '' : 'hidden'}`} 
                  onLoad={() => handleImgLoad('ig')}
                  onError={() => handleImgError('ig', igImgSrc)}
                  alt="Ad Creative" 
                />
              )}
              {(!igImgSrc || igFailed || !igLoaded) && (
                <div className="mock-img-placeholder" id="ig-mock-placeholder">
                  <Globe size={32} />
                  <span id="ig-mock-img-text">Instagram Campaign Media</span>
                </div>
              )}
            </div>
          </div>
          <div className="mock-cta-bar-ig">
            <span className="ig-headline" id="ig-mock-headline">
              {results.headline || 'Headline Highlight'}
            </span>
            <button className="ig-cta-btn" id="ig-mock-cta">
              {results.cta || 'Learn More'}
            </button>
          </div>
          <div className="mock-body-ig">
            <div className="ig-interactions">
              <Heart size={18} />
              <MessageCircle size={18} />
              <Send size={18} />
            </div>
            <p className="ig-caption">
              <strong id="ig-mock-caption-name">{formattedInstaName}</strong>{' '}
              <span id="ig-mock-body">
                {results.body || 'Copywriting text goes here... #marketing #nagpur'}
              </span>
            </p>
          </div>
        </div>

        {/* Google Ads Mockup */}
        <div 
          className={`mockup-container google-mockup ${platform !== 'Google Ads' ? 'hidden' : ''}`} 
          id="mockup-google"
        >
          <div className="google-header">
            <span className="sponsored-tag">Sponsored</span>
            <div className="google-url-row">
              <span className="google-url-display" id="google-mock-url">
                https://www.{formattedDomain}.in › campaign
              </span>
              <MoreVertical size={14} />
            </div>
            <h3 className="google-headline" id="google-mock-headline">
              {results.headline || 'Attractive Title | Nagpur Services | Best Choice'}
            </h3>
          </div>
          <div className="google-body">
            <p className="google-desc" id="google-mock-body">
              {results.body || 'Provide your audience with a direct solution. This description area displays high-performing taglines to boost click-through rates.'}
            </p>
            <div className="google-sitelinks">
              <span className="sitelink-item" id="google-mock-cta">
                ➔ Call Action: {results.cta || 'Learn More'}
              </span>
            </div>
          </div>
        </div>

        {/* LinkedIn Mockup */}
        <div 
          className={`mockup-container li-mockup ${platform !== 'LinkedIn' ? 'hidden' : ''}`} 
          id="mockup-linkedin"
        >
          <div className="mock-header">
            <div className="mock-avatar-li">BL</div>
            <div className="mock-header-info">
              <div className="mock-profile-row">
                <span className="mock-profile-name-li" id="li-mock-biz-name">
                  {businessName || 'BizLeap Client'}
                </span>
                <span className="degree-badge">· 1st</span>
              </div>
              <span className="mock-meta-li">Nagpur Business Professional</span>
              <span className="mock-time-li">
                Promoted · <Globe size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </span>
            </div>
          </div>
          <div className="mock-body-li">
            <p className="mock-text-li" id="li-mock-body">
              {results.body || 'Professionals look for high value and ROI. Your LinkedIn ad post copy is tailored for executive decision-makers.'}
            </p>
            <div className="mock-card-li">
              <div className="mockup-image-wrapper">
                {liImgSrc && !liFailed && (
                  <img 
                    id="li-mock-img" 
                    src={liImgSrc}
                    className={`mockup-img ${liLoaded ? '' : 'hidden'}`} 
                    onLoad={() => handleImgLoad('li')}
                    onError={() => handleImgError('li', liImgSrc)}
                    alt="Ad Creative" 
                  />
                )}
                {(!liImgSrc || liFailed || !liLoaded) && (
                  <div className="mock-img-placeholder-li" id="li-mock-placeholder">
                    <Linkedin size={32} />
                    <span id="li-mock-img-text">B2B Creative Asset</span>
                  </div>
                )}
              </div>
              <div className="mock-card-details-li">
                <span className="li-card-headline" id="li-mock-headline">
                  {results.headline || 'LinkedIn Headline'}
                </span>
                <span className="li-card-sub" id="li-mock-biz-domain">
                  {formattedDomain}.in
                </span>
              </div>
              <button className="li-cta-btn" id="li-mock-cta">
                {results.cta || 'Learn More'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
