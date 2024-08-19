import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CreateTagDto } from '../models/create-tag-dto.interface';
import { UpdateTagDto } from '../models/update-tag-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private http: HttpClient) { }

  create(tag: CreateTagDto): Observable<Tag> {
    return this.http.post<Tag>(`${environment.apiUrl}/tags`, tag);
  }

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

  updateTag(updateTagDto: UpdateTagDto): Observable<Tag> {
    return this.http.put<Tag>(`${environment.apiUrl}/tags/${updateTagDto.id}`, updateTagDto);
  }

  deleteTag(tagId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/tags/${tagId}`);
  }
}
