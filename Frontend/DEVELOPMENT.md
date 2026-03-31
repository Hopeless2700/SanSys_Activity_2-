# Development Guide

## Getting Started

### Prerequisites
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (comes with Node.js)
- **Backend**: PHP/MySQL API server

### Quick Start

```bash
# 1. Navigate to the Frontend directory
cd Frontend

# 2. Install dependencies
npm install

# 3. Configure environment
# Edit .env and set your API URL (default is http://localhost:8000/api)

# 4. Start development server
npm start
```

The application will automatically open at `http://localhost:3000`

---

## Project Structure Explained

```
Frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # React components
│   │   ├── DashboardOverview.jsx      # Summary statistics cards
│   │   ├── SensorTable.jsx            # Main data table with filters
│   │   ├── SensorDetailModal.jsx      # Modal for sensor details
│   │   └── TrendChart.jsx             # Chart for historical data
│   ├── hooks/                  # Custom React hooks
│   │   ├── useSensorData.js           # Auto-refresh sensor list
│   │   └── useSensorDetail.js         # Load sensor details & history
│   ├── services/               # API and data services
│   │   ├── api.js                    # API client
│   │   └── mockData.js               # Mock data for development
│   ├── utils/                  # Utility functions
│   │   ├── constants.js              # App constants
│   │   └── helpers.js                # Helper functions
│   ├── App.jsx                 # Main application component
│   ├── index.jsx               # React DOM render
│   ├── index.css               # Global styles
│   └── .env                    # Environment configuration
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── README.md
├── API_SPECIFICATION.md
└── DEVELOPMENT.md
```

---

## Key Features & How They Work

### 1. Dashboard Overview
- Located in `components/DashboardOverview.jsx`
- Displays 5 key metrics cards
- Data comes from `useSensorData()` hook
- Automatically updates every 5 seconds

### 2. Sensor Table
- Located in `components/SensorTable.jsx`
- Features:
  - **Search**: Filter by location or sensor ID
  - **Filter**: Show all, active only, or inactive only
  - **Sort**: Click column headers to sort
  - **Action Buttons**: Click row or "View Details" to open modal

### 3. Real-Time Updates
- Implemented in `hooks/useSensorData.js`
- Polls API every 5 seconds (configurable in `utils/constants.js`)
- Automatically updates sensor status:
  - Active: Data received within last 60 seconds
  - Inactive: No data for more than 60 seconds

### 4. Sensor Detail Modal
- Located in `components/SensorDetailModal.jsx`
- Shows:
  - Current readings
  - Status indicator
  - 24-hour historical chart
  - Recent readings table
- Triggered when clicking on a sensor row

### 5. Trend Charts
- Located in `components/TrendChart.jsx`
- Built with Recharts library
- Dual-axis chart with:
  - Temperature (left axis)
  - Humidity (right axis)
- Responsive and interactive

---

## Configuration

### API Endpoint
Edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

### Polling Interval
Edit `src/utils/constants.js`:
```javascript
export const POLLING_INTERVAL = 5000; // milliseconds
```

### Inactivity Timeout
Edit `src/utils/constants.js`:
```javascript
export const INACTIVITY_TIMEOUT = 60000; // 1 minute
```

### Using Mock Data
For development without backend, edit `src/services/api.js`:
```javascript
const USE_MOCK_DATA = true; // Set to true for mock data
```

---

## Available Scripts

### Development
```bash
npm start
```
Starts the development server with hot reload.
Visit [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `build/` directory.

### Running Tests
```bash
npm test
```
Launches the test runner in interactive mode.

### Eject Configuration (Not Recommended)
```bash
npm run eject
```
**Warning**: This is a one-way operation. Once you eject, you can't go back.

---

## Common Development Tasks

### Adding a New Component

1. Create file in `src/components/MyComponent.jsx`:
```jsx
import React from "react";

const MyComponent = (props) => {
  return (
    <div className="bg-white p-4 rounded-lg">
      {/* Your component code */}
    </div>
  );
};

export default MyComponent;
```

2. Import and use in `App.jsx` or another component:
```jsx
import MyComponent from "./components/MyComponent";

// In your JSX:
<MyComponent />
```

### Adding a New API Endpoint

1. Add function to `src/services/api.js`:
```javascript
export const fetchNewData = async () => {
  try {
    const response = await api.get("/new-endpoint");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
```

2. Use in a component with a custom hook or directly with `useEffect`

### Creating a Custom Hook

1. Create file in `src/hooks/useMyHook.js`:
```javascript
import { useState, useEffect } from "react";

export const useMyHook = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Your logic here
  }, []);

  return { data, loading };
};
```

2. Use in components:
```jsx
import { useMyHook } from "../hooks/useMyHook";

const MyComponent = () => {
  const { data, loading } = useMyHook();
  // Use data in your component
};
```

### Adding Tailwind CSS Styles

The project uses Tailwind CSS for styling. Use utility classes directly in JSX:

```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
  Styled with Tailwind
</div>
```

Common utilities:
- Margin/Padding: `m-4`, `p-2`, `mx-auto`, `py-6`
- Colors: `bg-blue-500`, `text-gray-700`, `border-gray-300`
- Layout: `flex`, `grid`, `grid-cols-3`
- Typography: `text-lg`, `font-bold`, `text-center`

---

## Debugging

### React DevTools
Install React DevTools browser extension for Chrome or Firefox:
- Chrome: [React DevTools](https://chrome.google.com/webstore)
- Firefox: [React DevTools](https://addons.mozilla.org/firefox/)

### Console Logging
Use browser console to inspect:
```javascript
console.log("Current sensors:", sensors);
```

### Network Tab
Check API requests in browser DevTools > Network tab:
- Verify API calls are being made
- Check response data format
- Look for errors (red status codes)

### React Profiler
Use React DevTools Profiler to identify performance issues

---

## Testing with Mock Data

### Enable Mock Data
In `src/services/api.js`:
```javascript
const USE_MOCK_DATA = true;
```

### Mock Data Available
Check `src/services/mockData.js` for available mock datasets:
- `mockSensors`: 5 sample sensors
- `mockHistory`: 24 hours of historical data

### Sample Testing Workflow
1. Enable mock data
2. `npm start`
3. Dashboard should show mock sensors
4. Click "View Details" to see mock history chart
5. Test filters, search, and sorting

---

## Performance Optimization Tips

### 1. Component Memoization
```javascript
import { memo } from "react";

const MyComponent = memo(({ data }) => {
  return <div>{data}</div>;
});
```

### 2. useMemo for Expensive Calculations
```javascript
import { useMemo } from "react";

const filteredData = useMemo(() => {
  return sensors.filter(s => s.status === "Active");
}, [sensors]);
```

### 3. Lazy Loading Components
```javascript
import { lazy, Suspense } from "react";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

<Suspense fallback={<div>Loading...</div>}>
  <HeavyComponent />
</Suspense>
```

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### API Connection Error
- Check backend is running
- Verify API URL in `.env`
- Check CORS configuration on backend
- Use Network tab in DevTools

### Module Not Found Error
- Run `npm install` again
- Check import paths are correct
- Restart development server

### Styles Not Applying
- Ensure Tailwind classes are spelled correctly
- Check `tailwind.config.js` includes all necessary paths
- Clear browser cache and hard refresh (Ctrl+Shift+R)

---

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy

### Deploy to Vercel
1. Import project from Git
2. Vercel auto-detects React configuration
3. Click Deploy
4. Set environment variables

### Deploy Locally
```bash
npm run build
npx serve -s build
```

---

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest | ✅ Full |
| Firefox | Latest | ✅ Full |
| Safari | Latest | ✅ Full |
| Edge | Latest | ✅ Full |
| IE 11 | Any | ❌ Not supported |

---

## Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Axios Documentation](https://axios-http.com)
- [Lucide Icons](https://lucide.dev)

---

## Support & Contributing

For issues or questions:
1. Check existing issues in GitHub
2. Create a new issue with detailed description
3. Include screenshots if possible
4. Follow the issue template

---

## License

MIT

---

**Last Updated**: March 31, 2026
