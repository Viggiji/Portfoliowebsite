import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/*
  CustomCursor — 2 modes:
  - "glow"     → Glowing dot with trail (Preloader) — uses DOM refs, no setState per frame
  - "brackets" → < > code brackets with context-aware tags (Main page everywhere)

  Hidden on touch devices.
*/

const SPRING_CONFIG = { damping: 25, stiffness: 300, mass: 0.5 };
const TRAIL_COUNT = 5;

/* ── Tag detection map ── */
function getHoverTag(el) {
  if (!el) return { tag: '', color: 'var(--primary)' };

  // Check for data-lang on project cards
  const langEl = el.closest('[data-lang]');
  if (langEl) return { tag: langEl.dataset.lang, color: 'var(--secondary)' };

  // Check element type
  if (el.closest('a'))       return { tag: 'link',  color: 'var(--primary)' };
  if (el.closest('button'))  return { tag: 'btn',   color: 'var(--secondary)' };
  if (el.closest('img'))     return { tag: 'img',   color: 'var(--tertiary)' };
  if (el.closest('pre, code, .font-mono')) return { tag: 'code', color: '#c084fc' };
  if (el.closest('.card, .glass, .dock-item')) return { tag: 'div', color: 'var(--primary)' };
  if (el.closest('input, textarea, select')) return { tag: '|', color: 'var(--primary)' };

  // Check if it's a text node area (paragraphs, spans with text)
  const textEls = ['P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'LI', 'DIV'];
  if (textEls.includes(el.tagName) && el.textContent?.trim().length > 0) {
    // Only for elements that are primarily text (not containers with many children)
    if (el.children.length <= 2) return { tag: '', color: '' };
  }

  return { tag: '', color: '' };
}

export default function CustomCursor({ mode = 'brackets' }) {
  const [isTouch, setIsTouch] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverInfo, setHoverInfo] = useState({ tag: '', color: 'var(--primary)' });

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, SPRING_CONFIG);
  const springY = useSpring(cursorY, SPRING_CONFIG);

  // DOM refs for glow trail (no setState per frame!)
  const trailDotsRef = useRef([]);
  const trailPositions = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );
  const trailRafRef = useRef(null);

  // Detect touch device
  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    setIsTouch(mq.matches);
    const handler = (e) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Track mouse position
  useEffect(() => {
    if (isTouch) return;

    const handleMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
    };
  }, [isTouch, cursorX, cursorY, isVisible]);

  // Glow trail — direct DOM manipulation, zero React re-renders
  useEffect(() => {
    if (isTouch || mode !== 'glow') return;

    const animate = () => {
      const currentX = cursorX.get();
      const currentY = cursorY.get();
      const pos = trailPositions.current;

      // Shift positions
      for (let i = pos.length - 1; i > 0; i--) {
        pos[i].x = pos[i - 1].x;
        pos[i].y = pos[i - 1].y;
      }
      pos[0].x = currentX;
      pos[0].y = currentY;

      // Update DOM directly — no setState!
      trailDotsRef.current.forEach((dot, i) => {
        if (dot) {
          dot.style.transform = `translate(${pos[i].x - 4}px, ${pos[i].y - 4}px)`;
        }
      });

      trailRafRef.current = requestAnimationFrame(animate);
    };

    trailRafRef.current = requestAnimationFrame(animate);
    return () => {
      if (trailRafRef.current) cancelAnimationFrame(trailRafRef.current);
    };
  }, [isTouch, mode, cursorX, cursorY]);

  // Detect hover targets for brackets mode
  useEffect(() => {
    if (isTouch || mode !== 'brackets') return;

    const handleOver = (e) => {
      const info = getHoverTag(e.target);
      setHoverInfo(info);
    };

    document.addEventListener('mouseover', handleOver, { passive: true });
    return () => document.removeEventListener('mouseover', handleOver);
  }, [isTouch, mode]);

  if (isTouch || !isVisible) return null;

  /* ── Glow Mode ── */
  if (mode === 'glow') {
    return (
      <div className="custom-cursor-layer" style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
        {/* Trail dots — positioned via refs, not state */}
        {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { trailDotsRef.current[i] = el; }}
            style={{
              position: 'fixed',
              left: 0, top: 0,
              width: 8, height: 8,
              borderRadius: '50%',
              background: 'var(--primary)',
              opacity: 0.3 - i * 0.05,
              boxShadow: `0 0 ${8 - i}px rgba(143,245,255,0.5)`,
              pointerEvents: 'none',
              willChange: 'transform',
            }}
          />
        ))}
        {/* Main dot */}
        <motion.div
          style={{
            position: 'fixed',
            left: 0, top: 0,
            x: springX, y: springY,
            translateX: '-50%', translateY: '-50%',
            width: 12, height: 12,
            borderRadius: '50%',
            background: 'var(--primary)',
            boxShadow: '0 0 20px rgba(143,245,255,0.6), 0 0 40px rgba(143,245,255,0.2)',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  /* ── Brackets Mode (enriched) ── */
  if (mode === 'brackets') {
    const { tag, color } = hoverInfo;
    const isTextCursor = tag === '|';
    const hasTag = tag && !isTextCursor;

    // Text cursor mode — thin blinking line
    if (isTextCursor) {
      return (
        <div className="custom-cursor-layer" style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
          <motion.div
            style={{
              position: 'fixed', left: 0, top: 0,
              x: springX, y: springY,
              translateX: '-50%', translateY: '-50%',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
              style={{
                width: 2, height: 20,
                background: 'var(--primary)',
                boxShadow: '0 0 6px rgba(143,245,255,0.5)',
                borderRadius: 1,
              }}
            />
          </motion.div>
        </div>
      );
    }

    return (
      <div className="custom-cursor-layer" style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
        <motion.div
          style={{
            position: 'fixed', left: 0, top: 0,
            x: springX, y: springY,
            translateX: '-50%', translateY: '-50%',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: hasTag ? 1 : 3,
            fontFamily: "'Fira Code', monospace",
            fontSize: '0.75rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          {/* Left bracket */}
          <motion.span
            animate={{
              color: hasTag ? (color || 'var(--primary)') : 'var(--primary)',
              x: hasTag ? -3 : 0,
              textShadow: hasTag
                ? '0 0 12px rgba(143,245,255,0.6)'
                : '0 0 6px rgba(143,245,255,0.3)',
            }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          >
            &lt;
          </motion.span>

          {/* Tag text */}
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{
              opacity: hasTag ? 1 : 0,
              width: hasTag ? 'auto' : 0,
            }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{
              overflow: 'hidden',
              color: color || 'var(--secondary)',
              fontSize: '0.6rem',
              letterSpacing: '0.05em',
              textShadow: `0 0 8px ${color === 'var(--secondary)' ? 'rgba(47,248,1,0.5)' : 'rgba(143,245,255,0.4)'}`,
            }}
          >
            {tag}{hasTag && ' /'}
          </motion.span>

          {/* Right bracket */}
          <motion.span
            animate={{
              color: hasTag ? (color || 'var(--primary)') : 'var(--primary)',
              x: hasTag ? 3 : 0,
              textShadow: hasTag
                ? '0 0 12px rgba(143,245,255,0.6)'
                : '0 0 6px rgba(143,245,255,0.3)',
            }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          >
            &gt;
          </motion.span>
        </motion.div>

        {/* Subtle dot beneath brackets when idle */}
        {!hasTag && (
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            style={{
              position: 'fixed', left: 0, top: 0,
              x: cursorX, y: cursorY,
              translateX: '-50%', translateY: '14px',
              width: 3, height: 3,
              borderRadius: '50%',
              background: 'var(--primary)',
              pointerEvents: 'none',
              boxShadow: '0 0 4px rgba(143,245,255,0.4)',
            }}
          />
        )}
      </div>
    );
  }

  return null;
}
