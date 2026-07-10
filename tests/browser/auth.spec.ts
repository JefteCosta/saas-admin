import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Feature from '#models/feature'
import Module from '#models/module'
import FeatureGroup from '#models/feature_group'
import Company from '#models/company'
import Plan from '#models/plan'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Browser - Autenticação', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  async function seedBasicData() {
    const role = await Role.firstOrCreate({ slug: 'owner' }, { name: 'Owner' })
    const mod = await Module.create({ slug: 'plataforma', name: 'Plataforma', icon: 'LayoutDashboard', position: 0 })
    const grp = await FeatureGroup.create({ slug: 'geral', name: 'Geral', moduleId: mod.id, position: 0 })
    await Feature.create({ slug: 'home', name: 'Home', icon: 'Home', route: '/', moduleId: mod.id, featureGroupId: grp.id, position: 0 })
    return role
  }

  test('faz login com credenciais válidas', async ({ visit, assert }) => {
    const role = await seedBasicData()
    const user = await User.create({ email: 'login@test.com', password: 'secret123', fullName: 'Login Test', roleId: role.id })
    const company = await Company.create({ slug: 'admin', name: 'SaaS Admin', ownerUserId: user.id })
    await company.related('members').attach({ [user.id]: { role_id: null } })

    const page = await visit('/login')
    await page.getByLabel('Email').fill('login@test.com')
    await page.getByLabel('Senha').fill('secret123')
    await page.locator('button[type="submit"]').click()

    // Aguardar fluxo token → callback → home
    await page.waitForURL((url: URL) => url.pathname === '/' && !url.search.includes('token'), { timeout: 10000 })
    assert.notInclude(page.url(), '/login')
  })

  test('mostra erro com credenciais inválidas', async ({ visit }) => {
    const page = await visit('/login')
    await page.getByLabel('Email').fill('naoexiste@test.com')
    await page.getByLabel('Senha').fill('senhaerrada')
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(1000)
    await page.assertPath('/login')
    await page.assertTextContains('[role="alert"]', 'E-mail ou senha incorretos')
  })

  test('faz logout com sucesso', async ({ visit, assert }) => {
    const role = await seedBasicData()
    const user = await User.create({ email: 'logout@test.com', password: 'secret123', fullName: 'Logout Test', roleId: role.id })
    const company = await Company.create({ slug: 'admin', name: 'SaaS Admin', ownerUserId: user.id })
    await company.related('members').attach({ [user.id]: { role_id: null } })

    const page = await visit('/login')
    await page.getByLabel('Email').fill('logout@test.com')
    await page.getByLabel('Senha').fill('secret123')
    await page.locator('button[type="submit"]').click()
    await page.waitForURL((url: URL) => url.pathname === '/' && !url.search.includes('token'), { timeout: 10000 })

    // Abrir dropdown do usuário e clicar Sair
    await page.locator('header button').last().click()
    await page.getByText('Sair').click()

    await page.waitForURL((url: URL) => url.pathname.includes('/login'), { timeout: 10000 })
    assert.include(page.url(), '/login')
  })

  test('signup cria conta e empresa', async ({ visit, assert }) => {
    await Role.create({ slug: 'admin', name: 'Administrador' })
    await Plan.create({ slug: 'starter', name: 'Starter', price: 100 })

    const page = await visit('/signup')
    await page.waitForTimeout(1000)
    await page.locator('#fullName').fill('Novo Usuário')
    await page.locator('#companyName').fill('Empresa Teste')
    await page.locator('#email').fill('signup@test.com')
    await page.locator('#password').fill('secret1234')
    await page.locator('#passwordConfirmation').fill('secret1234')
    await page.locator('button[type="submit"]').click()

    await page.waitForTimeout(5000)
    // Verificar que o user e company foram criados no banco
    const user = await User.findBy('email', 'signup@test.com')
    assert.isNotNull(user)
    const Company = (await import('#models/company')).default
    const company = await Company.findBy('owner_user_id', user!.id)
    assert.isNotNull(company)
    assert.equal(company!.name, 'Empresa Teste')
  })
})
