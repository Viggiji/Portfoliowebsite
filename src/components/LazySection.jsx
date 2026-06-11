import { useState, useEffect, useRef } from 'react';

/*
  LazySection — Mounts children only when the container is near the viewport.
  Unmounts when scrolled far away. Used to avoid running GPU-heavy components
  (like FaultyTerminal WebGL) when off-screen.

  Props:
    - rootMargin: IntersectionObserver margin (default: '200px' — mount 200px before visible)
    - keepMounted: if true, never unmounts once mounted (default: false)
    - fallback: what to render when not mounted (default: null)
*/
export default function LazySection({
  children,
  rootMargin = '200px',
  keepMounted = false,
  fallback = null,
  style = {},
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible) setHasBeenVisible(true);
      },
      { rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  const shouldRender = keepMounted ? hasBeenVisible : isVisible;

  return (
    <div ref={ref} className={className} style={style}>
      {shouldRender ? children : fallback}
    </div>
  );
}
