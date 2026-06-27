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
import { cn } from "@/lib/core/utils";

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

const gradientId = "ds-line-chart-area-gradient";
const dotShadowId = "ds-line-chart-dot-shadow";

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
      filter={`url(#${dotShadowId})`}
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
      filter={`url(#${dotShadowId})`}
    />
  );
}

function DsLineChart({
  data,
  color = "var(--nova-primary)",
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
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <filter id={dotShadowId} x="-100%" y="-100%" width="300%" height="300%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={color} floodOpacity="0.2" />
            </filter>
          </defs>

          {showGrid && <CartesianGrid stroke="var(--nova-gray-100)" strokeDasharray="0" />}

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 14,
              fill: "var(--nova-gray-700)",
              fontFamily: "var(--font-work-sans), sans-serif",
            }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 16,
              fill: "var(--nova-gray-700)",
              fontFamily: "var(--font-work-sans), sans-serif",
              letterSpacing: "-0.64px",
            }}
            tickFormatter={yAxisFormatter}
            ticks={yAxisTicks}
            dx={-8}
            width={72}
            domain={yAxisTicks ? [yAxisTicks[0]!, yAxisTicks[yAxisTicks.length - 1]!] : undefined}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid var(--nova-gray-100)",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "var(--font-work-sans), sans-serif",
              boxShadow: "var(--nova-shadow-soft-strong)",
              padding: "8px 12px",
            }}
            formatter={(value) => [
              typeof value === "number"
                ? tooltipFormatter
                  ? tooltipFormatter(value)
                  : value.toLocaleString("pt-BR")
                : String(value ?? ""),
              "",
            ]}
            labelStyle={{ color: "var(--nova-gray-700)", fontWeight: 500, marginBottom: 2 }}
            cursor={{ stroke: "var(--nova-gray-100)", strokeWidth: 1 }}
          />

          <Area type="monotone" dataKey="value" stroke="none" fill={`url(#${gradientId})`} />

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
