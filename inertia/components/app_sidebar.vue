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
  const u = page.props.user as
    | { fullName: string; email: string; initials: string; avatarUrl?: string | null }
    | undefined
  if (!u) return { name: '', email: '', avatar: '/images/default-avatar.svg', initials: 'NA' }
  return {
    name: u.fullName || u.email,
    email: u.email,
    avatar: u.avatarUrl || '/images/default-avatar.svg',
    initials: u.initials,
  }
})

interface MenuItem {
  slug: string
  name: string
  icon: string | null
  route: string
  iconClass?: string
}

interface MenuGroup {
  group: string
  items: MenuItem[]
}

interface MenuModule {
  module: string
  moduleIcon: string | null
  moduleIconClass?: string
  groups: MenuGroup[]
}

const moduleColorMap: Record<string, string> = {
  Plataforma: 'text-[#8f86ff]',
  Pessoas: 'text-[#6fc8ff]',
  Empresa: 'text-[#7fe8bd]',
  Marketing: 'text-[#ffb067]',
  Configurações: 'text-[#ff8ec7]',
  SaaS: 'text-[#bca8ff]',
}

const navModules = computed(() => {
  const menu = (page.props.menu || []) as MenuModule[]
  return menu.map((mod) => ({
    title: mod.module,
    icon: mod.moduleIcon ? iconMap[mod.moduleIcon] : undefined,
    moduleIconClass: moduleColorMap[mod.module] || 'text-[#9ea4cf]',
    groups: mod.groups.map((group) => ({
      title: group.group,
      items: group.items.map((item) => ({
        title: item.name,
        url: item.route,
        icon: item.icon ? iconMap[item.icon] : undefined,
        iconClass: moduleColorMap[mod.module] || 'text-[#9ea4cf]',
      })),
    })),
  }))
})
</script>

<template>
  <Sidebar
    v-bind="props"
    class="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
  >
    <SidebarHeader class="px-2 py-2">
      <div class="flex items-center gap-2 rounded-md px-2 py-1.5 transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <div
          class="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground transition-transform duration-200 group-data-[collapsible=icon]:scale-95"
        >
          <Layers class="size-3.5" />
        </div>
        <span class="text-[15px] font-semibold tracking-tight text-sidebar-foreground transition-opacity duration-200 group-data-[collapsible=icon]:hidden">CoreAdmin</span>
      </div>
    </SidebarHeader>
    <SidebarContent class="px-2 pb-3 group-data-[collapsible=icon]:px-1">
      <NavMain
        v-for="mod in navModules"
        :key="mod.title"
        :module-title="mod.title"
        :module-icon="mod.icon"
        :module-icon-class="mod.moduleIconClass"
        :groups="mod.groups"
      />
    </SidebarContent>
    <SidebarFooter class="border-t border-sidebar-border bg-sidebar p-2">
      <NavUser :user="user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
