import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { DocumentExcerptConfig } from '../../types/chart';
import { splitExcerptBySubstring } from '../../utils/chartMath';
import {
  CANVAS_FRAME_STYLE,
  EditorialFooter,
  GridBackground,
  MONO_FONT,
  SANS_FONT,
  VerificationBadge,
} from '../SharedBriefingChrome';

export const DocumentExcerptTemplate: React.FC<DocumentExcerptConfig> = ({
  agencyHeader,
  documentDate,
  paragraph,
  highlightedSubstring,
  badge,
  highlightColor,
  footer,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 24, stiffness: 86, mass: 0.9 },
  });

  const cardTranslateY = interpolate(cardEntrance, [0, 1], [24, 0]);
  const sweepProgress = spring({
    frame: Math.max(0, frame - 24),
    fps,
    config: { damping: 28, stiffness: 68, mass: 1 },
  });
  const sweepPct = Math.min(100, Math.max(0, sweepProgress * 100));

  const split = splitExcerptBySubstring(paragraph, highlightedSubstring);
  const highlightBg =
    highlightColor === 'emerald'
      ? 'rgba(16, 185, 129, 0.28)'
      : 'rgba(217, 119, 6, 0.34)';
  const highlightUnderline =
    highlightColor === 'emerald' ? '#10B981' : '#F59E0B';

  return (
    <div style={CANVAS_FRAME_STYLE}>
      <GridBackground patternId="grid-document-excerpt" />

      {/* Top Briefing Context Line */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '2px solid #334155',
          borderBottom: '1px solid #162032',
          paddingTop: 18,
          paddingBottom: 18,
          opacity: interpolate(frame, [0, 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div
          style={{
            fontFamily: MONO_FONT,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#94A3B8',
            textTransform: 'uppercase',
          }}
        >
          PRIMARY SOURCE EXCERPT · VERIFICATION BRIEF
        </div>
        <div
          style={{
            fontFamily: MONO_FONT,
            fontVariantNumeric: 'tabular-nums',
            fontSize: 16,
            color: '#64748B',
          }}
        >
          {documentDate.trim() || 'UNDATED RECORD'}
        </div>
      </div>

      {/* Centered Editorial Document Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 28,
          paddingBottom: 28,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1480,
            backgroundColor: '#0F1520',
            border: '1px solid #1E293B',
            borderRadius: 8,
            padding: '48px 56px',
            boxSizing: 'border-box',
            opacity: cardEntrance,
            transform: `translateY(${cardTranslateY}px)`,
          }}
        >
          {/* Card Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              paddingBottom: 26,
              borderBottom: '1px solid #1E293B',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: MONO_FONT,
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: '#F8FAFC',
                  textTransform: 'uppercase',
                }}
              >
                {agencyHeader.trim() || 'OFFICIAL AGENCY REPORT'}
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: MONO_FONT,
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: 16,
                  color: '#94A3B8',
                }}
              >
                {documentDate.trim() || 'DOCUMENT DATE UNSPECIFIED'}
              </div>
            </div>

            <VerificationBadge status={badge} fontSize={15} padding="6px 16px" />
          </div>

          {/* Excerpt Paragraph with Animated Highlight Sweep */}
          <div
            style={{
              marginTop: 36,
              fontFamily: SANS_FONT,
              fontSize: 38,
              lineHeight: 1.52,
              fontWeight: 400,
              color: '#E2E8F0',
              letterSpacing: '-0.005em',
            }}
          >
            <span style={{ color: '#64748B', marginRight: 10 }}>“</span>
            {split.found ? (
              <>
                <span>{split.before}</span>
                <span
                  style={{
                    color: '#F8FAFC',
                    fontWeight: 600,
                    backgroundImage: `linear-gradient(90deg, ${highlightBg}, ${highlightBg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${sweepPct}% 100%`,
                    backgroundPosition: '0 0',
                    borderBottom:
                      sweepPct > 5 ? `3px solid ${highlightUnderline}` : 'none',
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingLeft: 4,
                    paddingRight: 4,
                    borderRadius: 2,
                  }}
                >
                  {split.match}
                </span>
                <span>{split.after}</span>
              </>
            ) : (
              <span>{paragraph}</span>
            )}
            <span style={{ color: '#64748B', marginLeft: 8 }}>”</span>
          </div>
        </div>
      </div>

      <EditorialFooter footer={footer} showLegend />
    </div>
  );
};
