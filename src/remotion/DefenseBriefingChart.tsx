import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  VERIFICATION_BADGE_STYLES,
  type ChartConfig,
  type VerificationStatus,
} from '../types/chart';
import {
  calculateBarPercentage,
  calculateGridTicks,
  calculateMaxValue,
  formatAnimatedValue,
  formatNumericValue,
  getRowStaggerFrames,
} from '../utils/chartMath';

export type DefenseBriefingChartProps = ChartConfig;

const SANS_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const MONO_FONT =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

const LEGEND_STATUSES: readonly VerificationStatus[] = ['VERIFIED', 'ESTIMATE', 'CLAIM'];

export const DefenseBriefingChart: React.FC<DefenseBriefingChartProps> = ({
  title,
  subtitle,
  footer,
  unitSuffix,
  rows,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const maxValue = calculateMaxValue(rows);
  const gridTicks = calculateGridTicks(maxValue, 4);
  const staggerFrames = getRowStaggerFrames(rows.length, durationInFrames);

  // Header & structural entrance
  const headerOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headerTranslateY = interpolate(frame, [0, 16], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const gridOpacity = interpolate(frame, [6, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const footerOpacity = interpolate(frame, [14, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Adaptive density so 1 to 10+ rows remain well-proportioned inside 1920x1080
  const count = Math.max(1, rows.length);
  const isCompact = count > 4 && count <= 7;
  const isDense = count > 7;

  const barHeight = isDense ? 22 : isCompact ? 32 : 44;
  const labelFontSize = isDense ? 19 : isCompact ? 23 : 27;
  const valueFontSize = isDense ? 19 : isCompact ? 23 : 28;
  const badgeFontSize = isDense ? 11 : isCompact ? 12 : 13;
  const rowGap = isDense ? 14 : isCompact ? 22 : 38;
  const labelTrackGap = isDense ? 6 : isCompact ? 8 : 12;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: '#0B0F17',
        color: '#F8FAFC',
        fontFamily: SANS_FONT,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: '64px 96px 52px 96px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Subtle 1px structural background grid via inline SVG */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          opacity: 0.45,
        }}
      >
        <defs>
          <pattern
            id="defense-briefing-grid"
            width="96"
            height="96"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 96 0 L 0 0 0 96"
              fill="none"
              stroke="#162032"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#defense-briefing-grid)" />
      </svg>

      {/* Editorial Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '2px solid #334155',
          borderBottom: '1px solid #162032',
          paddingTop: 22,
          paddingBottom: 24,
          opacity: headerOpacity,
          transform: `translateY(${headerTranslateY}px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 40,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: '#F8FAFC',
                letterSpacing: '-0.015em',
                lineHeight: 1.15,
                wordBreak: 'break-word',
              }}
            >
              {title.trim() || 'UNTITLED DEFENSE BRIEFING'}
            </div>
            {subtitle.trim() ? (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 23,
                  fontWeight: 400,
                  color: '#94A3B8',
                  lineHeight: 1.35,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>

          {unitSuffix.trim() ? (
            <div
              style={{
                flexShrink: 0,
                fontFamily: MONO_FONT,
                fontVariantNumeric: 'tabular-nums',
                fontSize: 18,
                fontWeight: 600,
                color: '#94A3B8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: '1px solid #162032',
                backgroundColor: '#0F1520',
                padding: '10px 16px',
                borderRadius: 4,
              }}
            >
              UNIT: {unitSuffix}
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Proportional Bar Plot Area */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 28,
          paddingBottom: 20,
        }}
      >
        {rows.length === 0 ? (
          <div
            style={{
              border: '1px solid #162032',
              backgroundColor: '#0F1520',
              padding: '48px 32px',
              textAlign: 'center',
              color: '#94A3B8',
              fontSize: 24,
              fontFamily: MONO_FONT,
            }}
          >
            No data series configured. Add a row in the studio panel.
          </div>
        ) : (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Vertical proportional grid lines spanning the plot */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 36,
                left: 0,
                right: 0,
                pointerEvents: 'none',
                opacity: gridOpacity,
              }}
            >
              {gridTicks.map((_, idx) => {
                const pct =
                  gridTicks.length > 1 ? (idx / (gridTicks.length - 1)) * 100 : 0;
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: `${pct}%`,
                      width: 1,
                      backgroundColor: '#162032',
                    }}
                  />
                );
              })}
            </div>

            {/* Staggered Data Rows */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: rowGap,
              }}
            >
              {rows.map((row, index) => {
                const startFrame = 14 + index * staggerFrames;
                const rowEntrance = interpolate(
                  frame,
                  [startFrame - 4, startFrame + 10],
                  [0, 1],
                  {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  },
                );
                const barSpring = spring({
                  frame: Math.max(0, frame - startFrame),
                  fps,
                  config: {
                    damping: 26,
                    stiffness: 88,
                    mass: 0.9,
                  },
                });

                const targetPct = calculateBarPercentage(row.value, maxValue);
                const currentWidthPct = targetPct * barSpring;
                const badgeStyle = VERIFICATION_BADGE_STYLES[row.status];
                const formattedAnimated = formatAnimatedValue(row.value, barSpring);
                const unitDisplay = unitSuffix.trim() ? ` ${unitSuffix.trim()}` : '';

                return (
                  <div
                    key={row.id}
                    style={{
                      opacity: rowEntrance,
                      transform: `translateY(${(1 - rowEntrance) * 10}px)`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: labelTrackGap,
                    }}
                  >
                    {/* Label + Verification Badge + Numeric Value */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 24,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <span
                          style={{
                            fontSize: labelFontSize,
                            fontWeight: 600,
                            color: '#F8FAFC',
                            letterSpacing: '-0.01em',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {row.label.trim() || `Series ${index + 1}`}
                        </span>

                        {/* Verification Pill Badge */}
                        <span
                          style={{
                            flexShrink: 0,
                            fontFamily: MONO_FONT,
                            fontSize: badgeFontSize,
                            fontWeight: 700,
                            letterSpacing: '0.07em',
                            color: badgeStyle.color,
                            backgroundColor: badgeStyle.backgroundColor,
                            border: `1px solid ${badgeStyle.borderColor}`,
                            borderRadius: 9999,
                            padding: isDense ? '2px 10px' : '4px 12px',
                            lineHeight: 1.2,
                          }}
                        >
                          {row.status}
                        </span>
                      </div>

                      <div
                        style={{
                          flexShrink: 0,
                          fontFamily: MONO_FONT,
                          fontVariantNumeric: 'tabular-nums',
                          fontSize: valueFontSize,
                          fontWeight: 700,
                          color: '#F8FAFC',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span>{formattedAnimated}</span>
                        {unitDisplay ? (
                          <span
                            style={{
                              fontSize: Math.max(14, Math.round(valueFontSize * 0.68)),
                              fontWeight: 500,
                              color: '#94A3B8',
                            }}
                          >
                            {unitDisplay}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Mathematically Proportional Bar Track */}
                    <div
                      style={{
                        width: '100%',
                        height: barHeight,
                        backgroundColor: '#0F1520',
                        border: '1px solid #162032',
                        boxSizing: 'border-box',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${currentWidthPct}%`,
                          height: '100%',
                          backgroundColor: row.color,
                          boxSizing: 'border-box',
                          borderRight:
                            currentWidthPct > 0.3
                              ? '2px solid rgba(248, 250, 252, 0.5)'
                              : 'none',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Scale Axis */}
            <div
              style={{
                position: 'relative',
                height: 36,
                marginTop: 18,
                borderTop: '1px solid #1E293B',
                opacity: gridOpacity,
              }}
            >
              {gridTicks.map((tick, idx) => {
                const pct =
                  gridTicks.length > 1 ? (idx / (gridTicks.length - 1)) * 100 : 0;
                const isFirst = idx === 0;
                const isLast = idx === gridTicks.length - 1;
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: `${pct}%`,
                      transform: isFirst
                        ? 'translateX(0%)'
                        : isLast
                          ? 'translateX(-100%)'
                          : 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isFirst
                        ? 'flex-start'
                        : isLast
                          ? 'flex-end'
                          : 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 1,
                        height: 6,
                        backgroundColor: '#334155',
                      }}
                    />
                    <span
                      style={{
                        marginTop: 4,
                        fontFamily: MONO_FONT,
                        fontVariantNumeric: 'tabular-nums',
                        fontSize: 16,
                        color: '#94A3B8',
                      }}
                    >
                      {formatNumericValue(tick)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Editorial Source Citation Footer */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid #162032',
          paddingTop: 18,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 32,
          opacity: footerOpacity,
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: '#94A3B8',
            lineHeight: 1.4,
            flex: 1,
            minWidth: 0,
          }}
        >
          {footer.trim() || 'Source documentation not specified'}
        </div>

        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontFamily: MONO_FONT,
            fontSize: 13,
            color: '#94A3B8',
          }}
        >
          {LEGEND_STATUSES.map((status) => {
            const st = VERIFICATION_BADGE_STYLES[status];
            return (
              <div
                key={status}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 9999,
                    backgroundColor: st.color,
                    display: 'inline-block',
                  }}
                />
                <span>{status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
