import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem('token');
  }

  public get isAuthenticated(): boolean {
    return !!this.token && !!this.currentUserValue;
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === 'Admin';
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          
          // Handle the actual backend response structure
          if (response.success && response.data && response.data.token) {
            const token = response.data.token;
            
            // Decode JWT to get user info
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              console.log('JWT payload:', payload);
              
              // Create user object from JWT payload
              const user: User = {
                id: parseInt(payload.nameid) || 0,
                email: payload.email || '',
                username: payload.unique_name || payload.email || '',
                role: payload.role || 'User'
              };
              
              localStorage.setItem('token', token);
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
              
              console.log('User set:', user);
              console.log('Token stored:', !!localStorage.getItem('token'));
            } catch (error) {
              console.error('Error decoding JWT:', error);
            }
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.data && response.data.token) {
            const token = response.data.token;
            
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const user: User = {
                id: parseInt(payload.nameid) || 0,
                email: payload.email || '',
                username: payload.unique_name || payload.email || '',
                role: payload.role || 'User'
              };
              
              localStorage.setItem('token', token);
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
            } catch (error) {
              console.error('Error decoding JWT:', error);
            }
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`);
  }
}
