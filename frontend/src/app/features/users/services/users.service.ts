import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.interface';
import { environment } from '../../../../environments/environment.development';
import { UserRoles } from '../models/user-roles.enum';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUser(id: number) : Observable<User> {
    return this.http.get<User>(environment.apiUrl+`/users/${id}`);
  }

  filterUsers() : Observable<User[]> {
    const temp: User[] = [
      {
        id:1,
        email: 'test1',
        firstName: 'test1',
        lastName: 'test1',
        profileImage: null,
        role: UserRoles.USER,
        username: 'test1',
        dateCreated: new Date()
      },
      {
        id:2,
        email: 'test2',
        firstName: 'test2',
        lastName: 'test2',
        profileImage: null,
        role: UserRoles.USER,
        username: 'test2',
        dateCreated: new Date()
      }
    ]
    return of(temp);
  }
}
