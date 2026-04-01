import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectDto } from '../../../core/models/project';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectList implements OnInit {

  private projectService = inject(ProjectService);

  projects: ProjectDto[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  isLoading = false;

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
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadProjects();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadProjects();
    }
  }
}