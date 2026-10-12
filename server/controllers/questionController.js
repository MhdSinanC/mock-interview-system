import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../services/dataService.js';
import { defaultCategories } from '../data/seedQuestions.js';

export const listQuestions = async (req, res) => {
  try {
    const { difficulty, category, search } = req.query;
    let questions = await getQuestions({ difficulty, category });

    if (search) {
      const q = search.toLowerCase();
      questions = questions.filter(item =>
        item.questionText.toLowerCase().includes(q) ||
        (item.keywords && item.keywords.some(k => k.toLowerCase().includes(q)))
      );
    }

    res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleQuestion = async (req, res) => {
  try {
    const question = await getQuestionById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const { questionText, category, difficulty, idealAnswer, keywords, tips, timeLimitSeconds, maxScore } = req.body;

    if (!questionText || !category || !difficulty || !idealAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Question text, category, difficulty, and ideal answer are required.'
      });
    }

    const keywordArray = Array.isArray(keywords)
      ? keywords
      : (typeof keywords === 'string' ? keywords.split(',').map(s => s.trim()).filter(Boolean) : []);

    const newQuestion = await createQuestion({
      questionText: questionText.trim(),
      category,
      difficulty,
      idealAnswer: idealAnswer.trim(),
      keywords: keywordArray,
      tips: tips || '',
      timeLimitSeconds: Number(timeLimitSeconds) || 120,
      maxScore: Number(maxScore) || 10
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully.',
      question: newQuestion
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editQuestion = async (req, res) => {
  try {
    const { keywords, ...rest } = req.body;
    let updatePayload = { ...rest };

    if (keywords !== undefined) {
      updatePayload.keywords = Array.isArray(keywords)
        ? keywords
        : (typeof keywords === 'string' ? keywords.split(',').map(s => s.trim()).filter(Boolean) : []);
    }

    const updated = await updateQuestion(req.params.id, updatePayload);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    res.json({
      success: true,
      message: 'Question updated successfully.',
      question: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeQuestion = async (req, res) => {
  try {
    const deleted = await deleteQuestion(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }
    res.json({
      success: true,
      message: 'Question deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req, res) => {
  res.json({
    success: true,
    categories: defaultCategories
  });
};
