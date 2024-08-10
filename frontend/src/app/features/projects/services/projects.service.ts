import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProjectDto } from '../models/create-project-dto.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Project } from '../models/project.interface';

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
}
