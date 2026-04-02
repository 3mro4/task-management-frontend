import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { CreateProjectRequest } from '../../../core/models/project';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.html',
  styleUrls: ['./project-form.css']
})
export class ProjectForm {

  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);

  successMessage = '';
  errorMessage = '';

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: CreateProjectRequest = {
      name: this.form.value.name!,
      description: this.form.value.description!
    };

    this.projectService.create(request).subscribe({
      next: () => {
        this.successMessage = 'Project created successfully.';
        this.errorMessage = '';
        this.form.reset();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to create project.';
        this.successMessage = '';
      }
    });
  }
}
