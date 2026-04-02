import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard';
import { AuthService } from '../../core/services/auth';
import { DashboardSummary } from '../../core/models/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
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
  byPriorityEntries: { key: string; value: number }[] = [];
  byProjectEntries: { key: string; value: number }[] = [];
  byUserEntries: { key: string; value: number }[] = [];

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
        this.byStatusEntries = this.toEntries(data.tasksByStatus);
        this.byPriorityEntries = this.toEntries(data.tasksByPriority);
        this.byProjectEntries = this.toEntries(data.tasksByProject);
        this.byUserEntries = this.toEntries(data.tasksByUser);
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

  getPriorityColor(priority: string): string {
    const map: Record<string, string> = {
      LOW: '#198754',
      MEDIUM: '#fd7e14',
      HIGH: '#dc3545',
    };
    return map[priority] ?? '#555';
  }
}