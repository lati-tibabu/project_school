const User = require('./User');
const Campus = require('./Campus');

// Set up associations
Campus.hasMany(User, { foreignKey: 'campusId', as: 'users' });
User.belongsTo(Campus, { foreignKey: 'campusId', as: 'campus' });

module.exports = {
  User,
  Campus
};
