import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('avatar_url').nullable().after('password')
      table.string('cover_url').nullable().after('avatar_url')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('avatar_url')
      table.dropColumn('cover_url')
    })
  }
}
