// In-memory data store for users and tasks
const users = [
  {
    id: 'user-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@smarttask.ai',
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    id: 'user-2',
    name: 'Priya Patil',
    email: 'priya.patil@smarttask.ai',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'user-3',
    name: 'Amit Joshi',
    email: 'amit.joshi@smarttask.ai',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },
];

const tasks = [
  {
    id: 'task-1',
    title: 'Design Login & Authentication UI',
    description: 'Create clean, intuitive mock authentication screens and navigation layout.',
    priority: 'High',
    status: 'Done',
    assignedUserId: 'user-1',
    dependsOnTaskId: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Build In-Memory Express REST APIs',
    description: 'Implement user and task endpoints with robust status and dependency validations.',
    priority: 'High',
    status: 'Done',
    assignedUserId: 'user-2',
    dependsOnTaskId: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Integrate Frontend with Task API',
    description: 'Connect Next.js client components to backend endpoints with loading and error states.',
    priority: 'Medium',
    status: 'In Progress',
    assignedUserId: 'user-1',
    dependsOnTaskId: 'task-2',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Run End-to-End System Tests',
    description: 'Verify task creation, dependency enforcement, and responsive UI across devices.',
    priority: 'High',
    status: 'To Do',
    assignedUserId: 'user-3',
    dependsOnTaskId: 'task-3',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Prepare Production Deployment',
    description: 'Finalize build scripts and documentation for project submission.',
    priority: 'Low',
    status: 'To Do',
    assignedUserId: 'user-2',
    dependsOnTaskId: 'task-4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

module.exports = {
  users,
  tasks,
};
