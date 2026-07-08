import Role from '#models/role'
import Feature from '#models/feature'
import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController {
  async index({ inertia }: HttpContext) {
    const roles = await Role.query().preload('features').orderBy('name')
    const features = await Feature.query().where('is_active', true).orderBy('position')

    return inertia.render('admin/roles', {
      roles: roles.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description,
        featureIds: r.features.map((f) => f.id),
      })),
      features: features.map((f) => ({ id: f.id, slug: f.slug, name: f.name, group: f.group })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const { name, slug, description } = request.only(['name', 'slug', 'description'])

    await Role.create({ name, slug, description })

    session.flash('success', `Role "${name}" criada com sucesso.`)
    return response.redirect().back()
  }

  async updateFeatures({ params, request, response, session }: HttpContext) {
    const role = await Role.findOrFail(params.id)
    const { featureIds } = request.only(['featureIds'])

    if (role.slug === 'owner') {
      session.flash('error', 'A role owner tem acesso irrestrito e não precisa de permissões.')
      return response.redirect().back()
    }

    await role.related('features').sync(featureIds || [])

    session.flash('success', `Permissões da role "${role.name}" atualizadas.`)
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const role = await Role.findOrFail(params.id)

    if (['owner', 'admin'].includes(role.slug)) {
      session.flash('error', 'Não é possível remover roles do sistema.')
      return response.redirect().back()
    }

    await role.delete()
    session.flash('success', 'Role removida.')
    return response.redirect().back()
  }
}
