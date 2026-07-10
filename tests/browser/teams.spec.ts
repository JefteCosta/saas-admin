import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Feature from '#models/feature'
import Module from '#models/module'
import FeatureGroup from '#models/feature_group'
import Company from '#models/company'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Browser - CRUD Teams', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  async function seedAndLogin(page: any) {
    const role = await Role.create({ slug: 'owner', name: 'Owner' })
    const mod = await Module.create({ slug: 'plataforma', name: 'Plataforma', icon: 'LayoutDashboard', position: 0 })
    const grp = await FeatureGroup.create({ slug: 'geral', name: 'Geral', moduleId: mod.id, position: 0 })
    await Feature.create({ slug: 'home', name: 'Home', icon: 'Home', route: '/', moduleId: mod.id, featureGroupId: grp.id, position: 0, isMenuItem: true, isActive: true })

    const pessoasMod = await Module.create({ slug: 'pessoas', name: 'Pessoas', icon: 'Users', position: 10 })
    const timesGrp = await FeatureGroup.create({ slug: 'times', name: 'Times', moduleId: pessoasMod.id, position: 1 })
    await Feature.create({ slug: 'teams.list', name: 'Times', icon: 'UsersRound', route: '/teams', moduleId: pessoasMod.id, featureGroupId: timesGrp.id, position: 0, isMenuItem: true, isActive: true })

    const user = await User.create({ email: 'teams@test.com', password: 'secret123', fullName: 'Teams Test', roleId: role.id })
    const company = await Company.create({ slug: 'admin', name: 'SaaS Admin', ownerUserId: user.id })
    await company.related('members').attach({ [user.id]: { role_id: null } })

    await page.getByLabel('Email').fill('teams@test.com')
    await page.getByLabel('Senha').fill('secret123')
    await page.locator('button[type="submit"]').click()
    await page.waitForURL((url: URL) => url.pathname === '/' && !url.search.includes('token'), { timeout: 10000 })
  }

  test('exibe mensagem quando não há times', async ({ visit }) => {
    const page = await visit('/login')
    await seedAndLogin(page)

    await page.goto(page.url().replace(/\/$/, '') + '/teams')
    await page.waitForTimeout(1000)

    await page.assertTextContains('body', 'Nenhum time')
  })

  test('criar novo time', async ({ visit }) => {
    const page = await visit('/login')
    await seedAndLogin(page)

    await page.goto(page.url().replace(/\/$/, '') + '/teams')
    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: 'Novo time' }).click()
    await page.waitForTimeout(500)

    // Preencher dentro do dialog
    const dialog = page.locator('[role="dialog"]')
    await dialog.getByPlaceholder('Nome do time').fill('Desenvolvimento')
    await dialog.getByPlaceholder('slug-do-time').fill('dev')

    // Selecionar role (clicar no select trigger e depois no item)
    await dialog.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Owner' }).click()

    await dialog.getByRole('button', { name: 'Criar' }).click()

    await page.waitForTimeout(2000)
    await page.assertTextContains('body', 'Desenvolvimento')
    // Verificar toast de sucesso
    await page.assertTextContains('body', 'criado com sucesso')
  })
})
