import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { HardwareCutawayConfig } from '../../types/chart';
import { clampPercent } from '../../utils/chartMath';
import {
  CANVAS_FRAME_STYLE,
  EditorialFooter,
  EditorialHeader,
  GridBackground,
  MONO_FONT,
  VerificationBadge,
} from '../SharedBriefingChrome';

const STAGE_W = 1728;
const STAGE_H = 720;

export const HardwareCutawayTemplate: React.FC<HardwareCutawayConfig> = ({
  title,
  imageDataUrl,
  pins,
  footer,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={CANVAS_FRAME_STYLE}>
      <GridBackground patternId="grid-hardware-cutaway" />

      <EditorialHeader title={title} rightTag="HARDWARE CUTAWAY" />

      {/* Main Cutaway Stage */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 22,
          paddingBottom: 20,
        }}
      >
        <div
          style={{
            width: STAGE_W,
            height: STAGE_H,
            position: 'relative',
            backgroundColor: '#0F1520',
            border: '1px solid #1E293B',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          {imageDataUrl ? (
            <img
              src={imageDataUrl}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ) : (
            <svg
              width={STAGE_W}
              height={STAGE_H}
              viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
              style={{ display: 'block' }}
            >
              <defs>
                <pattern
                  id="cutaway-placeholder-subgrid"
                  width="48"
                  height="48"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 48 0 L 0 0 0 48"
                    fill="none"
                    stroke="#162032"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect
                width={STAGE_W}
                height={STAGE_H}
                fill="url(#cutaway-placeholder-subgrid)"
              />
              {/* Subtle technical crosshair */}
              <line
                x1={STAGE_W / 2}
                y1={64}
                x2={STAGE_W / 2}
                y2={STAGE_H - 64}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="6 6"
              />
              <line
                x1={120}
                y1={STAGE_H / 2}
                x2={STAGE_W - 120}
                y2={STAGE_H / 2}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="6 6"
              />
              <circle
                cx={STAGE_W / 2}
                cy={STAGE_H / 2}
                r={120}
                fill="none"
                stroke="#1E293B"
                strokeWidth="1"
              />
              <text
                x={STAGE_W / 2}
                y={STAGE_H - 36}
                textAnchor="middle"
                fill="#64748B"
                fontFamily={MONO_FONT}
                fontSize="16"
                letterSpacing="2"
              >
                TECHNICAL CUTAWAY STAGE · UPLOAD LOCAL JPG/PNG/WEBP FOR BASE IMAGERY
              </text>
            </svg>
          )}

          {/* SVG Leader Lines Layer */}
          <svg
            width={STAGE_W}
            height={STAGE_H}
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
            }}
          >
            {pins.slice(0, 6).map((pin, idx) => {
              const startFrame = 12 + idx * 14;
              const lineProgress = spring({
                frame: Math.max(0, frame - startFrame),
                fps,
                config: { damping: 24, stiffness: 90, mass: 0.8 },
              });

              const px = (clampPercent(pin.xPercent, 5, 95) / 100) * STAGE_W;
              const py = (clampPercent(pin.yPercent, 8, 92) / 100) * STAGE_H;

              const dir = pin.direction === 'left' ? -1 : 1;
              const elbowX = clampPercent(pin.xPercent + dir * 6, 4, 96) / 100 * STAGE_W;
              const elbowY = py > STAGE_H * 0.5 ? py - 56 : py + 56;
              const endX =
                dir === -1
                  ? Math.max(380, elbowX - 110)
                  : Math.min(STAGE_W - 380, elbowX + 110);

              const totalLength = 320;
              const dashOffset = interpolate(lineProgress, [0, 1], [totalLength, 0]);
              const pulse = 0.5 + 0.5 * Math.sin((frame - startFrame) * 0.16);
              const pulseRadius = interpolate(pulse, [0, 1], [8, 22]);
              const pulseOpacity = interpolate(pulse, [0, 1], [0.75, 0.12]);

              return (
                <g key={pin.id} opacity={lineProgress > 0.02 ? 1 : 0}>
                  <polyline
                    points={`${px},${py} ${elbowX},${elbowY} ${endX},${elbowY}`}
                    fill="none"
                    stroke="#F8FAFC"
                    strokeWidth="2"
                    strokeDasharray={totalLength}
                    strokeDashoffset={dashOffset}
                  />
                  {/* Pulsing Target Ring */}
                  <circle
                    cx={px}
                    cy={py}
                    r={pulseRadius}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    opacity={pulseOpacity * lineProgress}
                  />
                  <circle cx={px} cy={py} r={5.5} fill="#3B82F6" stroke="#F8FAFC" strokeWidth="2" />
                </g>
              );
            })}
          </svg>

          {/* HTML Callout Label Cards Layer */}
          {pins.slice(0, 6).map((pin, idx) => {
            const startFrame = 18 + idx * 14;
            const cardSpring = spring({
              frame: Math.max(0, frame - startFrame),
              fps,
              config: { damping: 24, stiffness: 95, mass: 0.8 },
            });

            const py = (clampPercent(pin.yPercent, 8, 92) / 100) * STAGE_H;
            const dir = pin.direction === 'left' ? -1 : 1;
            const elbowX = (clampPercent(pin.xPercent + dir * 6, 4, 96) / 100) * STAGE_W;
            const elbowY = py > STAGE_H * 0.5 ? py - 56 : py + 56;
            const endX =
              dir === -1
                ? Math.max(380, elbowX - 110)
                : Math.min(STAGE_W - 380, elbowX + 110);

            const cardWidth = 340;
            const leftPos =
              dir === -1
                ? Math.max(16, endX - cardWidth)
                : Math.min(STAGE_W - cardWidth - 16, endX);
            const topPos = Math.min(STAGE_H - 122, Math.max(16, elbowY - 48));

            return (
              <div
                key={pin.id}
                style={{
                  position: 'absolute',
                  left: leftPos,
                  top: topPos,
                  width: cardWidth,
                  backgroundColor: '#0B0F17',
                  border: '1px solid #334155',
                  borderRadius: 6,
                  padding: '12px 14px',
                  boxSizing: 'border-box',
                  opacity: cardSpring,
                  transform: `translateX(${interpolate(cardSpring, [0, 1], [dir * 16, 0])}px)`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: MONO_FONT,
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#F8FAFC',
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {pin.labelTitle.trim() || `CALLOUT ${idx + 1}`}
                  </span>
                  <VerificationBadge status={pin.badge} fontSize={10} padding="2px 8px" />
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: '#94A3B8',
                    lineHeight: 1.35,
                  }}
                >
                  {pin.technicalDetail.trim() || 'Technical annotation'}
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
