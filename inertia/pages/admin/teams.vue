<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Field, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

const props = defineProps<{
  teams: {
    id: number
    name: string
    slug: string
    role: { id: number; slug: string; name: string }
    members: { id: number; fullName: string | null; email: string }[]
  }[]
  roles: { id: number; slug: string; name: string }[]
  users: { id: number; fullName: string | null; email: string }[]
}>()

const showCreate = ref(false)
const form = useForm({
  name: '',
  slug: '',
  roleId: '',
  memberIds: [] as number[],
})

function createTeam() {
  form.transform((data) => ({
    ...data,
    roleId: Number(data.roleId),
  })).post('/teams', {
    preserveScroll: true,
    onSuccess: () => {
      showCreate.value = false
      form.reset()
    },
  })
}

function deleteTeam(id: number) {
  if (confirm('Tem certeza que deseja remover este time?')) {
    router.delete(`/teams/${id}`, { preserveScroll: true })
  }
}

function toggleMember(userId: number) {
  const idx = form.memberIds.indexOf(userId)
  if (idx >= 0) {
    form.memberIds.splice(idx, 1)
  } else {
    form.memberIds.push(userId)
  }
}
</script>

<template>
  <Head title="Times" />

  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Times</h1>
      <Dialog v-model:open="showCreate">
        <DialogTrigger as-child>
          <Button>Novo time</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar time</DialogTitle>
          </DialogHeader>
          <form class="flex flex-col gap-4" @submit.prevent="createTeam">
            <Field>
              <FieldLabel>Nome</FieldLabel>
              <Input v-model="form.name" placeholder="Nome do time" />
            </Field>
            <Field>
              <FieldLabel>Slug</FieldLabel>
              <Input v-model="form.slug" placeholder="slug-do-time" />
            </Field>
            <Field>
              <FieldLabel>Role do time</FieldLabel>
              <Select v-model="form.roleId">
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="role in roles" :key="role.id" :value="String(role.id)">
                    {{ role.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Membros</FieldLabel>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="user in users"
                  :key="user.id"
                  :variant="form.memberIds.includes(user.id) ? 'default' : 'outline'"
                  class="cursor-pointer"
                  @click="toggleMember(user.id)"
                >
                  {{ user.fullName || user.email }}
                </Badge>
              </div>
            </Field>
            <DialogFooter>
              <Button type="submit" :disabled="form.processing">Criar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <div class="grid gap-4">
      <Card v-for="team in teams" :key="team.id">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center gap-2">
              {{ team.name }}
              <Badge variant="secondary">{{ team.role.name }}</Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" @click="deleteTeam(team.id)">Remover</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-1">
            <Badge v-for="member in team.members" :key="member.id" variant="outline">
              {{ member.fullName || member.email }}
            </Badge>
            <span v-if="team.members.length === 0" class="text-sm text-muted-foreground">
              Nenhum membro
            </span>
          </div>
        </CardContent>
      </Card>

      <Card v-if="teams.length === 0">
        <CardContent class="pt-6">
          <p class="text-sm text-muted-foreground text-center">Nenhum time criado ainda.</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
