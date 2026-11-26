import { canRenderMediaOnWeb, renderMediaOnWeb } from '@remotion/web-renderer';
import {
  BroadcastComposition,
  type BroadcastCompositionProps,
} from '../remotion/BroadcastComposition';
import {
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
  type BroadcastStudioState,
} from '../types/chart';
import { secondsToFrames, validateStudioForExport } from './chartMath';

export interface ExportProgressInfo {
  progressPercent: number;
  renderedFrames: number;
  encodedFrames: number;
  totalFrames: number;
}

export class WebCodecsUnsupportedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebCodecsUnsupportedError';
  }
}

export class RenderCancelledError extends Error {
  constructor() {
    super('MP4 rendering was cancelled.');
    this.name = 'RenderCancelledError';
  }
}

export function isWebCodecsSupportedInBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.VideoEncoder !== 'undefined' &&
    typeof window.VideoFrame !== 'undefined'
  );
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 4000);
}

export async function exportBriefingChartMp4(params: {
  state: BroadcastStudioState;
  signal: AbortSignal;
  onProgress: (info: ExportProgressInfo) => void;
}): Promise<void> {
  const { state, signal, onProgress } = params;

  const validationError = validateStudioForExport(state);
  if (validationError) {
    throw new Error(validationError);
  }

  if (!isWebCodecsSupportedInBrowser()) {
    throw new WebCodecsUnsupportedError(
      'WebCodecs API is not available in this browser. Please use a recent desktop version of Google Chrome or Microsoft Edge to export 1080p MP4 video client-side.',
    );
  }

  const capability = await canRenderMediaOnWeb({
    width: COMPOSITION_WIDTH,
    height: COMPOSITION_HEIGHT,
    container: 'mp4',
    videoCodec: 'h264',
    muted: true,
  });

  if (!capability.canRender) {
    const issueSummary = capability.issues
      .map((issue) => issue.message)
      .filter(Boolean)
      .join(' ');
    throw new WebCodecsUnsupportedError(
      `This browser cannot encode 1080p H.264 MP4 via WebCodecs.${issueSummary ? ` (${issueSummary})` : ''} Please switch to Google Chrome or Microsoft Edge.`,
    );
  }

  const totalFrames = secondsToFrames(state.durationSeconds, COMPOSITION_FPS);

  try {
    const result = await renderMediaOnWeb({
      composition: {
        id: `defense-briefing-${state.mode}`,
        component: BroadcastComposition,
        durationInFrames: totalFrames,
        fps: COMPOSITION_FPS,
        width: COMPOSITION_WIDTH,
        height: COMPOSITION_HEIGHT,
        defaultProps: state as BroadcastCompositionProps,
      },
      inputProps: state as BroadcastCompositionProps,
      container: 'mp4',
      videoCodec: 'h264',
      muted: true,
      pageResponsiveness: 'high',
      signal,
      onProgress: ({ progress, renderedFrames, encodedFrames }) => {
        const clampedPct = Math.min(100, Math.max(0, Math.round(progress * 100)));
        onProgress({
          progressPercent: clampedPct,
          renderedFrames,
          encodedFrames,
          totalFrames,
        });
      },
    });

    if (signal.aborted) {
      throw new RenderCancelledError();
    }

    const blob = await result.getBlob();
    if (signal.aborted) {
      throw new RenderCancelledError();
    }

    onProgress({
      progressPercent: 100,
      renderedFrames: totalFrames,
      encodedFrames: totalFrames,
      totalFrames,
    });

    triggerBlobDownload(blob, 'briefing-chart.mp4');
  } catch (err) {
    if (signal.aborted || err instanceof RenderCancelledError) {
      throw new RenderCancelledError();
    }
    throw err;
  }
}
