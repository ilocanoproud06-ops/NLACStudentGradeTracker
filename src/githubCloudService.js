// GitHub Cloud Storage Service
// Provides fallback cloud storage when Firebase is not available
// Uses localStorage with cloud-like sync capabilities

// Storage keys for GitHub-style cloud storage
const GITHUB_STORAGE_KEYS = {
  STUDENTS: 'nlac_cloud_students',
  COURSES: 'nlac_cloud_courses',
  ENROLLMENTS: 'nlac_cloud_enrollments',
  ASSESSMENTS: 'nlac_cloud_assessments',
  GRADES: 'nlac_cloud_grades',
  SYNC_STATUS: 'nlac_github_sync_status',
  LAST_SYNC: 'nlac_github_last_sync',
  CLOUD_VERSION: 'nlac_cloud_version'
};

// GitHub repository configuration (for future GitHub API integration)
// For now, we use localStorage as a cloud-like storage that can be exported/imported
const GITHUB_CONFIG = {
  // GitHub repository info - can be configured for actual GitHub API
  owner: '',
  repo: '',
  branch: 'main',
  token: '', // Personal access token (would be needed for actual GitHub API)
  // For demo purposes, we use localStorage as "GitHub Cloud"
  useLocalStorage: true
};

// Sample data for initialization
const getSampleData = () => ({
  students: [
    { id: 1, studentIdNum: "2024-0001", name: "Garcia, Maria S.", program: "BSCS", pinCode: "4521", yearLevel: "1st Year", email: "" },
    { id: 2, studentIdNum: "2024-0002", name: "Wilson, James K.", program: "BSIT", pinCode: "7832", yearLevel: "2nd Year", email: "" },
    { id: 3, studentIdNum: "2024-0003", name: "Chen, Robert L.", program: "BS MATH", pinCode: "9012", yearLevel: "3rd Year", email: "" }
  ],
  courses: [
    { id: 101, title: "Mathematics 101", code: "MATH101", type: "Lecture", day: "MWF", time: "09:00 - 10:00", room: "Room 301" },
    { id: 102, title: "Computer Science", code: "CS202", type: "Lab", day: "TTh", time: "13:00 - 15:00", room: "Lab 101" }
  ],
  enrollments: [
    { id: 'en-1', studentId: 1, courseId: 101 },
    { id: 'en-2', studentId: 1, courseId: 102 },
    { id: 'en-3', studentId: 2, courseId: 101 },
    { id: 'en-4', studentId: 3, courseId: 101 }
  ],
  assessments: [
    { id: 501, courseId: 101, category: "Written Exam", title: "Prelim Exam", month: "February", hps: 100, date: "2024-02-15", instructorComments: "Covers chapters 1-3, focus on basic concepts" },
    { id: 502, courseId: 101, category: "Written Exam", title: "Quiz 1", month: "February", hps: 50, date: "2024-02-20", instructorComments: "Short quiz on algebraic equations" },
    { id: 503, courseId: 101, category: "Performance Task", title: "Seatwork", month: "February", hps: 20, date: "2024-02-22", instructorComments: "Daily practice exercises" },
    { id: 504, courseId: 102, category: "Written Exam", title: "Prelim Exam", month: "February", hps: 100, date: "2024-02-16", instructorComments: "Programming fundamentals and algorithms" },
    { id: 505, courseId: 102, category: "Performance Task", title: "Lab Exercise 1", month: "February", hps: 50, date: "2024-02-21", instructorComments: "Basic programming lab assignment" }
  ],
  grades: [
    { id: 'g1', studentId: 1, assessmentId: 501, score: 95 },
    { id: 'g2', studentId: 2, assessmentId: 501, score: 88 },
    { id: 'g3', studentId: 1, assessmentId: 502, score: 45 },
    { id: 'g4', studentId: 1, assessmentId: 503, score: 18 },
    { id: 'g5', studentId: 2, assessmentId: 504, score: 92 }
  ]
});

// ==================== GitHub Cloud Storage Operations ====================

// Initialize GitHub-style cloud storage
export const initializeGitHubStorage = async () => {
  try {
    // Check if cloud data exists
    const cloudVersion = localStorage.getItem(GITHUB_STORAGE_KEYS.CLOUD_VERSION);
    
    if (!cloudVersion) {
      // Initialize with sample data
      const sampleData = getSampleData();
      await syncToGitHub(sampleData);
      console.log('✅ GitHub Cloud Storage initialized with sample data');
    }
    
    // Mark GitHub storage as available
    localStorage.setItem(GITHUB_STORAGE_KEYS.SYNC_STATUS, 'available');
    localStorage.setItem(GITHUB_STORAGE_KEYS.CLOUD_VERSION, '1.0.0');
    
    return { success: true };
  } catch (error) {
    console.error('Error initializing GitHub Cloud Storage:', error);
    return { success: false, error: error.message };
  }
};

// Check if GitHub Cloud Storage is available
export const isGitHubStorageAvailable = () => {
  try {
    const status = localStorage.getItem(GITHUB_STORAGE_KEYS.SYNC_STATUS);
    return status === 'available';
  } catch (error) {
    return false;
  }
};

// Get GitHub Cloud Storage status
export const getGitHubStatus = () => {
  try {
    const lastSync = localStorage.getItem(GITHUB_STORAGE_KEYS.LAST_SYNC);
    const status = localStorage.getItem(GITHUB_STORAGE_KEYS.SYNC_STATUS);
    const version = localStorage.getItem(GITHUB_STORAGE_KEYS.CLOUD_VERSION);
    
    return {
      available: status === 'available',
      lastSync: lastSync ? new Date(lastSync).toISOString() : null,
      version: version || '1.0.0',
      storageType: 'github-cloud'
    };
  } catch (error) {
    return {
      available: false,
      lastSync: null,
      version: '1.0.0',
      storageType: 'github-cloud'
    };
  }
};

// Sync all data to GitHub Cloud Storage (simulated)
export const syncToGitHub = async (data) => {
  try {
    // Save all data to localStorage with GitHub-style keys
    if (data.students) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
    }
    if (data.courses) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.COURSES, JSON.stringify(data.courses));
    }
    if (data.enrollments) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.ENROLLMENTS, JSON.stringify(data.enrollments));
    }
    if (data.assessments) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.ASSESSMENTS, JSON.stringify(data.assessments));
    }
    if (data.grades) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.GRADES, JSON.stringify(data.grades));
    }
    
    // Update sync timestamp
    localStorage.setItem(GITHUB_STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    localStorage.setItem(GITHUB_STORAGE_KEYS.SYNC_STATUS, 'available');
    
    console.log('✅ Data synced to GitHub Cloud Storage');
    return { success: true };
  } catch (error) {
    console.error('Error syncing to GitHub Cloud:', error);
    return { success: false, error: error.message };
  }
};

// Sync all data from GitHub Cloud Storage
export const syncFromGitHub = async () => {
  try {
    const students = localStorage.getItem(GITHUB_STORAGE_KEYS.STUDENTS);
    const courses = localStorage.getItem(GITHUB_STORAGE_KEYS.COURSES);
    const enrollments = localStorage.getItem(GITHUB_STORAGE_KEYS.ENROLLMENTS);
    const assessments = localStorage.getItem(GITHUB_STORAGE_KEYS.ASSESSMENTS);
    const grades = localStorage.getItem(GITHUB_STORAGE_KEYS.GRADES);
    
    const data = {
      students: students ? JSON.parse(students) : [],
      courses: courses ? JSON.parse(courses) : [],
      enrollments: enrollments ? JSON.parse(enrollments) : [],
      assessments: assessments ? JSON.parse(assessments) : [],
      grades: grades ? JSON.parse(grades) : []
    };
    
    // Update last sync time
    localStorage.setItem(GITHUB_STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    
    console.log('✅ Data synced from GitHub Cloud Storage');
    return { success: true, data };
  } catch (error) {
    console.error('Error syncing from GitHub Cloud:', error);
    return { success: false, error: error.message };
  }
};

// Get last sync time from GitHub Cloud
export const getGitHubLastSyncTime = () => {
  return localStorage.getItem(GITHUB_STORAGE_KEYS.LAST_SYNC);
};

// Export data for backup (can be used for GitHub Gist or other cloud storage)
export const exportCloudData = () => {
  try {
    const data = {
      students: JSON.parse(localStorage.getItem(GITHUB_STORAGE_KEYS.STUDENTS) || '[]'),
      courses: JSON.parse(localStorage.getItem(GITHUB_STORAGE_KEYS.COURSES) || '[]'),
      enrollments: JSON.parse(localStorage.getItem(GITHUB_STORAGE_KEYS.ENROLLMENTS) || '[]'),
      assessments: JSON.parse(localStorage.getItem(GITHUB_STORAGE_KEYS.ASSESSMENTS) || '[]'),
      grades: JSON.parse(localStorage.getItem(GITHUB_STORAGE_KEYS.GRADES) || '[]'),
      exportedAt: new Date().toISOString(),
      version: localStorage.getItem(GITHUB_STORAGE_KEYS.CLOUD_VERSION) || '1.0.0'
    };
    
    return data;
  } catch (error) {
    console.error('Error exporting cloud data:', error);
    return null;
  }
};

// Import data from backup
export const importCloudData = async (jsonData) => {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    if (data.students) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
    }
    if (data.courses) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.COURSES, JSON.stringify(data.courses));
    }
    if (data.enrollments) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.ENROLLMENTS, JSON.stringify(data.enrollments));
    }
    if (data.assessments) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.ASSESSMENTS, JSON.stringify(data.assessments));
    }
    if (data.grades) {
      localStorage.setItem(GITHUB_STORAGE_KEYS.GRADES, JSON.stringify(data.grades));
    }
    
    localStorage.setItem(GITHUB_STORAGE_KEYS.CLOUD_VERSION, data.version || '1.0.0');
    localStorage.setItem(GITHUB_STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    
    console.log('✅ Cloud data imported successfully');
    return { success: true };
  } catch (error) {
    console.error('Error importing cloud data:', error);
    return { success: false, error: error.message };
  }
};

// Clear GitHub Cloud Storage
export const clearGitHubStorage = () => {
  try {
    localStorage.removeItem(GITHUB_STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(GITHUB_STORAGE_KEYS.COURSES);
    localStorage.removeItem(GITHUB_STORAGE_KEYS.ENROLLMENTS);
    localStorage.removeItem(GITHUB_STORAGE_KEYS.ASSESSMENTS);
    localStorage.removeItem(GITHUB_STORAGE_KEYS.GRADES);
    localStorage.removeItem(GITHUB_STORAGE_KEYS.SYNC_STATUS);
    localStorage.removeItem(GITHUB_STORAGE_KEYS.LAST_SYNC);
    localStorage.removeItem(GITHUB_STORAGE_KEYS.CLOUD_VERSION);
    
    console.log('✅ GitHub Cloud Storage cleared');
    return { success: true };
  } catch (error) {
    console.error('Error clearing GitHub Cloud Storage:', error);
    return { success: false, error: error.message };
  }
};

// Unified cloud sync - tries Firebase first, then GitHub, then localStorage
export const initializeCloudStorage = async () => {
  // Auto-enable cloud sync
  localStorage.setItem('nlac_sync_enabled', 'true');
  
  let cloudSource = 'none';
  let data = null;
  
  // Try Firebase first
  try {
    const { downloadAllFromCloud } = await import('./cloudDataService');
    const result = await downloadAllFromCloud();
    if (result.success && result.data && result.data.students.length > 0) {
      console.log('✅ Using Firebase Cloud Storage');
      cloudSource = 'firebase';
      data = result.data;
      
      // Also backup to GitHub
      await syncToGitHub(result.data);
      
      return { success: true, source: 'firebase', data };
    }
  } catch (error) {
    console.log('Firebase not available, trying GitHub...');
  }
  
  // Try GitHub Cloud Storage
  try {
    const result = await syncFromGitHub();
    if (result.success && result.data && result.data.students.length > 0) {
      console.log('✅ Using GitHub Cloud Storage');
      cloudSource = 'github';
      data = result.data;
      
      return { success: true, source: 'github', data };
    }
  } catch (error) {
    console.log('GitHub Cloud not available, using localStorage...');
  }
  
  // Fall back to localStorage
  const localData = getSampleData();
  await syncToGitHub(localData);
  
  console.log('✅ Using localStorage');
  return { success: true, source: 'local', data: localData };
};

// Export all functions
export default {
  initializeGitHubStorage,
  isGitHubStorageAvailable,
  getGitHubStatus,
  syncToGitHub,
  syncFromGitHub,
  getGitHubLastSyncTime,
  exportCloudData,
  importCloudData,
  clearGitHubStorage,
  initializeCloudStorage,
  GITHUB_STORAGE_KEYS
};
