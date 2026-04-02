import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectDetailsDto } from '../../../core/models/project';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css'
})
export class ProjectDetail implements OnInit {

  project: ProjectDetailsDto | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

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
    this.projectService.getById(id).subscribe({
      next: (res) => {
        this.project = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load project details.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getPriorityEntries(): { key: string; value: number }[] {
    if (!this.project?.tasksByPriority) return [];
    return Object.entries(this.project.tasksByPriority)
      .map(([key, value]) => ({ key, value }));
  }

  getPriorityColor(priority: string): string {
    const map: Record<string, string> = {
      LOW: '#198754', MEDIUM: '#fd7e14', HIGH: '#dc3545'
    };
    return map[priority] ?? '#6c757d';
  }
}