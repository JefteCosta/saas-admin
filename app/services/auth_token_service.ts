import { randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import AuthToken from '#models/auth_token'
import User from '#models/user'

export default class AuthTokenService {
  /**
   * Gera um token temporário de autenticação para redirect cross-domain.
   * O token expira em 30 segundos e só pode ser usado uma vez.
   */
  static async generate(user: User, redirectUrl: string): Promise<string> {
    const token = randomBytes(32).toString('hex')

    await AuthToken.create({
      token,
      userId: user.id,
      redirectUrl,
      expiresAt: DateTime.now().plus({ seconds: 30 }),
    })

    return token
  }

  /**
   * Valida um token e retorna o user associado.
   * Marca o token como usado após validação.
   * Retorna null se inválido, expirado ou já usado.
   */
  static async validate(token: string): Promise<User | null> {
    const authToken = await AuthToken.query()
      .where('token', token)
      .whereNull('used_at')
      .where('expires_at', '>', DateTime.now().toSQL()!)
      .preload('user')
      .first()

    if (!authToken) return null

    // Marcar como usado (single-use)
    authToken.usedAt = DateTime.now()
    await authToken.save()

    return authToken.user
  }

  /**
   * Limpa tokens expirados (housekeeping).
   */
  static async cleanup(): Promise<void> {
    await AuthToken.query()
      .where('expires_at', '<', DateTime.now().toSQL()!)
      .delete()
  }
}
