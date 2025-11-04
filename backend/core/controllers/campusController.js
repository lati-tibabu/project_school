const Campus = require('../models/Campus');
const User = require('../models/User');

/**
 * Get all campuses
 */
exports.getAllCampuses = async (req, res) => {
  try {
    const campuses = await Campus.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: campuses
    });
  } catch (error) {
    console.error('Get campuses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campuses',
      error: error.message
    });
  }
};

/**
 * Get single campus
 */
exports.getCampus = async (req, res) => {
  try {
    const campus = await Campus.findByPk(req.params.id);

    if (!campus) {
      return res.status(404).json({
        success: false,
        message: 'Campus not found'
      });
    }

    res.json({
      success: true,
      data: campus
    });
  } catch (error) {
    console.error('Get campus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campus',
      error: error.message
    });
  }
};

/**
 * Create campus
 */
exports.createCampus = async (req, res) => {
  try {
    const { name, code, address, city, state, country, phone, email } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Name and code are required'
      });
    }

    const campus = await Campus.create({
      name,
      code,
      address,
      city,
      state,
      country,
      phone,
      email
    });

    res.status(201).json({
      success: true,
      message: 'Campus created successfully',
      data: campus
    });
  } catch (error) {
    console.error('Create campus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create campus',
      error: error.message
    });
  }
};

/**
 * Update campus
 */
exports.updateCampus = async (req, res) => {
  try {
    const campus = await Campus.findByPk(req.params.id);

    if (!campus) {
      return res.status(404).json({
        success: false,
        message: 'Campus not found'
      });
    }

    await campus.update(req.body);

    res.json({
      success: true,
      message: 'Campus updated successfully',
      data: campus
    });
  } catch (error) {
    console.error('Update campus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update campus',
      error: error.message
    });
  }
};

/**
 * Delete campus
 */
exports.deleteCampus = async (req, res) => {
  try {
    const campus = await Campus.findByPk(req.params.id);

    if (!campus) {
      return res.status(404).json({
        success: false,
        message: 'Campus not found'
      });
    }

    await campus.destroy();

    res.json({
      success: true,
      message: 'Campus deleted successfully'
    });
  } catch (error) {
    console.error('Delete campus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete campus',
      error: error.message
    });
  }
};
