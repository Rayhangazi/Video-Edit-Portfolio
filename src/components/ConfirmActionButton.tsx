import React, { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';

interface ConfirmActionButtonProps {
  onConfirm: () => void;
  label?: string;
  confirmLabel?: string;
  title?: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  confirmClassName?: string;
  compact?: boolean;
  timeoutMs?: number;
}

export const ConfirmActionButton: React.FC<ConfirmActionButtonProps> = ({
  onConfirm,
  label,
  confirmLabel = 'Confirm?',
  title,
  ariaLabel,
  icon,
  className = '',
  confirmClassName = '',
  compact = false,
  timeoutMs = 4000
}) => {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirming(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setConfirming(false);
    }, timeoutMs);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timerRef.current) clearTimeout(timerRef.current);
    setConfirming(false);
    onConfirm();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timerRef.current) clearTimeout(timerRef.current);
    setConfirming(false);
  };

  if (confirming) {
    return (
      <div
        className="inline-flex items-center gap-1"
        role="group"
        aria-label={ariaLabel || title || 'Confirm action'}
      >
        <button
          type="button"
          onClick={handleConfirm}
          className={
            confirmClassName ||
            (compact
              ? 'px-2 py-1 rounded-md bg-rose-500 hover:bg-rose-400 text-white text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap'
              : 'px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap')
          }
        >
          <Check className="w-3 h-3 shrink-0" />
          <span>{confirmLabel}</span>
        </button>
        <button
          type="button"
          onClick={handleCancel}
          title="Cancel"
          aria-label="Cancel action"
          className={
            compact
              ? 'p-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors cursor-pointer'
              : 'p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors cursor-pointer'
          }
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={startConfirm}
      title={title}
      aria-label={ariaLabel || title || label}
      className={className}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
};
