# Plano de Implementação da Fundação SaaS

Consulte este documento ao revisar ou continuar a implementação da base multi-tenant.

## Objetivo

Transformar a prova de conceito inicial (autenticação básica) em uma base multi-tenant funcional, com tenant, usuários, RBAC mínimo, limites de plano e administração básica.

## Escopo

- Signup cria `User`, `Tenant` e membership `owner`.
- Login resolve workspace existente.
- Contexto de workspace centralizado resolve tenant, plano, membership e permissões.
- Acesso ao app exige membership ativa e tenant ativo.
- RBAC mínimo define permissões por papel (owner, admin, member).
- Limites de plano configuráveis.
- Tela de gerenciamento de membros do tenant.
- Área administrativa SaaS para consultar tenants e status.

## Critérios de aceite

- Um signup cria usuário, tenant e membership `owner`.
- Um login de usuário existente não cria tenant duplicado.
- Um usuário sem membership ativa não acessa a área interna.
- Um convite acima do limite do plano é bloqueado.
- A área admin é restrita a e-mails administrativos configurados.

## Validação

```bash
npm run typecheck
npm run lint
npm test
node ace docs:sync
```
