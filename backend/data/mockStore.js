const bcrypt = require('bcryptjs');

// Pre-hashed password for demo accounts ("password123")
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

const mockUsers = [
  {
    _id: 'usr_admin_001',
    name: 'Campus Admin',
    email: 'admin@campus.edu',
    password: DEMO_PASSWORD_HASH,
    role: 'admin',
    department: 'Campus Security & Facilities',
    phone: '555-0100',
    createdAt: new Date('2026-01-10T08:00:00Z').toISOString(),
  },
  {
    _id: 'usr_student_001',
    name: 'Gayathiri Raman',
    email: 'student@campus.edu',
    password: DEMO_PASSWORD_HASH,
    role: 'student',
    department: 'Computer Science',
    phone: '555-0199',
    createdAt: new Date('2026-02-01T10:00:00Z').toISOString(),
  },
  {
    _id: 'usr_student_002',
    name: 'Alex Johnson',
    email: 'alex@campus.edu',
    password: DEMO_PASSWORD_HASH,
    role: 'student',
    department: 'Mechanical Engineering',
    phone: '555-0144',
    createdAt: new Date('2026-02-15T12:00:00Z').toISOString(),
  },
];

const mockItems = [
  {
    _id: 'item_001',
    type: 'lost', // 'lost' or 'found'
    title: 'Blue Hydro Flask Bottle',
    category: 'Bottles & Containers',
    description: '32oz blue Hydro Flask with campus stickers and a small dent at the bottom.',
    location: 'Central Library - 2nd Floor Silent Study Area',
    date: '2026-03-20',
    time: '14:30',
    status: 'open', // 'open', 'claimed', 'recovered', 'closed'
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    additionalDetails: 'Has a sticker saying "CS 2026" on the side.',
    reporter: {
      _id: 'usr_student_001',
      name: 'Gayathiri Raman',
      email: 'student@campus.edu',
    },
    createdAt: new Date('2026-03-20T15:00:00Z').toISOString(),
  },
  {
    _id: 'item_002',
    type: 'found',
    title: 'Apple AirPods Pro in Black Case',
    category: 'Electronics',
    description: 'AirPods Pro found in a matte black silicone protective case.',
    location: 'Student Union Cafeteria - Booth #4',
    date: '2026-03-21',
    time: '11:15',
    status: 'open',
    image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=600&q=80',
    additionalDetails: 'Turned in to the Cafeteria front desk staff.',
    reporter: {
      _id: 'usr_student_002',
      name: 'Alex Johnson',
      email: 'alex@campus.edu',
    },
    createdAt: new Date('2026-03-21T11:45:00Z').toISOString(),
  },
  {
    _id: 'item_003',
    type: 'lost',
    title: 'Scientific Calculator TI-84 Plus CE',
    category: 'Electronics',
    description: 'Black TI-84 Plus CE graphing calculator with initials "GR" marked on the back cover.',
    location: 'Science Building - Hallway A302',
    date: '2026-03-19',
    time: '09:00',
    status: 'open',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    additionalDetails: 'Battery level was around 50% when lost.',
    reporter: {
      _id: 'usr_student_001',
      name: 'Gayathiri Raman',
      email: 'student@campus.edu',
    },
    createdAt: new Date('2026-03-19T09:30:00Z').toISOString(),
  },
  {
    _id: 'item_004',
    type: 'found',
    title: 'Set of 3 Keys with Red Lanyard',
    category: 'Keys',
    description: 'Dorm room key, bike lock key, and a silver car key on a university red ribbon lanyard.',
    location: 'Campus Gym - Locker Room Entrance',
    date: '2026-03-22',
    time: '08:45',
    status: 'open',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    additionalDetails: 'Kept with Campus Security desk.',
    reporter: {
      _id: 'usr_admin_001',
      name: 'Campus Admin',
      email: 'admin@campus.edu',
    },
    createdAt: new Date('2026-03-22T09:10:00Z').toISOString(),
  },
];

const mockClaims = [
  {
    _id: 'claim_001',
    item: 'item_002',
    itemDetails: {
      title: 'Apple AirPods Pro in Black Case',
      type: 'found',
      category: 'Electronics',
      location: 'Student Union Cafeteria - Booth #4',
    },
    claimant: {
      _id: 'usr_student_001',
      name: 'Gayathiri Raman',
      email: 'student@campus.edu',
    },
    message: 'I believe these are my AirPods! They connect to my iPhone under the name "Gaya\'s Pods" and have a faint scratch on the bottom right of the silicone case.',
    proofImage: null,
    status: 'pending', // 'pending', 'approved', 'rejected'
    adminNotes: '',
    createdAt: new Date('2026-03-21T14:00:00Z').toISOString(),
  },
];

const mockNotifications = [
  {
    _id: 'notif_001',
    user: 'usr_student_001',
    title: 'Claim Submitted Successfully',
    message: 'Your claim for "Apple AirPods Pro in Black Case" has been submitted and is currently pending verification.',
    type: 'claim_status',
    relatedItem: 'item_002',
    isRead: false,
    createdAt: new Date('2026-03-21T14:05:00Z').toISOString(),
  },
  {
    _id: 'notif_002',
    user: 'usr_student_001',
    title: 'Welcome to Campus Item Recovery',
    message: 'Welcome! You can report any lost or found items and help keep our campus connected.',
    type: 'general',
    relatedItem: null,
    isRead: true,
    createdAt: new Date('2026-02-01T10:05:00Z').toISOString(),
  },
];

// Helper to generate simple unique IDs
const generateId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

// Export in-memory state and simulated query methods
const mockStore = {
  users: [...mockUsers],
  items: [...mockItems],
  claims: [...mockClaims],
  notifications: [...mockNotifications],
  generateId,
};

module.exports = mockStore;
