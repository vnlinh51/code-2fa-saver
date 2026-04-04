interface CountdownBarProps {
  progress: number;   // 0-100
  secondsLeft: number;
}

export function CountdownBar({ progress, secondsLeft }: CountdownBarProps) {
  const isUrgent = secondsLeft <= 5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-surface-tertiary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${progress}%`,
            background: isUrgent
              ? 'linear-gradient(90deg, #ef4444, #f97316)'
              : 'linear-gradient(90deg, #4f6ef7, #7c3aed)',
          }}
        />
      </div>
      <span
        className={`text-xs font-mono tabular-nums font-medium min-w-[20px] text-right ${
          isUrgent ? 'text-red-400' : 'text-slate-400'
        }`}
      >
        {secondsLeft}s
      </span>
    </div>
  );
}
