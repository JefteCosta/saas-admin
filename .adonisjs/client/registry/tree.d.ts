/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  home: typeof routes['home']
  profile: typeof routes['profile'] & {
    update: typeof routes['profile.update']
  }
  users: typeof routes['users'] & {
    updateRole: typeof routes['users.update_role']
  }
  roles: typeof routes['roles'] & {
    store: typeof routes['roles.store']
    updateFeatures: typeof routes['roles.update_features']
    destroy: typeof routes['roles.destroy']
  }
  teams: typeof routes['teams'] & {
    store: typeof routes['teams.store']
    update: typeof routes['teams.update']
    destroy: typeof routes['teams.destroy']
  }
  features: typeof routes['features'] & {
    store: typeof routes['features.store']
    update: typeof routes['features.update']
  }
  settings: typeof routes['settings']
}
