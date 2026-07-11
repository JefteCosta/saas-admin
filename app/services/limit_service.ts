import type Company from '#models/company'
import Module from '#models/module'
import db from '@adonisjs/lucid/services/db'

export default class LimitService {
  /**
   * Verifica se a company pode criar mais de um recurso.
   * Consulta plan_modules.limits (JSON) para o módulo dado.
   * Conta o uso atual e compara com o limite.
   *
   * @param company - Company com plan preloaded
   * @param moduleSlug - slug do módulo (ex: 'pessoas')
   * @param limitKey - chave no JSON de limites (ex: 'max_users', 'max_teams')
   * @param currentCount - contagem atual do recurso
   * @returns { allowed: boolean, limit: number | null, current: number }
   */
  static async check(
    company: Company,
    moduleSlug: string,
    limitKey: string,
    currentCount: number
  ): Promise<{ allowed: boolean; limit: number | null; current: number }> {
    if (!company.planId) {
      return { allowed: true, limit: null, current: currentCount }
    }

    // Carregar plan com modules se não estiver carregado
    if (!company.$preloaded.plan) {
      await company.load('plan')
    }

    const plan = company.plan
    if (!plan) {
      return { allowed: true, limit: null, current: currentCount }
    }

    // Buscar o módulo pelo slug
    const module = await Module.findBy('slug', moduleSlug)
    if (!module) {
      return { allowed: true, limit: null, current: currentCount }
    }

    // Buscar o plan_module com limits
    const planModule = await db
      .from('plan_modules')
      .where('plan_id', plan.id)
      .where('module_id', module.id)
      .first()

    if (!planModule) {
      return { allowed: true, limit: null, current: currentCount }
    }

    // Ler limits (pode ser JSON string ou object)
    let limits = planModule.limits
    if (!limits) {
      return { allowed: true, limit: null, current: currentCount }
    }

    if (typeof limits === 'string') {
      try {
        limits = JSON.parse(limits)
      } catch {
        return { allowed: true, limit: null, current: currentCount }
      }
    }

    const limitValue = limits[limitKey]
    if (limitValue === undefined || limitValue === null) {
      return { allowed: true, limit: null, current: currentCount }
    }

    return {
      allowed: currentCount < limitValue,
      limit: limitValue,
      current: currentCount,
    }
  }

  /**
   * Atalho: verifica se pode criar mais users na company.
   */
  static async canCreateUser(company: Company): Promise<boolean> {
    const currentCount = await db
      .from('company_members')
      .where('company_id', company.id)
      .count('* as total')
      .first()

    const total = Number(currentCount?.$extras?.total ?? currentCount?.total ?? 0)
    const result = await this.check(company, 'pessoas', 'max_users', total)
    return result.allowed
  }

  /**
   * Atalho: verifica se pode criar mais teams na company.
   */
  static async canCreateTeam(company: Company): Promise<boolean> {
    const currentCount = await db
      .from('teams')
      .where('company_id', company.id)
      .count('* as total')
      .first()

    const total = Number(currentCount?.$extras?.total ?? currentCount?.total ?? 0)
    const result = await this.check(company, 'pessoas', 'max_teams', total)
    return result.allowed
  }
}
