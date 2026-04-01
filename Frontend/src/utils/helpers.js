import { INACTIVITY_TIMEOUT } from "./constants";

/**
 * Determine sensor status based on last update time
 */
export const getSensorStatus = (lastUpdateTime) => {
  if (!lastUpdateTime) return "Inactive";
  
  const now = new Date().getTime();
  const lastUpdate = new Date(lastUpdateTime).getTime();
  const timeDiff = now - lastUpdate;
  
  return timeDiff > INACTIVITY_TIMEOUT ? "Inactive" : "Active";
};

/**
 * Format temperature value
 */
export const formatTemperature = (temp) => {
  return temp ? `${temp.toFixed(1)}°C` : "N/A";
};

/**
 * Format humidity value
 */
export const formatHumidity = (humidity) => {
  return humidity ? `${humidity.toFixed(1)}%` : "N/A";
};

/**
 * Format timestamp to readable format
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "No data";
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit" 
  });
};

/**
 * Format timestamp to exact local date and time
 */
export const formatDateTimeExact = (timestamp) => {
  if (!timestamp) return "No data";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Calculate average of array
 */
export const calculateAverage = (values) => {
  if (!values || values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Get status color
 */
export const getStatusColor = (status) => {
  return status === "Active" ? "#10B981" : "#9CA3AF";
};

/**
 * Filter sensors based on search term
 */
export const filterSensors = (sensors, searchTerm, statusFilter) => {
  return sensors.filter((sensor) => {
    const matchesSearch = 
      !searchTerm || 
      sensor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "All" || 
      sensor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
};

/**
 * Sort sensors
 */
export const sortSensors = (sensors, sortBy, sortOrder) => {
  const sorted = [...sensors];
  
  sorted.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case "temperature":
        aValue = a.temperature || 0;
        bValue = b.temperature || 0;
        break;
      case "humidity":
        aValue = a.humidity || 0;
        bValue = b.humidity || 0;
        break;
      case "timestamp":
        aValue = new Date(a.lastUpdated || 0).getTime();
        bValue = new Date(b.lastUpdated || 0).getTime();
        break;
      default:
        return 0;
    }
    
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });
  
  return sorted;
};
