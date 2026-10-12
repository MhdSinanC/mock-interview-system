import mongoose from 'mongoose';

const answerEvaluationSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  questionText: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  difficulty: {
    type: String,
    default: 'Simple'
  },
  userAnswer: {
    type: String,
    default: ''
  },
  idealAnswer: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  maxScore: {
    type: Number,
    default: 10
  },
  feedback: {
    type: String,
    required: true
  },
  matchedKeywords: {
    type: [String],
    default: []
  },
  missingKeywords: {
    type: [String],
    default: []
  },
  accuracyPercentage: {
    type: Number,
    default: 0
  }
});

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    default: 'Candidate'
  },
  userEmail: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Simple', 'Intermediate', 'Hard', 'Mixed']
  },
  category: {
    type: String,
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  maxPossibleScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  performanceGrade: {
    type: String,
    enum: ['Outstanding', 'Strong Candidate', 'Good Potential', 'Needs Improvement'],
    default: 'Good Potential'
  },
  timeSpentSeconds: {
    type: Number,
    default: 0
  },
  answers: [answerEvaluationSchema],
  overallFeedback: {
    type: String,
    default: ''
  },
  strengths: {
    type: [String],
    default: []
  },
  areasForImprovement: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Result = mongoose.model('Result', resultSchema);
export default Result;
