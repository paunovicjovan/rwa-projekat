import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private http: HttpClient) { }

  searchTags(name: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiUrl}/tags?name=${name}`);
  }

  addTagToUser(tagId: number): Observable<Tag> {
    return this.http.post<Tag>(`${environment.apiUrl}/tags/add-tag-to-user/${tagId}`, {});
  }

  removeTagFromUser(tagId: number): Observable<Tag> {
    return this.http.delete<Tag>(`${environment.apiUrl}/tags/remove-tag-from-user/${tagId}`);
  }

  addTagToProject(projectId: number, tagId: number): Observable<Tag> {
    return this.http.post<Tag>(`${environment.apiUrl}/tags/add-tag-to-project/${tagId}/${projectId}`, {});
  }

  removeTagFromProject(projectId: number, tagId: number): Observable<Tag> {
    return this.http.delete<Tag>(`${environment.apiUrl}/tags/remove-tag-from-project/${tagId}/${projectId}`);
  }
}
