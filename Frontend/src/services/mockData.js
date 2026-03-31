/**
 * Mock sensor data for development and testing
 * This data structure should match the API responses
 */

export const mockSensors = [
  {
    id: "SENSOR_001",
    location: "North_Field",
    temperature: 28.5,
    humidity: 65.3,
    lastUpdated: new Date(Date.now() - 2 * 60000).toISOString(),
    status: "Active",
  },
  {
    id: "SENSOR_002",
    location: "Tomato_Greenhouse",
    temperature: 32.1,
    humidity: 72.8,
    lastUpdated: new Date(Date.now() - 30000).toISOString(),
    status: "Active",
  },
  {
    id: "SENSOR_003",
    location: "South_Field",
    temperature: 26.3,
    humidity: 58.2,
    lastUpdated: new Date(Date.now() - 80000).toISOString(),
    status: "Inactive",
  },
  {
    id: "SENSOR_004",
    location: "Lettuce_House",
    temperature: 24.7,
    humidity: 68.9,
    lastUpdated: new Date(Date.now() - 5000).toISOString(),
    status: "Active",
  },
  {
    id: "SENSOR_005",
    location: "Water_Reservoir",
    temperature: 22.4,
    humidity: 55.1,
    lastUpdated: new Date(Date.now() - 120000).toISOString(),
    status: "Inactive",
  },
];

export const mockHistory = [
  { timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(), temperature: 26.2, humidity: 62.1 },
  { timestamp: new Date(Date.now() - 23 * 60 * 60000).toISOString(), temperature: 27.1, humidity: 63.4 },
  { timestamp: new Date(Date.now() - 22 * 60 * 60000).toISOString(), temperature: 28.3, humidity: 64.2 },
  { timestamp: new Date(Date.now() - 21 * 60 * 60000).toISOString(), temperature: 29.5, humidity: 65.8 },
  { timestamp: new Date(Date.now() - 20 * 60 * 60000).toISOString(), temperature: 30.1, humidity: 67.2 },
  { timestamp: new Date(Date.now() - 19 * 60 * 60000).toISOString(), temperature: 31.2, humidity: 68.5 },
  { timestamp: new Date(Date.now() - 18 * 60 * 60000).toISOString(), temperature: 32.4, humidity: 70.1 },
  { timestamp: new Date(Date.now() - 12 * 60 * 60000).toISOString(), temperature: 31.8, humidity: 69.3 },
  { timestamp: new Date(Date.now() - 6 * 60 * 60000).toISOString(), temperature: 30.5, humidity: 67.9 },
  { timestamp: new Date(Date.now() - 60000).toISOString(), temperature: 28.5, humidity: 65.3 },
];

/**
 * Mock API function to simulate API calls during development
 */
export const mockApiCall = (endpoint, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint === "/sensors") {
        resolve(mockSensors);
      } else if (endpoint.includes("/history")) {
        resolve(mockHistory);
      }
    }, delay);
  });
};
