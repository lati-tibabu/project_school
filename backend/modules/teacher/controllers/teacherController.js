const Teacher = require('../models/Teacher');

/**
 * Get all teachers
 */
exports.getAllTeachers = async (req, res) => {
  try {
    const { campusId, department, subject, status } = req.query;
    const where = {};

    if (campusId) where.campusId = campusId;
    if (department) where.department = department;
    if (subject) where.subject = subject;
    if (status) where.status = status;

    const teachers = await Teacher.findAll({
      where,
      order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    });

    res.json({
      success: true,
      data: teachers
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teachers',
      error: error.message
    });
  }
};

/**
 * Get single teacher
 */
exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      data: teacher
    });
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teacher',
      error: error.message
    });
  }
};

/**
 * Create teacher
 */
exports.createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create teacher',
      error: error.message
    });
  }
};

/**
 * Update teacher
 */
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    await teacher.update(req.body);

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update teacher',
      error: error.message
    });
  }
};

/**
 * Delete teacher
 */
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    await teacher.destroy();

    res.json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete teacher',
      error: error.message
    });
  }
};

/**
 * Get statistics for dashboard
 */
exports.getStats = async (user) => {
  const where = user.campusId ? { campusId: user.campusId } : {};
  
  return {
    total: await Teacher.count({ where }),
    active: await Teacher.count({ where: { ...where, status: 'active' } }),
    on_leave: await Teacher.count({ where: { ...where, status: 'on_leave' } })
  };
};
