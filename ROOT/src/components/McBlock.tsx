import React from 'react';

/**
 * McBlock
 * -------
 * A solid isometric Minecraft-style cube built entirely from CSS.
 *
 * Instead of tilting a flat square in 3D (which reads as a broken/glitched
 * rectangle as soon as anything overlaps it), the cube is drawn in classic 2:1
 * dimetric projection inside a square box: three clipped faces, a dark rim and
 * a soft contact shadow. Because it is a *drawn* solid it stays readable at any
 * size and layers cleanly in front of other panels.
 *
 * Geometry lives in index.css (.mc-block / .mc-block--* / .mc-block__*).
 * The caller supplies the positioning utilities, e.g.
 *   <McBlock tone="gold" size={44} className="absolute -top-4 left-6" />
 */
export type McBlockTone = 'gold' | 'cyan' | 'blue';

interface McBlockProps {
  /** Face palette: amber ore, sky cyan or deep cobalt. */
  tone?: McBlockTone;
  /** Edge length of the cube box in pixels; the cube fills the square. */
  size?: number;
  /** Must carry the positioning utility (e.g. `absolute -top-4 left-6`). */
  className?: string;
  /** Inline overrides — most often `animationDelay` to stagger the idle bob. */
  style?: React.CSSProperties;
  /** Adds the idle bob; callers gate this behind perfMode === 'pc'. */
  float?: boolean;
}

export const McBlock: React.FC<McBlockProps> = ({
  tone = 'gold',
  size = 40,
  className = '',
  style,
  float = false,
}) => (
  <span
    aria-hidden="true"
    className={`mc-block mc-block--${tone}${float ? ' mc-block--float' : ''} ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, ...style }}
  >
    <span className="mc-block__shadow" />
    <span className="mc-block__face mc-block__top" />
    <span className="mc-block__face mc-block__left" />
    <span className="mc-block__face mc-block__right" />
  </span>
);
