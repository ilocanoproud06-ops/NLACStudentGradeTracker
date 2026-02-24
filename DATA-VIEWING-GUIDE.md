# NLAC Student Grade Tracker - Data Viewing Guide

## Overview
This guide explains how to view and manage data in both localStorage (local storage) and cloud storage (Firebase Data Connect) for the NLAC Student Grade Tracker application.

## Live Demo Links

### Main Application
- **URL**: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/

### Data Management Pages
- **Data Storage Viewer**: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/#data-viewer
- **Cloud Storage Demo**: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/#cloud-demo

## Viewing Local Storage Data

### Method 1: Using the Data Storage Viewer (Recommended)
1. Navigate to the Admin Dashboard
2. Scroll to the bottom and click "View Local Storage Data"
3. The Data Storage Viewer will automatically load all data from localStorage
4. Click "Show Data" to display the JSON structures
5. Click "Refresh Local Data" to reload data from localStorage

### Method 2: Using Browser Developer Tools
1. Open your browser's Developer Tools (F12 or Ctrl+Shift+I)
2. Go to the "Application" or "Storage" tab
3. Expand "Local Storage" in the sidebar
4. Click on the application domain to view key-value pairs

### Method 3: Using JavaScript Console
Execute these commands in the browser console:

```javascript
// View all localStorage data
console.log('All localStorage data:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  try {
    const value = JSON.parse(localStorage.getItem(key));
    console.log(`${key}:`, value);
  } catch (e) {
    console.log(`${key}:`, localStorage.getItem(key));
  }
}

// View specific collections
console.log('Students:', JSON.parse(localStorage.getItem('nlac_students') || '[]'));
console.log('Courses:', JSON.parse(localStorage.getItem('nlac_courses') || '[]'));
console.log('Enrollments:', JSON.parse(localStorage.getItem('nlac_enrollments') || '[]'));
console.log('Assessments:', JSON.parse(localStorage.getItem('nlac_assessments') || '[]'));
console.log('Grades:', JSON.parse(localStorage.getItem('nlac_grades') || '[]'));
```

## Data Structure in Local Storage

### Students Collection (`nlac_students`)
```json
[
  {
    "id": 1,
    "studentIdNum": "2024-0001",
    "name": "Garcia, Maria S.",
    "program": "BSCS",
    "pinCode": "4521",
    "yearLevel": "1st Year",
    "email": ""
  }
]
```

### Courses Collection (`nlac_courses`)
```json
[
  {
    "id": 101,
    "title": "Mathematics 101",
    "code": "MATH101",
    "type": "Lecture",
    "day": "MWF",
    "time": "09:00 - 10:00",
    "room": "Room 301"
  }
]
```

### Enrollments Collection (`nlac_enrollments`)
```json
[
  {
    "id": "en-1",
    "studentId": 1,
    "courseId": 101
  }
]
```

### Assessments Collection (`nlac_assessments`)
```json
[
  {
    "id": 501,
    "courseId": 101,
    "category": "Written Exam",
    "title": "Prelim Exam",
    "month": "February",
    "hps": 100,
    "date": "2024-02-15",
    "instructorComments": "Covers chapters 1-3, focus on basic concepts"
  }
]
```

### Grades Collection (`nlac_grades`)
```json
[
  {
    "id": "g1",
    "studentId": 1,
    "assessmentId": 501,
    "score": 95,
    "instructorComments": "Excellent work!"
  }
]
```

## Viewing Cloud Storage Data

### Firebase Data Connect Schema
The cloud storage uses the following schema:

#### Students Table
- `id` (ID) - Unique identifier
- `studentIdNum` (String) - Student ID number (unique)
- `name` (String) - Full name
- `program` (String) - Academic program
- `pinCode` (String) - PIN for authentication
- `yearLevel` (String) - Current year level
- `email` (String) - Email address
- `createdAt` (Timestamp) - Record creation time
- `updatedAt` (Timestamp) - Last update time

#### Courses Table
- `id` (ID) - Unique identifier
- `code` (String) - Course code (unique)
- `title` (String) - Course title
- `type` (String) - Course type (Lecture, Lab, etc.)
- `day` (String) - Schedule days
- `time` (String) - Schedule time
- `room` (String) - Room location
- `createdAt` (Timestamp) - Record creation time
- `updatedAt` (Timestamp) - Last update time

#### Enrollments Table
- `id` (ID) - Unique identifier
- `studentId` (ID) - Reference to Student
- `courseId` (ID) - Reference to Course
- `enrolledAt` (Timestamp) - Enrollment time

#### Assessments Table
- `id` (ID) - Unique identifier
- `courseId` (ID) - Reference to Course
- `category` (String) - Assessment type
- `title` (String) - Assessment title
- `month` (String) - Month of assessment
- `hps` (Int) - Highest possible score
- `date` (String) - Assessment date
- `instructorComments` (String) - Instructor notes
- `createdAt` (Timestamp) - Record creation time
- `updatedAt` (Timestamp) - Last update time

#### Grades Table
- `id` (ID) - Unique identifier
- `studentId` (ID) - Reference to Student
- `assessmentId` (ID) - Reference to Assessment
- `score` (Int) - Student's score
- `instructorComments` (String) - Instructor feedback
- `gradedAt` (Timestamp) - Grading time
- `updatedAt` (Timestamp) - Last update time

### Accessing Cloud Data
In the live demo:
1. Navigate to the Cloud Storage Demo page
2. Click "Connect to Cloud" to establish connection
3. View simulated cloud data in the interface
4. Use the sync buttons to simulate data synchronization

## Data Synchronization

### Local to Cloud Sync Process
1. Data is first saved to localStorage for immediate access
2. Background process periodically syncs changes to Firebase
3. Conflict resolution uses timestamps to determine most recent data

### Cloud to Local Sync Process
1. On application startup, fetch latest data from Firebase
2. Merge with local data, resolving conflicts
3. Update localStorage with merged data

## Troubleshooting Data Issues

### Common Issues and Solutions

#### No Data Displayed
1. **Check localStorage initialization**:
   ```javascript
   // Initialize with sample data if empty
   if (!localStorage.getItem('nlac_students')) {
     const sampleStudents = [
       { id: 1, studentIdNum: "2024-0001", name: "Garcia, Maria S.", program: "BSCS", pinCode: "4521", yearLevel: "1st Year", email: "" }
     ];
     localStorage.setItem('nlac_students', JSON.stringify(sampleStudents));
   }
   ```

#### Data Not Persisting
1. **Verify browser storage permissions**
2. **Check for storage quota limits**
3. **Ensure data is properly serialized**:
   ```javascript
   // Correct way to store objects
   localStorage.setItem('key', JSON.stringify(data));
   
   // Correct way to retrieve objects
   const data = JSON.parse(localStorage.getItem('key') || '[]');
   ```

#### Sync Conflicts
1. **Implement timestamp-based conflict resolution**:
   ```javascript
   const resolveConflict = (localData, cloudData) => {
     return new Date(localData.updatedAt) > new Date(cloudData.updatedAt) 
       ? localData 
       : cloudData;
   };
   ```

## Security Considerations

### Data Protection
1. **PIN Codes**: Stored securely in both local and cloud storage
2. **Personal Information**: Limited to essential academic data
3. **Access Control**: Admin vs Student role-based permissions

### Best Practices
1. **Never store sensitive data in plain text**
2. **Use HTTPS for all cloud communications**
3. **Implement proper authentication for cloud access**
4. **Regularly backup important data**

## Future Enhancements

### Planned Improvements
1. **Real-time synchronization** using Firebase Realtime Database
2. **Enhanced conflict resolution** with merge strategies
3. **Offline-first approach** with automatic sync when online
4. **Data encryption** for additional security
5. **Audit logging** for all data modifications

## Conclusion

The NLAC Student Grade Tracker provides comprehensive data viewing capabilities for both local and cloud storage. The Data Storage Viewer and Cloud Storage Demo pages offer intuitive interfaces for administrators to monitor and manage all application data, ensuring transparency and ease of maintenance.