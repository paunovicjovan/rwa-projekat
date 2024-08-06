import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../../shared/models/paginated-response.interface';
import { Review } from '../models/review.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient) { }

  loadReviewsOfUser(username: string, page: number, limit: number) : Observable<PaginatedResponse<Review>> {
    const httpParams = new HttpParams({
      fromObject: { page, limit }
    });

    return this.http.get<PaginatedResponse<Review>>(`${environment.apiUrl}/reviews/${username}`, { params: httpParams });
  }
}
