import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TrendChart = ({ data, title = "Trends", height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-500">No historical data available</p>
      </div>
    );
  }

  // Format data for recharts
  const chartData = data.map((item) => ({
    timestamp: formatChartTimestamp(item.timestamp),
    temperature: item.temperature,
    humidity: item.humidity,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: 12 }}
            stroke="#9CA3AF"
          />
          <YAxis
            yAxisId="left"
            stroke="#EF4444"
            tick={{ fontSize: 12 }}
            label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#3B82F6"
            tick={{ fontSize: 12 }}
            label={{ value: "Humidity (%)", angle: 90, position: "insideRight" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #E5E7EB",
              borderRadius: "0.5rem",
              color: "#FFFFFF",
            }}
            formatter={(value) => value?.toFixed(2)}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            stroke="#EF4444"
            dot={false}
            isAnimationActive={false}
            name="Temperature (°C)"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="humidity"
            stroke="#3B82F6"
            dot={false}
            isAnimationActive={false}
            name="Humidity (%)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Format timestamp for chart display
 */
const formatChartTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default TrendChart;
