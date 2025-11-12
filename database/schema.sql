-- Sistema Multi-Tenant de Escolha de Almoço Corporativo
-- Schema do Banco de Dados PostgreSQL (Supabase)

-- Tabela de Empresas (Tenants)
CREATE TABLE IF NOT EXISTS tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Tabela de Usuários (Super Admin, RH, Funcionários)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role INTEGER NOT NULL,
    tenant_id INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    password_reset_token TEXT,
    password_reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT
);

-- Tabela de Pratos
CREATE TABLE IF NOT EXISTS dishes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    available_date DATE NOT NULL,
    tenant_id INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    dish_id INTEGER NOT NULL,
    tenant_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE RESTRICT,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
    UNIQUE (user_id, order_date)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_dishes_tenant_id ON dishes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dishes_available_date ON dishes(available_date);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_dish_id ON orders(dish_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);

-- Comentários explicativos
COMMENT ON TABLE tenants IS 'Empresas cadastradas no sistema (multi-tenant)';
COMMENT ON TABLE users IS 'Usuários do sistema: SuperAdmin (0), HR (1), Employee (2)';
COMMENT ON TABLE dishes IS 'Pratos disponíveis. tenant_id NULL = global para todas empresas';
COMMENT ON TABLE orders IS 'Pedidos de almoço dos funcionários';

COMMENT ON COLUMN users.role IS '0=SuperAdmin, 1=HR, 2=Employee';
COMMENT ON COLUMN users.tenant_id IS 'NULL para SuperAdmin, obrigatório para HR e Employee';
COMMENT ON COLUMN dishes.tenant_id IS 'NULL = prato disponível para todas as empresas';
