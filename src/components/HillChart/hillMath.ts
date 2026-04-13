export const SVG_WIDTH = 800;
export const SVG_HEIGHT = 300;
export const PADDING = 40;
export const CHART_WIDTH = SVG_WIDTH - 2 * PADDING;
export const CHART_HEIGHT = SVG_HEIGHT - 2 * PADDING;

export function positionToPoint(position: number): { x: number; y: number } {
  const x = PADDING + position * CHART_WIDTH;
  const y = (SVG_HEIGHT - PADDING) - Math.sin(position * Math.PI) * CHART_HEIGHT;
  return { x, y };
}

export function generateHillPath(): string {
  const steps = 100;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const pos = i / steps;
    const { x, y } = positionToPoint(pos);
    points.push(`${i === 0 ? 'M' : 'L'}${x},${y}`);
  }
  return points.join(' ');
}

export function svgXToPosition(svgX: number): number {
  const pos = (svgX - PADDING) / CHART_WIDTH;
  return Math.max(0, Math.min(1, pos));
}

export function getMousePositionInSvg(
  clientX: number,
  clientY: number,
  svgElement: SVGSVGElement
): { x: number; y: number } {
  const rect = svgElement.getBoundingClientRect();
  const scaleX = SVG_WIDTH / rect.width;
  const scaleY = SVG_HEIGHT / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}
