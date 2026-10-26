import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Question from '../models/Question.js';
import { defaultQuestions } from '../data/seedQuestions.js';
import { initLocalStore } from '../data/store.js';

let isMongoConnected = false;

async function seedMongoIfEmpty() {
  try {
    // 1. Ensure Questions exist and sync any new questions
    const questionCount = await Question.countDocuments();
    if (questionCount === 0) {
      console.log('[Database] Seeding default questions into MongoDB...');
      await Question.insertMany(defaultQuestions);
      console.log(`[Database] Seeded ${defaultQuestions.length} interview questions.`);
    } else {
      let inserted = 0;
      for (const q of defaultQuestions) {
        const exists = await Question.findOne({ questionText: q.questionText });
        if (!exists) {
          await Question.create({
            ...q,
            isActive: true
          });
          inserted++;
        }
      }
      if (inserted > 0) {
        console.log(`[Database] Synced ${inserted} new default questions into MongoDB.`);
      }
    }

    // 2. Ensure Admin user exists
    const adminExists = await User.findOne({ email: 'admin@mockinterview.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'System Administrator',
        email: 'admin@mockinterview.com',
        username: 'admin',
        password: adminPassword,
        role: 'admin',
        targetRole: 'Platform Lead',
        experienceLevel: 'Senior (5+ yrs)',
        bio: 'Administrator of the Mock Interview Assessment Platform.'
      });
      console.log('[Database] Seeded default Admin user.');
    }

    // 3. Ensure Student user exists
    const studentExists = await User.findOne({ email: 'student@mockinterview.com' });
    if (!studentExists) {
      const salt = await bcrypt.genSalt(10);
      const studentPassword = await bcrypt.hash('student123', salt);
      await User.create({
        name: 'Jezeem Muhammed',
        email: 'student@mockinterview.com',
        username: 'jezeem',
        password: studentPassword,
        role: 'user',
        targetRole: 'Full Stack MERN Developer',
        experienceLevel: 'Fresher',
        bio: 'Enthusiastic computer science graduate preparing for technical software engineering rounds.'
      });
      console.log('[Database] Seeded default Candidate user.');
    }
  } catch (err) {
    console.warn('[Database] Seeding check note:', err.message);
  }
}

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mock_interview';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    await seedMongoIfEmpty();
    return true;
  } catch (error) {
    console.warn(`[Database] Remote/Local MongoDB not reachable (${error.message}).`);
    console.log(`[Database] Activating High-Reliability Local JSON Persistence Mode.`);
    isMongoConnected = false;
    initLocalStore();
    return false;
  }
};

export const getDbStatus = () => {
  return {
    isMongoConnected,
    mode: isMongoConnected ? 'MongoDB (Mongoose)' : 'Local JSON Persistence Adapter'
  };
};

export { isMongoConnected };
