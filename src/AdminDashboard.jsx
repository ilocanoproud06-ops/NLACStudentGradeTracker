import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Users, FileEdit, ChevronRight, Calendar, GraduationCap,
  Filter, X, Plus, Trash2, Edit, Key, ClipboardList, Clock, MapPin, FileText
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
  { id: 501, courseId: 101, category: "Written Exam", title: "Prelim Exam", month: "February", hps: 100, date: "2024-02-15" },
  { id: 502, courseId: 101, category: "Written Exam", title: "Quiz 1", month: "February", hps: 50, date: "2024-02-20" },
  { id: 503, courseId: 101, category: "Performance Task", title: "Seatwork", month: "February", hps: 20, date: "2024-02-22" },
  { id: 504, courseId: 102, category: "Written Exam", title: "Prelim Exam", month: "February", hps: 100, date: "2024-02-16" },
  { id: 505, courseId: 102, category: "Performance Task", title: "Lab Exercise 1", month: "February", hps: 50, date: "2024-02-21" }
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
  const [editingCourse, setEditingCourse] = useState(null);

  // Form states
  const [newStudent, setNewStudent] = useState({ name: '', program: '' });
  const [studentIdYear, setStudentIdYear] = useState(getCurrentYear());
  const [newCourse, setNewCourse] = useState({ code: '', title: '', type: 'Lecture', day: 'MWF', time: '09:00 - 10:00', room: '' });
  const [selectedStudentForEnrollment, setSelectedStudentForEnrollment] = useState('');
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState('');

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
        <button onClick={() => setShowStudentModal(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-2xl">
          <Plus size={18} /> Add Student
        </button>
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
        <button onClick={() => setShowCourseModal(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-2xl">
          <Plus size={18} /> Add Course
        </button>
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

  const renderGradeEntry = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Grade Entry</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Enter Student Grades</p>
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

      {studentsInCourse.length === 0 ? (
        <div className="p-8 bg-amber-50 border border-amber-200 rounded-2xl text-center">
          <p className="font-bold text-amber-700">No students enrolled in this course</p>
          <p className="text-sm text-amber-600">Go to Enrollment to add students</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="sticky left-0 bg-slate-900 px-8 py-6 text-left text-xs font-black text-slate-500 uppercase min-w-[200px]">Student</th>
                {filteredAssessments.map(a => (
                  <th key={a.id} className="px-4 py-6 text-center min-w-[120px]">
                    <div className="text-[10px] font-black text-blue-400 uppercase">{a.category}</div>
                    <div className="text-xs font-black">{a.title}</div>
                    <div className="text-[10px] text-slate-500 italic">HPS: {a.hps}</div>
                  </th>
                ))}
                <th className="px-8 py-6 text-center bg-indigo-900/50">Average</th>
              </tr>
            </thead>
            <tbody>
              {studentsInCourse.map((student, sIdx) => {
                let totalEarned = 0, totalHps = 0;
                return (
                  <tr key={student.id} className="border-b border-slate-100">
                    <td className="sticky left-0 bg-white px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black">{sIdx + 1}</div>
                        <div>
                          <div className="font-bold">{student.name}</div>
                          <div className="text-[10px] text-slate-400 uppercase">{student.studentIdNum}</div>
                        </div>
                      </div>
                    </td>
                    {filteredAssessments.map(a => {
                      const score = getScore(student.id, a.id);
                      if (score !== "" && score !== null) { totalEarned += parseFloat(score); totalHps += a.hps; }
                      return (
                        <td key={a.id} className="px-4 py-3 text-center">
                          <input type="number" max={a.hps} value={score} onChange={e => updateGrade(student.id, a.id, e.target.value)} className="w-20 px-3 py-2 bg-slate-50 rounded-xl text-center font-bold" placeholder="-" />
                        </td>
                      );
                    })}
                    <td className="px-8 py-4 text-center bg-slate-50/50"><span className="font-black text-indigo-600">{totalHps > 0 ? Math.round((totalEarned/totalHps)*100) : 0}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
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
          <button onClick={() => setActiveTab('Grade Entry')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold ${activeTab === 'Grade Entry' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
            <FileEdit size={20} /> Grade Entry
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
          {activeTab === 'Grade Entry' && renderGradeEntry()}
        </div>
      </main>
    </div>
  );
}

