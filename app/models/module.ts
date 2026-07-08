import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import FeatureGroup from '#models/feature_group'
import Feature from '#models/feature'

export default class Module extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

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

  @hasMany(() => FeatureGroup)
  declare featureGroups: HasMany<typeof FeatureGroup>

  @hasMany(() => Feature)
  declare features: HasMany<typeof Feature>
}
