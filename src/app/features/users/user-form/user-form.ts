import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user';
import { RegisterRequest } from '../../../core/models/auth';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  form: RegisterRequest = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
  };

  loading = false;
  error = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.userService.create(this.form).subscribe({
      next: (user) => this.router.navigate(['/users', user.id]),
      error: (err) => {
        this.error = err.error?.message || 'Failed to create user.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}