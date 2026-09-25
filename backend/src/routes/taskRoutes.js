const express = require('express');
const {
  getAllTasks,
  getMyTasks,
  getBlockedTasks,
  getTaskById,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

// Blocked and user-specific task routes
router.get('/blocked', getBlockedTasks);
router.get('/my/:userId', getMyTasks);

// CRUD routes
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

module.exports = router;
