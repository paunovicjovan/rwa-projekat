import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../../shared/models/paginated-response.interface';
import { Review } from '../models/review.interface';
import { environment } from '../../../../environments/environment.development';
import { CreateReviewDto } from '../models/create-review-dto.interface';
import { UpdateReviewDto } from '../models/update-review-dto.interface';

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

  create(reviewDto: CreateReviewDto): Observable<Review> {
    const requestBody = {
      rating: reviewDto.rating,
      content: reviewDto.content
    }
    return this.http.post<Review>(`${environment.apiUrl}/reviews/${reviewDto.revieweeUsername}`, requestBody);
  }

  update(reviewDto: UpdateReviewDto): Observable<Review> {
    const requestBody = {
      rating: reviewDto.rating,
      content: reviewDto.content
    }
    return this.http.put<Review>(`${environment.apiUrl}/reviews/${reviewDto.id}`, requestBody);
  }
}
