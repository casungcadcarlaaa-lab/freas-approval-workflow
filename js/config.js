// config.js — Master Configuration & Seed Data
const Config = {
  APP_NAME: 'F.R.E.A.S-UNC',
  VERSION: '1.2.0',
  
  ACCOUNTS: [
    { id: 'student@unc.edu.ph', email: 'student@unc.edu.ph', password: 'student123', name: 'Juan Dela Cruz', role: 'student', dept: 'College of Arts and Sciences' },
    { id: 'student.jhs@unc.edu.ph', email: 'student.jhs@unc.edu.ph', password: 'student123', name: 'JHS Student', role: 'student', dept: 'Junior High School' },
    { id: 'student.shs@unc.edu.ph', email: 'student.shs@unc.edu.ph', password: 'student123', name: 'SHS Student', role: 'student', dept: 'Senior High School' },
    { id: 'admin.vp@unc.edu.ph', email: 'admin.vp@unc.edu.ph', password: 'admin123', name: 'Engr. Christian R. Encila', role: 'admin', dept: 'Facilities Management' },
    { id: 'admin.gbmo@unc.edu.ph', email: 'admin.gbmo@unc.edu.ph', password: 'admin123', name: 'GBMO', role: 'admin', dept: 'General Services' }
  ],
  
  FACILITIES: [
    { id: 'f1', name: 'Covered Court A', type: 'Sports', capacity: 500, status: 'active', image: 'assets/court-a.jpg' },
    { id: 'f2', name: 'Covered Court B', type: 'Sports', capacity: 500, status: 'active', image: 'assets/court-b.jpg' },
    { id: 'f3', name: 'Social Hall', type: 'Events', capacity: 200, status: 'active', image: 'assets/social-hall.jpg' },
    { id: 'f4', name: 'UNC Chapel', type: 'Religious', capacity: 150, status: 'active', image: 'assets/chapel.jpg' },
    { id: 'f5', name: 'AVR 1', type: 'Academic', capacity: 100, status: 'active', image: 'assets/avr1.jpg' },
    { id: 'f6', name: 'Sports Palace', type: 'Sports', capacity: 2000, status: 'active', image: 'assets/sports-palace.jpg' }
  ],

  RESERVATIONS: [
    { id: 'r1', userId: 'student@unc.edu.ph', userName: 'Juan Dela Cruz', facilityId: 'f2', facilityName: 'Covered Court B', date: '2026-05-16', startTime: '08:00', endTime: '12:00', purpose: 'test', attendees: 50, status: 'pending', createdAt: '2026-05-10T10:00:00Z' },
    { id: 'r2', userId: 'student@unc.edu.ph', userName: 'Juan Dela Cruz', facilityId: 'f2', facilityName: 'Covered Court B', date: '2026-05-16', startTime: '13:00', endTime: '17:00', purpose: 'test', attendees: 30, status: 'pending', createdAt: '2026-05-10T10:05:00Z' },
    { id: 'r3', userId: 'student@unc.edu.ph', userName: 'Juan Dela Cruz', facilityId: 'f4', facilityName: 'UNC Chapel', date: '2026-05-09', startTime: '09:00', endTime: '10:00', purpose: 'Test Event', attendees: 100, status: 'pending', createdAt: '2026-05-08T09:00:00Z' },
    { id: 'r4', userId: 'student@unc.edu.ph', userName: 'Juan Dela Cruz', facilityId: 'f1', facilityName: 'Covered Court A', date: '2026-05-08', startTime: '15:00', endTime: '17:00', purpose: 'Test Event', attendees: 25, status: 'pending', createdAt: '2026-05-07T14:00:00Z' }
  ],

  EVENTS: [],
  
  BLOCK_DATES: [
    { id: 'b1', facilityId: 'all', date: '2026-12-25', reason: 'Christmas Day' },
    { id: 'b2', facilityId: 'all', date: '2027-01-01', reason: 'New Year Day' }
  ]
};
