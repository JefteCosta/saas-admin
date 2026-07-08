import User from '#models/user'
import Role from '#models/role'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/register', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)

    const adminRole = await Role.findBy('slug', 'admin')

    const user = await User.create({
      ...payload,
      roleId: adminRole?.id ?? null,
    })

    await auth.use('web').login(user)
    response.redirect().toRoute('profile')
  }
}
