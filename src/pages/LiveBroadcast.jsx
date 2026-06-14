import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { API_URL } from '../config';
import { translations } from '../utils/translations';
import { getAvatarUrl } from '../utils/mediaUtils';

function LiveBroadcast() {
  const navigate = useNavigate();
  const location = useLocation();
  const lang = localStorage.getItem('appLanguage') || 'en';
  const t = translations[lang] || translations.en;

  // Estados del Canal y Stream
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerCount, setViewerCount] = useState(105);

  // Estados de Interacción (Chat y Donaciones)
  const [chatMessages, setChatMessages] = useState([
    { user: 'Alice', text: 'Wow, great quality stream! 🔥', time: '12:00' },
    { user: 'Bob', text: 'Is this live from Spain?', time: '12:01' },
    { user: 'Charlie', text: 'Awesome video! 👍', time: '12:01' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  
  // Elementos DOM
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);
  const hlsInstanceRef = useRef(null);

  // Obtener usuario del local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Referencias para la señalización WebRTC P2P
  const hostEventSourceRef = useRef(null);
  const viewerEventSourceRef = useRef(null);
  const peerConnectionsRef = useRef({}); // viewerId -> RTCPeerConnection
  const viewerPeerConnectionRef = useRef(null); // RTCPeerConnection
  const viewerIdRef = useRef(Math.random().toString(36).substring(7));

  // 1. Cargar canales en la base de datos
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await axios.get(`${API_URL}/live`);
        setChannels(res.data || []);
        
        // Determinar canal inicial
        const queryParams = new URLSearchParams(location.search);
        const channelIdParam = queryParams.get('channel');
        
        if (res.data && res.data.length > 0) {
          let initialChannel = null;
          if (channelIdParam) {
            initialChannel = res.data.find(c => c.id === parseInt(channelIdParam, 10));
          }
          // Si no hay parámetro o no se encuentra el canal, elegir el primero destacado o el primero en vivo, o en su defecto el primero de la lista
          if (!initialChannel) {
            initialChannel = res.data.find(c => c.status === 'live') || res.data.find(c => c.isFeatured) || res.data[0];
          }
          setSelectedChannel(initialChannel);
        }
      } catch (error) {
        console.error('Error fetching live channels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, [location.search]);

  // Cleanup general al desmontar la vista
  useEffect(() => {
    return () => {
      if (hostEventSourceRef.current) hostEventSourceRef.current.close();
      if (viewerEventSourceRef.current) viewerEventSourceRef.current.close();
      
      // Cerrar conexiones peer del host
      Object.keys(peerConnectionsRef.current).forEach(id => {
        peerConnectionsRef.current[id].close();
      });
      
      // Cerrar conexión peer del espectador
      if (viewerPeerConnectionRef.current) {
        viewerPeerConnectionRef.current.close();
      }
    };
  }, []);

  // 2. Cargar dinámicamente HLS.js si es necesario y reproducir, o conectarse vía WebRTC P2P si el canal está en vivo
  useEffect(() => {
    if (!selectedChannel || !videoRef.current || isBroadcasting) return;

    // Si el canal está LIVE y no somos el host, intentamos conectar vía WebRTC P2P
    const isHost = user && (selectedChannel.userId === user.id || user.role === 'admin');
    if (selectedChannel.status === 'live' && !isHost) {
      startViewerWebRTC();
      return () => {
        stopViewerWebRTC();
      };
    }

    // Si el canal está offline o somos el host, cargamos HLS normal
    // Destruir instancia de HLS previa
    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy();
      hlsInstanceRef.current = null;
    }

    const videoElement = videoRef.current;
    // URL por defecto para pruebas si no hay streamUrl (un video HLS de ejemplo público)
    const streamUrl = selectedChannel.streamUrl || 'https://test-streams.mux.dev/x36xhq/x36xhq.m3u8';

    // Función para arrancar el HLS player
    const initPlayer = () => {
      const Hls = window.Hls;
      if (Hls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(videoElement);
        hlsInstanceRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play().catch(e => console.log('Autoplay prevented', e));
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('fatal network error encountered, try to recover');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('fatal media error encountered, try to recover');
                hls.recoverMediaError();
                break;
              default:
                console.log('fatal error, destroying player');
                hls.destroy();
                break;
            }
          }
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Soporte nativo para HLS (Safari, iOS, etc.)
        videoElement.src = streamUrl;
        videoElement.addEventListener('loadedmetadata', () => {
          videoElement.play().catch(e => console.log('Autoplay prevented', e));
        });
      }
    };

    // Si Hls no está cargado en el objeto window, inyectar el script CDN
    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js';
      script.async = true;
      script.onload = () => {
        initPlayer();
      };
      document.body.appendChild(script);
    } else {
      initPlayer();
    }

    // Variar número de espectadores periódicamente
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(5, prev + Math.floor(Math.random() * 11) - 5));
    }, 4000);

    return () => {
      clearInterval(interval);
      stopViewerWebRTC();
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [selectedChannel, isBroadcasting]);

  // 3. Simulación de chat en vivo (comentarios entrantes)
  useEffect(() => {
    if (!selectedChannel || selectedChannel.status !== 'live') return;

    const mockMessages = [
      'This stream is amazing! 💎',
      'Greetings from the USA!',
      'What camera are you using? 🎥',
      'Can you show that again?',
      'So cool! 🚀',
      'Hurramy live is working beautifully!',
      'Support the creator with some coins! 🌸',
      'Love the background music!',
    ];

    const mockUsers = [
      'David', 'Emma', 'Sofia', 'Michael', 'Lin', 'Mateo', 'Zoe', 'Kenji'
    ];

    const chatInterval = setInterval(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const randomText = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setChatMessages(prev => [
        ...prev.slice(-40), // Limitar a los últimos 40 mensajes en memoria
        { user: randomUser, text: randomText, time: timeStr }
      ]);
    }, 6000);

    return () => clearInterval(chatInterval);
  }, [selectedChannel]);

  // Auto-scroll del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Enviar mensaje del usuario en el chat
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const userName = user ? user.email.split('@')[0] : 'Guest';

    setChatMessages(prev => [
      ...prev,
      { user: userName, text: chatInput, time: timeStr, isUser: true }
    ]);
    setChatInput('');
  };

  // Donar flores/créditos al host (10 WAi Coins)
  const handleDonate = async () => {
    if (!user) {
      alert(t.videoPlayer?.signInToGiveFlowers || 'Please login to donate');
      navigate('/login');
      return;
    }

    if (user.waiCoins < 10) {
      alert(t.videoPlayer?.insufficientCoinsAlert || 'Insufficient WAi Coins');
      return;
    }

    try {
      // Endpoint simulado o endpoint real de donaciones si existiera para host (adaptado de donaciones de video)
      // Como no hay endpoint directo para canales de live, descontamos las coins mediante la API o mostramos la donación en el chat.
      // Vamos a emular la donación en el chat y mostrar éxito
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // Descontar visualmente del usuario local
      user.waiCoins -= 10;
      localStorage.setItem('user', JSON.stringify(user));

      setChatMessages(prev => [
        ...prev,
        { 
          user: 'SYSTEM', 
          text: `🎉 @${user.email.split('@')[0]} donated 10 WAi Coins to the host! 🌸`, 
          time: timeStr, 
          isSystem: true 
        }
      ]);

      alert(t.videoPlayer?.flowersGiven || 'Donation successful! Thank you.');
    } catch (error) {
      console.error('Error in donation:', error);
      alert(t.videoPlayer?.errorGivingFlowers || 'Error during donation');
    }
  };

  // --- Transmisión de Pantalla en Vivo (Screen Sharing) ---
  const startScreenShare = async () => {
    if (!selectedChannel) return;
    try {
      // Solicitar captura de pantalla del navegador
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      // Detener reproductor HLS previo
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }

      // Conectar la captura de pantalla al elemento de video local
      if (videoRef.current) {
        videoRef.current.src = "";
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Mutear localmente para evitar feedback acústico
        videoRef.current.play().catch(e => console.error("Error playing stream:", e));
      }

      setLocalStream(stream);
      setIsBroadcasting(true);

      // Notificar al backend que el canal está 'live'
      try {
        await axios.put(`${API_URL}/live/${selectedChannel.id}/status`, { status: 'live' }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Actualizar la lista local
        setChannels(prev => prev.map(c => c.id === selectedChannel.id ? { ...c, status: 'live' } : c));
        setSelectedChannel(prev => ({ ...prev, status: 'live' }));
      } catch (err) {
        console.error("Error updating status to live in backend:", err);
      }

      // Suscribirse a la señalización del Host
      const es = new EventSource(`${API_URL}/live/${selectedChannel.id}/signal/host`);
      hostEventSourceRef.current = es;

      es.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        const { senderId, type, data } = msg;

        if (type === 'viewer-connected') {
          // Crear conexión para este viewer específico
          const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19002' }]
          });
          peerConnectionsRef.current[senderId] = pc;

          // Añadir tracks de nuestro stream local de pantalla
          stream.getTracks().forEach(track => pc.addTrack(track, stream));

          pc.onicecandidate = (e) => {
            if (e.candidate) {
              axios.post(`${API_URL}/live/${selectedChannel.id}/signal/send`, {
                senderId: 'host',
                receiverId: senderId,
                type: 'candidate',
                data: e.candidate
              }).catch(err => console.error("Error sending candidate to viewer:", err));
            }
          };

          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // Enviar oferta al viewer
            await axios.post(`${API_URL}/live/${selectedChannel.id}/signal/send`, {
              senderId: 'host',
              receiverId: senderId,
              type: 'offer',
              data: offer
            });
          } catch (err) {
            console.error("Error creating offer for viewer:", err);
          }

        } else if (type === 'viewer-disconnected') {
          const pc = peerConnectionsRef.current[senderId];
          if (pc) {
            pc.close();
            delete peerConnectionsRef.current[senderId];
          }
        } else if (type === 'answer') {
          const pc = peerConnectionsRef.current[senderId];
          if (pc) {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data));
            } catch (err) {
              console.error("Error setting answer description:", err);
            }
          }
        } else if (type === 'candidate') {
          const pc = peerConnectionsRef.current[senderId];
          if (pc) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(data));
            } catch (err) {
              console.error("Error adding viewer candidate:", err);
            }
          }
        }
      };

      // Escuchar cuando el usuario hace clic en "Dejar de compartir" en la UI flotante del navegador
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

    } catch (err) {
      console.error("Error obtaining screen capture:", err);
      alert(lang === 'es' ? 'Transmisión cancelada o permiso denegado.' : 'Broadcasting cancelled or permission denied.');
    }
  };

  const stopScreenShare = async () => {
    // Cerrar EventSource del Host
    if (hostEventSourceRef.current) {
      hostEventSourceRef.current.close();
      hostEventSourceRef.current = null;
    }

    // Cerrar todas las conexiones peer del Host
    Object.keys(peerConnectionsRef.current).forEach(viewerId => {
      peerConnectionsRef.current[viewerId].close();
    });
    peerConnectionsRef.current = {};

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setIsBroadcasting(false);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Notificar al backend que el canal está 'offline'
    if (selectedChannel) {
      try {
        await axios.put(`${API_URL}/live/${selectedChannel.id}/status`, { status: 'offline' }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Actualizar la lista local
        setChannels(prev => prev.map(c => c.id === selectedChannel.id ? { ...c, status: 'offline' } : c));
        setSelectedChannel(prev => ({ ...prev, status: 'offline' }));
      } catch (err) {
        console.error("Error updating status to offline in backend:", err);
      }
    }

    // Recargar el reproductor HLS normal del canal
    reloadNormalPlayer();
  };

  const reloadNormalPlayer = () => {
    if (!selectedChannel || !videoRef.current) return;
    const videoElement = videoRef.current;
    const streamUrl = selectedChannel.streamUrl || 'https://test-streams.mux.dev/x36xhq/x36xhq.m3u8';

    const initPlayer = () => {
      const Hls = window.Hls;
      if (Hls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(videoElement);
        hlsInstanceRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play().catch(e => console.log('Autoplay prevented', e));
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = streamUrl;
        videoElement.play().catch(e => console.log('Autoplay prevented', e));
      }
    };

    if (window.Hls) {
      initPlayer();
    }
  };

  const stopViewerWebRTC = () => {
    if (viewerEventSourceRef.current) {
      viewerEventSourceRef.current.close();
      viewerEventSourceRef.current = null;
    }
    if (viewerPeerConnectionRef.current) {
      viewerPeerConnectionRef.current.close();
      viewerPeerConnectionRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startViewerWebRTC = () => {
    stopViewerWebRTC();
    if (!selectedChannel) return;

    const channelId = selectedChannel.id;
    const viewerId = viewerIdRef.current;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19002' }]
    });
    viewerPeerConnectionRef.current = pc;

    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
        videoRef.current.muted = false; // Desmutear para el espectador
        videoRef.current.play().catch(e => console.error("Error playing remote track:", e));
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        axios.post(`${API_URL}/live/${channelId}/signal/send`, {
          senderId: viewerId,
          receiverId: 'host',
          type: 'candidate',
          data: event.candidate
        }).catch(err => console.error("Error sending viewer candidate:", err));
      }
    };

    // Suscribirse al canal SSE de señalización para este viewer
    const es = new EventSource(`${API_URL}/live/${channelId}/signal/viewer/${viewerId}`);
    viewerEventSourceRef.current = es;

    es.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      const { senderId, type, data } = msg;

      if (senderId === 'host') {
        if (type === 'offer') {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(data));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            // Enviar respuesta al host
            await axios.post(`${API_URL}/live/${channelId}/signal/send`, {
              senderId: viewerId,
              receiverId: 'host',
              type: 'answer',
              data: answer
            });
          } catch (err) {
            console.error("Error handling offer in viewer:", err);
          }
        } else if (type === 'candidate') {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(data));
          } catch (err) {
            console.error("Error adding candidate in viewer:", err);
          }
        }
      }
    };
  };

  const changeChannel = (channel) => {
    setSelectedChannel(channel);
    navigate(`/live?channel=${channel.id}`);
  };

  const getThumbnailSrc = (channel) => {
    if (channel.thumbnail) {
      return `${API_URL}${channel.thumbnail}`;
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      <Header onSearch={() => {}} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="live-main-container" style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--muted)' }}>
              <h3>{t.common?.loading || 'Loading broadcasts...'}</h3>
            </div>
          ) : !selectedChannel ? (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', textAlign: 'center', gap: '20px' }}>
              <div style={{ fontSize: '64px' }}>📡</div>
              <h2>{lang === 'es' ? 'No hay transmisiones disponibles' : 'No streams available'}</h2>
              <p className="muted" style={{ maxWidth: '400px' }}>
                {lang === 'es' ? 'Actualmente no se han creado canales de transmisión. Vuelve más tarde o ponte en contacto con un administrador.' 
                              : 'No live channels have been created yet. Please check back later or contact an administrator.'}
              </p>
              <Link to="/" className="btn primary">{lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}</Link>
            </div>
          ) : (
            <div className="live-grid-layout" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
              
              {/* Columna Izquierda: Stream Player & Info */}
              <div className="live-player-area">
                
                {/* Player Container */}
                <div className="live-video-wrapper" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', background: '#050816', borderRadius: '16px', border: '1px solid var(--line)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  <video 
                    ref={videoRef} 
                    controls 
                    playsInline 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                  />

                  {/* Status Overlay */}
                  <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', zIndex: 5 }}>
                    <span style={{ 
                      background: selectedChannel.status === 'live' ? '#ff4d6d' : 'rgba(255,255,255,0.2)', 
                      color: '#fff', 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {selectedChannel.status === 'live' && (
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#fff', animation: 'pulse 1.2s infinite' }} />
                      )}
                      {selectedChannel.status === 'live' ? 'LIVE' : 'OFFLINE'}
                    </span>
                    <span style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      👁️ {selectedChannel.status === 'live' ? viewerCount : 0}
                    </span>
                  </div>
                </div>

                {/* Host & Channel Information */}
                <div className="live-channel-details" style={{ marginTop: '20px', padding: '20px', background: 'var(--panel)', borderRadius: '16px', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div className="live-host-avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--brand)', background: '#252945', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {selectedChannel.host?.avatar ? (
                          <img src={getAvatarUrl(selectedChannel.host.avatar)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ color: '#fff', fontWeight: 600 }}>{selectedChannel.host?.email[0].toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>{selectedChannel.name}</h1>
                        <p className="muted" style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                          Host: <strong>@{selectedChannel.host?.email.split('@')[0] || 'host'}</strong>
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {/* Controles de Screen Sharing para el Host o Administrador */}
                      {(user && selectedChannel && (selectedChannel.userId === user.id || user.role === 'admin')) && (
                        <>
                          {isBroadcasting ? (
                            <button 
                              onClick={stopScreenShare}
                              className="btn" 
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', background: '#ff4d6d', color: '#fff', border: 'none', animation: 'pulse 1.5s infinite' }}
                            >
                              🛑 {lang === 'es' ? 'Detener Transmisión' : 'Stop Streaming'}
                            </button>
                          ) : (
                            <button 
                              onClick={startScreenShare}
                              className="btn primary" 
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold' }}
                            >
                              🖥️ {lang === 'es' ? 'Transmitir Pantalla' : 'Go Live (Share Screen)'}
                            </button>
                          )}
                        </>
                      )}

                      <button 
                        onClick={handleDonate}
                        className="btn" 
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)' }}
                      >
                        🌸 {lang === 'es' ? 'Donar 10 Coins' : 'Donate 10 Coins'}
                      </button>
                    </div>
                  </div>

                  <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '16px 0' }} />

                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 600 }}>{lang === 'es' ? 'Acerca de esta transmisión' : 'About this stream'}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text)', lineHeight: 1.5 }}>
                      {selectedChannel.description || (lang === 'es' ? 'No se proporcionó una descripción para este canal.' : 'No description provided for this channel.')}
                    </p>
                  </div>
                </div>

              </div>

              {/* Columna Derecha: Chat y Otros Canales */}
              <div className="live-sidebar-area" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Live Chat Panel */}
                <div className="live-chat-panel" style={{ display: 'flex', flexDirection: 'column', height: '400px', background: 'var(--panel)', borderRadius: '16px', border: '1px solid var(--line)', overflow: 'hidden' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      💬 {lang === 'es' ? 'Chat en Vivo' : 'Live Chat'}
                    </h3>
                  </div>

                  {/* Messages Feed */}
                  <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {chatMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        style={{ 
                          fontSize: '13px', 
                          lineHeight: 1.4, 
                          background: msg.isSystem ? 'rgba(70,230,165,0.1)' : 'transparent',
                          padding: msg.isSystem ? '6px 10px' : '0',
                          borderRadius: msg.isSystem ? '8px' : '0',
                          border: msg.isSystem ? '1px solid rgba(70,230,165,0.2)' : 'none'
                        }}
                      >
                        <span className="muted" style={{ fontSize: '10px', marginRight: '6px' }}>{msg.time}</span>
                        <strong style={{ 
                          color: msg.isUser ? 'var(--brand2)' : msg.isSystem ? 'var(--good)' : '#8b92b6', 
                          marginRight: '6px' 
                        }}>
                          {msg.user}:
                        </strong>
                        <span style={{ color: msg.isSystem ? 'var(--good)' : 'var(--text)' }}>{msg.text}</span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Send Input */}
                  <form onSubmit={handleSendChat} style={{ padding: '12px', borderTop: '1px solid var(--line)', display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder={lang === 'es' ? 'Escribe algo...' : 'Say something...'} 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="input" 
                      style={{ flex: 1, padding: '8px 12px', fontSize: '13px', borderRadius: '8px' }}
                    />
                    <button type="submit" className="btn primary" style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '13px' }}>
                      Send
                    </button>
                  </form>
                </div>

                {/* Otros Canales */}
                <div className="live-channels-list-panel" style={{ background: 'var(--panel)', borderRadius: '16px', border: '1px solid var(--line)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700 }}>
                    📺 {lang === 'es' ? 'Otros Canales' : 'Other Channels'}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                    {channels.map(ch => (
                      <button 
                        key={ch.id} 
                        onClick={() => changeChannel(ch)}
                        style={{ 
                          display: 'flex', 
                          gap: '12px', 
                          alignItems: 'center', 
                          width: '100%', 
                          background: selectedChannel.id === ch.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                          border: 'none', 
                          borderRadius: '8px', 
                          padding: '8px', 
                          cursor: 'pointer',
                          textAlign: 'left',
                          color: 'inherit',
                          transition: 'all 0.15s'
                        }}
                        className="channel-item-row"
                      >
                        <div style={{ position: 'relative', width: '50px', height: '30px', borderRadius: '4px', overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                          {ch.thumbnail ? (
                            <img src={getThumbnailSrc(ch)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: ch.status === 'live' ? 'red' : '#3c3f58', color: '#fff', fontSize: '8px', fontWeight: 'bold' }}>LIVE</div>
                          )}
                          {ch.status === 'live' && (
                            <span style={{ position: 'absolute', bottom: '2px', right: '2px', width: '6px', height: '6px', borderRadius: '50%', background: 'red' }} />
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.name}</div>
                          <div style={{ fontSize: '11px', color: ch.status === 'live' ? '#ff4d6d' : 'var(--muted)', fontWeight: ch.status === 'live' ? '600' : '400' }}>
                            {ch.status === 'live' ? 'Live' : 'Offline'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}
        </main>
      </div>

      {/* CSS Animado Pulse inyectado */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 77, 109, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 77, 109, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 77, 109, 0); }
        }
        .channel-item-row:hover {
          background: rgba(255,255,255,0.04) !important;
        }
        .home-live-channel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          border-color: var(--brand2) !important;
        }
        @media (max-width: 900px) {
          .live-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default LiveBroadcast;
