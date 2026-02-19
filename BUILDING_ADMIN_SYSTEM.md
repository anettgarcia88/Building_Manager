# 🏢 Sistema de Panel de Administración por Edificio

## Resumen de Cambios Implementados

Se ha implementado un sistema completo de **panel de administración dinámico por edificio** con roles específicos para cada usuario en cada edificio.

---

## 📊 Arquitectura del Sistema

### **1. Backend - Cambios en Base de Datos**

#### Nuevo Enum: `BuildingUserRole`
```prisma
enum BuildingUserRole {
  BUILDING_ADMIN        // Admin del edificio (control total)
  MANAGER               // Gerente (acceso casi completo)
  LAUNDRY_MANAGER       // Encargado de lavandería y secadora
  MAINTENANCE_STAFF     // Personal de mantenimiento
  TENANT                // Inquilino (acceso limitado)
}
```

#### Actualización: `UserBuildingRole`
```prisma
model UserBuildingRole {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  buildingId String
  building  Building @relation(fields: [buildingId], references: [id])
  role      BuildingUserRole  // ← NUEVO: Rol específico por edificio
  
  // Información adicional del usuario en este contexto
  firstName String?
  lastName  String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, buildingId])
  @@map("user_building_roles")
}
```

---

### **2. Backend - Nuevos Endpoints**

#### **Crear usuario en un edificio**
```
POST /users/buildings/:buildingId/staff
```

**Body:**
```json
{
  "email": "gerente@edificio.com",
  "password": "seguraContraseña123",
  "role": "MANAGER",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "buildingId": "uuid",
    "role": "MANAGER",
    "firstName": "Juan",
    "lastName": "Pérez",
    "createdAt": "2026-02-18T..."
  }
}
```

---

#### **Obtener todos los usuarios de un edificio**
```
GET /users/buildings/:buildingId/staff
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "buildingId": "uuid",
      "role": "BUILDING_ADMIN",
      "firstName": "Admin",
      "lastName": "Sistema",
      "user": {
        "id": "uuid",
        "email": "admin@rms.com",
        "role": "ADMIN",
        "createdAt": "2026-02-18T..."
      }
    }
  ]
}
```

---

#### **Eliminar usuario de un edificio**
```
DELETE /users/buildings/:buildingId/staff/:userId
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario eliminado del edificio"
}
```

---

### **3. Backend - Actualización del Login**

El endpoint `/auth/login` ahora devuelve información más completa:

```json
{
  "access_token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "admin@rms.com",
    "role": "ADMIN",
    "buildings": [
      {
        "id": "uuid",
        "name": "Edificio Demo",
        "slug": "edificio-demo",
        "role": "BUILDING_ADMIN",      // ← NUEVO: Rol en este edificio
        "firstName": "Admin",           // ← NUEVO
        "lastName": "Sistema"           // ← NUEVO
      }
    ]
  }
}
```

---

## 🎨 Frontend - Nueva Estructura de Rutas

### **Panel Dinámico por Edificio**

**URL:** `http://localhost:3000/admin/[buildingSlug]`

**Ejemplo:** `http://localhost:3000/admin/edificio-demo`

#### Estructura de Carpetas:
```
src/app/admin/
├── page.tsx (Dashboard global, lista de edificios)
└── [buildingSlug]/
    └── page.tsx (Panel dinámico del edificio)
```

---

### **Funcionalidades del Panel por Edificio**

El panel tiene **5 tabs principales** con control de acceso por rol:

#### 1. **Dashboard** (Visible para todos)
- Estadísticas del edificio (Unidades, Inquilinos, Pagos Pendientes, Tickets)
- Próximamente: datos en tiempo real

#### 2. **Personal** (BUILDING_ADMIN y MANAGER)
- ✅ Crear nuevos usuarios
- ✅ Listar personal del edificio
- ✅ Asignar roles (Admin, Gerente, Encargado Lavandería, Personal Mantenimiento, Inquilino)
- ✅ Eliminar usuarios

#### 3. **Lavandería** (LAUNDRY_MANAGER, MANAGER, BUILDING_ADMIN)
- Próximamente: gestión de reservas de lavadora y secadora

#### 4. **Mantenimiento** (MAINTENANCE_STAFF, MANAGER, BUILDING_ADMIN)
- Próximamente: gestión de tickets de mantenimiento

#### 5. **Configuración** (Solo BUILDING_ADMIN)
- Próximamente: configuración del edificio

---

## 🚀 Flujo de Uso

### **Escenario 1: Admin del Sistema crea un edificio**

1. Admin inicia sesión en `http://localhost:3000/login`
2. Se redirige automáticamente a `http://localhost:3000/admin/edificio-demo`
3. En el tab **Personal**, hace clic en **"Crear Usuario"**
4. Crea usuarios con diferentes roles:
   - **Juan** (juan@edificio.com) → BUILDING_ADMIN
   - **María** (maria@edificio.com) → MANAGER
   - **Carlos** (carlos@edificio.com) → LAUNDRY_MANAGER
   - **Pedro** (pedro@edificio.com) → MAINTENANCE_STAFF

---

### **Escenario 2: Gerente inicia sesión**

1. María (MANAGER) inicia sesión con sus credenciales
2. Se redirige automáticamente a `http://localhost:3000/admin/edificio-demo`
3. Ve el panel completo
4. Puede:
   - Ver dashboard
   - Gestionar personal
   - Acceder a Lavandería y Mantenimiento
   - **NO puede** acceder a Configuración

---

### **Escenario 3: Inquilino inicia sesión**

1. Inquilino inicia sesión
2. Se redirige a su portal de inquilino (próximamente)
3. Ver sus deudas, contratos, realizar reservas de lavandería

---

## 🔐 Sistema de Roles y Permisos

| Rol | Dashboard | Personal | Lavandería | Mantenimiento | Configuración |
|-----|-----------|----------|-----------|---------------|---------------|
| **BUILDING_ADMIN** | ✅ | ✅ (crear/eliminar) | ✅ | ✅ | ✅ |
| **MANAGER** | ✅ | ✅ (crear/eliminar) | ✅ | ✅ | ❌ |
| **LAUNDRY_MANAGER** | ✅ | ❌ | ✅ | ❌ | ❌ |
| **MAINTENANCE_STAFF** | ✅ | ❌ | ❌ | ✅ | ❌ |
| **TENANT** | ✅ | ❌ | ⚠️ (reservar solo) | ⚠️ (reportar) | ❌ |

---

## 🧪 Pruebas

### **1. Iniciar el Backend**
```bash
cd backend
npm run start:dev
```

### **2. Iniciar el Frontend**
```bash
cd frontend
npm run dev
```

### **3. Credenciales de Prueba**

**Admin del Sistema:**
- Email: `admin@rms.com`
- Password: `password123`

---

### **4. Crear un usuario de prueba**

1. Inicia sesión con `admin@rms.com`
2. Se redirige a `/admin/edificio-demo`
3. Haz clic en tab "Personal"
4. Haz clic en "Crear Usuario"
5. Ingresa:
   - Email: `gerente@test.com`
   - Password: `seguraContraseña123`
   - Nombre: `Juan`
   - Apellido: `Pérez`
   - Rol: `MANAGER`
6. Haz clic en "Crear Usuario"

---

### **5. Probar con el nuevo usuario**

1. Cierra sesión
2. Inicia sesión con:
   - Email: `gerente@test.com`
   - Password: `seguraContraseña123`
3. Se redirige automáticamente a `/admin/edificio-demo`
4. Verás el panel con permisos de MANAGER

---

## 📁 Archivos Creados/Modificados

### **Backend**
- ✅ `prisma/schema.prisma` - Añadido `BuildingUserRole` enum y campos a `UserBuildingRole`
- ✅ `src/auth/auth.service.ts` - Actualizado login para devolver rol y nombre del usuario
- ✅ `src/users/users.service.ts` - Nuevos métodos: `createBuildingUser`, `getBuildingUsers`, `removeBuildingUser`
- ✅ `src/users/users.controller.ts` - Nuevos endpoints para gestión de usuarios
- ✅ `src/users/dto/create-building-user.dto.ts` - Nuevo DTO
- ✅ `prisma/seed.ts` - Actualizado para crear relación con `BuildingUserRole`

### **Frontend**
- ✅ `src/app/admin/[buildingSlug]/page.tsx` - Nuevo panel dinámico por edificio
- ✅ `src/components/admin/user-management.tsx` - Componente para gestionar usuarios
- ✅ `src/components/admin/staff-dashboard.tsx` - Componente placeholder para otras funciones
- ✅ `src/app/login/page.tsx` - Actualizado redireccionar a `/admin/[buildingSlug]`

---

## 🚨 Próximas Mejoras

- [ ] Implementar gestión completa de Lavandería
- [ ] Implementar gestión completa de Mantenimiento
- [ ] Agregar autenticación de dos factores (2FA)
- [ ] Implementar auditoría completa de acciones
- [ ] Crear reportes por edificio y rol
- [ ] Agregar notificaciones en tiempo real
- [ ] Implementar recuperación de contraseña

---

## 📝 Notas Técnicas

1. **Multi-tenancy**: Cada usuario puede tener acceso a múltiples edificios con roles diferentes
2. **JWT**: El token contiene rol global, el rol por edificio se obtiene del contexto
3. **Guards**: `BuildingGuard` valida que el usuario tenga acceso al edificio
4. **DTOs**: Validación con `class-validator` en todos los endpoints
5. **React Query**: Caché de datos en frontend para mejor UX

---

## 🆘 Troubleshooting

### Error: "No tienes permisos para acceder a esta sección"
- Verifica que tu usuario tenga asignado el rol correcto en el edificio
- Cierra sesión e inicia nuevamente

### Error: "Edificio no encontrado"
- Verifica que el slug sea correcto en la URL
- Asegúrate de estar logueado con un usuario que tenga acceso a ese edificio

### Los usuarios no aparecen en la lista
- Verifica que el backend esté corriendo
- Revisa la consola del navegador para errores de API
- Verifica en la BD que los usuarios fueron creados

---

**Versión:** 2.0 (Phase 2 - Dynamic Building Admin Panels)  
**Última actualización:** 18 de febrero de 2026
