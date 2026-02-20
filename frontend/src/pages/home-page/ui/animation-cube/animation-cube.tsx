import { useEffect, useRef, useState } from 'react';
import { Cube } from '../../../../components/icons/cube';
import './animation-cube.css';

export const AnimationCube = ({ position }: { position: 'left' | 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkVisibility = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setIsVisible(isVisible);
      }
    };

    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.animationPlayState = isVisible ? 'running' : 'paused';
    }
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className={`cube-wrapper ${position === 'left' ? 'cube-left' : 'cube-right'}`}
    >
      <Cube />
    </div>
  );
};
