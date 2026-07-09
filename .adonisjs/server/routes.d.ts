import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'auth.callback': { paramsTuple?: []; params?: {} }
    'logout.global': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'workspace': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'users': { paramsTuple?: []; params?: {} }
    'users.updateRole': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles': { paramsTuple?: []; params?: {} }
    'roles.store': { paramsTuple?: []; params?: {} }
    'roles.updateFeatures': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teams': { paramsTuple?: []; params?: {} }
    'teams.store': { paramsTuple?: []; params?: {} }
    'teams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teams.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features': { paramsTuple?: []; params?: {} }
    'features.store': { paramsTuple?: []; params?: {} }
    'features.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'auth.callback': { paramsTuple?: []; params?: {} }
    'logout.global': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'workspace': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'users': { paramsTuple?: []; params?: {} }
    'roles': { paramsTuple?: []; params?: {} }
    'teams': { paramsTuple?: []; params?: {} }
    'features': { paramsTuple?: []; params?: {} }
    'settings': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'auth.callback': { paramsTuple?: []; params?: {} }
    'logout.global': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'workspace': { paramsTuple?: []; params?: {} }
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
    'roles.store': { paramsTuple?: []; params?: {} }
    'teams.store': { paramsTuple?: []; params?: {} }
    'features.store': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'profile.update': { paramsTuple?: []; params?: {} }
    'users.updateRole': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.updateFeatures': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'roles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teams.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}