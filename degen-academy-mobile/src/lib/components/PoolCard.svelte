<script lang="ts">
  import { deposit, withdrawAll, gasMultiplier, portfolio } from '../stores/gameStore.svelte';
  import type { Pool } from '../../types/game';

  interface Props {
    pool: Pool;
  }

  let { pool }: Props = $props();

  const gasMult = $derived(gasMultiplier.value);
  const portfolioVal = $derived(portfolio.value);

  const depositAmount = 1000;
  const depositCost = $derived(depositAmount * gasMult);
  const canDeposit = $derived(!pool.isRugged && portfolioVal >= depositCost);
  const canWithdraw = $derived(!pool.isRugged && pool.deposited > 0);

  const riskConfig = {
    safe: { label: 'Low Risk', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' },
    medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40' },
    degen: { label: 'High Risk', color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/40' },
  };

  const config = $derived(riskConfig[pool.riskLevel]);

  const tvl = $derived(Math.floor(1000000 / (pool.apy / 100 + 1)));

  function formatTVL(amount: number): string {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return `$${amount}`;
  }
</script>

<div
  class="w-full bg-slate-900/60 backdrop-blur-lg rounded-2xl border transition-all duration-200
         {pool.isRugged ? 'opacity-50 border-white/10' : 'border-white/10 hover:border-white/20 hover:bg-slate-900/70'}
         {pool.isPumping ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10' : ''}"
  style="padding: 32px 36px;"
>
  <!-- Header Row -->
  <div class="flex items-center justify-between" style="margin-bottom: 28px;">
    <!-- Token Info -->
    <div class="flex items-center" style="gap: 16px;">
      <div class="rounded-xl bg-white/10 border border-white/10 flex items-center justify-center" style="width: 52px; height: 52px; font-size: 26px;">
        {pool.emoji}
      </div>
      <div>
        <h3 class="font-bold text-white" style="font-size: 17px;">{pool.name}</h3>
        <p class="text-white/40" style="font-size: 13px;">/ USDC</p>
      </div>
    </div>

    <!-- Risk Badge - more padding -->
    <span class="font-semibold rounded-lg border {config.bg} {config.color} {config.border}" style="padding: 10px 16px; font-size: 12px;">
      {config.label}
    </span>
  </div>

  <!-- Stats Row -->
  <div class="flex items-center" style="gap: 36px; margin-bottom: 24px;">
    <!-- APR -->
    <div>
      <p class="text-white/40 uppercase tracking-wider" style="font-size: 11px; margin-bottom: 6px;">APR</p>
      <p class="font-mono font-bold text-white" style="font-size: 32px;">
        {pool.apy}%
        {#if pool.isPumping}
          <span class="text-emerald-400" style="font-size: 18px; margin-left: 6px;">🔥</span>
        {/if}
      </p>
    </div>

    <!-- TVL -->
    <div>
      <p class="text-white/40 uppercase tracking-wider" style="font-size: 11px; margin-bottom: 6px;">TVL</p>
      <p class="font-mono text-white/70" style="font-size: 22px;">{formatTVL(tvl)}</p>
    </div>
  </div>

  <!-- Your Position Box -->
  <div class="bg-white/5 border border-white/10 rounded-xl" style="padding: 18px 20px; margin-bottom: 24px;">
    <div class="flex items-center justify-between">
      <span class="text-white/50" style="font-size: 14px;">Your Position</span>
      <span class="font-mono text-white font-semibold" style="font-size: 16px;">
        ${pool.deposited.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </span>
    </div>
  </div>

  <!-- Action Buttons - flat, no shadows -->
  {#if !pool.isRugged}
    <div class="flex" style="gap: 14px;">
      <!-- Deposit Button - flat style -->
      <button
        onclick={() => deposit(pool.id, depositAmount)}
        disabled={!canDeposit}
        class="flex-1 font-semibold rounded-lg
               {canDeposit
                 ? 'bg-white text-gray-900'
                 : 'bg-white/10 text-white/30 cursor-not-allowed'}"
        style="padding: 14px 20px; font-size: 14px; box-shadow: none; border: none;"
      >
        Deposit +$1K
      </button>

      <!-- Withdraw Button - flat outline style -->
      <button
        onclick={() => withdrawAll(pool.id)}
        disabled={!canWithdraw}
        class="flex-1 font-semibold rounded-lg
               {canWithdraw
                 ? 'bg-transparent text-white'
                 : 'bg-transparent text-white/30 cursor-not-allowed'}"
        style="padding: 14px 20px; font-size: 14px; box-shadow: none; border: 1px solid rgba(255,255,255,0.2);"
      >
        Withdraw
      </button>
    </div>
  {:else}
    <div class="rounded-lg text-center" style="padding: 14px 20px; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3);">
      <p class="text-red-400 font-semibold flex items-center justify-center gap-2" style="font-size: 14px;">
        <span>⚠️</span> Pool Rugged
      </p>
    </div>
  {/if}
</div>
