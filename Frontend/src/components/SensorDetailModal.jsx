import React from "react";
import { X, Loader } from "lucide-react";
import { useSensorDetail } from "../hooks/useSensorDetail";
import { formatTemperature, formatHumidity, formatTimestamp, getStatusColor } from "../utils/helpers";
import TrendChart from "./TrendChart";

const SensorDetailModal = ({ sensor, isOpen, onClose }) => {
  const { history, loading, error } = useSensorDetail(sensor?.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Sensor Details</h2>
            <p className="text-blue-100 text-sm mt-1 font-mono">{sensor?.id}</p>
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
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-l-4 border-blue-500">
                  <h3 className="text-sm font-bold text-blue-900 mb-4">Sensor Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-xs font-semibold text-blue-700">Sensor ID</dt>
                      <dd className="text-sm font-mono text-blue-900 mt-1">{sensor?.id}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-blue-700">Location</dt>
                      <dd className="text-sm text-blue-900 mt-1">{sensor?.location}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-blue-700">Status</dt>
                      <dd className="mt-1">
                        <span
                          className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: getStatusColor(sensor?.status) }}
                        >
                          {sensor?.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Latest Readings */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl p-5 border-l-4 border-cyan-500">
                  <h3 className="text-sm font-bold text-cyan-900 mb-4">Latest Readings</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-xs font-semibold text-cyan-700">Temperature</dt>
                      <dd className="text-sm font-bold text-orange-600 mt-1">
                        {formatTemperature(sensor?.temperature)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-cyan-700">Humidity</dt>
                      <dd className="text-sm font-bold text-blue-600 mt-1">
                        {formatHumidity(sensor?.humidity)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-cyan-700">Last Updated</dt>
                      <dd className="text-sm text-cyan-900 mt-1">
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
                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">Recent Readings</h3>
                  <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
                          <th className="px-4 py-3 text-left font-bold text-blue-700">
                            Timestamp
                          </th>
                          <th className="px-4 py-3 text-left font-bold text-blue-700">
                            Temperature
                          </th>
                          <th className="px-4 py-3 text-left font-bold text-blue-700">
                            Humidity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.slice(0, 10).map((reading, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-gray-700">
                              {formatTimestamp(reading.timestamp)}
                            </td>
                            <td className="px-4 py-3 text-orange-600 font-semibold">
                              {formatTemperature(reading.temperature)}
                            </td>
                            <td className="px-4 py-3 text-blue-600 font-semibold">
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
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-t-2 border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SensorDetailModal;
