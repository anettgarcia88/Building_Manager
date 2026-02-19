# RMS (Residential Management System) - Phase 1 MVP

Este proyecto consiste en un sistema de gestión residencial (RMS) para un único edificio, desarrollado como MVP con capacidad de escalado futuro.

### 🚀 Estado de la Fase 2: Completado (Advanced Features)

Se han añadido funcionalidades avanzadas de gestión, facturación y servicios.

### Funcionalidades Nuevas (Fase 2)
- ✅ **Diseño UI Pastel**: Tema Amarillo/Blanco (#FDFD96) implementado en todo el frontend.
- ✅ **Módulo de Servicios**:
  - Medidores (Agua, Luz, Gas) y lecturas.
  - Cálculo automático de costos variables.
- ✅ **Cierre Mensual**:
  - Proceso de cierre que consolida alquiler + expensas + servicios.
  - Generación de registro `MonthlyClosing`.
- ✅ **Facturación (PDF)**:
  - Generación automática de PDFs con detalle de cobros.
  - Descarga disponible en Portal Inquilino.
- ✅ **Lavandería Avanzada**:
  - Regla de negocio: Máx 3 reservas por semana/unidad.
  - UI de reserva en Portal Inquilino.

### Funcionalidades Base (Fase 1 - Mantenidas)
- **Backend (NestJS + Prisma + Postgres)**:
  - ✅ **Autenticación**: Login con JWT y Roles (ADMIN, TENANT).
  - ✅ **Entidades**: Edificios, Unidades, Inquilinos, Contratos, Cobros.
  - ✅ **Base de Datos**: Esquema completo en PostgreSQL.
  - ✅ **API REST**: Endpoints protegidos por roles.
- **Frontend (Next.js + Tailwind + Shadcn)**:
  - ✅ **UI Moderna**: Dashboard administrativo y Portal de inquilinos.
  - ✅ **Contexto de Sesión**: Gestión de usuario persistente.
  - ✅ **Vistas**: Login, Lista de Edificios, Perfil de Inquilino (Contratos y Deudas).

### 🛠 Stack Tecnológico
- **Backend**: NestJS, Typescript, Prisma ORM, PostgreSQL, Redis, Argon2, Passport-JWT.
- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS v4, Shadcn/UI.
- **Infraestructura**: Docker Compose (Postgres, Redis).

## 📋 Instrucciones de Ejecución

### 1. Iniciar Servicios (Base de Datos)
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init  # Crear tablas
npm run start:dev
```
El servidor correrá en `http://localhost:3000`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
La aplicación correrá en `http://localhost:3001` (o el puerto que asigne Next.js).

## 🧪 Verificación y Pruebas
- **Backend Tests**: `cd backend && npm run test`
  - ✅ `AuthService` validado unitariamente.
  - ⚠️ Otros servicios requieren configuración de mocks para CI/CD completo.
- **Frontend Tests**: `cd frontend && npm run test` (Pendiente de configuración RTL extensiva)
- **Manual**:
  - Login Admin/Tenant OK.
  - Creación de Edificios OK.
  - Visualización de Contratos OK.
- Implementación de reservas de lavandería con bloqueos Redis.
- Sistema de Tickets de Mantenimiento.
- Generación automática de cobros (Jobs/Cron w/ BullMQ).

## 📄 Documentación Técnica Fase 2

### Reporte de Implementación
Esta fase se centró en la lógica de negocio avanzada y la experiencia de usuario. A continuación se detallan los resultados y desafíos encontrados durante la integración.

### 🐛 Errores Encontrados y Soluciones
Durante el desarrollo se presentaron y resolvieron los siguientes bloqueos:

1. **Relaciones de Base de Datos (Prisma)**:
   - **Error**: La migración falló inicialmente porque faltaban relaciones inversas entre `MonthlyClosing` e `Invoice`.
   - **Solución**: Se actualizaron los modelos en `schema.prisma` para asegurar la integridad referencial bidireccional y se regeneró la migración.

2. **Tipado Estricto en TypeScript**:
   - **Error**: `LaundryController` rechazaba el body de la petición por falta de definición explícita de `unitId`.
   - **Solución**: Se actualizó la firma del método para aceptar `unitId` como parámetro opcional/validado en el DTO, permitiendo flexibilidad en la integración con el frontend.

3. **Integración de Librerías Externas**:
   - **Error**: Conflicto con la importación de `pdfkit` debido a incompatibilidad de módulos ES/CommonJS y error de sintaxis en `AppModule` por duplicación de código generada por herramientas CLI.
   - **Solución**: Se implementó `require('pdfkit')` para compatibilidad y se reescribió `AppModule` limpiamente para eliminar duplicados y asegurar la correcta carga de `ServeStaticModule`.

### ✅ Estado Final
- **Backend Build**: Exitoso (`nest build`). Todos los módulos (`Services`, `Closing`, `Invoicing`, `Laundry`) compilan sin errores de tipo.
- **Frontend Build**: Exitoso (`npm run build`). La integración con Shadcn/UI y el tema pastel está completa.

### 📊 Datos de Prueba
Para esta fase de desarrollo y validación MVP se utilizaron las siguientes estrategias de datos:
- **Cálculo de Servicios**: Se implementó una lógica *mock* en `ServicesService` que genera costos aleatorios para simular lecturas de medidores y validar el flujo de cierre mensual sin depender de hardware real.
- **Generación de PDF**: Se utilizaron datos estructurales de prueba (sin conexión a DB real para el contenido del PDF en unit tests) para verificar la correcta maquetación y guardado en el sistema de archivos.
- **Reservas**: Se validó la lógica de "Máximo 3 reservas" mediante pruebas lógicas en el servicio, asumiendo datos de entrada válidos desde el controlador.

### 🚀 Fase 3: Multi-Tenancy (En Implementación)

Esta fase transforma el sistema en una plataforma multi-edificio real, con aislamiento estricto de datos y roles específicos por edificio.

#### 1. Arquitectura y Seguridad
- **Modelo**: Monolito Modular (preparado para microservicios).
- **Aislamiento de Datos**: 
  - Todo registro crítico debe tener `building_id`.
  - **Regla Estricta**: Ninguna query puede ejecutarse sin filtrar por edificio.
- **Seguridad (RBAC Granular)**:
  - Nueva tabla `user_building_roles` para asignar roles (ADMIN, MAINTENANCE, TENANT) por edificio.
  - Un usuario puede tener múltiples roles en diferentes edificios.
  - Middleware `BuildingGuard` valida acceso y contexto en cada petición.

#### 2. Modelo de Datos (Cambios)
- **Nueva Entidad `Building`**: Configuración centralizada (`settings` JSON) para reglas de negocio (e.g. límites de lavandería).
- **Entidades Aisladas**:
  - `Units`, `Contracts`, `Tenants`, `Charges`, `Payments`
  - `Services/Meters`, `Reservations`, `Tickets`, `Invoices`, `Closings`

#### 3. Procesamiento en Segundo Plano (Jobs)
- **Tecnología**: BullMQ + Redis.
- **Estrategia**: 
  - Colas independientes o particionadas por edificio.
  - Procesos críticos: Generación de Facturas, Cierre Mensual, Notificaciones.
  - Garantía de Idempotencia en cobros y cierres.

#### 4. Auditoría (Compliance)
- **Audit Log Global**:
  - Registro inmutable de acciones críticas (Cobros, Cambios de Contrato).
  - Campos: `user_id`, `building_id`, `action`, `before/after`, `ip`.

#### 5. Próximos Pasos (Implementación)
- [ ] Endurecer `BuildingGuard` y `RolesGuard` auditados.
- [ ] Configurar colas de BullMQ en `AppModule`.
- [ ] Implementar Selector de Edificios en Frontend (Admin).
- [ ] Activar Interceptors para Audit Log.
"# Building_Manager" 
"# Building_Manager" 
