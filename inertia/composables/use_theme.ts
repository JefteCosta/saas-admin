import { ref, watch } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'system')

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(value: Theme) {
  const resolved = value === 'system' ? getSystemTheme() : value

  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

// Aplica o tema inicial
if (typeof window !== 'undefined') {
  applyTheme(theme.value)

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme.value === 'system') {
      applyTheme('system')
    }
  })
}

watch(theme, (value) => {
  localStorage.setItem('theme', value)
  applyTheme(value)
})

export function useTheme() {
  function setTheme(value: Theme) {
    theme.value = value
  }

  function toggleTheme() {
    const current = theme.value === 'system' ? getSystemTheme() : theme.value
    theme.value = current === 'dark' ? 'light' : 'dark'
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}
