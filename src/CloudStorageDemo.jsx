import React, { useState, useEffect } from 'react';
import { Cloud, Database, HardDrive, RefreshCw, Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';

export default function CloudStorageDemo() {
  const [localStorageData, setLocalStorageData] = useState({});
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced, error
  const [syncMessage, setSyncMessage] = useState('');
  const [cloudConnection, setCloudConnection] = useState(false);

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

  // Simulate cloud connection
  const connectToCloud = () => {
    setSyncStatus('syncing');
    setSyncMessage('Connecting to cloud storage...');
    
    setTimeout(() => {
      setCloudConnection(true);
      setSyncStatus('synced');
      setSyncMessage('Connected to cloud storage successfully!');
    }, 1500);
  };

  // Simulate data sync to cloud
  const syncToCloud = () => {
    if (!cloudConnection) {
      setSyncStatus('error');
      setSyncMessage('Please connect to cloud storage first');
      return;
    }
    
    setSyncStatus('syncing');
    setSyncMessage('Syncing data to cloud...');
    
    setTimeout(() => {
      setSyncStatus('synced');
      setSyncMessage(`Successfully synced ${Object.keys(localStorageData).length} collections to cloud storage`);
    }, 2000);
  };

  // Simulate data sync from cloud
  const syncFromCloud = () => {
    if (!cloudConnection) {
      setSyncStatus('error');
      setSyncMessage('Please connect to cloud storage first');
      return;
    }
    
    setSyncStatus('syncing');
    setSyncMessage('Syncing data from cloud...');
    
    setTimeout(() => {
      setSyncStatus('synced');
      setSyncMessage(`Successfully synced data from cloud storage`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cloud Storage Integration Demo</h1>
            <p className="text-gray-600">Demonstration of localStorage and cloud storage synchronization</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Back to Admin Dashboard
          </button>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${cloudConnection ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Cloud className={`w-6 h-6 ${cloudConnection ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cloud Storage Connection</h3>
                <p className="text-sm text-gray-500">
                  {cloudConnection ? 'Connected to Firebase Data Connect' : 'Not connected'}
                </p>
              </div>
            </div>
            <button
              onClick={connectToCloud}
              disabled={cloudConnection || syncStatus === 'syncing'}
              className={`px-4 py-2 rounded-lg font-medium ${
                cloudConnection 
                  ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {cloudConnection ? 'Connected' : 'Connect to Cloud'}
            </button>
          </div>
        </div>

        {/* Sync Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {syncStatus === 'syncing' && <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />}
              {syncStatus === 'synced' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {syncStatus === 'error' && <AlertCircle className="w-6 h-6 text-red-600" />}
              
              <div>
                <h3 className="font-semibold text-gray-900">Sync Status</h3>
                <p className="text-sm text-gray-500">{syncMessage || 'Ready to sync'}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={syncToCloud}
                disabled={syncStatus === 'syncing'}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                Sync to Cloud
              </button>
              
              <button
                onClick={syncFromCloud}
                disabled={syncStatus === 'syncing'}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Sync from Cloud
              </button>
            </div>
          </div>
        </div>

        {/* Data Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Local Storage</h2>
            </div>
            
            <div className="space-y-3">
              {Object.keys(localStorageData).length > 0 ? (
                Object.entries(localStorageData).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{key}</h3>
                      <p className="text-sm text-gray-500">
                        {Array.isArray(value) ? `${value.length} records` : 'Data'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        Local
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No data in localStorage</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Cloud className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Cloud Storage</h2>
            </div>
            
            <div className="space-y-3">
              {cloudConnection ? (
                <>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Students</h3>
                      <p className="text-sm text-gray-500">5 records</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Cloud
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Courses</h3>
                      <p className="text-sm text-gray-500">4 records</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Cloud
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Enrollments</h3>
                      <p className="text-sm text-gray-500">7 records</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Cloud
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Assessments</h3>
                      <p className="text-sm text-gray-500">6 records</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Cloud
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Grades</h3>
                      <p className="text-sm text-gray-500">7 records</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Cloud
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Cloud className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Connect to cloud to view data</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Implementation Guide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Current Local Storage Implementation</h3>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`// Loading data from localStorage
const students = JSON.parse(
  localStorage.getItem('nlac_students') || '[]'
);

// Saving data to localStorage
localStorage.setItem(
  'nlac_students', 
  JSON.stringify(students)
);`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Cloud Storage Integration</h3>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`// Using Firebase Data Connect hooks
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllStudents, createStudent } from './dataconnect-generated/nlac/hooks';

// Fetch students from cloud
const { data: students } = useQuery(
  'students',
  async () => {
    const result = await getAllStudents();
    return result.data?.students || [];
  }
);

// Create student in cloud
const createStudentMutation = useMutation(createStudent);`}
              </pre>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Next Steps</h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Set up Firebase project and enable Data Connect</li>
              <li>Deploy the schema defined in dataconnect/schema/schema.gql</li>
              <li>Generate the SDK using firebase dataconnect:sdk:generate</li>
              <li>Replace localStorage calls with Firebase Data Connect hooks</li>
              <li>Implement synchronization logic between local and cloud storage</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}