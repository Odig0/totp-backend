-- ============================================
-- TOTP Authenticator - Database Schema
-- PostgreSQL / Supabase
-- ============================================

-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de servicios TOTP
CREATE TABLE totp_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_name VARCHAR(100) NOT NULL,
  encrypted_secret TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, service_name)
);

-- Índices para mejorar performance
CREATE INDEX idx_totp_services_user_id ON totp_services(user_id);
CREATE INDEX idx_users_email ON users(email);

-- Comentarios
COMMENT ON TABLE users IS 'Usuarios del sistema de autenticación';
COMMENT ON TABLE totp_services IS 'Servicios TOTP asociados a cada usuario';
COMMENT ON COLUMN totp_services.encrypted_secret IS 'Secret TOTP encriptado con AES-256';
