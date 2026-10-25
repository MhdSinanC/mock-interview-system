const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('mock_interview_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getHeaders(),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  getProfile: () => request('/auth/profile'),
  updateProfile: (profileData) => request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),

  // Questions
  getQuestions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/questions${query ? `?${query}` : ''}`);
  },
  getCategories: () => request('/questions/categories'),
  getQuestionById: (id) => request(`/questions/${id}`),
  createQuestion: (questionData) => request('/questions', {
    method: 'POST',
    body: JSON.stringify(questionData)
  }),
  updateQuestion: (id, questionData) => request(`/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(questionData)
  }),
  deleteQuestion: (id) => request(`/questions/${id}`, {
    method: 'DELETE'
  }),

  // Interviews
  startInterview: (params) => request('/interviews/start', {
    method: 'POST',
    body: JSON.stringify(params)
  }),
  submitInterview: (submission) => request('/interviews/submit', {
    method: 'POST',
    body: JSON.stringify(submission)
  }),
  getMyHistory: () => request('/interviews/my-history'),
  getResultById: (id) => request(`/interviews/${id}`),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAllUsers: () => request('/admin/users'),
  deleteCandidate: (id) => request(`/admin/users/${id}`, {
    method: 'DELETE'
  }),
  getAllResults: () => request('/admin/results'),

  // Health
  getHealth: () => request('/health')
};
