# 🚀 Deploy Guide

Este projeto está configurado para deploy em **Render (Backend)** e **Vercel (Frontend)**.

---

## 📦 Backend - Deploy no Render

### Pré-requisitos
- **Conta no [Render](https://render.com) via GitHub** ⭐
  - Recomendado: Fazer login com sua conta GitHub
  - Facilita muito o auto-deploy e integração
- Repositório GitHub criado

### Passos

1. **Criar PostgreSQL Database no Render**
   - Dashboard → New → Postgres
   - Nome: `order-management-db`
   - Região: **Virginia (US East)**
   - Plano: Free
   - Após criar, clicar no banco de dados,e na aba "Info" anotar os 4 campos:
     - Hostname
     - Port
     - Database
     - Username
     - Password

2. **Criar Web Service**
   - Dashboard → New → Web Service
   - Conectar seu repositório GitHub
   - **Runtime:** Docker
   - **Root Directory:** `backend` (para auto-deploy apenas quando backend muda)
   - **Plano:** Free 

3. **Configurar Variáveis de Ambiente**
   - Na aba "Environment", adicionar as variáveis (copiar os valores da seção "Info" do Database):
   ```
   DATABASE_URL=jdbc:postgresql://{Hostname}:{Port}/{Database}
   DB_USER={Username}
   DB_PASSWORD={Password}
   JWT_SECRET=seu_jwt_secret_muito_seguro_e_longo_aqui_min_32_caracteres
   SPRING_PROFILES_ACTIVE=prod
   ```
   - **Nota:** Substituir os valores entre `{}` pelos dados reais do Postgres que estão em "Info"

4. **Verificar Deploy**
   - Render auto-deploy a cada push em `main` (apenas pasta `backend`)
   - Backend URL: `https://seu-projeto.onrender.com`
   - **Testar conexão:** 
     ```bash
     # Terminal
     curl https://seu-backend.onrender.com/actuator/health
     # Deve retornar: {"status":"UP"}
     ```
   - **Swagger:** `https://seu-projeto.onrender.com/swagger-ui`
     - Retorna 401 se não tiver token JWT (esperado, não é erro)
     - Disponibilizado apenas em ambiente de desenvolvimento

---

## 🎨 Frontend - Deploy no Vercel

### Pré-requisitos
- **Conta no [Vercel](https://vercel.com) via GitHub** ⭐
  - Recomendado: Fazer login com sua conta GitHub
  - Facilita muito o auto-deploy e integração
- Repositório GitHub criado

### Passos

1. **Importar Projeto**
   - Vercel Dashboard → Add New → Project
   - Selecionar seu repositório GitHub
   - Framework: **Vite**
   - Root Directory: `./frontend`

2. **Configurar Build**
   - **Build Command:** `npm run build` (padrão)
   - **Output Directory:** `dist` (padrão)
   - Deixar como está (Vercel detecta automaticamente)

3. **Configurar Variáveis de Ambiente**
   - Na aba "Settings" → "Environment Variables", adicionar:
   ```
   VITE_API_URL=https://seu-backend.onrender.com
   ```
   - **Importante:** Usar URL do backend em produção (Render)
   - **Nota:** Swagger no Vercel retorna 404 (Swagger está no backend, não no frontend)

4. **Deploy**
   - Vercel auto-deploy a cada push em `main`
   - Frontend URL: `https://seu-projeto.vercel.app`

---

## 🔗 Conectar Frontend ao Backend

### Development Local
```bash
# Terminal 1: Backend (com perfil dev)
cd backend
$env:SPRING_PROFILES_ACTIVE="dev" ; mvn spring-boot:run

# Terminal 2: Frontend
cd frontend
npm run dev
# VITE_API_URL=http://localhost:8080 (automático)
```

### Production (Vercel + Render)

**No Vercel:**
1. Settings → Environment Variables
2. Adicionar: `VITE_API_URL=https://seu-backend.onrender.com`
3. Redeploy (Redeploy project)

**Verificar conexão:**
```bash
# No console do navegador
fetch('https://seu-backend.onrender.com/swagger-ui').then(r => console.log(r.status))
# Deve retornar 401 (não autorizado)
```

---

## 📝 Troubleshooting

### Backend não responde no Render
- Verificar logs: Dashboard → Service → Logs
- **Comum:** Variáveis de ambiente incorretas (DATABASE_URL, DB_USER, DB_PASSWORD)
- **Solução:** Copiar os valores exatos de "Info" do Database PostgreSQL
  - Verificar que não tem espaços em branco
  - Formato: `jdbc:postgresql://hostname:5432/database` (sem `{}`)

### Frontend mostra erro de CORS
- Backend não está retornando header `Access-Control-Allow-Origin`
- Verificar [`SecurityConfig.java`](backend/src/main/java/com/github/lucasballonecker/ordermanagement/config/SecurityConfig.java ) → `.cors()`
- Produção: Adicionar URL do Vercel ao allowed origins

### Conexão timeout no Render (Free Plan)
- Render Free coloca app em sleep após 15 min sem requisições
- **Solução:** Configure Health Check no Render:
  - Dashboard → Web Service → Settings
  - Health Check Path: `/actuator/health`
  - Health Check Interval: 5 minutos
- **Ou:** Upgrade para Starter ($7/mês)

### Frontend mostra erro de API (CORS, 401, etc)
- **401 no Login:** Backend rejeitou credenciais (esperado se wrong password)
- **404 em /swagger-ui:** Swagger está no backend (onrender.com), não no frontend (vercel.app)
- **CORS error:** Verificar `SecurityConfig.java` permite Vercel URL
- Verificar se está usando `import.meta.env.VITE_API_URL` no código
- Não funciona com `process.env` (isso é para Node, não navegador)

---

## 🛡️ Segurança em Produção

- ✅ JWT_SECRET: Mínimo 32 caracteres, aleatório
- ✅ HTTPS: Vercel e Render fornecem automaticamente
- ✅ Database: Usar URL fornecida pelo Render (protegida)
- ✅ CORS: Restringir a domínio do frontend
- ✅ Senhas: Nunca commitar no Git, sempre usar env vars

---

## 📊 Exemplo de URLs em Produção

```
Frontend:   https://seu-projeto.vercel.app
Backend:    https://seu-backend.onrender.com
Swagger:    https://seu-backend.onrender.com/swagger-ui
Database:   postgresql://{Hostname}:{Port}/{Database} (ver dados em "Info" do Postgres no Render)
```

---

## ✅ Checklist antes de ir para Produção

- [ ] Backend em Render (com PostgreSQL)
- [ ] Frontend em Vercel
- [ ] VITE_API_URL setada corretamente no Vercel
- [ ] JWT_SECRET gerado e setado no Render
- [ ] CORS configurado no backend
- [ ] Testes rodando (`npm test` no frontend, `mvn test` no backend)
- [ ] Docker Compose funcionando localmente
- [ ] README.md atualizado com URLs de produção
