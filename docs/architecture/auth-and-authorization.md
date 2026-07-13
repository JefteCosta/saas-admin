# Autenticação e Autorização

Consulte este documento antes de alterar login, signup, logout, redirecionamento entre domínios, contexto de company, permissões ou menu dinâmico.

## Visão Geral

O projeto usa autenticação baseada em sessão com suporte a múltiplos subdomínios e autorização baseada em features.

Há três superfícies de navegação principais:

- Domínio principal: páginas públicas (`/login`, `/signup`) e seleção de workspace (`/workspace`).
- Subdomínio `admin.<domínio>`: painel SaaS para usuários vinculados à company especial `admin`.
- Subdomínio `:tenant.<domínio>`: workspace da company do cliente, resolvido pelo slug da empresa.

Quando `APP_DOMAIN=localhost`, o projeto entra em modo simplificado e expõe rotas sem subdomínio para facilitar desenvolvimento e testes.

## Componentes Responsáveis

| Camada | Arquivo | Responsabilidade |
| --- | --- | --- |
| Controller | `app/controllers/new_account_controller.ts` | Signup, criação de `User` + `Company`, login automático e redirect inicial |
| Controller | `app/controllers/session_controller.ts` | Login, callback cross-domain, logout, logout global e workspace switcher |
| Service | `app/services/auth_token_service.ts` | Emissão e validação de token temporário para login cross-domain |
| Middleware | `app/middleware/auth_middleware.ts` | Exige usuário autenticado |
| Middleware | `app/middleware/guest_middleware.ts` | Impede acesso às telas públicas quando já existe sessão |
| Middleware | `app/middleware/saas_admin_middleware.ts` | Restringe o painel `admin.<domínio>` a membros/owner da company `admin` |
| Middleware | `app/middleware/company_context_middleware.ts` | Resolve a company pelo subdomínio e valida membership |
| Ability | `app/abilities/main.ts` | Regra de autorização `accessFeature` |
| Service | `app/services/feature_service.ts` | Resolve features do usuário e monta o menu hierárquico |
| Rotas | `start/routes.ts` | Segmenta rotas públicas, admin e tenant por domínio |

## Fluxo de Signup

O signup cria a fundação mínima do tenant.

1. O usuário envia nome, e-mail, senha e nome da empresa.
2. O controller valida o payload com VineJS.
3. O sistema busca a role `admin` e o plano `starter`.
4. O sistema cria o `User` com `role_id = admin`.
5. O sistema gera um slug único para a company.
6. O sistema cria a `Company` com `owner_user_id = user.id`.
7. O sistema vincula o usuário à pivot `company_members`.
8. O sistema autentica o usuário na sessão atual.
9. Em modo com subdomínios, o browser é redirecionado para o workspace inicial da company recém-criada.

Se a role `admin` não existir, o signup é bloqueado com mensagem de configuração incompleta. Isso evita criar usuários em um ambiente sem seeds essenciais.

## Fluxo de Login

O login sempre começa no domínio atual, mas o destino final depende das companies associadas ao usuário.

1. O controller valida credenciais com `User.verifyCredentials`.
2. O sistema cria a sessão local com `auth.use('web').login(user)`.
3. O método `resolveRedirect` decide o destino:
   - se o usuário pertence à company `admin`, vai para `admin.<domínio>`;
   - se tiver exatamente uma company utilizável fora do painel SaaS, vai direto para `:tenant.<domínio>`;
   - se tiver várias companies, vai para `/workspace` no domínio principal.
4. Se o destino estiver em outro host, o sistema usa um token temporário para concluir a autenticação no host final.

## Login Cross-Domain

Como a sessão não é compartilhada entre subdomínios, a autenticação cross-domain usa um token temporário.

1. Após o login inicial, o sistema gera um token aleatório de uso único.
2. O token é salvo em `auth_tokens` com TTL de 30 segundos.
3. O browser recebe um redirect completo para `/auth/callback?token=...` no host de destino.
4. O callback valida o token, marca `used_at` e autentica o usuário naquele host.
5. O usuário é redirecionado para `/` do host final.

Esse fluxo está descrito visualmente em [docs/graph/auth-flow.generated.md](../graph/auth-flow.generated.md).

## Sessão e Logout

O projeto usa `@adonisjs/session` com cookie `adonis-session`.

- O cookie não define `domain` compartilhado.
- Cada subdomínio mantém sua própria sessão.
- O login entre hosts depende do callback com token.
- O logout em subdomínio executa duas etapas: encerra a sessão local e depois redireciona para o domínio principal para limpar a sessão de origem.

Essa decisão mantém o isolamento entre hosts e simplifica o comportamento local quando `APP_DOMAIN=localhost`.

## Workspace Switcher

O endpoint `/workspace` existe no domínio principal e lista os workspaces disponíveis para o usuário autenticado.

Na composição da lista, o controller considera:

- a company SaaS `admin`, se o usuário for membro ou owner;
- companies em que o usuário é proprietário;
- companies em que o usuário aparece como membro na pivot `company_members`.

O switcher existe para o caso em que o usuário participa de mais de uma company e o sistema não pode escolher um destino único após o login.

## Contexto de Company

As rotas de tenant usam `company_context_middleware`.

Esse middleware:

1. resolve o slug pelo subdomínio `:tenant`;
2. busca a `Company` correspondente;
3. verifica se a empresa está ativa;
4. valida se o usuário é owner ou membro da company;
5. injeta `company` e `companyMembership` no contexto HTTP.

As rotas do painel SaaS usam `saas_admin_middleware`, que aplica a mesma ideia para a company especial `admin`.

## Modelo de Autorização

O sistema usa uma ability principal chamada `accessFeature`.

### Hierarquia atual

- `owner`: bypass total.
- `admin`: acesso amplo, com bloqueio explícito para `features.create` e `features.edit`.
- demais roles: acesso calculado por role direta e roles herdadas via teams.

### Regra efetiva

```text
1. Carregar a role do usuário, se necessário.
2. Se a role for owner, autorizar.
3. Se a role for admin, negar apenas features restritas do painel SaaS.
4. Caso contrário, calcular features via FeatureService.
```

Hoje a autorização efetiva está centrada em roles, teams e features. O plano de companies, módulos e limites descreve a evolução para restringir acesso também pelo plano contratado da company, mas essa verificação deve ser confirmada no código sempre que houver mudanças nessa área.

## Resolução de Permissões

`FeatureService.getUserFeatures(user)` combina:

- features da role direta do usuário;
- features das roles dos teams aos quais ele pertence.

O resultado é tratado como união sem duplicatas e limitado a features ativas.

`FeatureService.userCanAccess(user, featureSlug)` usa essa lista consolidada para responder se a feature está disponível.

## Menu Dinâmico

O menu compartilhado com o frontend é derivado do mesmo modelo de permissões.

- `owner`: recebe todas as features ativas marcadas como item de menu.
- `admin`: recebe todas as features ativas de menu, exceto as do módulo `saas`.
- demais roles: recebem apenas as features permitidas pela união role + teams.

O retorno é agrupado em hierarquia de `módulo -> grupo -> itens`, usando os relacionamentos `module` e `featureGroup` de cada feature.

## Relação com o Modelo Multi-Tenant

O modelo atual já integra autenticação e company context, mas a documentação de planejamento ainda descreve parte da evolução funcional:

- [docs/planning/companies-modules-limits-plan.md](../planning/companies-modules-limits-plan.md) concentra o desenho de plans, modules, feature groups e limites.
- [docs/planning/features-roles-permissions-plan.md](../planning/features-roles-permissions-plan.md) registra a base histórica do sistema de roles e features.

Ao alterar o comportamento atual, prefira atualizar primeiro este documento e os arquivos de arquitetura. Use os planos apenas como histórico de decisão ou roadmap complementar.

## Arquivos Relacionados

- [docs/architecture/backend.md](backend.md)
- [docs/architecture/overview.md](overview.md)
- [docs/graph/auth-flow.generated.md](../graph/auth-flow.generated.md)
- [docs/planning/companies-modules-limits-plan.md](../planning/companies-modules-limits-plan.md)
- [docs/planning/features-roles-permissions-plan.md](../planning/features-roles-permissions-plan.md)
