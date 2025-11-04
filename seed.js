const { sequelize } = require('./backend/config/database');
const User = require('./backend/core/models/User');
const Campus = require('./backend/core/models/Campus');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✓ Database synchronized');

    // Create campuses
    const mainCampus = await Campus.create({
      name: 'Main Campus',
      code: 'MAIN01',
      address: '123 Education Street',
      city: 'Cityville',
      state: 'State',
      country: 'Country',
      phone: '+1234567890',
      email: 'main@school.com',
      isActive: true
    });

    const northCampus = await Campus.create({
      name: 'North Campus',
      code: 'NORTH01',
      address: '456 Learning Avenue',
      city: 'Northtown',
      state: 'State',
      country: 'Country',
      phone: '+1234567891',
      email: 'north@school.com',
      isActive: true
    });

    console.log('✓ Created 2 campuses');

    // Create users
    const superAdmin = await User.create({
      username: 'admin',
      email: 'admin@school.com',
      password: 'admin123',
      role: 'super_admin',
      isActive: true
    });

    const campusAdmin = await User.create({
      username: 'campus_admin',
      email: 'campusadmin@school.com',
      password: 'admin123',
      role: 'admin',
      campusId: mainCampus.id,
      isActive: true
    });

    const teacher = await User.create({
      username: 'teacher1',
      email: 'teacher1@school.com',
      password: 'teacher123',
      role: 'teacher',
      campusId: mainCampus.id,
      isActive: true
    });

    const student = await User.create({
      username: 'student1',
      email: 'student1@school.com',
      password: 'student123',
      role: 'student',
      campusId: mainCampus.id,
      isActive: true
    });

    console.log('✓ Created 4 users (super_admin, admin, teacher, student)');

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('Login credentials:');
    console.log('  Super Admin: admin / admin123');
    console.log('  Campus Admin: campus_admin / admin123');
    console.log('  Teacher: teacher1 / teacher123');
    console.log('  Student: student1 / student123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
