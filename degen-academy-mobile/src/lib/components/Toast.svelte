<script lang="ts">
  import { toasts, removeToast } from '../stores/gameStore.svelte';

  const typeConfig = {
    success: { bg: '#2d3a2d', border: '#4ade80', icon: '✓', color: '#4ade80' },
    danger: { bg: '#3a2d2d', border: '#f87171', icon: '⚠', color: '#f87171' },
    warning: { bg: '#3a3a2d', border: '#fbbf24', icon: '⚡', color: '#fbbf24' },
    info: { bg: '#2d2d3a', border: '#60a5fa', icon: '●', color: '#60a5fa' },
  };

  const toastList = $derived(toasts.value);
</script>

<div class="fixed z-50 flex flex-col" style="top: 24px; right: 32px; gap: 12px; max-width: 320px;">
  {#each toastList as toast (toast.id)}
    {@const config = typeConfig[toast.type]}
    <div
      class="animate-slide-in rounded-xl"
      style="padding: 14px 18px; background: {config.bg}; border-left: 3px solid {config.border}; box-shadow: 4px 4px 12px rgba(0,0,0,0.4), -2px -2px 8px rgba(80,80,100,0.1);"
      role="alert"
    >
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <!-- Icon -->
        <span style="font-size: 16px; color: {config.color};">{config.icon}</span>

        <!-- Content -->
        <div style="flex: 1; min-width: 0;">
          <p class="font-semibold text-white" style="font-size: 13px;">{toast.title}</p>
          <p style="font-size: 11px; color: {config.color}; margin-top: 4px; opacity: 0.9;">{toast.message}</p>
        </div>

        <!-- Close button -->
        <button
          onclick={() => removeToast(toast.id)}
          class="text-white/40 hover:text-white/70 transition-colors"
          style="padding: 2px; font-size: 12px;"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  {/each}
</div>

<style>
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-in {
    animation: slide-in 0.25s ease-out;
  }
</style>
