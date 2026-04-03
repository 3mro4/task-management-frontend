import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: User | null = null;
  loading = true;
  error = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

ngOnInit(): void {
  const userId = this.authService.getUserId();
  this.userService.getById(userId).subscribe({
    next: (user) => {
      this.user = user;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.error = 'Failed to load profile.';
      this.loading = false;
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