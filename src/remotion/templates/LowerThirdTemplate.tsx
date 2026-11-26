import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { LowerThirdConfig } from '../../types/chart';
import {
  GridBackground,
  MONO_FONT,
  SANS_FONT,
  VerificationBadge,
} from '../SharedBriefingChrome';

export const LowerThirdTemplate: React.FC<LowerThirdConfig> = ({
  kickerHeader,
  headline,
  badge,
  sourceCitation,
  chromaKeyGreen,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideSpring = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 24, stiffness: 95, mass: 0.85 },
  });

  const translateX = interpolate(slideSpring, [0, 1], [-80, 0]);
  const accentHeight = interpolate(
    frame,
    [4, 18],
    [0, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: chromaKeyGreen ? '#00FF00' : '#0B0F17',
        color: '#F8FAFC',
        fontFamily: SANS_FONT,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {!chromaKeyGreen && <GridBackground patternId="grid-lower-third" />}

      {/* Subtle framing guide only in dark-slate mode */}
      {!chromaKeyGreen && (
        <div
          style={{
            position: 'absolute',
            top: 64,
            left: 96,
            right: 96,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #162032',
            paddingBottom: 14,
            fontFamily: MONO_FONT,
            fontSize: 14,
            color: '#475569',
            letterSpacing: '0.08em',
          }}
        >
          <span>BROADCAST LOWER-THIRD OVERLAY · 1920×1080 SAFE ZONE</span>
          <span>CHROMA KEY: OFF</span>
        </div>
      )}

      {/* Lower-Left Callout Card */}
      <div
        style={{
          position: 'absolute',
          left: 96,
          bottom: 88,
          maxWidth: 1120,
          minWidth: 740,
          backgroundColor: '#0F1520',
          border: '1px solid #334155',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'stretch',
          overflow: 'hidden',
          opacity: slideSpring,
          transform: `translateX(${translateX}px)`,
        }}
      >
        {/* Left Accent Strip */}
        <div
          style={{
            width: 8,
            backgroundColor: '#162032',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '100%',
              height: `${accentHeight}%`,
              backgroundColor: '#3B82F6',
            }}
          />
        </div>

        {/* Card Content */}
        <div
          style={{
            flex: 1,
            padding: '24px 32px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontFamily: MONO_FONT,
                fontVariantNumeric: 'tabular-nums',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#94A3B8',
                textTransform: 'uppercase',
              }}
            >
              {kickerHeader.trim() || 'SOURCE DISPATCH'}
            </div>
            <VerificationBadge status={badge} fontSize={13} padding="4px 12px" />
          </div>

          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#F8FAFC',
              lineHeight: 1.22,
              letterSpacing: '-0.01em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {headline.trim() || 'Primary source verification headline'}
          </div>

          {sourceCitation.trim() ? (
            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: '1px solid #1E293B',
                fontFamily: MONO_FONT,
                fontSize: 15,
                color: '#94A3B8',
              }}
            >
              {sourceCitation}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
