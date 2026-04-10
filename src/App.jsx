import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Preloader     from './components/Preloader';
import AudioPlayer   from './components/AudioPlayer';
import GitHubProjects from './components/GitHubProjects';
import SkillsSection from './components/SkillsSection';

/* ── React Bits Components ─────────────────────────────────────────── */
import DecryptedText from './components/reactbits/DecryptedText';
import FuzzyText     from './components/reactbits/FuzzyText';
import ScrambledText from './components/reactbits/ScrambledText';
import Dock          from './components/reactbits/Dock';
import BounceCards   from './components/reactbits/BounceCards';
import FaultyTerminal from './components/reactbits/FaultyTerminal';

import {
  PERSON, SOCIALS, EDUCATION, PRINCIPLES, NAV_ITEMS,
  GITHUB_USERNAME,
} from './data';

/* ── Animation helper ─────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: 'easeOut' } },
});

/* ── Section wrapper with lazy fade-in ───────────────────────────────── */
const Sec = ({ id, children, style = {} }) => (
  <section id={id} style={{ padding: '6rem 3rem', maxWidth: 1280, margin: '0 auto', ...style }}>
    {children}
  </section>
);

/* ── Section sub-heading (now with DecryptedText) ────────────────────── */
const Tag = ({ children, color = 'var(--secondary)' }) => (
  <span className="font-mono" style={{
    fontSize: '0.6rem', color, letterSpacing: '0.4em',
    textTransform: 'uppercase', display: 'block', marginBottom: 12,
  }}>
    <DecryptedText text={children} animateOn="view" speed={30} sequential={true} />
  </span>
);

const H2 = ({ children }) => (
  <h2 className="font-headline" style={{
    fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900,
    letterSpacing: '-0.04em', marginBottom: 40, lineHeight: 1,
  }}>
    <DecryptedText text={children} animateOn="view" speed={25} sequential={true} />
  </h2>
);

const Divider = () => (
  <div style={{ height: 1, background: 'var(--outline)', opacity: 0.12, margin: '0 3rem' }} />
);

/* ══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  /* ── Dock nav items ────────────────────────────── */
  const dockItems = NAV_ITEMS.map(({ id, label, icon }) => ({
    icon: <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: 'var(--on-surface)' }}>{icon}</span>,
    label: label,
    onClick: () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
  }));

  /* ── Social bounce card data ───────────────────── */
  const socialImages = SOCIALS.map(s => s.cardImage);
  const socialTransforms = [
    'rotate(10deg) translate(-120px)',
    'rotate(4deg) translate(-40px)',
    'rotate(-4deg) translate(40px)',
    'rotate(-10deg) translate(120px)',
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--on-surface)' }}>

      {/* ── Preloader ─────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <Preloader key="preloader" onComplete={() => setIsLoaded(true)} />
        )}
      </AnimatePresence>

      {/* ── Main (mounts AFTER preloader to fix blank screen) ── */}
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Global effects */}
          <div className="scanline" style={{ position: 'fixed', inset: 0, zIndex: 50, opacity: 0.18, pointerEvents: 'none' }} />
          <div className="grid-bg"  style={{ position: 'fixed', inset: 0, zIndex: 0,  opacity: 0.08, pointerEvents: 'none' }} />

          {/* BGM — starts right after user click */}
          <AudioPlayer />

          {/* ══════════════════════════════════════════
              // 01. ABOUT
          ══════════════════════════════════════════ */}
          <Sec id="about" style={{ paddingTop: '6rem' }}>
            <motion.div {...fadeUp(0.2)} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 360px',
              gap: 72,
              alignItems: 'center',
            }}>

              {/* Left — Identity */}
              <div>
                <Tag>Full-Stack Developer &amp; CS Student</Tag>

                {/* FuzzyText Name */}
                <div style={{ marginBottom: 32, marginLeft: -20 }}>
                  <FuzzyText
                    fontSize="clamp(3.5rem,9vw,7rem)"
                    fontWeight={900}
                    fontFamily="'Space Grotesk', sans-serif"
                    color="#8ff5ff"
                    enableHover={true}
                    baseIntensity={0.12}
                    hoverIntensity={0.55}
                    fuzzRange={25}
                  >
                    {PERSON.name}
                  </FuzzyText>
                </div>

                {/* ScrambledText Bio in code block */}
                <div style={{
                  maxWidth: 540, marginBottom: 36,
                  background: 'rgba(20,20,19,0.8)',
                  border: '1px solid rgba(72,72,71,0.2)',
                  borderRadius: 4, overflow: 'hidden',
                }}>
                  {/* Code block title bar */}
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(38,38,38,0.8)',
                    borderBottom: '1px solid rgba(72,72,71,0.15)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--error)' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--tertiary)' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(47,248,1,0.6)' }} />
                    </div>
                    <span className="font-mono" style={{ fontSize: '0.55rem', color: 'var(--on-surface-dim)', letterSpacing: '0.1em' }}>
                      about.bio
                    </span>
                  </div>
                  {/* Code block body */}
                  <div style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: 16 }}>
                    {/* Line numbers */}
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--on-surface-dim)', opacity: 0.3, lineHeight: 2.1, userSelect: 'none' }}>
                      {PERSON.bio.split(/(?<=\.)/).filter(s => s.trim()).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    {/* Bio text — each sentence on its own line, hover individually */}
                    <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--on-surface-dim)', lineHeight: 2.1 }}>
                      <ScrambledText
                        text={PERSON.bio}
                        per="line"
                        speed={30}
                        lineStyle={{
                          padding: '2px 6px',
                          borderRadius: 2,
                          transition: 'background 0.2s',
                        }}
                        className="bio-scramble"
                      />
                    </div>
                  </div>
                </div>

                {/* CTA buttons */}
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
                  <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer"
                    className="font-mono"
                    style={{
                      padding: '0.8rem 2rem', background: 'var(--primary)', color: 'var(--bg)',
                      fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                      textDecoration: 'none', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--secondary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                  >
                    // View GitHub
                  </a>
                  <a href="#contact" className="font-mono"
                    style={{
                      padding: '0.8rem 2rem', border: '1px solid var(--outline)',
                      color: 'var(--on-surface-dim)', fontSize: '0.65rem', letterSpacing: '0.18em',
                      textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--outline)'; e.currentTarget.style.color = 'var(--on-surface-dim)'; }}
                  >
                    // Initiate Contact
                  </a>
                </div>

                {/* Location + handle */}
                <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--on-surface-dim)', letterSpacing: '0.1em' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'middle', marginRight: 6 }}>location_on</span>
                  {PERSON.location}
                </div>
              </div>

              {/* Right — Photo */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  position: 'relative',
                  width: 340, height: 340,
                  borderRadius: '50%',
                  border: '2px solid var(--primary)',
                  boxShadow: '0 0 48px rgba(143,245,255,0.25), 0 0 96px rgba(143,245,255,0.08)',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  {/* Glass overlay effect */}
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 2, borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(143,245,255,0.08) 0%, transparent 50%, rgba(47,248,1,0.05) 100%)',
                    pointerEvents: 'none',
                  }} />
                  <div style={{
                    position: 'absolute', top: '-30%', left: '-30%', width: '60%', height: '60%',
                    background: 'radial-gradient(circle, rgba(143,245,255,0.12) 0%, transparent 70%)',
                    borderRadius: '50%', zIndex: 3, pointerEvents: 'none',
                    animation: 'glassShimmer 4s ease-in-out infinite',
                  }} />
                  <img
                    src={PERSON.photo}
                    alt={PERSON.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              </div>
            </motion.div>
          </Sec>

          <Divider />

          {/* ══════════════════════════════════════════
              // 02. SKILLS
          ══════════════════════════════════════════ */}
          <Sec id="skills">
            <motion.div {...fadeUp(0.1)}>
              <Tag>Installed_Modules</Tag>
              <H2>// 02. Skills</H2>
              <SkillsSection />
            </motion.div>
          </Sec>

          <Divider />

          {/* ══════════════════════════════════════════
              // 03. PROJECTS (with FaultyTerminal BG)
          ══════════════════════════════════════════ */}
          <section id="projects" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <FaultyTerminal
                tint="#39FF14"
                scale={1.5}
                brightness={0.08}
                scanlineIntensity={0.2}
                glitchAmount={1.5}
                mouseReact={true}
                mouseStrength={0.15}
                curvature={0.1}
              />
            </div>
            <div style={{ position: 'relative', zIndex: 1, padding: '6rem 3rem', maxWidth: 1280, margin: '0 auto' }}>
              <motion.div {...fadeUp(0.1)}>
                <Tag>Live from GitHub_API</Tag>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                  <H2>// 03. Projects</H2>
                  <a
                    href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                    target="_blank" rel="noreferrer"
                    className="font-mono"
                    style={{ fontSize: '0.65rem', color: 'var(--secondary)', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: 40 }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--secondary)'}
                  >
                    View all repos //
                  </a>
                </div>
                {/* Extra spacing to push CardSwap down */}
                <div style={{ marginTop: 80 }}>
                  <GitHubProjects />
                </div>
              </motion.div>
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════
              // 04. CONTACT (with FaultyTerminal BG)
          ══════════════════════════════════════════ */}
          <section id="contact" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <FaultyTerminal
                tint="#00F0FF"
                scale={1.5}
                brightness={0.06}
                scanlineIntensity={0.15}
                glitchAmount={1}
                mouseReact={true}
                mouseStrength={0.2}
                curvature={0.15}
              />
            </div>
            <div style={{ position: 'relative', zIndex: 1, padding: '6rem 3rem', maxWidth: 1280, margin: '0 auto' }}>
              <motion.div {...fadeUp(0.1)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

                {/* Left — Word-by-word scramble with themed colors */}
                <div>
                  <Tag>Initiate_Contact</Tag>
                  <H2>// 04. Signal</H2>
                  <div style={{ marginBottom: 40, maxWidth: 540 }}>
                    {/* Heading — per word scramble */}
                    <div className="font-headline" style={{
                      fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 900, letterSpacing: '-0.03em',
                      lineHeight: 1.3, marginBottom: 20,
                    }}>
                      <ScrambledText text="I am" per="word" speed={30} style={{ color: 'var(--on-surface)' }} />{' '}
                      <ScrambledText text="currently" per="word" speed={30} style={{ color: 'var(--on-surface-dim)' }} />{' '}
                      <ScrambledText text="open" per="word" speed={25} style={{ color: 'var(--secondary)' }} wordStyle={{ color: 'var(--secondary)' }} />{' '}
                      <ScrambledText text="for" per="word" speed={30} style={{ color: 'var(--on-surface)' }} />
                      <br />
                      <ScrambledText text="collaborations" per="word" speed={20} className="glow-primary" style={{ color: 'var(--primary)', fontStyle: 'italic' }} wordStyle={{ color: 'var(--primary)' }} />
                      <span style={{ color: 'var(--on-surface-dim)' }}> & </span>
                      <br />
                      <ScrambledText text="interesting" per="word" speed={25} style={{ color: 'var(--tertiary)' }} wordStyle={{ color: 'var(--tertiary)' }} />{' '}
                      <ScrambledText text="projects." per="word" speed={25} style={{ color: 'var(--tertiary)' }} wordStyle={{ color: 'var(--tertiary)' }} />
                    </div>
                    {/* Description — per word scramble */}
                    <ScrambledText
                      text="A CS student from Mathura who loves to build. If you have something cool in mind, let's talk."
                      per="word"
                      speed={20}
                      className="font-mono"
                      style={{
                        fontSize: '0.9rem', color: 'var(--on-surface-dim)',
                        lineHeight: 1.7, letterSpacing: '0.02em',
                      }}
                      wordStyle={{ color: 'var(--on-surface-dim)' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <a href={SOCIALS.find(s => s.label === 'Email')?.href || '#'} className="font-mono"
                      style={{
                        padding: '0.85rem 2.5rem', background: 'var(--primary)', color: 'var(--bg)',
                        fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                        textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s', width: 'fit-content',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--secondary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                    >
                      // Send Email
                    </a>
                  </div>
                </div>

                {/* Right — Social BounceCards */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <BounceCards
                    images={socialImages}
                    containerWidth={500}
                    containerHeight={300}
                    animationDelay={0.5}
                    animationStagger={0.08}
                    easeType="elastic.out(1, 0.8)"
                    transformStyles={socialTransforms}
                    enableHover={true}
                    onCardClick={(idx) => {
                      const social = SOCIALS[idx];
                      if (social) window.open(social.href, '_blank');
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════
              // 05. CHRONICLE — Principles & Academics
          ══════════════════════════════════════════ */}
          <Sec id="chronicle">
            <motion.div {...fadeUp(0.1)}>
              <Tag>Personal_Log</Tag>
              <H2>// 05. Chronicle</H2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Principles panel */}
                <div className="glass" style={{ padding: '2rem', borderRadius: 2 }}>
                  <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
                    <DecryptedText text="My_Principles" animateOn="view" speed={40} />
                  </div>
                  {PRINCIPLES.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < PRINCIPLES.length - 1 ? 10 : 0 }}>
                      <div style={{ width: 1, minHeight: 20, background: 'var(--secondary)', opacity: 0.5, marginTop: 3, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--on-surface-dim)', lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>

                {/* Education panel */}
                <div className="glass" style={{ padding: '2rem', borderRadius: 2 }}>
                  <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
                    <DecryptedText text="Academics_Log" animateOn="view" speed={40} />
                  </div>
                  {EDUCATION.map((edu, i) => (
                    <div key={i} style={{ marginBottom: i < EDUCATION.length - 1 ? 14 : 0 }}>
                      <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--on-surface-dim)', marginBottom: 2 }}>{edu.level}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{edu.school}</div>
                      <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Score: {edu.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </Sec>

          {/* ── Footer ──────────────────────────────── */}
          <footer style={{
            padding: '1.75rem 3rem',
            borderTop: '1px solid rgba(72,72,71,0.12)',
            background: 'var(--bg)',
            marginBottom: 80, /* space for dock */
          }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <span className="font-mono" style={{ fontSize: '0.58rem', color: 'var(--on-surface-dim)' }}>
                © 2025 {PERSON.name} // BUILT WITH REACT + VITE
              </span>
              <div className="font-mono" style={{ display: 'flex', gap: 24, fontSize: '0.58rem', color: 'var(--on-surface-dim)' }}>
                <span>LOCATION: {PERSON.location}</span>
                <span>STATUS: OPEN_TO_WORK</span>
              </div>
            </div>
          </footer>

          {/* ── Bottom Dock Navigation ──────────────── */}
          <div style={{
            position: 'fixed', bottom: 12, left: '50%', transform: 'translateX(-50%)',
            zIndex: 100,
          }}>
            <Dock
              items={dockItems}
              magnification={64}
              distance={180}
              panelHeight={56}
              baseItemSize={40}
              spring={{ mass: 0.1, stiffness: 170, damping: 14 }}
            />
          </div>

        </motion.div>
      )}
    </div>
  );
}
