import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import './Carousel.css';

export default function Carousel({
  items = [],
  baseWidth = 300,
  autoPlay = false,
  autoPlayInterval = 3000,
  pauseOnHover = true,
  className = '',
  round = false,
}) {
  const trackRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const autoPlayRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!trackRef.current) return;
    const container = trackRef.current.parentElement;
    const track = trackRef.current;
    setContainerWidth(container.offsetWidth);
    setTrackWidth(track.scrollWidth);
  }, [items]);

  const maxDrag = Math.max(0, trackWidth - containerWidth);

  const handleDragEnd = useCallback((_, info) => {
    setIsDragging(false);
    const currentX = x.get();
    const velocity = info.velocity.x;
    let targetX = currentX + velocity * 0.2;
    targetX = Math.max(-maxDrag, Math.min(0, targetX));
    controls.start({ x: targetX, transition: { type: 'spring', stiffness: 300, damping: 30 } });
  }, [maxDrag, x, controls]);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;
    let direction = -1;
    const step = baseWidth + 16;

    const tick = () => {
      const currentX = x.get();
      let nextX = currentX + direction * step;
      if (nextX < -maxDrag) { nextX = -maxDrag; direction = 1; }
      else if (nextX > 0) { nextX = 0; direction = -1; }
      controls.start({ x: nextX, transition: { type: 'spring', stiffness: 200, damping: 25 } });
    };

    autoPlayRef.current = setInterval(tick, autoPlayInterval);
    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay, autoPlayInterval, baseWidth, items.length, maxDrag, x, controls]);

  const handleMouseEnter = () => { if (pauseOnHover && autoPlayRef.current) clearInterval(autoPlayRef.current); };
  const handleMouseLeave = () => {
    if (pauseOnHover && autoPlay) {
      autoPlayRef.current = setInterval(() => {
        const currentX = x.get();
        let nextX = currentX - (baseWidth + 16);
        if (nextX < -maxDrag) nextX = 0;
        controls.start({ x: nextX, transition: { type: 'spring', stiffness: 200, damping: 25 } });
      }, autoPlayInterval);
    }
  };

  return (
    <div
      className={`carousel-container ${round ? 'round' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={trackRef}
        className="carousel-track"
        style={{ x, gap: 16 }}
        drag="x"
        dragConstraints={{ left: -maxDrag, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={`carousel-item ${round ? 'round' : ''}`}
            style={{
              width: baseWidth,
              minWidth: baseWidth,
            }}
          >
            {round ? (
              <div className="carousel-item-header round">
                {item.icon && (
                  <div className="carousel-icon-container">
                    <span className="carousel-icon">{item.icon}</span>
                  </div>
                )}
              </div>
            ) : (
              item.icon && (
                <div className="carousel-item-header">
                  <div className="carousel-icon-container">
                    <span className="carousel-icon">{item.icon}</span>
                  </div>
                </div>
              )
            )}
            <div className="carousel-item-content">
              {item.title && <div className="carousel-item-title">{item.title}</div>}
              {item.description && <div className="carousel-item-description">{item.description}</div>}
              {item.content}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
