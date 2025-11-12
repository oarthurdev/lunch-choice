-- Dados iniciais para teste do Sistema de Almoço Corporativo

-- Limpar dados existentes (CUIDADO: Use apenas em ambiente de desenvolvimento!)
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE dishes CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE tenants CASCADE;

-- Reiniciar sequências
ALTER SEQUENCE tenants_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE dishes_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;

-- Inserir Super Admin (não vinculado a nenhum tenant)
-- Email: admin@lunchsystem.com
-- Senha: Admin@123 (hash BCrypt)
INSERT INTO users (name, email, password_hash, role, tenant_id, is_active, created_at) VALUES
('Super Administrador', 'admin@lunchsystem.com', '$2a$11$XVa/ZY3qRzPKqZEyOyPpLeLNIVIlMBjcXWqXLrD0UqU8qKQp6c6g.', 0, NULL, true, CURRENT_TIMESTAMP);

-- Inserir Empresas (Tenants)
INSERT INTO tenants (name, cnpj, is_active, created_at) VALUES
('TechCorp Sistemas', '12.345.678/0001-90', true, CURRENT_TIMESTAMP),
('Marketing Plus', '98.765.432/0001-11', true, CURRENT_TIMESTAMP),
('Consultoria ABC', '11.222.333/0001-44', true, CURRENT_TIMESTAMP);

-- Inserir usuários RH para cada empresa
-- Senha padrão para todos: RH@123
INSERT INTO users (name, email, password_hash, role, tenant_id, is_active, created_at) VALUES
('Maria Silva', 'maria.silva@techcorp.com', '$2a$11$KqH8qH8qH8qH8qH8qH8qH.KqH8qH8qH8qH8qH8qH8qH8qH8qH8qH8qO', 1, 1, true, CURRENT_TIMESTAMP),
('João Santos', 'joao.santos@marketingplus.com', '$2a$11$KqH8qH8qH8qH8qH8qH8qH.KqH8qH8qH8qH8qH8qH8qH8qH8qH8qH8qO', 1, 2, true, CURRENT_TIMESTAMP),
('Ana Costa', 'ana.costa@consultoriaabc.com', '$2a$11$KqH8qH8qH8qH8qH8qH8qH.KqH8qH8qH8qH8qH8qH8qH8qH8qH8qH8qO', 1, 3, true, CURRENT_TIMESTAMP);

-- Inserir funcionários para cada empresa
-- Senha padrão: Func@123
INSERT INTO users (name, email, password_hash, role, tenant_id, is_active, created_at) VALUES
-- TechCorp
('Pedro Oliveira', 'pedro.oliveira@techcorp.com', '$2a$11$MqH8qH8qH8qH8qH8qH8qH.MqH8qH8qH8qH8qH8qH8qH8qH8qH8qH8qK', 2, 1, true, CURRENT_TIMESTAMP),
('Juliana Ferreira', 'juliana.ferreira@techcorp.com', '$2a$11$MqH8qH8qH8qH8qH8qH8qH.MqH8qH8qH8qH8qH8qH8qH8qH8qH8qH8qK', 2, 1, true, CURRENT_TIMESTAMP),
('Carlos Souza', 'carlos.souza@techcorp.com', '$2a$11$MqH8qH8qH8qH8qH8qH8qH.MqH8qH8qH8qH8qH8qH8qH8qH8qH8qH8qK', 2, 1, true, CURRENT_TIMESTAMP),
-- Marketing Plus
('Beatriz Lima', 'beatriz.lima@marketingplus.com', '$2a$11$MqH8qH8qH8qH8qH8qH8qH.MqH8qH8qH8qH8qH8qH8qH8qH8qH8qH8qK', 2, 2, true, CURRENT_TIMESTAMP),
('Rafael Alves', 'rafael.alves@marketingplus.com', '$2a$11$MqH8qH8qH8qH8qH8qH8qH.MqH8qH8qH8qH8qH8qH8qH8qH8qH8qH8qK', 2, 2, true, CURRENT_TIMESTAMP),
-- Consultoria ABC
('Fernanda Rocha', 'fernanda.rocha@consultoriaabc.com', '$2a$11$MqH8qH8qH8qH8qH8qH8qH.MqH8qH8qH8qH8qH8qH8qH8qH8qH8qH8qK', 2, 3, true, CURRENT_TIMESTAMP),
('Lucas Martins', 'lucas.martins@consultoriaabc.com', '$2a$11$MqH8qH8qH8qH8qH8qH8qH.MqH8qH8qH8qH8qH8qH8qH8qH8qH8qH8qK', 2, 3, true, CURRENT_TIMESTAMP);

-- Inserir pratos globais (disponíveis para todas as empresas)
INSERT INTO dishes (name, description, available_date, tenant_id, is_active, created_at) VALUES
('Frango Grelhado com Legumes', 'Frango grelhado acompanhado de legumes no vapor e arroz integral', CURRENT_DATE, NULL, true, CURRENT_TIMESTAMP),
('Lasanha à Bolonhesa', 'Lasanha com molho bolonhesa gratinada ao forno', CURRENT_DATE, NULL, true, CURRENT_TIMESTAMP),
('Peixe Assado com Batatas', 'Filé de peixe assado com batatas e salada verde', CURRENT_DATE, NULL, true, CURRENT_TIMESTAMP);

-- Inserir prato específico para TechCorp
INSERT INTO dishes (name, description, available_date, tenant_id, is_active, created_at) VALUES
('Menu Vegetariano Premium', 'Prato vegetariano especial com quinoa e grão-de-bico', CURRENT_DATE, 1, true, CURRENT_TIMESTAMP);

-- Inserir alguns pedidos de exemplo (apenas para demonstração)
INSERT INTO orders (user_id, dish_id, tenant_id, order_date, created_at) VALUES
(5, 1, 1, CURRENT_DATE, CURRENT_TIMESTAMP),
(6, 2, 1, CURRENT_DATE, CURRENT_TIMESTAMP),
(8, 3, 2, CURRENT_DATE, CURRENT_TIMESTAMP);

-- Verificar dados inseridos
SELECT 'Empresas cadastradas:' AS info;
SELECT id, name, cnpj, is_active FROM tenants;

SELECT 'Usuários cadastrados:' AS info;
SELECT id, name, email, 
       CASE role 
           WHEN 0 THEN 'SuperAdmin'
           WHEN 1 THEN 'RH'
           WHEN 2 THEN 'Funcionário'
       END as role_name,
       tenant_id
FROM users;

SELECT 'Pratos cadastrados:' AS info;
SELECT id, name, available_date, 
       CASE 
           WHEN tenant_id IS NULL THEN 'Global'
           ELSE CAST(tenant_id AS VARCHAR)
       END as scope
FROM dishes;

SELECT 'Pedidos realizados:' AS info;
SELECT o.id, u.name as employee, d.name as dish, o.order_date 
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN dishes d ON o.dish_id = d.id;

-- Informações de acesso
SELECT '============================================' AS separator;
SELECT 'CREDENCIAIS DE ACESSO PARA TESTE' AS info;
SELECT '============================================' AS separator;
SELECT 'Super Admin:' AS role, 'admin@lunchsystem.com' AS email, 'Admin@123' AS password
UNION ALL
SELECT 'RH TechCorp:', 'maria.silva@techcorp.com', 'RH@123'
UNION ALL
SELECT 'RH Marketing Plus:', 'joao.santos@marketingplus.com', 'RH@123'
UNION ALL
SELECT 'RH Consultoria ABC:', 'ana.costa@consultoriaabc.com', 'RH@123'
UNION ALL
SELECT 'Funcionário:', 'pedro.oliveira@techcorp.com', 'Func@123';
SELECT '============================================' AS separator;