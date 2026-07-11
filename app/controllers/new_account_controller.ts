import User from '#models/user'
import Role from '#models/role'
import Company from '#models/company'
import Plan from '#models/plan'
import SlugService from '#services/slug_service'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class NewAccountController {
  private get domain() {
    return env.get('APP_DOMAIN', 'localhost')
  }

  private get port() {
    return env.get('PORT', 3333)
  }

  private get useSubdomains() {
    return this.domain !== 'localhost'
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('auth/register', {})
  }

  async store({ request, response, auth, session }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)

    // Buscar role admin e plano starter (padrão)
    const adminRole = await Role.findBy('slug', 'admin')
    const starterPlan = await Plan.findBy('slug', 'starter')

    if (!adminRole) {
      session.flash(
        'error',
        'Configuração inicial incompleta. Execute os seeders para criar as permissões.'
      )
      return response.redirect().back()
    }

    // Criar usuário
    const user = await User.create({
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      roleId: adminRole.id,
    })

    // Gerar slug único para a company
    const slug = await SlugService.generateCompanySlug(payload.companyName)

    // Criar company com o user como proprietário
    const company = await Company.create({
      name: payload.companyName,
      slug,
      planId: starterPlan?.id ?? null,
      ownerUserId: user.id,
    })

    // Adicionar user como membro da company (sem role — é o proprietário)
    await company.related('members').attach({ [user.id]: { role_id: null } })

    await auth.use('web').login(user)

    if (!this.useSubdomains) {
      return response.redirect('/')
    }

    const portStr = this.port !== 80 && this.port !== 443 ? `:${this.port}` : ''
    const redirectUrl = `http://${slug}.${this.domain}${portStr}/`

    response.header('X-Inertia-Location', redirectUrl)
    return response.status(409).send('')
  }
}
