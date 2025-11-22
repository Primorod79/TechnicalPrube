import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  constructor(private readonly http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.data || response)
    );
  }

  getById(id: number): Observable<Category> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data || response)
    );
  }

  create(category: CreateCategoryRequest): Observable<Category> {
    return this.http.post<any>(this.apiUrl, category).pipe(
      map(response => response.data || response)
    );
  }

  update(id: number, category: UpdateCategoryRequest): Observable<Category> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, category).pipe(
      map(response => response.data || response)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
