import { useRef, useState, useCallback } from 'react';

/*
  ScrambledText — React Bits style
  
  Modes:
  - as="span" (default) → single text, scrambles on hover
  - per="word" → each word individually scrambles on hover
  - per="line" → each sentence (split by '.') individually scrambles on hover
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
      style={{ cursor: 'default', display: 'inline-block', ...style }}
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

/* ── Main export ── */
export default function ScrambledText({
  text,
  className = '',
  speed = 50,
  per = null, // null | 'word' | 'line'
  as: Tag = 'span',
  style = {},
  wordStyle = {},
  lineStyle = {},
  ...props
}) {
  if (per === 'word') {
    return <PerWordScramble text={text} speed={speed} style={style} className={className} wordStyle={wordStyle} {...props} />;
  }
  if (per === 'line') {
    return <PerLineScramble text={text} speed={speed} style={style} className={className} lineStyle={lineStyle} {...props} />;
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
      style={{ cursor: 'default', ...style }}
      onMouseEnter={scramble}
      {...props}
    >
      {displayText || text}
    </Tag>
  );
}

export { ScrambleWord, PerWordScramble, PerLineScramble };
