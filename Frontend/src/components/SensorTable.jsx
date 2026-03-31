import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { formatTemperature, formatHumidity, formatTimestamp, filterSensors, sortSensors, getStatusColor } from "../utils/helpers";

const SensorTable = ({ sensors, loading, onRowClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filter and sort sensors
  const processedSensors = useMemo(() => {
    let result = filterSensors(sensors, searchTerm, statusFilter);
    result = sortSensors(result, sortBy, sortOrder);
    return result;
  }, [sensors, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <ChevronUp className="w-4 h-4 text-gray-400" />;
    return sortOrder === "asc" 
      ? <ChevronUp className="w-4 h-4 text-blue-500" />
      : <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  const StatusBadge = ({ status }) => (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: getStatusColor(status) }}
    >
      {status}
    </span>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header with Filters */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sensor Data</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location or sensor ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Sensor ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Location
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("temperature")}
              >
                <div className="flex items-center gap-2">
                  Temperature
                  <SortIcon column="temperature" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("humidity")}
              >
                <div className="flex items-center gap-2">
                  Humidity
                  <SortIcon column="humidity" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("timestamp")}
              >
                <div className="flex items-center gap-2">
                  Last Update
                  <SortIcon column="timestamp" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Loading sensors...
                </td>
              </tr>
            ) : processedSensors.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No sensors found
                </td>
              </tr>
            ) : (
              processedSensors.map((sensor) => (
                <tr
                  key={sensor.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onRowClick(sensor)}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono">
                    {sensor.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {sensor.location || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="text-red-600 font-semibold">
                      {formatTemperature(sensor.temperature)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="text-blue-600 font-semibold">
                      {formatHumidity(sensor.humidity)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatTimestamp(sensor.lastUpdated || sensor.timestamp)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={sensor.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="px-4 py-2 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      {processedSensors.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {processedSensors.length} of {sensors.length} sensors
        </div>
      )}
    </div>
  );
};

export default SensorTable;
