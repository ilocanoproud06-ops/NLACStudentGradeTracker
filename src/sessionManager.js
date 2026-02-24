// Session management for student authentication
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
    
    // Store session data
    sessionStorage.setItem('studentSession', JSON.stringify({
      studentId: this.studentId,
      lastActivity: this.lastActivity
    }));
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
    // Clear session data
    this.studentId = null;
    sessionStorage.removeItem('studentSession');
    
    // Redirect to student login
    if (window.location.pathname.includes('student')) {
      window.location.href = './student.html';
    }
  }
  
  validateSession() {
    // Check if we have a stored session
    const sessionData = sessionStorage.getItem('studentSession');
    if (!sessionData) {
      return false;
    }
    
    try {
      const parsed = JSON.parse(sessionData);
      this.studentId = parsed.studentId;
      this.lastActivity = parsed.lastActivity;
      
      // Check if session is still valid
      return !!this.studentId && (Date.now() - this.lastActivity) < this.sessionTimeout;
    } catch (e) {
      return false;
    }
  }
  
  updateActivity() {
    this.lastActivity = Date.now();
    this.resetTimer();
    
    // Update session storage
    sessionStorage.setItem('studentSession', JSON.stringify({
      studentId: this.studentId,
      lastActivity: this.lastActivity
    }));
  }
}

// Create a singleton instance
const studentSession = new StudentSession();

// Add activity listeners
if (typeof window !== 'undefined') {
  // Update activity on user interaction
  const updateActivity = () => studentSession.updateActivity();
  
  // Listen for user activity
  window.addEventListener('mousemove', updateActivity);
  window.addEventListener('keypress', updateActivity);
  window.addEventListener('click', updateActivity);
  window.addEventListener('scroll', updateActivity);
}

export default studentSession;