import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Plan from '#models/plan'
import User from '#models/user'
import CompanyAddress from '#models/company_address'
import Team from '#models/team'
import Role from '#models/role'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare legalName: string | null

  @column()
  declare document: string | null

  @column()
  declare stateRegistration: string | null

  @column()
  declare phone: string | null

  @column()
  declare logoUrl: string | null

  @column()
  declare planId: number | null

  @column()
  declare ownerUserId: number

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Plan)
  declare plan: BelongsTo<typeof Plan>

  @belongsTo(() => User, { foreignKey: 'ownerUserId' })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => CompanyAddress)
  declare addresses: HasMany<typeof CompanyAddress>

  @hasMany(() => Team)
  declare teams: HasMany<typeof Team>

  @hasMany(() => Role)
  declare roles: HasMany<typeof Role>

  @manyToMany(() => User, {
    pivotTable: 'company_members',
    pivotColumns: ['role_id'],
    pivotTimestamps: { createdAt: 'created_at', updatedAt: false },
  })
  declare members: ManyToMany<typeof User>
}
