import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateTaskRequest,
  TaskDto,
  UpdateTaskRequest
} from '../models/task';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/page-response';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
private readonly baseUrl = `${environment.apiUrl}/tasks`;

getAll(page: number = 0, size: number = 10): Observable<PageResponse<TaskDto>> {
  return this.http.get<PageResponse<TaskDto>>(`${this.baseUrl}?page=${page}&size=${size}`);
}

  getById(id: string): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateTaskRequest): Observable<TaskDto> {
    return this.http.post<TaskDto>(this.baseUrl, request);
  }

  update(id: string, request: UpdateTaskRequest): Observable<TaskDto> {
    return this.http.put<TaskDto>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}