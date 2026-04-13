import { describe, it, expect } from 'vitest';
import {
  positionToPoint,
  generateHillPath,
  svgXToPosition,
  SVG_WIDTH,
  SVG_HEIGHT,
  PADDING,
  CHART_WIDTH,
} from './hillMath';

describe('positionToPoint', () => {
  it('maps position 0 to the left baseline', () => {
    const { x, y } = positionToPoint(0);
    expect(x).toBe(PADDING);
    expect(y).toBe(SVG_HEIGHT - PADDING);
  });

  it('maps position 1 to the right baseline', () => {
    const { x, y } = positionToPoint(1);
    expect(x).toBe(PADDING + CHART_WIDTH);
    expect(y).toBeCloseTo(SVG_HEIGHT - PADDING, 5);
  });

  it('maps position 0.5 to the top of the hill', () => {
    const { x, y } = positionToPoint(0.5);
    expect(x).toBe(PADDING + CHART_WIDTH / 2);
    expect(y).toBe(PADDING);
  });

  it('maps position 0.25 to a point on the left slope', () => {
    const { x, y } = positionToPoint(0.25);
    expect(x).toBe(PADDING + CHART_WIDTH * 0.25);
    expect(y).toBeGreaterThan(PADDING);
    expect(y).toBeLessThan(SVG_HEIGHT - PADDING);
  });
});

describe('svgXToPosition', () => {
  it('converts left edge to 0', () => {
    expect(svgXToPosition(PADDING)).toBe(0);
  });

  it('converts right edge to 1', () => {
    expect(svgXToPosition(PADDING + CHART_WIDTH)).toBe(1);
  });

  it('converts midpoint to 0.5', () => {
    expect(svgXToPosition(PADDING + CHART_WIDTH / 2)).toBeCloseTo(0.5);
  });

  it('clamps values below 0', () => {
    expect(svgXToPosition(0)).toBe(0);
    expect(svgXToPosition(-100)).toBe(0);
  });

  it('clamps values above 1', () => {
    expect(svgXToPosition(SVG_WIDTH + 100)).toBe(1);
  });
});

describe('generateHillPath', () => {
  it('returns a valid SVG path string', () => {
    const path = generateHillPath();
    expect(path).toMatch(/^M[\d.]+,[\d.]+/);
    expect(path).toContain('L');
  });

  it('starts with M (moveto)', () => {
    const path = generateHillPath();
    expect(path[0]).toBe('M');
  });
});

describe('positionToPoint and svgXToPosition roundtrip', () => {
  it('roundtrips through position -> x -> position', () => {
    for (const pos of [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]) {
      const { x } = positionToPoint(pos);
      const result = svgXToPosition(x);
      expect(result).toBeCloseTo(pos, 10);
    }
  });
});
