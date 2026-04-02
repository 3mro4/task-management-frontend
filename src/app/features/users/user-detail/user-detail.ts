import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user';
import { User, UpdateUserRequest } from '../../../core/models/user';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
})
export class UserDetail implements OnInit {
  user: User | null = null;
  loading = true;
  saving = false;
  editing = false;
  error = '';
  saveError = '';

  form: UpdateUserRequest = {
    firstName: '',
    middleName: '',
    lastName: '',
    password: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.form = {
          firstName: user.firstName,
          middleName: user.middleName ?? '',
          lastName: user.lastName,
          password: '',
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'User not found.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  save(): void {
    if (!this.user) return;
    this.saving = true;
    this.saveError = '';

    this.userService.update(this.user.id, this.form).subscribe({
      next: (updated) => {
        this.user = updated;
        this.editing = false;
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saveError = err.error?.message || 'Failed to update user.';
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }

  getFullName(): string {
    if (!this.user) return '';
    return [this.user.firstName, this.user.middleName, this.user.lastName]
      .filter(Boolean)
      .join(' ');
  }

  getInitials(): string {
    if (!this.user) return '?';
    return (this.user.firstName[0] + this.user.lastName[0]).toUpperCase();
  }
}