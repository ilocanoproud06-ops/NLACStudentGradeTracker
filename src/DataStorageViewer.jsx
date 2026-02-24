import React, { useState, useEffect } from 'react';
import { Database, HardDrive, Cloud, RefreshCw, Eye, EyeOff } from 'lucide-react';

export default function DataStorageViewer() {
  const [localStorageData, setLocalStorageData] = useState({});
  const [showData, setShowData] = useState(false);
  const [cloudData, setCloudData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load localStorage data
  useEffect(() => {
    const loadData = () => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          const value = localStorage.getItem(key);
          data[key] = JSON.parse(value);
        } catch (e) {
          data[key] = localStorage.getItem(key);
        }
      }
      setLocalStorageData(data);
    };

    loadData();
  }, []);

  // Refresh localStorage data
  const refreshData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        const value = localStorage.getItem(key);
        data[key] = JSON.parse(value);
      } catch (e) {
        data[key] = localStorage.getItem(key);
      }
    }
    setLocalStorageData(data);
  };

  // Simulate cloud data retrieval (in a real implementation, this would connect to Firebase)
  const fetchCloudData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would fetch from Firebase Data Connect
      const cloudDataStructure = {
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
      };
      
      setCloudData(cloudDataStructure);
    } catch (err) {
      setError('Failed to fetch cloud data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format JSON for display
  const formatJSON = (data) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Storage Viewer</h1>
            <p className="text-gray-600">View and manage data in localStorage and cloud storage</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Back to Admin Dashboard
          </button>
        </div>

        {/* Storage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <HardDrive className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Local Storage</h3>
                <p className="text-sm text-gray-500">{Object.keys(localStorageData).length} data collections</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Cloud className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cloud Storage</h3>
                <p className="text-sm text-gray-500">Firebase Data Connect</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Database className="text-purple-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Sync</h3>
                <p className="text-sm text-gray-500">Real-time synchronization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={refreshData}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Local Data
          </button>
          
          <button
            onClick={() => setShowData(!showData)}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {showData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showData ? 'Hide Data' : 'Show Data'}
          </button>
          
          <button
            onClick={fetchCloudData}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 border border-blue-600 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading Cloud Data...
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                Load Cloud Data
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Data Display */}
        {showData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Local Storage Data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-blue-600" />
                  Local Storage Data
                </h2>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {Object.keys(localStorageData).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(localStorageData).map(([key, value]) => (
                      <div key={key} className="border border-gray-200 rounded-lg">
                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                          <h3 className="font-medium text-gray-900">{key}</h3>
                        </div>
                        <div className="p-3">
                          <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
                            {formatJSON(value)}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No data in localStorage</p>
                )}
              </div>
            </div>

            {/* Cloud Storage Data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-green-600" />
                  Cloud Storage Data
                </h2>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {cloudData ? (
                  <div className="space-y-4">
                    {Object.entries(cloudData).map(([key, value]) => (
                      <div key={key} className="border border-gray-200 rounded-lg">
                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                          <h3 className="font-medium text-gray-900">{key}</h3>
                        </div>
                        <div className="p-3">
                          <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
                            {formatJSON(value)}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Cloud className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Click "Load Cloud Data" to fetch from Firebase</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Data Structure Information */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Structure Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Local Storage Collections</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                  <span><strong>nlac_students</strong> - Student records with ID, name, program, PIN</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                  <span><strong>nlac_courses</strong> - Course information</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                  <span><strong>nlac_enrollments</strong> - Student-course relationships</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                  <span><strong>nlac_assessments</strong> - Assessment/exam details</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                  <span><strong>nlac_grades</strong> - Student grades for assessments</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Cloud Storage (Firebase Data Connect)</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                  <span><strong>Students Table</strong> - Secure student data with authentication</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                  <span><strong>Courses Table</strong> - Academic course catalog</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                  <span><strong>Enrollments Table</strong> - Student enrollment records</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                  <span><strong>Assessments Table</strong> - Exam and assignment details</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                  <span><strong>Grades Table</strong> - Student performance records</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}