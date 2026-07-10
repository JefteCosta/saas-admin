# Plano: Comando `graph:generate`

Consulte este documento ao implementar ou modificar o comando `node ace graph:generate`.

## Objetivo

Gerar automaticamente diagramas Mermaid e tabelas de referência a partir do código-fonte, facilitando a compreensão da arquitetura por humanos e agentes de IA.

## Escopo

O comando `node ace graph:generate` escaneia o projeto e produz:

1. **Models** — `docs/graph/models.generated.md` — erDiagram Mermaid + tabela
2. **Routes** — `docs/graph/routes.generated.md` — flowchart + tabela
3. **Controllers** — `docs/graph/controllers.generated.md` — classDiagram + tabela
4. **Services/Middleware** — `docs/graph/services.generated.md` — flowchart TB + tabela
5. **Frontend** — `docs/graph/frontend.generated.md` — tree diagram + tabela
6. **Permissions** — `docs/graph/permissions.generated.md` — flowchart + tabela
7. **Auth Flow** — `docs/graph/auth-flow.generated.md` — sequenceDiagram + flowchart
8. **Tests** — `docs/graph/tests.generated.md` — tabela com cobertura
9. **Index** — `docs/graph/index.generated.md` — TOC unificado + todos os diagramas

## Regras de implementação

- Arquivo único: `commands/graph_generate.ts`
- Segue o padrão de `commands/docs_sync.ts` (BaseCommand, setFile, --check)
- Parsing via regex (sem AST libraries)
- Header obrigatório: `> Arquivo gerado automaticamente por \`node ace graph:generate\`. Não edite manualmente.`
- Diagramas em blocos ````mermaid`
- Documentação e comentários em pt_BR

## Regras de parsing

### Models
- Classe: `export default class X extends`
- Colunas: `declare fieldName: Type`
- Relações: `@belongsTo(() => Model)`, `@hasMany(() => Model)`, `@manyToMany(() => Model)`
- Tabela: camelCase → snake_case

### Routes
- Pattern: `router.get/post/patch/delete('path', [controllers.X, 'method'])`
- Named: `.as('name')`
- Middlewares: `.use(middleware.x())`
- Inline pages: `renderInertia('page', ...)`

### Controllers
- Classe: `export default class XController`
- Métodos: `async methodName({ ... }: HttpContext)`
- Models: `import X from '#models/x'`
- Pages: `inertia.render('page', ...)`
- Flash: `session.flash('type', 'msg')`

### Services/Middleware
- Exports: class/function
- Imports: `#models` ou `#services`
- Métodos: async/static públicos

### Frontend
- Imports: `~/components/...` ou `~/layouts/...`
- Props: `defineProps<{...}>()`
- Layout: `layout: X`
- Composables: `usePage()`, `useForm()`

### Permissions
- Seeder: `Module.create`, `FeatureGroup.create`, `Feature.create`
- Abilities: Bouncer rules
- Service: access logic

### Auth Flow
- Login/logout/signup como sequenceDiagram
- Token cross-domain

### Tests
- Groups: `test.group('name', ...)`
- Tests: `test('name', ...)`
- Tipo: functional/ vs browser/
- URLs visitadas
