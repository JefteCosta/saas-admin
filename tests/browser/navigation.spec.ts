import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Feature from '#models/feature'
import Module from '#models/module'
import FeatureGroup from '#models/feature_group'
import Company from '#models/company'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Browser - Navegação e Menu', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  async function seedAndLogin(page: any) {
    const role = await Role.create({ slug: 'owner', name: 'Owner' })
    const mod = await Module.create({
      slug: 'plataforma',
      name: 'Plataforma',
      icon: 'LayoutDashboard',
      position: 0,
    })
    const grp = await FeatureGroup.create({
      slug: 'geral',
      name: 'Geral',
      moduleId: mod.id,
      position: 0,
    })
    await Feature.create({
      slug: 'home',
      name: 'Home',
      icon: 'Home',
      route: '/',
      moduleId: mod.id,
      featureGroupId: grp.id,
      position: 0,
      isMenuItem: true,
      isActive: true,
    })
    await Feature.create({
      slug: 'profile',
      name: 'Perfil',
      icon: 'User',
      route: '/profile',
      moduleId: mod.id,
      featureGroupId: grp.id,
      position: 1,
      isMenuItem: true,
      isActive: true,
    })

    const user = await User.create({
      email: 'nav-test@test.com',
      password: 'secret123',
      fullName: 'Nav Test',
      roleId: role.id,
    })

    // Criar company SaaS Admin para o redirect funcionar
    const company = await Company.create({
      slug: 'admin',
      name: 'SaaS Admin',
      ownerUserId: user.id,
    })
    await company.related('members').attach({ [user.id]: { role_id: null } })

    // Login via formulário
    await page.getByLabel('Email').fill('nav-test@test.com')
    await page.getByLabel('Senha').fill('secret123')
    await page.locator('button[type="submit"]').click()

    // Aguardar o fluxo completo: login → token → callback → home
    // O auth/callback cria sessão e redireciona para /
    await page.waitForURL((url: URL) => url.pathname === '/' && !url.search.includes('token'), {
      timeout: 10000,
    })
  }

  test('sidebar mostra módulo e itens após login', async ({ visit }) => {
    const page = await visit('/login')
    await seedAndLogin(page)

    await page.assertTextContains('body', 'Plataforma')
    await page.assertTextContains('body', 'Home')
    await page.assertTextContains('body', 'Perfil')
  })

  test('dark mode toggle funciona', async ({ visit, assert }) => {
    const page = await visit('/login')
    await seedAndLogin(page)

    await page.getByLabel(/modo escuro/i).click()

    const isDark = await page.locator('html').evaluate((el) => el.classList.contains('dark'))
    assert.isTrue(isDark)
  })

  test('navegar para perfil pelo sidebar', async ({ visit, assert }) => {
    const page = await visit('/login')
    await seedAndLogin(page)

    await page.getByText('Perfil').first().click()
    await page.waitForURL('**/profile')
    assert.include(page.url(), '/profile')
  })
})
