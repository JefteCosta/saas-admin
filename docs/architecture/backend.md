# Arquitetura Backend

Consulte este documento antes de alterar controllers, middleware, models, validators ou providers.

## Estado atual

- **Framework**: AdonisJS v7.
- **Autenticação**: session-based com `@adonisjs/auth`, incluindo callback cross-domain por token.
- **Autorização**: Bouncer com ability `accessFeature` e resolução de permissões via `FeatureService`.
- **Multi-tenancy**: domínio principal + `admin.<domínio>` + `:tenant.<domínio>`.

Use [docs/architecture/auth-and-authorization.md](auth-and-authorization.md) como referência canônica para fluxos de autenticação, contexto de company, Bouncer e menu dinâmico.

## Superfícies HTTP

| Superfície | Host | Responsabilidade |
| --- | --- | --- |
| Pública | domínio principal | login, signup, callback e workspace switcher |
| Painel SaaS | `admin.<domínio>` | gestão global da plataforma para membros da company `admin` |
| Tenant | `:tenant.<domínio>` | workspace isolado de cada company |

Quando `APP_DOMAIN=localhost`, as rotas são expostas em modo flat para simplificar desenvolvimento e testes.

### Controllers

| Controller | Responsabilidade |
| --- | --- |
| `session_controller` | Login, callback cross-domain, logout, logout global e workspace switcher |
| `new_account_controller` | Signup, criação de company, login automático e redirect inicial |
| `profile_controller` | Visualização e edição do perfil |

### Middleware

| Middleware | Função |
| --- | --- |
| `auth_middleware` | Protege rotas (redireciona para /login) |
| `guest_middleware` | Redireciona logados para / |
| `feature_middleware` | Verifica permissão de acesso a feature via Bouncer |
| `inertia_middleware` | Compartilha dados com frontend (user, menu, flash, errors) |
| `initialize_bouncer_middleware` | Inicializa Bouncer no contexto HTTP |
| `silent_auth_middleware` | Carrega sessão silenciosamente |
| `saas_admin_middleware` | Restringe o host `admin.<domínio>` aos usuários da company SaaS |
| `company_context_middleware` | Resolve a company pelo subdomínio e valida membership |

### Models

| Model | Descrição |
| --- | --- |
| `User` | Usuário com role (belongsTo), teams (manyToMany) e companies (manyToMany) |
| `Role` | Papel com features (manyToMany via role_features) |
| `Feature` | Página/funcionalidade vinculada a módulo e grupo |
| `Team` | Grupo com role (belongsTo), members (manyToMany) e company |
| `Company` | Tenant do sistema, com owner, members, plan e isolamento por slug |
| `Plan` | Plano contratado pela company |
| `Module` | Módulo funcional do produto |

### Services

| Service | Função |
| --- | --- |
| `AuthTokenService` | Gera e valida tokens temporários de autenticação cross-domain |
| `FeatureService` | Resolve permissões (role + teams), verifica features e monta menu hierárquico |

## Proteção de rotas e contexto

O arquivo [start/routes.ts](../../start/routes.ts) separa o tráfego autenticado em três contextos distintos.

### Domínio principal

- usa `middleware.auth()` para proteger o workspace switcher e o logout local;
- concentra a entrada pública do sistema e a escolha de workspace quando o usuário participa de mais de uma company.

Exemplo conceitual:

```typescript
router
	.group(() => {
		router.get('workspace', [controllers.Session, 'workspace'])
		router.post('logout', [controllers.Session, 'destroy'])
	})
	.domain(domain)
	.use(middleware.auth())
```

### Painel SaaS em `admin.<domínio>`

- usa `middleware.auth()` para exigir sessão válida;
- usa `middleware.saasAdmin()` para restringir o host à company especial `admin`.

Exemplo conceitual:

```typescript
router
	.group(() => {
		router.get('users', [controllers.Users, 'index'])
		router.get('roles', [controllers.Roles, 'index'])
		router.get('features', [controllers.Features, 'index'])
	})
	.domain(`admin.${domain}`)
	.use(middleware.auth())
	.use(middleware.saasAdmin())
```

### Workspace de tenant em `:tenant.<domínio>`

- usa `middleware.auth()` para exigir sessão válida;
- usa `middleware.companyContext()` para resolver a company pelo subdomínio e validar membership do usuário.

Exemplo conceitual:

```typescript
router
	.group(() => {
		router.get('users', [controllers.Users, 'index'])
		router.get('roles', [controllers.Roles, 'index'])
		router.get('teams', [controllers.Teams, 'index'])
	})
	.domain(`:tenant.${domain}`)
	.use(middleware.auth())
	.use(middleware.companyContext())
```

## Middleware de feature

O projeto já possui `feature_middleware`, mas a aplicação efetiva nas rotas deve sempre seguir o modelo real de domínio e contexto acima.

Quando uma rota exigir autorização por slug de feature, a proteção esperada é esta:

```typescript
router
	.get('users', [controllers.Users, 'index'])
	.use(middleware.feature({ slug: 'users' }))
```

Esse middleware delega a decisão à ability `accessFeature`, que por sua vez usa a role do usuário e o `FeatureService`.

## Mapa de responsabilidades

Use esta divisão para evitar duplicação de lógica:

| Camada | Responsabilidade principal | Exemplo no projeto |
| --- | --- | --- |
| Route | Definir host, método e cadeia de middleware | `admin.<domínio>` vs `:tenant.<domínio>` |
| Middleware | Garantir pré-condições do request | autenticação, company ativa, membership válido |
| Controller | Orquestrar fluxo HTTP e resposta | signup, login, workspace, CRUDs |
| Service | Encapsular regra reutilizável | token cross-domain, resolução de menu, features do usuário |

Em geral, controller não deve reimplementar regra de company context nem lógica de permissão por feature. Essas decisões pertencem a middleware, ability e service.

## Fluxos principais

### Signup

- valida payload do formulário;
- busca role `admin` e plano `starter`;
- cria `User` e `Company`;
- vincula owner na pivot `company_members`;
- autentica o usuário;
- redireciona para o workspace inicial da company.

### Login

- valida credenciais;
- cria sessão local;
- resolve o host de destino com base nas companies do usuário;
- em caso de troca de host, usa token temporário e callback;
- em caso de mesmo host, faz redirect local.

### Logout

- encerra a sessão local;
- se houver subdomínio, executa redirect para o logout global no domínio principal;
- finaliza em `/login`.

## Observações de modelagem

- A sessão não usa cookie compartilhado por domínio; a transferência entre hosts depende de `AuthTokenService`.
- O menu do frontend é derivado do backend e já chega agrupado por módulo e grupo.
- O contexto de tenant é resolvido no middleware, não em cada controller.
- A documentação de planning pode descrever a evolução desejada, mas a fonte de verdade do comportamento vigente deve permanecer em `docs/architecture/`.

## Diretrizes

- Prefira convenções do AdonisJS.
- Mantenha validação próxima do tratamento de requisições (validators).
- Use transformers quando o formato de resposta precisar ser explícito.
- Proteja rotas com `middleware.feature({ slug: 'xxx' })`.
- Consulte as referências de AdonisJS em `docs/references/adonisjs/`.
