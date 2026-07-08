/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.on('/').renderInertia('home', {}).as('home').use(middleware.feature({ slug: 'home' }))

    // Profile
    router.get('profile', [controllers.Profile, 'show']).as('profile').use(middleware.feature({ slug: 'profile' }))
    router.patch('profile', [controllers.Profile, 'update']).use(middleware.feature({ slug: 'profile' }))

    // Users
    router.get('users', [controllers.Users, 'index']).as('users').use(middleware.feature({ slug: 'users' }))
    router.patch('users/:id/role', [controllers.Users, 'updateRole']).use(middleware.feature({ slug: 'users' }))

    // Roles
    router.get('roles', [controllers.Roles, 'index']).as('roles').use(middleware.feature({ slug: 'roles' }))
    router.patch('roles/:id/features', [controllers.Roles, 'updateFeatures']).use(middleware.feature({ slug: 'roles' }))

    // Teams
    router.get('teams', [controllers.Teams, 'index']).as('teams').use(middleware.feature({ slug: 'teams' }))
    router.post('teams', [controllers.Teams, 'store']).use(middleware.feature({ slug: 'teams' }))
    router.patch('teams/:id', [controllers.Teams, 'update']).use(middleware.feature({ slug: 'teams' }))
    router.delete('teams/:id', [controllers.Teams, 'destroy']).use(middleware.feature({ slug: 'teams' }))

    // Features (restrito a owner via ability)
    router.get('features', [controllers.Features, 'index']).as('features').use(middleware.feature({ slug: 'features' }))
    router.post('features', [controllers.Features, 'store']).use(middleware.feature({ slug: 'features.create' }))
    router.patch('features/:id', [controllers.Features, 'update']).use(middleware.feature({ slug: 'features.edit' }))

    // Settings (placeholder)
    router
      .get('settings', ({ inertia }) => inertia.render('placeholder', { featureName: 'Configurações', featureDescription: 'Configurações gerais do sistema.' }))
      .as('settings')
      .use(middleware.feature({ slug: 'settings' }))

    // Logout
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
