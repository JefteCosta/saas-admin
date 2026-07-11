<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-border/70 bg-background/90 px-4 py-3 text-xs text-muted-foreground backdrop-blur md:px-6">
    <div class="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-1 sm:flex-row">
      <p>© {{ year }} CoreAdmin. Todos os direitos reservados.</p>
      <p class="text-[11px] text-muted-foreground/90">Feito com AdonisJS, Inertia, Vue e shadcn-vue.</p>
    </div>
  </footer>
</template>
