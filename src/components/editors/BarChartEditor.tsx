import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import {
  BAR_COLOR_OPTIONS,
  VERIFICATION_STATUS_OPTIONS,
  type BarColorHex,
  type ChartConfig,
  type ChartRow,
  type VerificationStatus,
} from '../../types/chart';
import { reorderRows } from '../../utils/chartMath';

interface BarChartEditorProps {
  config: ChartConfig;
  disabled: boolean;
  onChange: (next: ChartConfig) => void;
}

export const BarChartEditor: React.FC<BarChartEditorProps> = ({
  config,
  disabled,
  onChange,
}) => {
  const updateField = <K extends keyof ChartConfig>(key: K, value: ChartConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const handleAddRow = () => {
    const nextColor =
      BAR_COLOR_OPTIONS[config.rows.length % BAR_COLOR_OPTIONS.length].hex;
    const newRow: ChartRow = {
      id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      label: `New Procurement System ${config.rows.length + 1}`,
      value: 100,
      status: 'ESTIMATE',
      color: nextColor,
    };
    onChange({ ...config, rows: [...config.rows, newRow] });
  };

  const handleUpdateRow = (id: string, patch: Partial<ChartRow>) => {
    onChange({
      ...config,
      rows: config.rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    });
  };

  const handleRemoveRow = (id: string) => {
    onChange({
      ...config,
      rows: config.rows.filter((row) => row.id !== id),
    });
  };

  const handleMoveRow = (index: number, direction: -1 | 1) => {
    onChange({
      ...config,
      rows: reorderRows(config.rows, index, index + direction),
    });
  };

  return (
    <>
      {/* Briefing Metadata Fields */}
      <div className="p-5 border-b border-[#1E293B] space-y-3.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          Chart Metadata
        </h3>

        <div>
          <label
            htmlFor="chart-title"
            className="block text-xs font-medium text-[#94A3B8] mb-1.5"
          >
            Chart Title
          </label>
          <input
            id="chart-title"
            type="text"
            disabled={disabled}
            value={config.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g., 5TH-GEN STEALTH FIGHTER FLEET SCALE"
            className="w-full px-3 py-2 text-sm bg-[#0B0F17] text-[#F8FAFC] placeholder-[#475569] border border-[#1E293B] rounded-md focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="chart-subtitle"
            className="block text-xs font-medium text-[#94A3B8] mb-1.5"
          >
            Subtitle
          </label>
          <textarea
            id="chart-subtitle"
            rows={2}
            disabled={disabled}
            value={config.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Operational context or methodology note"
            className="w-full px-3 py-2 text-sm bg-[#0B0F17] text-[#F8FAFC] placeholder-[#475569] border border-[#1E293B] rounded-md focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed resize-none leading-snug"
          />
        </div>

        <div>
          <label
            htmlFor="chart-footer"
            className="block text-xs font-medium text-[#94A3B8] mb-1.5"
          >
            Source Citation Footer
          </label>
          <textarea
            id="chart-footer"
            rows={2}
            disabled={disabled}
            value={config.footer}
            onChange={(e) => updateField('footer', e.target.value)}
            placeholder="Sources: IISS Military Balance, DoD SAR, OSINT"
            className="w-full px-3 py-2 text-sm bg-[#0B0F17] text-[#F8FAFC] placeholder-[#475569] border border-[#1E293B] rounded-md focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed resize-none leading-snug"
          />
        </div>

        <div>
          <label
            htmlFor="chart-unit"
            className="block text-xs font-medium text-[#94A3B8] mb-1.5"
          >
            Value Unit Suffix
          </label>
          <input
            id="chart-unit"
            type="text"
            disabled={disabled}
            value={config.unitSuffix}
            onChange={(e) => updateField('unitSuffix', e.target.value)}
            placeholder="airframes, $M, units"
            className="w-full px-3 py-2 text-sm bg-[#0B0F17] text-[#F8FAFC] placeholder-[#475569] border border-[#1E293B] rounded-md focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Dynamic Data Rows Editor */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-sm font-semibold text-[#F8FAFC] tracking-tight">
              Data Series
            </h3>
            <span className="text-xs font-mono tabular-nums text-[#64748B]">
              {config.rows.length} {config.rows.length === 1 ? 'row' : 'rows'}
            </span>
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC] rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add Row
          </button>
        </div>

        {config.rows.length === 0 ? (
          <div className="border border-dashed border-[#1E293B] rounded-md p-6 text-center">
            <p className="text-sm text-[#94A3B8] mb-3">
              No procurement or force-scale series defined.
            </p>
            <button
              type="button"
              disabled={disabled}
              onClick={handleAddRow}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#3B82F6] hover:bg-[#2563EB] text-[#F8FAFC] rounded-md transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Add First Data Row
            </button>
          </div>
        ) : (
          <div className="space-y-3" data-testid="data-rows-list">
            {config.rows.map((row, index) => {
              const rowName = row.label.trim() || `Row ${index + 1}`;
              return (
                <div
                  key={row.id}
                  data-testid={`data-row-${index}`}
                  className="p-3.5 bg-[#0B0F17] border border-[#1E293B] rounded-md space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 text-xs font-mono tabular-nums text-[#64748B]">
                      <span>Series #{index + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#94A3B8] truncate">{row.status}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={disabled || index === 0}
                        onClick={() => handleMoveRow(index, -1)}
                        aria-label={`Move "${rowName}" up`}
                        title="Move up"
                        className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#162032] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        disabled={disabled || index === config.rows.length - 1}
                        onClick={() => handleMoveRow(index, 1)}
                        aria-label={`Move "${rowName}" down`}
                        title="Move down"
                        className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#162032] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => handleRemoveRow(row.id)}
                        aria-label={`Remove "${rowName}"`}
                        title="Remove row"
                        className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#450A0A]/40 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-2.5">
                    <div>
                      <label
                        htmlFor={`row-label-${row.id}`}
                        className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                      >
                        Label
                      </label>
                      <input
                        id={`row-label-${row.id}`}
                        type="text"
                        disabled={disabled}
                        value={row.label}
                        onChange={(e) => handleUpdateRow(row.id, { label: e.target.value })}
                        placeholder="Platform or system name"
                        className="w-full px-2.5 py-1.5 text-sm bg-[#0F1520] text-[#F8FAFC] placeholder-[#475569] border border-[#1E293B] rounded focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`row-value-${row.id}`}
                        className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                      >
                        Numeric Value
                      </label>
                      <input
                        id={`row-value-${row.id}`}
                        type="number"
                        min={0}
                        step="any"
                        disabled={disabled}
                        value={Number.isFinite(row.value) ? row.value : 0}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const parsed = raw === '' ? 0 : Number(raw);
                          if (!Number.isNaN(parsed) && parsed >= 0) {
                            handleUpdateRow(row.id, { value: parsed });
                          }
                        }}
                        className="w-full px-2.5 py-1.5 text-sm font-mono tabular-nums bg-[#0F1520] text-[#F8FAFC] border border-[#1E293B] rounded focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
                    <div>
                      <label
                        htmlFor={`row-status-${row.id}`}
                        className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                      >
                        Verification Status
                      </label>
                      <select
                        id={`row-status-${row.id}`}
                        disabled={disabled}
                        value={row.status}
                        onChange={(e) =>
                          handleUpdateRow(row.id, {
                            status: e.target.value as VerificationStatus,
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#0F1520] text-[#F8FAFC] border border-[#1E293B] rounded focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {VERIFICATION_STATUS_OPTIONS.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                        Bar Color
                      </span>
                      <div
                        role="group"
                        aria-label={`Bar color for ${rowName}`}
                        className="flex items-center gap-2 h-[30px]"
                      >
                        {BAR_COLOR_OPTIONS.map((option) => {
                          const isSelected = row.color === option.hex;
                          return (
                            <button
                              key={option.hex}
                              type="button"
                              disabled={disabled}
                              aria-label={`Set bar color to ${option.label} for ${rowName}`}
                              aria-pressed={isSelected}
                              title={option.label}
                              onClick={() =>
                                handleUpdateRow(row.id, { color: option.hex as BarColorHex })
                              }
                              style={{ backgroundColor: option.hex }}
                              className={`w-6 h-6 rounded transition-transform cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                isSelected
                                  ? 'ring-2 ring-[#F8FAFC] ring-offset-2 ring-offset-[#0B0F17] scale-105'
                                  : 'opacity-70 hover:opacity-100'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
