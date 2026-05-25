import React, { useState, useMemo } from 'react';

/**
 * JoinVideoSidebar
 * Props:
 *   myVideos: array of video objects owned by the user (already normalized URLs)
 *   selectedVideoId: currently selected video id
 *   setSelectedVideoId: function to update selected video
 *   handleJoin: function to invoke join API
 *   placeholderText: UI text (translated) for search placeholder
 */
const JoinVideoSidebar = ({ myVideos = [], selectedVideoId, setSelectedVideoId, handleJoin, placeholderText }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return myVideos;
    const q = search.toLowerCase();
    return myVideos.filter(v =>
      v.title?.toLowerCase().includes(q) ||
      v.id?.toString().includes(q)
    );
  }, [search, myVideos]);

  return (
    <div style={{
      width: '100%',
      padding: '12px',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      alignItems: 'stretch',
    }}>      <span style={{ fontSize: '13px', fontWeight: 600 }}>Selecciona tu video</span>
      <input
        type="text"
        placeholder={placeholderText || 'Buscar video...'}
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '6px 8px',
          borderRadius: '8px',
          border: '1px solid var(--line)',
          background: 'var(--bg)',
          color: 'var(--text)',
        }}
      />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', width: '100%' }}>
            {filtered.map(v => (
              <div
                key={v.id}
                onClick={() => setSelectedVideoId(v.id)}
                style={{
                  border: selectedVideoId === v.id ? '2px solid var(--good)' : '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={v.thumbnailUrl || v.videoUrl}
                  alt={v.title}
                  style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '4px' }}
                />
                <div style={{ fontSize: '12px', textAlign: 'center' }}>{v.title}</div>
              </div>
            ))}
          </div>
      <button onClick={handleJoin} className="btn primary" style={{ width: '100%' }}>
        Unir a campaña
      </button>
    </div>
  );
};

export default JoinVideoSidebar;
