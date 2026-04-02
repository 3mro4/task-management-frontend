import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { TaskDto } from '../../../core/models/task';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterLink],
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

  constructor(
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.getAll(this.page, this.size).subscribe({
      next: (res) => {
        this.tasks = res.content;
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
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.delete(id).subscribe({
        next: () => this.loadTasks(),
        error: (err) => alert(err.error?.message || 'Failed to delete task.')
      });
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) { this.page++; this.loadTasks(); }
  }

  prevPage(): void {
    if (this.page > 0) { this.page--; this.loadTasks(); }
  }

  getPriorityClass(priority: string): string {
    const map: Record<string, string> = {
      LOW: 'bg-success', MEDIUM: 'bg-warning text-dark', HIGH: 'bg-danger'
    };
    return map[priority] ?? 'bg-secondary';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      TODO: 'bg-secondary', IN_PROGRESS: 'bg-primary', DONE: 'bg-success'
    };
    return map[status] ?? 'bg-secondary';
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ');
  }
}