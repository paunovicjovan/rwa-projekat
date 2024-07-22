import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.interface';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response.interface';

const API_URL = 'http://localhost:3000/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest) : Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_URL+'/login', credentials);
  }
}
