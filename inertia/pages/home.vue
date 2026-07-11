<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Download, TrendingDown, TrendingUp } from '@lucide/vue'

const stats = [
  { label: 'MRR', value: '$21,500', trend: '+18.2%', hint: 'vs. last month', positive: true },
  { label: 'ARR', value: '$258,000', trend: '+18.2%', hint: 'Runrate', positive: true },
  { label: 'Churn Rate', value: '2.4%', trend: '+0.5%', hint: 'vs. last month', positive: false },
  { label: 'LTV', value: '$4,250', trend: '+5.1%', hint: 'Lifetime Value', positive: true },
]

const subscribers = [
  { id: 'SUB-1023', company: 'AcmeCorp', plan: 'Enterprise', amount: '$999.00/m', status: 'Ativo', renewal: '2023-11-16' },
  { id: 'SUB-1024', company: 'Globex Inc', plan: 'Pro', amount: '$299.00/m', status: 'Ativo', renewal: '2023-10-22' },
  { id: 'SUB-1025', company: 'Soylent Corp', plan: 'Basic', amount: '$49.00/m', status: 'Pendente', renewal: '2023-09-01' },
  { id: 'SUB-1026', company: 'Initech', plan: 'Pro', amount: '$299.00/m', status: 'Ativo', renewal: '2023-12-05' },
  { id: 'SUB-1027', company: 'Umbrella Corp', plan: 'Enterprise', amount: '$999.00/m', status: 'Cancelado', renewal: '2023-08-30' },
]
</script>

<template>
  <Head title="Dashboard" />

  <div class="mx-auto w-full max-w-7xl space-y-5 p-4 md:p-6">
    <section class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-semibold tracking-tight text-foreground">SaaS Dashboard</h1>
        <p class="text-sm text-muted-foreground">Key metrics for your subscription business.</p>
      </div>
      <button
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-foreground transition hover:bg-accent"
      >
        <Download class="size-4" />
        Download PDF
      </button>
    </section>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="item in stats"
        :key="item.label"
        class="rounded-xl border border-border bg-card p-4"
      >
        <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">{{ item.label }}</p>
        <p class="mt-2 text-3xl font-bold text-foreground">{{ item.value }}</p>
        <p class="mt-2 inline-flex items-center gap-1 text-xs" :class="item.positive ? 'text-emerald-400' : 'text-rose-400'">
          <TrendingUp v-if="item.positive" class="size-3" />
          <TrendingDown v-else class="size-3" />
          {{ item.trend }}
          <span class="text-muted-foreground">{{ item.hint }}</span>
        </p>
      </article>
    </section>

    <section class="grid gap-4 xl:grid-cols-5">
      <article class="rounded-xl border border-border bg-card p-4 xl:col-span-3">
        <h2 class="text-sm font-semibold text-foreground">MRR Growth</h2>
        <p class="mb-4 text-xs text-muted-foreground">Monthly recurring revenue growth over time.</p>
        <div class="relative h-52 overflow-hidden rounded-lg border border-border bg-muted/30">
          <div class="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-[#7a66ff66] to-transparent" />
          <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7a66ff]" />
          <svg class="absolute inset-0 h-full w-full" viewBox="0 0 600 220" preserveAspectRatio="none">
            <path d="M0,170 C110,150 160,132 220,118 C310,100 365,112 425,90 C500,65 545,72 600,30 L600,220 L0,220 Z" fill="rgba(122,102,255,0.35)" />
            <path d="M0,170 C110,150 160,132 220,118 C310,100 365,112 425,90 C500,65 545,72 600,30" fill="none" stroke="#8e79ff" stroke-width="3" />
          </svg>
        </div>
      </article>

      <article class="rounded-xl border border-border bg-card p-4 xl:col-span-2">
        <h2 class="text-sm font-semibold text-foreground">Churn Analysis</h2>
        <p class="mb-4 text-xs text-muted-foreground">Voluntary vs involuntary churn.</p>
        <div class="flex h-52 items-end justify-between gap-2 rounded-lg border border-border bg-muted/30 p-4">
          <div v-for="(h, i) in [42, 58, 35, 70, 55, 82, 64]" :key="i" class="flex h-full w-full items-end gap-1">
            <div class="w-1/2 rounded-sm bg-[#20d2ff]/80" :style="{ height: `${h}%` }" />
            <div class="w-1/2 rounded-sm bg-[#f5a524]/85" :style="{ height: `${Math.max(18, h * 0.45)}%` }" />
          </div>
        </div>
      </article>
    </section>

    <section class="rounded-xl border border-border bg-card p-4">
      <h2 class="text-sm font-semibold text-foreground">Recent Subscribers</h2>
      <p class="mb-4 text-xs text-muted-foreground">Latest subscription updates.</p>

      <div class="overflow-x-auto rounded-lg border border-border">
        <table class="min-w-full text-sm">
          <thead class="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3">Plan</th>
              <th class="px-4 py-3">Amount</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Renewal</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in subscribers"
              :key="item.id"
              class="border-t border-border text-foreground"
            >
              <td class="px-4 py-3 text-xs text-muted-foreground">{{ item.id }}</td>
              <td class="px-4 py-3">{{ item.company }}</td>
              <td class="px-4 py-3">
                <span class="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{{ item.plan }}</span>
              </td>
              <td class="px-4 py-3">{{ item.amount }}</td>
              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2 py-0.5 text-xs"
                  :class="item.status === 'Ativo'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : item.status === 'Pendente'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-muted-foreground">{{ item.renewal }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
