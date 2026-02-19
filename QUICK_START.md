# 🚀 INICIO RÁPIDO - Panel de Administración por Edificio

## En 5 minutos estarás listo

### **Terminal 1: Iniciar Backend**
```bash
cd backend
npm run start:dev
```

Espera a ver:
```
[NestFactory] Instance created
```

### **Terminal 2: Iniciar Frontend**
```bash
cd frontend
npm run dev
```

Espera a ver:
```
- Local: http://localhost:3001
```

---

## 🔑 Credenciales de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| `admin@rms.com` | `password123` | Admin del Edificio |

---

## 📍 URLs Importantes

| URL | Descripción |
|-----|-----------|
| `http://localhost:3001/login` | Login (redirige automáticamente) |
| `http://localhost:3001/admin/edificio-demo` | Panel del Edificio Demo |
| `http://localhost:3000` | Backend API |
| `http://localhost:5432` | PostgreSQL |
| `http://localhost:6379` | Redis |

---

## ✨ Lo Que Puedes Hacer Ahora

### 1️⃣ Inicia sesión
```
Email: admin@rms.com
Password: password123
```

### 2️⃣ Te redirige automáticamente a:
```
http://localhost:3001/admin/edificio-demo
```

### 3️⃣ Crea un nuevo usuario
- Haz clic en el tab **"Personal"**
- Haz clic en **"Crear Usuario"**
- Ingresa datos y selecciona un rol:
  - **BUILDING_ADMIN**: Control total
  - **MANAGER**: Casi todo
  - **LAUNDRY_MANAGER**: Solo lavandería
  - **MAINTENANCE_STAFF**: Solo mantenimiento
  - **TENANT**: Inquilino

### 4️⃣ Prueba con el nuevo usuario
- Cierra sesión
- Inicia con el usuario que creaste
- Se redirige al mismo panel

---

## 🎯 Flujo Completo

```
1. Login
   ↓
2. Sistema detecta edificios asignados
   ↓
3. Redirige a /admin/[buildingSlug]
   ↓
4. Panel dinámico carga según rol
   ↓
5. BUILDING_ADMIN/MANAGER pueden crear más usuarios
   ↓
6. Nuevos usuarios ven solo funciones de su rol
```

---

## 📊 Tabs Disponibles

| Tab | Descripción | Quién ve |
|-----|-----------|---------|
| **Dashboard** | Estadísticas | Todos |
| **Personal** | Gestión de usuarios | BUILDING_ADMIN, MANAGER |
| **Lavandería** | Reservas de lavadora/secadora | LAUNDRY_MANAGER, MANAGER, BUILDING_ADMIN |
| **Mantenimiento** | Tickets de mantenimiento | MAINTENANCE_STAFF, MANAGER, BUILDING_ADMIN |
| **Configuración** | Ajustes del edificio | Solo BUILDING_ADMIN |

---

## 🧪 Pruebas Rápidas

### Test 1: Crear usuario MANAGER
1. Inicia con `admin@rms.com`
2. Tab "Personal" → "Crear Usuario"
3. Email: `manager@test.com` | Password: `Test1234` | Rol: MANAGER
4. Cierra sesión
5. Inicia con el nuevo usuario
6. Verifica que ves el panel completo

### Test 2: Crear usuario LAUNDRY_MANAGER
1. Tab "Personal" → "Crear Usuario"
2. Email: `laundry@test.com` | Password: `Test1234` | Rol: LAUNDRY_MANAGER
3. Cierra sesión e inicia
4. Verifica que solo ves "Dashboard" y "Lavandería"

---

## 🐛 Si algo no funciona

### El frontend no se conecta al backend
```bash
# Verifica que el backend esté corriendo
curl http://localhost:3000/auth
```

### Errores en consola del navegador
```bash
# Abre DevTools (F12)
# Ve a Console
# Busca el error específico
```

### Base de datos no responde
```bash
# Reinicia Docker
docker-compose down
docker-compose up -d
```

### Migraciones incompletas
```bash
cd backend
npx prisma migrate reset --force
```

---

## 📚 Documentación Completa

Lee `BUILDING_ADMIN_SYSTEM.md` para:
- Arquitectura completa
- Todos los endpoints disponibles
- Estructura de datos
- Permisos por rol
- Próximas mejoras

---

**¡Listo! Comienza a crear usuarios y prueba los diferentes roles. 🎉**
