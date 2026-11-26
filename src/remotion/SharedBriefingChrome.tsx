import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import {
  VERIFICATION_BADGE_STYLES,
  type ExtendedVerificationStatus,
} from '../types/chart';

export const SANS_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
export const MONO_FONT =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export const CANVAS_FRAME_STYLE: React.CSSProperties = {
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
};

export const GridBackground: React.FC<{ patternId?: string }> = ({
  patternId = 'defense-briefing-shared-grid',
}) => (
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
      <pattern id={patternId} width="96" height="96" patternUnits="userSpaceOnUse">
        <path d="M 96 0 L 0 0 0 96" fill="none" stroke="#162032" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="1920" height="1080" fill={`url(#${patternId})`} />
  </svg>
);

export const VerificationBadge: React.FC<{
  status: ExtendedVerificationStatus;
  fontSize?: number;
  padding?: string;
}> = ({ status, fontSize = 13, padding = '4px 12px' }) => {
  const style = VERIFICATION_BADGE_STYLES[status];
  return (
    <span
      style={{
        flexShrink: 0,
        display: 'inline-block',
        fontFamily: MONO_FONT,
        fontVariantNumeric: 'tabular-nums',
        fontSize,
        fontWeight: 700,
        letterSpacing: '0.07em',
        color: style.color,
        backgroundColor: style.backgroundColor,
        border: `1px solid ${style.borderColor}`,
        borderRadius: 9999,
        padding,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
};

export const EditorialHeader: React.FC<{
  title: string;
  subtitle?: string;
  rightTag?: string;
}> = ({ title, subtitle, rightTag }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, 16], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        borderTop: '2px solid #334155',
        borderBottom: '1px solid #162032',
        paddingTop: 22,
        paddingBottom: 24,
        opacity,
        transform: `translateY(${translateY}px)`,
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
          {subtitle && subtitle.trim() ? (
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

        {rightTag && rightTag.trim() ? (
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
            {rightTag}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const EditorialFooter: React.FC<{
  footer: string;
  showLegend?: boolean;
}> = ({ footer, showLegend = true }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [14, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const legendItems: readonly ExtendedVerificationStatus[] = [
    'VERIFIED',
    'ESTIMATE',
    'REPORTED',
    'CLAIM',
  ];

  return (
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
        opacity,
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

      {showLegend && (
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
          {legendItems.map((status) => {
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
      )}
    </div>
  );
};
