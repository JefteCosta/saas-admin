import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { accessFeature } from '#abilities/main'

/**
 * Feature middleware protege rotas verificando se o usuário
 * tem permissão para acessar a feature associada.
 *
 * Uso nas rotas:
 * router.get('/users', [controller, 'index']).use(middleware.feature({ slug: 'users' }))
 */
export default class FeatureMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { slug: string }) {
    await ctx.bouncer.authorize(accessFeature, options.slug)
    return next()
  }
}
