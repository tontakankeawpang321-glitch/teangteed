import React from 'react';
import { CandleData } from '../types';

interface CandleVisualizerProps {
  candles: CandleData[];
  height?: number;
  width?: number;
  interactive?: boolean;
}

export const CandleVisualizer: React.FC<CandleVisualizerProps> = React.memo(({
  candles,
  height = 130,
  width = 240,
}) => {
  if (!candles || candles.length === 0) return null;

  // Find min and max for scaling
  const allHighs = candles.map((c) => c.high);
  const allLows = candles.map((c) => c.low);
  const maxVal = Math.max(...allHighs, 100);
  const minVal = Math.min(...allLows, 0);
  const range = maxVal - minVal || 1;

  const paddingY = 16;
  const usableHeight = height - paddingY * 2;

  // Scale function to SVG Y coordinate
  const scaleY = (val: number) => {
    return height - paddingY - ((val - minVal) / range) * usableHeight;
  };

  const candleCount = candles.length;
  const candleSpacing = width / (candleCount + 1);
  const bodyWidth = Math.min(Math.max(12, (width / candleCount) * 0.42), 28);

  return (
    <div className="relative w-full flex items-center justify-center bg-slate-50/90 rounded-xl p-1.5 sm:p-2 border border-slate-200 shadow-xs overflow-hidden">
      {/* Subtle grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none opacity-60" />

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-h-[140px] select-none block overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Zero / Baseline guide */}
        <line
          x1={6}
          y1={scaleY((maxVal + minVal) / 2)}
          x2={width - 6}
          y2={scaleY((maxVal + minVal) / 2)}
          stroke="#cbd5e1"
          strokeDasharray="3,3"
          strokeWidth={0.8}
          opacity={0.7}
        />

        {candles.map((candle, idx) => {
          const cx = candleSpacing * (idx + 1);
          const yHigh = scaleY(candle.high);
          const yLow = scaleY(candle.low);
          const yOpen = scaleY(candle.open);
          const yClose = scaleY(candle.close);

          const isGreen =
            candle.color === 'green' ||
            (candle.color !== 'red' && candle.color !== 'gray' && candle.close >= candle.open);
          const isRed =
            candle.color === 'red' ||
            (candle.color !== 'green' && candle.color !== 'gray' && candle.close < candle.open);
          const isDoji = candle.color === 'gray' || Math.abs(candle.open - candle.close) <= 2;

          const topBody = Math.min(yOpen, yClose);
          const rawHeight = Math.abs(yClose - yOpen);
          const bodyHeight = isDoji ? 2.5 : Math.max(rawHeight, 4);

          const mainColor = isDoji ? '#64748b' : isGreen ? '#16a34a' : '#dc2626';

          return (
            <g key={idx}>
              {/* Highlight background if key candle */}
              {candle.isKey && (
                <rect
                  x={cx - bodyWidth / 2 - 3}
                  y={4}
                  width={bodyWidth + 6}
                  height={height - 8}
                  fill="rgba(245, 158, 11, 0.14)"
                  rx={4}
                  stroke="rgba(217, 119, 6, 0.35)"
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />
              )}

              {/* Upper / Lower Wick */}
              <line
                x1={cx}
                y1={yHigh}
                x2={cx}
                y2={yLow}
                stroke={mainColor}
                strokeWidth={isDoji ? 1.8 : 2.2}
                strokeLinecap="round"
              />

              {/* Candle Body */}
              <rect
                x={cx - bodyWidth / 2}
                y={topBody}
                width={bodyWidth}
                height={bodyHeight}
                fill={isDoji ? '#94a3b8' : mainColor}
                rx={isDoji ? 1 : 1.5}
                stroke={mainColor}
                strokeWidth={1}
              />

              {/* Candle Label below */}
              {candle.label && (
                <text
                  x={cx}
                  y={height - 3}
                  textAnchor="middle"
                  fill={candle.isKey ? '#b45309' : '#64748b'}
                  fontSize={8.5}
                  fontWeight={candle.isKey ? '700' : '500'}
                  className="select-none tracking-tight font-mono"
                >
                  {candle.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
});

CandleVisualizer.displayName = 'CandleVisualizer';

