<script lang="ts">
import Auth from '~/layouts/auth.vue'
export default {
  layout: Auth,
}
</script>
<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Form } from '@adonisjs/inertia/vue'
import { Head, usePage } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import { CircleAlert } from '@lucide/vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
const form = ref({
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  companyName: '',
})

const page = usePage()
const flash = computed(() => (page.props.flash as { error?: string; success?: string }) || {})
</script>

<template>
  <Head>
    <title>Sign Up</title>
    <meta name="description" content="Create a new account" />
  </Head>
  <Form
    v-slot="{ processing, errors }"
    :class="cn('flex flex-col gap-6', props.class)"
    route="new_account.store"
  >
    <FieldGroup>
      <Alert
        v-if="flash.error || Object.keys(errors).length > 0"
        variant="destructive"
        class="mb-2"
      >
        <CircleAlert class="size-4" />
        <AlertDescription>{{ flash.error || 'Corrija os erros abaixo' }}</AlertDescription>
      </Alert>
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold">Crie sua Conta</h1>
        <p class="text-muted-foreground text-sm text-balance">
          Preencha o formulário abaixo para criar sua conta
        </p>
      </div>
      <Field>
        <FieldLabel for="name">Nome Completo</FieldLabel>
        <Input
          id="fullName"
          type="text"
          name="fullName"
          :data-invalid="errors.fullName ? 'true' : undefined"
        />
        <div v-if="errors.fullName" class="text-destructive text-sm font-medium">
          {{ errors.fullName }}
        </div>
      </Field>
      <Field>
        <FieldLabel for="companyName">Nome da Empresa</FieldLabel>
        <Input
          id="companyName"
          v-model="form.companyName"
          type="text"
          name="companyName"
          placeholder="Ex: Minha Empresa"
          :data-invalid="errors.companyName ? 'true' : undefined"
        />
        <div v-if="errors.companyName" class="text-destructive text-sm font-medium">
          {{ errors.companyName }}
        </div>
        <FieldDescription>
          O nome da sua empresa. Você poderá editar os dados completos depois.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="email">Email</FieldLabel>
        <Input
          id="email"
          v-model="form.email"
          type="email"
          name="email"
          autocomplete="email"
          :data-invalid="errors.email ? 'true' : undefined"
        />
        <div v-if="errors.email" class="text-destructive text-sm font-medium">
          {{ errors.email }}
        </div>
        <FieldDescription>
          Usaremos este e-mail para entrar em contato com você. Não compartilharemos seu e-mail com
          mais ninguém.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="password">Senha</FieldLabel>
        <Input
          id="password"
          v-model="form.password"
          type="password"
          name="password"
          autocomplete="new-password"
          :data-invalid="errors.password ? 'true' : undefined"
        />
        <div v-if="errors.password" class="text-destructive text-sm font-medium">
          {{ errors.password }}
        </div>
        <FieldDescription> Deve ter pelo menos 8 caracteres.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="confirm-password">Confirme a Senha</FieldLabel>
        <Input
          id="passwordConfirmation"
          v-model="form.passwordConfirmation"
          type="password"
          name="passwordConfirmation"
          autocomplete="new-password"
          :data-invalid="errors.passwordConfirmation ? 'true' : undefined"
        />
        <div v-if="errors.passwordConfirmation" class="text-destructive text-sm font-medium">
          {{ errors.passwordConfirmation }}
        </div>
        <FieldDescription>Por favor, confirme sua senha.</FieldDescription>
      </Field>
      <Field>
        <Button type="submit" class="button" :disabled="processing">Criar Conta</Button>
      </Field>
      <FieldSeparator>Ou continue com</FieldSeparator>
      <Field>
        <Button variant="outline" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Criar Conta com GitHub
        </Button>
        <FieldDescription class="px-6 text-center">
          Já tem uma conta? <a href="/login">Entrar</a>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </Form>
</template>
