<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3'
import { Bell, LogOut, Moon, Search, Settings, Sun, User } from '@lucide/vue'
import { computed } from 'vue'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useTheme } from '~/composables/use_theme'

const page = usePage()
const user = page.props.user as
  | {
      fullName: string
      email: string
      initials: string
      avatarUrl?: string | null
    }
  | undefined

const userAvatar = computed(() => user?.avatarUrl || '/images/default-avatar.svg')

const { theme, toggleTheme } = useTheme()

const firstName = computed(() => {
  if (!user?.fullName) return 'Admin'
  return user.fullName.split(' ')[0]
})

function logout() {
  router.post('/logout')
}
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/90 px-3 text-foreground md:px-4 backdrop-blur"
  >
    <div class="flex w-full items-center gap-2 md:gap-3">
      <SidebarTrigger
        class="rounded-md border border-border bg-card text-foreground hover:bg-accent"
      />
      <Separator
        orientation="vertical"
        class="mx-1 hidden data-[orientation=vertical]:h-10 md:block"
      />

      <p class="hidden text-sm font-medium text-foreground md:block">Hello, {{ firstName }}</p>

      <div class="ml-auto flex items-center gap-2">
        <div class="relative hidden md:block">
          <Search
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            placeholder="Search Everything..."
            class="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          class="size-8 rounded-md border border-border bg-card text-foreground hover:bg-accent"
        >
          <Bell class="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          class="size-8 rounded-md border border-border bg-card text-foreground hover:bg-accent"
          :aria-label="theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'"
          @click="toggleTheme"
        >
          <Sun class="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon
            class="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
        </Button>

        <DropdownMenu v-if="user">
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="sm"
              class="h-9 rounded-md border border-border bg-card text-foreground hover:bg-accent"
            >
              <Avatar class="size-7">
                <AvatarImage :src="userAvatar" :alt="user.fullName || user.email" />
                <AvatarFallback class="text-xs">{{ user.initials }}</AvatarFallback>
              </Avatar>
              <span class="hidden max-w-32 truncate sm:inline text-sm font-medium">
                {{ user.fullName || user.email }}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuLabel class="font-normal">
              <div class="flex flex-col gap-1">
                <p class="text-sm font-medium leading-none">{{ user.fullName }}</p>
                <p class="text-xs text-muted-foreground leading-none">{{ user.email }}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem @click="router.get('/profile')">
                <User class="mr-2 size-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings class="mr-2 size-4" />
                Configurações
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="logout">
              <LogOut class="mr-2 size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>
