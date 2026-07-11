import type Company from '#models/company'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    company?: Company
    companyMembership?: any
  }
}
