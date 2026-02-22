# Implementation Plan: Student Login & Dashboard

## Information Gathered
- **Current Structure**: Admin Login at `/src/AdminLogin.jsx` and Admin Dashboard at `/src/AdminDashboard.jsx`
- **Student Data**: Already has `studentIdNum` and `pinCode` fields per student
- **Grades Structure**: Has assessments with categories, titles, dates, HPS (Highest Possible Score), and scores
- **Courses**: Multiple courses with enrollments tracked
- **Tech Stack**: React + Vite + Tailwind CSS

## Plan

### Step 1: Create Student Login Component (`src/StudentLogin.jsx`)
- Create login form with ID Number and PIN fields
- Validate against student data from localStorage (shared with admin)
- Show error for invalid credentials
- Navigate to Student Dashboard on success

### Step 2: Create Student Dashboard Component (`src/StudentDashboard.jsx`)
- **Header Section**:
  - Student Name display
  - ID Number display
  - Edit Profile button → opens modal to edit name, program, change PIN
  
- **Grades Section**:
  - Group by Course
  - For each course, show months
  - For each month, show assessments with columns:
    - Assessment Type
    - Assessment Title
    - Assessment Date
    - Calculated Score/HPS
    - Percentage
    - Initial Letter Grade
  
- **Summary Section**:
  - Overall Percentage (weighted average)
  - Final Grade (letter grade based on percentage)

### Step 3: Update App.jsx
- Add state for user type: 'admin' | 'student' | null
- Add state for current student data (for student dashboard)
- Create login selection screen (Admin vs Student)
- Update routing/conditional rendering

### Step 4: Update Admin Dashboard
- Add button to access "Student Portal Preview" or manage student PINs
- Ensure student data persists in localStorage for sharing

### Step 5: Deploy to GitHub Pages
- Rebuild and deploy with updated code

## Dependent Files to be Edited
- `src/App.jsx` - Main routing logic
- `src/StudentLogin.jsx` - NEW FILE
- `src/StudentDashboard.jsx` - NEW FILE
- `package.json` - Already configured

## Followup Steps
1. Test both admin and student logins locally
2. Deploy to GitHub Pages with `npm run deploy`
3. Verify URLs work from any network

