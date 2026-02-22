import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Users, FileEdit, ChevronRight, Calendar, GraduationCap,
  Filter, X, Plus, Trash2, Edit, Key, ClipboardList, Clock, MapPin, FileText, Save
} from 'lucide-react';

// Helper functions
const generateStudentIdNum = (year, sequence) => `${year}-${String(sequence).padStart(4, '0')}`;
const generatePinCode = () => Math.floor(1000 + Math.random() * 9000).toString();
const getCurrentYear = () => new Date().getFullYear();

// Initial data
const initialStudents = [
  { id: 1, studentIdNum: "2024-0001", name: "Garcia, Maria S.", program: "BSCS", pinCode: "4521" },
  { id: 2, studentIdNum: "2024-0002", name: "Wilson, James K.", program: "BSIT", pinCode: "7832" },
  { id: 3, studentIdNum: "2024-0003", name: "Chen, Robert L.", program: "BS MATH", pinCode: "9012" }
];

const initialCourses = [
  { id: 101, title: "Mathematics 101", code: "MATH101", type: "Lecture", day: "MWF", time: "09:00 - 10:00", room: "Room 301" },
  { id: 102, title: "Computer Science", code: "CS202", type: "Lab", day: "TTh", time: "13:00 - 15:00", room: "Lab 101" }
];

const initialEnrollments = [
  { id: 'en-1', studentId: 1, courseId: 101 },
  { id: 'en-2', studentId: 1, courseId: 102 },
  { id: 'en-3', studentId: 2, courseId: 101 },
  { id: 'en-4', studentId: 3, courseId: 101 }
];

const initialAssessments = [
  { id: 501, courseId: 101, category: "Written Exam", title: "Prelim Exam", month: "February", hps: 100, date: "2024-02-15", instructorComments: "Covers chapters 1-3, focus on basic concepts" },
  { id: 502, courseId: 101, category: "Written Exam", title: "Quiz 1", month: "February", hps: 50, date: "2024-02-20", instructorComments: "Short quiz on algebraic equations" },
  { id: 503, courseId: 101, category: "Performance Task", title: "Seatwork", month: "February", hps: 20, date: "2024-02-22", instructorComments: "Daily practice exercises" },
  { id: 504, courseId: 102, category: "Written Exam", title: "Prelim Exam", month: "February", hps: 100, date: "2024-02-16", instructorComments: "Programming fundamentals and algorithms" },
  { id: 505, courseId: 102, category: "Performance Task", title: "Lab Exercise 1", month: "February", hps: 50, date: "2024-02-21", instructorComments: "Basic programming lab assignment" }
];

const initialGrades = [
  { id: 'g1', studentId: 1, assessmentId: 501, score: 95 },
  { id: 'g2', studentId: 2, assessmentId: 501, score: 88 },
  { id: 'g3', studentId: 1, assessmentId: 502, score: 45 },
  { id: 'g4', studentId: 1, assessmentId: 503, score: 18 },
  { id: 'g5', studentId: 2, assessmentId: 504, score: 92 }
];

// Load from localStorage or use initial data
const loadFromStorage = (key, initial) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : initial;
};

// Save to localStorage
const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('Enrollment');
  const [selectedCourseId, setSelectedCourseId] = useState(101);
  const [selectedMonth, setSelectedMonth] = useState('February');
  
  // Data states - load from localStorage
  const [students, setStudents] = useState(() => loadFromStorage('nlac_students', initialStudents));
  const [courses, setCourses] = useState(() => loadFromStorage('nlac_courses', initialCourses));
  const [enrollments, setEnrollments] = useState(() => loadFromStorage('nlac_enrollments', initialEnrollments));
  const [assessments, setAssessments] = useState(() => loadFromStorage('nlac_assessments', initialAssessments));
  const [grades, setGrades] = useState(() => loadFromStorage('nlac_grades', initialGrades));

  // Save to localStorage whenever data changes
  useEffect(() => { saveToStorage('nlac_students', students); }, [students]);
  useEffect(() => { saveToStorage('nlac_courses', courses); }, [courses]);
  useEffect(() => { saveToStorage('nlac_enrollments', enrollments); }, [enrollments]);
  useEffect(() => { saveToStorage('nlac_assessments', assessments); }, [assessments]);
  useEffect(() => { saveToStorage('nlac_grades', grades); }, [grades]);

  // Modal states
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showHPSModal, setShowHPSModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [editingGrade, setEditingGrade] = useState(null);

  // Form states
  const [newStudent, setNewStudent] = useState({ name: '', program: '' });
  const [studentIdYear, setStudentIdYear] = useState(getCurrentYear());
  const [newCourse, setNewCourse] = useState({ code: '', title: '', type: 'Lecture', day: 'MWF', time: '09:00 - 10:00', room: '' });
  const [selectedStudentForEnrollment, setSelectedStudentForEnrollment] = useState('');
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState('');
  const [newAssessment, setNewAssessment] = useState({ 
    courseId: '', 
    category: 'Written Exam', 
    title: '', 
    month: 'February', 
    hps: 100, 
    date: '', 
    instructorComments: '' 
  });
  const [hpsUpdates, setHpsUpdates] = useState({});
  const [editingGradeData, setEditingGradeData] = useState({ studentId: '', assessmentId: '', score: '' });

  // Computed values
  const filteredAssessments = useMemo(() => 
    assessments.filter(a => a.courseId === selectedCourseId && a.month === selectedMonth),
    [assessments, selectedCourseId, selectedMonth]
  );

  const studentsInCourse = useMemo(() => {
    const enrolledIds = enrollments.filter(e => e.courseId === selectedCourseId).map(e => e.studentId);
    return students.filter(s => enrolledIds.includes(s.id));
  }, [students, enrollments, selectedCourseId]);

  // Helper functions
  const getScore = (studentId, assessmentId) => {
    const entry = grades.find(g => g.studentId === studentId && g.assessmentId === assessmentId);
    return entry ? entry.score : "";
  };

  const getNextSequenceNumber = (year) => {
    const existingStudents = students.filter(s => s.studentIdNum.startsWith(year.toString()));
    if (existingStudents.length === 0) return 1;
    const maxSeq = Math.max(...existingStudents.map(s => parseInt(s.studentIdNum.split('-')[1])));
    return maxSeq + 1;
  };

  const getUnenrolledStudents = (courseId) => {
    const enrolledIds = enrollments.filter(e => e.courseId === courseId).map(e => e.studentId);
    return students.filter(s => !enrolledIds.includes(s.id));
  };

  // Grade calculation helpers
  const calculatePercentage = (score, hps) => {
    if (!score || score === "" || !hps) return 0;
    return Math.round((parseFloat(score) / hps) * 100);
  };

  const calculateEquivalent = (percentage) => {
    if (percentage >= 97) return 1.0;
    if (percentage >= 93) return 1.25;
    if (percentage >= 90) return 1.5;
    if (percentage >= 87) return 1.75;
    if (percentage >= 84) return 2.0;
    if (percentage >= 81) return 2.25;
    if (percentage >= 78) return 2.5;
    if (percentage >= 75) return 2.75;
    if (percentage >= 72) return 3.0;
    if (percentage >= 69) return 3.25;
    if (percentage >= 66) return 3.5;
    if (percentage >= 63) return 3.75;
    if (percentage >= 60) return 4.0;
    return 5.0;
  };

  const calculateLetterGrade = (percentage) => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 84) return 'B';
    if (percentage >= 81) return 'B-';
    if (percentage >= 78) return 'C+';
    if (percentage >= 75) return 'C';
    if (percentage >= 72) return 'C-';
    if (percentage >= 69) return 'D+';
    if (percentage >= 66) return 'D';
    if (percentage >= 63) return 'D-';
    return 'F';
  };

  const deleteGrade = (studentId, assessmentId) => {
    if (window.confirm('Delete this grade record?')) {
      setGrades(grades.filter(g => !(g.studentId === studentId && g.assessmentId === assessmentId)));
    }
  };

  // Handlers
  const updateGrade = (studentId, assessmentId, score) => {
    const val = score === "" ? "" : parseFloat(score);
    setGrades(prev => {
      const exists = prev.find(g => g.studentId === studentId && g.assessmentId === assessmentId);
      if (exists) {
        return prev.map(g => (g.studentId === studentId && g.assessmentId === assessmentId) ? { ...g, score: val } : g);
      }
      return [...prev, { id: `g-${Date.now()}`, studentId, assessmentId, score: val }];
    });
  };

  const handleAddStudent = () => {
    if (!newStudent.name.trim() || !newStudent.program.trim()) return;
    const sequence = getNextSequenceNumber(studentIdYear);
    const newStudentData = {
      id: Date.now(),
      studentIdNum: generateStudentIdNum(studentIdYear, sequence),
      name: newStudent.name,
      program: newStudent.program,
      pinCode: generatePinCode()
    };
    setStudents([...students, newStudentData]);
    setNewStudent({ name: '', program: '' });
    setShowStudentModal(false);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
      setEnrollments(enrollments.filter(e => e.studentId !== id));
      setGrades(grades.filter(g => g.studentId !== id));
    }
  };

  const handleAddCourse = () => {
    if (!newCourse.code.trim() || !newCourse.title.trim() || !newCourse.room.trim()) return;
    setCourses([...courses, { id: Date.now(), ...newCourse }]);
    setNewCourse({ code: '', title: '', type: 'Lecture', day: 'MWF', time: '09:00 - 10:00', room: '' });
    setShowCourseModal(false);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setNewCourse(course);
    setShowCourseModal(true);
  };

  const handleUpdateCourse = () => {
    if (!newCourse.code.trim() || !newCourse.title.trim() || !newCourse.room.trim()) return;
    setCourses(courses.map(c => c.id === editingCourse.id ? { ...newCourse, id: editingCourse.id } : c));
    setEditingCourse(null);
    setNewCourse({ code: '', title: '', type: 'Lecture', day: 'MWF', time: '09:00 - 10:00', room: '' });
    setShowCourseModal(false);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('Delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
      setEnrollments(enrollments.filter(e => e.courseId !== id));
    }
  };

  const handleSaveCourses = () => {
    // Force save to localStorage and show confirmation
    saveToStorage('nlac_courses', courses);
    saveToStorage('nlac_enrollments', enrollments);
    
    // Show success message
    alert(`✅ Course data saved successfully!\n\nCourses: ${courses.length}\nEnrollments: ${enrollments.length}\n\nAll changes have been saved to the database.`);
  };

  const handleAddEnrollment = () => {
    if (!selectedStudentForEnrollment || !selectedCourseForEnrollment) return;
    const studentId = parseInt(selectedStudentForEnrollment);
    const courseId = parseInt(selectedCourseForEnrollment);
    
    if (enrollments.find(e => e.studentId === studentId && e.courseId === courseId)) {
      alert('Already enrolled!');
      return;
    }

    setEnrollments([...enrollments, { id: `en-${Date.now()}`, studentId, courseId }]);
    
    // Initialize grades
    const courseAssessments = assessments.filter(a => a.courseId === courseId);
    const newGrades = courseAssessments.map(a => ({
      id: `g-${Date.now()}-${a.id}`,
      studentId,
      assessmentId: a.id,
      score: ""
    }));
    setGrades([...grades, ...newGrades]);

    setSelectedStudentForEnrollment('');
    setSelectedCourseForEnrollment('');
    setShowEnrollmentModal(false);
  };

  const handleRemoveEnrollment = (enrollmentId) => {
    if (window.confirm('Remove this enrollment?')) {
      setEnrollments(enrollments.filter(e => e.id !== enrollmentId));
    }
  };

  // Assessment handlers
  const handleAddAssessment = () => {
    if (!newAssessment.title.trim() || !newAssessment.courseId) return;
    
    const assessmentData = {
      id: Date.now(),
      courseId: parseInt(newAssessment.courseId),
      category: newAssessment.category,
      title: newAssessment.title,
      month: newAssessment.month,
      hps: parseInt(newAssessment.hps),
      date: newAssessment.date,
      instructorComments: newAssessment.instructorComments
    };

    if (editingAssessment) {
      setAssessments(assessments.map(a => a.id === editingAssessment.id ? { ...assessmentData, id: editingAssessment.id } : a));
    } else {
      setAssessments([...assessments, assessmentData]);
    }

    setNewAssessment({ courseId: '', category: 'Written Exam', title: '', month: 'February', hps: 100, date: '', instructorComments: '' });
    setEditingAssessment(null);
    setShowAssessmentModal(false);
  };

  const handleUpdateHPS = () => {
    if (Object.keys(hpsUpdates).length === 0) return;
    
    setAssessments(assessments.map(a => ({
      ...a,
      hps: hpsUpdates[a.id] !== undefined ? hpsUpdates[a.id] : a.hps
    })));
    
    setHpsUpdates({});
    setShowHPSModal(false);
  };

  const handleSaveHPS = () => {
    // Force save to localStorage and show confirmation
    saveToStorage('nlac_assessments', assessments);
    saveToStorage('nlac_grades', grades);
    
    // Show success message
    alert(`✅ HPS data saved successfully!\n\nAssessments: ${assessments.length}\nGrades: ${grades.length}\n\nAll HPS changes have been saved to the database.`);
  };

  const handleSaveAssessments = () => {
    // Force save to localStorage and show confirmation
    saveToStorage('nlac_assessments', assessments);
    saveToStorage('nlac_grades', grades);
    
    // Show success message
    alert(`✅ Assessment data saved successfully!\n\nAssessments: ${assessments.length}\nGrades: ${grades.length}\n\nAll assessment changes have been saved to the database.`);
  };

  const handleSaveStudents = () => {
    // Force save to localStorage and show confirmation
    saveToStorage('nlac_students', students);
    saveToStorage('nlac_enrollments', enrollments);
    saveToStorage('nlac_grades', grades);
    
    // Show success message
    alert(`✅ Student data saved successfully!\n\nStudents: ${students.length}\nEnrollments: ${enrollments.length}\nGrades: ${grades.length}\n\nAll student changes have been saved to the database.`);
  };

  // Grade editing handlers
  const openGradeModal = (studentId, assessmentId) => {
    const score = getScore(studentId, assessmentId);
    setEditingGradeData({ studentId, assessmentId, score: score || '' });
    setShowGradeModal(true);
  };

  const handleSaveGrade = () => {
    const { studentId, assessmentId, score } = editingGradeData;
    updateGrade(studentId, assessmentId, score);
    setShowGradeModal(false);
    setEditingGradeData({ studentId: '', assessmentId: '', score: '' });
  };

  // Render functions
  const renderEnrollment = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Enrollment Management</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Enroll Students in Courses</p>
        </div>
        <button onClick={() => setShowEnrollmentModal(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-2xl">
          <Plus size={18} /> Add Enrollment
        </button>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
        <p className="text-sm text-blue-700">Adding an enrollment automatically initializes grade records for that student-course pair.</p>
      </div>

      {courses.map(course => {
        const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
        return (
          <div key={course.id} className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-8 py-4">
              <h3 className="text-lg font-black text-white">{course.code} - {course.title}</h3>
              <p className="text-xs text-slate-400">{course.day} • {course.time} • {course.room} • {courseEnrollments.length} enrolled</p>
            </div>
            {courseEnrollments.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No students enrolled</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">#</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">ID Number</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Program</th>
                    <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courseEnrollments.map((enrollment, idx) => {
                    const student = students.find(s => s.id === enrollment.studentId);
                    return (
                      <tr key={enrollment.id} className="border-b border-slate-100">
                        <td className="px-6 py-4">{idx + 1}</td>
                        <td className="px-6 py-4 font-bold">{student?.studentIdNum}</td>
                        <td className="px-6 py-4 font-bold">{student?.name}</td>
                        <td className="px-6 py-4"><span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-black uppercase">{student?.program}</span></td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleRemoveEnrollment(enrollment.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md">
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <h3 className="text-lg font-black text-white uppercase">Add Enrollment</h3>
              <button onClick={() => setShowEnrollmentModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Select Course</label>
                <select value={selectedCourseForEnrollment} onChange={e => { setSelectedCourseForEnrollment(e.target.value); setSelectedStudentForEnrollment(''); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold">
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Select Student</label>
                <select value={selectedStudentForEnrollment} onChange={e => setSelectedStudentForEnrollment(e.target.value)} disabled={!selectedCourseForEnrollment} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold disabled:bg-slate-100">
                  <option value="">Select Student</option>
                  {selectedCourseForEnrollment && getUnenrolledStudents(parseInt(selectedCourseForEnrollment)).map(s => <option key={s.id} value={s.id}>{s.studentIdNum} - {s.name}</option>)}
                </select>
              </div>
              <button onClick={handleAddEnrollment} disabled={!selectedStudentForEnrollment || !selectedCourseForEnrollment} className="w-full bg-blue-600 disabled:bg-slate-300 text-white font-black uppercase py-4 rounded-2xl">Enroll Student</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Student Registry</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Manage Student Records</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSaveStudents} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-sm rounded-2xl transition-colors">
            <Save size={18} /> Save Students
          </button>
          <button onClick={() => setShowStudentModal(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-2xl">
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase">#</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase">ID Number</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase">Name</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase">Program</th>
              <th className="px-6 py-5 text-center text-xs font-black text-blue-400 uppercase">PIN</th>
              <th className="px-6 py-5 text-center text-xs font-black text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={student.id} className="border-b border-slate-100 hover:bg-blue-50/30">
                <td className="px-6 py-4"><div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black">{idx + 1}</div></td>
                <td className="px-6 py-4 font-bold">{student.studentIdNum}</td>
                <td className="px-6 py-4 font-bold">{student.name}</td>
                <td className="px-6 py-4"><span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-black uppercase">{student.program}</span></td>
                <td className="px-6 py-4 text-center"><span className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl font-black text-amber-700">{student.pinCode}</span></td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleDeleteStudent(student.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md">
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <h3 className="text-lg font-black text-white uppercase">Add Student</h3>
              <button onClick={() => setShowStudentModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <p className="text-xs text-blue-500 uppercase font-black mb-1">ID: {generateStudentIdNum(studentIdYear, getNextSequenceNumber(studentIdYear))}</p>
                <p className="text-xs text-amber-500 uppercase font-black">PIN: {generatePinCode()}</p>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Year</label>
                <select value={studentIdYear} onChange={e => setStudentIdYear(parseInt(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold">
                  {[2024,2025,2026,2027,2028].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Name</label>
                <input type="text" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} placeholder="Last, First M.I." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Program</label>
                <select value={newStudent.program} onChange={e => setNewStudent({...newStudent, program: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold">
                  <option value="">Select</option>
                  <option value="BSCS">BSCS</option>
                  <option value="BSIT">BSIT</option>
                  <option value="BS MATH">BS MATH</option>
                  <option value="BSBA">BSBA</option>
                  <option value="BSED">BSED</option>
                </select>
              </div>
              <button onClick={handleAddStudent} disabled={!newStudent.name.trim() || !newStudent.program} className="w-full bg-blue-600 disabled:bg-slate-300 text-white font-black uppercase py-4 rounded-2xl">Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Course Management</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Manage Courses & Schedule</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSaveCourses} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-sm rounded-2xl transition-colors">
            <Save size={18} /> Save Changes
          </button>
          <button onClick={() => setShowCourseModal(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-2xl">
            <Plus size={18} /> Add Course
          </button>
        </div>
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
        <p className="text-sm text-green-700">All course changes are automatically saved to the database. Use "Save Changes" to confirm bulk operations or view save status.</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase">#</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase">Code</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase">Title</th>
              <th className="px-6 py-5 text-center text-xs font-black text-slate-500 uppercase">Type</th>
              <th className="px-6 py-5 text-center text-xs font-black text-slate-500 uppercase">Day</th>
              <th className="px-6 py-5 text-center text-xs font-black text-slate-500 uppercase">Time</th>
              <th className="px-6 py-5 text-center text-xs font-black text-slate-500 uppercase">Room</th>
              <th className="px-6 py-5 text-center text-xs font-black text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, idx) => (
              <tr key={course.id} className="border-b border-slate-100 hover:bg-blue-50/30">
                <td className="px-6 py-4"><div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black">{idx + 1}</div></td>
                <td className="px-6 py-4 font-bold">{course.code}</td>
                <td className="px-6 py-4 font-bold">{course.title}</td>
                <td className="px-6 py-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${course.type === 'Lab' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{course.type}</span></td>
                <td className="px-6 py-4 text-center font-bold">{course.day}</td>
                <td className="px-6 py-4 text-center font-bold">{course.time}</td>
                <td className="px-6 py-4 text-center font-bold">{course.room}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleEditCourse(course)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-xl mr-1"><Edit size={18} /></button>
                  <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md">
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <h3 className="text-lg font-black text-white uppercase">{editingCourse ? 'Edit' : 'Add'} Course</h3>
              <button onClick={() => { setShowCourseModal(false); setEditingCourse(null); }} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div><label className="text-xs font-black text-slate-400 uppercase mb-2 block">Code</label><input type="text" value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold" /></div>
              <div><label className="text-xs font-black text-slate-400 uppercase mb-2 block">Title</label><input type="text" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold" /></div>
              <div><label className="text-xs font-black text-slate-400 uppercase mb-2 block">Type</label><div className="flex gap-2"><button type="button" onClick={() => setNewCourse({...newCourse, type: 'Lecture'})} className={`flex-1 py-3 rounded-xl font-bold ${newCourse.type === 'Lecture' ? 'bg-green-500 text-white' : 'bg-slate-100'}`}>Lecture</button><button type="button" onClick={() => setNewCourse({...newCourse, type: 'Lab'})} className={`flex-1 py-3 rounded-xl font-bold ${newCourse.type === 'Lab' ? 'bg-purple-500 text-white' : 'bg-slate-100'}`}>Lab</button></div></div>
              <div><label className="text-xs font-black text-slate-400 uppercase mb-2 block">Day</label><select value={newCourse.day} onChange={e => setNewCourse({...newCourse, day: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold"><option value="MWF">MWF</option><option value="TTh">TTh</option><option value="Mon">Mon</option><option value="Tue">Tue</option><option value="Wed">Wed</option><option value="Thu">Thu</option><option value="Fri">Fri</option></select></div>
              <div><label className="text-xs font-black text-slate-400 uppercase mb-2 block">Time</label><input type="text" value={newCourse.time} onChange={e => setNewCourse({...newCourse, time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold" /></div>
              <div><label className="text-xs font-black text-slate-400 uppercase mb-2 block">Room</label><input type="text" value={newCourse.room} onChange={e => setNewCourse({...newCourse, room: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold" /></div>
              <button onClick={editingCourse ? handleUpdateCourse : handleAddCourse} disabled={!newCourse.code.trim() || !newCourse.title.trim() || !newCourse.room.trim()} className="w-full bg-blue-600 disabled:bg-slate-300 text-white font-black uppercase py-4 rounded-2xl">{editingCourse ? 'Update' : 'Add'} Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderGradeEntry = () => {
    // Sort students alphabetically by name
    const sortedStudents = [...studentsInCourse].sort((a, b) => a.name.localeCompare(b.name));

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Grade Entry</h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Comprehensive Grade Management</p>
          </div>
          <div className="flex gap-2">
            <select value={selectedCourseId} onChange={e => setSelectedCourseId(parseInt(e.target.value))} className="bg-white p-3 rounded-xl border border-slate-200 font-bold text-sm">
              {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
            </select>
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="bg-white p-3 rounded-xl border border-slate-200 font-bold text-sm">
              {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {sortedStudents.length === 0 ? (
          <div className="p-8 bg-amber-50 border border-amber-200 rounded-2xl text-center">
            <p className="font-bold text-amber-700">No students enrolled in this course</p>
            <p className="text-sm text-amber-600">Go to Enrollment to add students</p>
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div className="p-8 bg-blue-50 border border-blue-200 rounded-2xl text-center">
            <p className="font-bold text-blue-700">No assessments found for {selectedMonth}</p>
            <p className="text-sm text-blue-600">Go to Assessment Management to create assessments</p>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="sticky left-0 bg-slate-900 px-8 py-4 text-left text-xs font-black text-slate-500 uppercase min-w-[250px]">Student</th>
                    {filteredAssessments.map(a => (
                      <th key={a.id} className="px-3 py-4 text-center min-w-[180px]">
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-blue-400 uppercase">{a.category}</div>
                          <div className="text-xs font-black">{a.title}</div>
                          <div className="text-[10px] text-slate-500">{a.date}</div>
                          <div className="text-[10px] text-slate-400">HPS: {a.hps}</div>
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-center bg-indigo-900/50 min-w-[120px]">
                      <div className="text-xs font-black text-slate-500 uppercase">Overall</div>
                      <div className="text-[10px] text-slate-400">Average</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((student, sIdx) => {
                    let totalEarned = 0, totalHps = 0;
                    const studentGrades = filteredAssessments.map(a => {
                      const score = getScore(student.id, a.id);
                      const percentage = calculatePercentage(score, a.hps);
                      const equivalent = calculateEquivalent(percentage);
                      const letterGrade = calculateLetterGrade(percentage);

                      if (score !== "" && score !== null && !isNaN(parseFloat(score))) {
                        totalEarned += parseFloat(score);
                        totalHps += a.hps;
                      }

                      return {
                        assessment: a,
                        score,
                        percentage,
                        equivalent,
                        letterGrade
                      };
                    });

                    const overallPercentage = totalHps > 0 ? Math.round((totalEarned/totalHps)*100) : 0;
                    const overallEquivalent = calculateEquivalent(overallPercentage);
                    const overallLetterGrade = calculateLetterGrade(overallPercentage);

                    return (
                      <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="sticky left-0 bg-white px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black">{sIdx + 1}</div>
                            <div>
                              <div className="font-bold text-slate-800">{student.name}</div>
                              <div className="text-[10px] text-slate-400 uppercase">{student.studentIdNum}</div>
                            </div>
                          </div>
                        </td>
                        {studentGrades.map(({ assessment, score, percentage, equivalent, letterGrade }) => (
                          <td key={assessment.id} className="px-3 py-3 text-center">
                            <div className="space-y-2">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => openGradeModal(student.id, assessment.id)}
                                  className="px-2 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-xs font-bold min-w-[40px] transition-colors"
                                >
                                  {score || "-"}
                                </button>
                                {score && (
                                  <button
                                    onClick={() => deleteGrade(student.id, assessment.id)}
                                    className="p-1 text-red-400 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete grade"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                              <div className="space-y-1">
                                <div className="text-[10px] text-slate-500">{score}/{assessment.hps}</div>
                                <div className={`text-xs font-black ${percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                  {percentage}%
                                </div>
                                <div className={`text-[10px] font-bold ${percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                  {equivalent.toFixed(2)}
                                </div>
                                <div className={`text-xs font-black ${percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                  {letterGrade}
                                </div>
                              </div>
                            </div>
                          </td>
                        ))}
                        <td className="px-6 py-4 text-center bg-slate-50/50">
                          <div className="space-y-1">
                            <div className={`text-lg font-black ${overallPercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                              {overallPercentage}%
                            </div>
                            <div className={`text-xs font-bold ${overallPercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                              {overallEquivalent.toFixed(2)}
                            </div>
                            <div className={`text-sm font-black ${overallPercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                              {overallLetterGrade}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grade Editing Modal */}
        {showGradeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md">
              <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
                <h3 className="text-lg font-black text-white uppercase">Edit Grade</h3>
                <button onClick={() => setShowGradeModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-4">
                {(() => {
                  const student = students.find(s => s.id === editingGradeData.studentId);
                  const assessment = assessments.find(a => a.id === editingGradeData.assessmentId);
                  return (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <div className="text-sm font-bold text-slate-800">{student?.name}</div>
                      <div className="text-xs text-slate-600">{assessment?.title} ({assessment?.category})</div>
                      <div className="text-xs text-slate-500">HPS: {assessment?.hps} • {assessment?.month} {assessment?.date}</div>
                    </div>
                  );
                })()}
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Score</label>
                  <input
                    type="number"
                    min="0"
                    max={assessments.find(a => a.id === editingGradeData.assessmentId)?.hps || 100}
                    value={editingGradeData.score}
                    onChange={e => setEditingGradeData({...editingGradeData, score: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-center"
                    placeholder="Enter score"
                  />
                </div>
                <button onClick={handleSaveGrade} className="w-full bg-blue-600 text-white font-black uppercase py-4 rounded-2xl">
                  Save Grade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Assessment Management
  const renderAssessment = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Assessment Management</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Create and Manage Assessments</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSaveAssessments} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-sm rounded-2xl transition-colors">
            <Save size={18} /> Save Assessments
          </button>
          <button onClick={() => setShowAssessmentModal(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-2xl">
            <Plus size={18} /> Add Assessment
          </button>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
        <p className="text-sm text-blue-700">Assessments are automatically linked to grade entry. Changes here will reflect in the Grade Entry section.</p>
      </div>

      {courses.map(course => {
        const courseAssessments = assessments.filter(a => a.courseId === course.id);
        const monthlyCount = courseAssessments.reduce((acc, a) => {
          acc[a.month] = (acc[a.month] || 0) + 1;
          return acc;
        }, {});

        return (
          <div key={course.id} className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-8 py-4">
              <h3 className="text-lg font-black text-white">{course.code} - {course.title}</h3>
              <p className="text-xs text-slate-400">{courseAssessments.length} assessments • {Object.keys(monthlyCount).length} months</p>
            </div>
            
            {courseAssessments.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No assessments created</div>
            ) : (
              <div className="p-6 space-y-4">
                {courseAssessments.map(assessment => (
                  <div key={assessment.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-slate-800">{assessment.title}</h4>
                        <p className="text-sm text-slate-600">{assessment.category} • {assessment.month} {assessment.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-blue-600">HPS: {assessment.hps}</div>
                        <button onClick={() => { 
                          setEditingAssessment(assessment); 
                          setNewAssessment({
                            courseId: assessment.courseId.toString(),
                            category: assessment.category,
                            title: assessment.title,
                            month: assessment.month,
                            hps: assessment.hps,
                            date: assessment.date,
                            instructorComments: assessment.instructorComments || ''
                          });
                          setShowAssessmentModal(true); 
                        }} className="text-xs text-blue-500 hover:text-blue-700 font-bold">Edit</button>
                      </div>
                    </div>
                    {assessment.instructorComments && (
                      <div className="bg-white border border-slate-200 rounded-xl p-3">
                        <p className="text-sm text-slate-700 italic">"{assessment.instructorComments}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // HPS Entry Management
  const renderHPSEntry = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">HPS Entry Management</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Update Highest Possible Scores</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSaveHPS} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-sm rounded-2xl transition-colors">
            <Save size={18} /> Save HPS Changes
          </button>
          <button onClick={() => setShowHPSModal(true)} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold text-sm rounded-2xl">
            <Key size={18} /> Update HPS
          </button>
        </div>
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
        <p className="text-sm text-green-700">HPS changes are automatically reflected in grade calculations and student dashboards.</p>
      </div>

      {courses.map(course => {
        const courseAssessments = assessments.filter(a => a.courseId === course.id);
        
        return (
          <div key={course.id} className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-8 py-4">
              <h3 className="text-lg font-black text-white">{course.code} - {course.title}</h3>
              <p className="text-xs text-slate-400">{courseAssessments.length} assessments</p>
            </div>
            
            {courseAssessments.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No assessments available</div>
            ) : (
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase">Assessment</th>
                      <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase">Month</th>
                      <th className="px-4 py-3 text-center text-xs font-black text-slate-500 uppercase">Current HPS</th>
                      <th className="px-4 py-3 text-center text-xs font-black text-slate-500 uppercase">New HPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseAssessments.map(assessment => (
                      <tr key={assessment.id} className="border-b border-slate-100">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800">{assessment.title}</div>
                          <div className="text-xs text-slate-500">{assessment.date}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{assessment.category}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{assessment.month}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg font-bold text-blue-700">{assessment.hps}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="number" 
                            min="1"
                            value={hpsUpdates[assessment.id] || assessment.hps}
                            onChange={e => setHpsUpdates({...hpsUpdates, [assessment.id]: parseInt(e.target.value) || assessment.hps})}
                            className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <aside className="w-72 bg-[#1e293b] flex flex-col">
        <div className="p-8 flex items-center gap-4 text-white">
          <div className="bg-blue-500 p-2 rounded-xl"><GraduationCap className="w-6 h-6" /></div>
          <span className="text-xl font-black uppercase">Academic<span className="text-blue-400">Pro</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab('Enrollment')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold ${activeTab === 'Enrollment' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
            <ClipboardList size={20} /> Enrollment
          </button>
          <button onClick={() => setActiveTab('Students')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold ${activeTab === 'Students' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
            <Users size={20} /> Students
          </button>
          <button onClick={() => setActiveTab('Courses')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold ${activeTab === 'Courses' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
            <BookOpen size={20} /> Courses
          </button>
          <button onClick={() => setActiveTab('Assessment')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold ${activeTab === 'Assessment' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
            <FileText size={20} /> Assessment
          </button>
          <button onClick={() => setActiveTab('HPS Entry')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold ${activeTab === 'HPS Entry' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
            <Key size={20} /> HPS Entry
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:text-red-400 mt-10">
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 flex items-center justify-between px-10 bg-white border-b border-slate-200/60">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="font-black text-[10px] uppercase">Admin</span>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-bold uppercase text-[10px]">{activeTab}</span>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center font-black">AD</div>
        </header>
        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/40">
          {activeTab === 'Enrollment' && renderEnrollment()}
          {activeTab === 'Students' && renderStudents()}
          {activeTab === 'Courses' && renderCourses()}
          {activeTab === 'Assessment' && renderAssessment()}
          {activeTab === 'HPS Entry' && renderHPSEntry()}
          {activeTab === 'Grade Entry' && renderGradeEntry()}
        </div>
      </main>

      {/* Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg">
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <h3 className="text-lg font-black text-white uppercase">{editingAssessment ? 'Edit Assessment' : 'Add Assessment'}</h3>
              <button onClick={() => { setShowAssessmentModal(false); setEditingAssessment(null); }} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Course</label>
                <select 
                  value={newAssessment.courseId} 
                  onChange={e => setNewAssessment({...newAssessment, courseId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold"
                >
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Assessment Type</label>
                <select 
                  value={newAssessment.category} 
                  onChange={e => setNewAssessment({...newAssessment, category: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold"
                >
                  <option value="Written Exam">Written Exam</option>
                  <option value="Performance Task">Performance Task</option>
                  <option value="Quarterly Exam">Quarterly Exam</option>
                  <option value="Project">Project</option>
                  <option value="Lab Exercise">Lab Exercise</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Title</label>
                <input 
                  type="text" 
                  value={newAssessment.title} 
                  onChange={e => setNewAssessment({...newAssessment, title: e.target.value})}
                  placeholder="e.g., Prelim Exam, Quiz 1" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Month</label>
                  <select 
                    value={newAssessment.month} 
                    onChange={e => setNewAssessment({...newAssessment, month: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold"
                  >
                    {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">HPS</label>
                  <input 
                    type="number" 
                    min="1"
                    value={newAssessment.hps} 
                    onChange={e => setNewAssessment({...newAssessment, hps: parseInt(e.target.value) || 100})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold" 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Date</label>
                <input 
                  type="date" 
                  value={newAssessment.date} 
                  onChange={e => setNewAssessment({...newAssessment, date: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold" 
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Instructor Comments</label>
                <textarea 
                  value={newAssessment.instructorComments} 
                  onChange={e => setNewAssessment({...newAssessment, instructorComments: e.target.value})}
                  placeholder="Optional comments about the assessment..." 
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold resize-none" 
                />
              </div>
              <button 
                onClick={handleAddAssessment} 
                disabled={!newAssessment.title.trim() || !newAssessment.courseId}
                className="w-full bg-blue-600 disabled:bg-slate-300 text-white font-black uppercase py-4 rounded-2xl"
              >
                {editingAssessment ? 'Update Assessment' : 'Create Assessment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HPS Update Modal */}
      {showHPSModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md">
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <h3 className="text-lg font-black text-white uppercase">Update HPS Values</h3>
              <button onClick={() => setShowHPSModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                <p className="text-sm text-green-700">Review the HPS values below and update as needed. Changes will be applied to all assessments.</p>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {assessments.map(assessment => {
                  const course = courses.find(c => c.id === assessment.courseId);
                  return (
                    <div key={assessment.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-bold text-sm">{assessment.title}</div>
                        <div className="text-xs text-slate-500">{course?.code} • {assessment.category}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Current: {assessment.hps}</span>
                        <input 
                          type="number" 
                          min="1"
                          value={hpsUpdates[assessment.id] || assessment.hps}
                          onChange={e => setHpsUpdates({...hpsUpdates, [assessment.id]: parseInt(e.target.value) || assessment.hps})}
                          className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center font-bold text-sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={handleUpdateHPS}
                className="w-full bg-green-600 text-white font-black uppercase py-4 rounded-2xl"
              >
                Update All HPS Values
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

