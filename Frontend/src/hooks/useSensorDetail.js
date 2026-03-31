import { useState, useEffect } from "react";
import { fetchSensorDetail, fetchSensorHistory } from "../services/api";

/**
 * Custom hook to fetch sensor details and historical data
 */
export const useSensorDetail = (sensorId) => {
  const [detail, setDetail] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sensorId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch detail and history in parallel
        const [detailData, historyData] = await Promise.all([
          fetchSensorDetail(sensorId),
          fetchSensorHistory(sensorId),
        ]);

        setDetail(detailData);
        setHistory(Array.isArray(historyData) ? historyData : []);
      } catch (err) {
        setError(err.message || "Failed to fetch sensor details");
        console.error("Error in useSensorDetail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sensorId]);

  return {
    detail,
    history,
    loading,
    error,
  };
};
