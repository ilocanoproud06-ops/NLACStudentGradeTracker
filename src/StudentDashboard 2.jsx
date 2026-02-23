import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, ChevronRight, User, Key, X, Edit, Save, 
  BookOpen, Calendar, ClipboardList, Percent, Award
} from 'lucide-react';

// Helper function to calculate letter grade
const getLetterGrade = (percentage) => {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
};

// Helper function to get grade color
const getGradeColor = (percentage) => {
  if (percentage >= 90) return 'text-emerald-600 bg-emerald-50';
  if (percentage >= 80) return 'text-blue-600 bg-blue-50';
  if (percentage >= 70) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
};

export default function StudentDashboard({ student, onLogout }) {
  const [activeTab, setActiveTab] = useState('grades');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: student.name,
    program: student.program,
    pinCode: student.pinCode
  });

  // Filter states for each course
  const [courseFilters, setCourseFilters] = useState({});

  // Get data from localStorage
  const courses = useMemo(() => {
    const stored = localStorage.getItem('nlac_courses');
    return stored ? JSON.parse(stored) : [];
  }, []);

  const enrollments = useMemo(() => {
    const stored = localStorage.getItem('nlac_enrollments');
    return stored ? JSON.parse(stored) : [];
  }, []);

  const assessments = useMemo(() => {
    const stored = localStorage.getItem('nlac_assessments');
    return stored ? JSON.parse(stored) : [];
  }, []);

  const grades = useMemo(() => {
    const stored = localStorage.getItem('nlac_grades');
    return stored ? JSON.parse(stored) : [];
  }, []);

  // Get student's enrolled courses
  const studentEnrollments = useMemo(() => 
    enrollments.filter(e => e.studentId === student.id),
    [enrollments, student.id]
  );

  const enrolledCourses = useMemo(() => 
    courses.filter(c => studentEnrollments.some(e => e.courseId === c.id)),
    [courses, studentEnrollments]
  );

  // Get all months that have assessments
  const allMonths = useMemo(() => {
    const months = new Set();
    assessments.forEach(a => months.add(a.month));
    return Array.from(months).sort((a, b) => {
      const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });
  }, [assessments]);

  // Get unique assessment types for a course
  const getAssessmentTypes = (courseId) => {
    const courseAssessments = assessments.filter(a => a.courseId === courseId);
    const types = new Set(courseAssessments.map(a => a.category));
    return Array.from(types).sort();
  };

  // Update course filter
  const updateCourseFilter = (courseId, filterType, value) => {
    setCourseFilters(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [filterType]: value
      }
    }));
  };

  // Get filtered grades for a course
  const getFilteredGrades = (courseId) => {
    const courseGrades = getStudentGrades(courseId);
    const filters = courseFilters[courseId] || {};
    
    return courseGrades.filter(grade => {
      if (filters.assessmentType && grade.category !== filters.assessmentType) return false;
      if (filters.month && grade.month !== filters.month) return false;
      return true;
    });
  };

  // Calculate grades for display
  const getStudentGrades = (courseId) => {
    const courseAssessments = assessments.filter(a => a.courseId === courseId);
    const studentGrades = grades.filter(g => g.studentId === student.id);
    
    return courseAssessments.map(assessment => {
      const gradeEntry = studentGrades.find(g => g.assessmentId === assessment.id);
      const score = gradeEntry ? gradeEntry.score : null;
      const percentage = score !== null && assessment.hps > 0 
        ? Math.round((score / assessment.hps) * 100) 
        : null;
      
      return {
        ...assessment,
        score,
        percentage,
        letterGrade: percentage !== null ? getLetterGrade(percentage) : '-'
      };
    });
  };

  // Calculate course average
  const getCourseAverage = (courseId) => {
    const courseGrades = getStudentGrades(courseId);
    const gradedItems = courseGrades.filter(g => g.score !== null);
    if (gradedItems.length === 0) return null;
    
    const totalPercentage = gradedItems.reduce((sum, g) => sum + g.percentage, 0);
    return Math.round(totalPercentage / gradedItems.length);
  };

  // Calculate overall average
  const overallAverage = useMemo(() => {
    const averages = enrolledCourses.map(c => getCourseAverage(c.id)).filter(a => a !== null);
    if (averages.length === 0) return null;
    return Math.round(averages.reduce((a, b) => a + b, 0) / averages.length);
  }, [enrolledCourses]);

  // Handle profile update
  const handleUpdateProfile = () => {
    const storedStudents = localStorage.getItem('nlac_students');
    const students = storedStudents ? JSON.parse(storedStudents) : [];
    
    const updatedStudents = students.map(s => 
      s.id === student.id 
        ? { ...s, name: editProfile.name, program: editProfile.program, pinCode: editProfile.pinCode }
        : s
    );
    
    localStorage.setItem('nlac_students', JSON.stringify(updatedStudents));
    
    // Update current student
    student.name = editProfile.name;
    student.program = editProfile.program;
    student.pinCode = editProfile.pinCode;
    
    setShowProfileModal(false);
  };

  // Group assessments by month for a course
  const getGradesByMonth = (courseId) => {
    const courseGrades = getStudentGrades(courseId);
    const grouped = {};
    
    courseGrades.forEach(grade => {
      if (!grouped[grade.month]) {
        grouped[grade.month] = [];
      }
      grouped[grade.month].push(grade);
    });
    
    return grouped;
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <aside className="w-72 bg-[#1e293b] flex flex-col">
        <div className="p-8 flex items-center gap-4 text-white">
          <div className="bg-emerald-500 p-2 rounded-xl"><GraduationCap className="w-6 h-6" /></div>
          <span className="text-xl font-black uppercase">Academic<span className="text-emerald-400">Pro</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab('grades')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold ${activeTab === 'grades' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
            <ClipboardList size={20} /> My Grades
          </button>
          <button onClick={() => setShowProfileModal(true)} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-slate-700/50">
            <User size={20} /> Edit Profile
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:text-red-400 mt-10">
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 flex items-center justify-between px-10 bg-white border-b border-slate-200/60">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="font-black text-[10px] uppercase">Student</span>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-bold uppercase text-[10px]">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-bold text-sm">{student.name}</div>
              <div className="text-xs text-slate-400">{student.studentIdNum}</div>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center font-black text-emerald-600">
              {student.name.split(' ')[0].charAt(0)}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/40">
          {activeTab === 'grades' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-[32px] p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-emerald-100 p-2 rounded-xl"><Percent className="w-5 h-5 text-emerald-600" /></div>
                    <span className="text-xs font-black text-slate-400 uppercase">Overall Average</span>
                  </div>
                  <div className="text-4xl font-black text-slate-800">
                    {overallAverage !== null ? `${overallAverage}%` : 'N/A'}
                  </div>
                </div>
                
                <div className="bg-white rounded-[32px] p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-xl"><Award className="w-5 h-5 text-blue-600" /></div>
                    <span className="text-xs font-black text-slate-400 uppercase">Final Grade</span>
                  </div>
                  <div className={`text-4xl font-black rounded-2xl inline-block px-4 py-2 ${overallAverage !== null ? getGradeColor(overallAverage) : 'bg-slate-100 text-slate-400'}`}>
                    {overallAverage !== null ? getLetterGrade(overallAverage) : 'N/A'}
                  </div>
                </div>
                
                <div className="bg-white rounded-[32px] p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-100 p-2 rounded-xl"><BookOpen className="w-5 h-5 text-purple-600" /></div>
                    <span className="text-xs font-black text-slate-400 uppercase">Enrolled Courses</span>
                  </div>
                  <div className="text-4xl font-black text-slate-800">
                    {enrolledCourses.length}
                  </div>
                </div>
              </div>

              {/* Course Grades */}
              {enrolledCourses.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                  <p className="font-bold text-amber-700">No courses enrolled</p>
                  <p className="text-sm text-amber-600">Please contact your administrator to enroll in courses.</p>
                </div>
              ) : (
                enrolledCourses.map(course => {
                  const courseGrades = getFilteredGrades(course.id);
                  const courseAverage = getCourseAverage(course.id);
                  const assessmentTypes = getAssessmentTypes(course.id);
                  const filters = courseFilters[course.id] || {};
                  
                  return (
                    <div key={course.id} className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden">
                      {/* Course Header */}
                      <div className="bg-slate-900 px-8 py-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-black text-white">{course.code} - {course.title}</h3>
                            <p className="text-xs text-slate-400">{course.day} • {course.time} • {course.room}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-400 uppercase font-black">Filtered Average</div>
                            <div className="text-2xl font-black text-emerald-400">
                              {courseGrades.filter(g => g.score !== null).length > 0 
                                ? `${Math.round(courseGrades.filter(g => g.score !== null).reduce((sum, g) => sum + g.percentage, 0) / courseGrades.filter(g => g.score !== null).length)}%`
                                : 'N/A'
                              }
                            </div>
                          </div>
                        </div>
                        
                        {/* Filters */}
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-xs font-black text-slate-400 uppercase mb-1 block">Assessment Type</label>
                            <select 
                              value={filters.assessmentType || ''} 
                              onChange={e => updateCourseFilter(course.id, 'assessmentType', e.target.value)}
                              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm font-bold text-white"
                            >
                              <option value="">All Types</option>
                              {assessmentTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="text-xs font-black text-slate-400 uppercase mb-1 block">Month</label>
                            <select 
                              value={filters.month || ''} 
                              onChange={e => updateCourseFilter(course.id, 'month', e.target.value)}
                              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm font-bold text-white"
                            >
                              <option value="">All Months</option>
                              {allMonths.map(month => (
                                <option key={month} value={month}>{month}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Grades Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Assessment Type</th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Title</th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Date</th>
                              <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase">Score/HPS</th>
                              <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase">Percentage</th>
                              <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase">Letter Grade</th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Instructor Comments</th>
                            </tr>
                          </thead>
                          <tbody>
                            {courseGrades.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                                  No assessments match the selected filters
                                </td>
                              </tr>
                            ) : (
                              courseGrades.map((grade, idx) => (
                                <tr key={grade.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50">
                                  <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                      grade.category === 'Written Exam' ? 'bg-blue-100 text-blue-700' :
                                      grade.category === 'Performance Task' ? 'bg-purple-100 text-purple-700' :
                                      grade.category === 'Quiz' ? 'bg-amber-100 text-amber-700' :
                                      grade.category === 'Project' ? 'bg-green-100 text-green-700' :
                                      'bg-slate-100 text-slate-700'
                                    }`}>
                                      {grade.category}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 font-bold text-slate-700">{grade.title}</td>
                                  <td className="px-6 py-4 text-slate-500 text-sm">{grade.date || '-'}</td>
                                  <td className="px-6 py-4 text-center">
                                    <span className={`font-black ${grade.score !== null ? 'text-slate-800' : 'text-slate-300'}`}>
                                      {grade.score !== null ? `${grade.score}/${grade.hps}` : '-/-'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    {grade.percentage !== null ? (
                                      <span className="font-black text-emerald-600">{grade.percentage}%</span>
                                    ) : (
                                      <span className="text-slate-300">-</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    {grade.letterGrade !== '-' ? (
                                      <span className={`font-black px-3 py-1 rounded-lg text-sm ${getGradeColor(grade.percentage)}`}>
                                        {grade.letterGrade}
                                      </span>
                                    ) : (
                                      <span className="text-slate-300">-</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-slate-600 text-sm max-w-xs">
                                    {grade.instructorComments ? (
                                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                        <p className="text-sm italic">"{grade.instructorComments}"</p>
                                      </div>
                                    ) : (
                                      <span className="text-slate-300">-</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md">
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <h3 className="text-lg font-black text-white uppercase">Edit Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">ID Number</label>
                <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-500">
                  {student.studentIdNum}
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Name</label>
                <input 
                  type="text" 
                  value={editProfile.name} 
                  onChange={e => setEditProfile({...editProfile, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold" 
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Program</label>
                <select 
                  value={editProfile.program} 
                  onChange={e => setEditProfile({...editProfile, program: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold"
                >
                  <option value="BSCS">BSCS</option>
                  <option value="BSIT">BSIT</option>
                  <option value="BS MATH">BS MATH</option>
                  <option value="BSBA">BSBA</option>
                  <option value="BSED">BSED</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">New PIN Code</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={editProfile.pinCode} 
                    onChange={e => setEditProfile({...editProfile, pinCode: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-12 font-bold" 
                    maxLength={4}
                    placeholder="4-digit PIN"
                  />
                </div>
              </div>
              <button onClick={handleUpdateProfile} className="w-full bg-emerald-600 text-white font-black uppercase py-4 rounded-2xl flex items-center justify-center gap-2">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

