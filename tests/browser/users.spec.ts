import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Feature from '#models/feature'
import Module from '#models/module'
import FeatureGroup from '#models/feature_group'
import Company from '#models/company'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Browser - CRUD Users', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  async function seedAndLogin(page: any) {
    const role = await Role.create({ slug: 'owner', name: 'Owner' })
    await Role.create({ slug: 'admin', name: 'Administrador' })
    const mod = await Module.create({ slug: 'plataforma', name: 'Plataforma', icon: 'LayoutDashboard', position: 0 })
    const grp = await FeatureGroup.create({ slug: 'geral', name: 'Geral', moduleId: mod.id, position: 0 })
    await Feature.create({ slug: 'home', name: 'Home', icon: 'Home', route: '/', moduleId: mod.id, featureGroupId: grp.id, position: 0, isMenuItem: true, isActive: true })

    const pessoasMod = await Module.create({ slug: 'pessoas', name: 'Pessoas', icon: 'Users', position: 10 })
    const usersGrp = await FeatureGroup.create({ slug: 'usuarios', name: 'Usuários', moduleId: pessoasMod.id, position: 0 })
    await Feature.create({ slug: 'users.list', name: 'Usuários', icon: 'Users', route: '/users', moduleId: pessoasMod.id, featureGroupId: usersGrp.id, position: 0, isMenuItem: true, isActive: true })

    const user = await User.create({ email: 'users@test.com', password: 'secret123', fullName: 'Users Test', roleId: role.id })
    const company = await Company.create({ slug: 'admin', name: 'SaaS Admin', ownerUserId: user.id })
    await company.related('members').attach({ [user.id]: { role_id: null } })

    await page.getByLabel('Email').fill('users@test.com')
    await page.getByLabel('Senha').fill('secret123')
    await page.locator('button[type="submit"]').click()
    await page.waitForURL((url: URL) => url.pathname === '/' && !url.search.includes('token'), { timeout: 10000 })
  }

  test('lista usuários cadastrados', async ({ visit }) => {
    const page = await visit('/login')
    await seedAndLogin(page)

    await page.goto(page.url().replace(/\/$/, '') + '/users')
    await page.waitForTimeout(1000)

    await page.assertTextContains('body', 'users@test.com')
  })
})
