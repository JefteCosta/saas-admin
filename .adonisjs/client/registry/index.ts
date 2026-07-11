/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'drive.fs.serve': {
    methods: ["GET","HEAD"],
    pattern: '/uploads/*',
    tokens: [{"old":"/uploads/*","type":0,"val":"uploads","end":""},{"old":"/uploads/*","type":2,"val":"*","end":""}],
    types: placeholder as Registry['drive.fs.serve']['types'],
  },
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
  'auth.callback': {
    methods: ["GET","HEAD"],
    pattern: '/auth/callback',
    tokens: [{"old":"/auth/callback","type":0,"val":"auth","end":""},{"old":"/auth/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['auth.callback']['types'],
  },
  'logout.global': {
    methods: ["GET","HEAD"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['logout.global']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'workspace': {
    methods: ["GET","HEAD"],
    pattern: '/workspace',
    tokens: [{"old":"/workspace","type":0,"val":"workspace","end":""}],
    types: placeholder as Registry['workspace']['types'],
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
  'company': {
    methods: ["GET","HEAD"],
    pattern: '/company',
    tokens: [{"old":"/company","type":0,"val":"company","end":""}],
    types: placeholder as Registry['company']['types'],
  },
  'company.edit': {
    methods: ["GET","HEAD"],
    pattern: '/company/edit',
    tokens: [{"old":"/company/edit","type":0,"val":"company","end":""},{"old":"/company/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['company.edit']['types'],
  },
  'company.addresses.list': {
    methods: ["GET","HEAD"],
    pattern: '/company/addresses',
    tokens: [{"old":"/company/addresses","type":0,"val":"company","end":""},{"old":"/company/addresses","type":0,"val":"addresses","end":""}],
    types: placeholder as Registry['company.addresses.list']['types'],
  },
  'company.addresses.create': {
    methods: ["GET","HEAD"],
    pattern: '/company/addresses/create',
    tokens: [{"old":"/company/addresses/create","type":0,"val":"company","end":""},{"old":"/company/addresses/create","type":0,"val":"addresses","end":""},{"old":"/company/addresses/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['company.addresses.create']['types'],
  },
  'users': {
    methods: ["GET","HEAD"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users']['types'],
  },
  'users.updateRole': {
    methods: ["PATCH"],
    pattern: '/users/:id/role',
    tokens: [{"old":"/users/:id/role","type":0,"val":"users","end":""},{"old":"/users/:id/role","type":1,"val":"id","end":""},{"old":"/users/:id/role","type":0,"val":"role","end":""}],
    types: placeholder as Registry['users.updateRole']['types'],
  },
  'roles': {
    methods: ["GET","HEAD"],
    pattern: '/roles',
    tokens: [{"old":"/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['roles']['types'],
  },
  'roles.store': {
    methods: ["POST"],
    pattern: '/roles',
    tokens: [{"old":"/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['roles.store']['types'],
  },
  'roles.updateFeatures': {
    methods: ["PATCH"],
    pattern: '/roles/:id/features',
    tokens: [{"old":"/roles/:id/features","type":0,"val":"roles","end":""},{"old":"/roles/:id/features","type":1,"val":"id","end":""},{"old":"/roles/:id/features","type":0,"val":"features","end":""}],
    types: placeholder as Registry['roles.updateFeatures']['types'],
  },
  'roles.destroy': {
    methods: ["DELETE"],
    pattern: '/roles/:id',
    tokens: [{"old":"/roles/:id","type":0,"val":"roles","end":""},{"old":"/roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['roles.destroy']['types'],
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
  'campaigns': {
    methods: ["GET","HEAD"],
    pattern: '/campaigns',
    tokens: [{"old":"/campaigns","type":0,"val":"campaigns","end":""}],
    types: placeholder as Registry['campaigns']['types'],
  },
  'campaigns.create': {
    methods: ["GET","HEAD"],
    pattern: '/campaigns/create',
    tokens: [{"old":"/campaigns/create","type":0,"val":"campaigns","end":""},{"old":"/campaigns/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['campaigns.create']['types'],
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
  'logout': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['logout']['types'],
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
