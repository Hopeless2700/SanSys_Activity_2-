# Quick Reference Card

## Installation & Running

```bash
# Install dependencies
cd Frontend
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

## Key Directories

| Path | Purpose |
|------|---------|
| `src/components/` | React components (4 files) |
| `src/hooks/` | Custom hooks (2 files) |
| `src/services/` | API client and mock data |
| `src/utils/` | Helper functions and constants |

---

## Components at a Glance

| Component | Purpose | Location |
|-----------|---------|----------|
| DashboardOverview | 5 summary cards | `components/` |
| SensorTable | Data table with filters | `components/` |
| SensorDetailModal | Detailed view + charts | `components/` |
| TrendChart | Historical data chart | `components/` |

---

## Custom Hooks

| Hook | Purpose | Returns |
|------|---------|---------|
| `useSensorData()` | Auto-polling sensors | `{sensors, loading, error, lastUpdated, refresh}` |
| `useSensorDetail(id)` | Fetch sensor details | `{detail, history, loading, error}` |

---

## Important Constants

| Constant | Value | Location |
|-----------|-------|----------|
| `POLLING_INTERVAL` | 5000ms | `utils/constants.js` |
| `INACTIVITY_TIMEOUT` | 60000ms | `utils/constants.js` |
| `API_BASE_URL` | env variable | `.env` |

---

## Key Helper Functions

```javascript
// Status determination
getSensorStatus(lastUpdateTime) → "Active" | "Inactive"

// Formatting
formatTemperature(28.5) → "28.5°C"
formatHumidity(65.3) → "65.3%"
formatTimestamp(date) → "5m ago" or "14:30"

// Data processing
filterSensors(sensors, search, status) → filtered array
sortSensors(sensors, column, order) → sorted array
calculateAverage(values) → number
```

---

## API Endpoints Expected

```javascript
GET /api/sensors
GET /api/sensor/{id}
GET /api/sensor/{id}/history
GET /api/sensor/{id}/stats
```

---

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

---

## Tailwind Classes Used

**Common:**
```
bg-{color}-{shade}
text-{color}-{shade}
p-{size}, m-{size}
flex, grid, grid-cols-{n}
rounded-lg, shadow-md
```

**Examples:**
```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  <p className="font-bold text-lg">Title</p>
</div>
```

---

## Color Palette

| Color | Usage | Hex |
|-------|-------|-----|
| Green | Active status | #10B981 |
| Gray | Inactive status | #9CA3AF |
| Red | Temperature | #EF4444 |
| Blue | Humidity | #3B82F6 |
| Primary | Headers | #1F2937 |

---

## File Checklist

Core Files:
- ✅ src/App.jsx
- ✅ src/index.jsx
- ✅ src/index.css
- ✅ src/components/* (4 files)
- ✅ src/hooks/* (2 files)
- ✅ src/services/* (2 files)
- ✅ src/utils/* (2 files)
- ✅ public/index.html
- ✅ .env
- ✅ package.json
- ✅ tailwind.config.js
- ✅ postcss.config.js

Documentation:
- ✅ README.md
- ✅ DEVELOPMENT.md
- ✅ INSTALLATION.md
- ✅ API_SPECIFICATION.md
- ✅ ARCHITECTURE.md
- ✅ PROJECT_SUMMARY.md
- ✅ QUICK_REFERENCE.md (this file)

---

## Common Tasks

### Use Mock Data
Edit `src/services/api.js`:
```javascript
const USE_MOCK_DATA = true;
```

### Change Polling Interval
Edit `src/utils/constants.js`:
```javascript
export const POLLING_INTERVAL = 3000; // 3 seconds
```

### Add New Sensor Field
1. Update API response format
2. Add field to `useSensorData()` hook
3. Display in components

### Customize Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: "#YOUR_COLOR",
    }
  }
}
```

---

## Dependencies Overview

```json
{
  "react": "UI framework",
  "axios": "API calls",
  "recharts": "Charts",
  "tailwindcss": "Styling",
  "lucide-react": "Icons",
  "react-scripts": "Build tool"
}
```

---

## Quick Troubleshooting

**Dashboard blank:**
- Check `REACT_APP_API_URL` in `.env`
- Verify backend is running
- Check browser console (F12)

**Styles not applied:**
- Hard refresh (Ctrl+Shift+R)
- Restart dev server

**API errors:**
- Verify backend URL
- Check CORS headers
- Test with curl/Postman

**Port 3000 in use:**
- Kill process on port 3000
- Or use: `PORT=3001 npm start`

---

## Key Metrics

| Metric | Value |
|--------|-------|
| Total Files | 21 |
| Components | 4 |
| Custom Hooks | 2 |
| Helper Functions | 15+ |
| Lines of Code | 1,500+ |
| Load Time | < 2s |
| API Poll Interval | 5s |

---

## Important Links

- React Docs: https://react.dev
- Tailwind: https://tailwindcss.com
- Recharts: https://recharts.org
- Axios: https://axios-http.com

---

## Useful Commands

```bash
# Development
npm start                # Start dev server
npm install             # Install dependencies
npm run build          # Production build

# Debugging
npm test               # Run tests
npm run eject         # Eject (not recommended)

# Cleanup
rm -rf node_modules   # Delete node_modules
rm package-lock.json  # Delete lock file
npm install           # Fresh install
```

---

## Component Props Example

```jsx
// DashboardOverview
<DashboardOverview sensors={sensors} loading={loading} />

// SensorTable
<SensorTable 
  sensors={sensors} 
  loading={loading} 
  onRowClick={handleRowClick} 
/>

// SensorDetailModal
<SensorDetailModal 
  sensor={selectedSensor} 
  isOpen={showModal} 
  onClose={handleCloseModal} 
/>

// TrendChart
<TrendChart 
  data={history} 
  title="24-Hour Trends" 
  height={350} 
/>
```

---

## Data Flow Summary

```
App mounts
  ↓
useSensorData() hook
  ↓
fetchSensors() from API
  ↓
Data enhanced with status
  ↓
Components receive data
  ↓
Every 5 seconds: refresh
```

---

## Status Codes

| Status | Meaning | Color |
|--------|---------|-------|
| Active | Data < 60s ago | Green |
| Inactive | Data > 60s ago | Gray |

---

## File Size Estimates

| Component | Size |
|-----------|------|
| DashboardOverview.jsx | ~2KB |
| SensorTable.jsx | ~4KB |
| SensorDetailModal.jsx | ~5KB |
| TrendChart.jsx | ~3KB |
| useSensorData.js | ~1.5KB |
| useSensorDetail.js | ~1KB |
| api.js | ~2KB |
| helpers.js | ~4KB |

---

**Quick Reference Version**: 1.0  
**Last Updated**: March 31, 2026
