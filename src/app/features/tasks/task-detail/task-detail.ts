import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { TaskDto, UpdateTaskRequest, TaskPriority, TaskStatus } from '../../../core/models/task';
import { MunazmBadge } from '../../../shared/components/munazm-badge/munazm-badge';
import { AlertService } from '../../../shared/services/alert';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, FormsModule, RouterLink, MunazmBadge],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css'
})
export class TaskDetail implements OnInit {

  task: TaskDto | null = null;
  isLoading = false;
  saving = false;
  editing = false;
  errorMessage = '';
  saveError = '';

  priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
  statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

  form: UpdateTaskRequest = {
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '',
    assigneeId: ''
  };

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.taskService.getById(id).subscribe({
        next: (res) => {
          this.task = res;
          this.form = {
            description: res.description,
            priority: res.priority,
            status: res.status,
            dueDate: res.dueDate,
            assigneeId: res.assigneeId
          };
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Failed to load task details.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  save(): void {
    if (!this.task) return;
    this.saving = true;
    this.saveError = '';

    this.taskService.update(this.task.id, this.form).subscribe({
      next: (updated) => {
        this.task = updated;
        this.editing = false;
        this.saving = false;
        this.alertService.updated('Task');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saveError = err.error?.message || 'Failed to update task.';
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ');
  }
}