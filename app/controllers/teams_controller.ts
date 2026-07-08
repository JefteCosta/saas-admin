import Team from '#models/team'
import Role from '#models/role'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class TeamsController {
  async index({ inertia }: HttpContext) {
    const teams = await Team.query().preload('role').preload('members').orderBy('name')
    const roles = await Role.query().orderBy('name')
    const users = await User.query().orderBy('full_name')

    return inertia.render('admin/teams', {
      teams: teams.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        role: { id: t.role.id, slug: t.role.slug, name: t.role.name },
        members: t.members.map((m) => ({ id: m.id, fullName: m.fullName, email: m.email })),
      })),
      roles: roles.map((r) => ({ id: r.id, slug: r.slug, name: r.name })),
      users: users.map((u) => ({ id: u.id, fullName: u.fullName, email: u.email })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const { name, slug, roleId, memberIds } = request.only(['name', 'slug', 'roleId', 'memberIds'])

    const team = await Team.create({ name, slug, roleId })

    if (memberIds?.length) {
      await team.related('members').attach(memberIds)
    }

    session.flash('success', `Time "${name}" criado com sucesso.`)
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const team = await Team.findOrFail(params.id)
    const { name, roleId, memberIds } = request.only(['name', 'roleId', 'memberIds'])

    team.name = name
    team.roleId = roleId
    await team.save()

    await team.related('members').sync(memberIds || [])

    session.flash('success', `Time "${name}" atualizado.`)
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const team = await Team.findOrFail(params.id)
    await team.delete()

    session.flash('success', 'Time removido.')
    return response.redirect().back()
  }
}
