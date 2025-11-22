# E-Commerce Technical Test

Complete e-commerce system developed with **Angular 18** (Frontend), **.NET 8** (Backend API), and **PostgreSQL** (Database), deployed on **Railway**.

## 🚀 Technologies Used

### Frontend
- **Angular 18.2.11** - Web framework with standalone components
- **Bootstrap 5.3** - CSS framework for responsive design
- **Bootstrap Icons** - Icon library
- **ngx-toastr** - Toast notifications
- **RxJS** - Reactive programming

### Backend
- **.NET 8** - Web API
- **Entity Framework Core** - ORM
- **JWT Authentication** - Authentication system

### Database
- **PostgreSQL** - Relational database (Railway)

### DevOps
- **Docker** - Containerization
- **Railway** - Deployment platform
- **Nginx** - Web server for frontend
- **GitHub** - Version control

## 📦 Project Structure

```
PRUEBA/
├── ecommerce-frontend/          # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Services, guards, interceptors
│   │   │   ├── features/       # Feature components
│   │   │   │   ├── auth/       # Login, Register
│   │   │   │   ├── products/   # Product CRUD
│   │   │   │   └── home/       # Home page
│   │   │   ├── models/         # TypeScript interfaces
│   │   │   └── shared/         # Shared components
│   │   └── environments/       # Environment configuration
├── Dockerfile                   # Docker configuration
├── nginx.conf                   # Nginx configuration
└── railway.json                 # Railway configuration
```

## 🌐 Railway Deployment

### Production URLs
- **Frontend**: https://technicalprube-production.up.railway.app
- **API Backend**: https://technicalprubеapi-production.up.railway.app/api
- **Database**: PostgreSQL on Railway (port 29162)

### Railway Configuration

#### 1. PostgreSQL Database
A PostgreSQL service was created on Railway (credentials are configured as environment variables in Railway dashboard)

#### 2. Backend API (.NET 8)
1. Create new service in Railway
2. Connect with GitHub repository
3. Configure environment variables:
   - `ConnectionStrings__DefaultConnection`: PostgreSQL connection string
   - `JWT__SecretKey`: Secret key for tokens
   - `JWT__Issuer`: Token issuer
   - `JWT__Audience`: Token audience

#### 3. Frontend (Angular)
1. Create new service in Railway
2. Connect with the same repository
3. Railway automatically detects the `Dockerfile`
4. Configuration variables:
   - `PORT`: 8080 (required by Railway)
   - Build Command: `docker build`
   - Dockerfile Path: `Dockerfile` (project root)

### Deployment Features

**Multi-Stage Dockerfile:**
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY ecommerce-frontend/ .
RUN npm install
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist/ecommerce-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

**Nginx Configuration:**
- Port 8080 (Railway requirement)
- SPA routing with `try_files`
- Gzip compression enabled
- Cache for static assets

## 💻 Running Locally

### ⚠️ Important Limitation
**The project CANNOT run completely locally** because the PostgreSQL database is deployed on Railway and is only accessible from authorized services. For local development, you would need to:
- Create a local PostgreSQL instance
- Update backend connection strings
- Modify API URLs in `environment.development.ts`

### Prerequisites
- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **Angular CLI** 18.x
- **.NET SDK** 8.0
- **PostgreSQL** (for local backend)

### Frontend Installation

```bash
# Clone the repository
git clone https://github.com/Primorod79/TechnicalPrube.git
cd TechnicalPrube/ecommerce-frontend

# Install dependencies
npm install

# Run in development mode (will connect to Railway API)
ng serve

# The application will be available at http://localhost:4200
```

### Environment Variables

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api' // Local API (not functional without local DB)
};
```

**Production** (`src/environments/environment.production.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://technicalprubеapi-production.up.railway.app/api'
};
```

## 🧪 Running Unit Tests

The project includes **38 unit tests** using **Karma** and **Jasmine**.

### Run All Tests

```bash
cd ecommerce-frontend

# Run tests in watch mode
npm test

# Run tests once
npm run test -- --watch=false

# Run with coverage report
npm run test -- --code-coverage
```

### Included Tests

**Services:**
- `auth.service.spec.ts` - Authentication, login, register, logout
- `product.service.spec.ts` - Product CRUD, pagination
- `category.service.spec.ts` - Category management

**Components:**
- `login.component.spec.ts` - Login form validation
- `register.component.spec.ts` - User registration
- `product-list.component.spec.ts` - Listing, search, pagination
- `product-form.component.spec.ts` - Product creation/editing
- `product-detail.component.spec.ts` - Product detail
- `home.component.spec.ts` - Home page
- `navbar.component.spec.ts` - Navigation bar

**Guards:**
- `auth.guard.spec.ts` - Route protection

### Test Structure

```typescript
// Ejemplo: auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should login successfully', () => {
    // Test implementation
  });
});
```

## 🎯 Implemented Features

### Authentication
- ✅ User registration
- ✅ Login with JWT
- ✅ Logout
- ✅ Guard for protected routes
- ✅ Interceptor to add JWT to requests
- ✅ 401 (Unauthorized) error handling

### Products
- ✅ Listing with pagination
- ✅ Search by name
- ✅ Filter by category
- ✅ Create product (admin only)
- ✅ Edit product (admin only)
- ✅ Delete product (admin only)
- ✅ View product details

### Categories
- ✅ Complete CRUD (admin only)
- ✅ Listing in filters

### UI/UX
- ✅ Responsive design with Bootstrap 5
- ✅ Modern e-commerce homepage
- ✅ Hero section with call-to-action
- ✅ Categories grid
- ✅ Featured products
- ✅ Toast notifications
- ✅ Loading states
- ✅ Form validation

## 📝 Available Scripts

```json
{
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test",
  "test:ci": "ng test --watch=false --browsers=ChromeHeadless",
  "lint": "ng lint"
}
```

## 🔒 Security

- JWT stored in `localStorage`
- HTTP interceptor to automatically add token
- Guards to protect routes
- User roles (Admin/User)
- Form validation
- CORS configured in backend

## 🐳 Docker

### Manual Build

```bash
# From project root
docker build -t ecommerce-frontend .

# Run container
docker run -p 8080:8080 ecommerce-frontend
```

### Docker Compose (Optional)

To run locally with Docker:

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
```

## 📊 Project Status

- ✅ Frontend deployed on Railway
- ✅ Backend API deployed on Railway
- ✅ PostgreSQL database on Railway
- ✅ JWT authentication working
- ✅ Complete product CRUD
- ✅ Unit tests implemented
- ✅ Modern e-commerce design
- ✅ Responsive design

## 🤝 Contributing

This is a technical test project. For development:

1. Fork the repository
2. Create a branch: `git checkout -b feature/new-feature`
3. Commit: `git commit -m 'Add new feature'`
4. Push: `git push origin feature/new-feature`
5. Open a Pull Request

## 👨‍💻 Author

**Primorod79**
- GitHub: [@Primorod79](https://github.com/Primorod79)
- Repository: [TechnicalPrube](https://github.com/Primorod79/TechnicalPrube)

## 📄 License

This project is open source and available under the MIT License.

---

**Note**: This project was developed as a technical test to demonstrate fullstack development skills with Angular, .NET, and PostgreSQL, as well as deployment on cloud platforms like Railway.
