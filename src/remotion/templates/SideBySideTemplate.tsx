import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ComparisonCardSide, SideBySideConfig } from '../../types/chart';
import {
  CANVAS_FRAME_STYLE,
  EditorialFooter,
  EditorialHeader,
  GridBackground,
  MONO_FONT,
  VerificationBadge,
} from '../SharedBriefingChrome';

const ComparisonPanel: React.FC<{
  side: ComparisonCardSide;
  direction: 'left' | 'right';
  startFrame: number;
}> = ({ side, direction, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slide = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 24, stiffness: 88, mass: 0.9 },
  });

  const offset = direction === 'left' ? -48 : 48;
  const translateX = interpolate(slide, [0, 1], [offset, 0]);

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        backgroundColor: '#0F1520',
        border: '1px solid #1E293B',
        borderTop: `4px solid ${side.accentColor}`,
        borderRadius: 8,
        padding: '38px 42px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: slide,
        transform: `translateX(${translateX}px)`,
        boxSizing: 'border-box',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            paddingBottom: 20,
            borderBottom: '1px solid #162032',
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#F8FAFC',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {side.title.trim() || 'SYSTEM SPECIFICATION'}
          </div>
          <VerificationBadge status={side.badge} fontSize={14} padding="5px 14px" />
        </div>

        <div
          style={{
            marginTop: 28,
            marginBottom: 28,
            fontFamily: MONO_FONT,
            fontVariantNumeric: 'tabular-nums',
            fontSize: 64,
            fontWeight: 700,
            color: '#F8FAFC',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          {side.bigStat.trim() || '—'}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {side.bullets.map((bullet, idx) => {
            const bulletOpacity = interpolate(
              frame,
              [startFrame + 14 + idx * 6, startFrame + 24 + idx * 6],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  opacity: bulletOpacity,
                  paddingTop: 14,
                  borderTop: '1px solid #162032',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    backgroundColor: side.accentColor,
                    marginTop: 11,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 23,
                    color: '#CBD5E1',
                    lineHeight: 1.4,
                  }}
                >
                  {bullet.trim() || `Assessment point ${idx + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const SideBySideTemplate: React.FC<SideBySideConfig> = ({
  title,
  subtitle,
  leftCard,
  rightCard,
  footer,
}) => {
  return (
    <div style={CANVAS_FRAME_STYLE}>
      <GridBackground patternId="grid-side-by-side" />

      <EditorialHeader title={title} subtitle={subtitle} rightTag="COMPARATIVE BRIEF" />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
          gap: 36,
          paddingTop: 34,
          paddingBottom: 28,
        }}
      >
        <ComparisonPanel side={leftCard} direction="left" startFrame={10} />
        <ComparisonPanel side={rightCard} direction="right" startFrame={16} />
      </div>

      <EditorialFooter footer={footer} showLegend />
    </div>
  );
};
