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

    router.get('profile', [controllers.Profile, 'show']).as('profile').use(middleware.feature({ slug: 'profile' }))
    router.patch('profile', [controllers.Profile, 'update']).use(middleware.feature({ slug: 'profile' }))

    router
      .get('users', ({ inertia }) => inertia.render('placeholder', { featureName: 'Usuários', featureDescription: 'Gerenciamento de usuários do sistema.' }))
      .as('users')
      .use(middleware.feature({ slug: 'users' }))

    router
      .get('roles', ({ inertia }) => inertia.render('placeholder', { featureName: 'Papéis', featureDescription: 'Gerenciamento de roles e permissões.' }))
      .as('roles')
      .use(middleware.feature({ slug: 'roles' }))

    router
      .get('teams', ({ inertia }) => inertia.render('placeholder', { featureName: 'Times', featureDescription: 'Gerenciamento de times e membros.' }))
      .as('teams')
      .use(middleware.feature({ slug: 'teams' }))

    router
      .get('features', ({ inertia }) => inertia.render('placeholder', { featureName: 'Features', featureDescription: 'Cadastro e edição de features do sistema (painel SaaS).' }))
      .as('features')
      .use(middleware.feature({ slug: 'features' }))

    router
      .get('settings', ({ inertia }) => inertia.render('placeholder', { featureName: 'Configurações', featureDescription: 'Configurações gerais do sistema.' }))
      .as('settings')
      .use(middleware.feature({ slug: 'settings' }))

    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
