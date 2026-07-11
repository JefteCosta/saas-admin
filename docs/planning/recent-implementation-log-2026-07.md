# Log de Implementação Recente (2026-07)

Consulte este documento quando precisar de um resumo consolidado das mudanças recentes executadas no produto e no frontend.

## Escopo documentado

- Correções de autenticação e redirecionamento Inertia.
- Melhorias de UX no fluxo de workspace.
- Diagnóstico e estabilização de menu por permissões.
- Redesign visual das telas principais.
- Padronização de dark mode com shadcn-vue.
- Inclusão de rodapé global no app autenticado.

## Entregas realizadas

### 1. Fluxo auth e redirects

- Ajuste do comportamento de redirect para cenários cross-domain com Inertia (`X-Inertia-Location`).
- Correção do fluxo de login/logout/signup para evitar resposta JSON inválida em requests Inertia.
- Ajuste no cadastro para validar dependência de role admin e retornar erro amigável quando seed está incompleta.

### 2. Workspace e sessão

- Inclusão de ação de logout na tela de seleção de workspace.
- Melhor experiência para sair da sessão antes de escolher empresa.

### 3. Menu e permissões

- Diagnóstico de menu ausente para contas novas: dependência direta de seed (roles/features) e role atribuída ao usuário.
- Ajustes operacionais para restaurar menu em ambiente de desenvolvimento.
- Validação da coerência menu x rotas, com correção de rotas de empresa/endereços no contexto tenant.

### 4. Redesign de interface

- Revisão dos layouts `auth` e `default`.
- Novo visual para dashboard (`home`) com cards de KPI, gráficos e tabela.
- Refinamento da sidebar (hierarquia, colapso, alinhamento de ícones, cores por módulo).
- Atualização da tela de perfil para um layout mais editorial e informativo.

### 5. Tema (light/dark)

- Migração de cores fixas para tokens semânticos (`bg-background`, `text-foreground`, `bg-card`, `bg-sidebar`, etc.).
- Correção de dark mode no dashboard e componentes de navegação.
- Correção de dark mode no fluxo de login/cadastro com toggle no layout de autenticação.

### 6. Rodapé global

- Criação de componente `site_footer.vue`.
- Inclusão no layout autenticado para exibição consistente em telas internas.

## Arquivos mais impactados

- Frontend/layout: `inertia/layouts/default.vue`, `inertia/layouts/auth.vue`
- Navegação: `inertia/components/app_sidebar.vue`, `inertia/components/nav_main.vue`, `inertia/components/nav_user.vue`, `inertia/components/site_header.vue`
- Conteúdo: `inertia/pages/home.vue`, `inertia/pages/profile.vue`, `inertia/pages/workspace.vue`
- Tema: `inertia/css/app.css`, `inertia/composables/use_theme.ts`
- Backend/rotas: `start/routes.ts`, `app/controllers/session_controller.ts`, `app/controllers/new_account_controller.ts`

## Próximos passos recomendados

- Concluir migração de tokens semânticos em 100% das páginas restantes.
- Substituir placeholders de negócio por telas reais (`company`, `addresses`, `campaigns`, `settings`).
- Ampliar testes E2E para fluxo de tema, autenticação e navegação por permissões.
