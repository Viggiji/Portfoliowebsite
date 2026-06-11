import { useRef, useState, useCallback, useEffect } from 'react';

/*
  ScrambledText — React Bits style
  
  Modes:
  - as="span" (default) → single text, scrambles on hover
  - per="word" → each word individually scrambles on hover
  - per="line" → each sentence (split by '.') individually scrambles on hover
  - per="proximity" → characters near the mouse cursor scramble on pointermove
*/

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

function useWordScramble(text, speed = 50) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);
  const hasRevealed = useRef(false);

  const scramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let currentIndex = 0;
    const textLength = text.length;

    intervalRef.current = setInterval(() => {
      if (currentIndex <= textLength) {
        const revealed = text.slice(0, currentIndex);
        const scrambled = Array.from({ length: textLength - currentIndex }, () =>
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        ).join('');
        setDisplayText(revealed + scrambled);
        currentIndex++;
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDisplayText(text);
      }
    }, speed);
  }, [text, speed]);

  const reveal = useCallback(() => {
    if (!hasRevealed.current) {
      hasRevealed.current = true;
      scramble();
    }
  }, [scramble]);

  return { displayText, scramble, reveal };
}

/* ── Single word that scrambles on hover ── */
function ScrambleWord({ word, speed = 40, style = {}, className = '' }) {
  const { displayText, scramble, reveal } = useWordScramble(word, speed);
  const ref = useRef(null);

  // Reveal on first view
  const observerRef = useRef(null);
  const [observed, setObserved] = useState(false);

  const setRef = useCallback((node) => {
    ref.current = node;
    if (node && !observed) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            reveal();
            setObserved(true);
            observerRef.current?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observerRef.current.observe(node);
    }
  }, [observed, reveal]);

  return (
    <span
      ref={setRef}
      className={className}
      style={{ cursor: 'none', display: 'inline-block', ...style }}
      onMouseEnter={scramble}
    >
      {displayText}
    </span>
  );
}

/* ── Per-word scramble: each word scrambles individually on hover ── */
function PerWordScramble({ text, speed = 40, style = {}, className = '', wordStyle = {} }) {
  const words = text.split(' ');

  return (
    <span className={className} style={style}>
      {words.map((word, i) => (
        <span key={i}>
          <ScrambleWord word={word} speed={speed} style={wordStyle} />
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

/* ── Per-line scramble: each sentence scrambles individually on hover ── */
function PerLineScramble({ text, speed = 35, style = {}, className = '', lineStyle = {} }) {
  // Split by period, preserving the period
  const sentences = text.split(/(?<=\.)/).map(s => s.trim()).filter(Boolean);

  return (
    <div className={className} style={style}>
      {sentences.map((line, i) => (
        <div key={i} style={{ marginBottom: i < sentences.length - 1 ? 4 : 0, ...lineStyle }}>
          <ScrambleWord word={line} speed={speed} style={{ display: 'inline' }} />
        </div>
      ))}
    </div>
  );
}

/* ── Proximity scramble: chars near cursor scramble in realtime ── */
/* PERF: Uses cached offsets instead of per-char getBoundingClientRect every frame */
function PerProximityScramble({
  text,
  radius = 100,
  speed = 40,
  scrambleChars = '.:!<>-_\\/[]{}—=+*^?#',
  style = {},
  className = '',
}) {
  const rootRef = useRef(null);
  const charRefs = useRef([]);
  const [chars, setChars] = useState(() => text.split(''));
  const originalChars = useRef(text.split(''));
  const scrambleTimers = useRef({});

  // Cached character positions (relative to root)
  const charOffsets = useRef([]); // { cx, cy } relative to viewport — recalculated on scroll/resize
  const lastCalcTime = useRef(0);

  // Reveal state
  const [observed, setObserved] = useState(false);
  const hasRevealed = useRef(false);

  // Throttle ref
  const lastMoveTime = useRef(0);

  useEffect(() => {
    originalChars.current = text.split('');
    setChars(text.split(''));
  }, [text]);

  // Recalculate cached positions
  const recalcPositions = useCallback(() => {
    const spans = charRefs.current;
    const offsets = [];
    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      if (span) {
        const rect = span.getBoundingClientRect();
        offsets[i] = { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
      }
    }
    charOffsets.current = offsets;
    lastCalcTime.current = Date.now();
  }, []);

  // Recalc on scroll and resize (passive, debounced)
  useEffect(() => {
    let timeout;
    const debounceRecalc = () => {
      clearTimeout(timeout);
      timeout = setTimeout(recalcPositions, 100);
    };

    window.addEventListener('scroll', debounceRecalc, { passive: true });
    window.addEventListener('resize', debounceRecalc, { passive: true });
    return () => {
      window.removeEventListener('scroll', debounceRecalc);
      window.removeEventListener('resize', debounceRecalc);
      clearTimeout(timeout);
    };
  }, [recalcPositions]);

  // Initial reveal animation
  const setRootRef = useCallback((node) => {
    rootRef.current = node;
    if (node && !observed) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasRevealed.current) {
            hasRevealed.current = true;
            setObserved(true);
            // Initial scramble-in
            const orig = originalChars.current;
            let step = 0;
            const interval = setInterval(() => {
              if (step <= orig.length) {
                setChars(
                  orig.map((c, i) =>
                    i < step
                      ? c
                      : c === ' '
                      ? ' '
                      : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
                  )
                );
                step++;
              } else {
                clearInterval(interval);
                setChars([...orig]);
                // Calculate positions after reveal
                requestAnimationFrame(recalcPositions);
              }
            }, speed);
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(node);
    }
  }, [observed, speed, scrambleChars, recalcPositions]);

  // Throttled pointer move handler — 50ms throttle
  const handlePointerMove = useCallback(
    (e) => {
      const now = Date.now();
      if (now - lastMoveTime.current < 50) return; // 50ms throttle
      lastMoveTime.current = now;

      if (!rootRef.current) return;
      const orig = originalChars.current;
      const offsets = charOffsets.current;

      // Recalc if stale (> 2s since last calc)
      if (now - lastCalcTime.current > 2000) {
        recalcPositions();
      }

      if (offsets.length === 0) return;

      const newChars = [...orig];
      let changed = false;

      for (let i = 0; i < offsets.length; i++) {
        const off = offsets[i];
        if (!off || orig[i] === ' ') continue;

        const dx = e.clientX - off.cx;
        const dy = e.clientY - off.cy;
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          newChars[i] = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          changed = true;

          // Resolve timer
          if (scrambleTimers.current[i]) clearTimeout(scrambleTimers.current[i]);
          const resolveDelay = Math.floor((dist / radius) * 600) + 100;
          scrambleTimers.current[i] = setTimeout(() => {
            setChars((prev) => {
              const copy = [...prev];
              copy[i] = orig[i];
              return copy;
            });
            delete scrambleTimers.current[i];
          }, resolveDelay);
        }
      }

      if (changed) setChars(newChars);
    },
    [radius, scrambleChars, recalcPositions]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(scrambleTimers.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <span
      ref={setRootRef}
      className={className}
      style={{ cursor: 'none', ...style }}
      onPointerMove={handlePointerMove}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => { charRefs.current[i] = el; }}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

/* ── Main export ── */
export default function ScrambledText({
  text,
  className = '',
  speed = 50,
  per = null, // null | 'word' | 'line' | 'proximity'
  as: Tag = 'span',
  style = {},
  wordStyle = {},
  lineStyle = {},
  radius = 100,
  scrambleChars = '.:!<>-_\\/[]{}—=+*^?#',
  ...props
}) {
  if (per === 'word') {
    return <PerWordScramble text={text} speed={speed} style={style} className={className} wordStyle={wordStyle} {...props} />;
  }
  if (per === 'line') {
    return <PerLineScramble text={text} speed={speed} style={style} className={className} lineStyle={lineStyle} {...props} />;
  }
  if (per === 'proximity') {
    return <PerProximityScramble text={text} speed={speed} radius={radius} scrambleChars={scrambleChars} style={style} className={className} {...props} />;
  }

  // Default: single block scramble on hover
  const { displayText, scramble, reveal } = useWordScramble(text, speed);
  const ref = useRef(null);
  const [observed, setObserved] = useState(false);

  const setNodeRef = useCallback((node) => {
    ref.current = node;
    if (node && !observed) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            reveal();
            setObserved(true);
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(node);
    }
  }, [observed, reveal]);

  return (
    <Tag
      ref={setNodeRef}
      className={className}
      style={{ cursor: 'none', ...style }}
      onMouseEnter={scramble}
      {...props}
    >
      {displayText || text}
    </Tag>
  );
}

export { ScrambleWord, PerWordScramble, PerLineScramble, PerProximityScramble };

