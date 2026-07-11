<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'
import { Badge } from '~/components/ui/badge'
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
  users: {
    id: number
    fullName: string | null
    email: string
    role: { id: number; slug: string; name: string } | null
    createdAt: string
  }[]
  roles: { id: number; slug: string; name: string }[]
}>()

function updateRole(userId: number, roleId: string) {
  router.patch(`/users/${userId}/role`, { roleId: Number(roleId) }, { preserveScroll: true })
}
</script>

<template>
  <Head title="Usuários" />

  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Usuários</h1>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Criado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="user in users" :key="user.id">
          <TableCell class="font-medium">{{ user.fullName || '—' }}</TableCell>
          <TableCell>{{ user.email }}</TableCell>
          <TableCell>
            <Badge v-if="user.role?.slug === 'owner'" variant="default">
              {{ user.role.name }}
            </Badge>
            <Select
              v-else
              :model-value="String(user.role?.id || '')"
              @update:model-value="(val) => updateRole(user.id, String(val))"
            >
              <SelectTrigger class="w-40">
                <SelectValue placeholder="Selecionar role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="role in roles" :key="role.id" :value="String(role.id)">
                  {{ role.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell class="text-muted-foreground">{{ user.createdAt }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
