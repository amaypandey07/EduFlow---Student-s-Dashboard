/* ==========================================================================
   DATA.JS
   Purpose: Realistic mock data, structured the way a real backend API
   response would look. This is intentional: if a backend gets added
   later, this file is what gets DELETED and replaced with fetch() calls
   — nothing else in the app needs to change, because every page already
   reads data through functions, not hardcoded HTML. That's the whole
   point of separating data from presentation.
   ========================================================================== */

const StudentData = {
  profile: {
    name: 'Amay Verma',
    rollNumber: 'CS21B045',
    branch: 'Computer Science & Engineering',
    semester: '5th Semester',
    email: 'amay.verma@nitcollege.edu.in',
    college: 'National Institute of Technology',
    initials: 'AV',
  },

  subjects: [
    { id: 'ds',  name: 'Data Structures',              score: 88, grade: 'A',  credits: 4 },
    { id: 'dbms',name: 'Database Management Systems',  score: 82, grade: 'A',  credits: 4 },
    { id: 'math',name: 'Mathematics',                  score: 76, grade: 'B+', credits: 3 },
    { id: 'os',  name: 'Operating Systems',             score: 91, grade: 'A+', credits: 4 },
    { id: 'cn',  name: 'Computer Networks',             score: 79, grade: 'B+', credits: 3 },
    { id: 'se',  name: 'Software Engineering',          score: 85, grade: 'A',  credits: 3 },
  ],

  attendance: {
    overall: 86,
    subjects: [
      { subject: 'Data Structures',   present: 36, total: 40 },
      { subject: 'DBMS',              present: 33, total: 40 },
      { subject: 'Mathematics',       present: 31, total: 38 },
      { subject: 'Operating Systems', present: 34, total: 36 },
      { subject: 'Computer Networks', present: 27, total: 38 },
      { subject: 'Software Engineering', present: 30, total: 34 },
    ],
  },

  timetable: [
    { day: 'Monday',    slots: [
      { time: '9:00 - 10:00',  subject: 'Data Structures',   room: 'Lab 3',  faculty: 'Dr. R. Sharma' },
      { time: '10:00 - 11:00', subject: 'DBMS',               room: 'CR 204', faculty: 'Prof. N. Iyer' },
      { time: '11:15 - 12:15', subject: 'Mathematics',        room: 'CR 101', faculty: 'Dr. S. Kapoor' },
    ]},
    { day: 'Tuesday', slots: [
      { time: '9:00 - 10:00',  subject: 'Operating Systems', room: 'CR 204', faculty: 'Dr. A. Mehta' },
      { time: '10:00 - 11:00', subject: 'Computer Networks', room: 'Lab 1',  faculty: 'Prof. K. Rao' },
      { time: '11:15 - 12:15', subject: 'Software Engineering', room: 'CR 305', faculty: 'Dr. P. Nair' },
    ]},
    { day: 'Wednesday', slots: [
      { time: '9:00 - 10:00',  subject: 'Data Structures',   room: 'CR 204', faculty: 'Dr. R. Sharma' },
      { time: '10:00 - 11:00', subject: 'Mathematics',        room: 'CR 101', faculty: 'Dr. S. Kapoor' },
      { time: '11:15 - 12:15', subject: 'DBMS',               room: 'Lab 2',  faculty: 'Prof. N. Iyer' },
    ]},
    { day: 'Thursday', slots: [
      { time: '9:00 - 10:00',  subject: 'Computer Networks', room: 'CR 204', faculty: 'Prof. K. Rao' },
      { time: '10:00 - 11:00', subject: 'Operating Systems', room: 'Lab 3',  faculty: 'Dr. A. Mehta' },
      { time: '11:15 - 12:15', subject: 'Software Engineering', room: 'CR 305', faculty: 'Dr. P. Nair' },
    ]},
    { day: 'Friday', slots: [
      { time: '9:00 - 10:00',  subject: 'DBMS',               room: 'CR 204', faculty: 'Prof. N. Iyer' },
      { time: '10:00 - 11:00', subject: 'Data Structures',   room: 'Lab 3',  faculty: 'Dr. R. Sharma' },
      { time: '11:15 - 12:15', subject: 'Mathematics',        room: 'CR 101', faculty: 'Dr. S. Kapoor' },
    ]},
    { day: 'Saturday', slots: [
      { time: '9:00 - 10:00',  subject: 'Software Engineering', room: 'CR 305', faculty: 'Dr. P. Nair' },
    ]},
  ],

  // Default assignments — used ONLY the very first time the app runs
  // (before the user has created/edited anything). assignments.js loads
  // these into Storage on first run, then reads/writes Storage from then on.
  defaultAssignments: [
    { id: 'a1', title: 'ER Diagram for Library System', subject: 'DBMS', dueDate: '2026-08-14', priority: 'high', status: 'pending' },
    { id: 'a2', title: 'Binary Search Tree Implementation', subject: 'Data Structures', dueDate: '2026-08-12', priority: 'high', status: 'pending' },
    { id: 'a3', title: 'Process Scheduling Report', subject: 'Operating Systems', dueDate: '2026-08-20', priority: 'medium', status: 'pending' },
    { id: 'a4', title: 'Probability Problem Set 4', subject: 'Mathematics', dueDate: '2026-08-10', priority: 'medium', status: 'completed' },
    { id: 'a5', title: 'TCP/IP Packet Analysis', subject: 'Computer Networks', dueDate: '2026-08-25', priority: 'low', status: 'pending' },
    { id: 'a6', title: 'SRS Document Draft', subject: 'Software Engineering', dueDate: '2026-08-18', priority: 'medium', status: 'pending' },
  ],

  recentActivity: [
    { icon: 'fa-check-circle', text: 'Submitted "Probability Problem Set 4"', time: '2 hours ago' },
    { icon: 'fa-file-circle-plus', text: 'New assignment posted: "ER Diagram for Library System"', time: '1 day ago' },
    { icon: 'fa-graduation-cap', text: 'Grade released for Operating Systems Mid-Sem', time: '2 days ago' },
    { icon: 'fa-calendar-check', text: 'Attendance marked for Data Structures Lab', time: '3 days ago' },
  ],
};
