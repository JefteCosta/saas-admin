import User from '#models/user'
import Role from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ inertia }: HttpContext) {
    const users = await User.query().preload('role').orderBy('created_at', 'desc')
    const roles = await Role.query().whereNot('slug', 'owner').orderBy('name')

    return inertia.render('admin/users', {
      users: users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        role: u.role ? { id: u.role.id, slug: u.role.slug, name: u.role.name } : null,
        createdAt: u.createdAt.toFormat('dd/MM/yyyy'),
      })),
      roles: roles.map((r) => ({ id: r.id, slug: r.slug, name: r.name })),
    })
  }

  async updateRole({ params, request, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const { roleId } = request.only(['roleId'])

    // Não permite alterar role do owner
    await user.load('role')
    if (user.role?.slug === 'owner') {
      session.flash('error', 'Não é possível alterar a role do owner.')
      return response.redirect().back()
    }

    user.roleId = roleId
    await user.save()

    session.flash('success', 'Role atualizada com sucesso.')
    return response.redirect().back()
  }
}
