# NLAC Student Grade Tracker

A React-based student grade management system for NLAC (New Life Academy of Computer). Built with React, Tailwind CSS, and Vite.

## Features

- **Admin Login** - Secure authentication portal
- **Grade Entry** - Excel-style spreadsheet for entering student grades
- **Course Management** - Support for multiple courses and assessments
- **Student Tracking** - Track student performance across different months

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React (Icons)
- Firebase (Hosting)

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Deployment to Firebase

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```

4. Deploy to Firebase:
   ```bash
   npm run deploy
   ```

## Project Structure

```
NLAC Student Grade Tracker/
├── src/
│   ├── AdminLogin.jsx    # Login component
│   ├── AdminDashboard.jsx # Main dashboard
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## License

© 2026 AcademicPro Systems. All rights reserved.

