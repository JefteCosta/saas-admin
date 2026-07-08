# Plano: Testes de Browser (E2E)

Consulte este documento para implementar testes end-to-end com Playwright/Japa.

## Stack

- **Runner**: Japa (`@japa/runner`)
- **Browser**: `@japa/browser-client` (já instalado) — usa Playwright
- **Autenticação**: `@adonisjs/auth/plugins/browser_client` (authBrowserClient)
- **Session**: `@adonisjs/session/plugins/browser_client` (sessionBrowserClient)
- **Diretório**: `tests/browser/`
- **Suite config**: `adonisrc.ts` → suites → `{ name: 'browser', files: ['tests/browser/**/*.spec.ts'], timeout: 300000 }`

## Comandos

```bash
# Rodar testes de browser
node ace test browser

# Rodar com browser visível
node ace test browser --headed

# Rodar em câmera lenta (debug visual)
node ace test browser --headed --slow=500

# Gravar trace em caso de erro
node ace test browser --trace=onError

# Browser específico
node ace test browser --browser=firefox

# Arquivo específico
node ace test browser --files="auth*"
```

## Configuração

### tests/bootstrap.ts

```typescript
import { browserClient } from '@japa/browser-client'
import { authBrowserClient } from '@adonisjs/auth/plugins/browser_client'
import { sessionBrowserClient } from '@adonisjs/session/plugins/browser_client'

export const plugins: Config['plugins'] = [
  assert(),
  apiClient(),
  pluginAdonisJS(app),
  dbAssertions(app),
  shieldApiClient(),
  sessionApiClient(app),
  authApiClient(app),
  // Browser
  browserClient({ runInSuites: ['browser'] }),
  sessionBrowserClient(app),
  authBrowserClient(app),
]
```

### .env.test

```
SESSION_DRIVER=memory
APP_DOMAIN=localhost
```

### Instalar Playwright

```bash
npx playwright install chromium
```

## Padrão dos testes

```typescript
import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Nome do grupo', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('descrição do teste', async ({ visit, browserContext }) => {
    // 1. Setup: criar dados necessários
    const role = await Role.firstOrCreate({ slug: 'admin' }, { name: 'Admin' })
    const user = await User.create({
      email: 'test@test.com',
      password: 'secret123',
      fullName: 'Test User',
      roleId: role.id,
    })

    // 2. Autenticar (para páginas protegidas)
    await browserContext.loginAs(user)

    // 3. Visitar página
    const page = await visit('/')

    // 4. Interagir (Playwright API)
    await page.getByRole('link', { name: 'Usuários' }).click()

    // 5. Assertar
    await page.assertPathIncludes('/users')
    await page.assertTextContains('body', 'Usuários')
  })
})
```

## Testes a implementar

### 1. auth.spec.ts — Autenticação

| Teste | Ação | Verificação |
| --- | --- | --- |
| Signup completo | Preenche nome, email, senha, empresa → submete | Redirect para página autenticada |
| Login válido | Preenche email e senha → submete | Redirect para home/workspace |
| Login inválido | Preenche dados errados → submete | Mensagem de erro na página |
| Logout | Clica no botão "Sair" | Redirect para /login |

### 2. navigation.spec.ts — Navegação e menu

| Teste | Ação | Verificação |
| --- | --- | --- |
| Menu carrega com módulos | Loga como owner → acessa home | Módulos aparecem no sidebar |
| Item ativo muda | Clica em "Usuários" | Item marcado como ativo |
| Dark mode toggle | Clica no botão de tema | Classe .dark no HTML |
| Dropdown de usuário | Clica no avatar | Mostra nome e email |

### 3. users.spec.ts — CRUD de Usuários

| Teste | Ação | Verificação |
| --- | --- | --- |
| Lista usuários | Acessa /users | Tabela com email do owner |
| Alterar role | Seleciona nova role no select | Flash de sucesso |

### 4. roles.spec.ts — CRUD de Papéis

| Teste | Ação | Verificação |
| --- | --- | --- |
| Lista roles | Acessa /roles | Cards com owner, admin, member, viewer |
| Criar nova role | Clica "Nova role" → preenche → submete | Nova role aparece |
| Editar permissões | Clica "Editar permissões" → toggle features → salva | Flash de sucesso |
| Remover role | Clica "Remover" → confirma | Role desaparece |

### 5. teams.spec.ts — CRUD de Times

| Teste | Ação | Verificação |
| --- | --- | --- |
| Lista vazia | Acessa /teams | Mensagem "Nenhum time" |
| Criar team | Clica "Novo time" → preenche → submete | Novo team aparece |
| Remover team | Clica "Remover" → confirma | Team desaparece |

### 6. features.spec.ts — CRUD de Features (owner only)

| Teste | Ação | Verificação |
| --- | --- | --- |
| Lista features | Loga como owner → acessa /features | Tabela com features |
| Criar feature | Clica "Nova feature" → preenche → submete | Nova feature na tabela |
| Editar feature | Clica "Editar" → modifica nome → salva | Nome atualizado |

### 7. profile.spec.ts — Perfil

| Teste | Ação | Verificação |
| --- | --- | --- |
| Visualiza perfil | Acessa /profile | Nome e email visíveis |
| Edita nome | Altera nome → clica salvar | Flash de sucesso, nome atualizado |

### 8. workspace.spec.ts — Workspace Switcher

| Teste | Ação | Verificação |
| --- | --- | --- |
| Mostra companies | User com company → acessa /workspace | Lista de companies |

## Fases de implementação

### Fase 1: Configuração ✅ (a fazer)

- [ ] Instalar playwright: `npx playwright install chromium`
- [ ] Atualizar tests/bootstrap.ts com plugins de browser
- [ ] Criar teste básico (smoke test) para validar setup

### Fase 2: Testes de auth

- [ ] tests/browser/auth.spec.ts (signup, login, logout, erro)

### Fase 3: Testes de navegação

- [ ] tests/browser/navigation.spec.ts (menu, dark mode, dropdown)

### Fase 4: Testes de CRUDs

- [ ] tests/browser/users.spec.ts
- [ ] tests/browser/roles.spec.ts
- [ ] tests/browser/teams.spec.ts
- [ ] tests/browser/features.spec.ts
- [ ] tests/browser/profile.spec.ts

### Fase 5: Workspace

- [ ] tests/browser/workspace.spec.ts

## Assertions disponíveis (page)

```typescript
await page.assertPath('/users')           // URL path exato
await page.assertPathIncludes('/users')    // URL contém
await page.assertTextContains('body', 'X') // Texto na página
await page.assertVisible('selector')       // Elemento visível
await page.assertNotVisible('selector')    // Elemento não visível
await page.assertTitle('Título')           // Título da página
```

## Locators úteis (Playwright)

```typescript
page.getByRole('link', { name: 'Usuários' })   // Link por texto
page.getByRole('button', { name: 'Salvar' })   // Botão por texto
page.getByLabel('Email')                         // Input por label
page.getByPlaceholder('Buscar...')              // Input por placeholder
page.getByText('Texto visível')                  // Qualquer elemento por texto
page.locator('[data-testid="my-id"]')           // Por data-testid
```
