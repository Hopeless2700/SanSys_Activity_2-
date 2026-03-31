# Installation & Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd Frontend
npm install
```

### Step 2: Configure Backend API
Edit `.env` file:
```
REACT_APP_API_URL=http://localhost:8000/api
```

### Step 3: Start Development Server
```bash
npm start
```

Your dashboard will open at [http://localhost:3000](http://localhost:3000)

---

## Detailed Installation

### System Requirements

**Minimum:**
- Node.js: v14.0.0+
- npm: v6.0.0+
- RAM: 2GB
- Disk Space: 500MB

**Recommended:**
- Node.js: v18.0.0 LTE
- npm: v9.0.0+
- RAM: 4GB+
- Disk Space: 1GB+

### Installation Steps

#### 1. Install Node.js and npm

**Windows:**
- Download from [nodejs.org](https://nodejs.org)
- Run installer and follow prompts
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm
```

#### 2. Clone or Download Project

```bash
# If using Git
git clone <your-repo-url>
cd Frontend

# Or extract ZIP file and navigate to Frontend folder
cd Frontend
```

#### 3. Install Project Dependencies

```bash
npm install
```

This will:
- Create `node_modules/` directory
- Download all required packages
- Setup project configuration

**Installation Time:** 2-5 minutes depending on internet speed

#### 4. Configure Environment

Create or edit `.env` file:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# Environment
REACT_APP_ENV=development
```

**For Production:**
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_ENV=production
```

#### 5. Start Development Server

```bash
npm start
```

Expected output:
```
Compiled successfully!

You can now view smart-agriculture-dashboard in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

---

## Troubleshooting Installation

### Issue: "Node not found"
**Solution:**
- Verify Node.js installation: `node --version`
- Add Node.js to PATH (Windows)
- Restart terminal/command prompt
- Reinstall Node.js if necessary

### Issue: "npm ERR! code ERESOLVE"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installation again
npm install
```

### Issue: Port 3000 Already in Use
**Windows:**
```bash
# Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

### Issue: "Cannot find module" Error
**Solution:**
```bash
# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

---

## Verification Checklist

After installation, verify everything works:

- [ ] `npm install` completed without errors
- [ ] `.env` file configured with API URL
- [ ] `npm start` compiled successfully
- [ ] Browser opened with dashboard at localhost:3000
- [ ] Dashboard displays mock/real sensor data
- [ ] Console shows no errors (F12)
- [ ] Can click on sensors to view details

---

## Using Mock Data

To test without backend:

**In `src/services/api.js`, change:**
```javascript
const USE_MOCK_DATA = false;
```
**To:**
```javascript
const USE_MOCK_DATA = true;
```

Then:
- Restart development server: `npm start`
- Dashboard will show sample sensor data
- All features work with mock data

---

## Development Workflow

### Daily Development

```bash
# 1. Start the dev server
npm start

# 2. Make code changes (auto-reload)
# Edit src/components/DashboardOverview.jsx (for example)
# Changes automatically appear in browser

# 3. Use React DevTools to debug (browser extension)

# 4. Stop the server
# Press Ctrl+C in terminal
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Output will be in ./build/ directory
# Ready to deploy to hosting service
```

---

## Project Structure Overview

```
Frontend/
├── node_modules/              # Installed dependencies (gitignored)
├── public/
│   └── index.html             # Main HTML file
├── src/
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API services
│   ├── utils/                 # Helper functions
│   ├── App.jsx                # Main component
│   ├── index.jsx              # Entry point
│   └── index.css              # Global styles
├── .env                       # Environment configuration
├── .gitignore                 # Git ignore file
├── package.json               # Dependencies & scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── README.md                  # Project documentation
├── API_SPECIFICATION.md       # API specifications
└── DEVELOPMENT.md             # Development guide
```

---

## Environment Variables

### Available Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:8000/api` | Backend API endpoint |
| `REACT_APP_ENV` | `development` | Environment (development/production) |

### Adding New Variables

1. Add to `.env`:
```env
REACT_APP_MY_VAR=value
```

2. Access in code:
```javascript
const myVar = process.env.REACT_APP_MY_VAR;
```

**Note:** All custom variables must start with `REACT_APP_` prefix.

---

## Installed Dependencies

### Core Dependencies
- **react@18.2.0**: UI Framework
- **react-dom@18.2.0**: DOM rendering
- **axios@1.6.0**: HTTP client

### UI & Styling
- **tailwindcss@3.3.0**: CSS framework
- **lucide-react@0.263.0**: Icon library

### Data Visualization
- **recharts@2.10.0**: Charting library

### Build Tools
- **react-scripts@5.0.1**: Build and test scripts
- **postcss@8.4.24**: CSS processing
- **autoprefixer@10.4.14**: CSS vendor prefixes

---

## Next Steps After Installation

### 1. Connect to Backend
- Ensure PHP backend is running
- Update API URL in `.env`
- Test API endpoints with Postman

### 2. Customize Dashboard
- Edit colors in `tailwind.config.js`
- Modify components in `src/components/`
- Add new features as needed

### 3. Development
- Read `DEVELOPMENT.md` for detailed guide
- Review `API_SPECIFICATION.md` for backend requirements
- Check components for code structure

### 4. Deployment
- Run `npm run build`
- Follow deployment platform instructions
- Set production environment variables

---

## Getting Help

### Resources
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/guide)
- [Axios Documentation](https://axios-http.com/docs/intro)

### Common Issues

**Dashboard shows "No sensors found"**
- Check API connection
- Verify API URL in `.env`
- Check backend is running
- Use mock data for testing

**Charts not displaying**
- Check historical data is returned from API
- Verify data format matches specification
- Check browser console for errors

**Styles not applied**
- Hard refresh browser (Ctrl+Shift+R)
- Restart development server
- Check Tailwind config

---

## System Performance

### Optimization Tips

1. **Close Unused Browser Tabs**: Saves system memory
2. **Disable Browser Extensions**: Improves performance
3. **Clear Browser Cache**: Reduces memory usage
4. **Use Development Tools Sparingly**: Close DevTools when not debugging

### Expected Resource Usage
- Development Server: ~150-200MB RAM
- Browser: ~300-500MB RAM
- Node Modules: ~600MB Disk Space

---

## Getting Started Checklist

- [ ] Node.js and npm installed and verified
- [ ] Project downloaded/cloned
- [ ] Dependencies installed with `npm install`
- [ ] `.env` file configured
- [ ] Development server started with `npm start`
- [ ] Dashboard accessible at localhost:3000
- [ ] Mock data displaying (or connected to backend)
- [ ] No console errors visible
- [ ] React DevTools installed (optional)

---

## First Time User Tips

1. **Start with Mock Data**: Set `USE_MOCK_DATA = true` to explore features without backend
2. **Explore Components**: Check code in `src/components/` to understand structure
3. **Read Documentation**: Review README.md and DEVELOPMENT.md before coding
4. **Use Browser DevTools**: Press F12 to inspect elements and debug
5. **Check Browser Console**: Look for any errors or warnings

---

## Support

For issues or questions:
1. Review error messages in browser console (F12)
2. Check troubleshooting section above
3. Review DEVELOPMENT.md for solutions
4. Contact development team

---

**Version**: 1.0.0  
**Last Updated**: March 31, 2026
