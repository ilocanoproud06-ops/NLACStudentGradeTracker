# NLAC Student Grade Tracker

A React-based student grade management system for NLAC (New Life Academy of Computer). Built with React, Tailwind CSS, and Vite.

## Features

- **Admin Login** - Secure authentication portal
- **Grade Entry** - Excel-style spreadsheet for entering student grades
- **Course Management** - Support for multiple courses and assessments
- **Student Tracking** - Track student performance across different months
- **Student Portal** - Separate online access for students to view their grades

## Student Online Access

Students can now access their grades online from any network using a dedicated student URL. This feature provides:

- **Secure Login**: Students use their Student ID and PIN to access their grades
- **Real-time Updates**: All grade changes from the admin dashboard are automatically reflected
- **Mobile Friendly**: Responsive design works on phones, tablets, and computers
- **Private Access**: Students can only see their own grades and information

### Student URL Access

**Local Development:**
- Student Portal: `http://localhost:5174/student.html`

**Production URLs (Live Sites)**
- **Student (Student-only — no admin access):**
   - GitHub Pages: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/student-access.html
   - Firebase: https://studentgradetracker-e04c0.web.app/student-access.html

- **Admin (Admin login & dashboard):**
   - GitHub Pages: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/
   - Firebase: https://studentgradetracker-e04c0.web.app/

### How It Works

1. **Admin manages data** in the main application
2. **Data is stored** in browser localStorage (automatically synced)
3. **Students access** the dedicated student URL
4. **Students log in** with their Student ID and PIN
5. **Students view** their grades, performance, and academic progress

### Deployment Options

#### Option 1: GitHub Pages (Free)
```bash
# Deploy both admin and student portals
npm run deploy
```

#### Option 2: Firebase Hosting (Recommended)
```bash
# Deploy to Firebase
npm run deploy:firebase
```

#### Option 3: Custom Server
```bash
# Build the application
npm run build

# Serve the dist/ folder on your web server
# The student.html file will be available at your-domain.com/student.html
```

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

# Start development server (admin portal)
npm run dev

# Start development server (student portal)
npm run dev:student

# Build for production
npm run build
```

### Testing Student Access

```bash
# Open admin portal
npm run dev

# In another terminal, open student portal
npm run dev:student
```

**Test Credentials:**
- **Admin**: Use any username/password (currently no validation)
- **Student**: Use Student ID "2024-0001" with PIN "4521"

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
   npm run deploy:firebase
   ```

### Student URL Deployment

After deployment, share this URL with students:
- **GitHub Pages**: `https://[username].github.io/[repo-name]/student.html`
- **Firebase**: `https://[project-id].web.app/student.html`

**Example:**
- Student-only: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/student-access.html
- Admin login: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/

> Note: The student-access page intentionally blocks admin routes — students cannot access admin login or dashboard from that URL.

### Quick Deployment Guide

```bash
# 1. Build the application
npm run build

# 2. Deploy to GitHub Pages
npm run deploy

# 3. Or deploy to Firebase
npm run deploy:firebase

# 4. Share the student URL with students
echo "Student URL: https://[your-domain]/student.html"
```

## Project Structure

```
NLAC Student Grade Tracker/
├── src/
│   ├── AdminLogin.jsx        # Admin login component
│   ├── AdminDashboard.jsx    # Main admin dashboard
│   ├── AdminWelcome.jsx      # Admin welcome page
│   ├── StudentLogin.jsx      # Student login component
│   ├── StudentDashboard.jsx  # Student grade viewing dashboard
│   ├── StudentWelcome.jsx    # Student welcome page
│   ├── StudentApp.jsx        # Student-only app component
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Main entry point
│   ├── student-main.jsx     # Student entry point
│   └── index.css            # Global styles
├── public/
├── index.html               # Main application HTML
├── student.html             # Student portal HTML
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## License

© 2026 AcademicPro Systems. All rights reserved.

