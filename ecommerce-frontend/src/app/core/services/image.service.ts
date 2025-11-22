import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/Images`;

  constructor(private http: HttpClient) {}

  /**
   * Upload an image for a product
   * @param productId - The ID of the product
   * @param file - The image file to upload
   * @param isPrimary - Whether this is the primary image
   */
  uploadImage(productId: number, file: File, isPrimary: boolean = false): Observable<ProductImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId.toString());
    formData.append('isPrimary', isPrimary.toString());

    return this.http.post<ProductImage>(`${this.apiUrl}/upload`, formData);
  }

  /**
   * Get all images
   */
  getAllImages(): Observable<ProductImage[]> {
    return this.http.get<ProductImage[]>(this.apiUrl);
  }

  /**
   * Get an image by ID
   */
  getImageById(id: number): Observable<ProductImage> {
    return this.http.get<ProductImage>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all images for a specific product
   */
  getProductImages(productId: number): Observable<ProductImage[]> {
    return this.http.get<ProductImage[]>(`${this.apiUrl}/product/${productId}`);
  }

  /**
   * Delete an image
   */
  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
