import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Counter from './reactbits/Counter';
import { PLAYLIST } from '../data';

/**
 * AudioPlayer
 * Plays songs from PLAYLIST via hidden YouTube iframes.
 * Features: slide-out panel, Counter volume control, next track with loop.
 *
 * Autoplay strategy:
 *  - Default playing=false (UI is honest before player confirms)
 *  - onStateChange syncs React state with actual YT player state
 *  - On first user interaction anywhere on the page, attempt playVideo()
 *    (covers the "click to enter" on Preloader — autoplay policy satisfied)
 *  - Shows "▶ CLICK TO PLAY" hint if autoplay was blocked
 */
const AudioPlayer = () => {
  const iframeRef        = useRef(null);
  const playerRef        = useRef(null);
  const interactedRef    = useRef(false);   // has user clicked anywhere yet?
  const [playing,    setPlaying]    = useState(false); // honest default
  const [ready,      setReady]      = useState(false);
  const [panelOpen,  setPanelOpen]  = useState(false);
  const [volume,     setVolume]     = useState(25);
  const [trackIdx,   setTrackIdx]   = useState(0);
  const [visible,    setVisible]    = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const currentTrack = PLAYLIST[trackIdx];

  /* ── Load YouTube iFrame API once ─────────────────── */
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => initPlayer();
    return () => { window.onYouTubeIframeAPIReady = null; };
  }, []);

  /* ── Show control after delay ──────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  /* ── Update volume when it changes ────────────────── */
  useEffect(() => {
    if (playerRef.current && ready) {
      playerRef.current.setVolume(volume);
    }
  }, [volume, ready]);

  /* ── First-interaction listener ────────────────────── */
  /* If autoplay is blocked, the very first click anywhere on the
     page (including the "CLICK TO ENTER" on Preloader) triggers playback */
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (interactedRef.current) return;
      interactedRef.current = true;
      if (playerRef.current && ready) {
        try {
          playerRef.current.playVideo();
        } catch (_) { /* ignore */ }
      }
      document.removeEventListener('click', handleFirstInteraction, true);
    };
    document.addEventListener('click', handleFirstInteraction, true);
    return () => document.removeEventListener('click', handleFirstInteraction, true);
  }, [ready]);

  /* ── Init YouTube Player ───────────────────────────── */
  function initPlayer() {
    playerRef.current = new window.YT.Player(iframeRef.current, {
      videoId: PLAYLIST[0].id,
      playerVars: {
        autoplay: 1, loop: 1, playlist: PLAYLIST[0].id,
        controls: 0, modestbranding: 1, rel: 0, fs: 0, disablekb: 1,
      },
      events: {
        onReady: (e) => {
          e.target.setVolume(25);
          e.target.playVideo();
          setReady(true);
          /* Check after 800ms if it actually started — if not, autoplay was blocked */
          setTimeout(() => {
            try {
              const state = e.target.getPlayerState();
              if (state !== window.YT.PlayerState.PLAYING) {
                setAutoplayBlocked(true);
                setPlaying(false);
              }
            } catch (_) { /* player may not be ready */ }
          }, 800);
        },
        onStateChange: (e) => {
          /* Sync React state with actual player state */
          if (e.data === window.YT.PlayerState.PLAYING) {
            setPlaying(true);
            setAutoplayBlocked(false);
          } else if (
            e.data === window.YT.PlayerState.PAUSED ||
            e.data === window.YT.PlayerState.BUFFERING
          ) {
            /* Don't set false on BUFFERING — that's transient */
            if (e.data === window.YT.PlayerState.PAUSED) setPlaying(false);
          } else if (e.data === window.YT.PlayerState.ENDED) {
            nextTrack();
          }
        },
      },
    });
  }

  const toggle = () => {
    if (!playerRef.current || !ready) return;
    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
      setAutoplayBlocked(false);
    }
    /* Don't toggle state here — let onStateChange sync it */
  };

  const nextTrack = () => {
    const nextIdx = (trackIdx + 1) % PLAYLIST.length;
    setTrackIdx(nextIdx);
    if (playerRef.current && ready) {
      playerRef.current.loadVideoById({ videoId: PLAYLIST[nextIdx].id, startSeconds: 0 });
      playerRef.current.setVolume(volume);
      /* playing state will be set by onStateChange when it starts */
    }
  };

  const adjustVolume = (delta) => {
    setVolume(prev => Math.max(0, Math.min(100, prev + delta)));
  };

  return (
    <>
      {/* Hidden YouTube iframe */}
      <div style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1, overflow: 'hidden', pointerEvents: 'none' }}>
        <div ref={iframeRef} />
      </div>

      {/* ── Slide-out Panel ── */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="audio-panel"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed', bottom: '5rem', left: '1.5rem', zIndex: 999,
              width: 240, padding: '1.5rem',
              background: 'rgba(14,14,14,0.92)',
              border: '1px solid rgba(72,72,71,0.2)',
              borderRadius: 8,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 0 40px rgba(143,245,255,0.06)',
            }}
          >
            {/* Track info */}
            <div className="font-mono" style={{ fontSize: '0.55rem', color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
              ♪ NOW PLAYING
            </div>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--on-surface)', marginBottom: 4 }}>
              {currentTrack.title}
            </div>
            <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--on-surface-dim)', marginBottom: 20 }}>
              {currentTrack.artist}
            </div>

            {/* Autoplay blocked hint */}
            {autoplayBlocked && (
              <div className="font-mono" style={{
                fontSize: '0.55rem', color: 'var(--tertiary)', letterSpacing: '0.1em',
                marginBottom: 12, padding: '0.4rem 0.6rem',
                border: '1px solid rgba(101,175,255,0.2)', borderRadius: 2,
              }}>
                ▶ Click PLAY to start music
              </div>
            )}

            {/* Playback controls */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
              <button
                onClick={toggle}
                className="font-mono"
                style={{
                  flex: 1, padding: '0.5rem', background: playing ? 'rgba(143,245,255,0.1)' : 'rgba(72,72,71,0.2)',
                  border: `1px solid ${playing ? 'var(--primary)' : 'var(--outline)'}`,
                  color: playing ? 'var(--primary)' : 'var(--on-surface-dim)',
                  fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s', borderRadius: 2,
                }}
              >
                {playing ? '❚❚ PAUSE' : '▶ PLAY'}
              </button>
              <button
                onClick={nextTrack}
                className="font-mono"
                style={{
                  padding: '0.5rem 0.75rem', background: 'rgba(72,72,71,0.2)',
                  border: '1px solid var(--outline)', color: 'var(--on-surface-dim)',
                  fontSize: '0.65rem', cursor: 'pointer', transition: 'all 0.2s', borderRadius: 2,
                }}
                title="Next Track"
              >
                ⏭
              </button>
            </div>

            {/* Volume Counter */}
            <div className="font-mono" style={{ fontSize: '0.55rem', color: 'var(--on-surface-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
              VOL_LEVEL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => adjustVolume(-5)}
                style={{
                  width: 28, height: 28, background: 'rgba(72,72,71,0.3)',
                  border: '1px solid var(--outline)', color: 'var(--on-surface)',
                  fontSize: '1rem', cursor: 'pointer', borderRadius: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >−</button>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Counter
                  value={volume}
                  fontSize={24}
                  padding={4}
                  gap={2}
                  borderRadius={4}
                  horizontalPadding={6}
                  textColor="var(--primary)"
                  fontWeight="700"
                  gradientHeight={8}
                  gradientFrom="rgba(14,14,14,0.92)"
                  gradientTo="transparent"
                />
              </div>
              <button
                onClick={() => adjustVolume(5)}
                style={{
                  width: 28, height: 28, background: 'rgba(72,72,71,0.3)',
                  border: '1px solid var(--outline)', color: 'var(--on-surface)',
                  fontSize: '1rem', cursor: 'pointer', borderRadius: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >+</button>
            </div>

            {/* Track count */}
            <div className="font-mono" style={{ fontSize: '0.5rem', color: 'var(--on-surface-dim)', marginTop: 16, textAlign: 'center', letterSpacing: '0.1em' }}>
              TRACK {trackIdx + 1} / {PLAYLIST.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating toggle button ── */}
      <AnimatePresence>
        {visible && (
          <motion.button
            key="music-btn"
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setPanelOpen(p => !p)}
            title={autoplayBlocked ? 'Click to play music' : 'Music Panel'}
            style={{
              position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 999,
              width: 44, height: 44, borderRadius: '50%',
              background: panelOpen ? 'rgba(143,245,255,0.15)' : 'rgba(72,72,71,0.3)',
              border: `1px solid ${panelOpen ? 'var(--primary)' : autoplayBlocked ? 'var(--tertiary)' : 'var(--outline)'}`,
              color: panelOpen ? 'var(--primary)' : autoplayBlocked ? 'var(--tertiary)' : 'var(--on-surface-dim)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s',
            }}
          >
            {/* Pulsing ring — only when actually playing */}
            {playing && (
              <motion.span
                style={{
                  position: 'absolute', inset: -4, borderRadius: '50%',
                  border: '1px solid var(--primary)', opacity: 0,
                }}
                animate={{ opacity: [0, 0.5, 0], scale: [1, 1.4, 1.4] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
              />
            )}
            {playing ? '♪' : autoplayBlocked ? '▶' : '♩'}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default AudioPlayer;
