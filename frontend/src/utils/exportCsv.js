// CSV export utility for tasks
export function exportTasksToCsv(tasks, filename = 'smarttask_sprint_report.csv') {
  if (!tasks || tasks.length === 0) return;

  const headers = ['Task ID', 'Title', 'Priority', 'Status', 'Blocked', 'Assignee Name', 'Assignee Email', 'Prerequisite Task', 'Created Date'];
  
  const rows = tasks.map((t) => [
    t.id,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.priority || 'Medium',
    t.status || 'To Do',
    t.isBlocked ? 'Yes' : 'No',
    `"${(t.assignedUser?.name || 'Unassigned').replace(/"/g, '""')}"`,
    t.assignedUser?.email || '',
    `"${(t.dependsOnTask?.title || 'None').replace(/"/g, '""')}"`,
    t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
