# NLAC Student Grade Tracker - Security Enhancements

## Current Security Status
The application currently uses localStorage for data storage, which is accessible to anyone with browser access. This presents potential security risks.

## Proposed Security Enhancements

### 1. Enhanced Student Authentication
- Implement session-based authentication instead of relying solely on localStorage
- Add token-based authentication for student sessions
- Implement automatic session timeout for security

### 2. Data Access Separation
- Restrict student access to only their own data
- Prevent students from accessing other students' information
- Ensure admin-only access to administrative functions

### 3. PIN Code Security
- Implement PIN code hashing for secure storage
- Add PIN code complexity requirements
- Implement account lockout after failed attempts

### 4. Network Security
- Ensure all communications use HTTPS
- Implement Content Security Policy (CSP)
- Add security headers to prevent common attacks

## Implementation Plan

### Phase 1: Session Management
1. Create a session management system for students
2. Implement automatic logout after inactivity
3. Add session validation to all student data access

### Phase 2: Data Access Control
1. Modify data retrieval to only fetch student-specific data
2. Implement server-side validation for data access
3. Add role-based access controls

### Phase 3: PIN Security
1. Hash PIN codes before storage
2. Implement secure PIN validation
3. Add account lockout mechanisms

## Technical Implementation

### Session Management System
```javascript
// Student session management
class StudentSession {
  constructor() {
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.lastActivity = Date.now();
    this.sessionTimer = null;
  }
  
  startSession(studentId) {
    this.studentId = studentId;
    this.lastActivity = Date.now();
    this.resetTimer();
  }
  
  resetTimer() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    this.sessionTimer = setTimeout(() => {
      this.endSession();
    }, this.sessionTimeout);
  }
  
  endSession() {
    // Clear session data and redirect to login
    this.studentId = null;
    window.location.href = '/student-login.html';
  }
  
  validateSession() {
    return !!this.studentId && (Date.now() - this.lastActivity) < this.sessionTimeout;
  }
}
```

### Secure Data Access
```javascript
// Secure data retrieval for students
const getStudentData = (studentId) => {
  // Only fetch data belonging to the authenticated student
  const students = JSON.parse(localStorage.getItem('nlac_students') || '[]');
  const courses = JSON.parse(localStorage.getItem('nlac_courses') || '[]');
  const enrollments = JSON.parse(localStorage.getItem('nlac_enrollments') || '[]');
  const assessments = JSON.parse(localStorage.getItem('nlac_assessments') || '[]');
  const grades = JSON.parse(localStorage.getItem('nlac_grades') || '[]');
  
  // Filter data to only include student's information
  const student = students.find(s => s.id === studentId);
  const studentEnrollments = enrollments.filter(e => e.studentId === studentId);
  const enrolledCourseIds = studentEnrollments.map(e => e.courseId);
  const studentCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const studentAssessments = assessments.filter(a => enrolledCourseIds.includes(a.courseId));
  const studentGrades = grades.filter(g => g.studentId === studentId);
  
  return {
    student,
    courses: studentCourses,
    enrollments: studentEnrollments,
    assessments: studentAssessments,
    grades: studentGrades
  };
};
```

### PIN Code Hashing
```javascript
// Simple PIN hashing (in a production environment, use a proper library like bcrypt)
const hashPin = (pin) => {
  // This is a simplified example - use a proper cryptographic hash in production
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

const verifyPin = (inputPin, storedHash) => {
  return hashPin(inputPin) === storedHash;
};
```

## Student-Only Access URLs
- Student Login: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/student.html
- Student Dashboard: Accessible only after authentication

## Admin-Only Access
- Admin Portal: https://ilocanoproud06-ops.github.io/NLACStudentGradeTracker/
- Data Management: Admin-only section with enhanced security

## Additional Security Measures

### 1. Input Validation
- Validate all user inputs to prevent injection attacks
- Sanitize data before storage and display

### 2. Error Handling
- Implement generic error messages to prevent information leakage
- Log security events for monitoring

### 3. Data Encryption
- Encrypt sensitive data at rest
- Use secure communication protocols

## Implementation Timeline
1. Week 1: Session management and basic access controls
2. Week 2: PIN security enhancements
3. Week 3: Advanced access controls and monitoring
4. Week 4: Testing and deployment

## Testing Plan
1. Unit tests for authentication functions
2. Integration tests for data access controls
3. Security penetration testing
4. User acceptance testing

## Monitoring and Maintenance
1. Regular security audits
2. Update dependencies regularly
3. Monitor for suspicious activity
4. Maintain security documentation