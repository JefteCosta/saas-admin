import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Feature from '#models/feature'
import Module from '#models/module'
import FeatureGroup from '#models/feature_group'
import Company from '#models/company'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Browser - Perfil', (group) => {
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
      email: 'profile@test.com',
      password: 'secret123',
      fullName: 'Profile Test',
      roleId: role.id,
    })
    const company = await Company.create({
      slug: 'admin',
      name: 'SaaS Admin',
      ownerUserId: user.id,
    })
    await company.related('members').attach({ [user.id]: { role_id: null } })

    await page.getByLabel('Email').fill('profile@test.com')
    await page.getByLabel('Senha').fill('secret123')
    await page.locator('button[type="submit"]').click()
    await page.waitForURL((url: URL) => url.pathname === '/' && !url.search.includes('token'), {
      timeout: 10000,
    })
  }

  test('exibe dados do perfil', async ({ visit }) => {
    const page = await visit('/login')
    await seedAndLogin(page)

    await page.getByText('Perfil').first().click()
    await page.waitForURL('**/profile')

    await page.assertTextContains('body', 'Profile Test')
    await page.assertTextContains('body', 'profile@test.com')
  })

  test('edita nome do perfil', async ({ visit }) => {
    const page = await visit('/login')
    await seedAndLogin(page)

    await page.getByText('Perfil').first().click()
    await page.waitForURL('**/profile')

    await page.getByPlaceholder('Seu nome').clear()
    await page.getByPlaceholder('Seu nome').fill('Nome Alterado')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await page.waitForTimeout(1000)
    await page.assertTextContains('body', 'Nome Alterado')
  })
})
