import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'users': { paramsTuple?: []; params?: {} }
    'users.update_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles': { paramsTuple?: []; params?: {} }
    'roles.update_features': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teams': { paramsTuple?: []; params?: {} }
    'teams.store': { paramsTuple?: []; params?: {} }
    'teams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teams.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features': { paramsTuple?: []; params?: {} }
    'features.store': { paramsTuple?: []; params?: {} }
    'features.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'users': { paramsTuple?: []; params?: {} }
    'roles': { paramsTuple?: []; params?: {} }
    'teams': { paramsTuple?: []; params?: {} }
    'features': { paramsTuple?: []; params?: {} }
    'settings': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'users': { paramsTuple?: []; params?: {} }
    'roles': { paramsTuple?: []; params?: {} }
    'teams': { paramsTuple?: []; params?: {} }
    'features': { paramsTuple?: []; params?: {} }
    'settings': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'teams.store': { paramsTuple?: []; params?: {} }
    'features.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'profile.update': { paramsTuple?: []; params?: {} }
    'users.update_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.update_features': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'teams.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}