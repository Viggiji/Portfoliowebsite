import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Preloader     from './components/Preloader';
import AudioPlayer   from './components/AudioPlayer';
import GitHubProjects from './components/GitHubProjects';
import SkillsSection from './components/SkillsSection';
import CustomCursor  from './components/CustomCursor';
import LazySection   from './components/LazySection';
/* ── React Bits Components ─────────────────────────────────────────── */
import DecryptedText from './components/reactbits/DecryptedText';
import FuzzyText     from './components/reactbits/FuzzyText';
import ScrambledText from './components/reactbits/ScrambledText';
import Dock          from './components/reactbits/Dock';
import BounceCards   from './components/reactbits/BounceCards';
import DotField      from './components/reactbits/DotField';

import {
  PERSON, SOCIALS, EDUCATION, PRINCIPLES, NAV_ITEMS,
  GITHUB_USERNAME,
} from './data';

/* ── Animation helpers ─────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: 'easeOut' } },
});

/* ── Staggered whileInView wrapper ────────────────────────────────────── */
const FadeInSection = ({ children, delay = 0, className = '', style = {} }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

/* ── Section wrapper ───────────────────────────────────────────────── */
const Sec = ({ id, children, style = {} }) => (
  <section id={id} style={{ padding: '6rem 3rem', maxWidth: 1280, margin: '0 auto', ...style }}>
    {children}
  </section>
);

/* ── Section sub-heading ─────────────────────────────────────────── */
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
  const [activeSection, setActiveSection] = useState('about');

  /* ── Active section tracking via IntersectionObserver ── */
  useEffect(() => {
    if (!isLoaded) return;

    const sectionIds = ['about', 'skills', 'projects', 'chronicle', 'contact'];
    const observers = [];

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const obs = new IntersectionObserver(handleIntersect, {
          rootMargin: '-30% 0px -30% 0px',
          threshold: 0,
        });
        obs.observe(el);
        observers.push(obs);
      }
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [isLoaded]);

  /* ── Dock nav items ────────────────────────── */
  const dockItems = NAV_ITEMS.map(({ id, label, icon }) => ({
    icon: (
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: '1.2rem',
          color: activeSection === id ? 'var(--primary)' : 'var(--on-surface)',
          transition: 'color 0.3s',
        }}
      >
        {icon}
      </span>
    ),
    label: label,
    className: activeSection === id ? 'dock-item-active' : '',
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

      {/* ── Main (mounts AFTER preloader) ── */}
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Custom Cursor — brackets mode everywhere */}
          <CustomCursor mode="brackets" />

          {/* Global effects */}
          <div className="scanline" style={{ position: 'fixed', inset: 0, zIndex: 50, opacity: 0.18, pointerEvents: 'none' }} />
          <div className="grid-bg"  style={{ position: 'fixed', inset: 0, zIndex: 0,  opacity: 0.08, pointerEvents: 'none' }} />

          {/* BGM */}
          <AudioPlayer />

          {/* ══════════════════════════════════════════
              // 01. ABOUT
          ══════════════════════════════════════════ */}
          <Sec id="about" style={{ paddingTop: '6rem' }}>
            <motion.div {...fadeUp(0.2)} className="about-grid">

              {/* Left — Identity */}
              <div>
                <FadeInSection delay={0.1}>
                  <Tag>Full-Stack Developer &amp; CS Student</Tag>
                </FadeInSection>

                {/* FuzzyText Name */}
                <FadeInSection delay={0.2}>
                  <div className="hero-name" style={{ marginBottom: 32, marginLeft: -20 }}>
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
                </FadeInSection>

                {/* Bio in code block */}
                <FadeInSection delay={0.3}>
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
                      <div className="font-mono" style={{
                        fontSize: '0.75rem', color: 'var(--on-surface-dim)', opacity: 0.3,
                        lineHeight: '1.9rem', userSelect: 'none', textAlign: 'right', minWidth: 18,
                      }}>
                        {PERSON.bio.map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>
                      {/* Bio lines — proximity scramble */}
                      <div className="font-mono" style={{ fontSize: '0.82rem', lineHeight: '1.9rem' }}>
                        {PERSON.bio.map((line, i) => (
                          <div key={i} style={{
                            color: i === 0 ? 'var(--secondary)' : 'var(--on-surface-dim)',
                            opacity: i === 0 ? 0.6 : 1,
                            fontStyle: i === 0 ? 'italic' : 'normal',
                          }}>
                            <ScrambledText
                              text={line}
                              per="proximity"
                              radius={80}
                              speed={25}
                              scrambleChars=".:"
                              className="bio-scramble"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeInSection>

                {/* CTA buttons */}
                <FadeInSection delay={0.4}>
                  <div className="cta-row" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
                    <a
                      href={`https://github.com/${GITHUB_USERNAME}`}
                      target="_blank" rel="noreferrer"
                      className="font-mono btn-primary"
                      style={{
                        padding: '0.8rem 2rem',
                        fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                        textDecoration: 'none', borderRadius: 2,
                      }}
                    >
                      // View GitHub
                    </a>
                    <a
                      href="#contact"
                      className="font-mono btn-outline"
                      style={{
                        padding: '0.8rem 2rem',
                        fontSize: '0.65rem', letterSpacing: '0.18em',
                        textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2,
                      }}
                    >
                      // Initiate Contact
                    </a>
                  </div>
                </FadeInSection>

                {/* Location */}
                <FadeInSection delay={0.5}>
                  <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--on-surface-dim)', letterSpacing: '0.1em' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'middle', marginRight: 6 }}>location_on</span>
                    {PERSON.location}
                  </div>
                </FadeInSection>
              </div>

              {/* Right — Photo */}
              <FadeInSection delay={0.3} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  className="profile-photo"
                  style={{
                    position: 'relative',
                    width: 340, height: 340,
                    borderRadius: '50%',
                    border: '2px solid var(--primary)',
                    boxShadow: '0 0 48px rgba(143,245,255,0.25), 0 0 96px rgba(143,245,255,0.08)',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
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
              </FadeInSection>
            </motion.div>
          </Sec>

          <Divider />

          {/* ══════════════════════════════════════════
              // 02. SKILLS
          ══════════════════════════════════════════ */}
          <Sec id="skills">
            <FadeInSection>
              <Tag>Installed_Modules</Tag>
              <H2>// 02. Skills</H2>
              <SkillsSection />
            </FadeInSection>
          </Sec>

          <Divider />

          {/* ══════════════════════════════════════════
              // 03. PROJECTS (with FaultyTerminal BG — lazy loaded)
          ══════════════════════════════════════════ */}
          <section id="projects" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="section-inner">
              <FadeInSection>
                <Tag>Live from GitHub_API</Tag>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                  <H2>// 03. Projects</H2>
                  <a
                    href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                    target="_blank" rel="noreferrer"
                    className="font-mono link-secondary"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 40 }}
                  >
                    View all repos //
                  </a>
                </div>
                <div style={{ marginTop: 80 }}>
                  <GitHubProjects />
                </div>
              </FadeInSection>
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════
              // 04. CHRONICLE (with DotField BG)
          ══════════════════════════════════════════ */}
          <section id="chronicle" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg)' }}>
            <LazySection
              rootMargin="300px"
              keepMounted={true}
              style={{ position: 'absolute', inset: 0, zIndex: 0 }}
            >
              <DotField
                dotRadius={1.5}
                dotSpacing={14}
                cursorRadius={500}
                cursorForce={0.1}
                bulgeOnly={true}
                bulgeStrength={67}
                glowRadius={160}
                sparkle={true}
                waveAmplitude={0}
                gradientFrom="rgba(47,248,1, 0.2)"
                gradientTo="rgba(143,245,255, 0.1)"
                glowColor="rgba(32,32,31, 0.5)"
              />
            </LazySection>
            <div className="section-inner">
            <FadeInSection>
              <Tag>Personal_Log</Tag>
              <H2>// 04. Chronicle</H2>

              <div className="chronicle-grid">
                {/* Principles panel */}
                <FadeInSection delay={0.1}>
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
                </FadeInSection>

                {/* Education panel */}
                <FadeInSection delay={0.2}>
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
                </FadeInSection>
              </div>
            </FadeInSection>
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════
              // 05. CONTACT (with FaultyTerminal BG — lazy loaded)
          ══════════════════════════════════════════ */}
          <section id="contact" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="section-inner">
              <FadeInSection>
                <motion.div {...fadeUp(0.1)} className="contact-grid">

                  {/* Left */}
                  <div>
                    <Tag>Initiate_Contact</Tag>
                    <H2>// 05. Signal</H2>
                    <div style={{ marginBottom: 40, maxWidth: 540 }}>
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
                      <a
                        href={SOCIALS.find(s => s.label === 'Email')?.href || '#'}
                        className="font-mono btn-primary"
                        style={{
                          padding: '0.85rem 2.5rem',
                          fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                          textDecoration: 'none', display: 'inline-block', width: 'fit-content',
                          borderRadius: 2,
                        }}
                      >
                        // Send Email
                      </a>
                    </div>
                  </div>

                  {/* Right — Social BounceCards */}
                  <div className="bounce-cards-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
              </FadeInSection>
            </div>
          </section>

          {/* ── Footer ──────────────────────────────── */}
          <footer style={{
            padding: '1.75rem 3rem',
            borderTop: '1px solid rgba(72,72,71,0.12)',
            background: 'var(--bg)',
            marginBottom: 80,
          }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <span className="font-mono" style={{ fontSize: '0.58rem', color: 'var(--on-surface-dim)' }}>
                © {new Date().getFullYear()} {PERSON.name} // BUILT WITH REACT + VITE
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
