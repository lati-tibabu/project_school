const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

/**
 * Get all transactions
 */
exports.getTransactions = async (req, res) => {
  try {
    const { campusId, studentId, transactionType, paymentStatus, startDate, endDate } = req.query;
    const where = {};

    if (campusId) where.campusId = campusId;
    if (studentId) where.studentId = studentId;
    if (transactionType) where.transactionType = transactionType;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    if (startDate && endDate) {
      where.transactionDate = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      where.transactionDate = { [Op.gte]: startDate };
    } else if (endDate) {
      where.transactionDate = { [Op.lte]: endDate };
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['transactionDate', 'DESC']]
    });

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

/**
 * Get single transaction
 */
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message
    });
  }
};

/**
 * Create transaction
 */
exports.createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      processedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message
    });
  }
};

/**
 * Update transaction
 */
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    await transaction.update(req.body);

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction',
      error: error.message
    });
  }
};

/**
 * Delete transaction
 */
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    await transaction.destroy();

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
      error: error.message
    });
  }
};

/**
 * Get financial statistics for dashboard
 */
exports.getStats = async (user) => {
  const where = user.campusId ? { campusId: user.campusId } : {};
  const today = new Date().toISOString().split('T')[0];
  
  const totalIncome = await Transaction.sum('amount', {
    where: { ...where, transactionType: 'income', paymentStatus: 'completed' }
  }) || 0;

  const totalExpense = await Transaction.sum('amount', {
    where: { ...where, transactionType: 'expense', paymentStatus: 'completed' }
  }) || 0;

  const pendingPayments = await Transaction.count({
    where: { ...where, paymentStatus: 'pending' }
  });

  return {
    totalIncome: parseFloat(totalIncome),
    totalExpense: parseFloat(totalExpense),
    netBalance: parseFloat(totalIncome - totalExpense),
    pendingPayments
  };
};
