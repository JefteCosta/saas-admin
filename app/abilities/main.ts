import type User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'
import FeatureService from '#services/feature_service'

/**
 * Ability para verificar se o usuário pode acessar uma feature.
 *
 * Lógica:
 * 1. Owner → acesso total (bypass)
 * 2. Admin → acesso total exceto features restritas do painel SaaS
 * 3. Outros → verifica permissões via FeatureService (role + teams)
 */
export const accessFeature = Bouncer.ability(async (user: User, featureSlug: string) => {
  // Sempre carrega a role se o user tem roleId
  if (user.roleId) {
    await user.load('role')
  }

  const roleSlug = user.role?.slug

  // Owner tem acesso irrestrito a TUDO
  if (roleSlug === 'owner') {
    return true
  }

  // Admin tem acesso a tudo EXCETO gerenciamento de features
  if (roleSlug === 'admin') {
    const restrictedForAdmin = ['features.create', 'features.edit']
    return !restrictedForAdmin.includes(featureSlug)
  }

  // Demais roles: verificar permissões via service
  const service = new FeatureService()
  return service.userCanAccess(user, featureSlug)
})
