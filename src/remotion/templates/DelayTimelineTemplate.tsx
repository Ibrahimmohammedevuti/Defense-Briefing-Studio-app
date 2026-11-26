import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { DelayTimelineConfig } from '../../types/chart';
import {
  CANVAS_FRAME_STYLE,
  EditorialFooter,
  EditorialHeader,
  GridBackground,
  MONO_FONT,
  VerificationBadge,
} from '../SharedBriefingChrome';

export const DelayTimelineTemplate: React.FC<DelayTimelineConfig> = ({
  title,
  subtitle,
  milestones,
  footer,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = milestones.slice(0, 5);
  const trackProgress = interpolate(frame, [10, 48], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={CANVAS_FRAME_STYLE}>
      <GridBackground patternId="grid-delay-timeline" />

      <EditorialHeader title={title} subtitle={subtitle} rightTag="PROGRAM TIMELINE" />

      {/* Horizontal Milestone Track Stage */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        {items.length === 0 ? (
          <div
            style={{
              border: '1px solid #162032',
              backgroundColor: '#0F1520',
              padding: 40,
              textAlign: 'center',
              color: '#94A3B8',
              fontFamily: MONO_FONT,
              fontSize: 22,
            }}
          >
            No milestones configured.
          </div>
        ) : (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 540,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Base Timeline Track */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                height: 3,
                backgroundColor: '#162032',
                transform: 'translateY(-50%)',
              }}
            />
            {/* Animated Active Timeline Track */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                width: `${trackProgress}%`,
                top: '50%',
                height: 3,
                backgroundColor: '#3B82F6',
                transform: 'translateY(-50%)',
              }}
            />

            {/* Chronological Milestone Nodes */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 20,
              }}
            >
              {items.map((ms, idx) => {
                const nodeStart = 14 + idx * 14;
                const popSpring = spring({
                  frame: Math.max(0, frame - nodeStart),
                  fps,
                  config: { damping: 20, stiffness: 105, mass: 0.8 },
                });
                const isTop = idx % 2 === 0;

                return (
                  <div
                    key={ms.id}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      height: 500,
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Center Node Circle */}
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 9999,
                        backgroundColor: '#0B0F17',
                        border: '4px solid #3B82F6',
                        transform: `scale(${popSpring})`,
                        zIndex: 2,
                      }}
                    />

                    {/* Vertical Stem */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        top: isTop ? 204 : 262,
                        width: 2,
                        height: 34 * popSpring,
                        backgroundColor: '#334155',
                      }}
                    />

                    {/* Milestone Card (alternating top/bottom) */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: isTop ? 6 : undefined,
                        bottom: isTop ? undefined : 6,
                        backgroundColor: '#0F1520',
                        border: '1px solid #1E293B',
                        borderRadius: 6,
                        padding: '18px 20px',
                        boxSizing: 'border-box',
                        opacity: popSpring,
                        transform: `translateY(${interpolate(
                          popSpring,
                          [0, 1],
                          [isTop ? -14 : 14, 0],
                        )}px)`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 8,
                          marginBottom: 10,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: MONO_FONT,
                            fontVariantNumeric: 'tabular-nums',
                            fontSize: 16,
                            fontWeight: 700,
                            color: '#3B82F6',
                          }}
                        >
                          {ms.dateLabel.trim() || `T+${idx + 1}`}
                        </span>
                        <VerificationBadge status={ms.badge} fontSize={11} padding="2px 8px" />
                      </div>

                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: '#F8FAFC',
                          lineHeight: 1.25,
                          marginBottom: 8,
                        }}
                      >
                        {ms.title.trim() || `Milestone ${idx + 1}`}
                      </div>

                      <div
                        style={{
                          fontSize: 15,
                          color: '#94A3B8',
                          lineHeight: 1.4,
                        }}
                      >
                        {ms.note.trim() || 'Schedule update'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <EditorialFooter footer={footer} showLegend />
    </div>
  );
};
