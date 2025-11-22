import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  PaginatedProducts
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getAll(page: number = 1, pageSize: number = 10, searchTerm?: string, categoryId?: number): Observable<PaginatedProducts> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => response.data || response)
    );
  }

  getById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data || response)
    );
  }

  getByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<any>(`${this.apiUrl}/category/${categoryId}`).pipe(
      map(response => response.data || response)
    );
  }

  create(product: CreateProductRequest): Observable<Product> {
    return this.http.post<any>(this.apiUrl, product).pipe(
      map(response => response.data || response)
    );
  }

  update(id: number, product: UpdateProductRequest): Observable<Product> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product).pipe(
      map(response => response.data || response)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
