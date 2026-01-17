<script lang="ts">
  import { HeroVideo, DopeMeter, RalphAvatar } from '$lib/components';

  // Types
  interface PMFScores {
    problemClarity: number;
    marketSize: number;
    uniqueness: number;
    feasibility: number;
    monetization: number;
    timing: number;
    virality: number;
    defensibility: number;
    teamFit: number;
    ralphFactor: number;
  }

  interface PMFAnalysis {
    targetCustomer: string;
    acquisitionChannel: string;
    retentionHook: string;
    monetizationPath: string;
  }

  interface IdeaResult {
    name: string;
    tagline?: string;
    idea: string;
    problem?: string;
    solution?: string;
    whyNow?: string;
    scores?: PMFScores;
    totalScore: number;
    iterations?: number;
    ralphQuote: string;
    pmfAnalysis?: PMFAnalysis;
  }

  // UI State
  let step = $state<'bell' | 'prompt' | 'paste' | 'result'>('bell');
  let userHint = $state('');
  let pastedResult = $state('');
  let currentIdea = $state<IdeaResult | null>(null);
  let error = $state<string | null>(null);
  let copied = $state(false);

  // The Ralph prompt template for Claude Code - targets 9.9/10 score
  const getRalphPrompt = (hint?: string) => `You are Ralph Wiggum from The Simpsons - innocent, confused, but secretly a genius at finding startup ideas that sound dumb but are actually brilliant.

## Your Task
Generate and refine a startup idea until it scores **9.9/10 or higher**.
${hint ? `\nFocus area: ${hint}` : ''}

## Scoring Rubric (Score each 0-10, be HARSH)
1. **Problem Clarity**: Real pain point? Who suffers? How badly?
2. **Market Size**: TAM > $1B? SAM > $100M? Growing market?
3. **Uniqueness**: What's the 10x better angle? Why hasn't this been done?
4. **Feasibility**: Can build MVP in 3 months? Tech exists?
5. **Monetization**: Clear revenue model? Unit economics work?
6. **Timing**: Why now? What changed recently to enable this?
7. **Virality**: Built-in sharing? Network effects? Word of mouth?
8. **Defensibility**: Data moat? Brand? Switching costs?
9. **Team Fit**: Can 2-3 people build this? No special access needed?
10. **Ralph Factor**: Sounds dumb at first? Actually genius? Memorable?

## Process
1. Generate/refine the idea
2. Score ALL 10 dimensions (most start at 5-7!)
3. If score < 9.9: Improve weakest 2-3 areas and iterate
4. If score >= 9.9: Output final JSON

## Output Format (when score >= 9.9)
\`\`\`json
{
  "name": "Startup Name",
  "tagline": "One-line pitch (max 10 words)",
  "idea": "2-3 sentence description that sounds dumb but is genius",
  "problem": "The painful problem being solved",
  "solution": "How this solves it uniquely",
  "whyNow": "Why this is the right time",
  "scores": {
    "problemClarity": 9.9,
    "marketSize": 9.9,
    "uniqueness": 9.9,
    "feasibility": 9.9,
    "monetization": 9.9,
    "timing": 9.9,
    "virality": 9.9,
    "defensibility": 9.9,
    "teamFit": 9.9,
    "ralphFactor": 9.9
  },
  "totalScore": 9.9,
  "iterations": 1,
  "ralphQuote": "A funny Ralph Wiggum quote about this idea",
  "pmfAnalysis": {
    "targetCustomer": "Who is the ideal first customer?",
    "acquisitionChannel": "How do you reach them?",
    "retentionHook": "Why do they keep coming back?",
    "monetizationPath": "How do you make money?"
  }
}
\`\`\`

Keep Ralph's voice: "I'm helping!" energy, finds weird connections, says dumb things that are secretly smart.
Don't stop until 9.9+ achieved. This may take many iterations.`;

  function ringTheBell() {
    step = 'prompt';
  }

  function copyPrompt() {
    navigator.clipboard.writeText(getRalphPrompt(userHint));
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function parseResult() {
    error = null;
    try {
      // Try to extract JSON from the pasted text
      const jsonMatch = pastedResult.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.name || !parsed.idea) throw new Error('Invalid format');

      currentIdea = {
        name: parsed.name,
        tagline: parsed.tagline,
        idea: parsed.idea,
        problem: parsed.problem,
        solution: parsed.solution,
        whyNow: parsed.whyNow,
        scores: parsed.scores,
        totalScore: parsed.totalScore || parsed.dopeLevel || 5,
        iterations: parsed.iterations,
        ralphQuote: parsed.ralphQuote || "I made a idea!",
        pmfAnalysis: parsed.pmfAnalysis
      };
      step = 'result';
    } catch (err) {
      error = "Couldn't parse that. Make sure you copied the full JSON response!";
    }
  }

  // Helper to get score color
  function getScoreColor(score: number): string {
    if (score >= 9.5) return 'text-playground-green';
    if (score >= 9.0) return 'text-sky-blue';
    if (score >= 8.0) return 'text-ralph-yellow';
    return 'text-playground-red';
  }

  // Helper to format score label
  function formatScoreLabel(key: string): string {
    const labels: Record<string, string> = {
      problemClarity: 'Problem',
      marketSize: 'Market',
      uniqueness: 'Unique',
      feasibility: 'Feasible',
      monetization: 'Revenue',
      timing: 'Timing',
      virality: 'Viral',
      defensibility: 'Moat',
      teamFit: 'Team Fit',
      ralphFactor: 'Ralph Factor'
    };
    return labels[key] || key;
  }

  function startOver() {
    step = 'bell';
    userHint = '';
    pastedResult = '';
    currentIdea = null;
    error = null;
  }

  function generateAnother() {
    step = 'prompt';
    pastedResult = '';
    currentIdea = null;
  }
</script>

<main class="bg-playground-sunset overflow-hidden">
  <!-- Hero Section - Half-screen Video Background -->
  <HeroVideo size="half">
    <div class="text-center w-full max-w-2xl mx-auto px-4">

      {#if step === 'bell'}
        <!-- Initial State: Ring the Bell -->
        <button
          onclick={ringTheBell}
          class="btn-crayon text-xl md:text-2xl px-10 py-5 flex items-center gap-4 mx-auto
                 transform hover:scale-105 transition-transform"
        >
          <span class="text-3xl md:text-4xl">🔔</span>
          <span>Ring the Bell</span>
        </button>
        <div class="mt-3 inline-block bg-white/60 px-3 py-1 rounded-xl border border-chalkboard/20">
          <span class="text-chalkboard text-xs">Powered by your Claude Code • No API costs</span>
        </div>

      {:else if step === 'prompt'}
        <!-- Step 1: Show prompt to copy -->
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-4 border-chalkboard shadow-crayon-lg">
          <h2 class="font-chalk text-2xl text-chalkboard mb-4">
            1. Copy this prompt to Claude Code
          </h2>

          <input
            bind:value={userHint}
            placeholder="Optional: Give Ralph a hint (e.g., 'fitness apps', 'AI for pets')"
            class="w-full px-4 py-3 rounded-lg border-2 border-chalkboard bg-white
                   focus:outline-none focus:ring-2 focus:ring-sky-blue mb-4"
          />

          <div class="bg-chalkboard/5 rounded-lg p-4 mb-4 text-left max-h-32 overflow-y-auto">
            <pre class="text-xs text-chalkboard/80 whitespace-pre-wrap font-mono">{getRalphPrompt(userHint).slice(0, 200)}...</pre>
          </div>

          <button
            onclick={copyPrompt}
            class="btn-crayon w-full text-lg mb-3"
          >
            {copied ? '✅ Copied!' : '📋 Copy Prompt'}
          </button>

          <button
            onclick={() => step = 'paste'}
            class="w-full text-chalkboard/70 hover:text-chalkboard py-2 transition-colors"
          >
            I've run it in Claude Code →
          </button>
        </div>

      {:else if step === 'paste'}
        <!-- Step 2: Paste the result -->
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-4 border-chalkboard shadow-crayon-lg">
          <h2 class="font-chalk text-2xl text-chalkboard mb-4">
            2. Paste Claude's response
          </h2>

          <textarea
            bind:value={pastedResult}
            placeholder="Paste the JSON response from Claude Code here..."
            class="w-full px-4 py-3 rounded-lg border-2 border-chalkboard bg-white
                   focus:outline-none focus:ring-2 focus:ring-sky-blue resize-none mb-4 font-mono text-sm"
            rows="6"
          ></textarea>

          {#if error}
            <p class="text-playground-red text-sm mb-3">{error}</p>
          {/if}

          <div class="flex gap-3">
            <button onclick={() => step = 'prompt'} class="btn-crayon flex-1 bg-gray-100">
              ← Back
            </button>
            <button onclick={parseResult} class="btn-crayon flex-1">
              🚀 Show My Idea
            </button>
          </div>
        </div>

      {:else if step === 'result' && currentIdea}
        <!-- Step 3: Display the result with PMF Analysis -->
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-4 border-chalkboard shadow-crayon-lg max-w-2xl mx-auto">
          <div class="text-left">
            <!-- Header with name and total score -->
            <div class="flex items-start justify-between mb-2">
              <div>
                <h3 class="font-chalk text-2xl text-chalkboard">{currentIdea.name}</h3>
                {#if currentIdea.tagline}
                  <p class="text-chalkboard/60 text-sm">{currentIdea.tagline}</p>
                {/if}
              </div>
              <div class="text-right">
                <div class="font-chalk text-3xl {getScoreColor(currentIdea.totalScore)}">
                  {currentIdea.totalScore.toFixed(1)}
                </div>
                <div class="text-xs text-chalkboard/60">/ 10</div>
              </div>
            </div>

            <!-- Idea description -->
            <p class="text-chalkboard text-base mb-4">{currentIdea.idea}</p>

            <!-- PMF Scores Grid -->
            {#if currentIdea.scores}
              <div class="grid grid-cols-5 gap-2 mb-4">
                {#each Object.entries(currentIdea.scores) as [key, score]}
                  <div class="text-center p-2 bg-chalkboard/5 rounded-lg">
                    <div class="font-bold text-sm {getScoreColor(score)}">{score.toFixed(1)}</div>
                    <div class="text-[10px] text-chalkboard/60 leading-tight">{formatScoreLabel(key)}</div>
                  </div>
                {/each}
              </div>
            {/if}

            <!-- PMF Analysis -->
            {#if currentIdea.pmfAnalysis}
              <div class="bg-chalkboard/5 rounded-lg p-3 mb-4 text-sm">
                <div class="font-chalk text-base mb-2 text-chalkboard">PMF Analysis</div>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div><span class="text-chalkboard/60">Customer:</span> <span class="text-chalkboard">{currentIdea.pmfAnalysis.targetCustomer}</span></div>
                  <div><span class="text-chalkboard/60">Acquire:</span> <span class="text-chalkboard">{currentIdea.pmfAnalysis.acquisitionChannel}</span></div>
                  <div><span class="text-chalkboard/60">Retain:</span> <span class="text-chalkboard">{currentIdea.pmfAnalysis.retentionHook}</span></div>
                  <div><span class="text-chalkboard/60">Revenue:</span> <span class="text-chalkboard">{currentIdea.pmfAnalysis.monetizationPath}</span></div>
                </div>
              </div>
            {/if}

            <!-- Ralph Quote -->
            <div class="bg-ralph-yellow/20 rounded-lg p-3 mb-4">
              <p class="ralph-voice text-chalkboard italic text-sm">"{currentIdea.ralphQuote}"</p>
              {#if currentIdea.iterations}
                <p class="text-xs text-chalkboard/50 mt-1">Refined over {currentIdea.iterations} iterations</p>
              {/if}
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button onclick={startOver} class="btn-crayon flex-1 bg-gray-100 text-sm py-2">
                🏠 Start Over
              </button>
              <button onclick={generateAnother} class="btn-crayon flex-1 text-sm py-2">
                🎲 Another One
              </button>
            </div>
          </div>
        </div>
      {/if}

    </div>
  </HeroVideo>

  <!-- Tagline Section -->
  <section class="bg-chalkboard py-10 px-4">
    <div class="max-w-3xl mx-auto text-center">
      <p class="text-4xl md:text-5xl lg:text-6xl font-chalk tracking-wide">
        <span class="text-white">Stupid</span> <span class="text-ralph-yellow">Smart.</span>
      </p>
    </div>
  </section>

  <!-- Features Section -->
  <section class="bg-paper py-14 md:py-20 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Title in thought bubble style -->
      <div class="flex justify-center mb-10">
        <div class="thought-bubble bg-white px-8 py-4">
          <h2 class="ralph-voice text-2xl md:text-3xl text-chalkboard text-center">
            How It Works
          </h2>
        </div>
      </div>

      <div class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <!-- Step 1 -->
        <div class="flex flex-col items-center text-center group">
          <div
            class="w-20 h-20 bg-ralph-yellow rounded-full flex items-center justify-center
                   border-4 border-chalkboard shadow-crayon
                   transition-transform group-hover:scale-110 group-hover:rotate-3"
          >
            <span class="text-3xl">🔔</span>
          </div>
          <h3 class="font-chalk text-xl mt-3">1. Ring the Bell</h3>
          <p class="ralph-voice text-chalkboard text-base whitespace-nowrap">"Wake up Ralph!"</p>
        </div>

        <!-- Arrow -->
        <span class="text-3xl text-chalkboard/30 hidden md:block">→</span>
        <span class="text-3xl text-chalkboard/30 md:hidden rotate-90">→</span>

        <!-- Step 2 -->
        <div class="flex flex-col items-center text-center group">
          <div
            class="w-20 h-20 bg-playground-green rounded-full flex items-center justify-center
                   border-4 border-chalkboard shadow-crayon
                   transition-transform group-hover:scale-110 group-hover:-rotate-3"
          >
            <span class="text-3xl">💻</span>
          </div>
          <h3 class="font-chalk text-xl mt-3">2. Run in Claude</h3>
          <p class="ralph-voice text-chalkboard text-base whitespace-nowrap">"Copy the magic!"</p>
        </div>

        <!-- Arrow -->
        <span class="text-3xl text-chalkboard/30 hidden md:block">→</span>
        <span class="text-3xl text-chalkboard/30 md:hidden rotate-90">→</span>

        <!-- Step 3 -->
        <div class="flex flex-col items-center text-center group">
          <div
            class="w-20 h-20 bg-sky-blue rounded-full flex items-center justify-center
                   border-4 border-chalkboard shadow-crayon
                   transition-transform group-hover:scale-110 group-hover:rotate-3"
          >
            <span class="text-3xl">💡</span>
          </div>
          <h3 class="font-chalk text-xl mt-3">3. Get Your Idea</h3>
          <p class="ralph-voice text-chalkboard text-base whitespace-nowrap">"Genius comes out!"</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Dope Ideas Section -->
  <section class="bg-gradient-to-b from-chalkboard to-chalkboard/90 py-16 md:py-24 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl md:text-4xl font-chalk text-ralph-yellow mb-4">
        Ideas So Dumb They're Genius
      </h2>
      <p class="text-white/60 mb-12">Real examples from Ralph's beautiful brain</p>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          class="thought-bubble bg-paper text-left hover:scale-[1.02] transition-transform cursor-default"
        >
          <p class="ralph-voice text-lg">
            "What if dogs had their own social media? My dog would post about
            butts a lot."
          </p>
          <div class="flex items-center justify-between mt-4">
            <p class="text-sm text-chalkboard/60">— Actual Ralph idea</p>
            <div class="flex gap-1">
              <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span class="opacity-30">⭐</span>
            </div>
          </div>
        </div>

        <div
          class="thought-bubble bg-paper text-left hover:scale-[1.02] transition-transform cursor-default"
        >
          <p class="ralph-voice text-lg">
            "Uber but the cars are boats and the roads are rivers. Wait, that's just boats."
          </p>
          <div class="flex items-center justify-between mt-4">
            <p class="text-sm text-chalkboard/60">— Dope level: 3/5</p>
            <div class="flex gap-1">
              <span>⭐</span><span>⭐</span><span>⭐</span><span class="opacity-30">⭐</span><span class="opacity-30">⭐</span>
            </div>
          </div>
        </div>

        <div
          class="thought-bubble bg-paper text-left hover:scale-[1.02] transition-transform cursor-default"
        >
          <p class="ralph-voice text-lg">
            "AI that writes your excuses for being late. It learns your boss's personality!"
          </p>
          <div class="flex items-center justify-between mt-4">
            <p class="text-sm text-chalkboard/60">— Gold star material</p>
            <div class="flex gap-1">
              <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
            </div>
          </div>
        </div>

        <div
          class="thought-bubble bg-paper text-left hover:scale-[1.02] transition-transform cursor-default"
        >
          <p class="ralph-voice text-lg">
            "This idea tastes like purple and also like money!"
          </p>
          <div class="flex items-center justify-between mt-4">
            <p class="text-sm text-chalkboard/60">— Classic Ralph</p>
            <div class="flex gap-1">
              <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 p-6 bg-white/5 rounded-lg border border-white/10">
        <p class="text-white/80 ralph-voice text-lg">
          Airbnb sounded dumb. Uber sounded dumb. Twitter sounded dumb.
        </p>
        <p class="text-ralph-yellow font-chalk text-2xl mt-2">
          All of them worked.
        </p>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="bg-playground-sunset py-16 md:py-24 px-4">
    <div class="max-w-2xl mx-auto text-center">
      <RalphAvatar size="lg" mood="excited" />
      <h2 class="font-chalk text-3xl md:text-4xl text-chalkboard mt-6 mb-4">
        Ready to Generate Some Genius?
      </h2>
      <p class="ralph-voice text-chalkboard/80 mb-8">
        "My brain has so many ideas it hurts! Let me share them with you!"
      </p>
      <button
        onclick={() => { step = 'prompt'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        class="btn-crayon text-xl md:text-2xl"
      >
        🔔 Ring the Bell
      </button>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-paper py-8 px-4">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-ralph-yellow rounded-full border-2 border-chalkboard overflow-hidden">
          <img src="/images/ralph-logo.png" alt="Ralph" class="w-full h-full object-cover" />
        </div>
        <span class="font-chalk text-chalkboard">IdeaRalph</span>
      </div>

      <p class="text-chalkboard/60 text-sm">
        Built with 🖍️ by
        <a href="https://vibeship.com" class="text-sky-blue hover:underline">
          Vibeship
        </a>
      </p>

      <p class="text-chalkboard/40 text-sm ralph-voice">
        "I'm helping!" — Ralph Wiggum
      </p>
    </div>
  </footer>
</main>
