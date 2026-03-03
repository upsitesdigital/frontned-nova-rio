"use client";

import type { DotProps } from "recharts";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

interface DsLineChartDataPoint {
  label: string;
  value: number;
}

interface DsLineChartProps {
  data: DsLineChartDataPoint[];
  color?: string;
  yAxisFormatter?: (value: number) => string;
  yAxisTicks?: number[];
  tooltipFormatter?: (value: number) => string;
  height?: number;
  showGrid?: boolean;
  className?: string;
}

const GRADIENT_ID = "ds-line-chart-area-gradient";
const DOT_SHADOW_ID = "ds-line-chart-dot-shadow";

function ChartDot({ cx, cy, fill }: DotProps & { fill: string }) {
  if (cx == null || cy == null) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={fill}
      stroke="white"
      strokeWidth={2}
      filter={`url(#${DOT_SHADOW_ID})`}
    />
  );
}

function ChartActiveDot({ cx, cy, fill }: DotProps & { fill: string }) {
  if (cx == null || cy == null) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill={fill}
      stroke="white"
      strokeWidth={2}
      filter={`url(#${DOT_SHADOW_ID})`}
    />
  );
}

function DsLineChart({
  data,
  color = "#00a77e",
  yAxisFormatter,
  yAxisTicks,
  tooltipFormatter,
  height = 350,
  showGrid = true,
  className,
}: DsLineChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
          <defs>
            <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <filter id={DOT_SHADOW_ID} x="-100%" y="-100%" width="300%" height="300%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={color} floodOpacity="0.2" />
            </filter>
          </defs>

          {showGrid && (
            <CartesianGrid stroke="#efefef" strokeDasharray="0" />
          )}

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 14,
              fill: "#4b4b4b",
              fontFamily: "var(--font-work-sans), sans-serif",
            }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 16,
              fill: "#4b4b4b",
              fontFamily: "var(--font-work-sans), sans-serif",
              letterSpacing: "-0.64px",
            }}
            tickFormatter={yAxisFormatter}
            ticks={yAxisTicks}
            dx={-8}
            width={72}
            domain={
              yAxisTicks
                ? [yAxisTicks[0]!, yAxisTicks[yAxisTicks.length - 1]!]
                : undefined
            }
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #efefef",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "var(--font-work-sans), sans-serif",
              boxShadow: "0px 12px 44px rgba(111, 124, 142, 0.1)",
              padding: "8px 12px",
            }}
            formatter={(value: number | undefined) => [
              value != null
                ? tooltipFormatter
                  ? tooltipFormatter(value)
                  : value.toLocaleString("pt-BR")
                : "",
              "",
            ]}
            labelStyle={{ color: "#4b4b4b", fontWeight: 500, marginBottom: 2 }}
            cursor={{ stroke: "#efefef", strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill={`url(#${GRADIENT_ID})`}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={<ChartDot fill={color} />}
            activeDot={<ChartActiveDot fill={color} />}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export { DsLineChart, type DsLineChartProps, type DsLineChartDataPoint };
