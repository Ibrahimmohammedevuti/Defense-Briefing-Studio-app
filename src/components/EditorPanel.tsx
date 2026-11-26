import React from 'react';
import { RotateCcw } from 'lucide-react';
import {
  COMPOSITION_FPS,
  MAX_DURATION_SECONDS,
  MIN_DURATION_SECONDS,
  VISUAL_MODE_OPTIONS,
  type BroadcastStudioState,
  type VisualMode,
} from '../types/chart';
import { secondsToFrames } from '../utils/chartMath';
import { NumericInput } from './NumericInput';
import { BarChartEditor } from './editors/BarChartEditor';
import {
  DocumentExcerptEditor,
  HardwareCutawayEditor,
  KillChainEditor,
  SideBySideEditor,
} from './editors/TemplateEditorsA';
import {
  DelayTimelineEditor,
  EndScreenEditor,
  LowerThirdEditor,
  RangeRingEditor,
} from './editors/TemplateEditorsB';

interface EditorPanelProps {
  state: BroadcastStudioState;
  disabled: boolean;
  onModeChange: (mode: VisualMode) => void;
  onDurationChange: (seconds: number) => void;
  onUpdateState: <K extends Exclude<keyof BroadcastStudioState, 'mode' | 'durationSeconds'>>(
    key: K,
    value: BroadcastStudioState[K],
  ) => void;
  onResetCurrentMode: () => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  state,
  disabled,
  onModeChange,
  onDurationChange,
  onUpdateState,
  onResetCurrentMode,
}) => {
  const totalFrames = secondsToFrames(state.durationSeconds, COMPOSITION_FPS);

  return (
    <aside
      aria-label="Broadcast template editor"
      className="flex flex-col border border-[#1E293B] bg-[#0F1520] rounded-lg overflow-hidden"
    >
      {/* Top Visual Mode Selector & Clip Duration */}
      <div className="p-5 border-b border-[#1E293B] space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-[#F8FAFC] tracking-tight">
            Broadcast Template
          </h2>
          <button
            type="button"
            disabled={disabled}
            onClick={onResetCurrentMode}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E293B] hover:border-[#334155] rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset Default
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3">
          <div>
            <label
              htmlFor="visual-mode-select"
              className="block text-xs font-medium text-[#94A3B8] mb-1.5"
            >
              Visual Mode
            </label>
            <select
              id="visual-mode-select"
              disabled={disabled}
              value={state.mode}
              onChange={(e) => onModeChange(e.target.value as VisualMode)}
              className="w-full px-3 py-2 text-sm font-medium bg-[#0B0F17] text-[#F8FAFC] border border-[#1E293B] rounded-md focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {VISUAL_MODE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="chart-duration"
                className="block text-xs font-medium text-[#94A3B8]"
              >
                Duration (s)
              </label>
              <span className="text-[11px] font-mono tabular-nums text-[#64748B]">
                {totalFrames}f
              </span>
            </div>
            <NumericInput
              id="chart-duration"
              min={MIN_DURATION_SECONDS}
              max={MAX_DURATION_SECONDS}
              step={1}
              integer
              fallbackValue={8}
              disabled={disabled}
              value={state.durationSeconds}
              onCommit={onDurationChange}
              className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-[#0B0F17] text-[#F8FAFC] border border-[#1E293B] rounded-md focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Active Mode Editor Body */}
      {state.mode === 'bar-chart' && (
        <BarChartEditor
          config={state.barChart}
          disabled={disabled}
          onChange={(next) => onUpdateState('barChart', next)}
        />
      )}
      {state.mode === 'document-excerpt' && (
        <DocumentExcerptEditor
          config={state.documentExcerpt}
          disabled={disabled}
          onChange={(next) => onUpdateState('documentExcerpt', next)}
        />
      )}
      {state.mode === 'side-by-side' && (
        <SideBySideEditor
          config={state.sideBySide}
          disabled={disabled}
          onChange={(next) => onUpdateState('sideBySide', next)}
        />
      )}
      {state.mode === 'hardware-cutaway' && (
        <HardwareCutawayEditor
          config={state.hardwareCutaway}
          disabled={disabled}
          onChange={(next) => onUpdateState('hardwareCutaway', next)}
        />
      )}
      {state.mode === 'kill-chain' && (
        <KillChainEditor
          config={state.killChain}
          disabled={disabled}
          onChange={(next) => onUpdateState('killChain', next)}
        />
      )}
      {state.mode === 'lower-third' && (
        <LowerThirdEditor
          config={state.lowerThird}
          disabled={disabled}
          onChange={(next) => onUpdateState('lowerThird', next)}
        />
      )}
      {state.mode === 'delay-timeline' && (
        <DelayTimelineEditor
          config={state.delayTimeline}
          disabled={disabled}
          onChange={(next) => onUpdateState('delayTimeline', next)}
        />
      )}
      {state.mode === 'range-ring' && (
        <RangeRingEditor
          config={state.rangeRing}
          disabled={disabled}
          onChange={(next) => onUpdateState('rangeRing', next)}
        />
      )}
      {state.mode === 'end-screen' && (
        <EndScreenEditor
          config={state.endScreen}
          disabled={disabled}
          onChange={(next) => onUpdateState('endScreen', next)}
        />
      )}
    </aside>
  );
};
