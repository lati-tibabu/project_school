const Attendance = require('../models/Attendance');
const { Op } = require('sequelize');

/**
 * Get attendance records
 */
exports.getAttendance = async (req, res) => {
  try {
    const { campusId, studentId, teacherId, startDate, endDate, status } = req.query;
    const where = {};

    if (campusId) where.campusId = campusId;
    if (studentId) where.studentId = studentId;
    if (teacherId) where.teacherId = teacherId;
    if (status) where.status = status;

    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      where.date = { [Op.gte]: startDate };
    } else if (endDate) {
      where.date = { [Op.lte]: endDate };
    }

    const attendance = await Attendance.findAll({
      where,
      order: [['date', 'DESC']]
    });

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
      error: error.message
    });
  }
};

/**
 * Mark attendance
 */
exports.markAttendance = async (req, res) => {
  try {
    const { campusId, studentId, teacherId, date, status, checkInTime, checkOutTime, remarks } = req.body;

    if (!campusId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Campus ID, date, and status are required'
      });
    }

    if (!studentId && !teacherId) {
      return res.status(400).json({
        success: false,
        message: 'Either student ID or teacher ID is required'
      });
    }

    const attendance = await Attendance.create({
      campusId,
      studentId,
      teacherId,
      date,
      status,
      checkInTime,
      checkOutTime,
      remarks,
      markedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
};

/**
 * Update attendance
 */
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    await attendance.update(req.body);

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance',
      error: error.message
    });
  }
};

/**
 * Delete attendance
 */
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    await attendance.destroy();

    res.json({
      success: true,
      message: 'Attendance deleted successfully'
    });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete attendance',
      error: error.message
    });
  }
};

/**
 * Get statistics for dashboard
 */
exports.getStats = async (user) => {
  const where = user.campusId ? { campusId: user.campusId } : {};
  const today = new Date().toISOString().split('T')[0];
  
  return {
    totalToday: await Attendance.count({ where: { ...where, date: today } }),
    presentToday: await Attendance.count({ where: { ...where, date: today, status: 'present' } }),
    absentToday: await Attendance.count({ where: { ...where, date: today, status: 'absent' } })
  };
};
