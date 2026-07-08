import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Feature from '#models/feature'
import User from '#models/user'

export default class MainSeeder extends BaseSeeder {
  async run() {
    // 1. Criar roles
    const roles = await Role.updateOrCreateMany('slug', [
      { slug: 'owner', name: 'Owner', description: 'Super admin do SaaS. Acesso irrestrito.' },
      { slug: 'admin', name: 'Administrador', description: 'Acesso total exceto painel SaaS de features.' },
      { slug: 'member', name: 'Membro', description: 'Acesso às features da sua role e teams.', isDefault: true },
      { slug: 'viewer', name: 'Visualizador', description: 'Apenas leitura.' },
    ])

    const ownerRole = roles.find((r) => r.slug === 'owner')!
    const adminRole = roles.find((r) => r.slug === 'admin')!
    const memberRole = roles.find((r) => r.slug === 'member')!

    // 2. Criar features
    const features = await Feature.updateOrCreateMany('slug', [
      { slug: 'home', name: 'Home', icon: 'Home', route: '/', group: 'Plataforma', position: 0, isMenuItem: true, isActive: true },
      { slug: 'profile', name: 'Perfil', icon: 'User', route: '/profile', group: 'Plataforma', position: 1, isMenuItem: true, isActive: true },
      { slug: 'users', name: 'Usuários', icon: 'Users', route: '/users', group: 'Administração', position: 10, isMenuItem: true, isActive: true },
      { slug: 'roles', name: 'Papéis', icon: 'Shield', route: '/roles', group: 'Administração', position: 11, isMenuItem: true, isActive: true },
      { slug: 'teams', name: 'Times', icon: 'UsersRound', route: '/teams', group: 'Administração', position: 12, isMenuItem: true, isActive: true },
      { slug: 'features', name: 'Features', icon: 'Layers', route: '/features', group: 'SaaS', position: 30, isMenuItem: true, isActive: true },
      { slug: 'features.create', name: 'Criar Feature', icon: 'Plus', route: '/features/create', group: 'SaaS', position: 31, isMenuItem: false, isActive: true },
      { slug: 'features.edit', name: 'Editar Feature', icon: 'Pencil', route: '/features/:id/edit', group: 'SaaS', position: 32, isMenuItem: false, isActive: true },
      { slug: 'settings', name: 'Configurações', icon: 'Settings', route: '/settings', group: 'Configurações', position: 20, isMenuItem: true, isActive: true },
    ])

    // 3. Atribuir features às roles

    // Admin: todas exceto features.create e features.edit
    const adminFeatures = features.filter((f) => !['features.create', 'features.edit'].includes(f.slug))
    await adminRole.related('features').sync(adminFeatures.map((f) => f.id))

    // Member: apenas home e profile
    const memberFeatures = features.filter((f) => ['home', 'profile'].includes(f.slug))
    await memberRole.related('features').sync(memberFeatures.map((f) => f.id))

    // Owner não precisa de pivot — tem bypass total

    // 4. Criar usuário owner
    const owner = await User.updateOrCreate(
      { email: 'jefteamorim@gmail.com' },
      {
        fullName: 'Jefte Amorim',
        email: 'jefteamorim@gmail.com',
        password: 'password',
        roleId: ownerRole.id,
      }
    )

    console.log(`Owner criado/atualizado: ${owner.email} (role: owner)`)
  }
}
