/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
  }
  auth: {
    callback: typeof routes['auth.callback']
  }
  logout: typeof routes['logout'] & {
    global: typeof routes['logout.global']
  }
  home: typeof routes['home']
  workspace: typeof routes['workspace']
  profile: typeof routes['profile'] & {
    update: typeof routes['profile.update']
  }
  company: typeof routes['company'] & {
    edit: typeof routes['company.edit']
    addresses: {
      list: typeof routes['company.addresses.list']
      create: typeof routes['company.addresses.create']
    }
  }
  users: typeof routes['users'] & {
    updateRole: typeof routes['users.updateRole']
  }
  roles: typeof routes['roles'] & {
    store: typeof routes['roles.store']
    updateFeatures: typeof routes['roles.updateFeatures']
    destroy: typeof routes['roles.destroy']
  }
  teams: typeof routes['teams'] & {
    store: typeof routes['teams.store']
    update: typeof routes['teams.update']
    destroy: typeof routes['teams.destroy']
  }
  campaigns: typeof routes['campaigns'] & {
    create: typeof routes['campaigns.create']
  }
  features: typeof routes['features'] & {
    store: typeof routes['features.store']
    update: typeof routes['features.update']
  }
  settings: typeof routes['settings']
}
