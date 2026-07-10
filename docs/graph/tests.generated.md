# Tests — Mapa de Testes

> Arquivo gerado automaticamente por `node ace graph:generate`. Não edite manualmente.

## Resumo

- **Total de testes**: 36
- **Browser tests**: 15 (7 arquivos)
- **Functional tests**: 21 (3 arquivos)

## Detalhamento

| Arquivo | Tipo | Grupo | Testes | URLs |
| --- | --- | --- | --- | --- |
| tests/browser/auth.spec.ts | browser | Browser - Autenticação | 4 | /login, /signup |
| tests/browser/features.spec.ts | browser | Browser - CRUD Features | 1 | /login |
| tests/browser/navigation.spec.ts | browser | Browser - Navegação e Menu | 3 | /login |
| tests/browser/profile.spec.ts | browser | Browser - Perfil | 2 | /login |
| tests/browser/roles.spec.ts | browser | Browser - CRUD Roles | 2 | /login |
| tests/browser/teams.spec.ts | browser | Browser - CRUD Teams | 2 | /login |
| tests/browser/users.spec.ts | browser | Browser - CRUD Users | 1 | /login |
| tests/functional/auth.spec.ts | functional | Auth - proteção da home | 4 | /, /profile |
| tests/functional/features.spec.ts | functional | Features - Permissões por role | 8 | /, /profile |
| tests/functional/graph_generate.spec.ts | functional | GraphRAG - Comando graph:generate | 9 | - |

## Lista de Testes

### Browser - Autenticação (browser)

- faz login com credenciais válidas
- mostra erro com credenciais inválidas
- faz logout com sucesso
- signup cria conta e empresa

### Browser - CRUD Features (browser)

- lista features do sistema

### Browser - Navegação e Menu (browser)

- sidebar mostra módulo e itens após login
- dark mode toggle funciona
- navegar para perfil pelo sidebar

### Browser - Perfil (browser)

- exibe dados do perfil
- edita nome do perfil

### Browser - CRUD Roles (browser)

- lista roles existentes
- criar nova role

### Browser - CRUD Teams (browser)

- exibe mensagem quando não há times
- criar novo time

### Browser - CRUD Users (browser)

- lista usuários cadastrados

### Auth - proteção da home (functional)

- redireciona para /login quando não está autenticado
- acessa a home com sucesso quando está autenticado
- acessa a página de perfil quando autenticado
- redireciona para /login ao acessar /profile sem autenticação

### Features - Permissões por role (functional)

- owner acessa qualquer feature (bypass total)
- admin acessa home e profile
- member acessa home e profile (features atribuídas à role)
- usuário sem role não acessa features protegidas
- member sem feature atribuída não acessa rota protegida
- member herda acesso a feature via team
- member sem team não acessa feature que só existe no team
- novo usuário recebe role admin no signup

### GraphRAG - Comando graph:generate (functional)

- comando executa sem erros
- gera todos os 9 arquivos esperados
- arquivos principais contêm blocos Mermaid
- models.generated.md contém models conhecidos
- routes.generated.md contém rotas conhecidas
- tests.generated.md contém testes conhecidos
- index.generated.md contém links para todas as seções
- flag --check não falha quando arquivos estão atualizados
- comando é idempotente (rodar 2x gera mesmo output)
