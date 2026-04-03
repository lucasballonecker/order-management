# 🛒 Order Management System

<div align="center">

![Java](https://img.shields.io/badge/Java-17-orange?style=flat&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.9-brightgreen?style=flat&logo=spring-boot)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.3-646cff?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38bdf8?style=flat&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-28.0.1-blue?style=flat&logo=docker)

**Aplicação fullstack completa para gerenciamento de pedidos com Spring Boot, React e PostgreSQL**

</div>

## 📋 Sobre

Sistema completo para gerenciamento de pedidos desenvolvido com arquitetura fullstack, combinando um backend robusto em Spring Boot com um frontend moderno em React.

### ✅ Features Principais

#### Backend
- 🔐 **Autenticação JWT** com role-based access control
- 📦 **CRUD de Produtos** com paginação e validação
- 🛒 **Gestão de Pedidos** com múltiplos itens e status
- 🛡️ **Segurança** com BCrypt e variáveis de ambiente
- 📚 **Documentação** OpenAPI/Swagger
- 🧪 **Testes** unitários e de integração

#### Frontend
- 🎨 **Interface moderna** e responsiva com Tailwind CSS
- 🔐 **Autenticação JWT** com Context API
- 🛒 **Carrinho de compras** integrado
- 📱 **Design responsivo** para mobile e desktop
- 🔄 **Rotas protegidas** por role (USER/ADMIN)
- 📊 **Painel administrativo** para gestão de pedidos
- ⚡ **Carregamento otimizado** com Vite
- 🧪 **Testes** com Vitest e React Testing Library

---

## 🚀 Quick Start

### 📋 Pré-requisitos

- Java 17+
- Maven 3.8+
- Node.js 20+
- Docker & Docker Compose

### ⚡ Instalação

1. **Clone o projeto**
   ```bash
   git clone https://github.com/lucasballonecker/order-management-api.git
   cd order-management-api
   ```

2. **Configure ambiente**
   
   **Windows (PowerShell):**
   ```powershell
   copy backend\.env.example backend\.env
   copy frontend\.env.example frontend\.env.local
   ```
   
   **Linux/Mac (Bash):**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```
   
   > ⚠️ **Importante:** Edite os arquivos `.env` com suas credenciais. Nunca faça commit desses arquivos - eles contêm segredos e não são versionados.

3. **Execute com Docker (Recomendado)**
   ```bash
   docker-compose up --build
   ```
   - Carrega automaticamente `backend/.env` para PostgreSQL e o serviço backend
   - Frontend disponível em: http://localhost:5173
   - API disponível em: http://localhost:8080

4. **Ou execute localmente**
   
   **Backend** (usa H2 em memória, nenhuma configuração de banco necessária):
   
   **Windows (PowerShell):**
   ```powershell
   cd backend
   $env:SPRING_PROFILES_ACTIVE="dev"; ./mvnw.cmd spring-boot:run
   ```
   
   **Linux/Mac (Bash):**
   ```bash
   cd backend
   ./mvnw spring-boot:run -Dspring.profiles.active=dev
   ```
   
   > O perfil `dev` utiliza H2 como banco de dados em memória, ideal para desenvolvimento sem dependências externas.
   
   **Frontend** (novo terminal):
   
   **Windows (PowerShell):**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   
   **Linux/Mac (Bash):**
   ```bash
   cd frontend && npm install && npm run dev
   ```
   
   > A aplicação estará disponível em http://localhost:5173

5. **Acesse a aplicação**
   - 🎨 **Frontend**: http://localhost:5173
   - 🌐 **API**: http://localhost:8080
   - 📚 **Documentação Swagger**: http://localhost:8080/swagger-ui.html
   - 💓 **Health Check**: http://localhost:8080/actuator/health

---

## ⚙️ Backend

### Tecnologias

- **Java 17** - Linguagem com records, pattern matching e text blocks
- **Spring Boot 3.5.9** - Framework para APIs REST robustas
- **Spring Security 6** - Segurança com autenticação e autorização
- **JWT** - Tokens para autenticação stateless
- **BCrypt** - Hash de senhas seguro
- **PostgreSQL 16** - Banco de dados relacional principal
- **H2** - Banco em memória para desenvolvimento e testes
- **Flyway** - Migrações de banco de dados versionadas
- **OpenAPI/Swagger** - Documentação automática da API
- **Docker** - Containerização da aplicação
- **JUnit 5, Mockito** - Testes unitários e de integração

### Features

- **Autenticação JWT**: Login com tokens de 8 horas de expiração
- **Role-based Access Control**: Permissões diferenciadas para USER e ADMIN
- **CRUD de Produtos**: Gerenciamento com paginação e validações
- **Gestão de Pedidos**: Pedidos com múltiplos itens e controle de status
- **Segurança**: Senhas com BCrypt, CORS configurado, variáveis de ambiente
- **Documentação**: Swagger UI para teste interativo dos endpoints
- **Banco de Dados**: PostgreSQL em produção, H2 em desenvolvimento/testes
- **Migrações**: Flyway para versionamento do schema do banco
- **Testes**: 51 testes cobrindo validações, segurança e CRUD

### Arquitetura

```
backend/src/main/java/com/github/lucasballonecker/ordermanagement/
├── controller/     # Endpoints REST (API endpoints)
├── service/        # Lógica de negócio (business logic)
├── repository/     # Acesso a dados com JPA (data access)
├── domain/         # Entidades JPA (entities)
├── dto/            # Data Transfer Objects (request/response)
├── security/       # Configuração JWT e autenticação
├── config/         # Configurações gerais (CORS, Swagger, etc.)
└── shared/         # Utilitários e exceções
```

---

## 🎨 Frontend

### Tecnologias

- **React 19** - Biblioteca UI com hooks e functional components
- **TypeScript 5.9** - Type safety e melhor DX
- **Vite 7.3** - Build tool ultrarrápido
- **Tailwind CSS 4** - Estilização utility-first
- **React Router DOM 7** - Roteamento e navegação
- **Axios** - Cliente HTTP com interceptors
- **Vitest** - Framework de testes unitários

### Features

- **Autenticação JWT**: Login/register com tokens JWT e refresh automático
- **Rotas Protegidas**: Acesso restrito baseado em roles (USER/ADMIN)
- **Catálogo de Produtos**: Listagem com paginação e ordenação
- **Carrinho de Compras**: Adicionar/remover itens antes de finalizar pedido
- **Gestão de Pedidos**: 
  - Usuários veem seus próprios pedidos
  - Admin gerencia todos os pedidos e atualiza status
- **UI Responsiva**: Layout adaptável para mobile, tablet e desktop
- **Error Handling**: Tratamento de erros com feedback visual
- **Loading States**: Spinners e indicadores de carregamento

### Arquitetura

```
frontend/src/
├── pages/          # Páginas principais (Login, Products, Orders, AdminOrders)
├── components/     # Componentes reutilizáveis (Navbar, ProtectedRoute, UI)
├── services/       # Serviços de API (productService, orderService)
├── contexts/       # Context API para estado global (Auth)
├── hooks/          # Custom hooks (useAuth)
├── types/          # Types TypeScript (auth, product, order, pagination)
├── utils/          # Utilitários (JWT, error handling)
├── layouts/        # Layouts de página (MainLayout)
└── routes/         # Configuração de rotas
```

---

## 📚 Documentação da API

### 🔐 Autenticação

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 📦 Produtos

```http
# Listar produtos (USER/ADMIN)
GET /products
Authorization: Bearer {token}

# Criar produto (ADMIN apenas)
POST /products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Notebook Dell",
  "description": "Notebook Dell Inspiron 15",
  "price": 4500.00
}

# Desativar produto (ADMIN apenas)
DELETE /products/{id}
Authorization: Bearer {token}

# Buscar produto por ID (USER/ADMIN)
GET /products/{id}
Authorization: Bearer {token}
```

### 🛒 Pedidos

```http
# Criar pedido (USER)
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}

# Atualizar status (ADMIN)
PATCH /orders/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "SHIPPED"
}

# Listar meus pedidos (USER)
GET /orders/me
Authorization: Bearer {token}

# Listar todos os pedidos (ADMIN)
GET /orders
Authorization: Bearer {token}

# Buscar pedido por ID (USER/ADMIN)
GET /orders/{id}
Authorization: Bearer {token}
```

### 👥 Usuários

```http
# Registrar novo usuário (Público)
POST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "password123"
}
```

---

## 🏗️ Arquitetura

### Backend

```
src/main/java/com/github/lucasballonecker/ordermanagement/
├── controller/     # Endpoints REST
├── service/        # Lógica de negócio
├── repository/     # Acesso a dados (JPA)
├── domain/         # Entidades
├── dto/            # Data Transfer Objects
├── security/       # JWT e autenticação
├── config/         # Configurações
└── shared/         # Utilitários
```

### Frontend

```
frontend/src/
├── pages/          # Páginas principais
├── components/     # Componentes reutilizáveis
├── services/       # Serviços de API
├── contexts/       # Context API
├── hooks/          # Custom hooks
├── types/          # Types TypeScript
├── utils/          # Utilitários
├── layouts/        # Layouts de página
└── routes/         # Configuração de rotas
```

## 🧪 Testing

### Backend

**Windows (PowerShell):**
```powershell
cd backend
./mvnw.cmd test
```

**Linux/Mac (Bash):**
```bash
cd backend && ./mvnw test
```

**Métricas:**
- 📊 **51 testes** implementados
- 🎯 **Validações** cobertas
- 🔐 **Segurança** testada
- 📦 **CRUD** verificado

### Frontend

**Windows (PowerShell):**
```powershell
cd frontend
npm test

# Executar com UI
npm run test -- --ui
```

**Linux/Mac (Bash):**
```bash
cd frontend && npm test

# Executar com UI
cd frontend && npm run test -- --ui
```

**Métricas:**
- 📊 **Testes unitários** para componentes e serviços
- 🎯 **Cobertura** de funcionalidades principais
- 🔐 **Autenticação** e rotas protegidas testadas
- 📦 **Integração** com API verificada

---

## 🔧 Configuração

### 🌍 Perfis

#### Backend
- **dev**: H2 em memória + console habilitado
- **test**: H2 + flyway desabilitado
- **docker**: PostgreSQL + flyway habilitado
- **prod**: PostgreSQL + configurações de produção

#### Frontend
- **development**: Vite dev server com hot reload
- **production**: Build otimizado para produção

### 🔧 Variáveis de Ambiente

#### Backend (`backend/.env`)
As variáveis de ambiente do backend são necessárias apenas ao executar com Docker ou em produção (perfis `docker` e `prod`). Para desenvolvimento local com o perfil `dev` (H2), essas variáveis são opcionais.

- **POSTGRES_DB**: Nome do banco de dados PostgreSQL (padrão: orderdb) - *apenas para Docker/Produção*
- **POSTGRES_USER**: Usuário do banco PostgreSQL (padrão: postgres) - *apenas para Docker/Produção*
- **POSTGRES_PASSWORD**: Senha do banco PostgreSQL (⚠️ altere em produção) - *apenas para Docker/Produção*
- **JWT_SECRET**: Chave secreta para tokens JWT (⚠️ gere uma nova para produção) - *necessária em todos os ambientes*

#### Frontend (`frontend/.env.local`)
- **VITE_API_URL**: URL da API Backend (padrão: http://localhost:8080)

**Notas de Segurança:**
- ✗ Nunca faça commit de arquivos `.env` no controle de versão
- ✗ Nunca use credenciais padrão em produção
- ✓ Use segredos fortes e gerados aleatoriamente
- ✓ Rotacione segredos periodicamente
- ✓ Use um gerenciador de segredos para produção (AWS Secrets Manager, Vault, etc.)

---

## 🐳 Docker

### 🌘 Build & Execução

```bash
# Build e inicia todos os serviços (backend, frontend, database)
docker-compose up --build

# Em background
docker-compose up -d

# Logs
docker-compose logs -f app
docker-compose logs -f frontend

# Stop
docker-compose down
```

### 📋 Serviços

- **db**: PostgreSQL 16 (porta 5432)
- **app**: Aplicação Spring Boot (porta 8080)
- **frontend**: Aplicação React (porta 5173)
- **Health Check**: Verificação automática de saúde

---

## 🔐 Segurança

### 🛡️ Implementações

- ✅ **JWT** com expiração de 8 horas
- ✅ **BCrypt** para hash de senhas
- ✅ **Role-based access control** (USER/ADMIN)
- ✅ **Variáveis de ambiente** para segredos
- ✅ **.env no .gitignore**
- ✅ **CORS** configurado para produção
- ✅ **HTTPS** em produção (Vercel + Render)

### 🔒 Roles & Permissões

| Recurso | USER | ADMIN |
|---------|------|-------|
| Criar pedido | ✅ | ✅ |
| Listar meus pedidos | ✅ | ❌ |
| Listar todos os pedidos | ❌ | ✅ |
| Buscar pedido por ID | ✅ | ✅ |
| Atualizar status do pedido | ❌ | ✅ |
| Listar produtos | ✅ | ✅ |
| Criar produto | ❌ | ✅ |
| Desativar produto | ❌ | ✅ |
| Registrar usuário | ✅ | ✅ |

---

## 📊 Monitoramento

### 🏥 Health Checks

```bash
# Health check geral
curl http://localhost:8080/actuator/health

# Resposta
{
  "status": "UP"
}
```

### 📝 Logs

```properties
# Níveis de log configurados
logging.level.com.github.lucasballonecker.ordermanagement=INFO
logging.level.org.springframework.security=DEBUG
```

---

## 🚀 Deploy

Este projeto está configurado para deploy automatizado:

- **Backend**: Render (Docker + PostgreSQL)
- **Frontend**: Vercel (SPA com Vite)
- **CI/CD**: GitHub Actions (build, testes e push Docker)

Para instruções detalhadas de deploy, consulte o [guia de deploy](DEPLOY.md).

### URLs de Produção (Exemplo)

```
Frontend:   https://seu-projeto.vercel.app
Backend:    https://seu-backend.onrender.com
```

---

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Add nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

<div align="center">

**🚀 Desenvolvido por [Lucas Ballonecker](https://github.com/lucasballonecker)**

[![GitHub](https://img.shields.io/badge/Github-lucasballonecker-blue?style=flat&logo=github)](https://github.com/lucasballonecker)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-lucasballonecker-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/lucasballonecker)

</div>