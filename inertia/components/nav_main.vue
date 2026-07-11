<script setup lang="ts">
import type { LucideIcon } from '@lucide/vue'
import { ChevronRight } from '@lucide/vue'
import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
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
  iconClass?: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const props = defineProps<{
  moduleTitle: string
  moduleIcon?: LucideIcon
  moduleIconClass?: string
  groups: NavGroup[]
}>()

const page = usePage()
const currentPath = computed(() => page.url)

function isRouteActive(url: string) {
  return currentPath.value === url || currentPath.value.startsWith(`${url}/`)
}

function isGroupActive(group: NavGroup) {
  return group.items.some((item) => isRouteActive(item.url))
}

function isModuleActive(groups: NavGroup[]) {
  return groups.some((group) => isGroupActive(group))
}
</script>

<template>
  <SidebarGroup class="px-2 py-1 group-data-[collapsible=icon]:px-0">
    <SidebarGroupLabel class="mb-1 px-2 text-[10px] font-semibold tracking-[0.18em] text-sidebar-foreground/65 transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
      <component
        :is="moduleIcon"
        v-if="moduleIcon"
        class="mr-1 size-3 opacity-90 transition-all duration-200 group-data-[collapsible=icon]:mr-0"
        :class="props.moduleIconClass"
      />
      <span class="group-data-[collapsible=icon]:hidden">{{ moduleTitle }}</span>
      <span
        v-if="isModuleActive(groups)"
        class="ml-auto size-1.5 rounded-full bg-sidebar-primary group-data-[collapsible=icon]:hidden"
      />
    </SidebarGroupLabel>
    <SidebarMenu class="gap-1 group-data-[collapsible=icon]:items-center">
      <template v-for="group in groups" :key="group.title">
        <!-- Se o grupo tem um único item, renderiza direto -->
        <SidebarMenuItem v-if="group.items.length === 1">
          <SidebarMenuButton
            as-child
            class="h-8 rounded-md text-[14px] text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
            :tooltip="group.items[0].title"
            :is-active="isRouteActive(group.items[0].url)"
          >
            <a :href="group.items[0].url">
              <component
                :is="group.items[0].icon"
                v-if="group.items[0].icon"
                :class="[
                  group.items[0].iconClass,
                  isRouteActive(group.items[0].url) ? 'text-sidebar-primary' : '',
                  'group-data-[collapsible=icon]:mx-auto',
                ]"
              />
              <span class="group-data-[collapsible=icon]:hidden">{{ group.items[0].title }}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <!-- Se o grupo tem múltiplos items, renderiza como collapsible -->
        <Collapsible v-else as-child :default-open="isGroupActive(group)" class="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton
                :tooltip="group.title"
                class="h-8 rounded-md text-[14px] text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
              >
                <component
                  :is="group.items[0]?.icon"
                  v-if="group.items[0]?.icon"
                  :class="[group.items[0]?.iconClass, 'group-data-[collapsible=icon]:mx-auto']"
                />
                <span class="group-data-[collapsible=icon]:hidden">{{ group.title }}</span>
                <ChevronRight
                  class="ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub class="ml-2 mt-1 border-l border-sidebar-border pl-2">
                <SidebarMenuSubItem v-for="item in group.items" :key="item.title">
                  <SidebarMenuSubButton
                    as-child
                    :is-active="isRouteActive(item.url)"
                    class="h-8 rounded-md text-[13px] text-sidebar-foreground/85 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  >
                    <a :href="item.url">
                      <component :is="item.icon" v-if="item.icon" :class="[item.iconClass, isRouteActive(item.url) ? 'text-sidebar-primary' : '']" />
                      <span class="group-data-[collapsible=icon]:hidden">{{ item.title }}</span>
                    </a>
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
