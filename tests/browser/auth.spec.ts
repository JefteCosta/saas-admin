import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Feature from '#models/feature'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Browser - Autenticação', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('faz login com credenciais válidas', async ({ visit, route, assert }) => {
    const role = await Role.firstOrCreate({ slug: 'owner' }, { name: 'Owner' })
    await Feature.firstOrCreate({ slug: 'home' }, { name: 'Home', icon: 'Home', route: '/', position: 0 })

    await User.create({
      email: 'login-test@test.com',
      password: 'secret123',
      fullName: 'Login Test',
      roleId: role.id,
    })

    const page = await visit(route('session.create'))

    await page.getByLabel('Email').fill('login-test@test.com')
    await page.getByLabel('Senha').fill('secret123')
    await page.getByRole('button', { name: /entrar|login/i }).click()

    await page.waitForURL('**/*')
    const url = page.url()
    assert.notInclude(url, '/login')
  })

  test('mostra erro com credenciais inválidas', async ({ visit, route }) => {
    const page = await visit(route('session.create'))

    await page.getByLabel('Email').fill('naoexiste@test.com')
    await page.getByLabel('Senha').fill('senhaerrada')
    await page.getByRole('button', { name: /entrar|login/i }).click()

    // Deve permanecer na página de login
    await page.assertPath('/login')
  })

  test('faz logout com sucesso', async ({ visit, browserContext, assert }) => {
    const role = await Role.firstOrCreate({ slug: 'owner' }, { name: 'Owner' })
    await Feature.firstOrCreate({ slug: 'home' }, { name: 'Home', icon: 'Home', route: '/', position: 0 })

    const user = await User.create({
      email: 'logout-test@test.com',
      password: 'secret123',
      fullName: 'Logout Test',
      roleId: role.id,
    })

    await browserContext.loginAs(user)
    const page = await visit('/')

    // Clicar no dropdown do usuário e depois em "Sair"
    await page.getByText('Logout Test').click()
    await page.getByText('Sair').click()

    await page.waitForURL('**/login**')
    assert.include(page.url(), '/login')
  })

  test('signup cria conta e empresa', async ({ visit, route, assert }) => {
    await Role.firstOrCreate({ slug: 'admin' }, { name: 'Administrador' })

    const page = await visit(route('new_account.create'))

    await page.getByLabel('Nome Completo').fill('Novo Usuário')
    await page.getByLabel('Nome da Empresa').fill('Empresa Teste')
    await page.getByLabel('Email').fill('signup-test@test.com')
    await page.getByLabel('Senha').first().fill('secret123')
    await page.getByLabel('Confirme a Senha').fill('secret123')
    await page.getByRole('button', { name: /criar conta/i }).click()

    await page.waitForURL('**/*')
    assert.notInclude(page.url(), '/signup')
  })
})
