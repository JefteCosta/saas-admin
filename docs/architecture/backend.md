# Arquitetura Backend

Consulte este documento antes de alterar controllers, middleware, models, validators ou providers.

## Estado atual

- **Framework**: AdonisJS v7.
- **Autenticação**: session-based com @adonisjs/auth.
- **Autorização**: Bouncer com ability `accessFeature` (app/abilities/main.ts).

### Controllers

| Controller | Responsabilidade |
| --- | --- |
| `session_controller` | Login e logout |
| `new_account_controller` | Signup (atribui role admin) |
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

### Models

| Model | Descrição |
| --- | --- |
| `User` | Usuário com role (belongsTo) e teams (manyToMany) |
| `Role` | Papel com features (manyToMany via role_features) |
| `Feature` | Página/funcionalidade do sistema |
| `Team` | Grupo com role (belongsTo) e members (manyToMany) |

### Services

| Service | Função |
| --- | --- |
| `FeatureService` | Resolve permissões (union role + teams), monta menu |

## Diretrizes

- Prefira convenções do AdonisJS.
- Mantenha validação próxima do tratamento de requisições (validators).
- Use transformers quando o formato de resposta precisar ser explícito.
- Proteja rotas com `middleware.feature({ slug: 'xxx' })`.
- Consulte as referências de AdonisJS em `docs/references/adonisjs/`.
