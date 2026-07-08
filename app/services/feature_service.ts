import Feature from '#models/feature'
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
   * Retorna o menu agrupado e ordenado para o sidebar.
   * Para owner: retorna TODAS as features ativas.
   * Para admin: retorna TODAS exceto features restritas ao SaaS.
   * Para demais: retorna apenas features com permissão.
   */
  async getUserMenu(user: User): Promise<MenuGroup[]> {
    let features: Feature[]

    const roleSlug = user.role?.slug ?? (await this.loadUserRoleSlug(user))

    if (roleSlug === 'owner') {
      // Owner vê tudo
      features = await Feature.query()
        .where('is_active', true)
        .where('is_menu_item', true)
        .preload('module')
        .orderBy('position', 'asc')
    } else if (roleSlug === 'admin') {
      // Admin vê tudo exceto features do grupo SaaS restritas
      const restrictedSlugs = ['features.create', 'features.edit']
      features = await Feature.query()
        .where('is_active', true)
        .where('is_menu_item', true)
        .whereNotIn('slug', restrictedSlugs)
        .preload('module')
        .orderBy('position', 'asc')
    } else {
      // Demais: apenas features com permissão
      const userFeatures = await this.getUserFeatures(user)
      features = userFeatures
        .filter((f) => f.isMenuItem && f.isActive)
        .sort((a, b) => a.position - b.position)
      // Preload module para features já carregadas
      for (const feature of features) {
        if (!feature.$preloaded.module) {
          await feature.load('module')
        }
      }
    }

    return this.groupFeatures(features)
  }

  /**
   * Verifica se o usuário pode acessar uma feature específica.
   */
  async userCanAccess(user: User, featureSlug: string): Promise<boolean> {
    const features = await this.getUserFeatures(user)
    return features.some((f) => f.slug === featureSlug)
  }

  /**
   * Agrupa features por módulo para o menu.
   */
  private groupFeatures(features: Feature[]): MenuGroup[] {
    const groups = new Map<string, MenuItem[]>()

    for (const feature of features) {
      const groupName = feature.module?.name || 'Geral'
      if (!groups.has(groupName)) {
        groups.set(groupName, [])
      }
      groups.get(groupName)!.push({
        slug: feature.slug,
        name: feature.name,
        icon: feature.icon,
        route: feature.route,
      })
    }

    return Array.from(groups.entries()).map(([group, items]) => ({ group, items }))
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
