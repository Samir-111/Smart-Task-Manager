let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://smart-task-manager-9v4z.onrender.com/api';
if (!rawApiUrl.endsWith('/api')) {
  rawApiUrl = rawApiUrl.replace(/\/+$/, '') + '/api';
}
const API_BASE_URL = rawApiUrl;

// Base request helper
async function request(endpoint, options = {}) {
  try {
    let headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('smart_task_manager_user');
        if (stored) {
          const u = JSON.parse(stored);
          if (u && u.id) {
            headers['x-user-id'] = u.id;
          }
        }
      } catch (e) {
        // ignore storage parse error
      }
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Request failed with status ${res.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return {
      success: false,
      message: error.message || 'Unable to connect to the backend server.',
    };
  }
}

// User API
export async function getUsers() {
  return request('/users');
}

export async function createUser(name, email) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify({ name, email }),
  });
}

export async function loginUser(credentials) {
  return request('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

// Task API
export async function getTasks(filters) {
  let query = '';
  if (filters) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    const queryString = params.toString();
    if (queryString) query = `?${queryString}`;
  }
  return request(`/tasks${query}`);
}

export async function getMyTasks(userId) {
  return request(`/tasks/my/${userId}`);
}

export async function getBlockedTasks() {
  return request('/tasks/blocked');
}

export async function getTaskById(id) {
  return request(`/tasks/${id}`);
}

export async function createTask(taskData) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

export async function updateTask(id, taskData) {
  return request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
}

export async function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

export async function completeTask(id, userId) {
  const body = {};
  if (userId) {
    body.userId = userId;
  }
  return request(`/tasks/${id}/complete`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}


