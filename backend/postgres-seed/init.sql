CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- 2. Insertar un usuario de prueba
-- ¡IMPORTANTE! Este UUID lo necesitaremos en el script de Mongo.
-- Este hash es para "password123" (debes generar uno real con bcrypt en tu app)
INSERT INTO users (id, email, username, password_hash)
VALUES 
('3f6c1e5c-9c60-4b1a-9f5b-1b1a1b1a1b1a', 'test@user.com', 'testuser', '$2b$10$fakehashforpassword123.example'),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'admin@user.com', 'adminuser', '$2b$10$anotherfakehash.example');