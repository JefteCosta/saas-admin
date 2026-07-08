<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Field, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'

const props = defineProps<{
  roles: {
    id: number
    slug: string
    name: string
    description: string | null
    featureIds: number[]
  }[]
  features: { id: number; slug: string; name: string; group: string | null }[]
}>()

// Criar role
const showCreate = ref(false)
const createForm = useForm({
  name: '',
  slug: '',
  description: '',
})

function createRole() {
  createForm.post('/roles', {
    preserveScroll: true,
    onSuccess: () => {
      showCreate.value = false
      createForm.reset()
    },
  })
}

// Editar permissões
const editingRole = ref<number | null>(null)
const selectedFeatures = ref<number[]>([])

function startEdit(role: typeof props.roles[0]) {
  editingRole.value = role.id
  selectedFeatures.value = [...role.featureIds]
}

function cancelEdit() {
  editingRole.value = null
  selectedFeatures.value = []
}

function toggleFeature(featureId: number) {
  const idx = selectedFeatures.value.indexOf(featureId)
  if (idx >= 0) {
    selectedFeatures.value.splice(idx, 1)
  } else {
    selectedFeatures.value.push(featureId)
  }
}

function saveFeatures(roleId: number) {
  router.patch(`/roles/${roleId}/features`, { featureIds: selectedFeatures.value }, {
    preserveScroll: true,
    onSuccess: () => cancelEdit(),
  })
}

function deleteRole(roleId: number) {
  if (confirm('Tem certeza que deseja remover esta role?')) {
    router.delete(`/roles/${roleId}`, { preserveScroll: true })
  }
}

// Agrupar features por grupo
const featureGroups = props.features.reduce((acc, f) => {
  const group = f.group || 'Geral'
  if (!acc[group]) acc[group] = []
  acc[group].push(f)
  return acc
}, {} as Record<string, typeof props.features>)
</script>

<template>
  <Head title="Papéis" />

  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Papéis e Permissões</h1>
      <Dialog v-model:open="showCreate">
        <DialogTrigger as-child>
          <Button>Nova role</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar role</DialogTitle>
          </DialogHeader>
          <form class="flex flex-col gap-4" @submit.prevent="createRole">
            <Field>
              <FieldLabel>Nome</FieldLabel>
              <Input v-model="createForm.name" placeholder="Marketing" />
            </Field>
            <Field>
              <FieldLabel>Slug</FieldLabel>
              <Input v-model="createForm.slug" placeholder="marketing" />
            </Field>
            <Field>
              <FieldLabel>Descrição</FieldLabel>
              <Input v-model="createForm.description" placeholder="Acesso ao módulo de marketing" />
            </Field>
            <DialogFooter>
              <Button type="submit" :disabled="createForm.processing">Criar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <div class="grid gap-4">
      <Card v-for="role in roles" :key="role.id">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="flex items-center gap-2">
                {{ role.name }}
                <Badge variant="secondary">{{ role.slug }}</Badge>
              </CardTitle>
              <CardDescription>{{ role.description || 'Sem descrição' }}</CardDescription>
            </div>
            <div v-if="role.slug !== 'owner'" class="flex items-center gap-2">
              <Button
                v-if="editingRole !== role.id"
                variant="outline"
                size="sm"
                @click="startEdit(role)"
              >
                Editar permissões
              </Button>
              <div v-else class="flex gap-2">
                <Button size="sm" @click="saveFeatures(role.id)">Salvar</Button>
                <Button variant="ghost" size="sm" @click="cancelEdit">Cancelar</Button>
              </div>
              <Button
                v-if="!['owner', 'admin', 'member', 'viewer'].includes(role.slug)"
                variant="ghost"
                size="sm"
                @click="deleteRole(role.id)"
              >
                Remover
              </Button>
            </div>
            <Badge v-else>Acesso irrestrito</Badge>
          </div>
        </CardHeader>
        <CardContent v-if="editingRole === role.id">
          <div class="flex flex-col gap-4">
            <div v-for="(groupFeatures, groupName) in featureGroups" :key="groupName">
              <p class="text-sm font-medium text-muted-foreground mb-2">{{ groupName }}</p>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="feature in groupFeatures"
                  :key="feature.id"
                  :variant="selectedFeatures.includes(feature.id) ? 'default' : 'outline'"
                  class="cursor-pointer"
                  @click="toggleFeature(feature.id)"
                >
                  {{ feature.name }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <CardContent v-else-if="role.slug !== 'owner'">
          <div class="flex flex-wrap gap-1">
            <Badge v-for="fId in role.featureIds" :key="fId" variant="secondary">
              {{ features.find(f => f.id === fId)?.name || fId }}
            </Badge>
            <span v-if="role.featureIds.length === 0" class="text-sm text-muted-foreground">
              Nenhuma feature atribuída
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
