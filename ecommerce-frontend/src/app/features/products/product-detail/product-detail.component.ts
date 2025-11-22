import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  isLoading = true;
  isAdmin = false;
  isDeleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadProduct(id);
      } else {
        this.toastr.error('Invalid product ID', 'Error');
        this.router.navigate(['/products']);
      }
    });
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getById(id).subscribe({
      next: (response) => {
        this.product = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Error loading product', 'Error');
        this.isLoading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  deleteProduct(): void {
    if (!this.product || !confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.isDeleting = true;
    this.productService.delete(this.product.id).subscribe({
      next: () => {
        this.toastr.success('Product deleted successfully', 'Success');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.toastr.error('Error deleting product', 'Error');
        this.isDeleting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
