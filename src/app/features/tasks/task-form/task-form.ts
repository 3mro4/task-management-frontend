import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user';
import { CreateTaskRequest, TaskPriority } from '../../../core/models/task';
import { Project } from '../../../core/models/project';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnInit {

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private userService = inject(UserService);

  projects: Project[] = [];
  users: User[] = [];

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: ['MEDIUM' as TaskPriority, Validators.required],
    dueDate: ['', Validators.required],
    projectId: ['', Validators.required],
    assigneeId: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadProjects();
    this.loadUsers();
  }

  loadProjects(): void {
    this.projectService.getAll(0, 100).subscribe({
      next: (res) => {
        this.projects = res.content;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

  loadUsers(): void {
    this.userService.getAll(0, 100).subscribe({
      next: (res) => {
        this.users = res.content;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const request: CreateTaskRequest = {
      title: this.form.value.title!,
      description: this.form.value.description!,
      priority: this.form.value.priority!,
      dueDate: this.form.value.dueDate!,
      projectId: this.form.value.projectId!,
      assigneeId: this.form.value.assigneeId!
    };

    this.taskService.create(request).subscribe({
      next: () => {
        this.successMessage = 'Task created successfully.';
        this.errorMessage = '';
        this.isLoading = false;
        this.form.reset({
          priority: 'MEDIUM'
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.errorMessage = 'Failed to create task.';
        this.successMessage = '';
        this.isLoading = false;
      }
    });
  }
}