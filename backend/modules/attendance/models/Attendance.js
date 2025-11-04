const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  campusId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'campuses',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'teachers',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
    allowNull: false,
    defaultValue: 'present'
  },
  checkInTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  checkOutTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  markedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'attendance',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['studentId', 'date'],
      where: {
        studentId: { [require('sequelize').Op.ne]: null }
      }
    },
    {
      unique: true,
      fields: ['teacherId', 'date'],
      where: {
        teacherId: { [require('sequelize').Op.ne]: null }
      }
    }
  ]
});

module.exports = Attendance;
