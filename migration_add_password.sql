-- Migración: agregar columna password a usuarios
-- Ejecutar en tu base de datos MySQL en Railway

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS password VARCHAR(255) NOT NULL DEFAULT '' AFTER email;

-- Nota: Los usuarios existentes quedarán con password vacío.
-- Deberán registrarse de nuevo o actualizar su contraseña via PUT /api/usuarios/:id
