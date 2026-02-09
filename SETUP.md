# TOTP Authenticator Backend - Setup Guide

## 🔧 Configuración de Supabase

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se aprovisione la base de datos (~2 minutos)

### 2. Obtener credenciales de conexión
1. En tu proyecto, ve a **Settings** → **Database**
2. Busca la sección **Connection string** → **URI**
3. Copia la cadena de conexión que se ve así:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

4. Extrae los valores:
   - **Host**: `db.xxxxxxxxxxxx.supabase.co` (o `aws-0-us-east-1.pooler.supabase.com`)
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: La contraseña que estableciste al crear el proyecto
   - **Database**: `postgres`

### 3. Ejecutar schema SQL
1. En Supabase, ve a **SQL Editor**
2. Abre el archivo `database-schema.sql` de este proyecto
3. Copia y pega el contenido completo
4. Click en **Run** para ejecutar

Esto creará las tablas `users` y `totp_services`.

---

## ⚙️ Configuración del Backend

### 1. Crear archivo `.env`
Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

### 2. Configurar variables de entorno

Edita `.env` con tus valores reales:

```env
# Database - Supabase PostgreSQL
DATABASE_HOST=db.xxxxxxxxxxxx.supabase.co
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password_real_aqui
DATABASE_NAME=postgres

# JWT (genera una clave segura)
JWT_SECRET=genera_una_clave_secreta_aleatoria_aqui
JWT_EXPIRES_IN=7d

# Encryption (DEBE ser exactamente 32 caracteres)
ENCRYPTION_KEY=12345678901234567890123456789012

# App
PORT=3000
```

**Importante:**
- `ENCRYPTION_KEY` DEBE tener exactamente 32 caracteres
- `JWT_SECRET` debe ser una cadena aleatoria larga y segura
- NO subas el archivo `.env` a Git (ya está en `.gitignore`)

### 3. Instalar dependencias

```bash
pnpm install
```

### 4. Iniciar el servidor

```bash
pnpm start:dev
```

---

## 📚 API Endpoints

### Autenticación

#### Registrar usuario
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "mypassword123"
}

# Respuesta:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**Importante:** Guarda el `accessToken` para usarlo en los siguientes requests.

---

### Servicios TOTP (requieren autenticación)

Todos los endpoints requieren el header:
```
Authorization: Bearer <tu_access_token>
```

#### Registrar un servicio TOTP
```bash
POST /services
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "facebook",
  "secret": "JBSWY3DPEHPK3PXP"
}
```

#### Generar código OTP
```bash
GET /services/facebook/otp
Authorization: Bearer <token>

# Respuesta:
{
  "service": "facebook",
  "otp": "123456",
  "expiresIn": 25
}
```

#### Listar todos los servicios
```bash
GET /services
Authorization: Bearer <token>

# Respuesta:
["facebook", "google", "github"]
```

#### Eliminar un servicio
```bash
DELETE /services/facebook
Authorization: Bearer <token>
```

---

## 🧪 Pruebas con PowerShell

### 1. Registrar usuario
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@test.com","password":"123456"}'
```

### 2. Login y obtener token
```powershell
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@test.com","password":"123456"}'

$token = $loginResponse.accessToken
```

### 3. Registrar servicio TOTP
```powershell
$headers = @{ Authorization = "Bearer $token" }

Invoke-RestMethod -Uri "http://localhost:3000/services" `
  -Method POST `
  -Headers $headers `
  -ContentType "application/json" `
  -Body '{"name":"facebook","secret":"JBSWY3DPEHPK3PXP"}'
```

### 4. Generar OTP
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/services/facebook/otp" `
  -Method GET `
  -Headers $headers
```

---

## 🔒 Seguridad implementada

✅ **Autenticación JWT**: Todos los endpoints TOTP están protegidos
✅ **Passwords hasheados**: bcrypt con salt rounds = 10
✅ **Secrets encriptados**: AES-256-CBC para los secrets TOTP en DB
✅ **Aislamiento por usuario**: Cada usuario solo ve sus servicios
✅ **Validación de DTOs**: class-validator automático
✅ **PostgreSQL**: Base de datos relacional segura
✅ **SSL**: Conexión segura con Supabase

---

## 📊 Estructura de Base de Datos

### Tabla `users`
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### Tabla `totp_services`
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `service_name` (VARCHAR)
- `encrypted_secret` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)
- UNIQUE constraint: (user_id, service_name)

---

## 🚀 Siguientes pasos (Frontend)

Para el frontend puedes crear:
1. **Login/Register** screen
2. **Dashboard** con lista de servicios
3. **Add Service** modal/screen
4. **OTP Display** con countdown timer (30s)
5. **Auto-refresh** cada 30 segundos

El código OTP se actualiza automáticamente cada 30 segundos siguiendo RFC 6238.

---

## 🛠️ Tecnologías utilizadas

- **NestJS** - Framework backend
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** (Supabase) - Base de datos
- **otplib** - Generación TOTP (RFC 6238)
- **Passport JWT** - Autenticación
- **bcrypt** - Hashing de passwords
- **crypto** (Node.js) - Encriptación AES-256

---

## ❓ Troubleshooting

### Error: "ENCRYPTION_KEY must be 32 characters long"
- Asegúrate de que `ENCRYPTION_KEY` en `.env` tenga exactamente 32 caracteres

### Error: "Connection refused"
- Verifica que las credenciales de Supabase sean correctas
- Verifica que el proyecto de Supabase esté activo
- Revisa que el host y puerto sean correctos

### Error: "Unauthorized"
- Verifica que estés enviando el header `Authorization: Bearer <token>`
- El token puede haber expirado (7 días por defecto)
- Vuelve a hacer login para obtener un nuevo token

---

## 📝 Notas

- Este es un **POC** (Proof of Concept)
- En producción considera:
  - Rate limiting
  - Refresh tokens
  - Email verification
  - 2FA en el login
  - Auditoría/logging
  - Backups de la DB
  - Rotación de keys de encriptación
