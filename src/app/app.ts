import { Component, signal, inject } from '@angular/core';
import { filter } from 'rxjs';  
import { CommonModule } from '@angular/common'; 
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  showNavbar = true;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateNavbarVisibility();
    });
    this.updateNavbarVisibility();
  }

  private updateNavbarVisibility(): void {
    const currentUrl = this.router.url;
    this.showNavbar = !['/login', '/register'].includes(currentUrl);
  }
  protected readonly title = signal('task-management-frontend');
}
