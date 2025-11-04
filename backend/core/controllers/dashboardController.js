const User = require('../models/User');
const Campus = require('../models/Campus');
const moduleLoader = require('../../config/moduleLoader');

/**
 * Get dashboard statistics
 */
exports.getDashboard = async (req, res) => {
  try {
    const { role, campusId } = req.user;

    // Get base statistics
    const stats = {
      users: await User.count(),
      campuses: await Campus.count(),
      modules: moduleLoader.getModules()
    };

    // Add role-specific or campus-specific stats
    if (campusId) {
      stats.campusUsers = await User.count({ where: { campusId } });
    }

    // Get module-specific statistics if available
    const moduleStats = {};
    for (const [moduleName, module] of moduleLoader.modules) {
      if (module.controllers.dashboardController) {
        try {
          moduleStats[moduleName] = await module.controllers.dashboardController.getStats(req.user);
        } catch (error) {
          console.error(`Error getting stats for ${moduleName}:`, error.message);
        }
      }
    }

    res.json({
      success: true,
      data: {
        ...stats,
        moduleStats
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

/**
 * Get loaded modules info
 */
exports.getModules = async (req, res) => {
  try {
    const modules = moduleLoader.getModules();

    res.json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch modules',
      error: error.message
    });
  }
};
