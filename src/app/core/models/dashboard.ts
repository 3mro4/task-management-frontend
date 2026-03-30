export interface DashboardSummary {
  totalTasks: number;
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  tasksByProject: Record<string, number>;
  tasksByUser: Record<string, number>;
}