import Feature from '#models/feature'
import Module from '#models/module'
import User from '#models/user'

export interface MenuItem {
  slug: string
  name: string
  icon: string | null
  route: string
}

export interface MenuGroup {
  group: string
  items: MenuItem[]
}

export interface MenuModule {
  module: string
  moduleIcon: string | null
  groups: MenuGroup[]
}

export default class FeatureService {
  /**
   * Resolve todas as features que o usuário pode acessar.
   * Combina: role direta do user + roles dos teams do user.
   */
  async getUserFeatures(user: User): Promise<Feature[]> {
    await user.load('role', (query) => {
      query.preload('features', (fq) => fq.where('is_active', true))
    })

    await user.load('teams', (query) => {
      query.preload('role', (rq) => {
        rq.preload('features', (fq) => fq.where('is_active', true))
      })
    })

    const featuresMap = new Map<string, Feature>()

    // Features da role direta
    if (user.role?.features) {
      for (const feature of user.role.features) {
        featuresMap.set(feature.slug, feature)
      }
    }

    // Features das roles dos teams
    for (const team of user.teams) {
      if (team.role?.features) {
        for (const feature of team.role.features) {
          featuresMap.set(feature.slug, feature)
        }
      }
    }

    return Array.from(featuresMap.values())
  }

  /**
   * Retorna o menu hierárquico: módulo → grupo → items.
   * Para owner: retorna TODAS as features ativas de módulos ativos.
   * Para admin: retorna TODAS exceto módulo 'saas'.
   * Para demais: retorna apenas features com permissão via role+teams.
   */
  async getUserMenu(user: User): Promise<MenuModule[]> {
    let features: Feature[]

    const roleSlug = user.role?.slug ?? (await this.loadUserRoleSlug(user))

    if (roleSlug === 'owner') {
      // Owner vê todos os módulos ativos
      features = await Feature.query()
        .where('is_active', true)
        .where('is_menu_item', true)
        .preload('module')
        .preload('featureGroup')
        .orderBy('position', 'asc')
    } else if (roleSlug === 'admin') {
      // Admin vê tudo exceto módulo 'saas'
      const saasModule = await Module.findBy('slug', 'saas')
      const query = Feature.query()
        .where('is_active', true)
        .where('is_menu_item', true)
        .preload('module')
        .preload('featureGroup')
        .orderBy('position', 'asc')

      if (saasModule) {
        query.whereNot('module_id', saasModule.id)
      }

      features = await query
    } else {
      // Demais: apenas features com permissão
      const userFeatures = await this.getUserFeatures(user)
      features = userFeatures
        .filter((f) => f.isMenuItem && f.isActive)
        .sort((a, b) => a.position - b.position)
      // Preload module e featureGroup para features já carregadas
      for (const feature of features) {
        if (!feature.$preloaded.module) {
          await feature.load('module')
        }
        if (!feature.$preloaded.featureGroup) {
          await feature.load('featureGroup')
        }
      }
    }

    return this.groupFeaturesByModule(features)
  }

  /**
   * Verifica se o usuário pode acessar uma feature específica.
   */
  async userCanAccess(user: User, featureSlug: string): Promise<boolean> {
    const features = await this.getUserFeatures(user)
    return features.some((f) => f.slug === featureSlug)
  }

  /**
   * Agrupa features em hierarquia: módulo → grupo → items.
   */
  private groupFeaturesByModule(features: Feature[]): MenuModule[] {
    const moduleMap = new Map<
      number,
      { name: string; icon: string | null; position: number; groups: Map<string, { position: number; items: MenuItem[] }> }
    >()

    for (const feature of features) {
      const mod = feature.module
      const moduleId = mod?.id ?? 0
      const moduleName = mod?.name ?? 'Geral'
      const moduleIcon = mod?.icon ?? null
      const modulePosition = mod?.position ?? 999

      if (!moduleMap.has(moduleId)) {
        moduleMap.set(moduleId, {
          name: moduleName,
          icon: moduleIcon,
          position: modulePosition,
          groups: new Map(),
        })
      }

      const moduleEntry = moduleMap.get(moduleId)!
      const groupName = feature.featureGroup?.name ?? 'Geral'
      const groupPosition = feature.featureGroup?.position ?? 999

      if (!moduleEntry.groups.has(groupName)) {
        moduleEntry.groups.set(groupName, { position: groupPosition, items: [] })
      }

      moduleEntry.groups.get(groupName)!.items.push({
        slug: feature.slug,
        name: feature.name,
        icon: feature.icon,
        route: feature.route,
      })
    }

    // Ordenar módulos por position
    const sortedModules = Array.from(moduleMap.values()).sort((a, b) => a.position - b.position)

    return sortedModules.map((mod) => {
      // Ordenar grupos por position
      const sortedGroups = Array.from(mod.groups.entries())
        .sort(([, a], [, b]) => a.position - b.position)
        .map(([groupName, groupData]) => ({
          group: groupName,
          items: groupData.items,
        }))

      return {
        module: mod.name,
        moduleIcon: mod.icon,
        groups: sortedGroups,
      }
    })
  }

  /**
   * Carrega o slug da role do user se não estiver carregado.
   */
  private async loadUserRoleSlug(user: User): Promise<string | null> {
    if (!user.roleId) return null
    await user.load('role')
    return user.role?.slug ?? null
  }
}
