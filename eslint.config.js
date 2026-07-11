import { configApp } from '@adonisjs/eslint-config'
import { vue } from '@adonisjs/eslint-config/vue'

export default configApp(
  ...vue,
  {
    name: 'inertia-vue ts overrides',
    files: ['inertia/**/*.ts'],
    rules: {
      'vue/component-api-style': 'off',
    },
  },
  {
    name: 'shadcn-vue component naming',
    files: ['inertia/components/ui/**/*.{vue,ts}'],
    rules: {
      '@unicorn/filename-case': 'off',
    },
  },
  {
    name: 'inertia composables naming',
    files: ['inertia/composables/**/*.ts'],
    rules: {
      '@unicorn/filename-case': 'off',
    },
  },
  {
    name: 'nav main inertia link override',
    files: ['inertia/components/nav_main.vue'],
    rules: {
      '@adonisjs/prefer-adonisjs-inertia-link': 'off',
    },
  }
)
