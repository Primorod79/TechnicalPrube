import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ImageService } from '../../../core/services/image.service';
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
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private imageService: ImageService,
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
        this.categories = response;
      },
      error: (error) => {
        this.toastr.error('Error loading categories', 'Error');
      }
    });
  }

  loadProduct(id: number): void {
    this.productService.getById(id).subscribe({
      next: (response) => {
        const product = response;
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Please select a valid image file', 'Error');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.error('Image size must be less than 5MB', 'Error');
        return;
      }
      
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.productForm.patchValue({ imageUrl: '' });
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
      this.updateProduct(this.productId, formValue);
    } else {
      this.createProduct(formValue);
    }
  }

  private createProduct(formValue: any): void {
    const createRequest: CreateProductRequest = {
      name: formValue.name,
      description: formValue.description,
      price: formValue.price,
      stock: formValue.stock,
      categoryId: formValue.categoryId,
      imageUrl: formValue.imageUrl || undefined
    };

    this.productService.create(createRequest).subscribe({
      next: (product) => {
        // If image was selected, upload it
        if (this.selectedFile && product.id) {
          this.uploadProductImage(product.id);
        } else {
          this.toastr.success('Product created successfully', 'Success');
          this.router.navigate(['/products']);
        }
      },
      error: (error) => {
        this.toastr.error('Error creating product', 'Error');
        this.isSubmitting = false;
      }
    });
  }

  private updateProduct(productId: number, formValue: any): void {
    const updateRequest: UpdateProductRequest = {
      name: formValue.name,
      description: formValue.description,
      price: formValue.price,
      stock: formValue.stock,
      categoryId: formValue.categoryId,
      imageUrl: formValue.imageUrl || undefined
    };

    this.productService.update(productId, updateRequest).subscribe({
      next: (response) => {
        // If image was selected, upload it
        if (this.selectedFile) {
          this.uploadProductImage(productId);
        } else {
          this.toastr.success('Product updated successfully', 'Success');
          this.router.navigate(['/products']);
        }
      },
      error: (error) => {
        this.toastr.error('Error updating product', 'Error');
        this.isSubmitting = false;
      }
    });
  }

  private uploadProductImage(productId: number): void {
    if (!this.selectedFile) return;

    this.imageService.uploadImage(productId, this.selectedFile, true).subscribe({
      next: (response) => {
        this.toastr.success(`Product ${this.isEditMode ? 'updated' : 'created'} with image successfully`, 'Success');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.toastr.warning(`Product ${this.isEditMode ? 'updated' : 'created'} but image upload failed`, 'Warning');
        this.router.navigate(['/products']);
      }
    });
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
