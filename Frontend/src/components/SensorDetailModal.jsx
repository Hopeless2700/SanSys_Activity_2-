import React from "react";
import { X, Loader } from "lucide-react";
import { useSensorDetail } from "../hooks/useSensorDetail";
import { formatTemperature, formatHumidity, formatTimestamp, getStatusColor } from "../utils/helpers";
import TrendChart from "./TrendChart";

const SensorDetailModal = ({ sensor, isOpen, onClose }) => {
  const { detail, history, loading, error } = useSensorDetail(sensor?.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Sensor Details</h2>
            <p className="text-blue-100 text-sm">{sensor?.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading sensor data...</span>
            </div>
          ) : (
            <>
              {/* Sensor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-4">Sensor Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Sensor ID</dt>
                      <dd className="text-sm font-mono text-gray-900 mt-1">{sensor?.id}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Location</dt>
                      <dd className="text-sm text-gray-900 mt-1">{sensor?.location}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: getStatusColor(sensor?.status) }}
                        >
                          {sensor?.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Latest Readings */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-4">Latest Readings</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Temperature</dt>
                      <dd className="text-sm font-semibold text-red-600 mt-1">
                        {formatTemperature(sensor?.temperature)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Humidity</dt>
                      <dd className="text-sm font-semibold text-blue-600 mt-1">
                        {formatHumidity(sensor?.humidity)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Last Updated</dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        {formatTimestamp(sensor?.lastUpdated || sensor?.timestamp)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Historical Data Chart */}
              {history && history.length > 0 && (
                <div className="mb-6">
                  <TrendChart data={history} title="Last 24 Hours Trends" height={350} />
                </div>
              )}

              {/* Historical Data Table */}
              {history && history.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Recent Readings</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Timestamp
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Temperature
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Humidity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.slice(0, 10).map((reading, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="px-4 py-2 text-gray-900">
                              {formatTimestamp(reading.timestamp)}
                            </td>
                            <td className="px-4 py-2 text-red-600 font-semibold">
                              {formatTemperature(reading.temperature)}
                            </td>
                            <td className="px-4 py-2 text-blue-600 font-semibold">
                              {formatHumidity(reading.humidity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SensorDetailModal;
