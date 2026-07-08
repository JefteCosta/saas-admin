import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show({ inertia }: HttpContext) {
    return inertia.render('profile', {})
  }

  async update({ request, auth, response, session }: HttpContext) {
    const user = auth.user!
    const { fullName } = request.only(['fullName'])

    user.fullName = fullName
    await user.save()

    session.flash('success', 'Perfil atualizado com sucesso.')
    return response.redirect().back()
  }
}
