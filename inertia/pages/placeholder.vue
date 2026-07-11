<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const props = defineProps<{
  featureName: string
  featureDescription?: string
}>()
</script>

<template>
  <Head :title="featureName" />

  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-semibold">{{ featureName }}</h1>

    <Card>
      <CardHeader>
        <CardTitle>Em construção</CardTitle>
        <CardDescription>{{
          featureDescription || 'Esta funcionalidade será implementada em breve.'
        }}</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          Esta página é um placeholder. O módulo de <strong>{{ featureName }}</strong> será
          implementado nas próximas iterações.
        </p>
      </CardContent>
    </Card>
  </div>
</template>
