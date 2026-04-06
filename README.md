# Sistema Gerenciador de Tarefas Online

## Visão Geral

Este projeto consiste no desenvolvimento de um sistema web para gerenciamento de tarefas e projetos, com foco em organização, acompanhamento e produtividade de equipes.

O sistema será utilizado como solução real para apoiar uma organização parceira na gestão de suas atividades internas.

---

## Objetivo do Sistema

Permitir que usuários:

- Gerenciem projetos de forma estruturada
- Criem e acompanhem tarefas
- Organizem atividades em fluxo Kanban
- Visualizem prazos e entregas
- Colaborem em equipe

---

## Stack Tecnológica (Definição Real)

### Backend
- Node.js
- Express
- Prisma ORM
- Banco de dados: PostgreSQL (produção) / SQLite (desenvolvimento)
- Autenticação: JWT

### Frontend
- React (Vite)
- TailwindCSS
- Gerenciamento de estado: Zustand

### Ferramentas de Apoio
- ClickUp → Gerenciamento do projeto
- GitHub → Versionamento de código
- Figma → Protótipos (opcional)

---

## Estrutura do Projeto

### Backend

```
backend/
│── src/
│   ├── controllers/     # Camada de entrada (requisições HTTP)
│   ├── services/        # Regras de negócio
│   ├── repositories/    # Acesso ao banco de dados
│   ├── middlewares/     # Autenticação, validações
│   ├── routes/          # Definição das rotas
│   ├── config/          # Configurações (db, env)
│   └── app.js           # Inicialização da aplicação
│
├── prisma/
│   └── schema.prisma    # Modelagem do banco
│
├── package.json
└── .env
```

---

### Frontend

```
frontend/
│── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Consumo da API
│   ├── store/           # Estado global (Zustand)
│   ├── hooks/           # Hooks customizados
│   ├── layouts/         # Estrutura de layout
│   └── main.jsx         # Entrada da aplicação
│
├── public/
├── package.json
└── vite.config.js
```

---

## Fluxo de Funcionamento

1. Usuário se cadastra ou realiza login
2. Cria um projeto
3. Adiciona membros ao projeto
4. Cria tarefas vinculadas ao projeto
5. Move tarefas no Kanban:
   - A fazer → Em andamento → Concluído
6. Visualiza prazos no calendário

---

## 📊 Modelagem Inicial (Entidades)

- User
- Project
- Task
- TaskStatus
- ProjectMember

---

## Funcionalidades Implementadas (MVP)

- [ ] Autenticação (login/cadastro)
- [ ] CRUD de usuários
- [ ] CRUD de projetos
- [ ] CRUD de tarefas
- [ ] Kanban básico
- [ ] Associação usuário ↔ projeto
- [ ] Controle de status de tarefas

---

## Metodologia

O projeto será gerenciado utilizando o ClickUp, com organização baseada em:

- Sprints curtos
- Tasks bem definidas
- Acompanhamento visual (Kanban)
- Priorização contínua

---

## Como Rodar o Projeto

### Backend

```
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## Variáveis de Ambiente (Backend)

```
DATABASE_URL=
JWT_SECRET=
PORT=3000
```

---

## Evoluções Futuras

- Notificações em tempo real (WebSocket)
- Upload de arquivos
- Comentários em tarefas
- Dashboard com métricas
- Permissões por perfil (admin/user)

---

