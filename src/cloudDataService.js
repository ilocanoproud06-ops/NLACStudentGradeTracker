// Cloud Data Service - Unified storage layer for NLAC Grade Tracker
// Handles localStorage, Firebase Firestore, and GitHub Cloud Storage for cloud sync

// Import Firebase - handle initialization issues gracefully
import { initialized, db as firebaseDb } from './firebaseConfig';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  writeBatch,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

// Import GitHub Cloud Service for fallback
import { syncToGitHub, syncFromGitHub, getGitHubStatus, initializeGitHubStorage } from './githubCloudService';

// Get db safely
const getDb = () => {
  try {
    if (firebaseDb) {
      return firebaseDb;
    }
    // Try to get from initialized
    if (initialized && initialized.db) {
      return initialized.db;
    }
    return null;
  } catch (error) {
    console.warn('Firebase DB not available:', error);
    return null;
  }
};

// Collection names in Firestore
const COLLECTIONS = {
  STUDENTS: 'students',
  COURSES: 'courses',
  ENROLLMENTS: 'enrollments',
  ASSESSMENTS: 'assessments',
  GRADES: 'grades',
  SYNC_STATUS: 'syncStatus'
};

// LocalStorage keys
const STORAGE_KEYS = {
  STUDENTS: 'nlac_students',
  COURSES: 'nlac_courses',
  ENROLLMENTS: 'nlac_enrollments',
  ASSESSMENTS: 'nlac_assessments',
  GRADES: 'nlac_grades',
  LAST_SYNC: 'nlac_last_sync',
  SYNC_ENABLED: 'nlac_sync_enabled'
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

// ==================== LOCAL STORAGE OPERATIONS ====================

// Load data from localStorage or initialize with sample data
export const loadFromLocalStorage = (key, sampleData) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with sample data if nothing stored
    if (sampleData) {
      localStorage.setItem(key, JSON.stringify(sampleData));
      return sampleData;
    }
    return [];
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return sampleData || [];
  }
};

// Save data to localStorage
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// ==================== FIREBASE CLOUD OPERATIONS ====================

// Check if Firebase is available and sync is enabled
export const isCloudSyncEnabled = () => {
  return localStorage.getItem(STORAGE_KEYS.SYNC_ENABLED) === 'true';
};

// Enable/disable cloud sync
export const setCloudSyncEnabled = (enabled) => {
  localStorage.setItem(STORAGE_KEYS.SYNC_ENABLED, enabled ? 'true' : 'false');
};

// Upload all data to Firebase
export const uploadAllToCloud = async (data = null) => {
  const db = getDb();
  if (!db) {
    console.warn('Firebase not available, skipping cloud upload');
    return { success: false, error: 'Firebase not available' };
  }
  
  // Use provided data or load from localStorage
  let uploadData;
  if (data) {
    uploadData = data;
  } else {
    // Load from localStorage
    uploadData = {
      students: loadFromLocalStorage(STORAGE_KEYS.STUDENTS, []),
      courses: loadFromLocalStorage(STORAGE_KEYS.COURSES, []),
      enrollments: loadFromLocalStorage(STORAGE_KEYS.ENROLLMENTS, []),
      assessments: loadFromLocalStorage(STORAGE_KEYS.ASSESSMENTS, []),
      grades: loadFromLocalStorage(STORAGE_KEYS.GRADES, [])
    };
  }
  
  // If still empty, use sample data
  if (!uploadData.students || uploadData.students.length === 0) {
    uploadData = getSampleData();
  }
  
  try {
    const batch = writeBatch(db);
    
    // Upload students
    for (const student of uploadData.students) {
      const docRef = doc(db, COLLECTIONS.STUDENTS, student.id.toString());
      batch.set(docRef, student);
    }
    
    // Upload courses
    for (const course of uploadData.courses) {
      const docRef = doc(db, COLLECTIONS.COURSES, course.id.toString());
      batch.set(docRef, course);
    }
    
    // Upload enrollments
    for (const enrollment of uploadData.enrollments) {
      const docRef = doc(db, COLLECTIONS.ENROLLMENTS, enrollment.id);
      batch.set(docRef, enrollment);
    }
    
    // Upload assessments
    for (const assessment of uploadData.assessments) {
      const docRef = doc(db, COLLECTIONS.ASSESSMENTS, assessment.id.toString());
      batch.set(docRef, assessment);
    }
    
    // Upload grades
    for (const grade of uploadData.grades) {
      const docRef = doc(db, COLLECTIONS.GRADES, grade.id);
      batch.set(docRef, grade);
    }
    
    await batch.commit();
    
    // Update sync status
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    
    console.log('✅ All data uploaded to Firebase successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error uploading to Firebase:', error);
    return { success: false, error: error.message };
  }
};

// Download all data from Firebase
export const downloadAllFromCloud = async () => {
  const db = getDb();
  if (!db) {
    console.warn('Firebase not available, skipping cloud download');
    return { success: false, error: 'Firebase not available' };
  }
  
  try {
    // Download students
    const studentsSnap = await getDocs(query(collection(db, COLLECTIONS.STUDENTS), orderBy('id')));
    const students = studentsSnap.docs.map(doc => ({ id: parseInt(doc.id), ...doc.data() }));
    
    // Download courses
    const coursesSnap = await getDocs(query(collection(db, COLLECTIONS.COURSES), orderBy('id')));
    const courses = coursesSnap.docs.map(doc => ({ id: parseInt(doc.id), ...doc.data() }));
    
    // Download enrollments
    const enrollmentsSnap = await getDocs(collection(db, COLLECTIONS.ENROLLMENTS));
    const enrollments = enrollmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Download assessments
    const assessmentsSnap = await getDocs(query(collection(db, COLLECTIONS.ASSESSMENTS), orderBy('id')));
    const assessments = assessmentsSnap.docs.map(doc => ({ id: parseInt(doc.id), ...doc.data() }));
    
    // Download grades
    const gradesSnap = await getDocs(collection(db, COLLECTIONS.GRADES));
    const grades = gradesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Save to localStorage
    saveToLocalStorage(STORAGE_KEYS.STUDENTS, students);
    saveToLocalStorage(STORAGE_KEYS.COURSES, courses);
    saveToLocalStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);
    saveToLocalStorage(STORAGE_KEYS.ASSESSMENTS, assessments);
    saveToLocalStorage(STORAGE_KEYS.GRADES, grades);
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    
    console.log('✅ All data downloaded from cloud successfully!');
    return { 
      success: true, 
      data: { students, courses, enrollments, assessments, grades } 
    };
  } catch (error) {
    console.error('Error downloading from cloud:', error);
    return { success: false, error: error.message };
  }
};

// Sync single collection to cloud
export const syncCollectionToCloud = async (collectionName, data) => {
  const db = getDb();
  if (!db) {
    console.warn('Firebase not available, skipping sync');
    return { success: false, error: 'Firebase not available' };
  }
  
  if (!isCloudSyncEnabled()) {
    console.log('Cloud sync is disabled, saving to localStorage only');
    return { success: false, reason: 'disabled' };
  }

  try {
    const batch = writeBatch(db);
    const collectionRef = collection(db, collectionName);
    
    // Delete existing documents and add new ones
    const existingSnap = await getDocs(collectionRef);
    existingSnap.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Add new documents
    data.forEach(item => {
      const docRef = doc(collectionRef, item.id.toString());
      batch.set(docRef, item);
    });
    
    await batch.commit();
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    
    console.log(`✅ ${collectionName} synced to cloud!`);
    return { success: true };
  } catch (error) {
    console.error(`Error syncing ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

// Sync single collection from cloud
export const syncCollectionFromCloud = async (collectionName, localStorageKey) => {
  const db = getDb();
  if (!db) {
    console.warn('Firebase not available, skipping sync');
    return { success: false, error: 'Firebase not available' };
  }
  
  try {
    const snap = await getDocs(collection(db, collectionName));
    const data = snap.docs.map(doc => {
      const docData = doc.data();
      // Preserve string IDs for enrollments and grades
      if (collectionName === COLLECTIONS.ENROLLMENTS || collectionName === COLLECTIONS.GRADES) {
        return { id: doc.id, ...docData };
      }
      return { id: parseInt(doc.id), ...docData };
    });
    
    saveToLocalStorage(localStorageKey, data);
    return { success: true, data };
  } catch (error) {
    console.error(`Error syncing ${collectionName} from cloud:`, error);
    return { success: false, error: error.message };
  }
};

// Get last sync time
export const getLastSyncTime = () => {
  return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
};

// Setup real-time listener for cloud changes
export const setupCloudListener = (callback) => {
  const db = getDb();
  if (!db) {
    console.warn('Firebase not available, skipping cloud listener');
    return () => {};
  }
  
  if (!isCloudSyncEnabled()) {
    return () => {}; // Return empty cleanup function
  }

  const collections = [
    { name: COLLECTIONS.STUDENTS, key: STORAGE_KEYS.STUDENTS },
    { name: COLLECTIONS.COURSES, key: STORAGE_KEYS.COURSES },
    { name: COLLECTIONS.ENROLLMENTS, key: STORAGE_KEYS.ENROLLMENTS },
    { name: COLLECTIONS.ASSESSMENTS, key: STORAGE_KEYS.ASSESSMENTS },
    { name: COLLECTIONS.GRADES, key: STORAGE_KEYS.GRADES }
  ];

  const unsubscribes = collections.map(({ name, key }) => {
    return onSnapshot(collection(db, name), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        if (name === COLLECTIONS.ENROLLMENTS || name === COLLECTIONS.GRADES) {
          return { id: doc.id, ...docData };
        }
        return { id: parseInt(doc.id), ...docData };
      });
      saveToLocalStorage(key, data);
      callback({ collection: name, data });
    });
  });

  // Return cleanup function
  return () => unsubscribes.forEach(unsub => unsub());
};

// ==================== UNIFIED DATA OPERATIONS ====================

// Cloud storage status
export const getCloudStatus = () => {
  const firebaseStatus = isCloudSyncEnabled() ? 'available' : 'disabled';
  const githubStatus = getGitHubStatus();
  
  return {
    firebase: firebaseStatus,
    github: githubStatus,
    lastSync: getLastSyncTime()
  };
};

// Initialize data - tries cloud first, falls back to local
export const initializeData = async () => {
  // Auto-enable cloud sync by default
  setCloudSyncEnabled(true);
  
  // Initialize GitHub storage as fallback
  await initializeGitHubStorage();
  
  // Check if we have local data
  const localStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  
  // Try to get data from cloud first (Firebase -> GitHub -> localStorage)
  try {
    const cloudResult = await downloadAllFromCloud();
    if (cloudResult.success && cloudResult.data && cloudResult.data.students.length > 0) {
      console.log('✅ Data loaded from Firebase cloud successfully!');
      
      // Also backup to GitHub
      try {
        await syncToGitHub(cloudResult.data);
        console.log('✅ Data backed up to GitHub Cloud');
      } catch (err) {
        console.log('GitHub backup failed:', err);
      }
      
      return cloudResult.data;
    }
  } catch (error) {
    console.log('Firebase download not available, trying GitHub Cloud...');
    
    // Try GitHub Cloud as fallback
    try {
      const githubResult = await syncFromGitHub();
      if (githubResult.success && githubResult.data && githubResult.data.students.length > 0) {
        console.log('✅ Data loaded from GitHub Cloud successfully!');
        
        // Save to localStorage
        saveToLocalStorage(STORAGE_KEYS.STUDENTS, githubResult.data.students);
        saveToLocalStorage(STORAGE_KEYS.COURSES, githubResult.data.courses);
        saveToLocalStorage(STORAGE_KEYS.ENROLLMENTS, githubResult.data.enrollments);
        saveToLocalStorage(STORAGE_KEYS.ASSESSMENTS, githubResult.data.assessments);
        saveToLocalStorage(STORAGE_KEYS.GRADES, githubResult.data.grades);
        
        return githubResult.data;
      }
    } catch (githubError) {
      console.log('GitHub Cloud not available, using local data');
    }
  }
  
  if (localStudents) {
    // Data exists locally - try to sync to cloud (both Firebase and GitHub)
    try {
      const localData = {
        students: loadFromLocalStorage(STORAGE_KEYS.STUDENTS),
        courses: loadFromLocalStorage(STORAGE_KEYS.COURSES),
        enrollments: loadFromLocalStorage(STORAGE_KEYS.ENROLLMENTS),
        assessments: loadFromLocalStorage(STORAGE_KEYS.ASSESSMENTS),
        grades: loadFromLocalStorage(STORAGE_KEYS.GRADES)
      };
      
      // Upload to Firebase in background
      uploadAllToCloud().catch(err => console.log('Firebase upload failed:', err));
      
      // Also upload to GitHub as backup
      syncToGitHub(localData).catch(err => console.log('GitHub upload failed:', err));
      
      return localData;
    } catch (error) {
      console.error('Error loading local data:', error);
    }
  }
  
  // Initialize with sample data
  const sampleData = getSampleData();
  saveToLocalStorage(STORAGE_KEYS.STUDENTS, sampleData.students);
  saveToLocalStorage(STORAGE_KEYS.COURSES, sampleData.courses);
  saveToLocalStorage(STORAGE_KEYS.ENROLLMENTS, sampleData.enrollments);
  saveToLocalStorage(STORAGE_KEYS.ASSESSMENTS, sampleData.assessments);
  saveToLocalStorage(STORAGE_KEYS.GRADES, sampleData.grades);
  
  // Upload sample data to both clouds
  try {
    await uploadAllToCloud();
    console.log('✅ Sample data uploaded to Firebase');
  } catch (error) {
    console.log('Initial Firebase upload failed:', error);
  }
  
  try {
    await syncToGitHub(sampleData);
    console.log('✅ Sample data uploaded to GitHub Cloud');
  } catch (error) {
    console.log('Initial GitHub upload failed:', error);
  }
  
  return sampleData;
};

// Check if running on mobile device
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Export STORAGE_KEYS and COLLECTIONS as named exports
export { STORAGE_KEYS, COLLECTIONS };

export default {
  loadFromLocalStorage,
  saveToLocalStorage,
  isCloudSyncEnabled,
  setCloudSyncEnabled,
  uploadAllToCloud,
  downloadAllFromCloud,
  syncCollectionToCloud,
  syncCollectionFromCloud,
  getLastSyncTime,
  setupCloudListener,
  initializeData,
  isMobileDevice,
  getCloudStatus,
  COLLECTIONS,
  STORAGE_KEYS
};

