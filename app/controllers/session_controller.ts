import User from '#models/user'
import Company from '#models/company'
import AuthTokenService from '#services/auth_token_service'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class SessionController {
  private get domain() {
    return env.get('APP_DOMAIN', 'localhost')
  }

  private get port() {
    return env.get('PORT', 3333)
  }

  private get useSubdomains() {
    return process.env.NODE_ENV !== 'test'
  }

  private buildUrl(subdomain: string, path: string = '/') {
    if (!this.useSubdomains) {
      if (subdomain === 'admin') return `/admin${path}`
      return `/t/${subdomain}${path}`
    }
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

    // Resolver destino
    const destinationUrl = await this.resolveRedirect(user)

    // Se o destino é cross-origin (URL absoluta), usar token
    if (destinationUrl.startsWith('http')) {
      const callbackUrl = `${destinationUrl.replace(/\/$/, '')}/auth/callback`
      const token = await AuthTokenService.generate(user, callbackUrl)
      const redirectUrl = `${callbackUrl}?token=${token}`

      // Inertia: usar X-Inertia-Location para full page redirect
      response.header('X-Inertia-Location', redirectUrl)
      return response.status(409).send('')
    }

    // Redirect local (mesmo domínio)
    return response.redirect(destinationUrl)
  }

  /**
   * Auth callback — valida token e cria sessão local no subdomínio.
   * Rota: GET /auth/callback?token=xxx
   */
  async callback({ request, auth, response }: HttpContext) {
    const token = request.input('token')

    if (!token) {
      return response.redirect('/login')
    }

    const user = await AuthTokenService.validate(token)

    if (!user) {
      // Token inválido, expirado ou já usado
      return response.redirect('/login')
    }

    // Criar sessão local neste subdomínio
    await auth.use('web').login(user)

    // Redirecionar para home do subdomínio
    return response.redirect('/')
  }

  async workspace({ auth, inertia }: HttpContext) {
    const user = auth.user!

    await user.load('companies')
    const companies = user.companies.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }))

    const saasCompany = await Company.findBy('slug', 'admin')
    const isInSaas = saasCompany
      ? await saasCompany.related('members').query().where('user_id', user.id).first()
        || saasCompany.ownerUserId === user.id
      : false

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

    // Redirecionar para o domínio principal para destruir sessão lá também
    if (this.useSubdomains) {
      const port = this.port !== 80 && this.port !== 443 ? `:${this.port}` : ''
      return response.redirect(`http://${this.domain}${port}/logout`)
    }

    return response.redirect('/login')
  }

  /**
   * Logout global — destrói sessão no domínio principal e redireciona para login.
   * Chamado pelo logout dos subdomínios.
   */
  async destroyGlobal({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }

  private async resolveRedirect(user: User): Promise<string> {
    if (!this.useSubdomains) {
      return '/'
    }

    // Verificar se pertence à company SaaS Admin
    const saasCompany = await Company.findBy('slug', 'admin')
    if (saasCompany) {
      const isSaasMember = await saasCompany.related('members').query().where('user_id', user.id).first()
      if (isSaasMember || saasCompany.ownerUserId === user.id) {
        return this.buildUrl('admin')
      }
    }

    // Buscar companies do user
    const ownedCompanies = await Company.query().where('owner_user_id', user.id).where('slug', '!=', 'admin')
    await user.load('companies')
    const memberCompanies = user.companies.filter((c) => c.slug !== 'admin')

    const allCompanies = [...ownedCompanies, ...memberCompanies.filter((c) => !ownedCompanies.find((oc) => oc.id === c.id))]

    if (allCompanies.length === 1) {
      return this.buildUrl(allCompanies[0].slug)
    }

    const port = this.port !== 80 && this.port !== 443 ? `:${this.port}` : ''
    return `http://${this.domain}${port}/workspace`
  }
}
