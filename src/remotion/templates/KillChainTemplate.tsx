import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { KillChainConfig } from '../../types/chart';
import {
  CANVAS_FRAME_STYLE,
  EditorialFooter,
  EditorialHeader,
  GridBackground,
  MONO_FONT,
  VerificationBadge,
} from '../SharedBriefingChrome';

export const KillChainTemplate: React.FC<KillChainConfig> = ({
  title,
  subtitle,
  nodes,
  footer,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visibleNodes = nodes.slice(0, 4);

  return (
    <div style={CANVAS_FRAME_STYLE}>
      <GridBackground patternId="grid-kill-chain" />

      <EditorialHeader title={title} subtitle={subtitle} rightTag="SYSTEMS SCHEMATIC" />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 24,
          paddingBottom: 24,
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 0,
          }}
        >
          {visibleNodes.map((node, index) => {
            const nodeStart = 10 + index * 18;
            const nodeSpring = spring({
              frame: Math.max(0, frame - nodeStart),
              fps,
              config: { damping: 24, stiffness: 90, mass: 0.9 },
            });

            const arrowStart = nodeStart + 10;
            const arrowProgress = interpolate(
              frame,
              [arrowStart, arrowStart + 12],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );

            const hasArrow = index < visibleNodes.length - 1;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 330,
                    backgroundColor: '#0F1520',
                    border: '1px solid #1E293B',
                    borderTop: '3px solid #3B82F6',
                    borderRadius: 8,
                    padding: '28px 26px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: nodeSpring,
                    transform: `translateY(${interpolate(nodeSpring, [0, 1], [18, 0])}px)`,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        marginBottom: 18,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: MONO_FONT,
                          fontVariantNumeric: 'tabular-nums',
                          fontSize: 22,
                          fontWeight: 700,
                          color: '#3B82F6',
                        }}
                      >
                        STEP {node.stepNumber || `0${index + 1}`}
                      </span>
                      <VerificationBadge status={node.badge} fontSize={12} padding="3px 10px" />
                    </div>

                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 700,
                        color: '#F8FAFC',
                        lineHeight: 1.2,
                        marginBottom: 14,
                      }}
                    >
                      {node.nodeTitle.trim() || `Node ${index + 1}`}
                    </div>

                    <div
                      style={{
                        fontSize: 19,
                        color: '#94A3B8',
                        lineHeight: 1.45,
                      }}
                    >
                      {node.roleSubtitle.trim() || 'Operational link role'}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 22,
                      paddingTop: 14,
                      borderTop: '1px solid #162032',
                      fontFamily: MONO_FONT,
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: 13,
                      color: '#64748B',
                      letterSpacing: '0.06em',
                    }}
                  >
                    NODE 0{index + 1} / 0{visibleNodes.length}
                  </div>
                </div>

                {/* Connecting Directional SVG Arrow */}
                {hasArrow && (
                  <div
                    style={{
                      width: 112,
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingLeft: 8,
                      paddingRight: 8,
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: MONO_FONT,
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#94A3B8',
                        textAlign: 'center',
                        marginBottom: 8,
                        opacity: arrowProgress,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 108,
                      }}
                    >
                      {node.arrowLabel.trim() || 'LINK'}
                    </div>

                    <svg width="96" height="28" viewBox="0 0 96 28">
                      <line
                        x1="4"
                        y1="14"
                        x2={4 + 78 * arrowProgress}
                        y2="14"
                        stroke="#3B82F6"
                        strokeWidth="2.5"
                      />
                      {arrowProgress > 0.75 && (
                        <polygon
                          points="82,7 94,14 82,21"
                          fill="#3B82F6"
                          opacity={interpolate(arrowProgress, [0.75, 1], [0, 1])}
                        />
                      )}
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <EditorialFooter footer={footer} showLegend />
    </div>
  );
};
