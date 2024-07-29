import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable, of } from 'rxjs';
import { User } from '../models/user.interface';
import { environment } from '../../../../environments/environment.development';
import { UserRoles } from '../models/user-roles.enum';
import { PaginatedResponse } from '../../../shared/models/paginated-response.interface';
import { FilterUsersRequest } from '../models/filter-users-request.interface';

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

  deleteOne(userId: number) : Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/users/${userId}`);
  }
}
