<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3'
import { LogOut, Moon, Settings, Sun, User } from '@lucide/vue'

import { Avatar, AvatarFallback } from '~/components/ui/avatar'
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { useTheme } from '~/composables/use_theme'

const page = usePage()
const user = page.props.user as { fullName: string; email: string; initials: string } | undefined

const { theme, toggleTheme } = useTheme()

function logout() {
  router.post('/logout')
}
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b"
  >
    <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem class="hidden md:block">
            <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div class="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          class="size-8"
          @click="toggleTheme"
          :aria-label="theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'"
        >
          <Sun class="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon class="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu v-if="user">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="sm" class="flex items-center gap-2">
              <Avatar class="size-7">
                <AvatarFallback class="text-xs">{{ user.initials }}</AvatarFallback>
              </Avatar>
              <span class="hidden sm:inline text-sm font-medium">{{ user.fullName || user.email }}</span>
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
