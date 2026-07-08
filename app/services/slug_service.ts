import Company from '#models/company'

export default class SlugService {
  /**
   * Gera um slug a partir de um texto.
   */
  static slugify(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
      .replace(/[\s_]+/g, '-') // espaços e underscores viram hifens
      .replace(/-+/g, '-') // múltiplos hifens viram um
      .replace(/^-|-$/g, '') // remove hifens no início/fim
  }

  /**
   * Gera um slug único para a company a partir do nome.
   * Se já existir, adiciona sufixo numérico (-2, -3, etc.)
   */
  static async generateCompanySlug(name: string): Promise<string> {
    const baseSlug = this.slugify(name)

    // Verificar se o slug base está disponível
    const existing = await Company.findBy('slug', baseSlug)
    if (!existing) {
      return baseSlug
    }

    // Buscar slugs que começam com o base e adicionar sufixo
    let counter = 2
    while (true) {
      const candidate = `${baseSlug}-${counter}`
      const found = await Company.findBy('slug', candidate)
      if (!found) {
        return candidate
      }
      counter++
    }
  }
}
