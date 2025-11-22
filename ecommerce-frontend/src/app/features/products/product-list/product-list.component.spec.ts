import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserRole } from '../../../models';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getAll', 'delete']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getAll']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], { isAdmin: false });
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    const mockProducts = {
      items: [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          price: 99.99,
          stock: 10,
          categoryId: 1,
          category: { id: 1, name: 'Category 1', description: 'Desc', createdAt: new Date() },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 12,
      totalPages: 1
    };

    const mockCategories = [
      { id: 1, name: 'Category 1', description: 'Desc', createdAt: new Date() }
    ];

    productService.getAll.and.returnValue(of(mockProducts));
    categoryService.getAll.and.returnValue(of(mockCategories));

    component.ngOnInit();

    expect(productService.getAll).toHaveBeenCalled();
    expect(categoryService.getAll).toHaveBeenCalled();
    expect(component.products.length).toBe(1);
    expect(component.categories.length).toBe(1);
    expect(component.loading).toBe(false);
  });

  it('should handle search', () => {
    const mockProducts = {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 12,
      totalPages: 0
    };

    productService.getAll.and.returnValue(of(mockProducts));
    categoryService.getAll.and.returnValue(of([]));

    component.searchTerm = 'laptop';
    component.onSearch();

    expect(productService.getAll).toHaveBeenCalledWith(
      1,
      12,
      'laptop',
      undefined,
      undefined,
      undefined
    );
  });

  it('should delete product successfully', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    productService.delete.and.returnValue(of(undefined));
    productService.getAll.and.returnValue(of({
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 12,
      totalPages: 0
    }));
    categoryService.getAll.and.returnValue(of([]));

    component.deleteProduct(1);

    expect(productService.delete).toHaveBeenCalledWith(1);
    expect(toastr.success).toHaveBeenCalledWith('Product deleted successfully', 'Success');
    expect(productService.getAll).toHaveBeenCalled();
  });

  it('should not delete if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteProduct(1);

    expect(productService.delete).not.toHaveBeenCalled();
  });

  it('should handle pagination', () => {
    const mockProducts = {
      items: [],
      totalCount: 25,
      pageNumber: 2,
      pageSize: 12,
      totalPages: 3
    };

    productService.getAll.and.returnValue(of(mockProducts));
    categoryService.getAll.and.returnValue(of([]));

    component.onPageChange(2);

    expect(component.currentPage).toBe(2);
    expect(productService.getAll).toHaveBeenCalledWith(
      2,
      12,
      undefined,
      undefined,
      undefined,
      undefined
    );
  });

  it('should clear filters', () => {
    const mockProducts = {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 12,
      totalPages: 0
    };

    productService.getAll.and.returnValue(of(mockProducts));
    categoryService.getAll.and.returnValue(of([]));

    component.searchTerm = 'test';
    component.selectedCategoryId = 1;

    component.clearFilters();

    expect(component.searchTerm).toBe('');
    expect(component.selectedCategoryId).toBeUndefined();
    expect(productService.getAll).toHaveBeenCalled();
  });
});
