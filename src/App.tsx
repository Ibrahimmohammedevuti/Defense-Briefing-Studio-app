import { useCallback, useRef, useState } from 'react';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import {
  DEFAULT_CHART_CONFIG,
  DEFAULT_DELAY_TIMELINE_CONFIG,
  DEFAULT_DOCUMENT_EXCERPT_CONFIG,
  DEFAULT_END_SCREEN_CONFIG,
  DEFAULT_HARDWARE_CUTAWAY_CONFIG,
  DEFAULT_KILL_CHAIN_CONFIG,
  DEFAULT_LOWER_THIRD_CONFIG,
  DEFAULT_RANGE_RING_CONFIG,
  DEFAULT_SIDE_BY_SIDE_CONFIG,
  DEFAULT_STUDIO_STATE,
  type BroadcastStudioState,
  type VisualMode,
} from './types/chart';
import {
  exportBriefingChartMp4,
  RenderCancelledError,
  type ExportProgressInfo,
} from './utils/exportVideo';

export default function App() {
  const [studioState, setStudioState] =
    useState<BroadcastStudioState>(DEFAULT_STUDIO_STATE);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState<ExportProgressInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exportCompleted, setExportCompleted] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleModeChange = useCallback((mode: VisualMode) => {
    setExportCompleted(false);
    setErrorMessage(null);
    setStudioState((prev) => ({
      ...prev,
      mode,
    }));
  }, []);

  const handleDurationChange = useCallback((durationSeconds: number) => {
    setExportCompleted(false);
    setStudioState((prev) => ({
      ...prev,
      durationSeconds,
      barChart: {
        ...prev.barChart,
        durationSeconds,
      },
    }));
  }, []);

  const handleUpdateState = useCallback(
    <K extends Exclude<keyof BroadcastStudioState, 'mode' | 'durationSeconds'>>(
      key: K,
      value: BroadcastStudioState[K],
    ) => {
      setExportCompleted(false);
      setStudioState((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const handleResetCurrentMode = useCallback(() => {
    setExportCompleted(false);
    setErrorMessage(null);
    setStudioState((prev) => {
      switch (prev.mode) {
        case 'bar-chart':
          return {
            ...prev,
            durationSeconds: DEFAULT_CHART_CONFIG.durationSeconds,
            barChart: DEFAULT_CHART_CONFIG,
          };
        case 'document-excerpt':
          return { ...prev, documentExcerpt: DEFAULT_DOCUMENT_EXCERPT_CONFIG };
        case 'side-by-side':
          return { ...prev, sideBySide: DEFAULT_SIDE_BY_SIDE_CONFIG };
        case 'hardware-cutaway':
          return { ...prev, hardwareCutaway: DEFAULT_HARDWARE_CUTAWAY_CONFIG };
        case 'kill-chain':
          return { ...prev, killChain: DEFAULT_KILL_CHAIN_CONFIG };
        case 'lower-third':
          return { ...prev, lowerThird: DEFAULT_LOWER_THIRD_CONFIG };
        case 'delay-timeline':
          return { ...prev, delayTimeline: DEFAULT_DELAY_TIMELINE_CONFIG };
        case 'range-ring':
          return { ...prev, rangeRing: DEFAULT_RANGE_RING_CONFIG };
        case 'end-screen':
          return { ...prev, endScreen: DEFAULT_END_SCREEN_CONFIG };
        default:
          return DEFAULT_STUDIO_STATE;
      }
    });
  }, []);

  const handleStartRender = useCallback(async () => {
    if (isRendering) {
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsRendering(true);
    setErrorMessage(null);
    setExportCompleted(false);
    setProgress({
      progressPercent: 0,
      renderedFrames: 0,
      encodedFrames: 0,
      totalFrames: studioState.durationSeconds * 30,
    });

    try {
      await exportBriefingChartMp4({
        state: studioState,
        signal: controller.signal,
        onProgress: (info) => {
          setProgress(info);
        },
      });
      setExportCompleted(true);
    } catch (err) {
      if (err instanceof RenderCancelledError || controller.signal.aborted) {
        setErrorMessage(null);
      } else {
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to render MP4 video. Please try a recent desktop version of Chrome or Edge.';
        setErrorMessage(message);
      }
    } finally {
      abortControllerRef.current = null;
      setIsRendering(false);
    }
  }, [studioState, isRendering]);

  const handleCancelRender = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F8FAFC] flex flex-col">
      {/* Studio Top Bar */}
      <header className="border-b border-[#162032] bg-[#0B0F17]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          <h1 className="text-base font-semibold tracking-tight text-[#F8FAFC] whitespace-nowrap shrink-0">
            Defense Briefing Studio
          </h1>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#94A3B8] font-mono tabular-nums whitespace-nowrap shrink-0">
            <span>Client-Side MP4 Generator</span>
            <span aria-hidden="true">·</span>
            <span>1080p 30fps</span>
            <span aria-hidden="true">·</span>
            <span>WebCodecs</span>
          </div>
        </div>
      </header>

      {/* Two-Column Studio Workspace */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] xl:grid-cols-[480px_1fr] gap-6 items-start">
          <EditorPanel
            state={studioState}
            disabled={isRendering}
            onModeChange={handleModeChange}
            onDurationChange={handleDurationChange}
            onUpdateState={handleUpdateState}
            onResetCurrentMode={handleResetCurrentMode}
          />

          <PreviewPanel
            state={studioState}
            isRendering={isRendering}
            progress={progress}
            errorMessage={errorMessage}
            exportCompleted={exportCompleted}
            onStartRender={handleStartRender}
            onCancelRender={handleCancelRender}
            onDismissError={() => setErrorMessage(null)}
          />
        </div>
      </main>
    </div>
  );
}
