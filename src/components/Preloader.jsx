import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from './reactbits/CountUp';
import GradientText from './reactbits/GradientText';

/* ── Tacky boot log data ──────────────────────────────────────────────── */
const BOOT_LOGS = [
  { type: 'SYS', msg: 'BREWING_MORNING_CHAI...',                        status: 'OK'        },
  { type: 'NET', msg: 'DEPLOYING VIBES TO_PRODUCTION...',               status: 'SYNC'      },
  { type: 'NET', msg: "CONNECTING TO MOM'S_WIFI...",                    status: 'CONNECTED' },
  { type: 'MOD', msg: 'DOWNLOADING MORE_RAM...',                        status: 'WAIT'      },
  { type: 'UI',  msg: 'LOADING_ANIME_BACKLOG...',                       status: 'LOAD'      },
  { type: 'SEC', msg: 'TUNING_GUITAR_STRINGS_VIRTUALLY...',             status: 'AUTH'      },
  { type: 'SYS', msg: 'OVERCLOCKING FOOTBALL_REFLEXES...',              status: 'PASS'      },
  { type: 'UI',  msg: 'RENDERING THE PORTFOLIO_UNIVERSE...',            status: 'DONE'      },
];

/* ── Random date generator ─────────────────────────────────────────── */
const randomDate = () => {
  const year = 2024 + Math.floor(Math.random() * 3);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${day}.${month}.${year}`;
};

/* 
  Preloader Flow:
  1. Boot logs appear over ~5s (8 logs × 650ms each)
  2. Progress fills to 100% (CountUp + GradientText)
  3. Shows "CLICK_ANYWHERE_TO_ENTER" prompt
  4. Waits for user click → calls onComplete
*/
const Preloader = ({ onComplete }) => {
  const [loading,  setLoading]  = useState(0);
  const [logs,     setLogs]     = useState([]);
  const [ready,    setReady]    = useState(false);
  const [exiting,  setExiting]  = useState(false);
  const logRef                  = useRef(0);
  const readyRef                = useRef(false);
  const datesRef                = useRef(BOOT_LOGS.map(() => randomDate()));

  /* Boot sequence — each log appears every 650ms, progress fills */
  useEffect(() => {
    const id = setInterval(() => {
      if (logRef.current < BOOT_LOGS.length) {
        const entry = BOOT_LOGS[logRef.current];
        setLogs(prev => [...prev, entry]);
        logRef.current += 1;
        setLoading(prev => Math.min(prev + 11, 88));
      } else {
        setLoading(prev => {
          const next = Math.min(prev + 4, 100);
          if (next === 100 && !readyRef.current) {
            readyRef.current = true;
            setTimeout(() => setReady(true), 500);
          }
          return next;
        });
      }
    }, 650);
    return () => clearInterval(id);
  }, []);

  /* Handle click anywhere to enter */
  const handleEnter = () => {
    if (!ready || exiting) return;
    setExiting(true);
    setTimeout(onComplete, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      onClick={handleEnter}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem', overflow: 'hidden',
        cursor: ready ? 'pointer' : 'default',
      }}
    >
      {/* Overlays */}
      <div className="scanline" style={{ position:'fixed', inset:0, zIndex:50, opacity:0.3 }} />
      <div className="grid-bg"  style={{ position:'fixed', inset:0, zIndex:0,  opacity:0.1 }} />

      {/* Logo */}
      <div style={{ position:'absolute', top:'3rem', left:'3rem', zIndex:10 }}>
        <span className="font-headline glow-primary"
          style={{ fontWeight:700, fontSize:'1.2rem', letterSpacing:'-0.05em', color:'var(--primary)' }}>
          VIGHNESH_GARG
        </span>
        <div style={{ height:1, width:48, background:'var(--secondary)', marginTop:8 }} />
      </div>

      {/* Terminal Window */}
      <div className="glass" style={{
        width:'100%', maxWidth:900, position:'relative', zIndex:10,
        borderRadius:4, overflow:'hidden',
        boxShadow:'0 0 80px rgba(0,240,255,0.05)',
      }}>
        {/* Title Bar */}
        <div style={{
          padding:'0.75rem 1.5rem',
          background:'rgba(38,38,38,0.9)',
          borderBottom:'1px solid rgba(72,72,71,0.15)',
          display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ display:'flex', gap:6 }}>
              <div style={{ width:10, height:10, borderRadius:9999, background:'var(--error)' }} />
              <div style={{ width:10, height:10, borderRadius:9999, background:'var(--tertiary)' }} />
              <div style={{ width:10, height:10, borderRadius:9999, background:'rgba(47,248,1,0.6)' }} />
            </div>
            <span className="font-mono"
              style={{ fontSize:'0.625rem', color:'var(--on-surface-dim)', letterSpacing:'0.15em', textTransform:'uppercase' }}>
              // SYSTEM_BOOT_SEQUENCE
            </span>
          </div>
          <span className="font-mono" style={{ fontSize:'0.625rem', color:'var(--primary)' }}>v1.0.4-STABLE</span>
        </div>

        {/* Terminal Body */}
        <div className="font-mono" style={{
          padding:'2rem', fontSize:'0.82rem', lineHeight:1.85,
          minHeight:380, display:'flex', flexDirection:'column', gap:4,
        }}>
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}
            >
              <span style={{ color:'var(--secondary)', opacity:0.6, flexShrink:0 }}>{datesRef.current[i]}</span>
              <span style={{ color:'var(--on-surface-dim)', flexShrink:0 }}>[{log.type}]</span>
              <span style={{ color:'var(--on-surface)', flex:1 }}>{log.msg}</span>
              <span style={{ color:'var(--secondary)', flexShrink:0 }}>[{log.status}]</span>
            </motion.div>
          ))}

          {/* Blinking cursor while loading */}
          {!ready && (
            <motion.span
              animate={{ opacity:[1,0,1] }}
              transition={{ repeat:Infinity, duration:0.85 }}
              style={{ color:'var(--primary)', marginTop:4 }}
            >▌</motion.span>
          )}

          <div style={{ flexGrow:1 }} />

          {/* Progress */}
          <div style={{ paddingTop:32, display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div>
                <div style={{ fontSize:'0.6rem', color:'var(--on-surface-dim)', textTransform:'uppercase', letterSpacing:'0.15em' }}>
                  System Load Intensity
                </div>
                <div className="font-headline" style={{ fontSize:'1.75rem', fontWeight:700, lineHeight:1.1 }}>
                  <GradientText
                    colors={['#8ff5ff', '#2ff801', '#65afff', '#8ff5ff']}
                    animationSpeed={3}
                    className="preloader-countup"
                  >
                    <CountUp from={0} to={loading} duration={0.5} /><span>%</span>
                  </GradientText>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'0.6rem', color:'var(--on-surface-dim)', textTransform:'uppercase', letterSpacing:'0.15em' }}>Location</div>
                <div className="font-mono" style={{ fontSize:'0.7rem', color:'var(--secondary)', marginTop:2 }}>
                  LAT_12.8237 // LONG_80.0444
                </div>
              </div>
            </div>

            {/* Bar */}
            <div style={{ position:'relative', width:'100%', height:6, background:'var(--surface-highest)', overflow:'hidden', borderRadius:2 }}>
              <motion.div
                animate={{ width:`${loading}%` }}
                transition={{ type:'tween', ease:'linear', duration:0.5 }}
                style={{
                  position:'absolute', top:0, left:0, height:'100%',
                  background:'var(--primary)',
                  boxShadow:'0 0 14px rgba(143,245,255,0.7)',
                }}
              />
              <div style={{ position:'absolute', top:0, left:0, height:'100%', width:'40%', background:'rgba(47,248,1,0.12)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── CLICK TO ENTER prompt (only when ready) ── */}
      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.5 }}
            style={{ marginTop:40, textAlign:'center', zIndex:10 }}
          >
            <motion.div
              className="font-mono"
              animate={{ opacity:[0.4, 1, 0.4] }}
              transition={{ repeat:Infinity, duration:1.8, ease:'easeInOut' }}
              style={{
                fontSize:'0.7rem', letterSpacing:'0.4em', textTransform:'uppercase',
                color:'var(--primary)', padding:'0.75rem 2rem',
                border:'1px solid rgba(143,245,255,0.3)',
                boxShadow:'0 0 20px rgba(143,245,255,0.1)',
              }}
            >
              ▶ CLICK_ANYWHERE_TO_ENTER ◀
            </motion.div>
            <div className="font-mono" style={{ fontSize:'0.55rem', color:'var(--on-surface-dim)', marginTop:10, letterSpacing:'0.15em' }}>
              IDENTITY_MANIFEST DECRYPTED — CLEARANCE LEVEL: ARCHITECT
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Meta */}
      <div style={{ marginTop:36, display:'flex', alignItems:'center', gap:40, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <motion.div
            animate={{ rotate:360 }}
            transition={{ repeat:Infinity, duration:2, ease:'linear' }}
            style={{ width:26, height:26, borderRadius:'50%', border:'2px solid rgba(143,245,255,0.15)', borderTopColor:'var(--primary)' }}
          />
          <div>
            <div className="font-mono" style={{ fontSize:'0.55rem', color:'var(--on-surface-dim)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Sync_Protocol</div>
            <div className="font-mono" style={{ fontSize:'0.6rem',  color:'var(--primary)' }}>ACTIVE</div>
          </div>
        </div>
        <div style={{ width:1, height:28, background:'rgba(72,72,71,0.3)' }} />
        <div>
          <div className="font-mono" style={{ fontSize:'0.55rem', color:'var(--on-surface-dim)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Environment</div>
          <div className="font-mono" style={{ fontSize:'0.6rem',  color:'var(--secondary)' }}>PRODUCTION_V3</div>
        </div>
      </div>

      {/* Corner Meta */}
      <div className="font-mono" style={{
        position:'absolute', bottom:40, right:48, textAlign:'right',
        fontSize:'0.58rem', color:'var(--on-surface-dim)', lineHeight:1.9, zIndex:10,
      }}>
        ARCHITECT_v1.0<br />
        STABLE_BUILD_2024<br />
        ENCRYPTED_VOICE_LINE_DISABLED
      </div>
    </motion.div>
  );
};

export default Preloader;
