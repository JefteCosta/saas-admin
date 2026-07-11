<script setup lang="ts">
import AppSidebar from '~/components/app_sidebar.vue'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import SiteFooter from '~/components/site_footer.vue'
import SiteHeader from '~/components/site_header.vue'
import { Toaster } from 'vue-sonner'
import { useFlashToast } from '~/composables/use_flash_toast'

useFlashToast()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="bg-background">
      <SiteHeader />
      <div class="flex min-h-[calc(100svh-4rem)] flex-1 flex-col">
        <div class="flex-1">
          <slot />
        </div>
        <SiteFooter />
      </div>
    </SidebarInset>
  </SidebarProvider>
  <Toaster position="top-right" :duration="4000" rich-colors />
</template>
