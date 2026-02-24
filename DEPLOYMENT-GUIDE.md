# NLAC Student Grade Tracker - Deployment Guide

## Live Demo Links

### Admin Portal
- **URL**: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/
- **Access**: Select "Admin Dashboard" from the main menu
- **Credentials**: Use any admin credentials (default setup doesn't require specific credentials)

### Student Portal
- **URL**: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/student.html
- **Alternative Access**: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/?mode=student
- **Sample Credentials**:
  - ID: 2024-0001, PIN: 4521
  - ID: 2024-0002, PIN: 7832
  - ID: 2024-0003, PIN: 9012

## Features Fixed

### Student Login Issue Resolved
The previous "Invalid ID Number or PIN" error has been fixed by:
1. Automatically initializing sample student data if localStorage is empty
2. Providing detailed error messages for different failure scenarios
3. Adding console logging for debugging purposes

### Enhanced Error Messaging
- "ID Number not found" - when the ID doesn't exist in the system
- "Incorrect PIN Code" - when the ID exists but the PIN is wrong
- "No student records found" - when there are no students in the database

## How to Test

### Admin Portal Testing
1. Visit: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/
2. Click on "Admin Dashboard"
3. You can manage students, courses, enrollments, assessments, and grades

### Student Portal Testing
1. Visit: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/student.html
2. Log in with one of the sample credentials:
   - ID: 2024-0001, PIN: 4521 (Maria Garcia)
   - ID: 2024-0002, PIN: 7832 (James Wilson)
   - ID: 2024-0003, PIN: 9012 (Robert Chen)
3. View grades and academic performance

## Repository Information
- **GitHub Repository**: https://github.com/ilocanoproud06-ops/NLACStudentGradeTracker
- **Last Commit**: Fixed student login issue by initializing sample data and improving error messages

## Technical Implementation Details

### Student Login Enhancement
The StudentLogin component now:
1. Checks if localStorage has student data
2. If empty, automatically initializes with sample data
3. Provides specific error messages based on what went wrong
4. Logs debug information to the console

### Sample Data Initialization
```javascript
// Sample student data structure
const sampleStudents = [
  { id: 1, studentIdNum: "2024-0001", name: "Garcia, Maria S.", program: "BSCS", pinCode: "4521", yearLevel: "1st Year", email: "" },
  { id: 2, studentIdNum: "2024-0002", name: "Wilson, James K.", program: "BSIT", pinCode: "7832", yearLevel: "2nd Year", email: "" },
  { id: 3, studentIdNum: "2024-0003", name: "Chen, Robert L.", program: "BS MATH", pinCode: "9012", yearLevel: "3rd Year", email: "" }
];
```

## Troubleshooting

### If Login Still Fails
1. Open browser developer tools (F12)
2. Check the Console tab for error messages
3. Clear browser cache and try again
4. Visit the test page to reinitialize data: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/test-login.html

### Common Issues Resolved
- Empty localStorage causing login failures
- Generic error messages that didn't indicate the specific problem
- Lack of debugging information for troubleshooting

## Development Workflow
1. Changes pushed to `main` branch
2. Automatic build using `vite build`
3. Deployment to GitHub Pages using `gh-pages`
4. Available at the live URLs above

For any issues, please check the browser console for detailed error messages.