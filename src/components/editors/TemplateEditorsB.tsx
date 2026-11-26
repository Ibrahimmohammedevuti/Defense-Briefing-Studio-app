import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import {
  BAR_COLOR_OPTIONS,
  EXTENDED_VERIFICATION_STATUS_OPTIONS,
  type BarColorHex,
  type DelayMilestone,
  type DelayTimelineConfig,
  type EndScreenConfig,
  type ExtendedVerificationStatus,
  type LowerThirdConfig,
  type RangeArc,
  type RangeLineStyle,
  type RangeRingConfig,
  type RangeUnit,
} from '../../types/chart';
import { reorderRows } from '../../utils/chartMath';
import { NumericInput } from '../NumericInput';

const INPUT_CLASS =
  'w-full px-3 py-2 text-sm bg-[#0B0F17] text-[#F8FAFC] placeholder-[#475569] border border-[#1E293B] rounded-md focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed';
const COMPACT_INPUT_CLASS =
  'w-full px-2.5 py-1.5 text-sm bg-[#0F1520] text-[#F8FAFC] placeholder-[#475569] border border-[#1E293B] rounded focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed';
const SELECT_CLASS =
  'w-full px-2.5 py-1.5 text-xs font-mono bg-[#0F1520] text-[#F8FAFC] border border-[#1E293B] rounded focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

export const LowerThirdEditor: React.FC<{
  config: LowerThirdConfig;
  disabled: boolean;
  onChange: (next: LowerThirdConfig) => void;
}> = ({ config, disabled, onChange }) => (
  <div className="p-5 space-y-4">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
      Lower-Third Source Stamp
    </h3>

    <div>
      <label htmlFor="lt-kicker" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
        Kicker / Agency Header
      </label>
      <input
        id="lt-kicker"
        type="text"
        disabled={disabled}
        value={config.kickerHeader}
        onChange={(e) => onChange({ ...config, kickerHeader: e.target.value })}
        className={INPUT_CLASS}
      />
    </div>

    <div>
      <label htmlFor="lt-headline" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
        Main Stat or Headline
      </label>
      <textarea
        id="lt-headline"
        rows={3}
        disabled={disabled}
        value={config.headline}
        onChange={(e) => onChange({ ...config, headline: e.target.value })}
        className={`${INPUT_CLASS} resize-none leading-snug`}
      />
    </div>

    <div>
      <label htmlFor="lt-badge" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
        Verification Badge
      </label>
      <select
        id="lt-badge"
        disabled={disabled}
        value={config.badge}
        onChange={(e) =>
          onChange({
            ...config,
            badge: e.target.value as ExtendedVerificationStatus,
          })
        }
        className={`${SELECT_CLASS} h-[38px] bg-[#0B0F17]`}
      >
        {EXTENDED_VERIFICATION_STATUS_OPTIONS.map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label htmlFor="lt-citation" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
        Source Citation Line
      </label>
      <input
        id="lt-citation"
        type="text"
        disabled={disabled}
        value={config.sourceCitation}
        onChange={(e) => onChange({ ...config, sourceCitation: e.target.value })}
        className={INPUT_CLASS}
      />
    </div>

    <div className="pt-1">
      <label className="flex items-center justify-between gap-3 p-3 bg-[#0B0F17] border border-[#1E293B] rounded-md cursor-pointer">
        <div>
          <span className="block text-xs font-medium text-[#F8FAFC]">
            Chroma-Key Green Background (#00FF00)
          </span>
          <span className="block text-[11px] text-[#94A3B8] mt-0.5">
            Replace dark slate grid with pure key green for video overlay
          </span>
        </div>
        <input
          id="lt-chroma-toggle"
          type="checkbox"
          disabled={disabled}
          checked={config.chromaKeyGreen}
          onChange={(e) => onChange({ ...config, chromaKeyGreen: e.target.checked })}
          className="w-4 h-4 accent-[#10B981] cursor-pointer"
        />
      </label>
    </div>
  </div>
);

export const DelayTimelineEditor: React.FC<{
  config: DelayTimelineConfig;
  disabled: boolean;
  onChange: (next: DelayTimelineConfig) => void;
}> = ({ config, disabled, onChange }) => {
  const handleAddMilestone = () => {
    if (config.milestones.length >= 5) {
      return;
    }
    const next: DelayMilestone = {
      id: `ms-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      dateLabel: '2027',
      title: `Milestone ${config.milestones.length + 1}`,
      note: 'Updated procurement target',
      badge: 'ESTIMATE',
    };
    onChange({ ...config, milestones: [...config.milestones, next] });
  };

  const updateMilestone = (id: string, patch: Partial<DelayMilestone>) => {
    onChange({
      ...config,
      milestones: config.milestones.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    });
  };

  return (
    <div className="p-5 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
        Program Delay Timeline
      </h3>

      <div>
        <label htmlFor="dt-title" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Title
        </label>
        <input
          id="dt-title"
          type="text"
          disabled={disabled}
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="dt-subtitle" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Subtitle
        </label>
        <input
          id="dt-subtitle"
          type="text"
          disabled={disabled}
          value={config.subtitle}
          onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#F8FAFC]">
            Chronological Milestones ({config.milestones.length}/5)
          </span>
          <button
            type="button"
            disabled={disabled || config.milestones.length >= 5}
            onClick={handleAddMilestone}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC] rounded-md disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add Milestone
          </button>
        </div>

        {config.milestones.map((ms, idx) => (
          <div
            key={ms.id}
            className="p-3 bg-[#0B0F17] border border-[#1E293B] rounded-md space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-[#64748B]">
                Milestone #{idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={disabled || idx === 0}
                  aria-label={`Move milestone ${ms.title || idx + 1} up`}
                  onClick={() =>
                    onChange({
                      ...config,
                      milestones: reorderRows(config.milestones, idx, idx - 1),
                    })
                  }
                  className="p-1 text-[#94A3B8] hover:text-[#F8FAFC] rounded disabled:opacity-30 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  disabled={disabled || idx === config.milestones.length - 1}
                  aria-label={`Move milestone ${ms.title || idx + 1} down`}
                  onClick={() =>
                    onChange({
                      ...config,
                      milestones: reorderRows(config.milestones, idx, idx + 1),
                    })
                  }
                  className="p-1 text-[#94A3B8] hover:text-[#F8FAFC] rounded disabled:opacity-30 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  disabled={disabled || config.milestones.length <= 1}
                  aria-label={`Remove milestone ${ms.title || idx + 1}`}
                  onClick={() =>
                    onChange({
                      ...config,
                      milestones: config.milestones.filter((m) => m.id !== ms.id),
                    })
                  }
                  className="p-1 text-[#94A3B8] hover:text-[#EF4444] rounded disabled:opacity-30 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[110px_1fr] gap-2">
              <div>
                <label htmlFor={`ms-date-${ms.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Year / Date
                </label>
                <input
                  id={`ms-date-${ms.id}`}
                  type="text"
                  disabled={disabled}
                  value={ms.dateLabel}
                  onChange={(e) => updateMilestone(ms.id, { dateLabel: e.target.value })}
                  className={`${COMPACT_INPUT_CLASS} font-mono tabular-nums`}
                />
              </div>
              <div>
                <label htmlFor={`ms-badge-${ms.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Verification Badge
                </label>
                <select
                  id={`ms-badge-${ms.id}`}
                  disabled={disabled}
                  value={ms.badge}
                  onChange={(e) =>
                    updateMilestone(ms.id, {
                      badge: e.target.value as ExtendedVerificationStatus,
                    })
                  }
                  className={SELECT_CLASS}
                >
                  {EXTENDED_VERIFICATION_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor={`ms-title-${ms.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                Milestone Title
              </label>
              <input
                id={`ms-title-${ms.id}`}
                type="text"
                disabled={disabled}
                value={ms.title}
                onChange={(e) => updateMilestone(ms.id, { title: e.target.value })}
                className={COMPACT_INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor={`ms-note-${ms.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                Short Note
              </label>
              <input
                id={`ms-note-${ms.id}`}
                type="text"
                disabled={disabled}
                value={ms.note}
                onChange={(e) => updateMilestone(ms.id, { note: e.target.value })}
                className={COMPACT_INPUT_CLASS}
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="dt-footer" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Citation Footer
        </label>
        <textarea
          id="dt-footer"
          rows={2}
          disabled={disabled}
          value={config.footer}
          onChange={(e) => onChange({ ...config, footer: e.target.value })}
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>
    </div>
  );
};

export const RangeRingEditor: React.FC<{
  config: RangeRingConfig;
  disabled: boolean;
  onChange: (next: RangeRingConfig) => void;
}> = ({ config, disabled, onChange }) => {
  const handleAddArc = () => {
    if (config.arcs.length >= 4) {
      return;
    }
    const nextColor =
      BAR_COLOR_OPTIONS[config.arcs.length % BAR_COLOR_OPTIONS.length].hex;
    const nextArc: RangeArc = {
      id: `arc-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      label: `System Arc ${config.arcs.length + 1}`,
      distance: Math.round(config.maxScaleDistance * 0.5),
      badge: 'ESTIMATE',
      color: nextColor,
      lineStyle: 'solid',
    };
    onChange({ ...config, arcs: [...config.arcs, nextArc] });
  };

  const updateArc = (id: string, patch: Partial<RangeArc>) => {
    onChange({
      ...config,
      arcs: config.arcs.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    });
  };

  return (
    <div className="p-5 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
        Tactical Range-Ring Settings
      </h3>

      <div>
        <label htmlFor="rr-title" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Title
        </label>
        <input
          id="rr-title"
          type="text"
          disabled={disabled}
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="rr-subtitle" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Subtitle
        </label>
        <input
          id="rr-subtitle"
          type="text"
          disabled={disabled}
          value={config.subtitle}
          onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="rr-origin" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Origin Label
        </label>
        <input
          id="rr-origin"
          type="text"
          disabled={disabled}
          value={config.originLabel}
          onChange={(e) => onChange({ ...config, originLabel: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="rr-unit" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
            Distance Unit
          </label>
          <select
            id="rr-unit"
            disabled={disabled}
            value={config.unit}
            onChange={(e) => onChange({ ...config, unit: e.target.value as RangeUnit })}
            className={`${SELECT_CLASS} h-[38px] bg-[#0B0F17]`}
          >
            <option value="km">Kilometers (km)</option>
            <option value="nm">Nautical Miles (nm)</option>
          </select>
        </div>

        <div>
          <label htmlFor="rr-max" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
            Max Scale Distance
          </label>
          <NumericInput
            id="rr-max"
            min={1}
            step="any"
            fallbackValue={100}
            disabled={disabled}
            value={config.maxScaleDistance}
            onCommit={(val) => onChange({ ...config, maxScaleDistance: val })}
            className={`${INPUT_CLASS} font-mono tabular-nums`}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#F8FAFC]">
            Range Arcs ({config.arcs.length}/4)
          </span>
          <button
            type="button"
            disabled={disabled || config.arcs.length >= 4}
            onClick={handleAddArc}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC] rounded-md disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add Arc
          </button>
        </div>

        {config.arcs.map((arc, idx) => (
          <div
            key={arc.id}
            className="p-3 bg-[#0B0F17] border border-[#1E293B] rounded-md space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#64748B]">Arc #{idx + 1}</span>
              <button
                type="button"
                disabled={disabled || config.arcs.length <= 1}
                aria-label={`Remove arc ${arc.label || idx + 1}`}
                onClick={() =>
                  onChange({
                    ...config,
                    arcs: config.arcs.filter((a) => a.id !== arc.id),
                  })
                }
                className="p-1 text-[#94A3B8] hover:text-[#EF4444] rounded disabled:opacity-30 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-[1fr_110px] gap-2">
              <div>
                <label htmlFor={`arc-label-${arc.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Label
                </label>
                <input
                  id={`arc-label-${arc.id}`}
                  type="text"
                  disabled={disabled}
                  value={arc.label}
                  onChange={(e) => updateArc(arc.id, { label: e.target.value })}
                  className={COMPACT_INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor={`arc-dist-${arc.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Distance ({config.unit})
                </label>
                <NumericInput
                  id={`arc-dist-${arc.id}`}
                  min={0}
                  step="any"
                  fallbackValue={0}
                  disabled={disabled}
                  value={arc.distance}
                  onCommit={(val) => updateArc(arc.id, { distance: val })}
                  className={`${COMPACT_INPUT_CLASS} font-mono tabular-nums`}
                />
              </div>
            </div>

            <div className="grid grid-cols-[1fr_95px_auto] gap-2 items-end">
              <div>
                <label htmlFor={`arc-badge-${arc.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Badge
                </label>
                <select
                  id={`arc-badge-${arc.id}`}
                  disabled={disabled}
                  value={arc.badge}
                  onChange={(e) =>
                    updateArc(arc.id, {
                      badge: e.target.value as ExtendedVerificationStatus,
                    })
                  }
                  className={SELECT_CLASS}
                >
                  {EXTENDED_VERIFICATION_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`arc-style-${arc.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Line
                </label>
                <select
                  id={`arc-style-${arc.id}`}
                  disabled={disabled}
                  value={arc.lineStyle}
                  onChange={(e) =>
                    updateArc(arc.id, { lineStyle: e.target.value as RangeLineStyle })
                  }
                  className={SELECT_CLASS}
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                </select>
              </div>

              <div>
                <span className="block text-[11px] text-[#94A3B8] mb-1">Color</span>
                <div className="flex items-center gap-1.5 h-[30px]">
                  {BAR_COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.hex}
                      type="button"
                      disabled={disabled}
                      aria-label={`Set arc color to ${opt.label}`}
                      aria-pressed={arc.color === opt.hex}
                      onClick={() => updateArc(arc.id, { color: opt.hex as BarColorHex })}
                      style={{ backgroundColor: opt.hex }}
                      className={`w-5 h-5 rounded cursor-pointer ${
                        arc.color === opt.hex
                          ? 'ring-2 ring-[#F8FAFC] ring-offset-1 ring-offset-[#0B0F17]'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="rr-footer" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Citation Footer
        </label>
        <textarea
          id="rr-footer"
          rows={2}
          disabled={disabled}
          value={config.footer}
          onChange={(e) => onChange({ ...config, footer: e.target.value })}
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>
    </div>
  );
};

export const EndScreenEditor: React.FC<{
  config: EndScreenConfig;
  disabled: boolean;
  onChange: (next: EndScreenConfig) => void;
}> = ({ config, disabled, onChange }) => (
  <div className="p-5 space-y-4">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
      Clean End-Screen Slate
    </h3>

    <div>
      <label htmlFor="es-channel" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
        Channel Title
      </label>
      <input
        id="es-channel"
        type="text"
        disabled={disabled}
        value={config.channelTitle}
        onChange={(e) => onChange({ ...config, channelTitle: e.target.value })}
        className={INPUT_CLASS}
      />
    </div>

    <div>
      <label htmlFor="es-teaser" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
        Next Episode Teaser Label
      </label>
      <input
        id="es-teaser"
        type="text"
        disabled={disabled}
        value={config.nextEpisodeLabel}
        onChange={(e) => onChange({ ...config, nextEpisodeLabel: e.target.value })}
        className={INPUT_CLASS}
      />
    </div>

    <div>
      <label htmlFor="es-signoff" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
        Citation / Sign-Off Line
      </label>
      <textarea
        id="es-signoff"
        rows={2}
        disabled={disabled}
        value={config.signoffCitation}
        onChange={(e) => onChange({ ...config, signoffCitation: e.target.value })}
        className={`${INPUT_CLASS} resize-none`}
      />
    </div>
  </div>
);
