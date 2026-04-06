# Bruxo da Organização
Organize sua vida com um toque de feitiço e um pergaminho chamado Autodisciplina

---

## 1. Visão Geral

O Bruxo da Organização é uma aplicação fullstack projetada para transformar a forma como usuários lidam com tarefas e estudos.

O sistema não é apenas um organizador, mas um **motor de decisão assistida**, que reduz o esforço cognitivo ao decidir:
- o que fazer
- quando fazer
- por onde começar

A proposta é centralizar execução, planejamento e acompanhamento em um único fluxo inteligente.

---

## 2. Conceito Central: Plan (Entidade Pai)

O sistema gira em torno de uma entidade principal chamada **Plan**.

O Plan representa um objetivo maior e agrupa todas as ações relacionadas a ele.

### Exemplos de Plan

| Nome | Tipo | Descrição |
|------|------|----------|
| Certificação React | STUDY | Preparação para prova |
| Semana Produtiva | PRODUCTIVITY | Organização semanal |
| Projeto Pessoal | HYBRID | Mistura de estudo + tarefas |

---

## 3. Relação entre Entidades

| Entidade | Pertence a | Descrição |
|----------|-----------|----------|
| Plan | - | Raiz do sistema |
| Task | Plan | Tarefas operacionais |
| Course | Plan | Estrutura de estudo |
| StudyBlock | Course + Plan | Execução no tempo |

---

## 4. Arquitetura do Projeto

| Camada | Tecnologia | Responsabilidade |
|--------|------------|-----------------|
| Client | Angular | Interface e interação |
| Server | Node.js + Express | API e motor |
| Database | SQLite | Persistência |
| E2E | Playwright | Testes ponta a ponta |

---

## 5. Stack Tecnológica

### Backend
| Tecnologia | Uso |
|------------|-----|
| Node.js | Runtime |
| Express | API |
| Jest | Testes |

### Frontend
| Tecnologia | Uso |
|------------|-----|
| Angular | Interface |

### Integrações
| Serviço | Uso |
|---------|-----|
| Google OAuth | Login |
| Google Drive | Armazenamento |
| Google Calendar | Agenda |

---

## 6. Modelo de Dados

### Plan

| Campo | Tipo | Descrição |
|------|------|----------|
| id | string | Identificador |
| name | string | Nome |
| description | string | Descrição |
| start_date | date | Início |
| end_date | date | Fim |
| goal_type | enum | Tipo do plano |

---

### Task

| Campo | Tipo |
|------|------|
| id | string |
| plan_id | string |
| title | string |
| status | enum |
| priority | number |
| position | number |

---

### Course

| Campo | Tipo |
|------|------|
| id | string |
| plan_id | string |
| name | string |
| start_date | date |
| end_date | date |

---

### StudyBlock

| Campo | Tipo |
|------|------|
| id | string |
| plan_id | string |
| course_id | string |
| date | date |
| duration | number |

---

## 7. Jornadas do Usuário

### Onboarding

| Etapa | Ação |
|------|------|
| 1 | Login Google |
| 2 | Permissões |
| 3 | Configuração |
| 4 | Criação de Plan |

---

### Execução

| Ação | Resultado |
|------|----------|
| Criar Task | Vai para Kanban |
| Atualizar Status | Motor reage |
| Finalizar Task | Próxima sugerida |

---

### Estudos

| Ação | Resultado |
|------|----------|
| Criar Course | Motor divide |
| Gerar cronograma | Distribuição automática |

---

## 8. API

### Plans

| Método | Endpoint | Descrição |
|--------|----------|----------|
| POST | /plans | Criar |
| GET | /plans | Listar |

---

### Tasks

| Método | Endpoint | Descrição |
|--------|----------|----------|
| POST | /tasks | Criar |
| PATCH | /tasks/status | Atualizar status |
| PATCH | /tasks/order | Ordenar |

---

### Courses

| Método | Endpoint | Descrição |
|--------|----------|----------|
| POST | /courses | Criar |
| PATCH | /courses/schedule | Gerar cronograma |

---

## 9. Motor de Organização

### Regras

| Regra | Descrição |
|------|----------|
| Prioridade dinâmica | Baseada em prazo |
| Balanceamento | Tasks vs Study |
| WIP Limit | Evita sobrecarga |
| Reorganização | Automática |

---

## 10. Fluxo do Motor

1. Recebe Plan
2. Analisa Tasks e Courses
3. Calcula prioridade
4. Atualiza Kanban
5. Sugere próxima ação

---

## 11. Persistência

| Estratégia | Descrição |
|-----------|----------|
| SQLite | Base local |
| Drive | Backup |
| Sync | Upload/Download |

---

## 12. MVP

| Inclui | Não inclui |
|--------|-----------|
| Plan | Métricas avançadas |
| Tasks | IA |
| Motor básico | Analytics |

---

## 13. Objetivo

Criar um sistema que:
- organiza
- prioriza
- guia execução

Transformando planejamento em ação contínua.