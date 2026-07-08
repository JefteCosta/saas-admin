<script setup lang="ts">
import type { SidebarProps } from '~/components/ui/sidebar'
import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import {
  Building2,
  Home,
  Layers,
  LayoutDashboard,
  MapPin,
  Megaphone,
  Pencil,
  Plus,
  Settings,
  Shield,
  User,
  UserPlus,
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
  Building2,
  Home,
  Layers,
  LayoutDashboard,
  MapPin,
  Megaphone,
  Pencil,
  Plus,
  Settings,
  Shield,
  User,
  UserPlus,
  Users,
  UsersRound,
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

interface MenuModule {
  module: string
  moduleIcon: string | null
  groups: MenuGroup[]
}

const navModules = computed(() => {
  const menu = (page.props.menu || []) as MenuModule[]
  return menu.map((mod) => ({
    title: mod.module,
    icon: mod.moduleIcon ? iconMap[mod.moduleIcon] : undefined,
    groups: mod.groups.map((group) => ({
      title: group.group,
      items: group.items.map((item) => ({
        title: item.name,
        url: item.route,
        icon: item.icon ? iconMap[item.icon] : undefined,
      })),
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
      <NavMain
        v-for="mod in navModules"
        :key="mod.title"
        :module-title="mod.title"
        :module-icon="mod.icon"
        :groups="mod.groups"
      />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
