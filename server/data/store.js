import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { defaultQuestions, defaultCategories } from './seedQuestions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'mock_db.json');

// Stable object reference
export const localDb = {
  users: [],
  questions: [],
  results: [],
  categories: defaultCategories
};

function seedInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync('admin123', salt);
  const studentHash = bcrypt.hashSync('student123', salt);

  localDb.users = [
    {
      _id: 'admin_master_id_001',
      name: 'System Administrator',
      email: 'admin@mockinterview.com',
      username: 'admin',
      password: adminHash,
      role: 'admin',
      targetRole: 'Platform Lead',
      experienceLevel: 'Senior (5+ yrs)',
      bio: 'Administrator of the Mock Interview Assessment Platform.',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'student_demo_id_001',
      name: 'Jezeem Muhammed',
      email: 'student@mockinterview.com',
      username: 'jezeem',
      password: studentHash,
      role: 'user',
      targetRole: 'Full Stack MERN Developer',
      experienceLevel: 'Fresher',
      bio: 'Enthusiastic computer science graduate preparing for technical software engineering rounds.',
      createdAt: new Date().toISOString()
    }
  ];

  localDb.questions = defaultQuestions.map((q, idx) => ({
    _id: `q_${Date.now()}_${idx}`,
    ...q,
    isActive: true,
    createdAt: new Date().toISOString()
  }));

  localDb.results = [];
  localDb.categories = defaultCategories;
}

export function persistLocalStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(localDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Error persisting to local DB file:', err.message);
  }
}

export function initLocalStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      localDb.users = Array.isArray(parsed.users) ? parsed.users : [];
      localDb.questions = Array.isArray(parsed.questions) ? parsed.questions : [];
      localDb.results = Array.isArray(parsed.results) ? parsed.results : [];
      localDb.categories = Array.isArray(parsed.categories) ? parsed.categories : defaultCategories;
    } else {
      seedInitialData();
      persistLocalStore();
    }
  } catch (err) {
    console.warn('[Storage] Reading local DB failed, re-seeding data:', err.message);
    seedInitialData();
    persistLocalStore();
  }

  // Ensure default admin exists
  if (!localDb.users.some(u => u.email === 'admin@mockinterview.com')) {
    const salt = bcrypt.genSaltSync(10);
    const adminHash = bcrypt.hashSync('admin123', salt);
    localDb.users.push({
      _id: 'admin_master_id_001',
      name: 'System Administrator',
      email: 'admin@mockinterview.com',
      username: 'admin',
      password: adminHash,
      role: 'admin',
      targetRole: 'Platform Lead',
      experienceLevel: 'Senior (5+ yrs)',
      bio: 'Administrator of the Mock Interview Assessment Platform.',
      createdAt: new Date().toISOString()
    });
    persistLocalStore();
  }

  // Ensure default demo student exists
  if (!localDb.users.some(u => u.email === 'student@mockinterview.com')) {
    const salt = bcrypt.genSaltSync(10);
    const studentHash = bcrypt.hashSync('student123', salt);
    localDb.users.push({
      _id: 'student_demo_id_001',
      name: 'Jezeem Muhammed',
      email: 'student@mockinterview.com',
      username: 'jezeem',
      password: studentHash,
      role: 'user',
      targetRole: 'Full Stack MERN Developer',
      experienceLevel: 'Fresher',
      bio: 'Enthusiastic computer science graduate preparing for technical software engineering rounds.',
      createdAt: new Date().toISOString()
    });
    persistLocalStore();
  }

  // Ensure default questions exist
  if (!localDb.questions || localDb.questions.length === 0) {
    localDb.questions = defaultQuestions.map((q, idx) => ({
      _id: `q_${Date.now()}_${idx}`,
      ...q,
      isActive: true,
      createdAt: new Date().toISOString()
    }));
    persistLocalStore();
  }
}
