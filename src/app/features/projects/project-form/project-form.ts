import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { CreateProjectRequest } from '../../../core/models/project';
import { AlertService } from '../../../shared/services/alert';

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css'
})
export class ProjectForm {

  loading = false;
  error = '';
  form: any;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const request: CreateProjectRequest = {
      name: this.form.value.name!,
      description: this.form.value.description!
    };

    this.projectService.create(request).subscribe({
      next: (project) => {
        this.alertService.added('Project').then(() => {
          this.router.navigate(['/projects', project.id]);
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create project.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}