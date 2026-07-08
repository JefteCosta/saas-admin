import Feature from '#models/feature'
import type { HttpContext } from '@adonisjs/core/http'

export default class FeaturesController {
  async index({ inertia }: HttpContext) {
    const features = await Feature.query().orderBy('position')

    return inertia.render('admin/features', {
      features: features.map((f) => ({
        id: f.id,
        slug: f.slug,
        name: f.name,
        description: f.description,
        icon: f.icon,
        route: f.route,
        group: f.group,
        position: f.position,
        isMenuItem: f.isMenuItem,
        isActive: f.isActive,
      })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = request.only(['slug', 'name', 'description', 'icon', 'route', 'group', 'position', 'isMenuItem', 'isActive'])

    await Feature.create({
      ...data,
      position: data.position ?? 0,
      isMenuItem: data.isMenuItem ?? true,
      isActive: data.isActive ?? true,
    })

    session.flash('success', `Feature "${data.name}" criada.`)
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const feature = await Feature.findOrFail(params.id)
    const data = request.only(['name', 'description', 'icon', 'route', 'group', 'position', 'isMenuItem', 'isActive'])

    feature.merge(data)
    await feature.save()

    session.flash('success', `Feature "${feature.name}" atualizada.`)
    return response.redirect().back()
  }
}
