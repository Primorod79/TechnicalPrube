import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from '../../../environments/environment';
import { Product, PaginatedProducts, CreateProductRequest, UpdateProductRequest, UserRole } from '../../models';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should retrieve paginated products', () => {
      const mockResponse: PaginatedProducts = {
        items: [
          {
            id: 1,
            name: 'Product 1',
            description: 'Description 1',
            price: 99.99,
            stock: 10,
            categoryId: 1,
            category: { id: 1, name: 'Category 1', description: 'Desc 1', createdAt: new Date() },
            imageUrl: 'http://example.com/image.jpg',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1
      };

      service.getAll(1, 10).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.items.length).toBe(1);
        expect(response.items[0].name).toBe('Product 1');
      });

      const req = httpMock.expectOne(request => request.url.includes(apiUrl));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('pageNumber')).toBe('1');
      expect(req.request.params.get('pageSize')).toBe('10');
      req.flush(mockResponse);
    });

    it('should include search and filter parameters', () => {
      const mockResponse: PaginatedProducts = {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0
      };

      service.getAll(1, 10, 'laptop', 1, 100, 1000).subscribe();

      const req = httpMock.expectOne(request => request.url.includes(apiUrl));
      expect(req.request.params.get('search')).toBe('laptop');
      expect(req.request.params.get('categoryId')).toBe('1');
      expect(req.request.params.get('minPrice')).toBe('100');
      expect(req.request.params.get('maxPrice')).toBe('1000');
      req.flush(mockResponse);
    });
  });

  describe('getById', () => {
    it('should retrieve a product by id', () => {
      const mockProduct: Product = {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 99.99,
        stock: 10,
        categoryId: 1,
        category: { id: 1, name: 'Category 1', description: 'Desc 1', createdAt: new Date() },
        imageUrl: 'http://example.com/image.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.getById(1).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('create', () => {
    it('should create a new product', () => {
      const createRequest: CreateProductRequest = {
        name: 'New Product',
        description: 'New Description',
        price: 199.99,
        stock: 5,
        categoryId: 1,
        imageUrl: 'http://example.com/new.jpg'
      };

      const mockProduct: Product = {
        id: 2,
        ...createRequest,
        category: { id: 1, name: 'Category 1', description: 'Desc 1', createdAt: new Date() },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.create(createRequest).subscribe(product => {
        expect(product).toEqual(mockProduct);
        expect(product.name).toBe('New Product');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(mockProduct);
    });
  });

  describe('update', () => {
    it('should update an existing product', () => {
      const updateRequest: UpdateProductRequest = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 299.99,
        stock: 15,
        categoryId: 1
      };

      const mockProduct: Product = {
        id: 1,
        ...updateRequest,
        category: { id: 1, name: 'Category 1', description: 'Desc 1', createdAt: new Date() },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.update(1, updateRequest).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateRequest);
      req.flush(mockProduct);
    });
  });

  describe('delete', () => {
    it('should delete a product', () => {
      service.delete(1).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
