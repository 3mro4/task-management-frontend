import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  users: User[] = [];
  loading = true;
  error = '';
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.users = res.content;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load users.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  viewUser(id: string): void {
    this.router.navigate(['/users', id]);
  }

  deleteUser(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => {
          alert(err.error?.message || 'Failed to delete user.');
        },
      });
    }
  }

  getFullName(user: User): string {
    return [user.firstName, user.middleName, user.lastName]
      .filter(Boolean)
      .join(' ');
  }
}