# Plano: Avisos de Erro/Sucesso na UI

## Status: Em andamento

## Problema

As flash messages (`session.flash('error', ...)` e `session.flash('success', ...)`) enviadas pelo backend não são exibidas na interface:

1. Na tela de login, quando email/senha estão errados, nenhuma mensagem aparece
2. Nas telas de admin (roles, teams, features, users), os flash de sucesso/erro do server não são visíveis
3. Os erros de validação por campo nas telas de auth existem mas não têm estilo visual adequado

## Requisitos

- Banner/Alert vermelho acima do formulário para erros genéricos (login, etc.)
- Manter erros por campo + banner genérico "Corrija os erros abaixo" no topo quando há erros de validação
- Toasts globais (vue-sonner) para flash messages de sucesso/erro nas telas de admin
- Usar a mensagem retornada pelo `verifyCredentials` do AdonisJS

## Decisões Técnicas

- **Componente Alert**: shadcn-vue com class-variance-authority (variantes `default` e `destructive`)
- **Toasts**: vue-sonner (já instalado, falta montar `<Toaster>`)
- **Flash messages**: já compartilhadas via `inertia_middleware.ts` → `flash: { error, success }`
- **Composable**: `useFlashToast` reage a mudanças de flash props e dispara toasts automaticamente
- **Separação**: Auth usa banners (Alert), Admin usa toasts (Sonner)

## Tasks

### Task 1: Componente Alert do shadcn-vue ✅
- Criar `inertia/components/ui/alert/` (Alert.vue, AlertTitle.vue, AlertDescription.vue, index.ts)

### Task 2: Try/catch no SessionController ✅
- Capturar exception do `verifyCredentials` e setar `session.flash('error', '...')`

### Task 3: Banner de erro na tela de login ✅
- `login.vue` exibe `<Alert variant="destructive">` quando `flash.error` está presente

### Task 4: Banner + erros estilizados no signup ✅
- Banner "Corrija os erros abaixo" + classes `text-destructive text-sm` nos erros por campo

### Task 5: Toaster global ✅
- `<Toaster />` montado em `default.vue` e `auth.vue`

### Task 6: Composable useFlashToast ✅
- Watch em flash props, dispara `toast.success()` / `toast.error()` no layout admin

### Task 7: Estilização de erros em login.vue ✅
- Classes `text-destructive text-sm font-medium` nos divs de erro

### Task 8: Testes E2E ✅
- Verificar banner de erro no login
- Verificar toast de sucesso ao criar role/team

## Arquivos Alterados

- `inertia/components/ui/alert/Alert.vue`
- `inertia/components/ui/alert/AlertTitle.vue`
- `inertia/components/ui/alert/AlertDescription.vue`
- `inertia/components/ui/alert/index.ts`
- `app/controllers/session_controller.ts`
- `inertia/pages/auth/login.vue`
- `inertia/pages/auth/register.vue`
- `inertia/layouts/default.vue`
- `inertia/layouts/auth.vue`
- `inertia/composables/useFlashToast.ts`
- `tests/browser/auth.spec.ts`
