import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  firstName = '';
  email = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.firstName = this.authService.getFirstName();
    this.email = this.authService.getEmail();
  }

  getInitials(): string {
    return this.firstName ? this.firstName[0].toUpperCase() : '?';
  }

  logout(): void {
    this.authService.logout();
  }
}