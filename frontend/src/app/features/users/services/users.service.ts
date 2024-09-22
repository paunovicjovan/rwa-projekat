import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable, of } from 'rxjs';
import { User } from '../models/user.interface';
import { environment } from '../../../../environments/environment.development';
import { UserRoles } from '../models/user-roles.enum';
import { PaginatedResponse } from '../../../shared/models/paginated-response.interface';
import { FilterUsersRequest } from '../models/filter-users-request.interface';
import { PaginationOptions } from '../../../shared/models/pagination-options.interface';
import { UpdateUserDto } from '../models/update-user-dto.interface';
import { PersonalityScore } from '../models/personality-score.interface';
import { CreatePersonalityScoreDto } from '../models/create-personality-score-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUser(username: string) : Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${username}`);
  }

  filterUsers(filterData: FilterUsersRequest) : Observable<PaginatedResponse<User>> {
    const httpParams = new HttpParams({
      fromObject: { ...filterData }
    });

    return this.http.get<PaginatedResponse<User>>(`${environment.apiUrl}/users`, {params: httpParams});
  }

  changeUserRole(userId: number, newRole: UserRoles): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/role/${userId}`, { role: newRole });
  }

  updateUserData(userData: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/${userData.id}`, userData);
  }

  deleteOne(userId: number) : Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/users/${userId}`);
  }

  changeUserProfileImage(newImage: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', newImage);
    return this.http.post<User>(`${environment.apiUrl}/users/upload-profile-image`, formData)
  }

  loadAppliedUsersForProject(projectId: number, paginationOptions: PaginationOptions): Observable<PaginatedResponse<User>> {
    const httpParams = new HttpParams(
      {
        fromObject: { ...paginationOptions }
      }
    )
    return this.http.get<PaginatedResponse<User>>(`${environment.apiUrl}/users/applied-to/${projectId}`, {params: httpParams});
  }

  loadAcceptedUsersForProject(projectId: number, paginationOptions: PaginationOptions): Observable<PaginatedResponse<User>> {
    const httpParams = new HttpParams(
      {
        fromObject: { ...paginationOptions }
      }
    )
    return this.http.get<PaginatedResponse<User>>(`${environment.apiUrl}/users/accepted-in/${projectId}`, {params: httpParams});
  }

  applyForProject(projectId: number): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users/enroll-user-in-project/${projectId}`, {});
  }

  unenrollUserFromProject(projectId: number, userId: number): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users/unenroll-user/${projectId}/${userId}`, {});
  }

  acceptUserInProject(projectId: number, userId: number): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users/accept-user-in-project/${projectId}/${userId}`, {});
  }

  loadPersonalityScore(): Observable<PersonalityScore> {
    return this.http.get<PersonalityScore>(`${environment.apiUrl}/personality-score`);
  }

  savePersonalityScore(personalityScore: CreatePersonalityScoreDto): Observable<PersonalityScore> {
    return this.http.put<PersonalityScore>(`${environment.apiUrl}/personality-score`, personalityScore);
  }

  searchSuggestedUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users/find-similar-users`);
  }

  searchUsersByTags(options: PaginationOptions, tagsIds: number[]): Observable<PaginatedResponse<User>> {
    const tagsIdsSerialized = tagsIds.join(',');
    const httpParams = new HttpParams({
      fromObject: {
        ...options,
        tagsIdsSerialized
      }
    })
    return this.http.get<PaginatedResponse<User>>(`${environment.apiUrl}/users/search-by-tags`, {params: httpParams});
  }

  loadSuggestedCollaborators(projectId: number): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users/find-suggested-collaborators/${projectId}`);
  }

  loadInvitedUsers(projectId: number, options: PaginationOptions): Observable<PaginatedResponse<User>> {
    const httpParams = new HttpParams(
      {
        fromObject: { ...options }
      }
    )
    return this.http.get<PaginatedResponse<User>>(`${environment.apiUrl}/users/find-invited-users/${projectId}`, {params: httpParams});
  }

  inviteUserToProject(projectId: number, userId: number): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users/invite-user-to-project/${projectId}/${userId}`, {});
  }

  cancelProjectInvitation(projectId: number, userId: number): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users/cancel-project-invitation/${projectId}/${userId}`, {});
  }
}
