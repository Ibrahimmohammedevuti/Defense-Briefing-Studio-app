import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { EndScreenConfig } from '../../types/chart';
import {
  CANVAS_FRAME_STYLE,
  EditorialFooter,
  EditorialHeader,
  GridBackground,
  MONO_FONT,
} from '../SharedBriefingChrome';

export const EndScreenTemplate: React.FC<EndScreenConfig> = ({
  channelTitle,
  nextEpisodeLabel,
  signoffCitation,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 24, stiffness: 86, mass: 0.9 },
  });

  return (
    <div style={CANVAS_FRAME_STYLE}>
      <GridBackground patternId="grid-end-screen" />

      <EditorialHeader
        title={channelTitle}
        subtitle={nextEpisodeLabel}
        rightTag="END-SCREEN SLATE"
      />

      {/* Two 16:9 YouTube End-Screen Bounding Boxes */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 64,
          paddingTop: 28,
          paddingBottom: 28,
          opacity: cardSpring,
          transform: `translateY(${interpolate(cardSpring, [0, 1], [16, 0])}px)`,
        }}
      >
        {[
          { slot: 'VIDEO SLOT 01', label: 'NEXT BRIEFING' },
          { slot: 'VIDEO SLOT 02', label: 'RELATED ANALYSIS' },
        ].map((item) => (
          <div
            key={item.slot}
            style={{
              flex: 1,
              aspectRatio: '16 / 9',
              maxHeight: 450,
              border: '2px dashed #334155',
              backgroundColor: 'rgba(15, 21, 32, 0.72)',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              boxSizing: 'border-box',
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: MONO_FONT,
                fontVariantNumeric: 'tabular-nums',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#3B82F6',
              }}
            >
              {item.slot} · 16:9 SAFE FRAME
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: '#94A3B8',
                letterSpacing: '0.02em',
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <EditorialFooter footer={signoffCitation} showLegend={false} />
    </div>
  );
};
