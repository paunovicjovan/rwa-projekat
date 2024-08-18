import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProjectDto } from '../models/create-project-dto.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Project } from '../models/project.interface';
import { FilterProjectsRequest } from '../models/filter-projects-request.interface';
import { ProjectsFilters } from '../models/projects-filters.interface';
import { PaginatedResponse } from '../../../shared/models/paginated-response.interface';
import { UpdateProjectDto } from '../models/update-project-dto.interface';
import { PaginationParameters } from '../../../shared/models/pagination-parameters.interface';
import { ProjectStatus } from '../enums/project-status.enum';

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

  updateProject(updateProjectDto: UpdateProjectDto): Observable<Project> {
    return this.http.put<Project>(`${environment.apiUrl}/projects/${updateProjectDto.id}`, updateProjectDto);
  }

  findAppliedProjectsForUser(username: string, paginationOptions: PaginationParameters): Observable<PaginatedResponse<Project>> {
    const httpParams = new HttpParams({
      fromObject: {
        ...paginationOptions
      }
    });
    return this.http.get<PaginatedResponse<Project>>(`${environment.apiUrl}/projects/applied-by/${username}`, {params: httpParams})
  }

  findAcceptedProjectsForUser(username: string, isCompleted: boolean, paginationOptions: PaginationParameters): Observable<PaginatedResponse<Project>> {
    const httpParams = new HttpParams({
      fromObject: {
        ...paginationOptions
      }
    });
    return this.http.get<PaginatedResponse<Project>>(`${environment.apiUrl}/projects/accepted-user/${username}/${isCompleted}`, {params: httpParams})
  }

  findCreatedProjectsForUser(username: string, status: ProjectStatus, paginationOptions: PaginationParameters): Observable<PaginatedResponse<Project>> {
    const httpParams = new HttpParams({
      fromObject: {
        ...paginationOptions
      }
    });
    return this.http.get<PaginatedResponse<Project>>(`${environment.apiUrl}/projects/created-by/${username}/${status}`, {params: httpParams})
  }

  delete(projectId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/projects/${projectId}`);
  }
}
