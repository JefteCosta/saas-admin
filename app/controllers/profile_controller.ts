import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'

export default class ProfileController {
  async show({ inertia }: HttpContext) {
    return inertia.render('profile', {})
  }

  async update({ request, auth, response, session }: HttpContext) {
    const user = auth.user!
    const { fullName } = request.only(['fullName'])
    const avatar = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })
    const cover = request.file('cover', {
      size: '4mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (avatar && !avatar.isValid) {
      session.flash('error', 'Arquivo de avatar inválido. Use JPG, PNG ou WEBP até 2MB.')
      return response.redirect().back()
    }

    if (cover && !cover.isValid) {
      session.flash('error', 'Arquivo de capa inválido. Use JPG, PNG ou WEBP até 4MB.')
      return response.redirect().back()
    }

    user.fullName = fullName

    if (avatar) {
      const avatarFileName = `avatar-${user.id}-${randomUUID()}.${avatar.extname}`
      await avatar.move(app.makePath('public/uploads/profiles'), {
        name: avatarFileName,
        overwrite: true,
      })
      user.avatarUrl = `/uploads/profiles/${avatarFileName}`
    }

    if (cover) {
      const coverFileName = `cover-${user.id}-${randomUUID()}.${cover.extname}`
      await cover.move(app.makePath('public/uploads/profiles'), {
        name: coverFileName,
        overwrite: true,
      })
      user.coverUrl = `/uploads/profiles/${coverFileName}`
    }

    await user.save()

    session.flash('success', 'Perfil atualizado com sucesso.')
    return response.redirect().back()
  }
}
