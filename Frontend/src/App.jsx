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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Smart Agriculture Dashboard</h1>
              <p className="text-blue-100 text-sm mt-2">
                Real-Time IoT Environmental Monitoring System
              </p>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
          {lastUpdated && (
            <p className="text-blue-100 text-xs mt-4 opacity-80">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3 shadow-md">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-900 text-lg">Error Loading Data</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button
                onClick={refresh}
                className="mt-3 text-sm font-bold text-red-700 hover:text-red-900 underline"
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
      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-gray-300 py-8 mt-16 border-t-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p className="font-semibold text-white">Smart Agriculture IoT Dashboard &copy; 2026</p>
          <p className="mt-2 text-gray-400">
            Advanced real-time environmental monitoring for intelligent farming systems
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
