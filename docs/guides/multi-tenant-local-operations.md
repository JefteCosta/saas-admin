# Guia Operacional Multi-tenant (Local)

Consulte este documento antes de configurar ambiente local, validar subdomínios e testar os fluxos de autenticação/autorização multi-tenant.

## Objetivo

Padronizar como subir o projeto localmente em dois modos de execução:

- modo simplificado (`APP_DOMAIN=localhost`), útil para dev e testes rápidos;
- modo com subdomínios (`APP_DOMAIN=saas-admin.local`), útil para validar isolamento real de tenant e redirecionamentos cross-domain.

## Pré-requisitos

- Node.js >= 24
- dependências instaladas com `npm install`
- banco e seeds iniciais aplicados

Comandos recomendados:

```bash
node ace migration:run
node ace db:seed
npm run dev
```

Sem seed básica, o signup pode falhar por ausência de role `admin` e o menu pode ficar vazio por falta de roles/features.

## Variáveis de ambiente essenciais

Use `.env` como fonte de configuração local.

Campos relevantes:

- `HOST`
- `PORT`
- `APP_URL`
- `APP_DOMAIN`
- `SESSION_DRIVER`

Exemplo para modo com subdomínios:

```env
HOST=localhost
PORT=3333
APP_URL=http://${HOST}:${PORT}
APP_DOMAIN=saas-admin.local
SESSION_DRIVER=cookie
```

Exemplo para modo simplificado:

```env
APP_DOMAIN=localhost
```

## Configuração de hosts (modo subdomínio)

Adicione entradas no `/etc/hosts`:

```text
127.0.0.1 saas-admin.local
127.0.0.1 admin.saas-admin.local
```

Subdomínios de tenant são dinâmicos e resolvidos por `:tenant` nas rotas. Exemplo: `acme.saas-admin.local`.

## Como escolher o modo de execução

### Modo `localhost`

- sem separação real por host;
- útil para fluxo rápido de CRUD e testes funcionais simples;
- login e navegação ficam no mesmo host.

### Modo subdomínio

- separa domínio principal, painel SaaS e workspaces de tenant;
- exercita callback de autenticação cross-domain;
- valida middlewares `saas_admin` e `company_context` em runtime real.

## Fluxo operacional para validar autenticação

### Cenário 1: signup com criação de company

1. Acessar `/signup` no domínio principal.
2. Criar usuário e informar nome da empresa.
3. Confirmar redirect para o host do tenant recém-criado (modo subdomínio) ou `/` (modo localhost).

### Cenário 2: login com redirecionamento

1. Fazer login em `/login`.
2. Validar destino resolvido:
   - `admin.<domínio>` se usuário for da company `admin`;
   - `:tenant.<domínio>` quando houver um único workspace elegível;
   - `/workspace` no domínio principal quando houver múltiplos workspaces.

### Cenário 3: callback cross-domain

1. Confirmar redirect para `/auth/callback?token=...` no host de destino.
2. Confirmar criação de sessão no host final e redirect para `/`.
3. Se token expirar, validar retorno para `/login`.

### Cenário 4: logout multi-host

1. Executar logout em host de tenant ou admin.
2. Confirmar encerramento local.
3. Confirmar redirect para logout global no domínio principal.
4. Confirmar destino final em `/login`.

## Fluxo operacional para validar autorização

### Cenário 1: painel SaaS

1. Acessar `admin.<domínio>` com usuário membro da company `admin`.
2. Confirmar acesso às rotas de administração global.
3. Tentar acessar com usuário sem vínculo com company `admin` e validar bloqueio.

### Cenário 2: workspace de tenant

1. Acessar `:tenant.<domínio>` com usuário membro ou owner da company.
2. Confirmar que `company_context` resolve a empresa correta.
3. Tentar acessar tenant sem vínculo e validar resposta de acesso negado.

### Cenário 3: features por role e teams

1. Alterar role direta ou vínculos de team do usuário.
2. Confirmar alteração de acesso e menu dinâmico.
3. Validar bloqueios para slugs restritos em `accessFeature`.

## Checklist rápido de troubleshooting

- Signup falhando com erro de configuração inicial: rodar seeders.
- Redirect inesperado após login: revisar companies vinculadas ao usuário e `APP_DOMAIN`.
- Subdomínio não resolve: revisar `/etc/hosts` e porta atual do servidor.
- Menu vazio ou incompleto: confirmar seed de features/roles e vínculos de role/team.
- Usuário sem acesso ao tenant: conferir pivot `company_members` e owner da company.

## Referências

- [Arquitetura de autenticação e autorização](../architecture/auth-and-authorization.md)
- [Arquitetura backend](../architecture/backend.md)
- [Guia de desenvolvimento](development.md)
- [Guia de testes](testing.md)
