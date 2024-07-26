import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.interface';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth-response.interface';
import { environment } from '../../../../environments/environment.development';
import { RegisterRequest } from '../models/register-request.interface';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthState } from '../models/auth-state.interface';
import { Features } from '../../features.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService, 
              private jwtService: JwtHelperService
  ) { }

  login(credentials: LoginRequest) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials);
  }

  register(registerData: RegisterRequest) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, registerData);
  }

  hasValidJwt(): boolean {
    const authState: AuthState = this.localStorageService.get(Features.Auth) as AuthState;
    return !this.jwtService.isTokenExpired(authState.token);
  }
}
