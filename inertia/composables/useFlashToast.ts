import { watch, computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'

/**
 * Composable que observa flash messages do backend e dispara toasts automaticamente.
 * Usar no layout admin (default.vue) para exibir notificações de sucesso/erro.
 */
export function useFlashToast() {
  const page = usePage()

  const flashError = computed(() => (page.props.flash as any)?.error as string | undefined)
  const flashSuccess = computed(() => (page.props.flash as any)?.success as string | undefined)

  watch(flashError, (msg) => {
    if (msg) toast.error(msg)
  })

  watch(flashSuccess, (msg) => {
    if (msg) toast.success(msg)
  })
}
