<script setup lang="ts">
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from '@lucide/vue'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar'

const props = defineProps<{
  user: {
    name: string
    email: string
    avatar: string
    initials: string
  }
}>()

const { isMobile } = useSidebar()
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="h-11 rounded-md border border-sidebar-border bg-sidebar-accent/40 text-sidebar-foreground transition-all duration-200 data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
          >
            <Avatar class="h-8 w-8 rounded-lg transition-transform duration-200 group-data-[collapsible=icon]:scale-95">
              <AvatarImage :src="user.avatar || '/images/default-avatar.svg'" :alt="user.name" />
              <AvatarFallback class="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">{{ user.initials }}</AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight transition-opacity duration-200 group-data-[collapsible=icon]:hidden">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="truncate text-xs text-sidebar-foreground/70">{{ user.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="user.avatar || '/images/default-avatar.svg'" :alt="user.name" />
                <AvatarFallback class="rounded-lg">{{ user.initials }}</AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user.name }}</span>
                <span class="truncate text-xs">{{ user.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Sparkles />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
