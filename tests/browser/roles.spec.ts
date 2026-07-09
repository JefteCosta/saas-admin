import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Feature from '#models/feature'
import Module from '#models/module'
import FeatureGroup from '#models/feature_group'
import Company from '#models/company'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Browser - CRUD Roles', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  async function seedAndLogin(page: any) {
    const role = await Role.create({ slug: 'owner', name: 'Owner' })
    const mod = await Module.create({ slug: 'plataforma', name: 'Plataforma', icon: 'LayoutDashboard', position: 0 })
    const grp = await FeatureGroup.create({ slug: 'geral', name: 'Geral', moduleId: mod.id, position: 0 })
    await Feature.create({ slug: 'home', name: 'Home', icon: 'Home', route: '/', moduleId: mod.id, featureGroupId: grp.id, position: 0, isMenuItem: true, isActive: true })

    const configMod = await Module.create({ slug: 'configuracoes', name: 'Configurações', icon: 'Settings', position: 40 })
    const configGrp = await FeatureGroup.create({ slug: 'papeis', name: 'Papéis', moduleId: configMod.id, position: 0 })
    await Feature.create({ slug: 'roles.list', name: 'Papéis', icon: 'Shield', route: '/roles', moduleId: configMod.id, featureGroupId: configGrp.id, position: 0, isMenuItem: true, isActive: true })

    const user = await User.create({ email: 'roles@test.com', password: 'secret123', fullName: 'Roles Test', roleId: role.id })
    const company = await Company.create({ slug: 'admin', name: 'SaaS Admin', ownerUserId: user.id })
    await company.related('members').attach({ [user.id]: { role_id: null } })

    await page.getByLabel('Email').fill('roles@test.com')
    await page.getByLabel('Senha').fill('secret123')
    await page.locator('button[type="submit"]').click()
    await page.waitForURL((url: URL) => url.pathname === '/' && !url.search.includes('token'), { timeout: 10000 })
  }

  test('lista roles existentes', async ({ visit }) => {
    const page = await visit('/login')
    await seedAndLogin(page)

    await page.goto(page.url().replace(/\/$/, '') + '/roles')
    await page.waitForTimeout(1000)

    await page.assertTextContains('body', 'Owner')
  })

  test('criar nova role', async ({ visit }) => {
    const page = await visit('/login')
    await seedAndLogin(page)

    await page.goto(page.url().replace(/\/$/, '') + '/roles')
    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: 'Nova role' }).click()
    await page.waitForTimeout(500)

    await page.getByPlaceholder('Marketing').fill('Marketing')
    await page.getByPlaceholder('marketing').fill('marketing')
    await page.getByPlaceholder('Acesso ao módulo de marketing').fill('Equipe de marketing')
    await page.getByRole('button', { name: 'Criar' }).click()

    await page.waitForTimeout(2000)
    await page.assertTextContains('body', 'Marketing')
  })
})
