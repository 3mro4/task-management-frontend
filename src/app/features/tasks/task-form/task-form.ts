import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user';
import { CreateTaskRequest, TaskPriority } from '../../../core/models/task';
import { ProjectDto } from '../../../core/models/project';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnInit {

  projects: ProjectDto[] = [];
users: User[] = [];
loading = false;
error = '';
priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
form: any;

constructor(
  private fb: FormBuilder,
  private taskService: TaskService,
  private projectService: ProjectService,
  private userService: UserService,
  private router: Router,
  private cdr: ChangeDetectorRef
) {
  this.form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: ['MEDIUM' as TaskPriority, Validators.required],
    dueDate: ['', Validators.required],
    projectId: ['', Validators.required],
    assigneeId: ['', Validators.required]
  });
}


  ngOnInit(): void {
    this.projectService.getAll(0, 100).subscribe({
      next: (res) => { this.projects = res.content; this.cdr.detectChanges(); }
    });
    this.userService.getAll(0, 100).subscribe({
      next: (res) => { this.users = res.content; this.cdr.detectChanges(); }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const request: CreateTaskRequest = {
      title: this.form.value.title!,
      description: this.form.value.description!,
      priority: this.form.value.priority!,
      dueDate: this.form.value.dueDate!,
      projectId: this.form.value.projectId!,
      assigneeId: this.form.value.assigneeId!
    };

    this.taskService.create(request).subscribe({
      next: (task) => this.router.navigate(['/tasks', task.id]),
      error: (err) => {
        this.error = err.error?.message || 'Failed to create task.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}