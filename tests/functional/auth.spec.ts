import { test } from '@japa/runner'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth - proteção da home', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('redireciona para /login quando não está autenticado', async ({ client }) => {
    const response = await client.get('/').redirects(0)

    response.assertStatus(302)
    response.assertHeader('location', '/login')
  })

  test('acessa a home com sucesso quando está autenticado', async ({ client }) => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'secret123',
      fullName: 'Test User',
    })

    const response = await client.get('/').withGuard('web').loginAs(user)

    response.assertStatus(200)
  })

  test('acessa a página de perfil quando autenticado', async ({ client }) => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'secret123',
      fullName: 'Test User',
    })

    const response = await client.get('/profile').withGuard('web').loginAs(user)

    response.assertStatus(200)
  })

  test('redireciona para /login ao acessar /profile sem autenticação', async ({ client }) => {
    const response = await client.get('/profile').redirects(0)

    response.assertStatus(302)
    response.assertHeader('location', '/login')
  })
})
