<script setup lang="ts">
import type { LucideIcon } from '@lucide/vue'
import { ChevronRight } from '@lucide/vue'
import { Link, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '~/components/ui/sidebar'

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const props = defineProps<{
  moduleTitle: string
  moduleIcon?: LucideIcon
  groups: NavGroup[]
}>()

const page = usePage()
const currentPath = computed(() => page.url)
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>
      <component :is="moduleIcon" v-if="moduleIcon" class="mr-1 size-3.5" />
      {{ moduleTitle }}
    </SidebarGroupLabel>
    <SidebarMenu>
      <template v-for="group in groups" :key="group.title">
        <!-- Se o grupo tem um único item, renderiza direto -->
        <SidebarMenuItem v-if="group.items.length === 1">
          <SidebarMenuButton
            as-child
            :tooltip="group.items[0].title"
            :is-active="currentPath === group.items[0].url"
          >
            <Link :href="group.items[0].url">
              <component :is="group.items[0].icon" v-if="group.items[0].icon" />
              <span>{{ group.items[0].title }}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <!-- Se o grupo tem múltiplos items, renderiza como collapsible -->
        <Collapsible v-else as-child :default-open="true" class="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton :tooltip="group.title">
                <component :is="group.items[0]?.icon" v-if="group.items[0]?.icon" />
                <span>{{ group.title }}</span>
                <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem v-for="item in group.items" :key="item.title">
                  <SidebarMenuSubButton
                    as-child
                    :is-active="currentPath === item.url"
                  >
                    <Link :href="item.url">
                      <span>{{ item.title }}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </template>
    </SidebarMenu>
  </SidebarGroup>
</template>
