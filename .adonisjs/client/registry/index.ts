/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'profile': {
    methods: ["GET","HEAD"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile']['types'],
  },
  'profile.update': {
    methods: ["PATCH"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.update']['types'],
  },
  'users': {
    methods: ["GET","HEAD"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users']['types'],
  },
  'users.update_role': {
    methods: ["PATCH"],
    pattern: '/users/:id/role',
    tokens: [{"old":"/users/:id/role","type":0,"val":"users","end":""},{"old":"/users/:id/role","type":1,"val":"id","end":""},{"old":"/users/:id/role","type":0,"val":"role","end":""}],
    types: placeholder as Registry['users.update_role']['types'],
  },
  'roles': {
    methods: ["GET","HEAD"],
    pattern: '/roles',
    tokens: [{"old":"/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['roles']['types'],
  },
  'roles.update_features': {
    methods: ["PATCH"],
    pattern: '/roles/:id/features',
    tokens: [{"old":"/roles/:id/features","type":0,"val":"roles","end":""},{"old":"/roles/:id/features","type":1,"val":"id","end":""},{"old":"/roles/:id/features","type":0,"val":"features","end":""}],
    types: placeholder as Registry['roles.update_features']['types'],
  },
  'teams': {
    methods: ["GET","HEAD"],
    pattern: '/teams',
    tokens: [{"old":"/teams","type":0,"val":"teams","end":""}],
    types: placeholder as Registry['teams']['types'],
  },
  'teams.store': {
    methods: ["POST"],
    pattern: '/teams',
    tokens: [{"old":"/teams","type":0,"val":"teams","end":""}],
    types: placeholder as Registry['teams.store']['types'],
  },
  'teams.update': {
    methods: ["PATCH"],
    pattern: '/teams/:id',
    tokens: [{"old":"/teams/:id","type":0,"val":"teams","end":""},{"old":"/teams/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['teams.update']['types'],
  },
  'teams.destroy': {
    methods: ["DELETE"],
    pattern: '/teams/:id',
    tokens: [{"old":"/teams/:id","type":0,"val":"teams","end":""},{"old":"/teams/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['teams.destroy']['types'],
  },
  'features': {
    methods: ["GET","HEAD"],
    pattern: '/features',
    tokens: [{"old":"/features","type":0,"val":"features","end":""}],
    types: placeholder as Registry['features']['types'],
  },
  'features.store': {
    methods: ["POST"],
    pattern: '/features',
    tokens: [{"old":"/features","type":0,"val":"features","end":""}],
    types: placeholder as Registry['features.store']['types'],
  },
  'features.update': {
    methods: ["PATCH"],
    pattern: '/features/:id',
    tokens: [{"old":"/features/:id","type":0,"val":"features","end":""},{"old":"/features/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['features.update']['types'],
  },
  'settings': {
    methods: ["GET","HEAD"],
    pattern: '/settings',
    tokens: [{"old":"/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['settings']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
