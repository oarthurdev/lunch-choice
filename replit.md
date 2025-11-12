# Sistema Multi-Tenant de Escolha de Almoço Corporativo

## Visão Geral
Sistema SaaS para gestão de pedidos de almoço corporativo com arquitetura multi-tenant. Permite que empresas gerenciem seus funcionários e pedidos diários de forma isolada e segura.

## Data do Projeto
**Criado em:** 12 de Novembro de 2025

## Arquitetura do Projeto

### Stack Tecnológica
- **Frontend:** React 18 + Vite + TailwindCSS
- **Backend:** ASP.NET Core 8.0 Web API (C#)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** JWT Bearer
- **Cron Jobs:** Hangfire
- **Geração de PDFs:** QuestPDF

### Estrutura de Pastas
```
/
├── backend/              # API ASP.NET Core
│   ├── Controllers/      # Endpoints da API
│   ├── Models/          # Entidades do banco
│   ├── DTOs/            # Data Transfer Objects
│   ├── Services/        # Lógica de negócio
│   ├── Data/            # Contexto EF Core
│   ├── Middleware/      # Middlewares customizados
│   └── Jobs/            # Tarefas agendadas (Hangfire)
├── frontend/            # Aplicação React
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/       # Páginas por perfil
│   │   ├── context/     # Contextos React (auth, etc)
│   │   ├── services/    # Chamadas API
│   │   └── utils/       # Funções auxiliares
└── database/            # Scripts SQL Supabase
```

## Perfis de Usuário

### 1. Super Admin (Proprietária do Sistema)
- Gerencia empresas (tenants)
- Cadastra pratos do dia (globais ou por empresa)
- Cria usuários RH
- Acessa relatórios mensais consolidados
- Acesso total ao sistema

### 2. RH (Recursos Humanos)
- Cadastra funcionários da própria empresa
- Visualiza pedidos do dia da empresa
- Acessa relatórios diários em PDF
- Sem acesso a outras empresas

### 3. Funcionário
- Escolhe prato do dia (até 10h)
- Visualiza cardápio disponível
- Recuperação de senha
- Sem auto-registro

## Regras de Negócio

### Pedidos
- Funcionários podem fazer pedido até 10h
- Após 10h: mensagem "Passou do horário de solicitação do almoço!"
- 1 pedido por dia por funcionário
- Pedidos vinculados ao tenant (empresa)

### Relatórios
- **Diário (10h):** PDF automático com todos os pedidos do dia por empresa
- **Mensal:** PDF consolidado de todas as empresas (apenas Super Admin)

### Multi-Tenant
- Isolamento de dados via `tenant_id`
- RH vê apenas dados da própria empresa
- Super Admin vê tudo

## Configuração do Ambiente

### Backend (Local)
O backend C# deve ser executado localmente. Instruções no README.md:
1. Instalar .NET 8.0 SDK
2. Configurar connection string do Supabase em `appsettings.json`
3. Executar migrations
4. Rodar `dotnet run`

### Frontend (Replit)
O frontend React será executado no Replit:
- Porta: 5000
- Hot reload habilitado
- Conecta-se ao backend local via CORS

### Banco de Dados
Supabase PostgreSQL com schema multi-tenant:
- Scripts de inicialização em `/database/schema.sql`
- Seed data para testes em `/database/seed.sql`

## Mudanças Recentes
- **12/11/2025:** Estrutura inicial do projeto criada
- **12/11/2025:** Configuração de backend ASP.NET Core multi-tenant
- **12/11/2025:** Configuração de frontend React + Vite + TailwindCSS

## Próximos Passos
- [ ] Configurar Supabase e executar migrations
- [ ] Testar autenticação JWT
- [ ] Validar cron job de geração de PDFs
- [ ] Testes de integração entre frontend e backend

## Observações Técnicas
- CORS configurado para desenvolvimento local
- JWT tokens com expiração de 24h
- Senhas hasheadas com BCrypt
- Timezone configurado para America/Sao_Paulo
