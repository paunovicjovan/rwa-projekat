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
}
