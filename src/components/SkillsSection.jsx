import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS } from '../data';

const TAG_COLORS = {
  tech:     { border: 'var(--primary)',     text: 'var(--primary)',     bg: 'rgba(143,245,255,0.04)' },
  learning: { border: 'var(--secondary)',   text: 'var(--secondary)',   bg: 'rgba(47,248,1,0.04)'   },
  soft:     { border: 'var(--tertiary)',    text: 'var(--tertiary)',    bg: 'rgba(101,175,255,0.04)' },
  hobbies:  { border: 'var(--outline-dim)', text: 'var(--on-surface-dim)', bg: 'rgba(72,72,71,0.06)' },
};

/* ── Individual card that cycles through skills one at a time ── */
const SkillCard = ({ category, data }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const colors = TAG_COLORS[category];
  const total = data.items.length;

  const next = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % total);
  };
  const prev = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + total) % total);
  };

  return (
    <div
      className="glass"
      style={{
        padding: '1.5rem',
        borderRadius: 12,
        flex: '1 1 0',
        minWidth: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderTop: `2px solid ${colors.border}`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Category label */}
      <div className="font-mono" style={{
        fontSize: '0.6rem', color: colors.text,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        marginBottom: 20,
      }}>
        {data.label}
      </div>

      {/* Skill display — single item with slide animation */}
      <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              textAlign: 'center',
              width: '100%',
            }}
          >
            <div className="font-mono" style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--on-surface)',
              letterSpacing: '0.04em',
            }}>
              {data.items[currentIdx]}
            </div>
            <div style={{
              width: 40, height: 2,
              background: colors.border,
              margin: '12px auto 0',
              opacity: 0.6,
            }} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows + dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
        <button
          onClick={prev}
          className="font-mono"
          style={{
            width: 28, height: 28,
            background: 'rgba(72,72,71,0.2)',
            border: '1px solid rgba(72,72,71,0.3)',
            color: 'var(--on-surface-dim)',
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(72,72,71,0.3)'; e.currentTarget.style.color = 'var(--on-surface-dim)'; }}
        >
          ‹
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {data.items.map((_, i) => (
            <div
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
              style={{
                width: i === currentIdx ? 16 : 6,
                height: 6,
                borderRadius: 3,
                background: i === currentIdx ? colors.border : 'rgba(72,72,71,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="font-mono"
          style={{
            width: 28, height: 28,
            background: 'rgba(72,72,71,0.2)',
            border: '1px solid rgba(72,72,71,0.3)',
            color: 'var(--on-surface-dim)',
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(72,72,71,0.3)'; e.currentTarget.style.color = 'var(--on-surface-dim)'; }}
        >
          ›
        </button>
      </div>

      {/* Counter */}
      <div className="font-mono" style={{ textAlign: 'center', marginTop: 10, fontSize: '0.5rem', color: 'var(--on-surface-dim)', letterSpacing: '0.1em' }}>
        {currentIdx + 1} / {total}
      </div>
    </div>
  );
};

const SKILL_ENTRIES = [
  { category: 'tech',     data: SKILLS.tech     },
  { category: 'learning', data: SKILLS.learning  },
  { category: 'soft',     data: SKILLS.soft      },
  { category: 'hobbies',  data: SKILLS.hobbies   },
];

const SkillsSection = () => (
  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
    {SKILL_ENTRIES.map(({ category, data }) => (
      <SkillCard key={category} category={category} data={data} />
    ))}
  </div>
);

export default SkillsSection;
