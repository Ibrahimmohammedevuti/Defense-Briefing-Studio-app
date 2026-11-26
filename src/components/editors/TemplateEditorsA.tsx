import React from 'react';
import { ImagePlus, Plus, Trash2, X } from 'lucide-react';
import {
  BAR_COLOR_OPTIONS,
  EXTENDED_VERIFICATION_STATUS_OPTIONS,
  type BarColorHex,
  type ComparisonCardSide,
  type CutawayPin,
  type CutawayPinDirection,
  type DocumentExcerptConfig,
  type ExcerptHighlightColor,
  type ExtendedVerificationStatus,
  type HardwareCutawayConfig,
  type KillChainConfig,
  type KillChainNode,
  type SideBySideConfig,
} from '../../types/chart';
import { splitExcerptBySubstring } from '../../utils/chartMath';
import { NumericInput } from '../NumericInput';

const INPUT_CLASS =
  'w-full px-3 py-2 text-sm bg-[#0B0F17] text-[#F8FAFC] placeholder-[#475569] border border-[#1E293B] rounded-md focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed';
const COMPACT_INPUT_CLASS =
  'w-full px-2.5 py-1.5 text-sm bg-[#0F1520] text-[#F8FAFC] placeholder-[#475569] border border-[#1E293B] rounded focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed';
const SELECT_CLASS =
  'w-full px-2.5 py-1.5 text-xs font-mono bg-[#0F1520] text-[#F8FAFC] border border-[#1E293B] rounded focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

export const DocumentExcerptEditor: React.FC<{
  config: DocumentExcerptConfig;
  disabled: boolean;
  onChange: (next: DocumentExcerptConfig) => void;
}> = ({ config, disabled, onChange }) => {
  const matchCheck = splitExcerptBySubstring(
    config.paragraph,
    config.highlightedSubstring,
  );

  return (
    <div className="p-5 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
        Document Excerpt Settings
      </h3>

      <div>
        <label htmlFor="excerpt-agency" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Agency / Report Header
        </label>
        <input
          id="excerpt-agency"
          type="text"
          disabled={disabled}
          value={config.agencyHeader}
          onChange={(e) => onChange({ ...config, agencyHeader: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="excerpt-date" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
            Document Date
          </label>
          <input
            id="excerpt-date"
            type="text"
            disabled={disabled}
            value={config.documentDate}
            onChange={(e) => onChange({ ...config, documentDate: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="excerpt-badge" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
            Verification Badge
          </label>
          <select
            id="excerpt-badge"
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
      </div>

      <div>
        <label htmlFor="excerpt-paragraph" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Excerpt Paragraph
        </label>
        <textarea
          id="excerpt-paragraph"
          rows={5}
          disabled={disabled}
          value={config.paragraph}
          onChange={(e) => onChange({ ...config, paragraph: e.target.value })}
          className={`${INPUT_CLASS} resize-y leading-relaxed`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_130px] gap-3">
        <div>
          <label htmlFor="excerpt-substring" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
            Exact Highlighted Substring
          </label>
          <input
            id="excerpt-substring"
            type="text"
            disabled={disabled}
            value={config.highlightedSubstring}
            onChange={(e) =>
              onChange({ ...config, highlightedSubstring: e.target.value })
            }
            className={INPUT_CLASS}
          />
          {config.highlightedSubstring.trim() && !matchCheck.found && (
            <p className="mt-1 text-[11px] text-[#F59E0B]">
              Substring not currently found in paragraph text.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="excerpt-color" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
            Sweep Color
          </label>
          <select
            id="excerpt-color"
            disabled={disabled}
            value={config.highlightColor}
            onChange={(e) =>
              onChange({
                ...config,
                highlightColor: e.target.value as ExcerptHighlightColor,
              })
            }
            className={`${SELECT_CLASS} h-[38px] bg-[#0B0F17]`}
          >
            <option value="amber">Amber</option>
            <option value="emerald">Emerald</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="excerpt-footer" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Citation Footer
        </label>
        <textarea
          id="excerpt-footer"
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

const SideCardEditor: React.FC<{
  sideLabel: string;
  sideId: string;
  card: ComparisonCardSide;
  disabled: boolean;
  onChange: (next: ComparisonCardSide) => void;
}> = ({ sideLabel, sideId, card, disabled, onChange }) => {
  const updateBullet = (index: number, text: string) => {
    const nextBullets: [string, string, string] = [...card.bullets] as [
      string,
      string,
      string,
    ];
    nextBullets[index] = text;
    onChange({ ...card, bullets: nextBullets });
  };

  return (
    <div className="p-3.5 bg-[#0B0F17] border border-[#1E293B] rounded-md space-y-3">
      <div className="text-xs font-mono font-semibold text-[#94A3B8]">
        {sideLabel}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_130px] gap-2.5">
        <div>
          <label htmlFor={`${sideId}-title`} className="block text-[11px] font-medium text-[#94A3B8] mb-1">
            Card Title
          </label>
          <input
            id={`${sideId}-title`}
            type="text"
            disabled={disabled}
            value={card.title}
            onChange={(e) => onChange({ ...card, title: e.target.value })}
            className={COMPACT_INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor={`${sideId}-stat`} className="block text-[11px] font-medium text-[#94A3B8] mb-1">
            Big Stat / Value
          </label>
          <input
            id={`${sideId}-stat`}
            type="text"
            disabled={disabled}
            value={card.bigStat}
            onChange={(e) => onChange({ ...card, bigStat: e.target.value })}
            className={`${COMPACT_INPUT_CLASS} font-mono tabular-nums`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
        <div>
          <label htmlFor={`${sideId}-badge`} className="block text-[11px] font-medium text-[#94A3B8] mb-1">
            Verification Badge
          </label>
          <select
            id={`${sideId}-badge`}
            disabled={disabled}
            value={card.badge}
            onChange={(e) =>
              onChange({
                ...card,
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
          <span className="block text-[11px] font-medium text-[#94A3B8] mb-1">
            Accent Color
          </span>
          <div className="flex items-center gap-2 h-[30px]">
            {BAR_COLOR_OPTIONS.map((opt) => (
              <button
                key={opt.hex}
                type="button"
                disabled={disabled}
                aria-label={`Set ${sideLabel} accent color to ${opt.label}`}
                aria-pressed={card.accentColor === opt.hex}
                onClick={() => onChange({ ...card, accentColor: opt.hex as BarColorHex })}
                style={{ backgroundColor: opt.hex }}
                className={`w-6 h-6 rounded cursor-pointer ${
                  card.accentColor === opt.hex
                    ? 'ring-2 ring-[#F8FAFC] ring-offset-2 ring-offset-[#0B0F17]'
                    : 'opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {card.bullets.map((b, idx) => (
          <div key={idx}>
            <label
              htmlFor={`${sideId}-bullet-${idx}`}
              className="block text-[11px] font-medium text-[#64748B] mb-1"
            >
              Bullet {idx + 1}
            </label>
            <input
              id={`${sideId}-bullet-${idx}`}
              type="text"
              disabled={disabled}
              value={b}
              onChange={(e) => updateBullet(idx, e.target.value)}
              className={COMPACT_INPUT_CLASS}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SideBySideEditor: React.FC<{
  config: SideBySideConfig;
  disabled: boolean;
  onChange: (next: SideBySideConfig) => void;
}> = ({ config, disabled, onChange }) => (
  <div className="p-5 space-y-4">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
      Side-by-Side Comparison
    </h3>

    <div>
      <label htmlFor="sbs-title" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
        Main Title
      </label>
      <input
        id="sbs-title"
        type="text"
        disabled={disabled}
        value={config.title}
        onChange={(e) => onChange({ ...config, title: e.target.value })}
        className={INPUT_CLASS}
      />
    </div>

    <div>
      <label htmlFor="sbs-subtitle" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
        Subtitle
      </label>
      <input
        id="sbs-subtitle"
        type="text"
        disabled={disabled}
        value={config.subtitle}
        onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
        className={INPUT_CLASS}
      />
    </div>

    <SideCardEditor
      sideLabel="Left Card"
      sideId="sbs-left"
      card={config.leftCard}
      disabled={disabled}
      onChange={(leftCard) => onChange({ ...config, leftCard })}
    />

    <SideCardEditor
      sideLabel="Right Card"
      sideId="sbs-right"
      card={config.rightCard}
      disabled={disabled}
      onChange={(rightCard) => onChange({ ...config, rightCard })}
    />

    <div>
      <label htmlFor="sbs-footer" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
        Citation Footer
      </label>
      <textarea
        id="sbs-footer"
        rows={2}
        disabled={disabled}
        value={config.footer}
        onChange={(e) => onChange({ ...config, footer: e.target.value })}
        className={`${INPUT_CLASS} resize-none`}
      />
    </div>
  </div>
);

export const HardwareCutawayEditor: React.FC<{
  config: HardwareCutawayConfig;
  disabled: boolean;
  onChange: (next: HardwareCutawayConfig) => void;
}> = ({ config, disabled, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({
          ...config,
          imageDataUrl: reader.result,
          imageName: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPin = () => {
    if (config.pins.length >= 6) {
      return;
    }
    const nextPin: CutawayPin = {
      id: `pin-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      xPercent: 45,
      yPercent: 50,
      labelTitle: `SUBSYSTEM ${config.pins.length + 1}`,
      technicalDetail: 'Subsystem assessment note',
      direction: config.pins.length % 2 === 0 ? 'left' : 'right',
      badge: 'ESTIMATE',
    };
    onChange({ ...config, pins: [...config.pins, nextPin] });
  };

  const updatePin = (id: string, patch: Partial<CutawayPin>) => {
    onChange({
      ...config,
      pins: config.pins.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  };

  return (
    <div className="p-5 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
        Hardware Cutaway Settings
      </h3>

      <div>
        <label htmlFor="cutaway-title" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Title
        </label>
        <input
          id="cutaway-title"
          type="text"
          disabled={disabled}
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="cutaway-image" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Local Base Image (JPG, PNG, WebP)
        </label>
        <div className="flex items-center gap-2">
          <label
            htmlFor="cutaway-image"
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-medium bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC] rounded-md cursor-pointer transition-colors ${
              disabled ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
            {config.imageDataUrl ? 'Replace Image' : 'Upload Local Image'}
          </label>
          <input
            id="cutaway-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={disabled}
            onChange={handleFileChange}
            className="sr-only"
          />
          {config.imageDataUrl && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange({ ...config, imageDataUrl: null, imageName: '' })}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs text-[#FCA5A5] bg-[#450A0A]/60 hover:bg-[#450A0A] border border-[#EF4444]/40 rounded-md cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
        <p className="mt-1.5 text-[11px] text-[#64748B] truncate">
          {config.imageName
            ? `Loaded offline data URL: ${config.imageName}`
            : 'No file loaded — using dark blueprint placeholder'}
        </p>
      </div>

      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#F8FAFC]">
            Callout Pins ({config.pins.length}/6)
          </span>
          <button
            type="button"
            disabled={disabled || config.pins.length >= 6}
            onClick={handleAddPin}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC] rounded-md disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add Pin
          </button>
        </div>

        {config.pins.map((pin, idx) => (
          <div
            key={pin.id}
            className="p-3 bg-[#0B0F17] border border-[#1E293B] rounded-md space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#64748B]">Pin #{idx + 1}</span>
              <button
                type="button"
                disabled={disabled}
                aria-label={`Remove pin ${pin.labelTitle || idx + 1}`}
                onClick={() =>
                  onChange({
                    ...config,
                    pins: config.pins.filter((p) => p.id !== pin.id),
                  })
                }
                className="p-1 text-[#94A3B8] hover:text-[#EF4444] rounded cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor={`pin-x-${pin.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  X %
                </label>
                <NumericInput
                  id={`pin-x-${pin.id}`}
                  min={0}
                  max={100}
                  step={0.5}
                  fallbackValue={50}
                  disabled={disabled}
                  value={pin.xPercent}
                  onCommit={(val) => updatePin(pin.id, { xPercent: val })}
                  className={`${COMPACT_INPUT_CLASS} font-mono tabular-nums`}
                />
              </div>
              <div>
                <label htmlFor={`pin-y-${pin.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Y %
                </label>
                <NumericInput
                  id={`pin-y-${pin.id}`}
                  min={0}
                  max={100}
                  step={0.5}
                  fallbackValue={50}
                  disabled={disabled}
                  value={pin.yPercent}
                  onCommit={(val) => updatePin(pin.id, { yPercent: val })}
                  className={`${COMPACT_INPUT_CLASS} font-mono tabular-nums`}
                />
              </div>
            </div>

            <div>
              <label htmlFor={`pin-title-${pin.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                Label Title
              </label>
              <input
                id={`pin-title-${pin.id}`}
                type="text"
                disabled={disabled}
                value={pin.labelTitle}
                onChange={(e) => updatePin(pin.id, { labelTitle: e.target.value })}
                className={COMPACT_INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor={`pin-detail-${pin.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                Technical Detail
              </label>
              <input
                id={`pin-detail-${pin.id}`}
                type="text"
                disabled={disabled}
                value={pin.technicalDetail}
                onChange={(e) => updatePin(pin.id, { technicalDetail: e.target.value })}
                className={COMPACT_INPUT_CLASS}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor={`pin-dir-${pin.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Direction
                </label>
                <select
                  id={`pin-dir-${pin.id}`}
                  disabled={disabled}
                  value={pin.direction}
                  onChange={(e) =>
                    updatePin(pin.id, {
                      direction: e.target.value as CutawayPinDirection,
                    })
                  }
                  className={SELECT_CLASS}
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div>
                <label htmlFor={`pin-badge-${pin.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Badge
                </label>
                <select
                  id={`pin-badge-${pin.id}`}
                  disabled={disabled}
                  value={pin.badge}
                  onChange={(e) =>
                    updatePin(pin.id, {
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
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="cutaway-footer" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Citation Footer
        </label>
        <textarea
          id="cutaway-footer"
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

export const KillChainEditor: React.FC<{
  config: KillChainConfig;
  disabled: boolean;
  onChange: (next: KillChainConfig) => void;
}> = ({ config, disabled, onChange }) => {
  const updateNode = (id: string, patch: Partial<KillChainNode>) => {
    onChange({
      ...config,
      nodes: config.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    });
  };

  const setNodeCount = (count: 3 | 4) => {
    if (count === 3 && config.nodes.length === 4) {
      onChange({ ...config, nodes: config.nodes.slice(0, 3) });
    } else if (count === 4 && config.nodes.length === 3) {
      onChange({
        ...config,
        nodes: [
          ...config.nodes,
          {
            id: `kc-${Date.now()}`,
            stepNumber: '04',
            nodeTitle: 'TERMINAL ENGAGEMENT',
            roleSubtitle: 'Final guidance & target confirmation',
            arrowLabel: '',
            badge: 'REPORTED',
          },
        ],
      });
    }
  };

  return (
    <div className="p-5 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
        Kill-Chain Schematic Settings
      </h3>

      <div>
        <label htmlFor="kc-title" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Title
        </label>
        <input
          id="kc-title"
          type="text"
          disabled={disabled}
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="kc-subtitle" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Subtitle
        </label>
        <input
          id="kc-subtitle"
          type="text"
          disabled={disabled}
          value={config.subtitle}
          onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-[#94A3B8]">Sequential Nodes</span>
        <div className="flex items-center gap-1 p-1 bg-[#0B0F17] border border-[#1E293B] rounded-md">
          {([3, 4] as const).map((cnt) => (
            <button
              key={cnt}
              type="button"
              disabled={disabled}
              onClick={() => setNodeCount(cnt)}
              className={`px-3 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                config.nodes.length === cnt
                  ? 'bg-[#3B82F6] text-[#F8FAFC]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {cnt} Nodes
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {config.nodes.map((node, idx) => (
          <div
            key={node.id}
            className="p-3 bg-[#0B0F17] border border-[#1E293B] rounded-md space-y-2.5"
          >
            <div className="grid grid-cols-[72px_1fr_115px] gap-2">
              <div>
                <label htmlFor={`kc-step-${node.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Step
                </label>
                <input
                  id={`kc-step-${node.id}`}
                  type="text"
                  disabled={disabled}
                  value={node.stepNumber}
                  onChange={(e) => updateNode(node.id, { stepNumber: e.target.value })}
                  className={`${COMPACT_INPUT_CLASS} font-mono tabular-nums`}
                />
              </div>
              <div>
                <label htmlFor={`kc-ntitle-${node.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Node Title
                </label>
                <input
                  id={`kc-ntitle-${node.id}`}
                  type="text"
                  disabled={disabled}
                  value={node.nodeTitle}
                  onChange={(e) => updateNode(node.id, { nodeTitle: e.target.value })}
                  className={COMPACT_INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor={`kc-badge-${node.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Badge
                </label>
                <select
                  id={`kc-badge-${node.id}`}
                  disabled={disabled}
                  value={node.badge}
                  onChange={(e) =>
                    updateNode(node.id, {
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
              <label htmlFor={`kc-role-${node.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                Role / Detail Subtitle
              </label>
              <input
                id={`kc-role-${node.id}`}
                type="text"
                disabled={disabled}
                value={node.roleSubtitle}
                onChange={(e) => updateNode(node.id, { roleSubtitle: e.target.value })}
                className={COMPACT_INPUT_CLASS}
              />
            </div>

            {idx < config.nodes.length - 1 && (
              <div>
                <label htmlFor={`kc-arrow-${node.id}`} className="block text-[11px] text-[#94A3B8] mb-1">
                  Connecting Arrow Label (to Step {idx + 2})
                </label>
                <input
                  id={`kc-arrow-${node.id}`}
                  type="text"
                  disabled={disabled}
                  value={node.arrowLabel}
                  onChange={(e) => updateNode(node.id, { arrowLabel: e.target.value })}
                  className={COMPACT_INPUT_CLASS}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="kc-footer" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          Citation Footer
        </label>
        <textarea
          id="kc-footer"
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
