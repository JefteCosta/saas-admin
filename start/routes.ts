/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| Quando APP_DOMAIN != localhost → rotas por subdomínio.
| Quando APP_DOMAIN = localhost → rotas flat (dev/test simples).
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import env from '#start/env'

const domain = env.get('APP_DOMAIN', 'localhost')
const useSubdomains = domain !== 'localhost'

/*
|--------------------------------------------------------------------------
| Páginas públicas (login, signup)
|--------------------------------------------------------------------------
*/
const publicRoutes = router.group(() => {
  router.get('signup', [controllers.NewAccount, 'create'])
  router.post('signup', [controllers.NewAccount, 'store'])
  router.get('login', [controllers.Session, 'create'])
  router.post('login', [controllers.Session, 'store'])
})
// Rotas públicas funcionam em qualquer domínio (sem .domain())
publicRoutes.use(middleware.guest())

/*
|--------------------------------------------------------------------------
| Rotas autenticadas
|--------------------------------------------------------------------------
*/
if (useSubdomains) {
  // ── Workspace switcher ──
  router
    .group(() => {
      router.get('workspace', [controllers.Session, 'workspace']).as('workspace')
      router.post('logout', [controllers.Session, 'destroy']).as('logout')
    })
    .domain(domain)
    .use(middleware.auth())

  // ── Painel SaaS Admin (admin.domain) ──
  router
    .group(() => {
      router.on('/').renderInertia('home', {}).as('admin.home')
      router.get('profile', [controllers.Profile, 'show']).as('admin.profile')
      router.patch('profile', [controllers.Profile, 'update']).as('admin.profile.update')
      router.get('users', [controllers.Users, 'index']).as('admin.users')
      router.patch('users/:id/role', [controllers.Users, 'updateRole']).as('admin.users.updateRole')
      router.get('roles', [controllers.Roles, 'index']).as('admin.roles')
      router.post('roles', [controllers.Roles, 'store']).as('admin.roles.store')
      router.patch('roles/:id/features', [controllers.Roles, 'updateFeatures']).as('admin.roles.updateFeatures')
      router.delete('roles/:id', [controllers.Roles, 'destroy']).as('admin.roles.destroy')
      router.get('teams', [controllers.Teams, 'index']).as('admin.teams')
      router.post('teams', [controllers.Teams, 'store']).as('admin.teams.store')
      router.patch('teams/:id', [controllers.Teams, 'update']).as('admin.teams.update')
      router.delete('teams/:id', [controllers.Teams, 'destroy']).as('admin.teams.destroy')
      router.get('features', [controllers.Features, 'index']).as('admin.features')
      router.post('features', [controllers.Features, 'store']).as('admin.features.store')
      router.patch('features/:id', [controllers.Features, 'update']).as('admin.features.update')
      router.get('settings', ({ inertia }) => inertia.render('placeholder', { featureName: 'Configurações' })).as('admin.settings')
      router.post('logout', [controllers.Session, 'destroy']).as('admin.logout')
    })
    .domain(`admin.${domain}`)
    .use(middleware.auth())
    .use(middleware.saasAdmin())

  // ── Workspace da company (:tenant.domain) ──
  router
    .group(() => {
      router.on('/').renderInertia('home', {}).as('tenant.home')
      router.get('profile', [controllers.Profile, 'show']).as('tenant.profile')
      router.patch('profile', [controllers.Profile, 'update']).as('tenant.profile.update')
      router.get('users', [controllers.Users, 'index']).as('tenant.users')
      router.patch('users/:id/role', [controllers.Users, 'updateRole']).as('tenant.users.updateRole')
      router.get('roles', [controllers.Roles, 'index']).as('tenant.roles')
      router.post('roles', [controllers.Roles, 'store']).as('tenant.roles.store')
      router.patch('roles/:id/features', [controllers.Roles, 'updateFeatures']).as('tenant.roles.updateFeatures')
      router.delete('roles/:id', [controllers.Roles, 'destroy']).as('tenant.roles.destroy')
      router.get('teams', [controllers.Teams, 'index']).as('tenant.teams')
      router.post('teams', [controllers.Teams, 'store']).as('tenant.teams.store')
      router.patch('teams/:id', [controllers.Teams, 'update']).as('tenant.teams.update')
      router.delete('teams/:id', [controllers.Teams, 'destroy']).as('tenant.teams.destroy')
      router.get('company', ({ inertia }) => inertia.render('placeholder', { featureName: 'Dados da Empresa' })).as('tenant.company')
      router.get('settings', ({ inertia }) => inertia.render('placeholder', { featureName: 'Configurações' })).as('tenant.settings')
      router.post('logout', [controllers.Session, 'destroy']).as('tenant.logout')
    })
    .domain(`:tenant.${domain}`)
    .use(middleware.auth())
    .use(middleware.companyContext())
} else {
  // ── Modo localhost (sem subdomínio) — testes e dev simples ──
  router
    .group(() => {
      router.on('/').renderInertia('home', {}).as('home')
      router.get('workspace', [controllers.Session, 'workspace']).as('workspace')
      router.get('profile', [controllers.Profile, 'show']).as('profile')
      router.patch('profile', [controllers.Profile, 'update']).as('profile.update')
      router.get('users', [controllers.Users, 'index']).as('users')
      router.patch('users/:id/role', [controllers.Users, 'updateRole']).as('users.updateRole')
      router.get('roles', [controllers.Roles, 'index']).as('roles')
      router.post('roles', [controllers.Roles, 'store']).as('roles.store')
      router.patch('roles/:id/features', [controllers.Roles, 'updateFeatures']).as('roles.updateFeatures')
      router.delete('roles/:id', [controllers.Roles, 'destroy']).as('roles.destroy')
      router.get('teams', [controllers.Teams, 'index']).as('teams')
      router.post('teams', [controllers.Teams, 'store']).as('teams.store')
      router.patch('teams/:id', [controllers.Teams, 'update']).as('teams.update')
      router.delete('teams/:id', [controllers.Teams, 'destroy']).as('teams.destroy')
      router.get('features', [controllers.Features, 'index']).as('features')
      router.post('features', [controllers.Features, 'store']).as('features.store')
      router.patch('features/:id', [controllers.Features, 'update']).as('features.update')
      router.get('settings', ({ inertia }) => inertia.render('placeholder', { featureName: 'Configurações' })).as('settings')
      router.post('logout', [controllers.Session, 'destroy']).as('logout')
    })
    .use(middleware.auth())
}

/*
|--------------------------------------------------------------------------
| Rota fallback: / redireciona para workspace (funciona em qualquer host)
| Só registrada quando useSubdomains=true (pois no modo localhost o bloco else já tem /)
|--------------------------------------------------------------------------
*/
if (useSubdomains) {
  router.get('/', async ({ auth, response }) => {
    if (!auth.user) return response.redirect('/login')
    return response.redirect('/workspace')
  }).as('root.fallback')

  router.get('/workspace', [controllers.Session, 'workspace']).as('workspace.fallback').use(middleware.auth())
}
