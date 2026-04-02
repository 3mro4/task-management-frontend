import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { TaskDto } from '../../../core/models/task';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css'
})
export class TaskDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  task: TaskDto | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadTask(id);
    } else {
      this.errorMessage = 'Task id is missing.';
    }
  }

  loadTask(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getById(id).subscribe({
      next: (res: TaskDto) => {
        this.task = res;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.errorMessage = 'Failed to load task details.';
        this.isLoading = false;
      }
    });
  }
}