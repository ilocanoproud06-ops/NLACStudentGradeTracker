import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, BookOpen, Users, UserPlus, FileEdit, 
  Target, ChevronRight, Calendar, Users2, GraduationCap,
  Download, Save, Filter, X, Plus, Trash2, Edit, Key, ClipboardList, Clock, MapPin
} from 'lucide-react';

// Helper functions for ID and PIN generation
const generateStudentIdNum = (year, sequence) => {
  return `${year}-${String(sequence).padStart(4, '0')}`;
};

const generatePinCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit PIN
};

const getCurrentYear = () => new Date().getFullYear();

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('Grade Entry');
  const [selectedCourseId, setSelectedCourseId] = useState(101);
  const [selectedMonth, setSelectedMonth] = useState('February');
  
  // Students management state
  const [students, setStudents] = useState([
    { id: 1, studentIdNum: "2024-0001", name: "Garcia, Maria S.", program: "BSCS", pinCode: "4521" },
    { id: 2, studentIdNum: "2024-0002", name: "Wilson, James K.", program: "BSIT", pinCode: "7832" },
    { id: 3, studentIdNum: "2024-0003", name: "Chen, Robert L.", program: "BS MATH", pinCode: "9012" }
  ]);
  
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', program: '' });
  const [studentIdYear, setStudentIdYear] = useState(getCurrentYear());

  // Courses state with scheduling info
  const [courses, setCourses] = useState([
    { id: 101, title: "Mathematics 101", code: "MATH101", type: "Lecture", day: "MWF", time: "09:00 - 10:00", room: "Room 301" },
    { id: 102, title: "Computer Science", code: "CS202", type: "Lab", day: "TTh", time: "13:00 - 15:00", room: "Lab 101" }
  ]);

  // Show course modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({ code: '', title: '', type: 'Lecture', day: 'MWF', time: '09:00 - 10:00', room: '' });

  // Enrollments state
  const [enrollments, setEnrollments] = useState([
    { id: 'en-1', studentId: 1, courseId: 101 },
    { id: 'en-2', studentId: 1, courseId: 102 },
    { id: 'en-3', studentId: 2, courseId: 101 },
    { id: 'en-4', studentId: 3, courseId: 101 }
  ]);

  // Show enrollment modal
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedStudentForEnrollment, setSelectedStudentForEnrollment] = useState('');
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState('');

  const [assessments] = useState([
    { id: 501, courseId: 101, category: "Written Exam", title: "Prelim Exam", month: "February", hps: 100 },
    { id: 502, courseId: 101, category: "Written Exam", title: "Quiz 1", month: "February", hps: 50 },
    { id: 503, courseId: 101, category: "Performance Task", title: "Seatwork", month: "February", hps: 20 },
    { id: 504, courseId: 102, category: "Written Exam", title: "Midterm Exam", month: "February", hps: 100 },
    { id: 505, courseId: 102, category: "Performance Task", title: "Project", month: "February", hps: 50 }
  ]);

  // Grades state - now initialized when enrollment is created
  const [grades, setGrades] = useState([
    { id: 'g1', studentId: 1, assessmentId: 501, score: 95 },
    { id: 'g2', studentId: 2, assessmentId: 501, score: 88 }
  ]);

  // --- LOGIC ---
  const filteredAssessments = useMemo(() => 
    assessments.filter(a => a.courseId === selectedCourseId && a.month === selectedMonth),
    [assessments, selectedCourseId, selectedMonth]
  );

  // Get students enrolled in the selected course
  const studentsInCourse = useMemo(() => {
    const enrolledIds = enrollments.filter(e => e.courseId === selectedCourseId).map(e => e.studentId);
    return students.filter(s => enrolledIds.includes(s.id));
  }, [students, enrollments, selectedCourseId]);

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

  const getScore = (studentId, assessmentId) => {
    const entry = grades.find(g => g.studentId === studentId && g.assessmentId === assessmentId);
    return entry ? entry.score : "";
  };

  // Student management functions
  const getNextSequenceNumber = (year) => {
    const existingStudents = students.filter(s => s.studentIdNum.startsWith(year.toString()));
    if (existingStudents.length === 0) return 1;
    const maxSeq = Math.max(...existingStudents.map(s => parseInt(s.studentIdNum.split('-')[1])));
    return maxSeq + 1;
  };

  const handleAddStudent = () => {
    if (!newStudent.name.trim() || !newStudent.program.trim()) return;
    
    const sequence = getNextSequenceNumber(studentIdYear);
    const studentIdNum = generateStudentIdNum(studentIdYear, sequence);
    const pinCode = generatePinCode();
    
    const newStudentData = {
      id: Date.now(),
      studentIdNum,
      name: newStudent.name,
      program: newStudent.program,
      pinCode
    };
    
    setStudents([...students, newStudentData]);
    setNewStudent({ name: '', program: '' });
    setShowStudentModal(false);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student? This will also remove all enrollments for this student.')) {
      setStudents(students.filter(s => s.id !== id));
      setEnrollments(enrollments.filter(e => e.studentId !== id));
      setGrades(grades.filter(g => g.studentId !== id));
    }
  };

  // Course management functions
  const handleAddCourse = () => {
    if (!newCourse.code.trim() || !newCourse.title.trim() || !newCourse.room.trim()) return;
    
    const newCourseData = {
      id: Date.now(),
      ...newCourse
    };
    
    setCourses([...courses, newCourseData]);
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
    if (window.confirm('Are you sure you want to delete this course? This will also remove all enrollments and grades for this course.')) {
      setCourses(courses.filter(c => c.id !== id));
      setEnrollments(enrollments.filter(e => e.courseId !== id));
      const courseAssessments = assessments.filter(a => a.courseId === id).map(a => a.id);
      setGrades(grades.filter(g => !courseAssessments.includes(g.assessmentId)));
    }
  };

  const closeCourseModal = () => {
    setShowCourseModal(false);
    setEditingCourse(null);
    setNewCourse({ code: '', title: '', type: 'Lecture', day: 'MWF', time: '09:00 - 10:00', room: '' });
  };

  // Enrollment functions
  const getEnrolledStudentsForCourse = (courseId) => {
    return enrollments.filter(e => e.courseId === courseId).map(e => e.studentId);
  };

  const getUnenrolledStudents = (courseId) => {
    const enrolledIds = getEnrolledStudentsForCourse(courseId);
    return students.filter(s => !enrolledIds.includes(s.id));
  };

  const handleAddEnrollment = () => {
    if (!selectedStudentForEnrollment || !selectedCourseForEnrollment) return;

    const studentId = parseInt(selectedStudentForEnrollment);
    const courseId = parseInt(selectedCourseForEnrollment);

    // Check if already enrolled
    const existingEnrollment = enrollments.find(e => e.studentId === studentId && e.courseId === courseId);
    if (existingEnrollment) {
      alert('This student is already enrolled in this course!');
      return;
    }

    // Add enrollment
    const newEnrollment = {
      id: `en-${Date.now()}`,
      studentId,
      courseId
    };
    setEnrollments([...enrollments, newEnrollment]);

    // Initialize grade records for all assessments in this course
    const courseAssessments = assessments.filter(a => a.courseId === courseId);
    const newGrades = courseAssessments.map(a => ({
      id: `g-${Date.now()}-${a.id}`,
      studentId,
      assessmentId: a.id,
      score: "" // Empty placeholder (will show as "-")
    }));
    setGrades([...grades, ...newGrades]);

    // Reset modal
    setSelectedStudentForEnrollment('');
    setSelectedCourseForEnrollment('');
    setShowEnrollmentModal(false);
  };

  const handleRemoveEnrollment = (enrollmentId, studentId, courseId) => {
    if (window.confirm('Are you sure you want to remove this enrollment? All grades for this student-course pair will be removed.')) {
      setEnrollments(enrollments.filter(e => e.id !== enrollmentId));
      setGrades(grades.filter(g => !(g.studentId === studentId && g.assessmentId && 
        assessments.find(a => a.id === g.assessmentId && a.courseId === courseId))));
    }
  };

  const renderGradeEntry = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Grade Entry Spreadsheet</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Excel-Style Manual Entry Mode</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-[24px] shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <Filter size={14} className="text-slate-400" />
            <select 
              value={selectedCourseId} 
              onChange={(e) => setSelectedCourseId(parseInt(e.target.value))}
              className="bg-transparent text-xs font-black text-slate-700 outline-none"
            >
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.title}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <Calendar size={14} className="text-slate-400" />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-black text-slate-700 outline-none"
            >
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {studentsInCourse.length === 0 && (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="flex items-center gap-3 text-amber-700">
            <ClipboardList size={24} />
            <div>
              <p className="font-bold">No students enrolled in this course</p>
              <p className="text-sm">Go to Enrollment tab to add students to this course.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="sticky left-0 z-10 bg-slate-900 px-8 py-6 text-left border-r border-slate-800 min-w-[280px]">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Student Info</div>
                </th>
                {filteredAssessments.length === 0 ? (
                  <th className="px-8 py-6 text-center">No assessments for this month</th>
                ) : (
                  filteredAssessments.map(a => (
                    <th key={a.id} className="px-6 py-6 text-center border-r border-slate-800 min-w-[140px]">
                      <div className="text-[10px] font-black text-blue-400 uppercase mb-1">{a.category}</div>
                      <div className="text-xs font-black tracking-tight">{a.title}</div>
                      <div className="text-[10px] font-bold text-slate-500 mt-1 italic">HPS: {a.hps}</div>
                    </th>
                  ))
                )}
                <th className="px-8 py-6 text-center bg-indigo-900/50 min-w-[120px]">
                  <div className="text-[10px] font-black text-indigo-300 uppercase">Average</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {studentsInCourse.map((student, sIdx) => {
                let totalEarned = 0;
                let totalHps = 0;

                return (
                  <tr key={student.id} className="group hover:bg-blue-50/30 transition-colors border-b border-slate-100">
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/30 px-8 py-4 border-r border-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">{sIdx + 1}</div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{student.name}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase">{student.studentIdNum}</div>
                        </div>
                      </div>
                    </td>
                    {filteredAssessments.map(a => {
                      const score = getScore(student.id, a.id);
                      if (score !== "" && score !== null) {
                        totalEarned += parseFloat(score);
                        totalHps += a.hps;
                      }
                      return (
                        <td key={a.id} className="px-4 py-3 border-r border-slate-50 text-center">
                          <input 
                            type="number" 
                            max={a.hps}
                            value={score}
                            onChange={(e) => updateGrade(student.id, a.id, e.target.value)}
                            className="w-20 px-3 py-2 bg-slate-50 rounded-xl text-center text-sm font-black text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all border-2 border-transparent"
                            placeholder="-"
                          />
                        </td>
                      );
                    })}
                    <td className="px-8 py-4 text-center bg-slate-50/50">
                      <div className="font-black text-indigo-600 text-sm">
                        {totalHps > 0 ? Math.round((totalEarned / totalHps) * 100) : 0}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Course Management</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Manage Course Schedule & Classification</p>
        </div>
        
        <button 
          onClick={() => setShowCourseModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus size={18} />
          Add New Course
        </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[2px]">#</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Code</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Title</th>
                <th className="px-6 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Type</th>
                <th className="px-6 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Day</th>
                <th className="px-6 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Time</th>
                <th className="px-6 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Room</th>
                <th className="px-6 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.id} className="group hover:bg-blue-50/30 transition-colors border-b border-slate-100">
                  <td className="px-6 py-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">{index + 1}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">{course.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">{course.title}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${course.type === 'Lab' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                      {course.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-slate-700">{course.day}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{course.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{course.room}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEditCourse(course)}
                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h3>
              <button 
                onClick={closeCourseModal}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-5">
              {/* Course Code */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Course Code</label>
                <input 
                  type="text"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  placeholder="e.g., MATH101"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Course Title */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Course Title</label>
                <input 
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g., Mathematics 101"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Course Type */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Classification</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setNewCourse({ ...newCourse, type: 'Lecture' })}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                      newCourse.type === 'Lecture' 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    Lecture
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCourse({ ...newCourse, type: 'Lab' })}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                      newCourse.type === 'Lab' 
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    Lab
                  </button>
                </div>
              </div>

              {/* Day */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Day</label>
                <select 
                  value={newCourse.day}
                  onChange={(e) => setNewCourse({ ...newCourse, day: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MWF">MWF (Mon-Wed-Fri)</option>
                  <option value="TTh">TTh (Tue-Thu)</option>
                  <option value="Sat">Saturday</option>
                  <option value="Mon">Monday</option>
                  <option value="Tue">Tuesday</option>
                  <option value="Wed">Wednesday</option>
                  <option value="Thu">Thursday</option>
                  <option value="Fri">Friday</option>
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Time</label>
                <input 
                  type="text"
                  value={newCourse.time}
                  onChange={(e) => setNewCourse({ ...newCourse, time: e.target.value })}
                  placeholder="e.g., 09:00 - 10:00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Room */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Room</label>
                <input 
                  type="text"
                  value={newCourse.room}
                  onChange={(e) => setNewCourse({ ...newCourse, room: e.target.value })}
                  placeholder="e.g., Room 301"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button 
                onClick={editingCourse ? handleUpdateCourse : handleAddCourse}
                disabled={!newCourse.code.trim() || !newCourse.title.trim() || !newCourse.room.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                {editingCourse ? 'Update Course' : 'Add Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderEnrollment = () => {
    // Group enrollments by course
    const enrollmentsByCourse = courses.map(course => {
      const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
      return {
        course,
        enrollments: courseEnrollments.map(e => ({
          ...e,
          student: students.find(s => s.id === e.studentId)
        }))
      };
    });

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Enrollment Management</h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Bridge Between Students and Gradebook</p>
          </div>
          
          <button 
            onClick={() => setShowEnrollmentModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus size={18} />
            Add Enrollment
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <p className="text-sm text-blue-700 font-medium">
            <span className="font-bold">Note:</span> Adding an enrollment automatically initializes grade records for that student-course pair. 
            The student will immediately appear in the Grade Entry spreadsheet.
          </p>
        </div>

        {courses.map(({ course, enrollments: courseEnrollments }) => (
          <div key={course.id} className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-8 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">{course.code} - {course.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${course.type === 'Lab' ? 'bg-purple-500/30 text-purple-300' : 'bg-green-500/30 text-green-300'}`}>
                    {course.type}
                  </span>
                  <span className="text-xs text-slate-400">{course.day} • {course.time} • {course.room}</span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-400">{courseEnrollments.length} enrolled</span>
            </div>
            
            {courseEnrollments.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <p className="font-medium">No students enrolled yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[2px]">#</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[2px]">ID Number</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Student Name</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Program</th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseEnrollments.map((enrollment, index) => (
                      <tr key={enrollment.id} className="group hover:bg-blue-50/30 transition-colors border-b border-slate-100">
                        <td className="px-6 py-4">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">{index + 1}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-800">{enrollment.student?.studentIdNum}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-800">{enrollment.student?.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-black text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full">{enrollment.student?.program}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <button 
                              onClick={() => handleRemoveEnrollment(enrollment.id, enrollment.studentId, course.id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {/* Add Enrollment Modal */}
        {showEnrollmentModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Add Enrollment</h3>
                <button 
                  onClick={() => setShowEnrollmentModal(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                {/* Info */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                  <p className="text-sm text-green-700 font-medium">
                    Adding an enrollment will automatically create grade placeholders for all assessments in the selected course.
                  </p>
                </div>

                {/* Course Selection */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Select Course</label>
                  <select 
                    value={selectedCourseForEnrollment}
                    onChange={(e) => {
                      setSelectedCourseForEnrollment(e.target.value);
                      setSelectedStudentForEnrollment('');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.title} ({c.type})</option>
                    ))}
                  </select>
                </div>

                {/* Student Selection */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Select Student</label>
                  <select 
                    value={selectedStudentForEnrollment}
                    onChange={(e) => setSelectedStudentForEnrollment(e.target.value)}
                    disabled={!selectedCourseForEnrollment}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">Select Student</option>
                    {selectedCourseForEnrollment && getUnenrolledStudents(parseInt(selectedCourseForEnrollment)).map(s => (
                      <option key={s.id} value={s.id}>{s.studentIdNum} - {s.name}</option>
                    ))}
                    {selectedCourseForEnrollment && getUnenrolledStudents(parseInt(selectedCourseForEnrollment)).length === 0 && (
                      <option disabled>All students already enrolled</option>
                    )}
                  </select>
                </div>

                {/* Submit Button */}
                <button 
                  onClick={handleAddEnrollment}
                  disabled={!selectedStudentForEnrollment || !selectedCourseForEnrollment}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Enroll Student
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStudents = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Student Registry</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Manage Student Records</p>
        </div>
        
        <button 
          onClick={() => setShowStudentModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus size={18} />
          Add New Student
        </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[2px]">#</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[2px]">ID Number</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Student Name</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Program</th>
                <th className="px-6 py-5 text-center text-[10px] font-black text-blue-400 uppercase tracking-[2px]">PIN Code</th>
                <th className="px-6 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="group hover:bg-blue-50/30 transition-colors border-b border-slate-100">
                  <td className="px-6 py-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">{index + 1}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">{student.studentIdNum}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">{student.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full">{student.program}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                      <Key size={14} className="text-amber-500" />
                      <span className="text-sm font-black text-amber-700">{student.pinCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Add New Student</h3>
              <button 
                onClick={() => setShowStudentModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* ID Number Preview */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Generated ID Number</div>
                <div className="text-2xl font-black text-slate-800">
                  {generateStudentIdNum(studentIdYear, getNextSequenceNumber(studentIdYear))}
                </div>
              </div>

              {/* PIN Code Preview */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Generated PIN Code</div>
                <div className="text-2xl font-black text-amber-700 flex items-center gap-2">
                  <Key size={24} />
                  {generatePinCode()}
                </div>
              </div>

              {/* Year Selection */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Academic Year</label>
                <select 
                  value={studentIdYear}
                  onChange={(e) => setStudentIdYear(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[2024, 2025, 2026, 2027, 2028].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Student Name */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                <input 
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Last Name, First Name M.I."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Program */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Program</label>
                <select 
                  value={newStudent.program}
                  onChange={(e) => setNewStudent({ ...newStudent, program: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Program</option>
                  <option value="BSCS">BSCS - Computer Science</option>
                  <option value="BSIT">BSIT - Information Technology</option>
                  <option value="BS MATH">BS MATH - Mathematics</option>
                  <option value="BSBA">BSBA - Business Administration</option>
                  <option value="BSED">BSED - Education</option>
                </select>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleAddStudent}
                disabled={!newStudent.name.trim() || !newStudent.program.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Register Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      <aside className="w-72 bg-[#1e293b] flex flex-col shrink-0 shadow-2xl z-20">
        <div className="p-8 flex items-center gap-4 text-white">
          <div className="bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/30"><GraduationCap className="text-white w-6 h-6" /></div>
          <span className="text-xl font-black tracking-tight uppercase">Academic<span className="text-blue-400">Pro</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <NavItem icon={<Users size={20}/>} label="Students" active={activeTab === 'Students'} onClick={() => setActiveTab('Students')} />
          <NavItem icon={<BookOpen size={20}/>} label="Courses" active={activeTab === 'Courses'} onClick={() => setActiveTab('Courses')} />
          <div className="pt-8 pb-2 px-4"><span className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Grade Portal</span></div>
          <NavItem icon={<ClipboardList size={20}/>} label="Enrollment" active={activeTab === 'Enrollment'} onClick={() => setActiveTab('Enrollment')} />
          <NavItem icon={<FileEdit size={20}/>} label="Grade Entry" active={activeTab === 'Grade Entry'} onClick={() => setActiveTab('Grade Entry')} />
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-slate-500 hover:text-red-400 hover:bg-red-400/10 mt-10"
          >
            <span className="text-sm font-bold tracking-tight">Logout System</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 flex items-center justify-between px-10 bg-white border-b border-slate-200/60">
          <div className="flex items-center gap-3 text-slate-400">
             <span className="font-black text-[10px] tracking-widest uppercase">Admin</span>
             <ChevronRight size={14} />
             <span className="text-slate-800 font-bold tracking-tight uppercase tracking-widest text-[10px]">{activeTab}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black">AD</div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/40">
          {activeTab === 'Grade Entry' && renderGradeEntry()}
          {activeTab === 'Students' && renderStudents()}
          {activeTab === 'Courses' && renderCourses()}
          {activeTab === 'Enrollment' && renderEnrollment()}
          {activeTab === 'Dashboard' && (
            <div className="p-20 text-center text-slate-300 italic font-black text-2xl uppercase tracking-widest opacity-20">Dashboard Coming Soon</div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
      <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>{icon}</span>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

