import React, { useState } from 'react';
import { PublicHeader } from '../components/navigation/PublicHeader';
import { PublicFooter } from '../components/navigation/PublicFooter';

export function ContactSupport({ onNavigate, user }) {
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="app-root">
      <PublicHeader onNavigate={onNavigate} user={user} />

      <section className="shell section" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="pv-badge pv-badge--emerald" style={{ marginBottom: 8 }}>
              <span className="pv-indicator-dot pv-indicator-dot--active" /> SUPPORT & PARTNERSHIPS
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '4px 0 8px', color: '#0f172a' }}>
              Contact System Support & Research Labs
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.0625rem', margin: 0 }}>
              Have questions about container verification, university partnerships, or faculty accounts? Reach out to our team.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {/* Form */}
            <div style={{ background: '#ffffff', padding: 28, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                  <h3 style={{ margin: '0 0 6px', color: '#059669', fontSize: '1.25rem' }}>Message Received!</h3>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '0.9375rem' }}>
                    Thank you for reaching out. Our support engineering team will respond within 24 hours.
                  </p>
                  <button
                    className="dash-btn-ghost btn-sm"
                    style={{ marginTop: 20 }}
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="dash-form">
                  <div className="dash-form-group">
                    <label>Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Alex Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="dash-input"
                    />
                  </div>

                  <div className="dash-form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex.vance@university.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="dash-input"
                    />
                  </div>

                  <div className="dash-form-group">
                    <label>Subject / Topic *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="dash-input"
                      required
                    >
                      <option value="">Select Topic...</option>
                      <option value="Faculty Account Request">Faculty Account Request</option>
                      <option value="University Lab Integration">University Lab Integration</option>
                      <option value="Container Pipeline Issue">Container Pipeline Issue</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div className="dash-form-group">
                    <label>Message *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your inquiry or university lab requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="dash-input"
                    />
                  </div>

                  <button type="submit" className="dash-btn-primary" style={{ width: '100%' }}>
                    Send Message ↗
                  </button>
                </form>
              )}
            </div>

            {/* Side Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#ffffff', padding: 20, borderRadius: 14, border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.9375rem', color: '#0f172a' }}>⚡ System Status</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: '#059669', fontWeight: 700 }}>
                  <span className="pv-indicator-dot pv-indicator-dot--active" /> ALL BACKEND SERVICES OPERATIONAL
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: 20, borderRadius: 14, border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.9375rem', color: '#0f172a' }}>📍 Research Headquarters</h4>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>
                  Project Vault Engineering Labs<br />
                  Computer Science & Artificial Intelligence Building<br />
                  Palo Alto, CA 94301
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: 20, borderRadius: 14, border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.9375rem', color: '#0f172a' }}>📧 Direct Contact</h4>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#2563eb', fontWeight: 600 }}>
                  support@projectvault.io
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
}
