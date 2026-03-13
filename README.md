# 🛒 Order Management API

<div align="center">

![Java](https://img.shields.io/badge/Java-17-orange?style=flat&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.9-brightgreen?style=flat&logo=spring-boot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-28.0.1-blue?style=flat&logo=docker)

**API RESTful para gerenciamento de pedidos com Spring Boot, JWT e PostgreSQL**

</div>

## 📋 Sobre

API completa para gerenciamento de pedidos desenvolvida com Spring Boot 3.5.9 e Java 17

### ✅ Features Principais

- 🔐 **Autenticação JWT** com role-based access control
- 📦 **CRUD de Produtos** com paginação e validação
- 🛒 **Gestão de Pedidos** com múltiplos itens e status
- 🛡️ **Segurança** com BCrypt e variáveis de ambiente
- 🐳 **Docker** com multi-stage build
- 📚 **Documentação** OpenAPI/Swagger
- 🧪 **Testes** unitários e de integração

---

## 🚀 Quick Start

### 📋 Pré-requisitos

- Java 17+
- Maven 3.8+
- Docker & Docker Compose

### ⚡ Instalação

1. **Clone o projeto**
   ```bash
   git clone https://github.com/lucasballonecker/order-management-api.git
   cd order-management-api
   ```

2. **Configure ambiente**
   
   **Backend** (Docker):
   ```bash
   cp backend/.env.example backend/.env
   # Edite backend/.env com suas credenciais de banco de dados e JWT_SECRET
   # ⚠️  Nunca faça commit do arquivo .env - contém segredos/credenciais
   ```
   
   **Frontend** (Local development):
   ```bash
   cp frontend/.env.example frontend/.env.local
   # Edite frontend/.env.local apenas se o backend não estiver em http://localhost:8080
   # O arquivo .env.local NÃO é versionado (veja .gitignore)
   ```

3. **Execute com Docker (Recomendado)**
   ```bash
   docker-compose up --build
   ```
   - Carrega automaticamente `backend/.env` para PostgreSQL e o serviço backend
   - API disponível em: http://localhost:8080

4. **Ou execute localmente**
   
   **Backend** (usa H2 em memória, nenhuma configuração de banco necessária):
   ```bash
   cd backend && ./mvnw spring-boot:run -Dspring.profiles.active=dev
   ```
   O perfil `dev` utiliza H2 como banco de dados em memória, ideal para desenvolvimento sem dependências externas.
   
   **Frontend** (novo terminal):
   ```bash
   cd frontend && npm install && npm run dev
   # Abre http://localhost:5173
   ```

5. **Acesse a API**
   - 🌐 **API**: http://localhost:8080
   - 📚 **Documentação Swagger**: http://localhost:8080/swagger-ui.html
   - 💓 **Health Check**: http://localhost:8080/actuator/health

---

## 🔐 Variáveis de Ambiente

### Backend (`backend/.env`)
As variáveis de ambiente do backend são necessárias apenas ao executar com Docker ou em produção (perfis `docker` e `prod`). Para desenvolvimento local com o perfil `dev` (H2), essas variáveis são opcionais.

- **POSTGRES_DB**: Nome do banco de dados PostgreSQL (padrão: orderdb) - *apenas para Docker/Produção*
- **POSTGRES_USER**: Usuário do banco PostgreSQL (padrão: postgres) - *apenas para Docker/Produção*
- **POSTGRES_PASSWORD**: Senha do banco PostgreSQL (⚠️ altere em produção) - *apenas para Docker/Produção*
- **JWT_SECRET**: Chave secreta para tokens JWT (⚠️ gere uma nova para produção) - *necessária em todos os ambientes*

### Frontend (`frontend/.env.local`)
- **VITE_API_URL**: URL da API Backend (padrão: http://localhost:8080)

**Notas de Segurança:**
- ✗ Nunca faça commit de arquivos `.env` no controle de versão
- ✗ Nunca use credenciais padrão em produção
- ✓ Use segredos fortes e gerados aleatoriamente
- ✓ Rotacione segredos periodicamente
- ✓ Use um gerenciador de segredos para produção (AWS Secrets Manager, Vault, etc.)

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

### 🎯 Tecnologias

- **Backend**: Java 17, Spring Boot 3.5.9
- **Segurança**: Spring Security, JWT, BCrypt
- **Banco**: PostgreSQL, H2 (dev/test), Flyway
- **Documentação**: OpenAPI/Swagger
- **Container**: Docker, Docker Compose
- **Testes**: JUnit 5, Mockito, Spring Test

---

## 🧪 Testing

```bash
# Executar todos os testes
cd backend && ./mvnw test
```

**Métricas:**
- 📊 **51 testes** implementados
- 🎯 **Validações** cobertas
- 🔐 **Segurança** testada
- 📦 **CRUD** verificado

---

## 🔧 Configuração

### 🌍 Perfis

- **dev**: H2 em memória + console habilitado
- **test**: H2 + flyway desabilitado
- **docker**: PostgreSQL + flyway habilitado
- **prod**: PostgreSQL + configurações de produção

### 🔧 Variáveis de Ambiente

```bash
# backend/.env
POSTGRES_DB=orderdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
JWT_SECRET=your-super-secret-jwt-key
```

---

## 🐳 Docker

### 🌘 Build & Execução

```bash
# Build e inicia
docker-compose up --build

# Em background
docker-compose up -d

# Logs
docker-compose logs -f app

# Stop
docker-compose down
```

### 📋 Serviços

- **app**: Aplicação Spring Boot (porta 8080)
- **db**: PostgreSQL 16 (porta 5432)
- **Health Check**: Verificação automática de saúde

---

## 🔐 Segurança

### 🛡️ Implementações

- ✅ **JWT** com expiração de 8 horas
- ✅ **BCrypt** para hash de senhas
- ✅ **Role-based access control** (USER/ADMIN)
- ✅ **Variáveis de ambiente** para segredos
- ✅ **.env no .gitignore**

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
