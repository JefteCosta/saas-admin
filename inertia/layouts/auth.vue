<script lang="ts">
export const description = 'A two column login page with a cover image.'
</script>

<script setup lang="ts">
import { Moon, Sparkles, Sun, Zap } from '@lucide/vue'
import { Toaster } from 'vue-sonner'
import { Button } from '~/components/ui/button'
import { useTheme } from '~/composables/use_theme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <div class="auth-layout min-h-svh">
    <section class="auth-hero hidden lg:flex">
      <div class="auth-hero-content">
        <a href="/" class="auth-brand">
          <span class="auth-brand-icon">
            <Zap class="size-4" />
          </span>
          CoreAdmin
        </a>

        <div class="auth-quote">
          <p>
            "Este dashboard acelera seu produto e reduz meses de construção para poucos dias de
            execução."
          </p>
          <small>Jefte A Costa, CTO na COSLY</small>
        </div>
      </div>

      <div class="auth-hero-blob" />
    </section>

    <section class="auth-panel">
      <div class="auth-panel-inner">
        <div class="auth-actions">
          <a href="/" class="auth-skip">Pular para dashboard</a>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 rounded-md border border-border bg-card text-foreground hover:bg-accent"
            :aria-label="theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'"
            @click="toggleTheme"
          >
            <Sun class="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon
              class="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
          </Button>
        </div>

        <div class="auth-card">
          <div class="auth-card-glow" />
          <div class="auth-card-body">
            <div class="auth-card-header">
              <span class="auth-pill">
                <Sparkles class="size-3.5" />
                Acesso seguro
              </span>
            </div>

            <slot />
          </div>
        </div>
      </div>
    </section>
  </div>
  <Toaster position="top-right" :duration="4000" rich-colors />
</template>

<style scoped>
.auth-layout {
  display: grid;
  grid-template-columns: 1fr;
  background: linear-gradient(
    130deg,
    var(--background) 0%,
    var(--muted) 45%,
    var(--background) 100%
  );
}

@media (min-width: 1024px) {
  .auth-layout {
    grid-template-columns: 1fr 1fr;
  }
}

.auth-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(165deg, var(--card) 0%, var(--muted) 100%);
  color: var(--foreground);
}

.auth-hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
}

.auth-brand {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--foreground);
}

.auth-brand-icon {
  display: inline-flex;
  height: 1.7rem;
  width: 1.7rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-foreground);
}

.auth-quote {
  max-width: 40rem;
}

.auth-quote p {
  margin: 0;
  font-size: 1.85rem;
  line-height: 1.25;
  color: var(--foreground);
}

.auth-quote small {
  margin-top: 1.2rem;
  display: block;
  font-size: 0.95rem;
  color: var(--muted-foreground);
}

.auth-hero-blob {
  position: absolute;
  left: -10%;
  bottom: -16%;
  height: 78%;
  width: 96%;
  border-radius: 52% 48% 0 0;
  background: linear-gradient(160deg, rgba(130, 166, 255, 0.35), rgba(98, 214, 255, 0.28));
}

.auth-panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .auth-panel {
    padding: 2rem;
  }
}

.auth-panel-inner {
  width: 100%;
  max-width: 32rem;
}

.auth-actions {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.auth-skip {
  display: inline-flex;
  width: fit-content;
  font-size: 0.86rem;
  color: var(--primary);
}

.auth-skip:hover {
  filter: brightness(1.08);
}

.auth-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid color-mix(in srgb, var(--border) 82%, transparent);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--card) 96%, transparent),
    color-mix(in srgb, var(--card) 92%, transparent)
  );
  box-shadow: 0 24px 64px color-mix(in srgb, var(--foreground) 10%, transparent);
}

.auth-card-glow {
  pointer-events: none;
  position: absolute;
  inset: auto -40% -60% auto;
  height: 16rem;
  width: 16rem;
  border-radius: 999px;
  background: radial-gradient(
    circle at center,
    color-mix(in srgb, var(--primary) 35%, transparent),
    transparent 68%
  );
}

.auth-card-body {
  position: relative;
  z-index: 1;
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .auth-card-body {
    padding: 2rem;
  }
}

.auth-card-header {
  margin-bottom: 1rem;
}

.auth-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
  background: color-mix(in srgb, var(--muted) 90%, transparent);
  padding: 0.28rem 0.62rem;
  font-size: 0.72rem;
  color: color-mix(in srgb, var(--foreground) 72%, var(--primary));
}

.auth-card :deep(h1) {
  color: var(--foreground);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.auth-card :deep(p),
.auth-card :deep(label),
.auth-card :deep(.text-muted-foreground) {
  color: var(--muted-foreground);
}

.auth-card :deep(input) {
  border-color: var(--input);
  background: color-mix(in srgb, var(--background) 92%, transparent);
}

.auth-card :deep(input:focus-visible) {
  border-color: var(--ring);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ring) 40%, transparent);
}

.auth-card :deep(button[type='submit']) {
  border: 0;
  background: var(--primary);
  color: var(--primary-foreground);
}

.auth-card :deep(button[type='submit']:hover) {
  filter: brightness(1.08);
}

.auth-card :deep(button[type='button']) {
  border-color: var(--border);
  background: color-mix(in srgb, var(--card) 94%, transparent);
}

:global(.dark) .auth-layout {
  background: linear-gradient(130deg, #161a2f 0%, #141a2c 42%, #111625 100%);
}

:global(.dark) .auth-hero {
  background: linear-gradient(165deg, #1c2441 0%, #1a213a 100%);
}

:global(.dark) .auth-hero-blob {
  background: linear-gradient(160deg, rgba(114, 133, 255, 0.38), rgba(92, 176, 255, 0.3));
}
</style>
