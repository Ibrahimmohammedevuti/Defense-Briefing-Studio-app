import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CHART_CONFIG, DEFAULT_STUDIO_STATE } from '../types/chart';
import {
  calculateBarPercentage,
  calculateGridTicks,
  calculateMaxValue,
  calculateRangeRadius,
  clampDurationSeconds,
  clampPercent,
  formatAnimatedValue,
  formatNumericValue,
  getRowStaggerFrames,
  reorderRows,
  secondsToFrames,
  splitExcerptBySubstring,
  validateChartForExport,
  validateStudioForExport,
} from './chartMath';

test('calculateMaxValue returns maximum numeric value across rows', () => {
  assert.equal(calculateMaxValue(DEFAULT_CHART_CONFIG.rows), 1000);
  assert.equal(calculateMaxValue([]), 0);
});

test('calculateBarPercentage computes exact mathematical proportion', () => {
  assert.equal(calculateBarPercentage(1000, 1000), 100);
  assert.equal(calculateBarPercentage(250, 1000), 25);
  assert.equal(calculateBarPercentage(32, 1000), 3.2);
  assert.equal(calculateBarPercentage(0, 1000), 0);
  assert.equal(calculateBarPercentage(50, 0), 0);
  assert.equal(calculateBarPercentage(-10, 100), 0);
});

test('calculateGridTicks produces evenly spaced ticks from 0 to maxValue', () => {
  assert.deepEqual(calculateGridTicks(1000, 4), [0, 250, 500, 750, 1000]);
  assert.deepEqual(calculateGridTicks(0, 4), [0]);
});

test('formatNumericValue and formatAnimatedValue format numbers with commas and precision', () => {
  assert.equal(formatNumericValue(1000), '1,000');
  assert.equal(formatNumericValue(32), '32');
  assert.equal(formatAnimatedValue(1000, 0.5), '500');
  assert.equal(formatAnimatedValue(1000, 1), '1,000');
  assert.equal(formatAnimatedValue(12.5, 0.5), '6.3');
});

test('clampDurationSeconds and secondsToFrames enforce valid bounds', () => {
  assert.equal(clampDurationSeconds(8), 8);
  assert.equal(clampDurationSeconds(1), 3);
  assert.equal(clampDurationSeconds(99), 30);
  assert.equal(clampDurationSeconds(Number.NaN), 8);
  assert.equal(secondsToFrames(8, 30), 240);
});

test('reorderRows moves items cleanly and handles out-of-bounds indices safely', () => {
  const arr = ['a', 'b', 'c'];
  assert.deepEqual(reorderRows(arr, 0, 2), ['b', 'c', 'a']);
  assert.deepEqual(reorderRows(arr, 2, 1), ['a', 'c', 'b']);
  assert.deepEqual(reorderRows(arr, -1, 1), ['a', 'b', 'c']);
  assert.deepEqual(reorderRows(arr, 0, 5), ['a', 'b', 'c']);
});

test('getRowStaggerFrames scales stagger within entry window', () => {
  assert.equal(getRowStaggerFrames(1, 240), 0);
  assert.equal(getRowStaggerFrames(3, 240), 10);
  assert.ok(getRowStaggerFrames(12, 90) >= 4);
});

test('splitExcerptBySubstring finds exact and case-insensitive substrings cleanly', () => {
  const exact = splitExcerptBySubstring('Hello world today', 'world');
  assert.deepEqual(exact, {
    before: 'Hello ',
    match: 'world',
    after: ' today',
    found: true,
  });

  const ci = splitExcerptBySubstring('Delay of 14 Months Expected', '14 months');
  assert.deepEqual(ci, {
    before: 'Delay of ',
    match: '14 Months',
    after: ' Expected',
    found: true,
  });

  const missing = splitExcerptBySubstring('Hello world', 'absent');
  assert.equal(missing.found, false);
});

test('calculateRangeRadius computes proportional pixel radius and clamps cleanly', () => {
  assert.equal(calculateRangeRadius(400, 2000, 1000), 200);
  assert.equal(calculateRangeRadius(1500, 2000, 1000), 750);
  assert.equal(calculateRangeRadius(2500, 2000, 1000), 1000);
  assert.equal(calculateRangeRadius(0, 2000, 1000), 0);
  assert.equal(calculateRangeRadius(500, 0, 1000), 0);
});

test('clampPercent enforces bounds', () => {
  assert.equal(clampPercent(50), 50);
  assert.equal(clampPercent(-5), 0);
  assert.equal(clampPercent(120), 100);
});

test('validateChartForExport and validateStudioForExport validate all modes', () => {
  assert.equal(validateChartForExport(DEFAULT_CHART_CONFIG), null);
  assert.equal(validateStudioForExport(DEFAULT_STUDIO_STATE), null);
  assert.equal(
    validateStudioForExport({ ...DEFAULT_STUDIO_STATE, mode: 'document-excerpt' }),
    null,
  );
  assert.equal(
    validateStudioForExport({ ...DEFAULT_STUDIO_STATE, mode: 'side-by-side' }),
    null,
  );
  assert.equal(
    validateStudioForExport({ ...DEFAULT_STUDIO_STATE, mode: 'hardware-cutaway' }),
    null,
  );
  assert.equal(
    validateStudioForExport({ ...DEFAULT_STUDIO_STATE, mode: 'kill-chain' }),
    null,
  );
  assert.equal(
    validateStudioForExport({ ...DEFAULT_STUDIO_STATE, mode: 'lower-third' }),
    null,
  );
  assert.equal(
    validateStudioForExport({ ...DEFAULT_STUDIO_STATE, mode: 'delay-timeline' }),
    null,
  );
  assert.equal(
    validateStudioForExport({ ...DEFAULT_STUDIO_STATE, mode: 'range-ring' }),
    null,
  );
  assert.equal(
    validateStudioForExport({ ...DEFAULT_STUDIO_STATE, mode: 'end-screen' }),
    null,
  );
  assert.ok(
    validateStudioForExport({
      ...DEFAULT_STUDIO_STATE,
      mode: 'lower-third',
      lowerThird: { ...DEFAULT_STUDIO_STATE.lowerThird, headline: '   ' },
    }),
  );
});
