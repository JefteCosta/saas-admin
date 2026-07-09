import { defineConfig, drivers, store } from '@adonisjs/cache'
import app from '@adonisjs/core/services/app'
import env from '#start/env'

const cacheConfig = defineConfig({
  default: env.get('CACHE_STORE'),

  stores: {
    memoryOnly: store().useL1Layer(drivers.memory()),

    disk: store()
      .useL1Layer(drivers.memory())
      .useL2Layer(
        drivers.file({
          directory: app.tmpPath('cache'),
        })
      ),
    database: store()
      .useL1Layer(drivers.memory())
      .useL2Layer(
        drivers.database({
          connectionName: 'sqlite',
          autoCreateTable: false,
          tableName: 'cache',
        })
      ),
    redis: store()
      .useL1Layer(drivers.memory())
      .useL2Layer(
        drivers.redis({
          connectionName: 'main',
        })
      ),
  },
})

export default cacheConfig

declare module '@adonisjs/cache/types' {
  interface CacheStores extends InferStores<typeof cacheConfig> {}
}
