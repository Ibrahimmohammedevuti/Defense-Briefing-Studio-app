import {
  COMPOSITION_FPS,
  MAX_DURATION_SECONDS,
  MIN_DURATION_SECONDS,
  type BroadcastStudioState,
  type ChartConfig,
  type ChartRow,
} from '../types/chart';

export function sanitizeNumericValue(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }
  return value;
}

export function calculateMaxValue(rows: readonly ChartRow[]): number {
  if (rows.length === 0) {
    return 0;
  }
  let max = 0;
  for (const row of rows) {
    const safe = sanitizeNumericValue(row.value);
    if (safe > max) {
      max = safe;
    }
  }
  return max;
}

export function calculateBarPercentage(value: number, maxValue: number): number {
  const safeVal = sanitizeNumericValue(value);
  if (!Number.isFinite(maxValue) || maxValue <= 0 || safeVal <= 0) {
    return 0;
  }
  const pct = (safeVal / maxValue) * 100;
  return Math.min(100, Math.max(0, pct));
}

export function calculateGridTicks(maxValue: number, segments = 4): number[] {
  if (!Number.isFinite(maxValue) || maxValue <= 0 || segments < 1) {
    return [0];
  }
  const ticks: number[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const raw = (maxValue * i) / segments;
    const rounded = maxValue >= 10 ? Math.round(raw) : Number(raw.toFixed(2));
    ticks.push(rounded);
  }
  return ticks;
}

export function formatNumericValue(value: number): string {
  const safe = sanitizeNumericValue(value);
  if (Number.isInteger(safe)) {
    return safe.toLocaleString('en-US');
  }
  return safe.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  });
}

export function formatAnimatedValue(targetValue: number, progress: number): string {
  const safeTarget = sanitizeNumericValue(targetValue);
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const current = safeTarget * clampedProgress;

  if (Number.isInteger(safeTarget)) {
    return Math.round(current).toLocaleString('en-US');
  }
  const decimals = Math.min(
    2,
    (safeTarget.toString().split('.')[1] ?? '').length,
  );
  return current.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function clampDurationSeconds(seconds: number): number {
  if (!Number.isFinite(seconds)) {
    return 8;
  }
  return Math.min(
    MAX_DURATION_SECONDS,
    Math.max(MIN_DURATION_SECONDS, Math.round(seconds)),
  );
}

export function secondsToFrames(seconds: number, fps = COMPOSITION_FPS): number {
  return clampDurationSeconds(seconds) * fps;
}

export function reorderRows<T>(
  items: readonly T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length ||
    fromIndex === toIndex
  ) {
    return [...items];
  }
  const copy = [...items];
  const [moved] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, moved);
  return copy;
}

export function getRowStaggerFrames(rowCount: number, totalFrames: number): number {
  if (rowCount <= 1) {
    return 0;
  }
  const maxEntryWindow = Math.max(24, Math.floor(totalFrames * 0.35));
  const idealStagger = 10;
  return Math.max(4, Math.min(idealStagger, Math.floor(maxEntryWindow / (rowCount - 1))));
}

export function splitExcerptBySubstring(
  paragraph: string,
  substring: string,
): { before: string; match: string; after: string; found: boolean } {
  const needle = substring;
  if (!needle) {
    return { before: paragraph, match: '', after: '', found: false };
  }
  const exactIndex = paragraph.indexOf(needle);
  if (exactIndex !== -1) {
    return {
      before: paragraph.slice(0, exactIndex),
      match: paragraph.slice(exactIndex, exactIndex + needle.length),
      after: paragraph.slice(exactIndex + needle.length),
      found: true,
    };
  }
  const lowerIndex = paragraph.toLowerCase().indexOf(needle.toLowerCase());
  if (lowerIndex !== -1) {
    return {
      before: paragraph.slice(0, lowerIndex),
      match: paragraph.slice(lowerIndex, lowerIndex + needle.length),
      after: paragraph.slice(lowerIndex + needle.length),
      found: true,
    };
  }
  return { before: paragraph, match: '', after: '', found: false };
}

export function calculateRangeRadius(
  distance: number,
  maxScaleDistance: number,
  maxRadiusPx: number,
): number {
  if (
    !Number.isFinite(distance) ||
    !Number.isFinite(maxScaleDistance) ||
    !Number.isFinite(maxRadiusPx) ||
    distance <= 0 ||
    maxScaleDistance <= 0 ||
    maxRadiusPx <= 0
  ) {
    return 0;
  }
  const ratio = Math.min(1, Math.max(0, distance / maxScaleDistance));
  return ratio * maxRadiusPx;
}

export function clampPercent(value: number, min = 0, max = 100): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

export function resolveNumericInputOnBlur(
  rawText: string,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
    fallbackValue?: number;
  } = {},
): number {
  const { min, max, integer = false, fallbackValue } = options;
  const trimmed = rawText.trim();
  let num = trimmed === '' ? Number.NaN : Number(trimmed);

  if (!Number.isFinite(num)) {
    num = fallbackValue ?? min ?? 0;
  }
  if (integer) {
    num = Math.round(num);
  }
  if (min !== undefined && num < min) {
    num = min;
  }
  if (max !== undefined && num > max) {
    num = max;
  }
  return num;
}

export function validateChartForExport(config: ChartConfig): string | null {
  if (!config.title.trim()) {
    return 'Chart title is required before exporting.';
  }
  if (config.rows.length === 0) {
    return 'Add at least one data row before exporting.';
  }
  const hasBlankLabel = config.rows.some((row) => !row.label.trim());
  if (hasBlankLabel) {
    return 'All data rows must have a non-empty label.';
  }
  const maxVal = calculateMaxValue(config.rows);
  if (maxVal <= 0) {
    return 'At least one data row must have a numeric value greater than 0.';
  }
  return null;
}

export function validateStudioForExport(state: BroadcastStudioState): string | null {
  switch (state.mode) {
    case 'bar-chart':
      return validateChartForExport(state.barChart);
    case 'document-excerpt':
      if (!state.documentExcerpt.paragraph.trim()) {
        return 'Excerpt paragraph is required before exporting.';
      }
      return null;
    case 'side-by-side':
      if (!state.sideBySide.title.trim()) {
        return 'Main title is required before exporting.';
      }
      return null;
    case 'hardware-cutaway':
      if (!state.hardwareCutaway.title.trim()) {
        return 'Cutaway title is required before exporting.';
      }
      return null;
    case 'kill-chain':
      if (!state.killChain.title.trim()) {
        return 'Schematic title is required before exporting.';
      }
      if (state.killChain.nodes.length < 3 || state.killChain.nodes.length > 4) {
        return 'Kill-Chain schematic requires 3 or 4 nodes.';
      }
      return null;
    case 'lower-third':
      if (!state.lowerThird.headline.trim()) {
        return 'Main stat or headline is required before exporting.';
      }
      return null;
    case 'delay-timeline':
      if (!state.delayTimeline.title.trim()) {
        return 'Timeline title is required before exporting.';
      }
      if (state.delayTimeline.milestones.length === 0) {
        return 'Add at least one chronological milestone before exporting.';
      }
      return null;
    case 'range-ring':
      if (!state.rangeRing.title.trim()) {
        return 'Visualizer title is required before exporting.';
      }
      if (state.rangeRing.maxScaleDistance <= 0) {
        return 'Max scale distance must be greater than 0.';
      }
      if (state.rangeRing.arcs.length === 0) {
        return 'Add at least one range arc before exporting.';
      }
      return null;
    case 'end-screen':
      if (!state.endScreen.channelTitle.trim()) {
        return 'Channel title is required before exporting.';
      }
      return null;
    default:
      return null;
  }
}
