import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product, Category } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories.slice(0, 4); // Top 4 categories
      },
      error: (error) => console.error('Error loading categories', error)
    });
  }

  loadFeaturedProducts(): void {
    this.productService.getAll(1, 8).subscribe({
      next: (response) => {
        this.featuredProducts = response.items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.loading = false;
      }
    });
  }
}
