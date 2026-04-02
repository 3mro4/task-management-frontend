import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectDetailsDto } from '../../../core/models/project';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.css']
})
export class ProjectDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);

  project: ProjectDetailsDto | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadProject(id);
    } else {
      this.errorMessage = 'Project id is missing.';
    }
  }

  loadProject(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.projectService.getById(id).subscribe({
      next: (res: ProjectDetailsDto) => {
        this.project = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load project details.';
        this.isLoading = false;
      }
    });
  }

  getPriorityEntries(): { key: string; value: number }[] {
    if (!this.project?.tasksByPriority) return [];
    return Object.entries(this.project.tasksByPriority).map(([key, value]) => ({ key, value }));
  }
}