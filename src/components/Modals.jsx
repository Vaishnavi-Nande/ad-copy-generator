import React from 'react';
import { AlertTriangle, Send as LucideSend, PlayCircle, Calendar, FileEdit } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div id="delete-confirm-modal" className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <AlertTriangle className="modal-warning-icon" size={24} />
          <h3>Delete Campaign Copy?</h3>
        </div>
        <p className="modal-body">
          Are you sure you want to permanently delete this generated ad copy from the history database? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-sm btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-sm btn-danger" onClick={onConfirm}>Delete Campaign</button>
        </div>
      </div>
    </div>
  );
}

export function PublishWizardModal({ 
  isOpen, 
  onCancel, 
  onConfirm, 
  selectedOption, 
  setSelectedOption, 
  scheduleTime, 
  setScheduleTime 
}) {
  if (!isOpen) return null;

  const options = [
    {
      id: 'now',
      title: 'Publish Instantly (Simulation)',
      desc: 'Runs a live pipeline queue to deploy ad copies directly.',
      Icon: PlayCircle
    },
    {
      id: 'schedule',
      title: 'Schedule for Later',
      desc: 'Set a date and time for the automated queue to launch.',
      Icon: Calendar
    },
    {
      id: 'draft',
      title: 'Save as Campaign Draft',
      desc: 'Store parameters and copies in drafts to edit later.',
      Icon: FileEdit
    }
  ];

  return (
    <div id="publish-wizard-modal" className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div className="modal-header" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LucideSend className="modal-icon accent-color" style={{ width: '24px', height: '24px', color: 'var(--accent-color)' }} />
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Publish or Schedule Campaign
          </h3>
        </div>
        <p className="modal-body" style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
          Choose whether to simulate live publishing instantly to active channels, schedule the launch for a later time, or save this configuration as a draft.
        </p>
        
        <div className="wizard-options" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {options.map(({ id, title, desc, Icon }) => {
            const isActive = selectedOption === id;
            return (
              <div 
                key={id}
                className={`wizard-option-card ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedOption(id)}
                style={{
                  display: 'flex', gap: '14px', padding: '14px',
                  border: isActive ? '2px solid var(--accent-color)' : '2px solid var(--border-color)',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                  background: isActive ? 'rgba(249, 115, 22, 0.03)' : ''
                }}
              >
                <Icon style={{ width: '20px', height: '20px', color: isActive ? 'var(--accent-color)' : 'var(--text-muted)', marginTop: '2px' }} />
                <div className="option-details" style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>{title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{desc}</p>
                  
                  {id === 'schedule' && isActive && (
                    <div className="schedule-input-container" style={{ marginTop: '10px' }}>
                      <input 
                        type="datetime-local" 
                        id="wizard-schedule-time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        style={{
                          width: '100%', padding: '8px', 
                          border: '1px solid var(--border-color)', borderRadius: '6px', 
                          background: 'var(--bg-main)', color: 'var(--text-main)', 
                          fontFamily: 'inherit', fontSize: '13px'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <button className="btn btn-sm btn-secondary" onClick={onCancel} style={{ padding: '8px 16px' }}>Cancel</button>
          <button className="btn btn-sm btn-primary" onClick={onConfirm} style={{ padding: '8px 16px' }}>Confirm Action</button>
        </div>
      </div>
    </div>
  );
}
