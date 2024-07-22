import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.interface';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest) : Observable<LoginResponse> {
    return this.http.post<LoginResponse>(environment.apiUrl+'/auth/login', credentials);
  }
}
