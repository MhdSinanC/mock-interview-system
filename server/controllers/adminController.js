import {
  getSystemStats,
  getAllUsers,
  getAllResults
} from '../services/dataService.js';

export const getAdminStats = async (req, res) => {
  try {
    const stats = await getSystemStats();
    const results = await getAllResults();

    // Calculate difficulty breakdown
    const difficultyDistribution = {
      Simple: 0,
      Intermediate: 0,
      Hard: 0
    };

    results.forEach(r => {
      if (difficultyDistribution[r.difficulty] !== undefined) {
        difficultyDistribution[r.difficulty]++;
      }
    });

    res.json({
      success: true,
      stats: {
        ...stats,
        difficultyDistribution,
        recentActivity: results.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listAllResults = async (req, res) => {
  try {
    const results = await getAllResults();
    res.json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
