import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

/**
 * Simple composed chart: area (avg score) + bars (mocks completed)
 * Dark theme styling to fit your dashboard.
 */
const data = [
  { day: "Oct 28", mocks: 1, score: 62 },
  { day: "Oct 30", mocks: 2, score: 69 },
  { day: "Nov 1",  mocks: 1, score: 74 },
  { day: "Nov 3",  mocks: 3, score: 72 },
  { day: "Nov 5",  mocks: 2, score: 77 },
  { day: "Nov 7",  mocks: 2, score: 81 },
  { day: "Nov 9",  mocks: 1, score: 85 },
];

export default function PerformanceChart() {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 12, right: 24, left: 0, bottom: 6 }}>
          <defs>
            <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="gradMocks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#80ed99" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#80ed99" stopOpacity={0.05}/>
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#9CA3AF"
            tickFormatter={v => `${v}%`}
            domain={[50, 'dataMax + 10']}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#9CA3AF"
            tick={{ fontSize: 12 }}
            allowDecimals={false}
            domain={[0, 'dataMax + 1']}
          />

          <Tooltip
            wrapperStyle={{ background: "#0b1220", border: "1px solid rgba(255,255,255,0.06)" }}
            contentStyle={{ background: "#071226", border: "none", color: "#e6eef8" }}
            labelStyle={{ color: "#9CA3AF" }}
          />

          <Legend wrapperStyle={{ color: "#9CA3AF", paddingTop: 6 }} />

          {/* Bars: mocks completed */}
          <Bar
            yAxisId="right"
            dataKey="mocks"
            barSize={16}
            fill="#80ed99"
            radius={[8,8,0,0]}
            name="Mocks"
          />

          {/* Area: avg score */}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            fill="url(#gradScore)"
            activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
            name="Avg. Score"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
