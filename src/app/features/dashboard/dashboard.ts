import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard';
import { AuthService } from '../../core/services/auth';
import { DashboardSummary } from '../../core/models/dashboard';
import { BaseChartDirective } from 'ng2-charts';import { ChartData, ChartOptions, Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  summary: DashboardSummary | null = null;
  loading = true;
  error = '';
  firstName = '';
  today = new Date();

  byStatusEntries: { key: string; value: number }[] = [];
  byProjectEntries: { key: string; value: number }[] = [];
  byUserEntries: { key: string; value: number }[] = [];

  priorityChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#dc3545', '#fd7e14', '#198754'],
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  priorityChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: '#f0f0f0' }
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.firstName = this.authService.getFirstName();
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;

        const statusOrder = ['TODO', 'IN_PROGRESS', 'DONE'];
        this.byStatusEntries = statusOrder
          .filter(s => data.tasksByStatus[s] !== undefined)
          .map(key => ({ key, value: data.tasksByStatus[key] }));

        const priorityOrder = ['HIGH', 'MEDIUM', 'LOW'];
        const orderedPriority = priorityOrder.map(key => ({
          key,
          value: data.tasksByPriority[key] ?? 0
        }));

        this.priorityChartData = {
          labels: orderedPriority.map(p => p.key),
          datasets: [{
            data: orderedPriority.map(p => p.value),
            backgroundColor: ['#dc3545', '#fd7e14', '#198754'],
            borderRadius: 6,
            borderSkipped: false,
          }]
        };

this.byProjectEntries = this.toEntries(data.tasksByProject)
  .sort((a, b) => b.value - a.value);
this.byUserEntries = this.toEntries(data.tasksByUser)
  .sort((a, b) => b.value - a.value);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load dashboard data.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  toEntries(obj: Record<string, number>): { key: string; value: number }[] {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      TODO: '#6c757d',
      IN_PROGRESS: '#0d6efd',
      DONE: '#198754',
    };
    return map[status] ?? '#555';
  }

  projectPage = 0;
projectPageSize = 8;
userPage = 0;
userPageSize = 8;

get pagedProjectEntries() {
  const start = this.projectPage * this.projectPageSize;
  return this.byProjectEntries.slice(start, start + this.projectPageSize);
}

get projectTotalPages() {
  return Math.ceil(this.byProjectEntries.length / this.projectPageSize);
}

get pagedUserEntries() {
  const start = this.userPage * this.userPageSize;
  return this.byUserEntries.slice(start, start + this.userPageSize);
}

get userTotalPages() {
  return Math.ceil(this.byUserEntries.length / this.userPageSize);
}
}