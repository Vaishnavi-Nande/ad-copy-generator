import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function ImageSelector({ 
  imageOptions, 
  selectedImageUrl, 
  onSelectImage, 
  imageSource, 
  isImageLoading 
}) {
  const getBadgeStyle = () => {
    if (imageSource.toLowerCase().includes('searching')) {
      return {
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        color: '#f97316'
      };
    }
    if (imageSource.toLowerCase().includes('found') || imageSource.toLowerCase().includes('asset') || imageSource.toLowerCase().includes('real')) {
      return {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981'
      };
    }
    return {};
  };

  return (
    <div className="card image-selector-card">
      <div className="card-header">
        <div className="card-title-group">
          <ImageIcon className="header-icon accent-color" size={18} />
          <h2>Select Ad Creative Image</h2>
        </div>
        <span className="badge" id="image-source-badge" style={getBadgeStyle()}>
          {imageSource || "No Image Loaded"}
        </span>
      </div>
      
      <div className="card-body-selector">
        <p className="selector-sub" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Select a storefront, location, or brand photo to display in the live mockup previews below:
        </p>
        
        {/* Loader skeleton */}
        {isImageLoading && (
          <div className="image-loader-skeleton" id="image-loader-skeleton" style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div 
                key={i}
                className="skeleton-thumb" 
                style={{
                  width: '70px', height: '70px', 
                  backgroundColor: 'var(--bg-main)', 
                  borderRadius: '8px', 
                  animation: 'pulse 1.5s infinite ease-in-out'
                }}
              />
            ))}
          </div>
        )}
        
        {/* Thumbnail grid */}
        {!isImageLoading && (
          <div className="image-options-grid" id="image-options-grid">
            {imageOptions.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No images found.</p>
            ) : (
              imageOptions.map((imgUrl, index) => (
                <button
                  key={index}
                  type="button"
                  className={`thumb-option ${selectedImageUrl === imgUrl ? 'active' : ''}`}
                  onClick={() => onSelectImage(imgUrl, index)}
                >
                  <img src={imgUrl} alt={`Option ${index + 1}`} />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
