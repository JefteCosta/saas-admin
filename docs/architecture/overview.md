# Visão Geral da Arquitetura

Consulte este documento antes de alterar a estrutura da aplicação ou introduzir novos padrões técnicos.

## Stack

- **Backend**: AdonisJS v7 com TypeScript.
- **Frontend**: Vue 3, Inertia.js e Vite.
- **Banco de dados**: SQLite (desenvolvimento) via Lucid ORM com migrations e schema.
- **UI**: shadcn-vue com Tailwind CSS v4 e Radix UI (via reka-ui).
- **Autenticação**: Session-based auth com `@adonisjs/auth` e callback cross-domain por token.
- **Autorização**: AdonisJS Bouncer com abilities para controle de acesso a features.
- **Multi-tenancy**: companies por subdomínio, painel SaaS em `admin.<domínio>` e workspaces em `:tenant.<domínio>`.

## Estrutura do projeto

```
├── app/
│   ├── abilities/        # Abilities do Bouncer (accessFeature)
│   ├── controllers/      # Controllers HTTP
│   ├── exceptions/       # Exception handlers
│   ├── middleware/        # Auth, guest, feature, inertia, bouncer
│   ├── models/           # User, Role, Feature, Team
│   ├── services/         # FeatureService (permissões e menu)
│   ├── transformers/     # Serialização de dados para API/Inertia
│   └── validators/       # Validação com VineJS
├── config/               # Configurações do AdonisJS
├── database/
│   ├── migrations/       # Estrutura do banco
│   └── seeders/          # Dados iniciais (roles, features, owner)
├── inertia/
│   ├── components/       # Componentes Vue (sidebar, header, nav, ui)
│   ├── composables/      # Composables (useTheme)
│   ├── css/              # Estilos globais (Tailwind + variáveis)
│   ├── layouts/          # Layouts (default, auth)
│   └── pages/            # Páginas Inertia (home, profile, auth)
├── start/                # Routes, kernel, env
├── tests/                # Testes funcionais
├── docs/                 # Documentação do projeto
└── commands/             # Comandos Ace customizados (docs:sync)
```

## Padrões implementados

- **Autenticação**: signup com criação de company, login com resolução de workspace e logout multi-host.
- **Autorização**: sistema de features + roles + teams com Bouncer.
- **Menu dinâmico**: sidebar montada com base nas permissões do usuário e agrupada por módulo/grupo.
- **Isolamento por tenant**: company resolvida por subdomínio via middleware.
- **Dark mode**: toggle com persistência em localStorage.
- **Layout**: sidebar com navegação, dropdown de usuário e breadcrumbs.
- **Componentes**: biblioteca de UI baseada em shadcn-vue.
- **Testes**: funcionais com Japa + api-client.
- **CI/CD**: workflows de CI, release-please e docs-sync.

## Documentos-chave

- [Backend](backend.md)
- [Autenticação e autorização](auth-and-authorization.md)
- [Database](database.md)
- [Frontend](frontend.md)
- [Guia operacional multi-tenant local](../guides/multi-tenant-local-operations.md)

## Modelo de autorização

```
User ─── role ──→ Role ─── features ──→ Features (via role_features)
  │
  └── teams ──→ Team ─── role ──→ Role ─── features ──→ Features
```

Permissões do usuário = features da role direta **∪** features das roles dos teams.

Hierarquia:
- **Owner**: bypass total (acessa tudo sem verificação).
- **Admin**: acessa tudo exceto gerenciamento de features (painel SaaS).
- **Member/Viewer**: acessa apenas features vinculadas.

O detalhamento dos fluxos de login, callback cross-domain, contexto de company e montagem do menu está em [docs/architecture/auth-and-authorization.md](auth-and-authorization.md).

## Diretrizes

- Siga convenções do framework antes de criar novas abstrações.
- Atualize a documentação de arquitetura relevante ao mudar backend, frontend ou banco de dados.
- Consulte `docs/references/README.md` antes de alterar código dependente de AdonisJS ou Lucid.
- Use `node ace docs:sync` após alterar documentação.
