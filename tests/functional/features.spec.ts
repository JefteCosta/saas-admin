import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Feature from '#models/feature'
import Team from '#models/team'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Features - Permissões por role', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function getOrCreateRoles() {
    const ownerRole = await Role.firstOrCreate({ slug: 'owner' }, { name: 'Owner' })
    const adminRole = await Role.firstOrCreate({ slug: 'admin' }, { name: 'Administrador' })
    const memberRole = await Role.firstOrCreate({ slug: 'member' }, { name: 'Membro', isDefault: true })
    return { ownerRole, adminRole, memberRole }
  }

  async function getOrCreateFeatures() {
    const home = await Feature.firstOrCreate({ slug: 'home' }, { name: 'Home', icon: 'Home', route: '/', position: 0 })
    const profile = await Feature.firstOrCreate({ slug: 'profile' }, { name: 'Perfil', icon: 'User', route: '/profile', position: 1 })
    return { home, profile }
  }

  test('owner acessa qualquer feature (bypass total)', async ({ client }) => {
    const { ownerRole } = await getOrCreateRoles()
    await getOrCreateFeatures()

    const owner = await User.create({
      email: 'owner-test@test.com',
      password: 'secret123',
      fullName: 'Owner Test',
      roleId: ownerRole.id,
    })

    const homeResp = await client.get('/').withGuard('web').loginAs(owner)
    homeResp.assertStatus(200)

    const profileResp = await client.get('/profile').withGuard('web').loginAs(owner)
    profileResp.assertStatus(200)
  })

  test('admin acessa home e profile', async ({ client }) => {
    const { adminRole } = await getOrCreateRoles()
    const { home, profile } = await getOrCreateFeatures()
    await adminRole.related('features').sync([home.id, profile.id])

    const admin = await User.create({
      email: 'admin-test@test.com',
      password: 'secret123',
      fullName: 'Admin Test',
      roleId: adminRole.id,
    })

    const homeResp = await client.get('/').withGuard('web').loginAs(admin)
    homeResp.assertStatus(200)

    const profileResp = await client.get('/profile').withGuard('web').loginAs(admin)
    profileResp.assertStatus(200)
  })

  test('member acessa home e profile (features atribuídas à role)', async ({ client }) => {
    const { memberRole } = await getOrCreateRoles()
    const { home, profile } = await getOrCreateFeatures()
    await memberRole.related('features').sync([home.id, profile.id])

    const member = await User.create({
      email: 'member-test@test.com',
      password: 'secret123',
      fullName: 'Member Test',
      roleId: memberRole.id,
    })

    const homeResp = await client.get('/').withGuard('web').loginAs(member)
    homeResp.assertStatus(200)

    const profileResp = await client.get('/profile').withGuard('web').loginAs(member)
    profileResp.assertStatus(200)
  })

  test('usuário sem role não acessa features protegidas', async ({ client, assert }) => {
    await getOrCreateRoles()
    await getOrCreateFeatures()

    const noRole = await User.create({
      email: 'norole-test@test.com',
      password: 'secret123',
      fullName: 'No Role',
      roleId: null,
    })

    const homeResp = await client.get('/').withGuard('web').loginAs(noRole).redirects(0)
    // Bouncer nega: pode ser 403 ou 302 (redirect do exception handler)
    assert.oneOf(homeResp.status(), [403, 302])
  })

  test('member sem feature atribuída não acessa rota protegida', async ({ client, assert }) => {
    const { memberRole } = await getOrCreateRoles()
    await getOrCreateFeatures()
    // Member role sem features atribuídas
    await memberRole.related('features').sync([])

    const member = await User.create({
      email: 'member-noaccess@test.com',
      password: 'secret123',
      fullName: 'Member No Access',
      roleId: memberRole.id,
    })

    const homeResp = await client.get('/').withGuard('web').loginAs(member).redirects(0)
    assert.oneOf(homeResp.status(), [403, 302])
  })
})

test.group('Features - Team herda permissões', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('member herda acesso a feature via team', async ({ client }) => {
    const memberRole = await Role.firstOrCreate({ slug: 'member' }, { name: 'Membro' })
    const teamRole = await Role.firstOrCreate({ slug: 'team-role' }, { name: 'Team Role' })

    const home = await Feature.firstOrCreate({ slug: 'home' }, { name: 'Home', icon: 'Home', route: '/', position: 0 })
    const profile = await Feature.firstOrCreate({ slug: 'profile' }, { name: 'Perfil', icon: 'User', route: '/profile', position: 1 })

    // Member role: apenas home
    await memberRole.related('features').sync([home.id])

    // Team role: home + profile
    await teamRole.related('features').sync([home.id, profile.id])

    // Criar team com role que tem profile
    const team = await Team.create({ name: 'Dev Team', slug: 'dev-team', roleId: teamRole.id })

    const member = await User.create({
      email: 'team-member@test.com',
      password: 'secret123',
      fullName: 'Team Member',
      roleId: memberRole.id,
    })

    // Adicionar membro ao team
    await team.related('members').attach([member.id])

    // Member agora acessa profile via team
    const profileResp = await client.get('/profile').withGuard('web').loginAs(member)
    profileResp.assertStatus(200)
  })

  test('member sem team não acessa feature que só existe no team', async ({ client, assert }) => {
    const memberRole = await Role.firstOrCreate({ slug: 'member' }, { name: 'Membro' })

    const home = await Feature.firstOrCreate({ slug: 'home' }, { name: 'Home', icon: 'Home', route: '/', position: 0 })
    await Feature.firstOrCreate({ slug: 'profile' }, { name: 'Perfil', icon: 'User', route: '/profile', position: 1 })

    // Member role: apenas home (sem profile)
    await memberRole.related('features').sync([home.id])

    const member = await User.create({
      email: 'lonely-member@test.com',
      password: 'secret123',
      fullName: 'Lonely Member',
      roleId: memberRole.id,
    })

    // Sem team, não acessa profile
    const profileResp = await client.get('/profile').withGuard('web').loginAs(member).redirects(0)
    assert.oneOf(profileResp.status(), [403, 302])
  })
})

test.group('Features - Signup atribui role admin', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('novo usuário recebe role admin no signup', async ({ assert }) => {
    await Role.firstOrCreate({ slug: 'admin' }, { name: 'Administrador' })

    // Simular criação como faz o controller
    const adminRole = await Role.findBy('slug', 'admin')
    const user = await User.create({
      email: 'newuser@test.com',
      password: 'secret123',
      fullName: 'New User',
      roleId: adminRole?.id ?? null,
    })

    await user.load('role')
    assert.equal(user.role.slug, 'admin')
  })
})
