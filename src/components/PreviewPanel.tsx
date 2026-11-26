import React, { useEffect, useRef, useState } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  X,
} from 'lucide-react';
import { BroadcastComposition } from '../remotion/BroadcastComposition';
import {
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
  type BroadcastStudioState,
} from '../types/chart';
import { secondsToFrames } from '../utils/chartMath';
import type { ExportProgressInfo } from '../utils/exportVideo';

interface PreviewPanelProps {
  state: BroadcastStudioState;
  isRendering: boolean;
  progress: ExportProgressInfo | null;
  errorMessage: string | null;
  exportCompleted: boolean;
  onStartRender: () => void;
  onCancelRender: () => void;
  onDismissError: () => void;
}

function formatTimecode(frame: number, fps: number): string {
  const totalSeconds = Math.floor(Math.max(0, frame) / fps);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  state,
  isRendering,
  progress,
  errorMessage,
  exportCompleted,
  onStartRender,
  onCancelRender,
  onDismissError,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const durationInFrames = secondsToFrames(state.durationSeconds, COMPOSITION_FPS);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }
    const handleFrameUpdate = (e: { detail: { frame: number } }) => {
      setCurrentFrame(e.detail.frame);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    player.addEventListener('frameupdate', handleFrameUpdate);
    player.addEventListener('play', handlePlay);
    player.addEventListener('pause', handlePause);

    return () => {
      player.removeEventListener('frameupdate', handleFrameUpdate);
      player.removeEventListener('play', handlePlay);
      player.removeEventListener('pause', handlePause);
    };
  }, []);

  // Restart animation cleanly from frame 0 whenever switching visual mode
  useEffect(() => {
    playerRef.current?.seekTo(0);
    setCurrentFrame(0);
  }, [state.mode]);

  const clampedFrame = Math.min(currentFrame, Math.max(0, durationInFrames - 1));
  const pct = progress?.progressPercent ?? 0;

  return (
    <section
      aria-label="Live video preview and MP4 export"
      className="flex flex-col gap-5 lg:sticky lg:top-6"
    >
      {/* Live Remotion Player Frame + Dedicated Transport Scrubber */}
      <div className="border border-[#1E293B] bg-[#0F1520] rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-[#F8FAFC] tracking-tight">
            1080p Broadcast Preview
          </h2>
          <span className="text-xs font-mono tabular-nums text-[#94A3B8]">
            {COMPOSITION_WIDTH}×{COMPOSITION_HEIGHT} · {COMPOSITION_FPS} fps ·{' '}
            {durationInFrames}f
          </span>
        </div>

        <div
          data-testid="remotion-player-container"
          className="w-full aspect-video bg-[#0B0F17] border border-[#162032] rounded overflow-hidden"
        >
          <Player
            ref={playerRef}
            component={BroadcastComposition}
            inputProps={state}
            durationInFrames={durationInFrames}
            fps={COMPOSITION_FPS}
            compositionWidth={COMPOSITION_WIDTH}
            compositionHeight={COMPOSITION_HEIGHT}
            controls={false}
            loop
            autoPlay
            initiallyMuted
            clickToPlay
            acknowledgeRemotionLicense
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Unobstructed Playback Controls & Scrubber Bar */}
        <div className="flex items-center gap-3 px-3 py-2 bg-[#0B0F17] border border-[#162032] rounded-md">
          <button
            type="button"
            onClick={() => playerRef.current?.toggle()}
            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
            className="p-1.5 text-[#F8FAFC] hover:bg-[#162032] rounded transition-colors cursor-pointer shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Play className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playerRef.current?.seekTo(0);
              setCurrentFrame(0);
            }}
            aria-label="Seek to start"
            title="Restart from frame 0"
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#162032] rounded transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <input
            type="range"
            aria-label="Timeline scrubber"
            min={0}
            max={Math.max(0, durationInFrames - 1)}
            value={clampedFrame}
            onChange={(e) => {
              const target = Number(e.target.value);
              playerRef.current?.seekTo(target);
              setCurrentFrame(target);
            }}
            className="flex-1 h-1.5 accent-[#3B82F6] bg-[#162032] rounded-lg cursor-pointer"
          />

          <span className="text-xs font-mono tabular-nums text-[#94A3B8] whitespace-nowrap shrink-0">
            {formatTimecode(clampedFrame, COMPOSITION_FPS)} /{' '}
            {formatTimecode(durationInFrames, COMPOSITION_FPS)}
          </span>

          <button
            type="button"
            onClick={() => playerRef.current?.requestFullscreen()}
            aria-label="Enter fullscreen preview"
            title="Fullscreen"
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#162032] rounded transition-colors cursor-pointer shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Export Controls & Progress Surface */}
      <div className="border border-[#1E293B] bg-[#0F1520] rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              Client-Side MP4 Export
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Encodes directly in your browser via WebCodecs (H.264 MP4) with zero server upload.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isRendering ? (
              <button
                type="button"
                onClick={onCancelRender}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#450A0A] hover:bg-[#7F1D1D] text-[#F8FAFC] border border-[#EF4444] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
                Cancel Render
              </button>
            ) : (
              <button
                type="button"
                onClick={onStartRender}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#3B82F6] hover:bg-[#2563EB] text-[#F8FAFC] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Render &amp; Download MP4
              </button>
            )}
          </div>
        </div>

        {/* Real-time Progress Bar */}
        {isRendering && (
          <div className="space-y-2 pt-1" data-testid="render-progress-panel">
            <div className="flex items-center justify-between text-xs font-mono tabular-nums">
              <span className="text-[#94A3B8]">
                Encoding 1920×1080 H.264 frames ({progress?.encodedFrames ?? 0} /{' '}
                {progress?.totalFrames ?? durationInFrames})
              </span>
              <span className="text-[#F8FAFC] font-semibold">{pct}%</span>
            </div>
            <div
              role="progressbar"
              aria-label="MP4 rendering progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              className="w-full h-2.5 bg-[#0B0F17] border border-[#162032] rounded-full overflow-hidden"
            >
              <div
                style={{ width: `${pct}%` }}
                className="h-full bg-[#3B82F6] transition-[width] duration-150 ease-out"
              />
            </div>
          </div>
        )}

        {/* Error / WebCodecs Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 p-3.5 bg-[#450A0A] border border-[#EF4444] rounded-md text-[#F8FAFC]"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <AlertTriangle
                className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs leading-relaxed text-[#FCA5A5]">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={onDismissError}
              aria-label="Dismiss error alert"
              className="p-1 text-[#FCA5A5] hover:text-[#F8FAFC] rounded shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Export Complete Feedback */}
        {exportCompleted && !isRendering && !errorMessage && (
          <div
            role="status"
            className="flex items-center gap-2.5 p-3 bg-[#064E3B] border border-[#10B981] rounded-md text-xs text-[#A7F3D0]"
          >
            <CheckCircle2
              className="w-4 h-4 text-[#10B981] shrink-0"
              aria-hidden="true"
            />
            <span>
              Render complete. <strong className="font-semibold text-[#F8FAFC]">briefing-chart.mp4</strong>{' '}
              has been saved to your downloads.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
