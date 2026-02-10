# TOTP Authenticator API

API REST para gestión de autenticación de dos factores (2FA) usando TOTP (Time-based One-Time Password). Permite a los usuarios almacenar y gestionar códigos de autenticación de manera segura.

## Configuración de Supabase

Este proyecto utiliza Supabase como base de datos. Para configurarlo:

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto en Supabase
3. En la configuración del proyecto, copia la URL y la API Key (anon key)
4. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_api_key_de_supabase
JWT_SECRET=tu_secreto_jwt
```

5. Ejecuta el script SQL que se encuentra en `database-schema.sql` en el editor SQL de Supabase para crear las tablas necesarias

## Description

Nest framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
