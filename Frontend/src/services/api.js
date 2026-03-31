import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { mockSensors, mockHistory } from "./mockData";

// Set to true to use mock data for development
const USE_MOCK_DATA = false;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/**
 * Fetch all sensors
 */
export const fetchSensors = async () => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSensors), 300);
    });
  }

  try {
    const response = await api.get("/sensors");
    return response.data;
  } catch (error) {
    console.error("Error fetching sensors:", error);
    throw error;
  }
};

/**
 * Fetch single sensor details
 */
export const fetchSensorDetail = async (sensorId) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      const sensor = mockSensors.find((s) => s.id === sensorId);
      setTimeout(() => resolve(sensor || {}), 300);
    });
  }

  try {
    const response = await api.get(`/sensor/${sensorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sensor ${sensorId}:`, error);
    throw error;
  }
};

/**
 * Fetch historical data for a sensor (last 24 hours)
 */
export const fetchSensorHistory = async (sensorId) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockHistory), 300);
    });
  }

  try {
    const response = await api.get(`/sensor/${sensorId}/history`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for sensor ${sensorId}:`, error);
    throw error;
  }
};

/**
 * Fetch sensor statistics
 */
export const fetchSensorStats = async (sensorId) => {
  try {
    const response = await api.get(`/sensor/${sensorId}/stats`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stats for sensor ${sensorId}:`, error);
    throw error;
  }
};

export default api;
