import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Company from '#models/company'

/**
 * Middleware que resolve a company pelo subdomínio (:tenant) da URL.
 * Verifica se o user é membro da company e seta ctx.company.
 */
export default class CompanyContextMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const tenant = ctx.params.tenant || ctx.subdomains.tenant

    if (!tenant) {
      return ctx.response.notFound('Empresa não encontrada.')
    }

    // Buscar company pelo slug (subdomínio)
    const company = await Company.findBy('slug', tenant)
    if (!company || !company.isActive) {
      return ctx.response.notFound('Empresa não encontrada ou inativa.')
    }

    const user = ctx.auth.user!

    // Verificar se user é membro ou owner da company
    const isMember = await company.related('members').query().where('user_id', user.id).first()
    const isOwner = company.ownerUserId === user.id

    if (!isMember && !isOwner) {
      return ctx.response.forbidden('Você não tem acesso a esta empresa.')
    }

    // Setar no contexto
    ctx.company = company
    ctx.companyMembership = isMember

    return next()
  }
}
