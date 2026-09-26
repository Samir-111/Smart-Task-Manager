const { users, tasks } = require('../data/mockData');

// Get all users with assigned task count
function getUsers(req, res) {
  try {
    const usersWithCount = users.map((user) => {
      const taskCount = tasks.filter((task) => task.assignedUserId === user.id).length;
      return {
        ...user,
        taskCount,
      };
    });

    return res.status(200).json({
      success: true,
      data: usersWithCount,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
}

// Create new user
function createUser(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid user name.',
      });
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for duplicate email
    const existingUser = users.find(
      (user) => user.email.toLowerCase() === normalizedEmail
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: {
        ...newUser,
        taskCount: 0,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user',
    });
  }
}

// Mock login
function loginUser(req, res) {
  try {
    const { userId, email } = req.body;

    if (!userId && !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a user ID or email to log in.',
      });
    }

    let user;

    if (userId) {
      user = users.find((u) => u.id === userId);
    } else if (email) {
      user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: user,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
}

module.exports = {
  getUsers,
  createUser,
  loginUser,
};


