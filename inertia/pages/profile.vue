<script setup lang="ts">
import { Head, useForm, usePage } from '@inertiajs/vue3'
import { Mail, MapPin, Phone } from '@lucide/vue'
import { computed, ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Field, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

const page = usePage()
const user = page.props.user as {
  id: number
  fullName: string
  email: string
  initials: string
  avatarUrl?: string | null
  coverUrl?: string | null
  createdAt: string
}

const form = useForm({
  fullName: user.fullName ?? '',
  email: user.email,
  avatar: null as File | null,
  cover: null as File | null,
})

const avatarInput = ref<HTMLInputElement | null>(null)
const coverInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(user.avatarUrl ?? null)
const coverPreview = ref<string | null>(user.coverUrl ?? null)

const avatarSrc = computed(() => avatarPreview.value || '/images/default-avatar.svg')
const coverSrc = computed(() => coverPreview.value || '/images/default-cover.svg')

function chooseAvatar() {
  avatarInput.value?.click()
}

function chooseCover() {
  coverInput.value?.click()
}

function onAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  form.avatar = file
  avatarPreview.value = URL.createObjectURL(file)
  submit()
}

function onCoverChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  form.cover = file
  coverPreview.value = URL.createObjectURL(file)
  submit()
}

function submit() {
  form.patch('/profile', {
    forceFormData: true,
    preserveScroll: true,
    onSuccess: () => {
      form.avatar = null
      form.cover = null
    },
  })
}

const activities = [
  { text: 'Atualizou as informações do perfil', time: 'agora há pouco' },
  { text: 'Acessou o módulo de Usuários', time: 'há 2 horas' },
  { text: 'Editou permissões de uma role', time: 'ontem' },
]
</script>

<template>
  <Head title="Perfil" />

  <div class="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight text-foreground">Perfil</h1>
      <p class="text-sm text-muted-foreground">Gerencie suas informações pessoais.</p>
    </div>

    <section class="relative rounded-2xl border border-border bg-card shadow-sm">
      <div class="relative h-36 overflow-hidden rounded-t-2xl">
        <img :src="coverSrc" alt="Capa do perfil" class="h-full w-full object-cover" />
        <div class="absolute inset-0 bg-black/20" />
      </div>

      <div class="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
        <div class="flex items-end gap-4">
          <Avatar class="-mt-18 size-24 rounded-2xl border-0 after:border-0">
            <AvatarImage :src="avatarSrc" alt="Avatar do usuário" />
            <AvatarFallback class="text-2xl font-semibold">{{ user.initials }}</AvatarFallback>
          </Avatar>
          <div class="pb-2">
            <h2 class="text-3xl font-semibold text-foreground">
              {{ user.fullName || user.email }}
            </h2>
            <p class="text-sm text-muted-foreground">{{ user.email }}</p>
          </div>
        </div>

        <div class="flex flex-col gap-2 md:items-end">
          <div class="flex flex-wrap gap-2 md:justify-end">
            <Button
              type="button"
              variant="outline"
              class="min-w-32 justify-center"
              @click="chooseCover"
            >
              Alterar capa
            </Button>
            <Button
              type="button"
              variant="outline"
              class="min-w-32 justify-center"
              @click="chooseAvatar"
            >
              Alterar avatar
            </Button>
          </div>
          <p class="text-xs text-muted-foreground md:text-right">
            As imagens são salvas automaticamente ao selecionar.
          </p>
        </div>

        <input
          ref="coverInput"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          class="hidden"
          @change="onCoverChange"
        />
        <input
          ref="avatarInput"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          class="hidden"
          @change="onAvatarChange"
        />
      </div>

      <div class="border-t border-border px-6 pb-6 pt-4">
        <div class="inline-flex rounded-lg border border-border bg-muted/40 p-1 text-sm">
          <button type="button" class="rounded-md bg-background px-3 py-1.5 text-foreground">
            Visão geral
          </button>
          <button
            type="button"
            class="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            Configurações da conta
          </button>
          <button
            type="button"
            class="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            Faturamento
          </button>
        </div>

        <div class="mt-4 grid gap-4 lg:grid-cols-12">
          <Card class="border-border bg-card lg:col-span-3">
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-3 text-sm text-foreground/90">
                <li class="flex items-center gap-2">
                  <Mail class="size-4 text-[#8f86ff]" />
                  {{ user.email }}
                </li>
                <li class="flex items-center gap-2">
                  <Phone class="size-4 text-[#6fc8ff]" />
                  +55 (11) 90000-0000
                </li>
                <li class="flex items-center gap-2">
                  <MapPin class="size-4 text-[#7fe8bd]" />
                  São Paulo, BR
                </li>
              </ul>
            </CardContent>
          </Card>

          <div class="space-y-4 lg:col-span-9">
            <Card class="border-border bg-card">
              <CardHeader>
                <CardTitle>Informações pessoais</CardTitle>
                <CardDescription>Atualize seu nome e e-mail.</CardDescription>
              </CardHeader>
              <CardContent>
                <form class="flex flex-col gap-4" @submit.prevent="submit">
                  <Field>
                    <FieldLabel>Nome completo</FieldLabel>
                    <Input
                      v-model="form.fullName"
                      type="text"
                      placeholder="Seu nome"
                      class="border-input bg-background"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>E-mail</FieldLabel>
                    <Input
                      v-model="form.email"
                      type="email"
                      placeholder="seu@email.com"
                      disabled
                      class="border-input bg-background"
                    />
                  </Field>

                  <div class="flex justify-end">
                    <Button type="submit" :disabled="form.processing">Salvar</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card class="border-border bg-card">
              <CardHeader>
                <CardTitle>Atividade</CardTitle>
                <CardDescription>Ações recentes realizadas por você.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul class="space-y-4">
                  <li
                    v-for="(activity, index) in activities"
                    :key="activity.text + index"
                    class="flex items-start gap-3 border-b border-border pb-3 last:border-0"
                  >
                    <span class="mt-2 inline-block size-2 rounded-full bg-primary" />
                    <div>
                      <p class="text-sm text-foreground">{{ activity.text }}</p>
                      <p class="text-xs text-muted-foreground">{{ activity.time }}</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
