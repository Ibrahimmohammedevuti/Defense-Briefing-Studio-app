import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { RangeRingConfig } from '../../types/chart';
import {
  calculateGridTicks,
  calculateRangeRadius,
  formatNumericValue,
} from '../../utils/chartMath';
import {
  CANVAS_FRAME_STYLE,
  EditorialFooter,
  EditorialHeader,
  GridBackground,
  MONO_FONT,
  VerificationBadge,
} from '../SharedBriefingChrome';

const PLOT_W = 1728;
const PLOT_H = 620;
const ORIGIN_X = 110;
const ORIGIN_Y = 540;
const MAX_RADIUS_PX = 1220;

export const RangeRingTemplate: React.FC<RangeRingConfig> = ({
  title,
  subtitle,
  originLabel,
  unit,
  maxScaleDistance,
  arcs,
  footer,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const safeMax = Math.max(1, maxScaleDistance);
  const ticks = calculateGridTicks(safeMax, 4);
  const visibleArcs = arcs.slice(0, 4);
  const gridOpacity = interpolate(frame, [4, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={CANVAS_FRAME_STYLE}>
      <GridBackground patternId="grid-range-ring" />

      <EditorialHeader
        title={title}
        subtitle={subtitle}
        rightTag={`MAX SCALE: ${formatNumericValue(safeMax)} ${unit}`}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 14,
          paddingBottom: 14,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: PLOT_W,
            height: PLOT_H,
          }}
        >
          <svg
            width={PLOT_W}
            height={PLOT_H}
            viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
            style={{ display: 'block' }}
          >
            {/* Reference Distance Grid Rings & Baseline Axis */}
            <g opacity={gridOpacity}>
              {/* Horizontal baseline */}
              <line
                x1={ORIGIN_X}
                y1={ORIGIN_Y}
                x2={ORIGIN_X + MAX_RADIUS_PX}
                y2={ORIGIN_Y}
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* Radial guide spokes */}
              {[12, 24].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <line
                    key={deg}
                    x1={ORIGIN_X}
                    y1={ORIGIN_Y}
                    x2={ORIGIN_X + Math.cos(rad) * MAX_RADIUS_PX}
                    y2={ORIGIN_Y - Math.sin(rad) * MAX_RADIUS_PX}
                    stroke="#162032"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                  />
                );
              })}

              {/* Concentric 25/50/75/100% scale rings & labels */}
              {ticks.map((tickVal, idx) => {
                const r =
                  ticks.length > 1
                    ? (idx / (ticks.length - 1)) * MAX_RADIUS_PX
                    : 0;
                const tickX = ORIGIN_X + r;
                const sweepAngle = Math.min(
                  Math.PI / 5,
                  Math.asin(Math.min(0.92, 460 / Math.max(480, r))),
                );
                const endX = ORIGIN_X + Math.cos(sweepAngle) * r;
                const endY = ORIGIN_Y - Math.sin(sweepAngle) * r;

                return (
                  <g key={idx}>
                    {r > 0 && (
                      <path
                        d={`M ${tickX} ${ORIGIN_Y} A ${r} ${r} 0 0 0 ${endX} ${endY}`}
                        fill="none"
                        stroke="#162032"
                        strokeWidth="1"
                      />
                    )}
                    <line
                      x1={tickX}
                      y1={ORIGIN_Y}
                      x2={tickX}
                      y2={ORIGIN_Y + 8}
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    <text
                      x={tickX}
                      y={ORIGIN_Y + 28}
                      textAnchor={idx === 0 ? 'start' : 'middle'}
                      fill="#94A3B8"
                      fontFamily={MONO_FONT}
                      fontSize="15"
                    >
                      {formatNumericValue(tickVal)} {unit}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Proportional Animated Range Arcs */}
            {visibleArcs.map((arc, idx) => {
              const startFrame = 12 + idx * 12;
              const arcSpring = spring({
                frame: Math.max(0, frame - startFrame),
                fps,
                config: { damping: 24, stiffness: 80, mass: 0.9 },
              });

              const targetR = calculateRangeRadius(
                arc.distance,
                safeMax,
                MAX_RADIUS_PX,
              );
              const currentR = targetR * arcSpring;

              // Each arc sweeps cleanly inside the tactical quadrant
              const sweepAngle = Math.min(
                0.44,
                Math.asin(Math.min(0.92, 440 / Math.max(460, Math.max(1, currentR)))),
              );

              const startX = ORIGIN_X + currentR;
              const startY = ORIGIN_Y;
              const endX = ORIGIN_X + Math.cos(sweepAngle) * currentR;
              const endY = ORIGIN_Y - Math.sin(sweepAngle) * currentR;

              // Callout anchor at staggered radial heights, safely above the baseline axis
              const anchorFraction = Math.min(0.92, 0.45 + idx * 0.16);
              const anchorAngle = sweepAngle * anchorFraction;
              const dotX = ORIGIN_X + Math.cos(anchorAngle) * currentR;
              const dotY = ORIGIN_Y - Math.sin(anchorAngle) * currentR;
              const labelX = Math.min(
                PLOT_W - 350,
                Math.max(dotX + 24, ORIGIN_X + currentR + 22),
              );

              return (
                <g key={arc.id} opacity={arcSpring > 0.02 ? 1 : 0}>
                  {currentR > 2 && (
                    <path
                      d={`M ${startX} ${startY} A ${currentR} ${currentR} 0 0 0 ${endX} ${endY}`}
                      fill="none"
                      stroke={arc.color}
                      strokeWidth="3.5"
                      strokeDasharray={arc.lineStyle === 'dashed' ? '12 8' : undefined}
                    />
                  )}
                  {currentR > 8 && (
                    <>
                      <line
                        x1={dotX}
                        y1={dotY}
                        x2={labelX}
                        y2={dotY}
                        stroke={arc.color}
                        strokeWidth="1.5"
                        opacity={0.75}
                      />
                      <circle
                        cx={dotX}
                        cy={dotY}
                        r={5}
                        fill={arc.color}
                        stroke="#F8FAFC"
                        strokeWidth="1.5"
                      />
                    </>
                  )}
                </g>
              );
            })}

            {/* Left Origin Marker */}
            <g>
              <circle
                cx={ORIGIN_X}
                cy={ORIGIN_Y}
                r={8}
                fill="#3B82F6"
                stroke="#F8FAFC"
                strokeWidth="2.5"
              />
              <text
                x={ORIGIN_X}
                y={ORIGIN_Y + 58}
                textAnchor="start"
                fill="#F8FAFC"
                fontFamily={MONO_FONT}
                fontSize="15"
                fontWeight="700"
                letterSpacing="1.2"
              >
                {originLabel.trim() || 'ORIGIN BASELINE'}
              </text>
            </g>
          </svg>

          {/* Crisp HTML Range Callout Cards */}
          {visibleArcs.map((arc, idx) => {
            const startFrame = 12 + idx * 12;
            const arcSpring = spring({
              frame: Math.max(0, frame - startFrame),
              fps,
              config: { damping: 24, stiffness: 80, mass: 0.9 },
            });
            const cardOpacity = interpolate(arcSpring, [0.15, 0.55], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const targetR = calculateRangeRadius(
              arc.distance,
              safeMax,
              MAX_RADIUS_PX,
            );
            const currentR = targetR * arcSpring;
            const sweepAngle = Math.min(
              0.44,
              Math.asin(Math.min(0.92, 440 / Math.max(460, Math.max(1, currentR)))),
            );
            const anchorAngle = sweepAngle * Math.min(0.92, 0.45 + idx * 0.16);
            const dotX = ORIGIN_X + Math.cos(anchorAngle) * currentR;
            const dotY = ORIGIN_Y - Math.sin(anchorAngle) * currentR;
            const cardLeft = Math.min(
              PLOT_W - 344,
              Math.max(dotX + 24, ORIGIN_X + currentR + 22),
            );
            const cardTop = Math.min(ORIGIN_Y - 84, Math.max(8, dotY - 36));

            return (
              <div
                key={arc.id}
                style={{
                  position: 'absolute',
                  left: cardLeft,
                  top: cardTop,
                  width: 340,
                  backgroundColor: '#0F1520',
                  border: `1px solid ${arc.color}`,
                  borderRadius: 6,
                  padding: '10px 14px',
                  boxSizing: 'border-box',
                  opacity: cardOpacity,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: '#F8FAFC',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {arc.label.trim() || `Arc ${idx + 1}`}
                  </span>
                  <VerificationBadge status={arc.badge} fontSize={10} padding="2px 8px" />
                </div>
                <div
                  style={{
                    fontFamily: MONO_FONT,
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#94A3B8',
                  }}
                >
                  {formatNumericValue(arc.distance)} {unit} ·{' '}
                  <span style={{ textTransform: 'uppercase', fontSize: 12 }}>
                    {arc.lineStyle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EditorialFooter footer={footer} showLegend />
    </div>
  );
};
