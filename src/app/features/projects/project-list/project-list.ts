import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectDto } from '../../../core/models/project';

@Component({
  selector: 'app-project-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectList implements OnInit {

  projects: ProjectDto[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  isLoading = false;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getAll(this.page, this.size).subscribe({
      next: (res) => {
        this.projects = res.content;
        this.totalPages = res.totalPages;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewProject(id: string): void {
    this.router.navigate(['/projects', id]);
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) { this.page++; this.loadProjects(); }
  }

  prevPage(): void {
    if (this.page > 0) { this.page--; this.loadProjects(); }
  }
}