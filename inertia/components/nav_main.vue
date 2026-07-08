<script setup lang="ts">
import type { LucideIcon } from '@lucide/vue'
import { Link, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'

const props = defineProps<{
  label: string
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}>()

const page = usePage()
const currentPath = computed(() => page.url)
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>{{ label }}</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in items" :key="item.title">
        <SidebarMenuButton
          as-child
          :tooltip="item.title"
          :is-active="currentPath === item.url"
        >
          <Link :href="item.url">
            <component :is="item.icon" v-if="item.icon" />
            <span>{{ item.title }}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
