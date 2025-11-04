# Creating a New Module - Example: Library Module

This guide demonstrates how to create a new module for the School Management System using a Library Management module as an example.

## Step 1: Create Module Directory Structure

```bash
mkdir -p backend/modules/library/{models,routes,controllers}
```

## Step 2: Create manifest.json

Create `backend/modules/library/manifest.json`:

```json
{
  "name": "Library Management",
  "version": "1.0.0",
  "description": "Module for managing library books and borrowing",
  "enabled": true,
  "basePath": "/api/library",
  "dependencies": ["student", "teacher"],
  "permissions": ["library.view", "library.create", "library.update", "library.delete"]
}
```

## Step 3: Create Model

Create `backend/modules/library/models/Book.js`:

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');

const Book = sequelize.define('Book', {
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
  isbn: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  available: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  status: {
    type: DataTypes.ENUM('available', 'borrowed', 'maintenance', 'lost'),
    defaultValue: 'available'
  }
}, {
  tableName: 'books',
  timestamps: true
});

module.exports = Book;
```

## Step 4: Create Controller

Create `backend/modules/library/controllers/libraryController.js`:

```javascript
const Book = require('../models/Book');

/**
 * Get all books
 */
exports.getAllBooks = async (req, res) => {
  try {
    const { campusId, category, status } = req.query;
    const where = {};

    if (campusId) where.campusId = campusId;
    if (category) where.category = category;
    if (status) where.status = status;

    const books = await Book.findAll({
      where,
      order: [['title', 'ASC']]
    });

    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books',
      error: error.message
    });
  }
};

/**
 * Get single book
 */
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch book',
      error: error.message
    });
  }
};

/**
 * Create book
 */
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create book',
      error: error.message
    });
  }
};

/**
 * Update book
 */
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await book.update(req.body);

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update book',
      error: error.message
    });
  }
};

/**
 * Delete book
 */
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await book.destroy();

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
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
    totalBooks: await Book.count({ where }),
    available: await Book.count({ where: { ...where, status: 'available' } }),
    borrowed: await Book.count({ where: { ...where, status: 'borrowed' } })
  };
};
```

## Step 5: Create Dashboard Controller

Create `backend/modules/library/controllers/dashboardController.js`:

```javascript
const libraryController = require('./libraryController');

module.exports = {
  getStats: libraryController.getStats
};
```

## Step 6: Create Routes

Create `backend/modules/library/routes/index.js`:

```javascript
const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const { authenticate, authorize } = require('../../../middleware/auth');

router.use(authenticate);

router.get('/', libraryController.getAllBooks);
router.get('/:id', libraryController.getBook);
router.post('/', authorize('super_admin', 'admin'), libraryController.createBook);
router.put('/:id', authorize('super_admin', 'admin'), libraryController.updateBook);
router.delete('/:id', authorize('super_admin', 'admin'), libraryController.deleteBook);

module.exports = router;
```

## Step 7: Test the Module

1. Restart the server:
```bash
npm start
```

2. The module will be automatically loaded. You should see:
```
✓ Loaded module: Library Management v1.0.0
```

3. Test the endpoints:
```bash
# Get all books
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/library

# Create a book
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "campusId": "uuid",
    "isbn": "978-0-123456-78-9",
    "title": "Introduction to Programming",
    "author": "John Doe",
    "category": "Computer Science",
    "quantity": 5,
    "available": 5
  }' \
  http://localhost:5000/api/library
```

## Step 8: Disable/Enable Module

To disable the module, edit `manifest.json`:

```json
{
  "enabled": false
}
```

Then restart the server. The module will not be loaded.

## Best Practices

1. **Follow Naming Conventions**: Use consistent naming for files and functions
2. **Error Handling**: Always include try-catch blocks and proper error messages
3. **Authorization**: Use appropriate role-based permissions
4. **Validation**: Validate input data before processing
5. **Documentation**: Add comments for complex logic
6. **Testing**: Write tests for your module's functionality
7. **Dependencies**: Declare module dependencies in manifest.json

## Module Features

### Supported Features
- ✅ Models with Sequelize
- ✅ Routes with Express
- ✅ Controllers with business logic
- ✅ Authentication middleware
- ✅ Authorization middleware
- ✅ Dashboard statistics
- ✅ Query parameters for filtering
- ✅ CRUD operations
- ✅ Error handling

### Advanced Features
- Custom middleware
- Relationships with other module models
- WebSocket support
- File uploads
- Scheduled tasks
- Custom validators

## Troubleshooting

### Module Not Loading
1. Check `manifest.json` syntax
2. Verify `enabled: true`
3. Check server logs for errors
4. Ensure all required files exist

### Routes Not Working
1. Verify `basePath` in manifest
2. Check route definitions
3. Ensure middleware is applied correctly
4. Verify authentication token

### Database Errors
1. Sync database: Set `{ alter: true }` in development
2. Check model relationships
3. Verify foreign key references
4. Check database connection

## Next Steps

1. Add more models (e.g., BorrowRecord, LibraryMember)
2. Implement borrowing/returning functionality
3. Add overdue notifications
4. Create frontend components
5. Add search and filtering
6. Implement reports and analytics
