# API Specification

This document outlines the expected API endpoints and response formats for the Smart Agriculture Dashboard backend.

## Base URL
```
http://localhost:8000/api
```

## Endpoints

### 1. Get All Sensors

**Endpoint:** `GET /sensors`

**Description:** Retrieves a list of all sensor nodes with their latest readings.

**Response (200 OK):**
```json
[
  {
    "id": "SENSOR_001",
    "location": "North_Field",
    "temperature": 28.5,
    "humidity": 65.3,
    "lastUpdated": "2026-03-31T14:30:00Z",
    "timestamp": "2026-03-31T14:30:00Z"
  },
  {
    "id": "SENSOR_002",
    "location": "Tomato_Greenhouse",
    "temperature": 32.1,
    "humidity": 72.8,
    "lastUpdated": "2026-03-31T14:29:30Z",
    "timestamp": "2026-03-31T14:29:30Z"
  }
]
```

**Error (500):**
```json
{
  "error": "Failed to fetch sensors",
  "message": "Database connection error"
}
```

---

### 2. Get Single Sensor Details

**Endpoint:** `GET /sensor/{id}`

**Parameters:**
- `id` (string, required): Sensor ID (e.g., "SENSOR_001")

**Description:** Retrieves detailed information about a specific sensor.

**Response (200 OK):**
```json
{
  "id": "SENSOR_001",
  "location": "North_Field",
  "temperature": 28.5,
  "humidity": 65.3,
  "lastUpdated": "2026-03-31T14:30:00Z",
  "timestamp": "2026-03-31T14:30:00Z",
  "status": "Active",
  "batteryLevel": 85,
  "signalStrength": 95
}
```

**Error (404):**
```json
{
  "error": "Sensor not found",
  "message": "SENSOR_001 does not exist"
}
```

---

### 3. Get Sensor Historical Data (Last 24 Hours)

**Endpoint:** `GET /sensor/{id}/history`

**Parameters:**
- `id` (string, required): Sensor ID
- `limit` (integer, optional): Maximum number of records to return (default: 1000)
- `startDate` (string, optional): Start date in ISO format (e.g., 2026-03-30T00:00:00Z)
- `endDate` (string, optional): End date in ISO format

**Description:** Retrieves historical readings for a sensor over the last 24 hours.

**Response (200 OK):**
```json
[
  {
    "timestamp": "2026-03-31T14:00:00Z",
    "temperature": 28.2,
    "humidity": 65.1
  },
  {
    "timestamp": "2026-03-31T13:45:00Z",
    "temperature": 27.8,
    "humidity": 64.9
  },
  {
    "timestamp": "2026-03-31T13:30:00Z",
    "temperature": 27.5,
    "humidity": 64.7
  }
]
```

**Error (404):**
```json
{
  "error": "No data available",
  "message": "No historical data found for SENSOR_001"
}
```

---

### 4. Get Sensor Statistics

**Endpoint:** `GET /sensor/{id}/stats`

**Parameters:**
- `id` (string, required): Sensor ID

**Description:** Retrieves aggregated statistics for a sensor.

**Response (200 OK):**
```json
{
  "sensorId": "SENSOR_001",
  "period": "24h",
  "temperature": {
    "min": 22.5,
    "max": 32.1,
    "avg": 28.3,
    "current": 28.5
  },
  "humidity": {
    "min": 58.2,
    "max": 72.8,
    "avg": 65.5,
    "current": 65.3
  },
  "status": "Active",
  "dataPoints": 288
}
```

---

## Expected Data Fields

### Sensor Object
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique sensor identifier (e.g., "SENSOR_001") |
| location | string | Sensor location name (e.g., "North_Field", "Tomato_Greenhouse") |
| temperature | number | Temperature reading in Celsius |
| humidity | number | Humidity reading in percentage (0-100) |
| lastUpdated | string | ISO 8601 timestamp of last reading |
| timestamp | string | ISO 8601 timestamp of last reading (alternative field) |
| status | string | Sensor status ("Active" or "Inactive") |

### Reading Object
| Field | Type | Description |
|-------|------|-------------|
| timestamp | string | ISO 8601 timestamp |
| temperature | number | Temperature in Celsius |
| humidity | number | Humidity in percentage |

---

## Implementation Notes

### Status Determination
- **Active**: Sensor has sent data within the last 60 seconds
- **Inactive**: No data received for more than 60 seconds

### Timestamps
- All timestamps should be in ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`
- Times should be in UTC (Z suffix)

### CORS Requirements
The API should have CORS headers configured to allow requests from the frontend:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Rate Limiting (Recommended)
- Implement rate limiting to prevent abuse
- Suggested: 100 requests per minute per client

### Error Handling
All errors should return appropriate HTTP status codes:
- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Example Usage

### Fetch all sensors
```bash
curl -X GET http://localhost:8000/api/sensors
```

### Fetch sensor details
```bash
curl -X GET http://localhost:8000/api/sensor/SENSOR_001
```

### Fetch historical data for last 24 hours
```bash
curl -X GET http://localhost:8000/api/sensor/SENSOR_001/history
```

### Fetch historical data with limit
```bash
curl -X GET http://localhost:8000/api/sensor/SENSOR_001/history?limit=100
```

---

## Testing

### Using Mock Data
To test the frontend without a backend, set `USE_MOCK_DATA = true` in `src/services/api.js`.

This will use sample data from `src/services/mockData.js` for all API calls.

---

## Integration

The frontend expects these endpoints to be available at the URL specified in the `.env` file:
```
REACT_APP_API_URL=http://localhost:8000/api
```

Ensure your backend server is running and configured to serve these endpoints before starting the frontend application.
