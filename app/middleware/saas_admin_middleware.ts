import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Company from '#models/company'

/**
 * Middleware que verifica se o usuário pertence à company SaaS Admin.
 * Usado nas rotas do painel admin (admin.saas-admin.local).
 */
export default class SaasAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const context = ctx as HttpContext & { company?: Company }
    const user = ctx.auth.user!

    // Buscar a company SaaS Admin (slug: 'admin')
    const saasCompany = await Company.findBy('slug', 'admin')
    if (!saasCompany) {
      return ctx.response.forbidden('Company SaaS Admin não encontrada.')
    }

    // Verificar se o user é membro da company SaaS Admin
    const isMember = await saasCompany.related('members').query().where('user_id', user.id).first()
    const isOwner = saasCompany.ownerUserId === user.id

    if (!isMember && !isOwner) {
      return ctx.response.forbidden('Acesso restrito ao painel SaaS Admin.')
    }

    // Setar company SaaS no contexto
    context.company = saasCompany

    return next()
  }
}
