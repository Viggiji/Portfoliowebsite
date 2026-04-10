import React from 'react';
import { motion } from 'framer-motion';

/* ── Project Detail Screen — from Stitch "Tech Showcase" screen ── */
const ProjectDetail = ({ project, onClose }) => {
  const { detail } = project;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(14,14,14,0.96)',
        backdropFilter: 'blur(6px)',
        overflowY: 'auto',
        padding: '6rem 3rem 4rem',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 1100, margin: '0 auto' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="font-mono"
          style={{
            position: 'fixed', top: '2rem', right: '3rem',
            background: 'none', border: '1px solid var(--outline)',
            color: 'var(--on-surface-dim)', fontSize: '0.65rem',
            letterSpacing: '0.15em', padding: '0.5rem 1rem',
            cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='var(--outline)'; e.currentTarget.style.color='var(--on-surface-dim)'; }}
        >✕ Close</button>

        {/* Nav mini */}
        <div className="font-mono" style={{ fontSize:'0.6rem', color:'var(--on-surface-dim)', letterSpacing:'0.15em', marginBottom:40 }}>
          // PROJECT_ID: {detail.projectId}
        </div>

        {/* Title Row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:48, flexWrap:'wrap', gap:24 }}>
          <h1 className="font-headline"
            style={{ fontSize:'clamp(3rem,7vw,5.5rem)', fontWeight:900, letterSpacing:'-0.05em', lineHeight:0.9 }}>
            {detail.title}
          </h1>
          <div style={{ display:'flex', gap:12 }}>
            <a href="#" className="font-mono"
              style={{ padding:'0.75rem 1.5rem', background:'var(--primary)', color:'var(--bg)',
                       fontWeight:700, fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase',
                       textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
              <span className="material-symbols-outlined" style={{ fontSize:'0.9rem' }}>open_in_new</span>
              Live Demo
            </a>
            <a href="#" className="font-mono"
              style={{ padding:'0.75rem 1.5rem', border:'1px solid var(--outline)', color:'var(--on-surface-dim)',
                       fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase',
                       textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
              <span className="material-symbols-outlined" style={{ fontSize:'0.9rem' }}>code</span>
              View Code
            </a>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:48, alignItems:'start' }}>

          {/* Left Column */}
          <div>
            {/* Mission Briefing */}
            <section style={{ marginBottom:48 }}>
              <h2 className="font-mono"
                style={{ fontSize:'0.65rem', color:'var(--secondary)', letterSpacing:'0.3em', textTransform:'uppercase', marginBottom:20 }}>
                Mission Briefing
              </h2>
              {detail.mission.split('\n\n').map((para, i) => (
                <p key={i} style={{ color:'var(--on-surface-dim)', lineHeight:1.8, marginBottom:16, fontSize:'0.95rem' }}>
                  {para}
                </p>
              ))}
            </section>

            {/* Dev Log */}
            <section>
              <h2 className="font-mono"
                style={{ fontSize:'0.65rem', color:'var(--secondary)', letterSpacing:'0.3em', textTransform:'uppercase', marginBottom:20 }}>
                Technical_Development_Log.log
              </h2>
              <div className="glass" style={{ padding:'1.75rem', borderRadius:2 }}>
                {detail.devLog.map((entry, i) => (
                  <div key={i} style={{ marginBottom: i < detail.devLog.length-1 ? 28 : 0 }}>
                    <div className="font-mono"
                      style={{ fontSize:'0.7rem', color:'var(--primary)', marginBottom:6 }}>
                      // Entry: {entry.date} | CHALLENGE: {entry.challenge}
                    </div>
                    <p style={{ fontSize:'0.875rem', color:'var(--on-surface-dim)', lineHeight:1.7 }}>
                      {entry.entry}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Tech Stack */}
            <div className="glass" style={{ padding:'1.75rem', borderRadius:2 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <span className="material-symbols-outlined" style={{ fontSize:'1rem', color:'var(--on-surface-dim)' }}>memory</span>
                <span className="font-mono" style={{ fontSize:'0.6rem', color:'var(--on-surface-dim)', letterSpacing:'0.15em', textTransform:'uppercase' }}>Tech Stack</span>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {detail.techStack.map(tech => (
                  <span key={tech} className="font-mono"
                    style={{ padding:'0.4rem 0.8rem', border:'1px solid var(--outline)', fontSize:'0.65rem',
                             color:'var(--on-surface-dim)', letterSpacing:'0.05em', borderRadius:2 }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Meta */}
            <div className="glass" style={{ padding:'1.75rem', borderRadius:2 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <span className="material-symbols-outlined" style={{ fontSize:'1rem', color:'var(--on-surface-dim)' }}>analytics</span>
                <span className="font-mono" style={{ fontSize:'0.6rem', color:'var(--on-surface-dim)', letterSpacing:'0.15em', textTransform:'uppercase' }}>Performance</span>
              </div>
              {[
                { k:'Architecture Type', v: detail.meta.archType  },
                { k:'Client/Origin',     v: detail.meta.client     },
                { k:'Last Update',       v: detail.meta.updated    },
              ].map(({ k, v }) => (
                <div key={k} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:'0.7rem', color:'var(--on-surface-dim)' }}>{k}</div>
                  <div className="font-mono" style={{ fontSize:'0.8rem', color:'var(--primary)', marginTop:2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetail;
