const { tasks, users } = require('../data/mockData');

// Enrich task with assignee details and dependency status
function enrichTask(task) {
  const assignedUser = users.find((u) => u.id === task.assignedUserId);
  let dependsOnTaskInfo = null;
  let isBlocked = false;
  let blockedReason = null;

  if (task.dependsOnTaskId) {
    const parentTask = tasks.find((t) => t.id === task.dependsOnTaskId);
    if (parentTask) {
      dependsOnTaskInfo = {
        id: parentTask.id,
        title: parentTask.title,
        status: parentTask.status,
      };

      if (task.status !== 'Done' && parentTask.status !== 'Done') {
        isBlocked = true;
        blockedReason = `Waiting for: "${parentTask.title}" (${parentTask.status})`;
      }
    }
  }

  return {
    ...task,
    assignedUser: assignedUser
      ? { id: assignedUser.id, name: assignedUser.name, email: assignedUser.email }
      : undefined,
    dependsOnTask: dependsOnTaskInfo,
    isBlocked,
    blockedReason,
  };
}

// Get all tasks with optional filters
function getAllTasks(req, res) {
  try {
    const { status, priority } = req.query;

    let filteredTasks = [...tasks];

    if (status && typeof status === 'string') {
      filteredTasks = filteredTasks.filter((t) => t.status === status);
    }

    if (priority && typeof priority === 'string') {
      filteredTasks = filteredTasks.filter((t) => t.priority === priority);
    }

    const enriched = filteredTasks.map(enrichTask);

    return res.status(200).json({
      success: true,
      data: enriched,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
    });
  }
}

// Get tasks for a specific user
function getMyTasks(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required.',
      });
    }

    const userTasks = tasks.filter((t) => t.assignedUserId === userId);
    const enriched = userTasks.map(enrichTask);

    return res.status(200).json({
      success: true,
      data: enriched,
    });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user tasks',
    });
  }
}

// Get all blocked tasks
function getBlockedTasks(req, res) {
  try {
    const enriched = tasks.map(enrichTask);
    const blockedTasks = enriched.filter((t) => t.isBlocked);

    return res.status(200).json({
      success: true,
      data: blockedTasks,
    });
  } catch (error) {
    console.error('Error fetching blocked tasks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blocked tasks',
    });
  }
}

// Get single task by ID
function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: enrichTask(task),
    });
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
    });
  }
}

// Create new task
function createTask(req, res) {
  try {
    const { title, description, priority, status, assignedUserId, dependsOnTaskId } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please enter a task title.',
      });
    }

    if (!assignedUserId || typeof assignedUserId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please select a user to assign this task.',
      });
    }

    const assignedUserExists = users.some((u) => u.id === assignedUserId);
    if (!assignedUserExists) {
      return res.status(400).json({
        success: false,
        message: 'The selected assigned user does not exist.',
      });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    const taskPriority = validPriorities.includes(priority) ? priority : 'Medium';

    const validStatuses = ['To Do', 'In Progress', 'Done'];
    const taskStatus = validStatuses.includes(status) ? status : 'To Do';

    let validDependsOnTaskId = null;
    if (dependsOnTaskId && typeof dependsOnTaskId === 'string' && dependsOnTaskId.trim() !== '') {
      const parentTask = tasks.find((t) => t.id === dependsOnTaskId);
      if (!parentTask) {
        return res.status(400).json({
          success: false,
          message: 'The selected dependency task does not exist.',
        });
      }
      validDependsOnTaskId = parentTask.id;

      if (taskStatus === 'Done' && parentTask.status !== 'Done') {
        return res.status(400).json({
          success: false,
          message: `Task cannot be marked as Done because its dependency "${parentTask.title}" is still ${parentTask.status}.`,
        });
      }
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description && typeof description === 'string' ? description.trim() : '',
      priority: taskPriority,
      status: taskStatus,
      assignedUserId,
      dependsOnTaskId: validDependsOnTaskId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: enrichTask(newTask),
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create task',
    });
  }
}

// Update existing task
function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, priority, status, assignedUserId, dependsOnTaskId } = req.body;

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const existingTask = tasks[taskIndex];

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please enter a task title.',
      });
    }

    if (!assignedUserId || typeof assignedUserId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please select a user to assign this task.',
      });
    }

    const assignedUserExists = users.some((u) => u.id === assignedUserId);
    if (!assignedUserExists) {
      return res.status(400).json({
        success: false,
        message: 'The selected assigned user does not exist.',
      });
    }

    if (dependsOnTaskId && dependsOnTaskId === id) {
      return res.status(400).json({
        success: false,
        message: 'A task cannot depend on itself.',
      });
    }

    let validDependsOnTaskId = null;
    if (dependsOnTaskId && typeof dependsOnTaskId === 'string' && dependsOnTaskId.trim() !== '') {
      const parentTask = tasks.find((t) => t.id === dependsOnTaskId);
      if (!parentTask) {
        return res.status(400).json({
          success: false,
          message: 'The selected dependency task does not exist.',
        });
      }
      validDependsOnTaskId = parentTask.id;
    }

    const loggedInUserId =
      req.body?.userId ||
      req.body?.loggedInUserId ||
      req.headers['x-user-id'] ||
      req.query?.userId;

    const newStatus = status || existingTask.status;
    if (newStatus === 'Done' && existingTask.status !== 'Done') {
      if (!loggedInUserId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required. Please log in to mark tasks as Done.',
        });
      }

      if (loggedInUserId !== existingTask.assignedUserId) {
        const assignedUser = users.find((u) => u.id === existingTask.assignedUserId);
        const assignedName = assignedUser ? assignedUser.name : 'the assigned user';
        return res.status(403).json({
          success: false,
          message: `Unauthorized: Only ${assignedName} can mark this task as Done.`,
        });
      }
    }

    if (newStatus === 'Done' && validDependsOnTaskId) {
      const parentTask = tasks.find((t) => t.id === validDependsOnTaskId);
      if (parentTask && parentTask.status !== 'Done') {
        return res.status(400).json({
          success: false,
          message: `Task cannot be completed because its dependency "${parentTask.title}" is not completed (Current status: ${parentTask.status}).`,
        });
      }
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    const validStatuses = ['To Do', 'In Progress', 'Done'];

    const updatedTask = {
      ...existingTask,
      title: title.trim(),
      description: description !== undefined && typeof description === 'string' ? description.trim() : existingTask.description,
      priority: validPriorities.includes(priority) ? priority : existingTask.priority,
      status: validStatuses.includes(status) ? status : existingTask.status,
      assignedUserId,
      dependsOnTaskId: validDependsOnTaskId,
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: enrichTask(updatedTask),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task',
    });
  }
}

// Complete task
function completeTask(req, res) {
  try {
    const { id } = req.params;
    const loggedInUserId =
      req.body?.userId ||
      req.body?.loggedInUserId ||
      req.headers['x-user-id'] ||
      req.query?.userId;

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const task = tasks[taskIndex];

    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to complete tasks.',
      });
    }

    if (loggedInUserId !== task.assignedUserId) {
      const assignedUser = users.find((u) => u.id === task.assignedUserId);
      const assignedName = assignedUser ? assignedUser.name : 'the assigned user';
      return res.status(403).json({
        success: false,
        message: `Unauthorized: Only ${assignedName} can mark this task as Done.`,
      });
    }

    if (task.dependsOnTaskId) {
      const parentTask = tasks.find((t) => t.id === task.dependsOnTaskId);
      if (parentTask && parentTask.status !== 'Done') {
        return res.status(400).json({
          success: false,
          message: `Task cannot be completed because its dependency "${parentTask.title}" is not completed (Current status: ${parentTask.status}).`,
        });
      }
    }

    task.status = 'Done';
    task.updatedAt = new Date().toISOString();
    tasks[taskIndex] = task;

    return res.status(200).json({
      success: true,
      message: 'Task marked as completed.',
      data: enrichTask(task),
    });
  } catch (error) {
    console.error('Error completing task:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark task as completed',
    });
  }
}

// Delete task
function deleteTask(req, res) {
  try {
    const { id } = req.params;

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    tasks.forEach((t) => {
      if (t.dependsOnTaskId === id) {
        t.dependsOnTaskId = null;
        t.updatedAt = new Date().toISOString();
      }
    });

    const [deletedTask] = tasks.splice(taskIndex, 1);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully. Dependent tasks have been updated.',
      data: deletedTask,
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete task',
    });
  }
}

module.exports = {
  enrichTask,
  getAllTasks,
  getMyTasks,
  getBlockedTasks,
  getTaskById,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
};


