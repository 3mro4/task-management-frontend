import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProjectRequest, ProjectDetailsDto, ProjectDto } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1/projects';

  getAll(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  getById(id: string): Observable<ProjectDetailsDto> {
    return this.http.get<ProjectDetailsDto>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateProjectRequest): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(this.baseUrl, request);
  }
}
