import React from "react";
import { Activity, Thermometer, Droplets } from "lucide-react";

const DashboardOverview = ({ sensors, loading }) => {
  const activeSensors = sensors.filter((s) => s.status === "Active").length;
  const inactiveSensors = sensors.filter((s) => s.status === "Inactive").length;
  
  const avgTemperature =
    sensors.length > 0
      ? (sensors.reduce((sum, s) => sum + (s.temperature || 0), 0) / sensors.length).toFixed(1)
      : 0;
  
  const avgHumidity =
    sensors.length > 0
      ? (sensors.reduce((sum, s) => sum + (s.humidity || 0), 0) / sensors.length).toFixed(1)
      : 0;

  const StatCard = ({ title, value, icon: Icon, bgColor, textColor }) => (
    <div className={`${bgColor} rounded-lg shadow-md p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{loading ? "..." : value}</p>
        </div>
        <Icon className="w-12 h-12 opacity-30" />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <StatCard
        title="Total Sensors"
        value={sensors.length}
        icon={Activity}
        bgColor="bg-blue-500"
        textColor="text-blue-600"
      />
      <StatCard
        title="Active Sensors"
        value={activeSensors}
        icon={Activity}
        bgColor="bg-green-500"
        textColor="text-green-600"
      />
      <StatCard
        title="Inactive Sensors"
        value={inactiveSensors}
        icon={Activity}
        bgColor="bg-gray-500"
        textColor="text-gray-600"
      />
      <StatCard
        title="Avg Temperature"
        value={`${avgTemperature}°C`}
        icon={Thermometer}
        bgColor="bg-red-500"
        textColor="text-red-600"
      />
      <StatCard
        title="Avg Humidity"
        value={`${avgHumidity}%`}
        icon={Droplets}
        bgColor="bg-cyan-500"
        textColor="text-cyan-600"
      />
    </div>
  );
};

export default DashboardOverview;
