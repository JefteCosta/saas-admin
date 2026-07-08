import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Module from '#models/module'
import Feature from '#models/feature'

export default class FeatureGroup extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare moduleId: number

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare icon: string | null

  @column()
  declare position: number

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Module)
  declare module: BelongsTo<typeof Module>

  @hasMany(() => Feature)
  declare features: HasMany<typeof Feature>
}
