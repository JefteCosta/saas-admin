<script setup lang="ts">
import { Head, useForm, usePage } from '@inertiajs/vue3'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Field, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Separator } from '~/components/ui/separator'

const page = usePage()
const user = page.props.user as {
  id: number
  fullName: string
  email: string
  initials: string
  createdAt: string
}

const form = useForm({
  fullName: user.fullName ?? '',
  email: user.email,
})

function submit() {
  form.patch('/profile')
}
</script>

<template>
  <Head title="Perfil" />

  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-4">
      <Avatar class="size-16">
        <AvatarFallback class="text-lg">{{ user.initials }}</AvatarFallback>
      </Avatar>
      <div>
        <h1 class="text-2xl font-semibold">{{ user.fullName || user.email }}</h1>
        <p class="text-sm text-muted-foreground">{{ user.email }}</p>
      </div>
    </div>

    <Separator />

    <Card>
      <CardHeader>
        <CardTitle>Informações pessoais</CardTitle>
        <CardDescription>Atualize seu nome e e-mail.</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-4" @submit.prevent="submit">
          <Field>
            <FieldLabel>Nome completo</FieldLabel>
            <Input v-model="form.fullName" type="text" placeholder="Seu nome" />
          </Field>

          <Field>
            <FieldLabel>E-mail</FieldLabel>
            <Input v-model="form.email" type="email" placeholder="seu@email.com" disabled />
          </Field>

          <div class="flex justify-end">
            <Button type="submit" :disabled="form.processing">
              Salvar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Informações da conta</CardTitle>
        <CardDescription>Dados da sua conta.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-2 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Membro desde</span>
            <span>{{ new Date(user.createdAt).toLocaleDateString('pt-BR') }}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
