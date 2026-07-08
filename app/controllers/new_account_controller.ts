import User from '#models/user'
import Role from '#models/role'
import Company from '#models/company'
import Plan from '#models/plan'
import SlugService from '#services/slug_service'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/register', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)

    // Buscar role admin e plano starter (padrão)
    const adminRole = await Role.findBy('slug', 'admin')
    const starterPlan = await Plan.findBy('slug', 'starter')

    // Criar usuário
    const user = await User.create({
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      roleId: adminRole?.id ?? null,
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

    // Redirecionar para o subdomínio da company
    const domain = env.get('APP_DOMAIN', 'localhost')
    const port = env.get('PORT', 3333)
    const portStr = port !== 80 && port !== 443 ? `:${port}` : ''
    return response.redirect(`http://${slug}.${domain}${portStr}/`)
  }
}
