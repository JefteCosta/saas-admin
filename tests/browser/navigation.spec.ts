import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Feature from '#models/feature'
import Module from '#models/module'
import FeatureGroup from '#models/feature_group'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Browser - Navegação e Menu', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function seedOwnerWithFeatures() {
    const role = await Role.firstOrCreate({ slug: 'owner' }, { name: 'Owner' })
    const mod = await Module.firstOrCreate({ slug: 'plataforma' }, { name: 'Plataforma', icon: 'LayoutDashboard', position: 0 })
    const grp = await FeatureGroup.firstOrCreate({ slug: 'geral' }, { name: 'Geral', moduleId: mod.id, position: 0 })
    await Feature.firstOrCreate({ slug: 'home' }, { name: 'Home', icon: 'Home', route: '/', moduleId: mod.id, featureGroupId: grp.id, position: 0 })
    await Feature.firstOrCreate({ slug: 'profile' }, { name: 'Perfil', icon: 'User', route: '/profile', moduleId: mod.id, featureGroupId: grp.id, position: 1 })

    const user = await User.create({
      email: 'nav-test@test.com',
      password: 'secret123',
      fullName: 'Nav Test',
      roleId: role.id,
    })

    return user
  }

  test('menu carrega com módulos do sistema', async ({ visit, browserContext }) => {
    const user = await seedOwnerWithFeatures()
    await browserContext.loginAs(user)

    const page = await visit('/')

    await page.assertTextContains('body', 'Plataforma')
  })

  test('sidebar mostra items de navegação', async ({ visit, browserContext }) => {
    const user = await seedOwnerWithFeatures()
    await browserContext.loginAs(user)

    const page = await visit('/')

    await page.assertTextContains('body', 'Home')
    await page.assertTextContains('body', 'Perfil')
  })

  test('dark mode toggle funciona', async ({ visit, browserContext, assert }) => {
    const user = await seedOwnerWithFeatures()
    await browserContext.loginAs(user)

    const page = await visit('/')

    // Clicar no botão de dark mode
    await page.getByRole('button', { name: /modo/i }).click()

    // Verificar que a classe dark foi adicionada ao html
    const isDark = await page.locator('html').evaluate((el) => el.classList.contains('dark'))
    assert.isTrue(isDark)
  })

  test('navegar para perfil funciona', async ({ visit, browserContext, assert }) => {
    const user = await seedOwnerWithFeatures()
    await browserContext.loginAs(user)

    const page = await visit('/')

    await page.getByRole('link', { name: 'Perfil' }).click()
    await page.waitForURL('**/profile')
    assert.include(page.url(), '/profile')
    await page.assertTextContains('body', 'Nav Test')
  })
})
