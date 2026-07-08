# Comandos do Node Ace

Consulte este documento para referência rápida dos comandos disponíveis no AdonisJS via `node ace`.

## Uso geral

```bash
node ace <comando> [opções]
node ace <comando> --help   # ajuda de um comando específico
```

## Comandos principais

| Comando | Descrição |
| --- | --- |
| `add` | Instala e configura um pacote AdonisJS (npm install + configure hook) |
| `build` | Compila frontend e TypeScript para produção |
| `configure` | Executa o configure hook de um pacote já instalado |
| `eject` | Copia stubs (templates dos make:*) para customização |
| `list` | Lista todos os comandos disponíveis |
| `repl` | Inicia sessão REPL interativa com a aplicação |
| `serve` | Inicia o servidor de desenvolvimento (`--hmr` para hot reload) |
| `test` | Executa testes com Japa runner |

## Banco de dados (`db:*`)

| Comando | Descrição |
| --- | --- |
| `db:seed` | Executa seeders do banco |
| `db:truncate` | Trunca todas as tabelas |
| `db:wipe` | Remove todas as tabelas, views e types |

## Migrations (`migration:*`)

| Comando | Descrição |
| --- | --- |
| `migration:run` | Executa migrations pendentes |
| `migration:rollback` | Reverte migrations do último batch |
| `migration:fresh` | Remove tudo e re-migra (drop + migrate) |
| `migration:refresh` | Rollback total + migrate |
| `migration:reset` | Reverte todas as migrations |
| `migration:status` | Mostra status de cada migration |

## Schema (`schema:*`)

| Comando | Descrição |
| --- | --- |
| `schema:dump` | Exporta o schema do banco para SQL |
| `schema:generate` | Gera classes de schema para as tabelas existentes |

## Geradores (`make:*`)

| Comando | Gera em | Descrição |
| --- | --- | --- |
| `make:controller` | `app/controllers/` | Controller HTTP (`--resource` para CRUD, `--api` para API) |
| `make:model` | `app/models/` | Model Lucid |
| `make:migration` | `database/migrations/` | Arquivo de migration |
| `make:validator` | `app/validators/` | Validator VineJS (`--resource` para create + update) |
| `make:service` | `app/services/` | Classe de serviço (lógica de negócio) |
| `make:middleware` | `app/middleware/` | Middleware (registra em `start/kernel.ts`) |
| `make:event` | `app/events/` | Classe de evento |
| `make:listener` | `app/listeners/` | Listener de evento (`--event` para gerar evento junto) |
| `make:exception` | `app/exceptions/` | Exception customizada |
| `make:command` | `commands/` | Comando Ace CLI |
| `make:factory` | — | Factory para testes |
| `make:seeder` | — | Seeder de banco |
| `make:test` | `tests/` | Arquivo de teste Japa (`--suite` para especificar suite) |
| `make:page` | — | Componente de página Inertia |
| `make:view` | `resources/views/` | Template Edge.js |
| `make:provider` | `providers/` | Service provider (registra em `adonisrc.ts`) |
| `make:preload` | `start/` | Arquivo preload (executa no boot) |
| `make:transformer` | `app/transformers/` | Transformer para serializar dados |
| `make:session-table` | `database/migrations/` | Migration da tabela de sessions |

## Documentação (`docs:*`)

| Comando | Descrição |
| --- | --- |
| `docs:sync` | Sincroniza a base de conhecimento e os arquivos de agentes |
| `docs:sync --check` | Verifica se a base está sincronizada (sem escrever arquivos) |

O comando `docs:sync` é um **comando customizado do projeto** (em `commands/docs_sync.ts`). Ele:

1. Varre todos os arquivos `.md` dentro de `docs/`.
2. Gera `docs/knowledge-base.generated.md` com índice, títulos e hashes de cada documento.
3. Regenera arquivos de agentes (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.kiro/`, `.agents/`, `.claude/`, `.github/`).
4. Garante que todos os arquivos gerados estão sincronizados com a documentação fonte.

### Quando executar

- Após criar, remover ou renomear documentos em `docs/`.
- Após alterar a ordem de leitura ou a estrutura de documentação.
- O CI executa `--check` automaticamente em PRs e `docs:sync` no push para `main` (commita alterações automaticamente via GitHub Actions).

### Arquivos gerenciados pelo docs:sync

| Arquivo | Propósito |
| --- | --- |
| `docs/knowledge-base.generated.md` | Índice de todos os docs com hashes |
| `AGENTS.md` | Instruções genéricas para agentes |
| `CLAUDE.md` | Instruções para Claude |
| `GEMINI.md` | Instruções para Gemini |
| `.kiro/README.md` | Instruções para Kiro |
| `.kiro/steering/project.md` | Contexto do projeto (steering) |
| `.kiro/steering/tech.md` | Diretrizes técnicas (steering) |
| `.kiro/steering/structure.md` | Estrutura de documentação (steering) |
| `.github/copilot-instructions.md` | Instruções para GitHub Copilot |
| `.github/instructions/docs.instructions.md` | Regras para editar docs |
| `.agents/skills/project-knowledge/SKILL.md` | Skill de conhecimento do projeto |
| `.claude/skills/project-knowledge/SKILL.md` | Skill de conhecimento (Claude) |

### Workflow de CI (`.github/workflows/docs-sync.yml`)

- Dispara em PRs e push na `main` quando arquivos de docs/agentes mudam.
- No push para `main`: executa `docs:sync` e commita automaticamente se houve mudanças.
- Em PRs: valida que a base está sincronizada.

## Ambiente e configuração

| Comando | Descrição |
| --- | --- |
| `env:add` | Adiciona variável ao `.env`, `.env.example` e `start/env.ts` |
| `generate:key` | Gera `APP_KEY` segura e salva no `.env` (`--show` para apenas exibir) |
| `inspect:rcfile` | Exibe a configuração resolvida do `adonisrc.ts` como JSON |
| `list:routes` | Lista todas as rotas com métodos, patterns, handlers e middleware |

## Fluxos comuns

### Criar um novo recurso (CRUD completo)

```bash
node ace make:model Post
node ace make:migration create_posts_table
node ace make:controller Post --resource
node ace make:validator post --resource
node ace migration:run
```

### Resetar banco e re-popular

```bash
node ace migration:fresh
node ace db:seed
```

### Ver rotas registradas

```bash
node ace list:routes
```

### Adicionar novo pacote AdonisJS

```bash
node ace add @adonisjs/mail
```
