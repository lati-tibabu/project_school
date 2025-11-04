const { Sequelize } = require('sequelize');

describe('Database Configuration', () => {
  let sequelize;

  beforeAll(() => {
    // Create a test database connection
    sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'school_management',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      logging: false
    });
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it('should have correct dialect', () => {
    expect(sequelize.getDialect()).toBe('postgres');
  });

  it('should have connection options configured', () => {
    const options = sequelize.options;
    
    expect(options).toHaveProperty('dialect');
    expect(options).toHaveProperty('host');
    expect(options).toHaveProperty('port');
  });
});
