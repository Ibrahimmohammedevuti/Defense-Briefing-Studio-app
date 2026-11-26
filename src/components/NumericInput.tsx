import React, { useEffect, useState } from 'react';
import { resolveNumericInputOnBlur } from '../utils/chartMath';

interface NumericInputProps {
  id: string;
  value: number;
  min?: number;
  max?: number;
  step?: number | 'any';
  integer?: boolean;
  fallbackValue?: number;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  onCommit: (nextValue: number) => void;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  id,
  value,
  min,
  max,
  step = 'any',
  integer = false,
  fallbackValue,
  disabled = false,
  className = '',
  placeholder,
  onCommit,
}) => {
  const [draft, setDraft] = useState<string>(() =>
    Number.isFinite(value) ? String(value) : '',
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDraft(Number.isFinite(value) ? String(value) : '');
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDraft(raw);

    if (raw.trim() === '' || raw === '-' || raw.endsWith('.')) {
      return;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      return;
    }

    // Update live preview when already in valid bounds without touching draft
    const meetsMin = min === undefined || parsed >= min;
    const meetsMax = max === undefined || parsed <= max;
    if (meetsMin && meetsMax) {
      onCommit(integer ? Math.round(parsed) : parsed);
    }
  };

  const handleBlur = () => {
    const resolved = resolveNumericInputOnBlur(draft, {
      min,
      max,
      integer,
      fallbackValue,
    });
    setIsFocused(false);
    setDraft(String(resolved));
    onCommit(resolved);
  };

  return (
    <input
      id={id}
      type="number"
      inputMode={integer ? 'numeric' : 'decimal'}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      value={draft}
      placeholder={placeholder}
      onFocus={() => setIsFocused(true)}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
};
