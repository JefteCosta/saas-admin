<script setup lang="ts">
import AppSidebar from '~/components/app_sidebar.vue'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import SiteHeader from '~/components/site_header.vue'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      <div class="flex flex-1 flex-col gap-4 p-4 pt-4">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
