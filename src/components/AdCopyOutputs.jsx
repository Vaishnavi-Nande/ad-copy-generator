import React from 'react';
import { FileText, Copy } from 'lucide-react';

export default function AdCopyOutputs({ 
  headline, 
  body, 
  cta, 
  onCopyField, 
  onCopyAll 
}) {
  return (
    <div className="card output-card">
      <div className="card-header">
        <div className="card-title-group">
          <FileText className="header-icon accent-color" size={18} />
          <h2>Generated Copy Outputs</h2>
        </div>
        <button 
          className="btn btn-sm btn-outline copy-all-btn" 
          id="btn-copy-all"
          onClick={onCopyAll}
        >
          <Copy size={14} style={{ marginRight: '6px' }} /> Copy All
        </button>
      </div>

      <div className="outputs-stack">
        {/* Headline Output */}
        <div className="output-block">
          <div className="output-block-header">
            <span className="label">Headline / Hook</span>
            <div className="output-actions">
              <span className="char-count" id="headline-count">
                {headline.length} ch
              </span>
              <button 
                className="copy-field-btn" 
                onClick={() => onCopyField(headline, 'Headline')}
                title="Copy Headline"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          <div className="textarea-container">
            <textarea 
              id="headline-text" 
              rows={2} 
              value={headline} 
              readOnly 
            />
          </div>
        </div>

        {/* Primary Ad Copy Output */}
        <div className="output-block">
          <div className="output-block-header">
            <span className="label">Primary Body Copy</span>
            <div className="output-actions">
              <span className="char-count" id="body-count">
                {body.length} ch
              </span>
              <button 
                className="copy-field-btn" 
                onClick={() => onCopyField(body, 'Body Copy')}
                title="Copy Body Copy"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          <div className="textarea-container">
            <textarea 
              id="body-text" 
              rows={6} 
              value={body} 
              readOnly 
            />
          </div>
        </div>

        {/* CTA Output */}
        <div className="output-block">
          <div className="output-block-header">
            <span className="label">Call-to-Action</span>
            <div className="output-actions">
              <span className="char-count" id="cta-count">
                {cta.length} ch
              </span>
              <button 
                className="copy-field-btn" 
                onClick={() => onCopyField(cta, 'CTA')}
                title="Copy CTA"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          <div className="textarea-container">
            <textarea 
              id="cta-text" 
              rows={1} 
              value={cta} 
              readOnly 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
