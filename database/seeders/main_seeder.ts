import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Feature from '#models/feature'
import User from '#models/user'
import Module from '#models/module'
import FeatureGroup from '#models/feature_group'
import Plan from '#models/plan'
import Company from '#models/company'

export default class MainSeeder extends BaseSeeder {
  async run() {
    // 1. Criar planos
    const plans = await Plan.updateOrCreateMany('slug', [
      { slug: 'starter', name: 'Starter', description: 'Plano básico', price: 100 },
      { slug: 'business', name: 'Business', description: 'Plano completo', price: 200 },
      {
        slug: 'unlimited',
        name: 'Unlimited',
        description: 'Plano ilimitado (SaaS Admin)',
        price: null,
      },
    ])
    const starterPlan = plans.find((p) => p.slug === 'starter')!
    const businessPlan = plans.find((p) => p.slug === 'business')!
    const unlimited = plans.find((p) => p.slug === 'unlimited')!

    // 2. Criar módulos
    const modules = await Module.updateOrCreateMany('slug', [
      { slug: 'plataforma', name: 'Plataforma', icon: 'LayoutDashboard', position: 0 },
      { slug: 'pessoas', name: 'Pessoas', icon: 'Users', position: 10 },
      { slug: 'empresa', name: 'Empresa', icon: 'Building2', position: 20 },
      { slug: 'marketing', name: 'Marketing', icon: 'Megaphone', position: 30 },
      { slug: 'configuracoes', name: 'Configurações', icon: 'Settings', position: 40 },
      { slug: 'saas', name: 'SaaS', icon: 'Layers', position: 99 },
    ])

    const mod = (slug: string) => modules.find((m) => m.slug === slug)!

    // 3. Criar plan_modules com limites
    await starterPlan.related('modules').sync({
      [mod('plataforma').id]: { limits: null },
      [mod('pessoas').id]: { limits: JSON.stringify({ max_users: 10, max_teams: 5 }) },
      [mod('empresa').id]: { limits: JSON.stringify({ max_addresses: 3 }) },
      [mod('configuracoes').id]: { limits: null },
    })

    await businessPlan.related('modules').sync({
      [mod('plataforma').id]: { limits: null },
      [mod('pessoas').id]: { limits: JSON.stringify({ max_users: 20, max_teams: 8 }) },
      [mod('empresa').id]: { limits: JSON.stringify({ max_addresses: 5 }) },
      [mod('marketing').id]: { limits: JSON.stringify({ max_campaigns: 10 }) },
      [mod('configuracoes').id]: { limits: null },
    })

    await unlimited.related('modules').sync({
      [mod('plataforma').id]: { limits: null },
      [mod('pessoas').id]: { limits: null },
      [mod('empresa').id]: { limits: null },
      [mod('marketing').id]: { limits: null },
      [mod('configuracoes').id]: { limits: null },
      [mod('saas').id]: { limits: null },
    })

    // 4. Criar feature groups
    const groups = await FeatureGroup.updateOrCreateMany('slug', [
      { slug: 'geral', name: 'Geral', moduleId: mod('plataforma').id, position: 0 },
      { slug: 'usuarios', name: 'Usuários', moduleId: mod('pessoas').id, position: 0 },
      { slug: 'times', name: 'Times', moduleId: mod('pessoas').id, position: 1 },
      { slug: 'dados-empresa', name: 'Dados', moduleId: mod('empresa').id, position: 0 },
      { slug: 'enderecos', name: 'Endereços', moduleId: mod('empresa').id, position: 1 },
      { slug: 'campanhas', name: 'Campanhas', moduleId: mod('marketing').id, position: 0 },
      { slug: 'papeis', name: 'Papéis', moduleId: mod('configuracoes').id, position: 0 },
      { slug: 'admin-saas', name: 'Admin SaaS', moduleId: mod('saas').id, position: 0 },
    ])

    const grp = (slug: string) => groups.find((g) => g.slug === slug)!

    // 5. Criar features
    const features = await Feature.updateOrCreateMany('slug', [
      // Plataforma > Geral
      {
        slug: 'home',
        name: 'Home',
        icon: 'Home',
        route: '/',
        moduleId: mod('plataforma').id,
        featureGroupId: grp('geral').id,
        position: 0,
        isMenuItem: true,
        isActive: true,
      },
      {
        slug: 'profile',
        name: 'Perfil',
        icon: 'User',
        route: '/profile',
        moduleId: mod('plataforma').id,
        featureGroupId: grp('geral').id,
        position: 1,
        isMenuItem: true,
        isActive: true,
      },

      // Pessoas > Usuários
      {
        slug: 'users.list',
        name: 'Usuários',
        icon: 'Users',
        route: '/users',
        moduleId: mod('pessoas').id,
        featureGroupId: grp('usuarios').id,
        position: 0,
        isMenuItem: true,
        isActive: true,
      },
      {
        slug: 'users.create',
        name: 'Criar Usuário',
        icon: 'UserPlus',
        route: '/users/create',
        moduleId: mod('pessoas').id,
        featureGroupId: grp('usuarios').id,
        position: 1,
        isMenuItem: false,
        isActive: true,
      },

      // Pessoas > Times
      {
        slug: 'teams.list',
        name: 'Times',
        icon: 'UsersRound',
        route: '/teams',
        moduleId: mod('pessoas').id,
        featureGroupId: grp('times').id,
        position: 0,
        isMenuItem: true,
        isActive: true,
      },
      {
        slug: 'teams.create',
        name: 'Criar Time',
        icon: 'Plus',
        route: '/teams/create',
        moduleId: mod('pessoas').id,
        featureGroupId: grp('times').id,
        position: 1,
        isMenuItem: false,
        isActive: true,
      },

      // Empresa > Dados
      {
        slug: 'company.view',
        name: 'Dados da Empresa',
        icon: 'Building2',
        route: '/company',
        moduleId: mod('empresa').id,
        featureGroupId: grp('dados-empresa').id,
        position: 0,
        isMenuItem: true,
        isActive: true,
      },
      {
        slug: 'company.edit',
        name: 'Editar Empresa',
        icon: 'Pencil',
        route: '/company/edit',
        moduleId: mod('empresa').id,
        featureGroupId: grp('dados-empresa').id,
        position: 1,
        isMenuItem: false,
        isActive: true,
      },

      // Empresa > Endereços
      {
        slug: 'company.addresses.list',
        name: 'Endereços',
        icon: 'MapPin',
        route: '/company/addresses',
        moduleId: mod('empresa').id,
        featureGroupId: grp('enderecos').id,
        position: 0,
        isMenuItem: true,
        isActive: true,
      },
      {
        slug: 'company.addresses.create',
        name: 'Novo Endereço',
        icon: 'Plus',
        route: '/company/addresses/create',
        moduleId: mod('empresa').id,
        featureGroupId: grp('enderecos').id,
        position: 1,
        isMenuItem: false,
        isActive: true,
      },

      // Marketing > Campanhas
      {
        slug: 'campaigns.list',
        name: 'Campanhas',
        icon: 'Megaphone',
        route: '/campaigns',
        moduleId: mod('marketing').id,
        featureGroupId: grp('campanhas').id,
        position: 0,
        isMenuItem: true,
        isActive: true,
      },
      {
        slug: 'campaigns.create',
        name: 'Criar Campanha',
        icon: 'Plus',
        route: '/campaigns/create',
        moduleId: mod('marketing').id,
        featureGroupId: grp('campanhas').id,
        position: 1,
        isMenuItem: false,
        isActive: true,
      },

      // Configurações > Papéis
      {
        slug: 'roles.list',
        name: 'Papéis',
        icon: 'Shield',
        route: '/roles',
        moduleId: mod('configuracoes').id,
        featureGroupId: grp('papeis').id,
        position: 0,
        isMenuItem: true,
        isActive: true,
      },
      {
        slug: 'roles.create',
        name: 'Criar Papel',
        icon: 'Plus',
        route: '/roles/create',
        moduleId: mod('configuracoes').id,
        featureGroupId: grp('papeis').id,
        position: 1,
        isMenuItem: false,
        isActive: true,
      },

      // SaaS > Admin
      {
        slug: 'features.list',
        name: 'Features',
        icon: 'Layers',
        route: '/features',
        moduleId: mod('saas').id,
        featureGroupId: grp('admin-saas').id,
        position: 0,
        isMenuItem: true,
        isActive: true,
      },
      {
        slug: 'features.create',
        name: 'Criar Feature',
        icon: 'Plus',
        route: '/features/create',
        moduleId: mod('saas').id,
        featureGroupId: grp('admin-saas').id,
        position: 1,
        isMenuItem: false,
        isActive: true,
      },
      {
        slug: 'features.edit',
        name: 'Editar Feature',
        icon: 'Pencil',
        route: '/features/:id/edit',
        moduleId: mod('saas').id,
        featureGroupId: grp('admin-saas').id,
        position: 2,
        isMenuItem: false,
        isActive: true,
      },
    ])

    // 6. Criar roles (globais do SaaS por enquanto)
    const roles = await Role.updateOrCreateMany('slug', [
      { slug: 'owner', name: 'Owner', description: 'Super admin do SaaS. Acesso irrestrito.' },
      {
        slug: 'admin',
        name: 'Administrador',
        description: 'Proprietário de company. Acesso total dentro do plano.',
      },
      {
        slug: 'member',
        name: 'Membro',
        description: 'Acesso às features da sua role e teams.',
        isDefault: true,
      },
      { slug: 'viewer', name: 'Visualizador', description: 'Apenas leitura.' },
    ])

    const adminRole = roles.find((r) => r.slug === 'admin')!
    const memberRole = roles.find((r) => r.slug === 'member')!
    const ownerRole = roles.find((r) => r.slug === 'owner')!

    // Admin: todas features exceto SaaS
    const adminFeatures = features.filter(
      (f) => !['features.create', 'features.edit'].includes(f.slug)
    )
    await adminRole.related('features').sync(adminFeatures.map((f) => f.id))

    // Member: apenas plataforma
    const memberFeatures = features.filter((f) => ['home', 'profile'].includes(f.slug))
    await memberRole.related('features').sync(memberFeatures.map((f) => f.id))

    // 7. Criar usuário owner
    const owner = await User.updateOrCreate(
      { email: 'jefteamorim@gmail.com' },
      {
        fullName: 'Jefte Amorim',
        email: 'jefteamorim@gmail.com',
        password: 'password',
        roleId: ownerRole.id,
      }
    )

    // 8. Criar company SaaS Admin
    const saasCompanyPromise = Company.updateOrCreate(
      { slug: 'admin' },
      {
        slug: 'admin',
        name: 'SaaS Admin',
        planId: unlimited.id,
        ownerUserId: owner.id,
      }
    )
    const saasCompany = await saasCompanyPromise

    // Adicionar owner como membro da company SaaS Admin
    const existingMember = await saasCompany
      .related('members')
      .query()
      .where('user_id', owner.id)
      .first()
    if (!existingMember) {
      await saasCompany.related('members').attach({ [owner.id]: { role_id: null } })
    }

    console.log(`Owner criado/atualizado: ${owner.email} (role: owner)`)
    console.log(`Company SaaS Admin: ${saasCompany.slug}`)
    console.log(`Planos: ${plans.map((p) => p.slug).join(', ')}`)
    console.log(`Módulos: ${modules.map((m) => m.slug).join(', ')}`)
    console.log(`Features: ${features.length} registros`)
  }
}
