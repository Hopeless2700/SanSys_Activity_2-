import React, { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useSensorData } from "./hooks/useSensorData";
import DashboardOverview from "./components/DashboardOverview";
import SensorTable from "./components/SensorTable";
import SensorDetailModal from "./components/SensorDetailModal";

function App() {
  const { sensors, loading, error, lastUpdated, refresh } = useSensorData();
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRowClick = (sensor) => {
    setSelectedSensor(sensor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSensor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Smart Agriculture Dashboard</h1>
              <p className="text-blue-100 text-sm mt-1">
                IoT Sensor Monitoring System
              </p>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
          {lastUpdated && (
            <p className="text-blue-100 text-xs mt-4">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Error Loading Data</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button
                onClick={refresh}
                className="mt-2 text-sm font-semibold text-red-700 hover:text-red-900 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Overview */}
        <DashboardOverview sensors={sensors} loading={loading} />

        {/* Sensor Data Table */}
        <SensorTable
          sensors={sensors}
          loading={loading}
          onRowClick={handleRowClick}
        />
      </main>

      {/* Sensor Detail Modal */}
      <SensorDetailModal
        sensor={selectedSensor}
        isOpen={showModal}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>Smart Agriculture IoT Dashboard &copy; 2026</p>
          <p className="mt-1">
            Real-time environmental monitoring system for smart farms
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
