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
- 🛡️ **Segurança** com BCrypt e environment variables
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
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

3. **Execute com Docker (Recomendado)**
   ```bash
   docker-compose up --build
   ```

4. **Ou execute localmente**
   ```bash
   ./mvnw spring-boot:run -Dspring.profiles.active=dev
   ```

5. **Acesse a API**
   - 🌐 **API**: http://localhost:8080
   - 📚 **Swagger**: http://localhost:8080/swagger-ui.html
   - 💓 **Health**: http://localhost:8080/actuator/health

---

## 📚 API Documentation

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
./mvnw test
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

### 🔧 Environment Variables

```bash
# .env
POSTGRES_DB=orderdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
JWT_SECRET=your-super-secret-jwt-key
```

---

## 🐳 Docker

### 🏗️ Build & Run

```bash
# Build e start
docker-compose up --build

# Background
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
- ✅ **Role-based access** (USER/ADMIN)
- ✅ **Environment variables** para secrets
- ✅ **.env no .gitignore**

### 🔒 Roles & Permissões

| Recurso | USER | ADMIN |
|---------|------|-------|
| Criar pedido | ✅ | ✅ |
| Listar meus pedidos | ✅ | ❌ |
| Listar todos pedidos | ❌ | ✅ |
| Buscar pedido por ID | ✅ | ✅ |
| Atualizar status pedido | ❌ | ✅ |
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

# Response
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

1. Fork o projeto
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
