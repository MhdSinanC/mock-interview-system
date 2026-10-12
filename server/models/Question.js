import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Full Stack', 'Data Structures', 'Database & SQL', 'HR & Behavioral'],
    default: 'Full Stack'
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Simple', 'Intermediate', 'Hard'],
    default: 'Simple'
  },
  idealAnswer: {
    type: String,
    required: true
  },
  keywords: {
    type: [String],
    default: []
  },
  tips: {
    type: String,
    default: ''
  },
  timeLimitSeconds: {
    type: Number,
    default: 120 // 2 minutes default per question
  },
  maxScore: {
    type: Number,
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
