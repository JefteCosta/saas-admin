import Feature from '#models/feature'
import Module from '#models/module'
import FeatureGroup from '#models/feature_group'
import type { HttpContext } from '@adonisjs/core/http'

export default class FeaturesController {
  async index({ inertia }: HttpContext) {
    const features = await Feature.query().preload('module').preload('featureGroup').orderBy('position')
    const modules = await Module.query().where('is_active', true).orderBy('position')
    const featureGroups = await FeatureGroup.query().where('is_active', true).orderBy('position')

    return inertia.render('admin/features', {
      features: features.map((f) => ({
        id: f.id,
        slug: f.slug,
        name: f.name,
        description: f.description,
        icon: f.icon,
        route: f.route,
        moduleName: f.module?.name || '—',
        moduleId: f.moduleId,
        featureGroupId: f.featureGroupId,
        featureGroupName: f.featureGroup?.name || '—',
        position: f.position,
        isMenuItem: f.isMenuItem,
        isActive: f.isActive,
      })),
      modules: modules.map((m) => ({ id: m.id, slug: m.slug, name: m.name })),
      featureGroups: featureGroups.map((g) => ({ id: g.id, slug: g.slug, name: g.name, moduleId: g.moduleId })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = request.only(['slug', 'name', 'description', 'icon', 'route', 'moduleId', 'featureGroupId', 'position', 'isMenuItem', 'isActive'])

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
    const data = request.only(['name', 'description', 'icon', 'route', 'moduleId', 'featureGroupId', 'position', 'isMenuItem', 'isActive'])

    feature.merge(data)
    await feature.save()

    session.flash('success', `Feature "${feature.name}" atualizada.`)
    return response.redirect().back()
  }
}
