import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient, private router: Router) {}

 login(request: LoginRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
    tap({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('email', res.email);
        localStorage.setItem('firstName', res.firstName);
      }
    })
  );
}

register(request: RegisterRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request).pipe(
    tap({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('email', res.email);
        localStorage.setItem('firstName', res.firstName);
      }
    })
  );
}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getFirstName(): string {
    return localStorage.getItem('firstName') ?? '';
  }

  getEmail(): string {
    return localStorage.getItem('email') ?? '';
  }

  getUserId(): string {
    return localStorage.getItem('userId') ?? '';
  }
}