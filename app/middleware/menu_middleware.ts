import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import FeatureService from '#services/feature_service'

/**
 * Resolve o menu dinâmico do usuário e compartilha via Inertia.
 * Deve rodar APÓS o auth middleware para ter acesso ao user.
 */
export default class MenuMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (ctx.auth?.user) {
      const service = new FeatureService()
      const menu = await service.getUserMenu(ctx.auth.user)
      ctx.inertia.share({ menu } as any)
    }

    return next()
  }
}
