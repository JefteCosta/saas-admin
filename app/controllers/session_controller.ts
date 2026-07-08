import User from '#models/user'
import Company from '#models/company'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class SessionController {
  private get domain() {
    return env.get('APP_DOMAIN', 'localhost')
  }

  private get port() {
    return env.get('PORT', 3333)
  }

  private buildUrl(subdomain: string, path: string = '/') {
    const port = this.port !== 80 && this.port !== 443 ? `:${this.port}` : ''
    return `http://${subdomain}.${this.domain}${port}${path}`
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.all()
    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    // Resolver para onde redirecionar
    const redirectUrl = await this.resolveRedirect(user)
    return response.redirect(redirectUrl)
  }

  async workspace({ auth, inertia }: HttpContext) {
    const user = auth.user!

    // Buscar companies do user
    await user.load('companies')
    const companies = user.companies.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }))

    // Se tem uma company, verificar se é a SaaS Admin
    const saasCompany = await Company.findBy('slug', 'admin')
    const isInSaas = saasCompany
      ? await saasCompany.related('members').query().where('user_id', user.id).first()
        || saasCompany.ownerUserId === user.id
      : false

    // Buscar companies onde é owner
    const ownedCompanies = await Company.query().where('owner_user_id', user.id)

    const allCompanies = [
      ...(isInSaas ? [{ id: saasCompany!.id, name: 'SaaS Admin (Painel)', slug: 'admin' }] : []),
      ...ownedCompanies
        .filter((c) => c.slug !== 'admin')
        .map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      ...companies
        .filter((c) => c.slug !== 'admin' && !ownedCompanies.find((oc) => oc.id === c.id))
    ]

    return inertia.render('workspace', {
      companies: allCompanies,
      domain: this.domain,
      port: this.port,
    })
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    const port = this.port !== 80 && this.port !== 443 ? `:${this.port}` : ''
    return response.redirect(`http://${this.domain}${port}/login`)
  }

  /**
   * Resolve para onde redirecionar o usuário após login.
   */
  private async resolveRedirect(user: User): Promise<string> {
    // Verificar se pertence à company SaaS Admin
    const saasCompany = await Company.findBy('slug', 'admin')
    if (saasCompany) {
      const isSaasMember = await saasCompany.related('members').query().where('user_id', user.id).first()
      if (isSaasMember || saasCompany.ownerUserId === user.id) {
        return this.buildUrl('admin')
      }
    }

    // Buscar companies do user (owner ou member)
    const ownedCompanies = await Company.query().where('owner_user_id', user.id).where('slug', '!=', 'admin')
    await user.load('companies')
    const memberCompanies = user.companies.filter((c) => c.slug !== 'admin')

    const allCompanies = [...ownedCompanies, ...memberCompanies.filter((c) => !ownedCompanies.find((oc) => oc.id === c.id))]

    if (allCompanies.length === 1) {
      return this.buildUrl(allCompanies[0].slug)
    }

    if (allCompanies.length > 1) {
      // Múltiplas companies → workspace switcher
      const port = this.port !== 80 && this.port !== 443 ? `:${this.port}` : ''
      return `http://${this.domain}${port}/workspace`
    }

    // Sem company — não deveria acontecer após signup
    const port = this.port !== 80 && this.port !== 443 ? `:${this.port}` : ''
    return `http://${this.domain}${port}/workspace`
  }
}
