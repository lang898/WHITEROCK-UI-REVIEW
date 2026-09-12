import { useEffect, useRef } from 'react';
import { Package } from 'lucide-react';
import { colors } from '../data';
import { ColorSwatchImage } from './ColorSwatchImage';
import type { ColorItem } from '../types';

interface MaterialWallProps {
  onSelectColor: (color: ColorItem) => void;
  onAddSample: (color: ColorItem) => void;
}

export function MaterialWall({ onSelectColor, onAddSample }: MaterialWallProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const repeatedColors = [...colors, ...colors];

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const frame = window.requestAnimationFrame(() => {
      rail.scrollLeft = rail.scrollWidth / 4;
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const normalizeLoop = () => {
    const rail = railRef.current;
    if (!rail) return;
    const half = rail.scrollWidth / 2;
    if (half <= 0) return;
    if (rail.scrollLeft >= half) rail.scrollLeft -= half;
    if (rail.scrollLeft <= 0) rail.scrollLeft += half;
  };

  return (
    <section className="wr-material-wall-section" aria-labelledby="material-wall-title">
      <div className="wr-material-wall-heading">
        <span className="wr-eyebrow">Material library</span>
        <h2 id="material-wall-title">Move through the surface palette.</h2>
        <p>Scroll, drag, or hover to explore material directions. Open a surface for details or add it directly to the sample box.</p>
      </div>

      <div
        ref={railRef}
        className="wr-material-wall-v2"
        onScroll={normalizeLoop}
        onWheel={(event) => {
          const rail = railRef.current;
          if (!rail) return;
          if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            rail.scrollLeft += event.deltaY;
            event.preventDefault();
          }
        }}
        onPointerDown={(event) => {
          const rail = railRef.current;
          if (!rail || event.button !== 0) return;
          dragRef.current = { active: true, startX: event.clientX, scrollLeft: rail.scrollLeft, moved: false };
        }}
        onPointerMove={(event) => {
          const rail = railRef.current;
          if (!rail || !dragRef.current.active) return;
          const distance = event.clientX - dragRef.current.startX;
          if (Math.abs(distance) > 4) dragRef.current.moved = true;
          if (dragRef.current.moved && !rail.hasPointerCapture(event.pointerId)) rail.setPointerCapture(event.pointerId);
          rail.scrollLeft = dragRef.current.scrollLeft - distance;
        }}
        onPointerUp={(event) => {
          const rail = railRef.current;
          dragRef.current.active = false;
          if (rail?.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => { dragRef.current.active = false; }}
        onClickCapture={(event) => {
          if (!dragRef.current.moved) return;
          event.preventDefault();
          event.stopPropagation();
          dragRef.current.moved = false;
        }}
      >
        {repeatedColors.map((color, index) => (
          <article className="wr-material-wall-card" key={`${color.slug}-${index}`}>
            <button className="wr-material-wall-card__media" type="button" onClick={() => onSelectColor(color)}>
              <ColorSwatchImage color={color} loading="lazy" draggable={false} />
              <span className="wr-material-wall-card__shade" />
              <span className="wr-material-wall-card__label">
                <small>{color.material}</small>
                <strong>{color.name}</strong>
              </span>
            </button>
            <button className="wr-material-wall-card__sample" type="button" onClick={() => onAddSample(color)} aria-label={`Add ${color.name} to sample box`}>
              <Package aria-hidden="true" /> Sample
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
