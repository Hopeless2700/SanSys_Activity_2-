# Smart Agriculture IoT Dashboard

A modern React-based dashboard for monitoring environmental sensors in a smart farm using IoT technology.

## Features

✅ **Dashboard Overview**
- Real-time summary of all sensor nodes
- Display of active/inactive sensors count
- Average temperature and humidity metrics

✅ **Sensor Data Table**
- Complete list of all sensors with current readings
- Search functionality (by location or sensor ID)
- Filter by sensor status (Active/Inactive)
- Sort by temperature, humidity, or last update time
- Quick view details button for each sensor

✅ **Real-Time Auto-Refresh**
- Automatic data polling every 5 seconds
- Dynamic UI updates without page reload
- Last updated timestamp display

✅ **Sensor Detail Modal**
- Detailed sensor information
- Latest temperature and humidity readings
- Status indicator with color coding
- Historical data table (last 10 readings)
- 24-hour trend visualization charts

✅ **Data Visualization**
- Line charts showing temperature and humidity trends
- Dual-axis charts for comprehensive data view
- Responsive and interactive charts

✅ **Status Logic**
- Green status for active sensors
- Gray status for inactive sensors
- Automatically marks as inactive after 1 minute of no data

✅ **Responsive Design**
- Desktop and mobile optimized
- Clean, modern UI with Tailwind CSS
- Color-coded status indicators

## Tech Stack

- **React 18** - UI framework
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint in `.env`:
```
REACT_APP_API_URL=http://localhost:8000/api
```

4. Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── DashboardOverview.jsx    # Summary cards component
│   │   ├── SensorTable.jsx          # Data table with filters/sort
│   │   ├── SensorDetailModal.jsx    # Detail view modal with charts
│   │   └── TrendChart.jsx           # Historical data visualization
│   ├── hooks/
│   │   ├── useSensorData.js         # Sensor list hook with polling
│   │   └── useSensorDetail.js       # Sensor detail hook
│   ├── services/
│   │   └── api.js                   # API endpoints
│   ├── utils/
│   │   ├── constants.js             # App constants
│   │   └── helpers.js               # Utility functions
│   ├── App.jsx                      # Main application component
│   ├── index.jsx                    # React entry point
│   ├── index.css                    # Global styles
│   └── .env                         # Environment configuration
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## API Integration

The dashboard expects the following API endpoints:

### GET /api/sensors
Returns list of all sensors with current readings.

**Response Format:**
```json
[
  {
    "id": "SENSOR_001",
    "location": "North_Field",
    "temperature": 28.5,
    "humidity": 65.3,
    "lastUpdated": "2026-03-31T14:30:00Z",
    "status": "Active"
  }
]
```

### GET /api/sensor/{id}
Returns detailed information about a specific sensor.

**Response Format:**
```json
{
  "id": "SENSOR_001",
  "location": "North_Field",
  "temperature": 28.5,
  "humidity": 65.3,
  "lastUpdated": "2026-03-31T14:30:00Z",
  "status": "Active"
}
```

### GET /api/sensor/{id}/history
Returns historical data for the last 24 hours.

**Response Format:**
```json
[
  {
    "timestamp": "2026-03-31T14:30:00Z",
    "temperature": 28.5,
    "humidity": 65.3
  }
]
```

## Configuration

### Polling Interval
Change the auto-refresh interval in `src/utils/constants.js`:
```javascript
export const POLLING_INTERVAL = 5000; // milliseconds
```

### Inactivity Timeout
Change the inactivity threshold in `src/utils/constants.js`:
```javascript
export const INACTIVITY_TIMEOUT = 60000; // 1 minute
```

## Usage

1. **View Dashboard Overview**: Main page loads with sensor summary statistics
2. **Search/Filter Sensors**: Use the search bar to find sensors by location or ID
3. **Filter by Status**: Select "Active Only" or "Inactive Only" from the status dropdown
4. **Sort Data**: Click column headers to sort by temperature, humidity, or timestamp
5. **View Sensor Details**: Click "View Details" button to see detailed information and historical trends

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Notes

- Data updates every 5 seconds automatically
- Sensors marked as inactive after 1 minute of no data received
- Charts show up to 24 hours of historical data
- Responsive tables optimize for mobile viewing

## Future Enhancements

- [ ] Data export functionality (CSV, PDF)
- [ ] Custom alert thresholds
- [ ] Multi-sensor comparison view
- [ ] Historical data filtering by date range
- [ ] User preferences and dark mode
- [ ] Real-time notifications

## License

MIT

## Support

For issues or questions, please contact the development team.

---

**Last Updated**: March 31, 2026
