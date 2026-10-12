/**
 * Intelligent Mock Interview Answer Evaluation Engine
 * Evaluates candidate responses against ideal answers and technical keywords
 * Generates accurate scores, keyword matching diagnostics, and actionable feedback
 */

// Common English stopwords to ignore in semantic analysis
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn', 'it', 'its', 'itself', 'just', 'me', 'more',
  'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
  'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn', 'we', 'were',
  'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'you', 'your', 'yours'
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOPWORDS.has(word));
}

function calculateJaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionCount++;
    }
  }
  const unionCount = setA.size + setB.size - intersectionCount;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

/**
 * Evaluates a single candidate answer against a question's ideal answer and keyword list
 */
export function evaluateAnswer(question, rawUserAnswer = '') {
  const userAnswer = (rawUserAnswer || '').trim();
  const maxScore = question.maxScore || 10;

  // Edge case: Empty or negligible answer
  if (!userAnswer || userAnswer.length < 8) {
    return {
      score: 0,
      maxScore,
      accuracyPercentage: 0,
      matchedKeywords: [],
      missingKeywords: question.keywords || [],
      feedback: "No substantial answer was provided. Make sure to articulate key concepts, terminology, and practical code examples to earn points."
    };
  }

  const userTokens = tokenize(userAnswer);
  const userTokenSet = new Set(userTokens);
  const lowerAnswer = userAnswer.toLowerCase();

  // 1. Keyword evaluation (up to 4.5 points)
  const keywords = (question.keywords && question.keywords.length > 0)
    ? question.keywords
    : [];

  const matchedKeywords = [];
  const missingKeywords = [];

  for (const kw of keywords) {
    const kwLower = kw.toLowerCase().trim();
    if (lowerAnswer.includes(kwLower) || userTokenSet.has(kwLower)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const keywordRatio = keywords.length > 0 ? (matchedKeywords.length / keywords.length) : 0.6;
  const keywordScore = keywordRatio * 4.5;

  // 2. Semantic Token Overlap with Ideal Answer (up to 3.5 points)
  const idealTokens = tokenize(question.idealAnswer);
  const idealTokenSet = new Set(idealTokens);
  const similarity = calculateJaccardSimilarity(userTokenSet, idealTokenSet);
  const similarityScore = Math.min(3.5, similarity * 7.5);

  // 3. Completeness & Length Depth (up to 2.0 points)
  let depthScore = 0;
  const wordCount = userAnswer.split(/\s+/).length;
  if (wordCount >= 70) depthScore = 2.0;
  else if (wordCount >= 40) depthScore = 1.6;
  else if (wordCount >= 20) depthScore = 1.1;
  else depthScore = 0.5;

  // Total raw score out of 10
  let rawScore = keywordScore + similarityScore + depthScore;
  rawScore = Math.min(10, Math.max(1, Math.round(rawScore * 10) / 10));

  // If candidate matched 80%+ keywords, ensure score is at least 7.5
  if (keywordRatio >= 0.8 && rawScore < 7.5) {
    rawScore = 8.0;
  }
  // If no keywords matched and similarity very low, cap score at 3
  if (keywordRatio === 0 && similarity < 0.1) {
    rawScore = Math.min(rawScore, 3.0);
  }

  const accuracyPercentage = Math.round((rawScore / maxScore) * 100);

  // 4. Constructive feedback generation
  let feedback = '';
  if (accuracyPercentage >= 85) {
    feedback = `Exceptional answer! You demonstrated solid mastery of core concepts. You effectively highlighted key terms including: ${matchedKeywords.slice(0, 4).join(', ')}.`;
  } else if (accuracyPercentage >= 70) {
    feedback = `Strong response! You clearly understand the concept and covered essential points like ${matchedKeywords.slice(0, 3).join(', ')}.`;
    if (missingKeywords.length > 0) {
      feedback += ` To achieve top marks, incorporate discussion around ${missingKeywords.slice(0, 3).join(', ')}.`;
    }
  } else if (accuracyPercentage >= 50) {
    feedback = `Satisfactory answer, but needs more depth. You identified fundamentals (${matchedKeywords.join(', ') || 'basic ideas'}), but missed critical interview terms like: ${missingKeywords.slice(0, 4).join(', ')}.`;
  } else {
    feedback = `Answer needs significant improvement. The response missed core technical requirements. Be sure to study and explain: ${missingKeywords.slice(0, 4).join(', ')}.`;
  }

  return {
    score: rawScore,
    maxScore,
    accuracyPercentage,
    matchedKeywords,
    missingKeywords,
    feedback
  };
}

/**
 * Calculates overall interview session evaluation and summaries
 */
export function evaluateInterviewSession(answers = []) {
  if (!answers.length) {
    return {
      totalScore: 0,
      maxPossibleScore: 0,
      percentage: 0,
      performanceGrade: 'Needs Improvement',
      overallFeedback: 'No questions were attempted in this session.',
      strengths: [],
      areasForImprovement: []
    };
  }

  let totalScore = 0;
  let maxPossibleScore = 0;
  const strengthsSet = new Set();
  const improvementsSet = new Set();

  for (const item of answers) {
    totalScore += item.score;
    maxPossibleScore += item.maxScore || 10;

    if (item.accuracyPercentage >= 75) {
      if (item.matchedKeywords.length) {
        strengthsSet.add(`Strong grasp of ${item.category || 'topic'} (${item.matchedKeywords.slice(0, 2).join(', ')})`);
      } else {
        strengthsSet.add(`Solid explanation for "${item.questionText.slice(0, 40)}..."`);
      }
    } else {
      if (item.missingKeywords.length) {
        improvementsSet.add(`Revise ${item.category || 'topic'} concepts: focus on ${item.missingKeywords.slice(0, 2).join(', ')}`);
      } else {
        improvementsSet.add(`Provide more detailed technical depth on ${item.category || 'questions'}`);
      }
    }
  }

  const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  let performanceGrade = 'Needs Improvement';
  let overallFeedback = '';

  if (percentage >= 85) {
    performanceGrade = 'Outstanding';
    overallFeedback = `Superb interview performance! You demonstrated exceptional technical clarity, used standard engineering vocabulary, and gave thorough answers across all difficulty levels. You are ready for live recruitment rounds.`;
  } else if (percentage >= 70) {
    performanceGrade = 'Strong Candidate';
    overallFeedback = `Very good performance! You communicated core technical concepts effectively with strong analytical aptitude. Reviewing a few specific keywords and edge cases will put you in the top tier of candidates.`;
  } else if (percentage >= 50) {
    performanceGrade = 'Good Potential';
    overallFeedback = `Decent foundation, but your answers lacked depth on several technical concepts. Practice structuring your answers with definitions, architectural reasons, and practical examples.`;
  } else {
    performanceGrade = 'Needs Improvement';
    overallFeedback = `Considerable preparation is recommended before attending real interviews. Focus on foundational technical principles, keyword terminology, and practice articulating responses out loud.`;
  }

  return {
    totalScore: Math.round(totalScore * 10) / 10,
    maxPossibleScore,
    percentage,
    performanceGrade,
    overallFeedback,
    strengths: Array.from(strengthsSet).slice(0, 5),
    areasForImprovement: Array.from(improvementsSet).slice(0, 5)
  };
}
