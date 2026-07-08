# Plano: Companies, Planos, Módulos e Subdomínios

Consulte este documento antes de implementar o sistema de multi-tenancy com empresas, planos e routing por subdomínio.

## Visão Geral

```
saas-admin.local                    → Páginas públicas (login, signup)
admin.saas-admin.local              → Painel SaaS (owner + users da company SaaS Admin)
acme-corp.saas-admin.local          → Workspace da empresa "Acme Corp"
minha-empresa.saas-admin.local      → Workspace "Minha Empresa"
```

O sistema é multi-tenant onde cada empresa (company) opera em seu próprio subdomínio. O painel do SaaS Admin fica em `admin.*` e gerencia todas as companies, planos, módulos e features.

## Modelo de Dados

### `plans` — planos do SaaS

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| id | integer PK | — |
| slug | string unique | ex: "starter", "business", "unlimited" |
| name | string | ex: "Plano Starter", "Plano Business" |
| description | string nullable | — |
| price | decimal nullable | Valor mensal em reais |
| is_active | boolean default true | — |
| created_at | timestamp | — |
| updated_at | timestamp | — |

### `modules` — módulos do sistema (globais)

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| id | integer PK | — |
| slug | string unique | ex: "pessoas", "marketing", "empresa" |
| name | string | ex: "Pessoas", "Marketing" |
| icon | string nullable | Ícone Lucide |
| position | integer default 0 | Ordem no menu |
| is_active | boolean default true | — |
| created_at | timestamp | — |
| updated_at | timestamp | — |

### `plan_modules` — módulos de cada plano + limites

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| id | integer PK | — |
| plan_id | integer FK → plans | — |
| module_id | integer FK → modules | — |
| limits | json nullable | ex: {"max_users": 10, "max_teams": 5} |
| created_at | timestamp | — |

Unique: (plan_id, module_id)

### `feature_groups` — agrupamentos dentro de um módulo

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| id | integer PK | — |
| module_id | integer FK → modules | — |
| slug | string unique | ex: "usuarios", "times" |
| name | string | ex: "Usuários", "Times" |
| icon | string nullable | — |
| position | integer default 0 | — |
| is_active | boolean default true | — |
| created_at | timestamp | — |
| updated_at | timestamp | — |

### `features` — reestruturada (pertence a módulo e grupo)

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| id | integer PK | — |
| module_id | integer FK → modules | Módulo ao qual pertence |
| feature_group_id | integer FK → feature_groups nullable | Grupo dentro do módulo |
| slug | string unique | ex: "users.list", "users.create" |
| name | string | ex: "Listar Usuários" |
| description | string nullable | — |
| icon | string nullable | — |
| route | string | ex: "/users" |
| position | integer default 0 | — |
| is_menu_item | boolean default true | Se aparece no menu |
| is_active | boolean default true | — |
| created_at | timestamp | — |
| updated_at | timestamp | — |

Remoção: campo `group` (string) é substituído por `module_id` + `feature_group_id`.

### `companies` — tenants

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| id | integer PK | — |
| slug | string unique | Subdomínio da empresa |
| name | string | Nome fantasia |
| legal_name | string nullable | Razão social |
| document | string nullable | CNPJ |
| state_registration | string nullable | Inscrição estadual |
| phone | string nullable | Telefone com DDD |
| logo_url | string nullable | — |
| plan_id | integer FK → plans | Plano contratado |
| owner_user_id | integer FK → users | Proprietário/criador |
| is_active | boolean default true | — |
| created_at | timestamp | — |
| updated_at | timestamp | — |

### `company_addresses` — endereços da empresa

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| id | integer PK | — |
| company_id | integer FK → companies | — |
| label | string nullable | ex: "Sede", "Filial SP" |
| street | string | Logradouro |
| number | string nullable | Número |
| complement | string nullable | Complemento |
| neighborhood | string nullable | Bairro |
| city | string | Cidade |
| state | string | UF (2 chars) |
| zip_code | string | CEP |
| country | string default 'BR' | — |
| is_primary | boolean default false | Endereço principal |
| created_at | timestamp | — |
| updated_at | timestamp | — |

### `company_members` — pivot user ↔ company

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| id | integer PK | — |
| company_id | integer FK → companies | — |
| user_id | integer FK → users | — |
| role_id | integer FK → roles nullable | Role dentro desta company |
| created_at | timestamp | — |

Unique: (company_id, user_id)

### Alterações em tabelas existentes

**roles** — adicionar:
- `company_id` integer FK → companies nullable (null = role global SaaS)
- Unique constraint muda para (company_id, slug)

**teams** — adicionar:
- `company_id` integer FK → companies

## Hierarquia de Features

```
Module (ex: "Pessoas", "Marketing")
  └── FeatureGroup (ex: "Usuários", "Times")
      └── Feature (ex: "users.list", "users.create")
```

## Slug da Company

- Gerado automaticamente do nome: "Acme Corp" → `acme-corp`
- Se duplicado: sugere `acme-corp-2`, `acme-corp-3`
- User pode alterar para slug único antes de confirmar
- Slug = subdomínio da empresa

## Routing por Subdomínio

```typescript
// Páginas públicas (saas-admin.local)
router.group(() => {
  router.get('login', ...)
  router.get('signup', ...)
}).domain('saas-admin.local').use(middleware.guest())

// Painel SaaS Admin (admin.saas-admin.local)
router.group(() => {
  router.get('/', ...)           // Dashboard SaaS
  router.get('/companies', ...)  // Gerenciar companies
  router.get('/plans', ...)      // Gerenciar planos
  router.get('/modules', ...)    // Gerenciar módulos
  router.get('/features', ...)   // Gerenciar features
}).domain('admin.saas-admin.local').use(middleware.auth(), middleware.saasAdmin())

// Workspace da company (:tenant.saas-admin.local)
router.group(() => {
  router.get('/', ...)                   // Dashboard
  router.get('/users', ...)              // Users da company
  router.get('/teams', ...)              // Teams da company
  router.get('/roles', ...)              // Roles da company
  router.get('/company', ...)            // Editar dados
  router.get('/company/addresses', ...)  // Endereços
}).domain(':tenant.saas-admin.local').use(middleware.auth(), middleware.companyContext())

// Workspace switcher
router.get('/workspace', ...).domain('saas-admin.local').use(middleware.auth())
```

## Dev Local

Adicionar ao `/etc/hosts`:
```
127.0.0.1 saas-admin.local
127.0.0.1 admin.saas-admin.local
```

Companies dinâmicas (acme-corp.saas-admin.local) são resolvidas pelo wildcard `:tenant` no middleware.

Sessão compartilhada: `session.cookie.domain = '.saas-admin.local'`

## Fluxo de Login

```
1. User acessa saas-admin.local/login → faz login
2. Sistema verifica companies do user (via company_members):
   a. Se pertence à company "SaaS Admin" → redirect admin.saas-admin.local
   b. Se tem 1 company → redirect {slug}.saas-admin.local
   c. Se tem 2+ companies → redirect saas-admin.local/workspace
3. Cookie compartilhado (domain=.saas-admin.local)
```

## Fluxo de Signup

```
1. User informa: nome, email, senha, nome da empresa
2. Sistema:
   - Gera slug (verifica duplicatas, sugere alternativa)
   - Cria User
   - Cria Company { name, slug, plan_id: starter, owner_user_id: user.id }
   - Cria CompanyMember { company_id, user_id, role_id: null }
3. Redirect para {slug}.saas-admin.local/company (completar dados)
```

## Permissões (Bouncer)

```typescript
accessFeature(user, featureSlug, currentCompany) {
  // 1. User da company SaaS Admin → bypass global
  if (userPertenceCompanySaaS(user)) return true

  // 2. Proprietário da company → bypass (vê tudo do plano)
  if (currentCompany.ownerUserId === user.id) {
    return featurePertenceAoPlano(feature, currentCompany.plan)
  }

  // 3. User normal → role + teams na company
  const membership = getCompanyMembership(user, currentCompany)
  const userFeatures = union(membership.role.features, ...userTeams.roles.features)
  return userFeatures.includes(featureSlug) && featurePertenceAoPlano(...)
}
```

## Menu Dinâmico

```typescript
getUserMenu(user, currentCompany) {
  // 1. Módulos do plano da company
  // 2. Features do user (role + teams)
  // 3. Filtrar por módulos contratados
  // 4. Agrupar: módulo → grupo → items
}
```

## Seeds

### Planos
| Plano | Preço | Módulos | Limites |
| --- | --- | --- | --- |
| Starter | R$100 | plataforma, pessoas, empresa, configuracoes | users:10, teams:5, addresses:3 |
| Business | R$200 | + marketing | users:20, teams:8, campaigns:10, addresses:5 |
| Unlimited | — | todos | sem limites |

### Módulos
plataforma, pessoas, empresa, marketing, configuracoes, saas

### Feature Groups
- plataforma > geral
- pessoas > usuarios, times
- empresa > dados, enderecos
- marketing > campanhas
- configuracoes > papeis
- saas > admin-saas

### Company SaaS Admin
- Company "SaaS Admin" { slug: 'admin', plan: unlimited, owner: owner_user }
- User owner (jefteamorim@gmail.com) → member da company SaaS Admin

## Middlewares

| Middleware | Função |
| --- | --- |
| `saas_admin_middleware` | Verifica se user pertence à company SaaS Admin |
| `company_context_middleware` | Resolve company pelo subdomínio, valida membership, seta ctx.company |

## Fases de Implementação

### Fase 1: Plans + Modules + FeatureGroups + Features ✅

- [x] Migration `create_plans_table`
- [x] Migration `create_modules_table`
- [x] Migration `create_feature_groups_table`
- [x] Migration `create_plan_modules_table`
- [x] Migration alterar features (add module_id, feature_group_id, remover group)
- [x] Models: Plan, Module, FeatureGroup, PlanModule
- [x] Atualizar Model Feature (belongsTo Module, belongsTo FeatureGroup)

### Fase 2: Companies + Addresses + Members ✅

- [x] Migration `create_companies_table`
- [x] Migration `create_company_addresses_table`
- [x] Migration `create_company_members_table`
- [x] Migration add company_id to roles
- [x] Migration add company_id to teams
- [x] Models: Company, CompanyAddress, CompanyMember
- [x] Atualizar Models: Role (add company_id), Team (add company_id)

### Fase 3: Signup com Company ✅

- [x] Atualizar formulário de signup (campo nome da empresa)
- [x] Controller gera slug (verifica duplicatas)
- [x] Cria Company + User + CompanyMember
- [x] Redirect para subdomínio da company

### Fase 4: Routing por Subdomínio ✅

- [x] Configurar session com domain compartilhado (.saas-admin.local)
- [x] Criar `saas_admin_middleware`
- [x] Criar `company_context_middleware`
- [x] Reestruturar routes.ts com .domain()
- [x] Configurar .env com APP_DOMAIN
- [x] Workspace switcher (página + redirect no login)

### Fase 5: Bouncer + Menu + Frontend ✅

- [x] Reescrever FeatureService.getUserMenu com módulos do plano
- [x] Atualizar app_sidebar.vue para módulos → grupos → items
- [x] Menu dinâmico com hierarquia colapsável
- [x] Workspace switcher no frontend

### Fase 6: Limites ✅

- [x] LimitService (uso vs limite do plan_modules.limits)
- [x] canCreateUser() e canCreateTeam() como atalhos
