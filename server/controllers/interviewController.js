import {
  getQuestions,
  getQuestionById,
  createResult,
  getUserResults,
  getResultById
} from '../services/dataService.js';
import { evaluateAnswer, evaluateInterviewSession } from '../utils/evaluationEngine.js';

export const startInterview = async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Administrators cannot start mock interviews. Only candidate accounts are permitted to practice.'
      });
    }

    const { difficulty = 'Simple', category = 'All', count = 5 } = req.body;

    // Retrieve questions matching criteria
    const filter = {};
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
    if (category && category !== 'All') filter.category = category;

    let pool = await getQuestions(filter);

    // If not enough questions in specific category, fall back to matching difficulty
    if (pool.length < count && category !== 'All') {
      const backupPool = await getQuestions({ difficulty: filter.difficulty });
      const existingIds = new Set(pool.map(q => q._id.toString()));
      for (const bq of backupPool) {
        if (!existingIds.has(bq._id.toString())) {
          pool.push(bq);
          if (pool.length >= count) break;
        }
      }
    }

    if (pool.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions available for the selected difficulty and category.'
      });
    }

    // Shuffle questions
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(Number(count), pool.length));

    // Sanitize questions (hide ideal answers and internal keywords from candidate)
    const sanitizedQuestions = selected.map((q, index) => ({
      index: index + 1,
      id: q._id,
      questionText: q.questionText,
      category: q.category,
      difficulty: q.difficulty,
      tips: q.tips || '',
      timeLimitSeconds: q.timeLimitSeconds || 120,
      maxScore: q.maxScore || 10
    }));

    res.json({
      success: true,
      difficulty,
      category,
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions
    });
  } catch (error) {
    console.error('[Interview] Start session error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitInterview = async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Administrators cannot submit mock interviews. Only candidate accounts are permitted to practice.'
      });
    }

    const { difficulty, category, answers = [], timeSpentSeconds = 0 } = req.body;
    const userId = req.user._id || req.user.id;
    const userName = req.user.name || 'Candidate';
    const userEmail = req.user.email || '';

    if (!answers || !answers.length) {
      return res.status(400).json({
        success: false,
        message: 'No answers submitted to evaluate.'
      });
    }

    const evaluatedAnswers = [];

    for (const item of answers) {
      const question = await getQuestionById(item.questionId);
      if (!question) continue;

      const evalResult = evaluateAnswer(question, item.answer || '');

      evaluatedAnswers.push({
        questionId: question._id,
        questionText: question.questionText,
        category: question.category,
        difficulty: question.difficulty,
        userAnswer: (item.answer || '').trim(),
        idealAnswer: question.idealAnswer,
        score: evalResult.score,
        maxScore: evalResult.maxScore,
        feedback: evalResult.feedback,
        matchedKeywords: evalResult.matchedKeywords,
        missingKeywords: evalResult.missingKeywords,
        accuracyPercentage: evalResult.accuracyPercentage
      });
    }

    const sessionEvaluation = evaluateInterviewSession(evaluatedAnswers);

    const resultRecord = await createResult({
      user: userId,
      userName,
      userEmail,
      difficulty: difficulty || 'Simple',
      category: category || 'Mixed',
      totalScore: sessionEvaluation.totalScore,
      maxPossibleScore: sessionEvaluation.maxPossibleScore,
      percentage: sessionEvaluation.percentage,
      performanceGrade: sessionEvaluation.performanceGrade,
      timeSpentSeconds,
      answers: evaluatedAnswers,
      overallFeedback: sessionEvaluation.overallFeedback,
      strengths: sessionEvaluation.strengths,
      areasForImprovement: sessionEvaluation.areasForImprovement
    });

    res.status(201).json({
      success: true,
      message: 'Interview evaluated and saved successfully.',
      result: resultRecord
    });
  } catch (error) {
    console.error('[Interview] Submission evaluation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyInterviewHistory = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const results = await getUserResults(userId);
    res.json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInterviewResult = async (req, res) => {
  try {
    const result = await getResultById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Interview result not found.' });
    }

    const userId = req.user._id || req.user.id;
    const isOwner = (result.user && (result.user._id || result.user).toString() === userId.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
