<script lang="ts">
import Auth from '~/layouts/auth.vue'
export default {
  layout: Auth,
}
</script>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Building2 } from '@lucide/vue'

const props = defineProps<{
  companies: { id: number; name: string; slug: string }[]
  domain: string
  port: number
}>()

function goToCompany(slug: string) {
  const port = props.port !== 80 && props.port !== 443 ? `:${props.port}` : ''
  window.location.href = `http://${slug}.${props.domain}${port}/`
}
</script>

<template>
  <Head title="Escolher empresa" />

  <div class="flex flex-col gap-6 w-full max-w-md">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Escolha uma empresa</h1>
      <p class="text-muted-foreground text-sm mt-1">
        Selecione a empresa que deseja acessar.
      </p>
    </div>

    <div class="flex flex-col gap-3">
      <Card
        v-for="company in companies"
        :key="company.id"
        class="cursor-pointer hover:bg-accent transition-colors"
        @click="goToCompany(company.slug)"
      >
        <CardHeader class="p-4">
          <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Building2 class="size-5" />
            </div>
            <div>
              <CardTitle class="text-base">{{ company.name }}</CardTitle>
              <CardDescription class="text-xs">{{ company.slug }}.{{ domain }}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <p v-if="companies.length === 0" class="text-center text-sm text-muted-foreground py-4">
        Nenhuma empresa encontrada.
      </p>
    </div>
  </div>
</template>
