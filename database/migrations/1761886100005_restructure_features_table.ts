import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'features'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('module_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('modules')
        .onDelete('SET NULL')
      table
        .integer('feature_group_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('feature_groups')
        .onDelete('SET NULL')
      table.dropColumn('group')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('module_id')
      table.dropColumn('feature_group_id')
      table.string('group').nullable()
    })
  }
}
