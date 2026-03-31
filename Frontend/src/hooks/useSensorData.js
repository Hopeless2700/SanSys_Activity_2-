import { useState, useEffect } from "react";
import { fetchSensors } from "../services/api";
import { POLLING_INTERVAL } from "../utils/constants";
import { getSensorStatus } from "../utils/helpers";

/**
 * Custom hook to fetch and manage sensor data with auto-refresh
 */
export const useSensorData = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refreshSensors = async () => {
    try {
      setError(null);
      const data = await fetchSensors();
      
      // Enhance sensor data with status
      const enhancedSensors = Array.isArray(data) 
        ? data.map((sensor) => ({
            ...sensor,
            status: getSensorStatus(sensor.lastUpdated || sensor.timestamp),
          }))
        : [];
      
      setSensors(enhancedSensors);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Failed to fetch sensors");
      console.error("Error in useSensorData:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    refreshSensors();
  }, []);

  // Setup auto-refresh polling
  useEffect(() => {
    const interval = setInterval(refreshSensors, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return {
    sensors,
    loading,
    error,
    lastUpdated,
    refresh: refreshSensors,
  };
};
