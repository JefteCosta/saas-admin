<script setup lang="ts">
import type { LucideIcon } from '@lucide/vue'
import { Link } from '@inertiajs/vue3'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'

defineProps<{
  label: string
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>{{ label }}</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in items" :key="item.title">
        <SidebarMenuButton as-child :tooltip="item.title">
          <Link :href="item.url">
            <component :is="item.icon" v-if="item.icon" />
            <span>{{ item.title }}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
