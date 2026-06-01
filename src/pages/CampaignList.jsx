import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { translations } from '../utils/translations';
import { API_URL } from '../config';
function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const lang = localStorage.getItem('appLanguage') || 'en';
  const t = translations[lang] || translations.en;
  const c = t.campaigns || {};

  useEffect(() => {
    // Ya no necesitas el if/else aquí, la variable API_URL lo hace todo
    axios.get(`${API_URL}/campaigns`)
      .then(res => setCampaigns(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    const locale = lang === 'es' ? 'es-ES' : lang === 'zh' ? 'zh-CN' : 'en-US';
    return new Date(dateStr).toLocaleDateString(locale, { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      
      <main className="wrap" style={{ maxWidth: '1180px', margin: '0 auto', padding: '18px' }}>
        {/* Header with Admin Button */}
        <section style={{
          position: 'relative',
          padding: '24px',
          borderRadius: 'var(--r22)',
          border: '1px solid rgba(234, 240, 255, 0.14)',
          background: `
            radial-gradient(700px 400px at 20% 20%, rgba(25, 211, 255, 0.18), transparent 60%),
            radial-gradient(780px 420px at 80% 30%, rgba(124, 92, 255, 0.22), transparent 65%),
            var(--panel)
          `,
          boxShadow: 'var(--shadow)',
          marginBottom: '24px',
        }}>
          <div className="campaign-list-header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
                <span className="pill">{c.activeChallenges || 'Active Challenges'}</span>
            </div>

            {user && user.role === 'admin' && (
                <Link 
                    to="/create-campaign" 
                    className="btn primary"
                    style={{ 
                        background: 'white', 
                        color: 'black', 
                        fontWeight: 800,
                        boxShadow: '0 4px 15px rgba(255,255,255,0.2)' 
                    }}
                >
                    {c.newCampaign || '+ New Campaign'}
                </Link>
            )}
          </div>
        </section>

        {/* Campaign Grid */}
        <section>
          {loading ? (
            <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>
              <span className="muted">{c.loadingCampaigns || 'Loading campaigns...'}</span>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>
              <span className="muted">{c.noCampaigns || 'No active campaigns at the moment.'}</span>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              {campaigns.map(camp => (
                <article key={camp.id} className="panel" style={{ padding: '20px', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="pill">{c.challenge || 'Challenge'}</span>
                    <span className="pill" style={{ 
                      background: 'rgba(70, 230, 165, 0.1)', 
                      borderColor: 'rgba(70, 230, 165, 0.2)',
                      color: 'var(--good)',
                    }}>
                      <span className="dot"></span>
                      {c.active || 'Active'}
                    </span>
                  </div>
                  
                  <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800 }}>
                    {camp.name}
                  </h3>
                  
                  <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: '13px', lineHeight: 1.5 }}>
                    {camp.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', color: 'var(--muted)', fontSize: '13px', lineHeight: 1.3 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8EDBFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: '0 0 auto' }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>{c.start || 'Start'}: <strong style={{ color: '#8EDBFF', fontWeight: 700 }}>{formatDate(camp.startDate)}</strong></span>
                      <span>{c.end || 'End'}: <strong style={{ color: '#8EDBFF', fontWeight: 700 }}>{formatDate(camp.endDate)}</strong></span>
                    </div>
                    <Link to={`/campaign/${camp.id}`} className="btn primary" style={{ width: 'auto', minWidth: '160px' }}>
                      Enter Campaign
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CampaignList;
