import '@adonisjs/inertia/types'

import type { VNodeProps, AllowedComponentProps, ComponentInstance } from 'vue'

type ExtractProps<T> = Omit<
  ComponentInstance<T>['$props'],
  keyof VNodeProps | keyof AllowedComponentProps
>

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'admin/features': ExtractProps<(typeof import('../../inertia/pages/admin/features.vue'))['default']>
    'admin/roles': ExtractProps<(typeof import('../../inertia/pages/admin/roles.vue'))['default']>
    'admin/teams': ExtractProps<(typeof import('../../inertia/pages/admin/teams.vue'))['default']>
    'admin/users': ExtractProps<(typeof import('../../inertia/pages/admin/users.vue'))['default']>
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.vue'))['default']>
    'auth/register': ExtractProps<(typeof import('../../inertia/pages/auth/register.vue'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.vue'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.vue'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.vue'))['default']>
    'placeholder': ExtractProps<(typeof import('../../inertia/pages/placeholder.vue'))['default']>
    'profile': ExtractProps<(typeof import('../../inertia/pages/profile.vue'))['default']>
    'workspace': ExtractProps<(typeof import('../../inertia/pages/workspace.vue'))['default']>
  }
}
