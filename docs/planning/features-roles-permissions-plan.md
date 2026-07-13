# Plano: Sistema de Features, Roles, Teams e Permissões

Consulte este documento antes de implementar o sistema de features e controle de acesso.

## Status do documento

Classificação: **referência histórica de planejamento** (não canônica para comportamento em runtime).

Este arquivo registra o desenho base do sistema de roles, teams e features, mas não é mais a fonte canônica do comportamento atual de autenticação e autorização.

Pontos importantes de defasagem:

- o modelo atual já usa companies por subdomínio e contexto de tenant;
- a modelagem de `Feature` evoluiu para `module_id` e `feature_group_id`;
- o fluxo de autenticação atual inclui signup com company, login com `resolveRedirect`, callback cross-domain por token e workspace switcher;
- a documentação vigente desses fluxos está em [docs/architecture/auth-and-authorization.md](../architecture/auth-and-authorization.md).

Use este plano como histórico de decisão e referência de evolução. Para comportamento em produção, consulte a documentação em `docs/architecture/` e confirme no código.

## Limites de uso deste plano

Os blocos abaixo devem ser lidos como proposta original e não como contrato de implementação vigente.

- exemplos com `features.group` (string) representam o schema anterior;
- exemplos de rotas e middleware mostram a ideia inicial e podem divergir do roteamento atual por subdomínio;
- a regra de autorização canônica é a ability atual em `app/abilities/main.ts`, descrita em [docs/architecture/auth-and-authorization.md](../architecture/auth-and-authorization.md).

Para mudanças novas, sempre comece por `docs/architecture/` e trate este arquivo como contexto histórico.

## Objetivo

Criar um sistema onde:
- Cada página/funcionalidade do sistema é uma **Feature** cadastrada.
- O menu da sidebar é **montado dinamicamente** com base nas features que o usuário pode acessar.
- Um usuário tem uma **Role direta** que concede permissões.
- Um usuário pode pertencer a **Teams**, e cada team tem uma **Role** que também concede permissões.
- As permissões do usuário = permissões da role do usuário **+** permissões das roles dos teams que ele participa.
- A autorização é feita com **AdonisJS Bouncer** (abilities).
- Features podem ser cadastradas via **seeds** ou via **controllers** (CRUD).

## Hierarquia de papéis

```
owner  → Acesso total, irrestrito. Bypass de todas as verificações.
admin  → Acesso a todas as features EXCETO gerenciamento de features (cadastro/edição).
member → Acesso apenas às features vinculadas à sua role + roles dos teams.
viewer → Apenas leitura das features permitidas.
```

### Owner (super admin do SaaS)

- **Único usuário**: criado via seed com e-mail `jefteamorim@gmail.com`.
- **Bypass total**: no Bouncer, o hook `before` verifica se `user.role.slug === 'owner'` e retorna `true` imediatamente (pula toda verificação de permissão).
- **Não pode ser criado pela interface**: apenas via seed.
- **Acessa tudo**: inclusive cadastro e edição de features.

### Admin

- **Criado via signup**: todo usuário que se cadastra pela página de registro recebe a role `admin`.
- **Acesso quase total**: pode acessar todas as features do sistema.
- **Restrição**: NÃO pode acessar as features de gerenciamento de features (`features.create`, `features.edit`). Essas são exclusivas do owner (painel SaaS).
- **Pode**: gerenciar usuários, roles, teams e todas as demais funcionalidades.

### Member e Viewer

- Criados manualmente pelo admin ou owner.
- Acessam apenas features vinculadas às suas roles/teams.

## Regras de criação de usuários

| Ação | Role atribuída | Quem pode fazer |
| --- | --- | --- |
| Seed do owner | `owner` | Apenas via seed |
| Signup (página /signup) | `admin` | Qualquer pessoa |
| Criação via painel admin | `member`, `viewer` ou custom | Owner ou Admin |

## Features restritas ao Owner

As seguintes features só podem ser acessadas pelo owner:

- `features` — listagem de features (painel SaaS)
- `features.create` — cadastro de novas features
- `features.edit` — edição de features existentes

Essas features representam o "painel do SaaS" — a administração das funcionalidades disponíveis no sistema. Admins podem ver e usar features, mas não podem criar ou alterar quais features existem.

## Conceitos

```
User ──── has one ──── Role ──── has many ──── Features (via role_features)
  │
  └──── belongs to many ──── Teams ──── each has one ──── Role ──── has many ──── Features
```

| Conceito | Descrição |
| --- | --- |
| **Feature** | Uma página/funcionalidade do sistema. Slug, nome, ícone, rota, grupo, posição. |
| **Role** | Um papel reutilizável (ex: admin, editor, viewer). Define um conjunto de permissões sobre features. |
| **Team** | Um grupo de usuários. O team tem uma role, e todos os membros herdam as permissões dessa role. |
| **User** | Tem uma role direta + pertence a N teams. Permissão final = união de tudo. |

## Modelo de dados

### Tabela `roles`

```
id          integer PK
slug        string unique     (ex: admin, editor, viewer)
name        string            (ex: "Administrador", "Editor")
description string nullable
is_default  boolean default false   (role atribuída a novos usuários)
created_at  timestamp
updated_at  timestamp
```

### Tabela `features`

```
id            integer PK
slug          string unique     (ex: home, profile, users, settings)
name          string            (ex: "Home", "Perfil", "Usuários")
description   string nullable
icon          string nullable   (nome do ícone Lucide: "Home", "User", "Settings")
route         string            (ex: "/", "/profile", "/users")
group         string nullable   (agrupamento no menu: "Plataforma", "Admin")
position      integer default 0 (ordem no menu)
is_menu_item  boolean default true  (se aparece no menu)
is_active     boolean default true  (se está habilitada)
created_at    timestamp
updated_at    timestamp
```

### Tabela `role_features` (pivot)

```
id          integer PK
role_id     integer FK → roles
feature_id  integer FK → features
created_at  timestamp
```

A presença de um registro nesta pivot significa que a role **tem acesso** à feature.

### Tabela `teams`

```
id          integer PK
name        string            (ex: "Marketing", "Engenharia")
slug        string unique
role_id     integer FK → roles  (role do team — todos os membros herdam)
created_at  timestamp
updated_at  timestamp
```

### Tabela `team_members` (pivot)

```
id          integer PK
team_id     integer FK → teams
user_id     integer FK → users
created_at  timestamp
```

### Alteração na tabela `users`

```
role_id     integer FK → roles nullable
```

## Como as permissões são resolvidas

```typescript
// FeatureService.getUserFeatures(user)

1. Carrega a role direta do usuário → busca features da role
2. Carrega os teams do usuário → para cada team, busca features da role do team
3. Faz a UNIÃO de todas as features (sem duplicatas)
4. Filtra apenas features ativas (is_active = true)
5. Retorna a lista final de features que o usuário pode acessar
```

**Exemplo:**

- User tem role `editor` → acesso a: home, profile, posts
- User pertence ao team "Marketing" com role `marketing` → acesso a: campaigns, reports
- User pertence ao team "Admin" com role `admin` → acesso a: users, roles, features, settings
- **Resultado final**: home, profile, posts, campaigns, reports, users, roles, features, settings

## Autorização com Bouncer

O AdonisJS Bouncer será usado para verificar se o usuário pode acessar uma feature.

### Ability principal

```typescript
// app/abilities/main.ts
import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'
import FeatureService from '#services/feature_service'

export const accessFeature = Bouncer.ability(async (user: User, featureSlug: string) => {
  // Owner tem acesso irrestrito a TUDO
  if (user.role?.slug === 'owner') {
    return true
  }

  // Admin tem acesso a tudo EXCETO gerenciamento de features
  if (user.role?.slug === 'admin') {
    const restrictedForAdmin = ['features.create', 'features.edit']
    if (restrictedForAdmin.includes(featureSlug)) {
      return false
    }
    return true
  }

  // Demais roles: verificar permissões via service
  const service = new FeatureService()
  return service.userCanAccess(user, featureSlug)
})
```

### Lógica de resolução

```
1. Owner? → Acesso total (return true)
2. Admin? → Acesso total exceto features restritas
3. Outros? → Verifica role direta + roles dos teams do usuário
```

### Uso no middleware de feature

```typescript
// app/middleware/feature_middleware.ts
import { accessFeature } from '#abilities/main'

export default class FeatureMiddleware {
  async handle(ctx, next, options: { slug: string }) {
    await ctx.bouncer.authorize(accessFeature, options.slug)
    return next()
  }
}
```

### Uso nas rotas

```typescript
// start/routes.ts
router.get('/users', [controllers.Users, 'index'])
  .use(middleware.feature({ slug: 'users' }))

router.get('/settings', [controllers.Settings, 'show'])
  .use(middleware.feature({ slug: 'settings' }))
```

## Menu dinâmico

### Backend (Inertia middleware)

```typescript
// app/middleware/inertia_middleware.ts
share(ctx: HttpContext) {
  return {
    menu: ctx.inertia.always(async () => {
      if (!ctx.auth.user) return []
      const service = new FeatureService()
      return service.getUserMenu(ctx.auth.user)
    }),
  }
}
```

### Formato dos dados compartilhados

```typescript
// Shared props → menu
[
  {
    group: 'Plataforma',
    items: [
      { slug: 'home', name: 'Home', icon: 'Home', route: '/' },
      { slug: 'profile', name: 'Perfil', icon: 'User', route: '/profile' },
    ]
  },
  {
    group: 'Administração',
    items: [
      { slug: 'users', name: 'Usuários', icon: 'Users', route: '/users' },
      { slug: 'roles', name: 'Papéis', icon: 'Shield', route: '/roles' },
    ]
  }
]
```

### Frontend (app_sidebar.vue)

O sidebar consome `usePage().props.menu` e renderiza dinamicamente. Ícones Lucide são resolvidos por nome via um mapa de componentes.

## Cadastro de features

### Via seeds (setup inicial)

```typescript
// database/seeders/role_seeder.ts
const roles = [
  { slug: 'owner', name: 'Owner', description: 'Super admin do SaaS. Acesso irrestrito.' },
  { slug: 'admin', name: 'Administrador', description: 'Acesso total exceto painel SaaS de features.' },
  { slug: 'member', name: 'Membro', description: 'Acesso às features da sua role e teams.' },
  { slug: 'viewer', name: 'Visualizador', description: 'Apenas leitura.' },
]

// database/seeders/feature_seeder.ts
const features = [
  { slug: 'home', name: 'Home', icon: 'Home', route: '/', group: 'Plataforma', position: 0 },
  { slug: 'profile', name: 'Perfil', icon: 'User', route: '/profile', group: 'Plataforma', position: 1 },
  { slug: 'users', name: 'Usuários', icon: 'Users', route: '/users', group: 'Administração', position: 10 },
  { slug: 'roles', name: 'Papéis', icon: 'Shield', route: '/roles', group: 'Administração', position: 11 },
  { slug: 'features', name: 'Features', icon: 'Layers', route: '/features', group: 'SaaS', position: 30, is_menu_item: true },
  { slug: 'features.create', name: 'Criar Feature', icon: 'Plus', route: '/features/create', group: 'SaaS', position: 31, is_menu_item: false },
  { slug: 'features.edit', name: 'Editar Feature', icon: 'Pencil', route: '/features/:id/edit', group: 'SaaS', position: 32, is_menu_item: false },
  { slug: 'teams', name: 'Times', icon: 'UsersRound', route: '/teams', group: 'Administração', position: 13 },
  { slug: 'settings', name: 'Configurações', icon: 'Settings', route: '/settings', group: 'Configurações', position: 20 },
]

// database/seeders/user_seeder.ts (owner)
const owner = {
  email: 'jefteamorim@gmail.com',
  password: 'password',  // trocar em produção
  fullName: 'Jefte Amorim',
  role: 'owner',
}
```

### Signup (novos usuários)

O controller de signup (`new_account_controller.ts`) atribui automaticamente a role `admin` a novos usuários:

```typescript
// app/controllers/new_account_controller.ts
async store({ request, auth, response }) {
  const role = await Role.findByOrFail('slug', 'admin')
  const user = await User.create({
    ...request.only(['fullName', 'email', 'password']),
    roleId: role.id,
  })
  await auth.use('web').login(user)
  response.redirect().toRoute('profile')
}
```

### Via interface administrativa

- CRUD de features em `/features` (restrito a role admin).
- CRUD de roles em `/roles` com toggle de features por role.
- CRUD de teams em `/teams` com seleção de role e membros.

## Fases de implementação

### Fase 1: Banco de dados ✅

- [x] Migration `create_roles_table`
- [x] Migration `create_features_table`
- [x] Migration `create_role_features_table`
- [x] Migration `create_teams_table`
- [x] Migration `create_team_members_table`
- [x] Migration `add_role_id_to_users_table`

### Fase 2: Models ✅

- [x] Model `Role` (manyToMany Feature)
- [x] Model `Feature`
- [x] Model `Team` (belongsTo Role, manyToMany User via team_members)
- [x] Atualizar `User` (belongsTo Role, manyToMany Team via team_members)

### Fase 3: Service + Bouncer ✅

- [x] `FeatureService` com métodos:
  - `getUserFeatures(user)` — resolve todas as features do usuário
  - `getUserMenu(user)` — retorna menu agrupado e ordenado
  - `userCanAccess(user, featureSlug)` — verifica acesso a uma feature
- [x] Ability `accessFeature` em `app/abilities/main.ts`

### Fase 4: Middleware e integração ✅

- [x] `feature_middleware.ts` — protege rotas por slug de feature
- [x] `menu_middleware.ts` — resolve menu dinâmico após auth
- [x] Aplicar middleware nas rotas existentes

### Fase 5: Seeds ✅

- [x] Seeder de roles (owner, admin, member, viewer)
- [x] Seeder de features (home, profile, users, roles, teams, features, settings)
- [x] Seeder de role_features (admin = todas exceto SaaS, member = home+profile)
- [x] Seeder do owner (jefteamorim@gmail.com)
- [x] Signup atribui role admin automaticamente

### Fase 6: Frontend ✅

- [x] Atualizar `app_sidebar.vue` para consumir `menu` dos shared props
- [x] Criar mapa de ícones Lucide para resolução dinâmica
- [x] Marcar item ativo baseado na rota atual
- [x] Dark mode com toggle no header
- [x] Dropdown de usuário no header

### Fase 7: CRUD administrativo ✅

- [x] `/users` — listagem com alteração de role via select inline
- [x] `/roles` — listagem, criação, edição de permissões e remoção
- [x] `/teams` — listagem, criação, gerenciamento de membros e remoção
- [x] `/features` — listagem, criação e edição (restrito a owner)
- [x] `/profile` — edição de nome do usuário
- [x] `/settings` — placeholder

## Decisões técnicas

1. **Bouncer com abilities (não policies)**: como a verificação é simples (usuário pode acessar feature X?), abilities são suficientes. Não precisa de policy por resource.
2. **Owner = bypass total**: verificado no início da ability com `user.role.slug === 'owner'`. Nenhuma query adicional.
3. **Admin = quase total**: verificado após o owner. Acessa tudo exceto features restritas ao painel SaaS.
4. **Signup cria admin**: todo novo cadastro recebe role `admin`. Members e viewers são criados manualmente.
5. **Owner só via seed**: não existe interface para criar owners. Protege o sistema de escalação de privilégios.
6. **Permissão = presença na pivot**: se existe registro em `role_features` para a role e feature, tem acesso. Sem registro = sem acesso.
7. **Team herda role**: ao invés de cada team ter permissões independentes, o team aponta para uma role existente. Reutiliza roles.
8. **União de permissões (OR)**: se qualquer fonte (role direta OU role de qualquer team) dá acesso, o usuário tem acesso. Nunca subtrai.
9. **Ícones como strings**: armazenar nome Lucide no banco, resolver no frontend via mapa.
10. **Features do SaaS isoladas**: `features`, `features.create`, `features.edit` pertencem ao grupo "SaaS" e são invisíveis/inacessíveis para admins.

## Critérios de aceite

- **Owner** vê TODAS as features ativas no menu, incluindo gerenciamento de features.
- **Admin** vê todas as features EXCETO as do grupo "SaaS" (features.create, features.edit).
- **Member** vê apenas features vinculadas à sua role + roles dos teams.
- **Viewer** vê apenas features permitidas para sua role (leitura).
- Acessar rota protegida sem permissão retorna 403.
- Signup cria usuário com role `admin`.
- Owner é criado apenas via seed (`jefteamorim@gmail.com`).
- Adicionar feature via seed/CRUD aparece no menu para roles com permissão.
- Desativar feature remove do menu de todos (exceto owner que vê tudo).

## Arquivos a serem criados/alterados

```
database/migrations/
  XXXX_create_roles_table.ts
  XXXX_create_features_table.ts
  XXXX_create_role_features_table.ts
  XXXX_create_teams_table.ts
  XXXX_create_team_members_table.ts
  XXXX_add_role_id_to_users_table.ts

app/models/
  role.ts
  feature.ts
  role_feature.ts (ou pivot)
  team.ts
  team_member.ts (ou pivot)
  user.ts (atualizar)

app/abilities/
  main.ts (adicionar accessFeature)

app/services/
  feature_service.ts

app/middleware/
  feature_middleware.ts
  inertia_middleware.ts (atualizar)

database/seeders/
  role_seeder.ts
  feature_seeder.ts
  role_feature_seeder.ts
  user_seeder.ts (owner: jefteamorim@gmail.com)

inertia/components/
  app_sidebar.vue (atualizar)

start/
  routes.ts (aplicar middleware)
  kernel.ts (registrar feature middleware)
```
