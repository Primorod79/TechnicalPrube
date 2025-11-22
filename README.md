# E-Commerce Technical Test

Sistema completo de e-commerce desarrollado con **Angular 18** (Frontend), **.NET 8** (Backend API) y **PostgreSQL** (Base de datos), desplegado en **Railway**.

## 🚀 Tecnologías Utilizadas

### Frontend
- **Angular 18.2.11** - Framework web con componentes standalone
- **Bootstrap 5.3** - Framework CSS para diseño responsive
- **Bootstrap Icons** - Librería de iconos
- **ngx-toastr** - Notificaciones toast
- **RxJS** - Programación reactiva

### Backend
- **.NET 8** - Web API
- **Entity Framework Core** - ORM
- **JWT Authentication** - Sistema de autenticación

### Base de Datos
- **PostgreSQL** - Base de datos relacional (Railway)

### DevOps
- **Docker** - Contenedorización
- **Railway** - Plataforma de despliegue
- **Nginx** - Servidor web para frontend
- **GitHub** - Control de versiones

## 📦 Estructura del Proyecto

```
PRUEBA/
├── ecommerce-frontend/          # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Servicios, guards, interceptors
│   │   │   ├── features/       # Componentes de características
│   │   │   │   ├── auth/       # Login, Register
│   │   │   │   ├── products/   # CRUD de productos
│   │   │   │   └── home/       # Página principal
│   │   │   ├── models/         # Interfaces TypeScript
│   │   │   └── shared/         # Componentes compartidos
│   │   └── environments/       # Configuración de entornos
├── Dockerfile                   # Configuración Docker
├── nginx.conf                   # Configuración Nginx
└── railway.json                 # Configuración Railway
```

## 🌐 Despliegue en Railway

### URLs de Producción
- **Frontend**: https://technicalprube-production.up.railway.app
- **API Backend**: https://technicalprubеapi-production.up.railway.app/api
- **Base de Datos**: PostgreSQL en Railway (puerto 29162)

### Configuración de Railway

#### 1. Base de Datos PostgreSQL
Se creó un servicio de PostgreSQL en Railway con las siguientes credenciales:
```
Host: switchback.proxy.rlwy.net
Port: 29162
Database: railway
User: postgres
Password: rzzfKClsgszBFmQgQccWgIRFl5ubCYpc
```

#### 2. Backend API (.NET 8)
1. Crear nuevo servicio en Railway
2. Conectar con repositorio GitHub
3. Variables de entorno configuradas:
   - `ConnectionStrings__DefaultConnection`: Connection string de PostgreSQL
   - `JWT__SecretKey`: Clave secreta para tokens
   - `JWT__Issuer`: Emisor del token
   - `JWT__Audience`: Audiencia del token

#### 3. Frontend (Angular)
1. Crear nuevo servicio en Railway
2. Conectar con el mismo repositorio
3. Railway detecta automáticamente el `Dockerfile`
4. Variables de configuración:
   - `PORT`: 8080 (requerido por Railway)
   - Build Command: `docker build`
   - Dockerfile Path: `Dockerfile` (raíz del proyecto)

### Características del Despliegue

**Dockerfile Multi-Stage:**
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
- Puerto 8080 (requerimiento de Railway)
- SPA routing con `try_files`
- Compresión gzip habilitada
- Cache para archivos estáticos

## 💻 Ejecución en Local

### ⚠️ Limitación Importante
**El proyecto NO puede ejecutarse completamente en local** porque la base de datos PostgreSQL está desplegada en Railway y solo es accesible desde servicios autorizados. Para desarrollo local sería necesario:
- Crear una instancia local de PostgreSQL
- Actualizar las cadenas de conexión del backend
- Modificar las URLs del API en `environment.development.ts`

### Requisitos Previos
- **Node.js** 20.x o superior
- **npm** 10.x o superior
- **Angular CLI** 18.x
- **.NET SDK** 8.0
- **PostgreSQL** (para backend local)

### Instalación del Frontend

```bash
# Clonar el repositorio
git clone https://github.com/Primorod79/TechnicalPrube.git
cd TechnicalPrube/ecommerce-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (conectará al API de Railway)
ng serve

# La aplicación estará disponible en http://localhost:4200
```

### Variables de Entorno

**Desarrollo** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api' // API local (no funcional sin DB local)
};
```

**Producción** (`src/environments/environment.production.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://technicalprubеapi-production.up.railway.app/api'
};
```

## 🧪 Ejecución de Pruebas Unitarias

El proyecto incluye **38 pruebas unitarias** usando **Karma** y **Jasmine**.

### Ejecutar Todas las Pruebas

```bash
cd ecommerce-frontend

# Ejecutar pruebas en modo watch
npm test

# Ejecutar pruebas una sola vez
npm run test -- --watch=false

# Ejecutar con reporte de cobertura
npm run test -- --code-coverage
```

### Pruebas Incluidas

**Servicios:**
- `auth.service.spec.ts` - Autenticación, login, registro, logout
- `product.service.spec.ts` - CRUD de productos, paginación
- `category.service.spec.ts` - Gestión de categorías

**Componentes:**
- `login.component.spec.ts` - Validación de formulario de login
- `register.component.spec.ts` - Registro de usuarios
- `product-list.component.spec.ts` - Listado, búsqueda, paginación
- `product-form.component.spec.ts` - Creación/edición de productos
- `product-detail.component.spec.ts` - Detalle de producto
- `home.component.spec.ts` - Página principal
- `navbar.component.spec.ts` - Barra de navegación

**Guards:**
- `auth.guard.spec.ts` - Protección de rutas

### Estructura de Pruebas

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

## 🎯 Funcionalidades Implementadas

### Autenticación
- ✅ Registro de usuarios
- ✅ Login con JWT
- ✅ Logout
- ✅ Guard para rutas protegidas
- ✅ Interceptor para agregar JWT a requests
- ✅ Manejo de errores 401 (Unauthorized)

### Productos
- ✅ Listado con paginación
- ✅ Búsqueda por nombre
- ✅ Filtro por categoría
- ✅ Crear producto (solo admin)
- ✅ Editar producto (solo admin)
- ✅ Eliminar producto (solo admin)
- ✅ Ver detalle de producto

### Categorías
- ✅ CRUD completo (solo admin)
- ✅ Listado en filtros

### UI/UX
- ✅ Diseño responsive con Bootstrap 5
- ✅ Página principal estilo e-commerce moderno
- ✅ Hero section con call-to-action
- ✅ Grid de categorías
- ✅ Productos destacados
- ✅ Notificaciones toast
- ✅ Loading states
- ✅ Validación de formularios

## 📝 Scripts Disponibles

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

## 🔒 Seguridad

- JWT almacenado en `localStorage`
- Interceptor HTTP para agregar token automáticamente
- Guards para proteger rutas
- Roles de usuario (Admin/User)
- Validación de formularios
- CORS configurado en backend

## 🐳 Docker

### Build Manual

```bash
# Desde la raíz del proyecto
docker build -t ecommerce-frontend .

# Ejecutar contenedor
docker run -p 8080:8080 ecommerce-frontend
```

### Docker Compose (Opcional)

Para ejecutar localmente con Docker:

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

## 📊 Estado del Proyecto

- ✅ Frontend desplegado en Railway
- ✅ Backend API desplegado en Railway
- ✅ Base de datos PostgreSQL en Railway
- ✅ Autenticación JWT funcionando
- ✅ CRUD completo de productos
- ✅ Tests unitarios implementados
- ✅ Diseño moderno de e-commerce
- ✅ Responsive design

## 🤝 Contribución

Este es un proyecto de prueba técnica. Para desarrollo:

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Add nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 👨‍💻 Autor

**Primorod79**
- GitHub: [@Primorod79](https://github.com/Primorod79)
- Repository: [TechnicalPrube](https://github.com/Primorod79/TechnicalPrube)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Nota**: Este proyecto fue desarrollado como una prueba técnica para demostrar habilidades en desarrollo fullstack con Angular, .NET y PostgreSQL, además del despliegue en plataformas cloud como Railway.
