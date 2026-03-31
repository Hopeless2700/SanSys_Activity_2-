# Architecture & Features Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Dashboard)               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App.jsx (Main Container)                │   │
│  └──────────────────────────────────────────────────────┘   │
│           ┌─────────────┬─────────────┬────────────────┐   │
│           ▼             ▼             ▼                ▼   │
│  ┌─────────────────┐ ┌─────────────┐ ┌──────────────┐     │
│  │ DashboardOverv. │ │ SensorTable │ │ DetailModal  │     │
│  └─────────────────┘ └─────────────┘ └──────────────┘     │
│           │             │             │                     │
│           └─────────────┴─────────────┘                     │
│                     │                                       │
│        ┌────────────┴───────────────┐                      │
│        ▼                            ▼                       │
│  ┌──────────────────────┐    ┌─────────────────┐          │
│  │   useSensorData()    │    │ useSensorDetail │          │
│  │  (Auto-polling)      │    │  (On demand)    │          │
│  └──────────────────────┘    └─────────────────┘          │
│        │                            │                       │
│        └────────────┬───────────────┘                      │
│                     ▼                                       │
│        ┌─────────────────────────────┐                    │
│        │   API Service (api.js)      │                    │
│        │   - fetchSensors()          │                    │
│        │   - fetchSensorDetail()     │                    │
│        │   - fetchSensorHistory()    │                    │
│        └────────────┬────────────────┘                    │
│                     │                                       │
│        ┌────────────▼────────────┐                         │
│        │  Mock or Real API       │                         │
│        │  (PHP Backend)          │                         │
│        └─────────────────────────┘                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Breakdown

### 1. Dashboard Overview
**Location**: `components/DashboardOverview.jsx`

**Features**:
- Total sensors count
- Active sensors count
- Inactive sensors count
- Average temperature
- Average humidity

**Data Flow**:
```
App -> useSensorData() -> fetchSensors() -> Display cards
```

**Auto-Update**: Every 5 seconds

---

### 2. Sensor Data Table
**Location**: `components/SensorTable.jsx`

**Features**:
- Display all sensors in table format
- Real-time data (auto-updates)
- Columns: ID, Location, Temp, Humidity, Last Update, Status, Action

**Filtering**:
- Search by location or sensor ID
- Filter by status (All, Active, Inactive)

**Sorting**:
- Temperature (ascending/descending)
- Humidity (ascending/descending)
- Timestamp (ascending/descending)

**Interaction**:
- Click row to view details
- Click "View Details" button to open modal

**Performance**:
- Processes data in-memory with useMemo
- Handles 1000+ sensors smoothly

---

### 3. Real-Time Auto-Refresh
**Location**: `hooks/useSensorData.js`

**Features**:
- Automatic polling every 5 seconds
- Updates sensor status automatically
- Detects inactive sensors after 60 seconds
- Configurable polling interval

**Implementation**:
```javascript
useEffect(() => {
  const interval = setInterval(refreshSensors, POLLING_INTERVAL);
  return () => clearInterval(interval);
}, []);
```

---

### 4. Sensor Detail Modal
**Location**: `components/SensorDetailModal.jsx`

**Sections**:
1. **Sensor Information**
   - Sensor ID (mono font)
   - Location
   - Current Status (colored badge)

2. **Latest Readings**
   - Current Temperature (red)
   - Current Humidity (blue)
   - Last Updated time

3. **Historical Chart**
   - 24-hour trends
   - Dual-axis graph
   - Temperature and humidity overlay

4. **Recent Readings Table**
   - Last 10 readings
   - Timestamp, Temperature, Humidity
   - Hover effect on rows

**Data Loading**:
- Parallel API requests
- Optimized performance with Promise.all()
- Loading state indicator

---

### 5. Trend Visualization
**Location**: `components/TrendChart.jsx`

**Chart Type**: Line Chart (Recharts)

**Features**:
- Dual Y-axes:
  - Left: Temperature (Red)
  - Right: Humidity (Blue)
- Interactive tooltips
- Legend
- Responsive sizing
- Custom styling

**Data Format**:
```json
[
  {
    "timestamp": "2026-03-31T14:00:00Z",
    "temperature": 28.5,
    "humidity": 65.3
  }
]
```

---

### 6. Status Indicator System
**Location**: `utils/helpers.js`

**Status Determination**:
```javascript
- Active: Last update < 60 seconds ago
- Inactive: Last update > 60 seconds ago
```

**Color Coding**:
- Active: Green (#10B981)
- Inactive: Gray (#9CA3AF)

**Usage in Components**:
```jsx
<StatusBadge status={sensor.status} />
```

---

## Data Flow

### Initial Load
```
1. App mounts
2. useSensorData() -> fetchSensors()
3. API returns sensor list
4. useSensorData adds status to each sensor
5. DashboardOverview displays stats
6. SensorTable displays data
```

### Auto-Refresh (Every 5s)
```
1. setInterval triggers refreshSensors()
2. fetchSensors() called
3. New status calculated for each sensor
4. UI re-renders with updated data
5. Chart updates if modal is open
```

### Modal View
```
1. User clicks sensor row
2. setSelectedSensor() called
3. SensorDetailModal opens with sensor ID
4. useSensorDetail() fetches detail + history
5. Chart and readings display
6. Auto-updates history if detail refreshed
```

---

## Component Hierarchy

```
App
├── Header
│   ├── Title
│   ├── Refresh Button
│   └── Last Updated Time
├── Main Content
│   ├── Error Alert (conditional)
│   ├── DashboardOverview
│   │   ├── StatCard (Total)
│   │   ├── StatCard (Active)
│   │   ├── StatCard (Inactive)
│   │   ├── StatCard (Avg Temp)
│   │   └── StatCard (Avg Humidity)
│   └── SensorTable
│       ├── Filter Section
│       │   ├── Search Input
│       │   └── Status Select
│       ├── Table
│       │   ├── Header Row
│       │   └── Data Rows (with Status Badge)
│       └── Footer Info
├── SensorDetailModal
│   ├── Header (with Close)
│   ├── Content
│   │   ├── Sensor Info Card
│   │   ├── Latest Readings Card
│   │   ├── TrendChart
│   │   └── Recent Readings Table
│   └── Footer (Close Button)
└── Footer
```

---

## Hooks & Custom Logic

### useSensorData()
**Purpose**: Fetch and manage sensor list with auto-refresh

**Returns**:
```javascript
{
  sensors: [],           // Array of sensor objects
  loading: boolean,      // Loading state
  error: string,        // Error message
  lastUpdated: Date,    // Timestamp of last update
  refresh: function     // Manual refresh function
}
```

**Features**:
- Auto-polling
- Status calculation
- Error handling
- Manual refresh capability

### useSensorDetail()
**Purpose**: Fetch sensor details and historical data

**Returns**:
```javascript
{
  detail: {},           // Sensor detail object
  history: [],          // Array of historical readings
  loading: boolean,     // Loading state
  error: string        // Error message
}
```

**Features**:
- Parallel data fetching
- Memoized requests
- Error handling
- Automatic cleanup

---

## Helper Functions

### getSensorStatus(lastUpdateTime)
- Determines if sensor is Active/Inactive
- Configurable timeout threshold

### formatTemperature(temp)
- Formats to 1 decimal with °C

### formatHumidity(humidity)
- Formats to 1 decimal with %

### formatTimestamp(timestamp)
- "Just now", "5m ago", "2h ago", or date+time

### filterSensors(sensors, searchTerm, statusFilter)
- Filters array by search and status
- Case-insensitive search

### sortSensors(sensors, sortBy, sortOrder)
- Sorts by temperature, humidity, or timestamp
- Supports ascending/descending

### calculateAverage(values)
- Calculates mean of value array

### getStatusColor(status)
- Returns hex color code for status

---

## API Integration Points

### Endpoints Used
1. `GET /api/sensors` - Sensor list (polled every 5s)
2. `GET /api/sensor/{id}` - Single sensor detail
3. `GET /api/sensor/{id}/history` - Historical data

### Error Handling
- Try-catch blocks on all API calls
- User-friendly error messages
- Retry button in UI
- Fallback to previous data

### Request/Response Format

**Request Headers**:
```
Content-Type: application/json
```

**Response Format**:
```json
{
  "id": "string",
  "location": "string",
  "temperature": "number",
  "humidity": "number",
  "lastUpdated": "ISO string",
  "status": "Active|Inactive"
}
```

---

## UI/UX Design Principles

### Color Scheme
- **Primary**: Blue (#1F2937, #3B82F6)
- **Success**: Green (#10B981) - Active status
- **Danger**: Gray (#9CA3AF) - Inactive status
- **Temperature**: Red (#EF4444)
- **Humidity**: Blue (#3B82F6)
- **Background**: Light gray (#F3F4F6)

### Typography
- Headers: Bold, larger sizes
- Labels: Medium weight, smaller
- Code/IDs: Monospace font

### Spacing
- Consistent padding (1rem, 2rem)
- Grid layout with gaps
- Mobile-first responsive design

### Interactions
- Hover effects on rows
- Click feedback on buttons
- Loading spinners
- Smooth transitions

---

## Performance Considerations

### Optimization Techniques
1. **useMemo**: Filter/sort operations
2. **useCallback**: Event handlers (if needed)
3. **Lazy Loading**: Modal on demand
4. **Virtualization**: Large tables (if needed)
5. **Debouncing**: Search input (future)

### Memory Management
- Cleanup intervals in useEffect return
- Proper state cleanup
- No memory leaks in event listeners

### Rendering Optimization
- Only re-render when dependencies change
- Avoid inline object creation
- useCallback for stable references

---

## Browser & Device Support

### Desktop (Full Features)
- Chrome, Firefox, Safari, Edge (latest)
- 100% responsive
- Full feature set

### Tablet (Excellent)
- iPad (iOS 12+)
- Android tablets
- Responsive table & modals

### Mobile (Good)
- iOS 12+ Safari
- Android 6+ Chrome
- Stacked layout
- Touch-friendly buttons

---

## Testing Capabilities

### Manual Testing
- Use mock data for features test
- Test all sorting combinations
- Test search across all fields
- Test filter combinations
- Test modal open/close
- Test error states

### Automated Testing (Future)
- Unit tests for helpers
- Component snapshot tests
- Integration tests
- E2E tests with Cypress

---

## Extensibility

### Adding New Features
1. **New Sensor Metric**: Add calculation in helpers
2. **New Chart Type**: Create new component in TrendChart
3. **New Data Filter**: Update SensorTable filter logic
4. **New API Endpoint**: Add function to services/api.js

### Customization Points
- Colors in `tailwind.config.js`
- Polling interval in `utils/constants.js`
- API URLs in `.env`
- Chart configuration in `TrendChart.jsx`

---

## Deployment Readiness

### Production Build
```bash
npm run build
```

### Optimization
- Code splitting (automatic)
- Minification (automatic)
- Asset optimization (automatic)

### Environment Configuration
- Set production API URL in `.env`
- Configure CORS on backend
- Set secure storage for sensitive data

---

## Documentation & Code Quality

### Code Standards
- ES6+ syntax
- Functional components with hooks
- Meaningful variable names
- Comment complex logic
- Consistent formatting

### File Organization
- Components in `/components`
- Custom hooks in `/hooks`
- Services in `/services`
- Utils and helpers in `/utils`

### Documentation
- README.md: Quick start
- DEVELOPMENT.md: Developer guide
- API_SPECIFICATION.md: API details
- INSTALLATION.md: Setup guide
- Inline code comments

---

**Version**: 1.0.0  
**Last Updated**: March 31, 2026
