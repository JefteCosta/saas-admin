<script setup lang="ts">
import type { SidebarProps } from '~/components/ui/sidebar'
import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import {
  Home,
  Layers,
  Pencil,
  Plus,
  Settings,
  Shield,
  User,
  Users,
  UsersRound,
} from '@lucide/vue'
import type { LucideIcon } from '@lucide/vue'

import NavMain from '~/components/nav_main.vue'
import NavUser from '~/components/nav_user.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

// Mapa de ícones Lucide por nome
const iconMap: Record<string, LucideIcon> = {
  Home,
  User,
  Users,
  UsersRound,
  Shield,
  Layers,
  Settings,
  Plus,
  Pencil,
}

const page = usePage()

const user = computed(() => {
  const u = page.props.user as { fullName: string; email: string; initials: string } | undefined
  if (!u) return { name: '', email: '', avatar: '' }
  return {
    name: u.fullName || u.email,
    email: u.email,
    avatar: '',
  }
})

interface MenuItem {
  slug: string
  name: string
  icon: string | null
  route: string
}

interface MenuGroup {
  group: string
  items: MenuItem[]
}

const navItems = computed(() => {
  const menu = (page.props.menu || []) as MenuGroup[]
  return menu.map((group) => ({
    title: group.group,
    items: group.items.map((item) => ({
      title: item.name,
      url: item.route,
      icon: item.icon ? iconMap[item.icon] : undefined,
    })),
  }))
})
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <div class="flex items-center gap-2 px-4 py-2">
        <div class="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Layers class="size-4" />
        </div>
        <span class="font-semibold text-sm">SaaS Admin</span>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <NavMain v-for="group in navItems" :key="group.title" :label="group.title" :items="group.items" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
