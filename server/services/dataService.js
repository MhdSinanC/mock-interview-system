import mongoose from 'mongoose';
import User from '../models/User.js';
import Question from '../models/Question.js';
import Result from '../models/Result.js';
import { localDb, persistLocalStore } from '../data/store.js';

function isMongoLive() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// ---------------- USER OPERATIONS ----------------
export async function findUserByEmail(email) {
  if (isMongoLive()) {
    return await User.findOne({ email: email.toLowerCase() });
  }
  return localDb.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserByUsername(username) {
  if (isMongoLive()) {
    return await User.findOne({ username });
  }
  return localDb.users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function findUserById(id) {
  if (isMongoLive()) {
    return await User.findById(id).select('-password');
  }
  const u = localDb.users.find(u => u._id.toString() === id.toString());
  if (!u) return null;
  const { password, ...safeUser } = u;
  return safeUser;
}

export async function createUser(userData) {
  if (isMongoLive()) {
    const newUser = new User(userData);
    return await newUser.save();
  }
  const newUser = {
    _id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    ...userData,
    createdAt: new Date().toISOString()
  };
  localDb.users.push(newUser);
  persistLocalStore();
  return newUser;
}

export async function updateUserProfile(id, updateData) {
  if (isMongoLive()) {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  }
  const index = localDb.users.findIndex(u => u._id.toString() === id.toString());
  if (index === -1) return null;
  localDb.users[index] = { ...localDb.users[index], ...updateData };
  persistLocalStore();
  const { password, ...safeUser } = localDb.users[index];
  return safeUser;
}

export async function getAllUsers() {
  if (isMongoLive()) {
    return await User.find().select('-password').sort({ createdAt: -1 });
  }
  return localDb.users.map(({ password, ...u }) => u);
}

export async function deleteUser(id) {
  if (isMongoLive()) {
    // Delete candidate results to avoid orphaned records
    await Result.deleteMany({ user: id });
    return await User.findByIdAndDelete(id);
  }
  const index = localDb.users.findIndex(u => u._id.toString() === id.toString());
  if (index === -1) return null;
  const removed = localDb.users.splice(index, 1);
  localDb.results = localDb.results.filter(r => !(r.user && r.user.toString() === id.toString()));
  persistLocalStore();
  return removed[0];
}


// ---------------- QUESTION OPERATIONS ----------------
export async function getQuestions(filter = {}) {
  if (isMongoLive()) {
    const query = { isActive: true };
    if (filter.difficulty && filter.difficulty !== 'All') query.difficulty = filter.difficulty;
    if (filter.category && filter.category !== 'All') query.category = filter.category;
    return await Question.find(query).sort({ createdAt: -1 });
  }
  return localDb.questions.filter(q => {
    if (!q.isActive) return false;
    if (filter.difficulty && filter.difficulty !== 'All' && q.difficulty !== filter.difficulty) return false;
    if (filter.category && filter.category !== 'All' && q.category !== filter.category) return false;
    return true;
  });
}

export async function getQuestionById(id) {
  if (isMongoLive()) {
    return await Question.findById(id);
  }
  return localDb.questions.find(q => q._id.toString() === id.toString()) || null;
}

export async function createQuestion(questionData) {
  if (isMongoLive()) {
    const newQ = new Question(questionData);
    return await newQ.save();
  }
  const newQ = {
    _id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    ...questionData,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  localDb.questions.push(newQ);
  persistLocalStore();
  return newQ;
}

export async function updateQuestion(id, updateData) {
  if (isMongoLive()) {
    return await Question.findByIdAndUpdate(id, updateData, { new: true });
  }
  const index = localDb.questions.findIndex(q => q._id.toString() === id.toString());
  if (index === -1) return null;
  localDb.questions[index] = { ...localDb.questions[index], ...updateData };
  persistLocalStore();
  return localDb.questions[index];
}

export async function deleteQuestion(id) {
  if (isMongoLive()) {
    return await Question.findByIdAndDelete(id);
  }
  const index = localDb.questions.findIndex(q => q._id.toString() === id.toString());
  if (index === -1) return null;
  const removed = localDb.questions.splice(index, 1);
  persistLocalStore();
  return removed[0];
}

// ---------------- RESULT OPERATIONS ----------------
export async function createResult(resultData) {
  if (isMongoLive()) {
    const newRes = new Result(resultData);
    return await newRes.save();
  }
  const newRes = {
    _id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    ...resultData,
    createdAt: new Date().toISOString()
  };
  localDb.results.unshift(newRes);
  persistLocalStore();
  return newRes;
}

export async function getUserResults(userId) {
  if (isMongoLive()) {
    return await Result.find({ user: userId }).sort({ createdAt: -1 });
  }
  return localDb.results
    .filter(r => (r.user && r.user.toString() === userId.toString()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getResultById(id) {
  if (isMongoLive()) {
    return await Result.findById(id).populate('user', 'name email username');
  }
  return localDb.results.find(r => r._id.toString() === id.toString()) || null;
}

export async function getAllResults() {
  if (isMongoLive()) {
    return await Result.find().sort({ createdAt: -1 });
  }
  return [...localDb.results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// ---------------- PLATFORM METRICS ----------------
export async function getSystemStats() {
  if (isMongoLive()) {
    const totalUsers = await User.countDocuments();
    const totalQuestions = await Question.countDocuments({ isActive: true });
    const totalResults = await Result.countDocuments();
    const results = await Result.find().select('percentage');
    const avgScore = results.length > 0
      ? Math.round(results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length)
      : 0;
    return { totalUsers, totalQuestions, totalResults, avgScore };
  }

  const totalUsers = localDb.users.length;
  const totalQuestions = localDb.questions.filter(q => q.isActive).length;
  const totalResults = localDb.results.length;
  const avgScore = totalResults > 0
    ? Math.round(localDb.results.reduce((acc, curr) => acc + curr.percentage, 0) / totalResults)
    : 0;

  return { totalUsers, totalQuestions, totalResults, avgScore };
}
