export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
} //

export interface ProjectDto {
  id: string;
  name: string;
  description: string;
  createdAt: string;
} 

export interface ProjectDetailsDto {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  currentMembers: string[];
  tasksByPriority: { [key: string]: number };
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}
