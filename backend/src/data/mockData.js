// In-memory data store for users and tasks
const users = [
  {
    id: 'user-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    createdAt: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
  },
  {
    id: 'user-2',
    name: 'Priya Patil',
    email: 'priya.patil@gmail.com',
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
  {
    id: 'user-3',
    name: 'Amit Joshi',
    email: 'amit.joshi@gmail.com',
    createdAt: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
  },
  {
    id: 'user-4',
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@gmail.com',
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
  {
    id: 'user-5',
    name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@gmail.com',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: 'user-6',
    name: 'Neha Joshi',
    email: 'neha.joshi@gmail.com',
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
];

const tasks = [
  {
    id: 'task-1',
    title: 'Design Login & Authentication UI',
    description:
      'Create a simple and intuitive login flow with clean screens for sign in, sign up, and password recovery.',
    priority: 'High',
    status: 'Done',
    assignedUserId: 'user-1',
    dependsOnTaskId: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 9).toISOString(),
  },

  {
    id: 'task-2',
    title: 'Set Up Express REST APIs',
    description:
      'Create the basic backend APIs for users and tasks with proper validation and meaningful error responses.',
    priority: 'High',
    status: 'Done',
    assignedUserId: 'user-2',
    dependsOnTaskId: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 11).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
  },

  {
    id: 'task-3',
    title: 'Connect Frontend with Task API',
    description:
      'Connect the dashboard and task screens with the backend API and handle loading, success, and error states.',
    priority: 'High',
    status: 'In Progress',
    assignedUserId: 'user-1',
    dependsOnTaskId: 'task-2',
    createdAt: new Date(Date.now() - 3600000 * 24 * 9).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },

  {
    id: 'task-4',
    title: 'Build Dashboard Overview',
    description:
      'Create the main dashboard with task statistics, recent activity, priorities, and team workload information.',
    priority: 'Medium',
    status: 'Done',
    assignedUserId: 'user-3',
    dependsOnTaskId: 'task-1',
    createdAt: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },

  {
    id: 'task-5',
    title: 'Add Task Search and Filters',
    description:
      'Allow users to quickly find tasks using search, status, priority, and assignee filters.',
    priority: 'Medium',
    status: 'In Progress',
    assignedUserId: 'user-4',
    dependsOnTaskId: 'task-3',
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },

  {
    id: 'task-6',
    title: 'Implement Task Dependency Rules',
    description:
      'Prevent dependent tasks from being completed before their required parent tasks are finished.',
    priority: 'High',
    status: 'Done',
    assignedUserId: 'user-2',
    dependsOnTaskId: 'task-2',
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },

  {
    id: 'task-7',
    title: 'Create User Management Screen',
    description:
      'Build a clean team management page where administrators can view users and their assigned workload.',
    priority: 'Medium',
    status: 'Done',
    assignedUserId: 'user-6',
    dependsOnTaskId: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },

  {
    id: 'task-8',
    title: 'Improve Mobile Dashboard Layout',
    description:
      'Optimize the dashboard for smaller screens with compact cards, responsive task lists, and mobile navigation.',
    priority: 'High',
    status: 'In Progress',
    assignedUserId: 'user-5',
    dependsOnTaskId: 'task-4',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },

  {
    id: 'task-9',
    title: 'Add CSV Task Export',
    description:
      'Allow users to export the current task list as a CSV file for reporting and offline analysis.',
    priority: 'Low',
    status: 'To Do',
    assignedUserId: 'user-3',
    dependsOnTaskId: 'task-3',
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },

  {
    id: 'task-10',
    title: 'Add Live Activity Feed',
    description:
      'Show recent task updates such as assignments, status changes, completed tasks, and dependency updates.',
    priority: 'Medium',
    status: 'To Do',
    assignedUserId: 'user-4',
    dependsOnTaskId: 'task-3',
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },

  {
    id: 'task-11',
    title: 'Run End-to-End System Tests',
    description:
      'Test the complete task workflow including creation, assignment, dependencies, status changes, and API errors.',
    priority: 'High',
    status: 'To Do',
    assignedUserId: 'user-3',
    dependsOnTaskId: 'task-3',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },

  {
    id: 'task-12',
    title: 'Review Accessibility and UI Polish',
    description:
      'Check keyboard navigation, readable contrast, focus states, responsive layouts, and small visual details.',
    priority: 'Medium',
    status: 'To Do',
    assignedUserId: 'user-6',
    dependsOnTaskId: 'task-8',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },

  {
    id: 'task-13',
    title: 'Prepare Project Documentation',
    description:
      'Write setup instructions, API documentation, project structure details, and basic usage guidelines.',
    priority: 'Low',
    status: 'To Do',
    assignedUserId: 'user-5',
    dependsOnTaskId: 'task-11',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: 'task-14',
    title: 'Prepare Production Deployment',
    description:
      'Finalize the production build, environment configuration, deployment steps, and final project checklist.',
    priority: 'High',
    status: 'To Do',
    assignedUserId: 'user-2',
    dependsOnTaskId: 'task-11',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: 'task-15',
    title: 'Final Project Demo Preparation',
    description:
      'Prepare the final demonstration flow and verify that the main features work correctly before submission.',
    priority: 'Medium',
    status: 'To Do',
    assignedUserId: 'user-1',
    dependsOnTaskId: 'task-13',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

module.exports = {
  users,
  tasks,
};