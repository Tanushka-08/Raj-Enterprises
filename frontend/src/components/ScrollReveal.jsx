import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const OFFSETS = {
  up: 'translate3d(0, 44px, 0)',
  down: 'translate3d(0, -44px, 0)',
  left: 'translate3d(52px, 0, 0)',
  right: 'translate3d(-52px, 0, 0)',
  none: 'translate3d(0, 0, 0) scale(0.94)',
  zoom: 'translate3d(0, 0, 0) scale(0.86)',
  flip: 'perspective(1000px) rotateX(-32deg)'
};

const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.75,
  className = '',
  as: Tag = 'div',
  once = true
}) => {
  const [ref, isVisible] = useScrollReveal();

  // Horizontal offsets are clamped on narrow screens: a 52px sideways push on a
  // full-width block would otherwise stick out past the viewport and give the
  // whole page a horizontal scrollbar.
  const narrow = typeof window !== 'undefined' && window.innerWidth < 768;
  const offset = narrow ? OFFSETS.up : OFFSETS[direction] || OFFSETS.up;

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0,0,0) scale(1) rotateX(0deg)' : offset,
    transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    willChange: isVisible ? 'auto' : 'opacity, transform'
  };

  return (
    <Tag ref={ref} style={style} className={className}>
      {children}
    </Tag>
  );
};

export default ScrollReveal;