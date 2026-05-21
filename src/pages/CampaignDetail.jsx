import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { translations } from '../utils/translations';
import { API_URL } from '../config';
import { getVideoUrl } from '../utils/mediaUtils';

function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [myVideos, setMyVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('likes_desc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [previewVideo, setPreviewVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalMuted, setGlobalMuted] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const previewVideoRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const lang = localStorage.getItem('appLanguage') || 'en';
  const t = translations[lang] || translations.en;
  const cd = t.campaignDetail || {};

  useEffect(() => {
    loadCampaignData();
    if (user) loadMyVideos();
    updateTimestamp();
  }, [id]);

  const updateTimestamp = () => {
    const locale = lang === 'es' ? 'es-ES' : lang === 'zh' ? 'zh-CN' : 'en-US';
    setLastUpdated(new Date().toLocaleString(locale));
  };

  const loadCampaignData = () => {
    setLoading(true);
    // CORRECCIÓN: Uso de API_URL dinámica
    axios.get(`${API_URL}/campaigns/${id}`)
      .then(res => {
        setCampaign(res.data);
        if (res.data.Videos?.length > 0) {
          setPreviewVideo(res.data.Videos[0]);
        }
        updateTimestamp();
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const loadMyVideos = () => {
    // CORRECCIÓN: Uso de API_URL dinámica
    axios.get(`${API_URL}/videos`)
      .then(res => {
        const mine = res.data.filter(v => v.userId === user.id);
        setMyVideos(mine);
      });
  };

  const handleJoin = async () => {
    if (!selectedVideoId) {
      showToast(cd.selectToJoin || 'Select a video to join');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/campaigns/${id}/join`, {
        videoId: selectedVideoId
      }, { headers: { Authorization: `Bearer ${token}` } });
      showToast(cd.joinedSuccess || 'Successfully joined the campaign!');
      loadCampaignData();
      setSelectedVideoId('');
    } catch (error) {
      showToast(error.response?.data?.message || (cd.errorJoining || 'Error joining campaign'));
    }
  };

  const handleLike = async (videoId, e) => {
    if (e) e.stopPropagation();
    if (!user) {
      showToast(cd.signInToLike || 'Sign in to like videos');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/videos/${videoId}/like`, { userId: user.id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadCampaignData();
      showToast(cd.likedLabel || 'Liked!');
    } catch (error) {
      showToast(error.response?.data?.message || (cd.alreadyLiked || 'Already liked'));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(cd.campaignLinkCopied || 'Campaign link copied!');
  };

  const handleCopyVideoLink = () => {
    if (previewVideo) {
      navigator.clipboard.writeText(`${window.location.origin}/watch/${previewVideo.id}`);
      showToast(cd.videoLinkCopied || 'Video link copied!');
    }
  };

  const handleReset = () => {
    loadCampaignData();
    showToast(cd.dataRefreshed || 'Data refreshed');
  };

  const toggleMute = () => {
    setGlobalMuted(!globalMuted);
    if (previewVideoRef.current) {
      previewVideoRef.current.muted = !globalMuted;
    }
    showToast(globalMuted ? (cd.sound || 'Sound on') : (cd.mute || 'Muted'));
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 1200);
  };

  const formatNumber = (n) => {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getRankBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getFilteredVideos = () => {
    if (!campaign?.Videos) return [];
    
    let videos = [...campaign.Videos];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      videos = videos.filter(v =>
        v.title?.toLowerCase().includes(q) ||
        v.User?.email?.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'all') {
      videos = videos.filter(v => v.category === categoryFilter);
    }

    switch (sortBy) {
      case 'likes_desc':
        videos.sort((a, b) => (b.Likes?.length || 0) - (a.Likes?.length || 0));
        break;
      case 'likes_asc':
        videos.sort((a, b) => (a.Likes?.length || 0) - (b.Likes?.length || 0));
        break;
      case 'title_asc':
        videos.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'creator_asc':
        videos.sort((a, b) => (a.User?.email || '').localeCompare(b.User?.email || ''));
        break;
      default:
        break;
    }

    return videos;
  };

  const totalLikes = campaign?.Videos?.reduce((sum, v) => sum + (v.Likes?.length || 0), 0) || 0;
  const filteredVideos = getFilteredVideos();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Header />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 'calc(100vh - 64px)',
          color: 'var(--muted)',
        }}>
          {cd.loadingCampaign || 'Loading campaign...'}
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Header />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 'calc(100vh - 64px)',
          color: 'var(--muted)',
        }}>
          {cd.notFound || 'Campaign not found'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      <main className="wrap" style={{ maxWidth: '1180px', margin: '0 auto', padding: '18px' }}>
        <section className="announce" style={{
          position: 'relative',
          padding: '16px',
          borderRadius: 'var(--r22)',
          border: '1px solid rgba(234,240,255,0.14)',
          background: `
            radial-gradient(700px 400px at 20% 20%, rgba(25,211,255,0.18), transparent 60%),
            radial-gradient(780px 420px at 80% 30%, rgba(124,92,255,0.22), transparent 65%),
            rgba(255,255,255,0.05)
          `,
          boxShadow: 'var(--shadow)',
          overflow: 'hidden',
        }}>
          <span className="pill">
            <span className="dot" style={{
              width: '8px',
              height: '8px',
              borderRadius: '999px',
              background: 'var(--good)',
              boxShadow: '0 0 0 5px rgba(70,230,165,0.15)',
            }}></span>
            {cd.campaignLive || 'Campaign live'}
          </span>
          
          <h1 style={{
            margin: '8px 0 6px',
            fontSize: 'clamp(18px, 2.4vw, 28px)',
            letterSpacing: '-0.3px',
          }}>
            {campaign.name}
          </h1>
          
          <p style={{ margin: 0, color: 'rgba(234,240,255,0.78)', maxWidth: '88ch' }}>
            {campaign.description || (cd.howItWorksDesc || 'Like your favorite clips to push them up the leaderboard.')}
          </p>

          <div className="announceGrid" style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 0.7fr',
            gap: '12px',
            alignItems: 'center',
            marginTop: '12px',
          }}>
            <div className="hint" style={{ fontSize: '12px', color: 'rgba(234,240,255,0.64)' }}>
              <b>{cd.howItWorks || 'How it works:'}</b> {cd.howItWorksDesc || 'click on any video in the leaderboard. We rank videos by total likes (ties break by most recent like). Rankings update in real-time.'}
            </div>
            <div className="kpis" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <div className="kpi" style={{
                border: '1px solid var(--line)',
                background: 'rgba(0,0,0,0.18)',
                borderRadius: '16px',
                padding: '10px 12px',
                minWidth: '120px',
              }}>
                <b style={{ display: 'block', fontSize: '16px' }}>{formatNumber(totalLikes)}</b>
                <span style={{ display: 'block', fontSize: '12px', color: 'rgba(234,240,255,0.68)' }}>{cd.totalLikes || 'Total likes (campaign)'}</span>
              </div>
              <div className="kpi" style={{
                border: '1px solid var(--line)',
                background: 'rgba(0,0,0,0.18)',
                borderRadius: '16px',
                padding: '10px 12px',
                minWidth: '120px',
              }}>
                <b style={{ display: 'block', fontSize: '16px' }}>{formatNumber(campaign.Videos?.length || 0)}</b>
                <span style={{ display: 'block', fontSize: '12px', color: 'rgba(234,240,255,0.68)' }}>{cd.videosInCompetition || 'Videos in competition'}</span>
              </div>
              <div className="kpi" style={{
                border: '1px solid var(--line)',
                background: 'rgba(0,0,0,0.18)',
                borderRadius: '16px',
                padding: '10px 12px',
                minWidth: '120px',
              }}>
                <b style={{ display: 'block', fontSize: '16px' }}>{lastUpdated || '—'}</b>
                <span style={{ display: 'block', fontSize: '12px', color: 'rgba(234,240,255,0.68)' }}>{cd.lastUpdated || 'Last updated'}</span>
              </div>
            </div>
          </div>

          {user && myVideos.length > 0 && (
            <div style={{
              marginTop: '14px',
              padding: '12px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{cd.joinWithVideo || 'Join with your video:'}</span>
              <select
                className="select"
                value={selectedVideoId}
                onChange={e => setSelectedVideoId(e.target.value)}
                style={{
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  borderRadius: '14px',
                  padding: '10px 12px',
                  minWidth: '200px',
                  flex: '1 1 200px',
                }}
              >
                <option value="">{cd.selectVideo || '-- Select Video --'}</option>
                {myVideos.map(v => (
                  <option key={v.id} value={v.id}>{v.title}</option>
                ))}
              </select>
              <button onClick={handleJoin} className="btn primary">
                {cd.joinCampaign || 'Join Campaign'}
              </button>
            </div>
          )}
        </section>

        <section className="panel campaign-controls-bar">
          <div className="campaign-controls-left">
            <input
              className="campaign-search-input"
              placeholder={cd.searchPlaceholder || 'Search by title, creator, tag...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <select
              className="select"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{
                border: '1px solid var(--line)',
                background: 'var(--bg)',
                color: 'var(--text)',
                borderRadius: '14px',
                padding: '10px 12px',
              }}
            >
              <option value="all">{cd.allCategories || 'All categories'}</option>
              <option value="Gaming">Gaming</option>
              <option value="Trending">Trending</option>
              <option value="Tutorials">Tutorials</option>
              <option value="Clips">Clips</option>
              <option value="Highlights">Highlights</option>
            </select>
            <select
              className="select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                border: '1px solid var(--line)',
                background: 'var(--bg)',
                color: 'var(--text)',
                borderRadius: '14px',
                padding: '10px 12px',
              }}
            >
              <option value="likes_desc">{cd.sortLikesHigh || 'Sort: Likes (high → low)'}</option>
              <option value="likes_asc">{cd.sortLikesLow || 'Sort: Likes (low → high)'}</option>
              <option value="title_asc">{cd.sortTitle || 'Sort: Title (A → Z)'}</option>
              <option value="creator_asc">{cd.sortCreator || 'Sort: Creator (A → Z)'}</option>
            </select>
          </div>
          <div className="campaign-controls-right">
            <span className="muted" style={{ fontSize: '12px' }}>{cd.clickToPreview || 'Click a row to preview'}</span>
            <button onClick={toggleMute} className="btn">{globalMuted ? `🔇 ${cd.mute || 'Mute'}` : `🔊 ${cd.sound || 'Sound'}`}</button>
            <button onClick={handleReset} className="btn" title={cd.refresh || 'Refresh'}>🔄 {cd.refresh || 'Refresh'}</button>
            <button onClick={handleShare} className="btn primary">📤 {cd.shareCampaign || 'Share campaign'}</button>
          </div>
        </section>

        <section className="campaign-grid">
          <section className="panel list" style={{ padding: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              padding: '4px 6px 12px',
              flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontWeight: 900, letterSpacing: '-0.2px' }}>{cd.leaderboard || 'Leaderboard'}</div>
                <div className="muted" style={{ fontSize: '12px' }}>
                  {filteredVideos.length} {cd.videosShown || 'videos shown'} • {cd.rankedByLikes || 'ranked by likes'}
                </div>
              </div>
              <span className="pill">
                <span className="dot" style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: 'var(--good)',
                  boxShadow: '0 0 0 5px rgba(70,230,165,0.15)',
                }}></span>
                {cd.updatedLive || 'Updated live'}
              </span>
            </div>

            {filteredVideos.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
                {cd.noVideos || 'No videos in this campaign yet.'}
              </div>
            ) : (
              <div id="rows">
                {filteredVideos.map((video, index) => {
                  const isLikedByMe = user && video.Likes?.some(l => l.userId === user.id);
                  return (
                    <div
                      key={video.id}
                      className="row"
                      onClick={() => setPreviewVideo(video)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '54px 1fr auto',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '18px',
                        border: previewVideo?.id === video.id 
                          ? '1px solid rgba(124,92,255,0.4)' 
                          : '1px solid rgba(234,240,255,0.10)',
                        background: previewVideo?.id === video.id 
                          ? 'rgba(124,92,255,0.08)' 
                          : 'rgba(255,255,255,0.04)',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, background 0.15s ease, border-color 0.15s ease',
                      }}
                    >
                      <div className="rank" style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '16px',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 900,
                        background: index < 3 
                          ? 'linear-gradient(135deg, rgba(124,92,255,0.3), rgba(25,211,255,0.2))'
                          : 'rgba(124,92,255,0.18)',
                        border: '1px solid rgba(124,92,255,0.26)',
                        color: 'rgba(234,240,255,0.92)',
                        fontSize: index < 3 ? '18px' : '14px',
                        flexShrink: 0,
                      }}>
                        {getRankBadge(index)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="thumb" style={{
                          width: '100%',
                          height: '44px',
                          borderRadius: '16px',
                          border: '1px solid var(--line)',
                          background: `
                            radial-gradient(220px 120px at 20% 20%, rgba(25,211,255,0.18), transparent 60%),
                            radial-gradient(240px 140px at 80% 30%, rgba(124,92,255,0.22), transparent 65%),
                            rgba(0,0,0,0.22)
                          `,
                          overflow: 'hidden',
                        }}></div>
                        <p className="title" style={{ margin: '8px 0 0', fontSize: '13px', fontWeight: 900, letterSpacing: '-0.1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {video.title}
                        </p>
                        <div className="meta" style={{ marginTop: '6px', fontSize: '12px', color: 'rgba(234,240,255,0.72)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="chip" style={{
                            padding: '3px 8px',
                            borderRadius: '999px',
                            border: '1px solid var(--line)',
                            background: 'rgba(255,255,255,0.04)',
                          }}>@{video.User?.email?.split('@')[0] || 'User'}</span>
                          {video.category && (
                            <span className="chip" style={{
                              padding: '3px 8px',
                              borderRadius: '999px',
                              border: '1px solid var(--line)',
                              background: 'rgba(255,255,255,0.04)',
                            }}>{video.category}</span>
                          )}
                        </div>
                      </div>
                      <div className="likes" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', minWidth: '80px', flexShrink: 0 }}>
                        <span className="likeCount" style={{ fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>
                          {formatNumber(video.Likes?.length || 0)} ❤️
                        </span>
                        <button
                          onClick={(e) => handleLike(video.id, e)}
                          className={`miniBtn ${isLikedByMe ? 'liked' : ''}`}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '999px',
                            border: isLikedByMe ? '1px solid rgba(255,77,109,0.22)' : '1px solid var(--line)',
                            background: isLikedByMe ? 'rgba(255,77,109,0.08)' : 'rgba(255,255,255,0.04)',
                            cursor: 'pointer',
                            color: 'rgba(234,240,255,0.86)',
                            fontSize: '12px',
                          }}
                        >
                          {isLikedByMe ? `❤️ ${cd.likedLabel || 'Liked'}` : `🤍 ${cd.likeLabel || 'Like'}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="panel preview" style={{ padding: '12px' }}>
            {previewVideo ? (
              <>
                <div className="player" style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid var(--line)',
                  background: 'rgba(0,0,0,0.35)',
                  boxShadow: '0 26px 90px rgba(0,0,0,0.35)',
                  aspectRatio: '16/9',
                }}>
                  <video
                    ref={previewVideoRef}
                    playsInline
                    controls
                    preload="metadata"
                    muted={globalMuted}
                    src={getVideoUrl(previewVideo.videoUrl)}
                    style={{ width: '100%', height: '100%', display: 'block', background: '#000' }}
                  />
                </div>
                <div className="pMeta" style={{ padding: '12px 2px 4px' }}>
                  <h2 style={{ margin: '0 0 6px', fontSize: '16px' }}>{previewVideo.title}</h2>
                  <p className="muted" style={{ margin: 0 }}>
                    {cd.by || 'By'} <b>@{previewVideo.User?.email?.split('@')[0] || 'Creator'}</b> • {previewVideo.views || 0} {cd.views || 'views'}
                  </p>
                  <div className="pActions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '10px 0 0' }}>
                    <button onClick={() => handleLike(previewVideo.id)} className="btn primary">❤️ {cd.likeBtn || 'Like'}</button>
                    <button onClick={handleCopyVideoLink} className="btn">📋 {cd.copyVideoLink || 'Copy video link'}</button>
                    <Link to={`/watch/${previewVideo.id}`} className="btn">▶️ {cd.watchFull || 'Watch full'}</Link>
                  </div>
                  <div className="muted" style={{ fontSize: '12px', marginTop: '10px' }}>
                    {formatNumber(previewVideo.Likes?.length || 0)} {cd.likes || 'likes'} • {previewVideo.description || (cd.noDescriptionPreview || 'No description')}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '300px',
                color: 'var(--muted)',
                gap: '12px',
              }}>
                <span style={{ fontSize: '48px' }}>🎬</span>
                <h2 style={{ margin: 0, fontSize: '16px' }}>{cd.selectAVideo || 'Select a video'}</h2>
                <p style={{ margin: 0, fontSize: '13px' }}>{cd.selectToPreview || 'Click a leaderboard row to load the preview.'}</p>
              </div>
            )}
          </aside>
        </section>

        <footer style={{
          padding: '24px 0 10px',
          color: 'rgba(234,240,255,0.55)',
          fontSize: '12px',
          textAlign: 'center',
        }}>
          © {new Date().getFullYear()} ShortVideo — {cd.campaignPage || 'Campaign page'}
        </footer>
      </main>

      <div className={`toast ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
    </div>
  );
}

export default CampaignDetail;
