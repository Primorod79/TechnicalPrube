import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category, CreateProductRequest, UpdateProductRequest } from '../../../models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  productId?: number;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        this.toastr.error('Error loading categories', 'Error');
      }
    });
  }

  loadProduct(id: number): void {
    this.productService.getById(id).subscribe({
      next: (response) => {
        const product = response.data;
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
          imageUrl: product.imageUrl
        });
      },
      error: (error) => {
        this.toastr.error('Error loading product', 'Error');
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.productForm.value;

    if (this.isEditMode && this.productId) {
      const updateRequest: UpdateProductRequest = {
        name: formValue.name,
        description: formValue.description,
        price: formValue.price,
        stock: formValue.stock,
        categoryId: formValue.categoryId,
        imageUrl: formValue.imageUrl || undefined
      };

      this.productService.update(this.productId, updateRequest).subscribe({
        next: (response) => {
          this.toastr.success('Product updated successfully', 'Success');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.toastr.error('Error updating product', 'Error');
          this.isSubmitting = false;
        }
      });
    } else {
      const createRequest: CreateProductRequest = {
        name: formValue.name,
        description: formValue.description,
        price: formValue.price,
        stock: formValue.stock,
        categoryId: formValue.categoryId,
        imageUrl: formValue.imageUrl || undefined
      };

      this.productService.create(createRequest).subscribe({
        next: (response) => {
          this.toastr.success('Product created successfully', 'Success');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.toastr.error('Error creating product', 'Error');
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  // Helper for template validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    if (field?.hasError('min')) {
      const min = field.getError('min').min;
      return `Minimum value is ${min}`;
    }
    return '';
  }
}
