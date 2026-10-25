import {
  getSystemStats,
  getAllUsers,
  getAllResults,
  deleteUser,
  findUserById
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

export const deleteCandidateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const targetUser = await findUserById(id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Candidate account not found.' });
    }

    // Protect administrator accounts from deletion
    if (targetUser.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Administrator accounts cannot be deleted. Only candidate accounts can be removed.'
      });
    }

    const currentAdminId = (req.user._id || req.user.id).toString();
    if (targetUser._id.toString() === currentAdminId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.'
      });
    }

    await deleteUser(id);

    res.json({
      success: true,
      message: `Candidate "${targetUser.name}" and associated records were successfully deleted.`
    });
  } catch (error) {
    console.error('[Admin] Delete user error:', error);
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

