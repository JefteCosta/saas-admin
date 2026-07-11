<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Field, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

const props = defineProps<{
  features: {
    id: number
    slug: string
    name: string
    description: string | null
    icon: string | null
    route: string
    moduleName: string
    moduleId: number | null
    featureGroupId: number | null
    featureGroupName: string
    position: number
    isMenuItem: boolean
    isActive: boolean
  }[]
  modules: { id: number; slug: string; name: string }[]
  featureGroups: { id: number; slug: string; name: string; moduleId: number }[]
}>()

const showCreate = ref(false)
const editingId = ref<number | null>(null)

const form = useForm({
  slug: '',
  name: '',
  description: '',
  icon: '',
  route: '',
  moduleId: '' as string | number,
  featureGroupId: '' as string | number,
  position: 0,
  isMenuItem: true,
  isActive: true,
})

function createFeature() {
  form.post('/features', {
    preserveScroll: true,
    onSuccess: () => {
      showCreate.value = false
      form.reset()
    },
  })
}

function startEdit(feature: (typeof props.features)[0]) {
  editingId.value = feature.id
  form.slug = feature.slug
  form.name = feature.name
  form.description = feature.description || ''
  form.icon = feature.icon || ''
  form.route = feature.route
  form.moduleId = feature.moduleId || ''
  form.featureGroupId = feature.featureGroupId || ''
  form.position = feature.position
  form.isMenuItem = feature.isMenuItem
  form.isActive = feature.isActive
}

function saveEdit() {
  form.patch(`/features/${editingId.value}`, {
    preserveScroll: true,
    onSuccess: () => {
      editingId.value = null
      form.reset()
    },
  })
}

function cancelEdit() {
  editingId.value = null
  form.reset()
}
</script>

<template>
  <Head title="Features" />

  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Features</h1>
      <Dialog v-model:open="showCreate">
        <DialogTrigger as-child>
          <Button>Nova feature</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar feature</DialogTitle>
          </DialogHeader>
          <form class="flex flex-col gap-4" @submit.prevent="createFeature">
            <div class="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Slug</FieldLabel>
                <Input v-model="form.slug" placeholder="minha-feature" />
              </Field>
              <Field>
                <FieldLabel>Nome</FieldLabel>
                <Input v-model="form.name" placeholder="Minha Feature" />
              </Field>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Rota</FieldLabel>
                <Input v-model="form.route" placeholder="/minha-feature" />
              </Field>
              <Field>
                <FieldLabel>Ícone (Lucide)</FieldLabel>
                <Input v-model="form.icon" placeholder="Home" />
              </Field>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Módulo</FieldLabel>
                <Select v-model="form.moduleId">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="m in modules" :key="m.id" :value="String(m.id)">
                      {{ m.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Posição</FieldLabel>
                <Input v-model.number="form.position" type="number" />
              </Field>
            </div>
            <Field>
              <FieldLabel>Descrição</FieldLabel>
              <Input v-model="form.description" placeholder="Descrição opcional" />
            </Field>
            <DialogFooter>
              <Button type="submit" :disabled="form.processing">Criar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Slug</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Rota</TableHead>
          <TableHead>Módulo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="feature in features" :key="feature.id">
          <template v-if="editingId === feature.id">
            <TableCell><Input v-model="form.name" class="h-8" /></TableCell>
            <TableCell><Input v-model="form.route" class="h-8" /></TableCell>
            <TableCell><Input v-model="form.icon" class="h-8" /></TableCell>
            <TableCell>
              <Select
                :model-value="String(form.moduleId)"
                @update:model-value="(v) => (form.moduleId = Number(v))"
              >
                <SelectTrigger class="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="m in modules" :key="m.id" :value="String(m.id)">{{
                    m.name
                  }}</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Select
                :model-value="form.isActive ? 'true' : 'false'"
                @update:model-value="(v) => (form.isActive = v === 'true')"
              >
                <SelectTrigger class="h-8 w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <div class="flex gap-1">
                <Button size="sm" variant="default" @click="saveEdit">Salvar</Button>
                <Button size="sm" variant="ghost" @click="cancelEdit">Cancelar</Button>
              </div>
            </TableCell>
          </template>
          <template v-else>
            <TableCell class="font-mono text-xs">{{ feature.slug }}</TableCell>
            <TableCell class="font-medium">{{ feature.name }}</TableCell>
            <TableCell class="text-muted-foreground">{{ feature.route }}</TableCell>
            <TableCell>
              <Badge variant="outline">{{ feature.moduleName || 'Geral' }}</Badge>
            </TableCell>
            <TableCell>
              <Badge :variant="feature.isActive ? 'default' : 'secondary'">
                {{ feature.isActive ? 'Ativo' : 'Inativo' }}
              </Badge>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="ghost" @click="startEdit(feature)">Editar</Button>
            </TableCell>
          </template>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
