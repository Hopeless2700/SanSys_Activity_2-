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
    <div className={`${bgColor} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-4xl font-bold mt-2">{loading ? "..." : value}</p>
        </div>
        <Icon className="w-14 h-14 opacity-25" />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
      <StatCard
        title="Total Sensors"
        value={sensors.length}
        icon={Activity}
        bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
        textColor="text-blue-600"
      />
      <StatCard
        title="Active Sensors"
        value={activeSensors}
        icon={Activity}
        bgColor="bg-gradient-to-br from-emerald-500 to-emerald-600"
        textColor="text-green-600"
      />
      <StatCard
        title="Inactive Sensors"
        value={inactiveSensors}
        icon={Activity}
        bgColor="bg-gradient-to-br from-slate-500 to-slate-600"
        textColor="text-gray-600"
      />
      <StatCard
        title="Avg Temperature"
        value={`${avgTemperature}°C`}
        icon={Thermometer}
        bgColor="bg-gradient-to-br from-orange-500 to-red-600"
        textColor="text-red-600"
      />
      <StatCard
        title="Avg Humidity"
        value={`${avgHumidity}%`}
        icon={Droplets}
        bgColor="bg-gradient-to-br from-cyan-500 to-blue-600"
        textColor="text-cyan-600"
      />
    </div>
  );
};

export default DashboardOverview;
