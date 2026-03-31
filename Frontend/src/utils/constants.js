// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
export const POLLING_INTERVAL = 5000; // 5 seconds
export const INACTIVITY_TIMEOUT = 60000; // 1 minute for marking sensor as inactive

// Sensor Status
export const SENSOR_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

// Color codes
export const STATUS_COLORS = {
  Active: "#10B981", // Green
  Inactive: "#9CA3AF", // Gray
};

export const TEMPERATURE_COLOR = "#EF4444"; // Red
export const HUMIDITY_COLOR = "#3B82F6"; // Blue
