import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { TaskDto } from '../../../core/models/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {

  private taskService = inject(TaskService);

  tasks: TaskDto[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  isLoading = false;
  errorMessage = '';

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
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load tasks.';
        this.isLoading = false;
      }
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadTasks();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadTasks();
    }
  }
}