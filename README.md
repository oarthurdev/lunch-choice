# 🍽️ Sistema Multi-Tenant de Escolha de Almoço Corporativo

Sistema SaaS para gestão de pedidos de almoço em empresas, com suporte multi-tenant, autenticação JWT e geração automática de relatórios em PDF.

## 📋 Funcionalidades

### Super Admin (Proprietária do Sistema)
- ✅ Cadastro e gerenciamento de empresas
- ✅ Cadastro de pratos do dia (globais ou por empresa)
- ✅ Criação de usuários RH
- ✅ Relatórios mensais consolidados (PDF)
- ✅ Acesso total ao sistema

### RH (Recursos Humanos)
- ✅ Cadastro de funcionários da empresa
- ✅ Visualização de pedidos do dia
- ✅ Geração de relatórios diários (PDF)
- ✅ Acesso restrito à própria empresa

### Funcionário
- ✅ Login com recuperação de senha
- ✅ Escolha de prato do dia (até 10h)
- ✅ Visualização do cardápio disponível
- ✅ Bloqueio após horário limite

## 🚀 Tecnologias

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router DOM
- Axios
- React Hook Form
- date-fns

### Backend
- ASP.NET Core 8.0 Web API
- Entity Framework Core
- PostgreSQL (Supabase)
- JWT Bearer Authentication
- Hangfire (Cron Jobs)
- QuestPDF (Geração de PDFs)
- BCrypt.Net (Hash de senhas)
- FluentValidation

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ (para frontend)
- .NET 8.0 SDK (para backend)
- Conta Supabase (banco de dados PostgreSQL)

### 1. Configurar Banco de Dados (Supabase)

1. Criar um projeto no [Supabase](https://supabase.com)

2. Acessar o SQL Editor no painel do Supabase

3. Executar o script de schema:
   - Abra o arquivo `database/schema.sql`
   - Copie todo o conteúdo
   - Cole e execute no SQL Editor do Supabase

4. (Opcional mas recomendado) Executar dados de teste:
   - Abra o arquivo `database/seed.sql`
   - Copie todo o conteúdo
   - Cole e execute no SQL Editor do Supabase
   - Isso criará um Super Admin e dados de exemplo para testar

⚠️ **IMPORTANTE:** O banco de dados é gerenciado via scripts SQL, não via migrations do Entity Framework. O EF Core é usado apenas como ORM no código.

### 2. Configurar Backend (ASP.NET Core)

1. Navegar para a pasta backend:
```bash
cd backend
```

2. Instalar dependências:
```bash
dotnet restore
```

3. Configurar connection string no `appsettings.json`:

Obtenha sua connection string no Supabase (Settings > Database > Connection String) e configure:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.xxxxx.supabase.co;Database=postgres;Username=postgres;Password=sua_senha_aqui;Port=5432;SSL Mode=Require;Trust Server Certificate=true"
  },
  "Jwt": {
    "SecretKey": "sua_chave_secreta_jwt_aqui_minimo_32_caracteres",
    "Issuer": "LunchSystem",
    "Audience": "LunchSystemUsers",
    "ExpirationHours": 24
  }
}
```

⚠️ **IMPORTANTE:** Substitua `xxxxx` pelo ID do seu projeto Supabase e `sua_senha_aqui` pela senha do banco.

4. Rodar o backend:
```bash
dotnet run
```

O backend estará rodando em: `http://localhost:5001`

### 3. Configurar Frontend (React + Vite)

1. Navegar para a pasta frontend:
```bash
cd frontend
```

2. Instalar dependências:
```bash
npm install
```

3. Configurar URL da API no arquivo `.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

4. Rodar o frontend:
```bash
npm run dev
```

O frontend estará rodando em: `http://localhost:5000`

## 🔑 Primeiro Acesso

### Criar Super Admin Inicial

Após executar o seed, você terá um usuário Super Admin padrão:

- **Email:** admin@lunchsystem.com
- **Senha:** Admin@123

⚠️ **IMPORTANTE:** Altere esta senha após o primeiro login!

## 📅 Cron Jobs

### Geração Automática de PDFs (10h diariamente)

O sistema utiliza Hangfire para executar automaticamente:
- Geração de relatórios diários em PDF às 10h
- PDFs salvos em `backend/Reports/Daily/{data}/`
- Um PDF por empresa com todos os pedidos do dia

Acesse o dashboard do Hangfire: `http://localhost:5001/hangfire`

## 🗂️ Estrutura do Projeto

```
/
├── backend/
│   ├── Controllers/          # Endpoints da API
│   ├── Models/              # Entidades do banco
│   ├── DTOs/                # Data Transfer Objects
│   ├── Services/            # Lógica de negócio
│   ├── Data/                # Contexto EF Core
│   ├── Middleware/          # Middlewares
│   ├── Jobs/                # Cron jobs
│   ├── Reports/             # PDFs gerados
│   ├── appsettings.json     # Configurações
│   └── Program.cs           # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas
│   │   │   ├── SuperAdmin/  # Painel Super Admin
│   │   │   ├── RH/          # Painel RH
│   │   │   └── Employee/    # Painel Funcionário
│   │   ├── context/         # Contextos (Auth)
│   │   ├── services/        # API calls
│   │   └── utils/           # Utilitários
│   ├── index.html
│   └── vite.config.js
└── database/
    ├── schema.sql           # Schema do banco
    └── seed.sql             # Dados iniciais
```

## 🔒 Segurança

- Senhas hasheadas com BCrypt
- Autenticação via JWT Bearer
- Isolamento multi-tenant por `tenant_id`
- Validação de permissões em todos os endpoints
- CORS configurado para domínios permitidos

## 📱 Regras de Negócio

### Pedidos
- Funcionários podem fazer pedido **até 10h**
- Após 10h: mensagem de bloqueio
- 1 pedido por dia por funcionário
- Não é possível editar pedido após criação

### Cardápio
- Cadastrado pela Super Admin
- Pode ser global ou específico por empresa
- Data de validade configurável

### Relatórios
- **Diário:** Gerado automaticamente às 10h
- **Mensal:** Disponível para Super Admin sob demanda

## 🛠️ Comandos Úteis

### Backend
```bash
# Criar nova migration
dotnet ef migrations add NomeDaMigration

# Aplicar migrations
dotnet ef database update

# Reverter última migration
dotnet ef database update PreviousMigration

# Build do projeto
dotnet build

# Rodar em modo produção
dotnet run --configuration Release
```

### Frontend
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

## 📄 Licença

Projeto proprietário - Todos os direitos reservados

## 👥 Suporte

Para dúvidas e suporte, entre em contato com a equipe de desenvolvimento.
