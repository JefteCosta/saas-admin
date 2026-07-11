import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('slug').notNullable().unique()
      table.string('name').notNullable()
      table.string('legal_name').nullable()
      table.string('document').nullable()
      table.string('state_registration').nullable()
      table.string('phone').nullable()
      table.string('logo_url').nullable()
      table
        .integer('plan_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('plans')
        .onDelete('SET NULL')
      table
        .integer('owner_user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.boolean('is_active').defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
