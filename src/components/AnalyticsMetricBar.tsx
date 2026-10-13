import React, { useEffect, useRef, useState } from 'react';

export type MetricBarColor = 'cyan' | 'blue' | 'emerald' | 'gold' | 'red';

interface AnalyticsMetricBarProps {
  percentage?: number; // 0 to 100 (defaults to 100)
  delayMs?: number; // delay before starting the load animation
  color?: MetricBarColor;
  className?: string;
  heightPx?: number; // thin height in pixels (default 2.5px)
}

export const AnalyticsMetricBar: React.FC<AnalyticsMetricBarProps> = ({
  percentage = 100,
  delayMs = 100,
  color = 'cyan',
  className = '',
  heightPx = 2.5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [fillWidth, setFillWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check if already in viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 50) {
      setInView(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01,
        rootMargin: '50px 0px 50px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!inView) return;

    const timer = setTimeout(() => {
      setFillWidth(Math.min(100, Math.max(0, percentage)));
    }, delayMs);

    return () => clearTimeout(timer);
  }, [inView, percentage, delayMs]);

  // Glowing Cyan & Glass Color Gradient Themes
  let gradientClass = 'from-cyan-500/40 via-cyan-400 to-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.8)]';
  if (color === 'blue') {
    gradientClass = 'from-blue-500/40 via-blue-400 to-sky-300 shadow-[0_0_10px_rgba(96,165,250,0.6)]';
  } else if (color === 'emerald') {
    gradientClass = 'from-emerald-500/40 via-emerald-400 to-teal-300 shadow-[0_0_10px_rgba(52,211,153,0.6)]';
  } else if (color === 'gold') {
    gradientClass = 'from-[#E5A93C]/40 via-[#E5A93C] to-[#F59E0B] shadow-[0_0_8px_rgba(229,169,60,0.6)]';
  } else if (color === 'red') {
    gradientClass = 'from-rose-500/40 via-rose-400 to-amber-400 shadow-[0_0_10px_rgba(244,63,94,0.6)]';
  }

  return (
    <div
      ref={containerRef}
      className={`w-full bg-cyan-950/30 border border-cyan-500/10 rounded-full overflow-hidden relative ${className}`}
      style={{ height: `${heightPx}px` }}
      aria-hidden="true"
    >
      <div
        className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-1000 ease-out`}
        style={{
          width: `${fillWidth}%`,
          willChange: 'width'
        }}
      />
    </div>
  );
};

interface AnimatedKpiCardProps {
  value: string;
  label: string;
  sublabel?: string;
  percentage?: number;
  color?: MetricBarColor;
  delayMs?: number;
}

export const AnimatedKpiCard: React.FC<AnimatedKpiCardProps> = ({
  value,
  label,
  sublabel,
  percentage = 100,
  color = 'cyan',
  delayMs = 0
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [displayedValue, setDisplayedValue] = useState('');

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 50) {
      setInView(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01,
        rootMargin: '50px 0px 50px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!inView) return;

    // Smooth reveal of numerical value
    const match = value.match(/^([0-9.]+)(.*)$/);
    if (!match) {
      setDisplayedValue(value);
      return;
    }

    const targetNum = parseFloat(match[1]);
    const suffix = match[2];
    const isDecimal = match[1].includes('.');
    const duration = 900; // ms
    const startTime = performance.now();

    const animateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeOut * targetNum;

      if (isDecimal) {
        setDisplayedValue(`${currentVal.toFixed(1)}${suffix}`);
      } else {
        setDisplayedValue(`${Math.round(currentVal)}${suffix}`);
      }

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        setDisplayedValue(value);
      }
    };

    const delayTimeout = setTimeout(() => {
      requestAnimationFrame(animateNumber);
    }, delayMs);

    return () => clearTimeout(delayTimeout);
  }, [inView, value, delayMs]);

  return (
    <div
      ref={cardRef}
      className="p-4 sm:p-5 rounded-2xl glass-card flex flex-col justify-between group"
    >
      <div>
        <div className="font-display font-extrabold text-2xl sm:text-4xl text-white group-hover:text-cyan-300 transition-colors tracking-tight font-mono tabular-nums">
          {displayedValue || value}
        </div>
        <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
          {label}
        </div>
        {sublabel && (
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            {sublabel}
          </div>
        )}
      </div>

      {/* Thin loading bar under the info that loads when appearing in view */}
      <div className="mt-3.5 pt-1">
        <AnalyticsMetricBar
          percentage={percentage}
          delayMs={delayMs}
          color={color}
          heightPx={2.5}
        />
      </div>
    </div>
  );
};
