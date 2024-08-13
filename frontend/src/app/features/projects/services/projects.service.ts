import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProjectDto } from '../models/create-project-dto.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Project } from '../models/project.interface';
import { FilterProjectsRequest } from '../models/filter-projects-request.interface';
import { ProjectsFilters } from '../models/projects-filters.interface';
import { PaginatedResponse } from '../../../shared/models/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private http: HttpClient) { }

  create(createProjectDto: CreateProjectDto, image?: File): Observable<Project> {
    const formData = new FormData();
    if(image) 
      formData.append('file', image);

    formData.append('projectDtoStringified', JSON.stringify(createProjectDto));
    return this.http.post<Project>(`${environment.apiUrl}/projects`, formData);
  }

  loadSuggestedProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/projects/suggested-projects`);
  }

  filterProjects(filterProjectsRequest: FilterProjectsRequest): Observable<PaginatedResponse<Project>> {
    const httpParams = new HttpParams({
      fromObject: {
        page: filterProjectsRequest.page,
        limit: filterProjectsRequest.limit
      }
    });

    const requestBody: ProjectsFilters = {
      ...filterProjectsRequest
    }

    return this.http.post<PaginatedResponse<Project>>(`${environment.apiUrl}/projects/filter-projects`, requestBody, {params: httpParams})
  }

  loadProject(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${environment.apiUrl}/projects/${projectId}`);
  }
}
