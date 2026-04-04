import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { TaskDto } from '../../../core/models/task';
import { MunazmBadge } from '../../../shared/components/munazm-badge/munazm-badge';
import { AlertService } from '../../../shared/services/alert';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterLink, MunazmBadge],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {

  tasks: TaskDto[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  isLoading = false;
  errorMessage = '';

  private priorityOrder: Record<string, number> = {
    HIGH: 0,
    MEDIUM: 1,
    LOW: 2
  };

  constructor(
    private taskService: TaskService,
    private router: Router,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.getAll(this.page, this.size).subscribe({
      next: (res) => {
        this.tasks = res.content.sort((a, b) =>
          (this.priorityOrder[a.priority] ?? 3) - (this.priorityOrder[b.priority] ?? 3)
        );
        this.totalPages = res.totalPages;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load tasks.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewTask(id: string): void {
    this.router.navigate(['/tasks', id]);
  }

  deleteTask(id: string, event: Event): void {
    event.stopPropagation();
    const task = this.tasks.find(t => t.id === id);
    const title = task ? task.title : 'Task';

    this.alertService.confirmDelete(title).then((result) => {
      if (result.isConfirmed) {
        this.taskService.delete(id).subscribe({
          next: () => {
            this.alertService.deleted(title);
            this.loadTasks();
          },
          error: (err) => this.alertService.error(err.error?.message || 'Failed to delete task.')
        });
      }
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) { this.page++; this.loadTasks(); }
  }

  prevPage(): void {
    if (this.page > 0) { this.page--; this.loadTasks(); }
  }
}