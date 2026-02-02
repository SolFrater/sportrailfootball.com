<svelte:head>
  <title>Coach Education | Sportrail Football — In-Person & Online Courses</title>
  <meta name="description" content="Learn from the best coaches and experts from all over the world, with state-of-the-art knowledge and practical experience in world's top clubs." />
</svelte:head>

<!-- Hero -->
<section class="bg-sport-dark py-20 lg:py-28">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl">
      <span class="text-sport-gold text-sm font-sport-heading font-semibold uppercase tracking-wider">For Coaches</span>
      <h1 class="text-4xl sm:text-5xl font-sport-heading font-black text-white mt-3 mb-6">
        Coach Education<br/><span class="text-sport-gold">In-Person & Online</span>
      </h1>
      <p class="text-lg text-sport-gray-300 font-sport-body leading-relaxed">
        Learn from the best coaches and experts from all over the world, with state-of-the-art
        knowledge and practical experience in world's top clubs.
      </p>
    </div>
  </div>
</section>

<!-- Flagship Programs -->
<section id="certification" class="py-24 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-2xl font-sport-heading font-black text-sport-dark mb-8">Flagship Programs</h2>

    <div class="grid md:grid-cols-2 gap-8">
      {#each [
        {
          title: 'Sports Director Course in Football',
          edition: '4th Edition',
          description: 'Comprehensive program covering football club management, recruitment strategy, academy structure, and sporting direction. Designed for coaches transitioning to leadership roles or professionals seeking to enter football management.',
          topics: ['Club Management & Governance', 'Recruitment & Transfer Strategy', 'Academy Development Models', 'Financial Planning in Football', 'Communication & Media Relations', 'Legal Framework in Sport'],
          format: 'Online + In-person sessions',
          featured: true,
        },
        {
          title: 'Scouting Course in Youth Football',
          edition: '2nd Edition',
          description: 'Professional scouting education covering talent identification, player assessment frameworks, report writing, and building scouting networks. Learn from scouts working at top European clubs.',
          topics: ['Talent Identification Models', 'Player Assessment Criteria', 'Scouting Report Writing', 'Video Analysis for Scouting', 'Building Scouting Networks', 'Youth Development Pathways'],
          format: 'Online + In-person sessions',
          featured: true,
        },
      ] as course}
        <div class="bg-gradient-to-br from-sport-red to-sport-secondary rounded-2xl overflow-hidden {course.featured ? 'ring-2 ring-sport-gold' : ''}">
          <div class="p-8">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sport-gold text-xs font-sport-heading font-semibold uppercase tracking-wider">{course.edition}</span>
              {#if course.featured}
                <span class="px-3 py-1 bg-sport-gold/20 text-sport-gold text-xs font-sport-heading font-bold rounded-full">FLAGSHIP</span>
              {/if}
            </div>
            <h3 class="text-2xl font-sport-heading font-bold text-white mb-3">{course.title}</h3>
            <p class="text-sport-gray-300 font-sport-body text-sm leading-relaxed mb-6">{course.description}</p>

            <div class="mb-6">
              <h4 class="text-white font-sport-heading font-semibold text-sm mb-3">What You'll Learn:</h4>
              <div class="grid grid-cols-2 gap-2">
                {#each course.topics as topic}
                  <div class="flex items-center gap-2 text-sport-gray-300 text-sm">
                    <span class="w-1.5 h-1.5 bg-sport-red rounded-full shrink-0"></span>
                    <span>{topic}</span>
                  </div>
                {/each}
              </div>
            </div>

            <div class="flex items-center justify-between pt-6 border-t border-white/10">
              <span class="text-sport-gray-400 text-sm">{course.format}</span>
              <a href="/contact" class="px-6 py-3 bg-sport-red hover:bg-white hover:text-sport-red text-white font-sport-heading font-semibold rounded-xl transition-colors">
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Tailored Courses -->
<section id="tailored" class="py-24 bg-sport-light">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-2xl font-sport-heading font-black text-sport-dark mb-2">Tailored Courses</h2>
    <p class="text-sport-gray-500 font-sport-body mb-8">Focused, intensive programs on specific coaching domains.</p>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each [
        {
          title: 'Match Analysis',
          icon: '📊',
          description: 'Professional match analysis techniques. Video breakdown, tactical pattern recognition, and data-driven insights.',
        },
        {
          title: 'Elite Training Methods',
          icon: '🏋️',
          description: 'Advanced training methodologies from top-level coaching staffs. Session design, periodization, and player development.',
        },
        {
          title: 'Football Training',
          icon: '⚽',
          description: 'Comprehensive football training course. Game models, training principles, and practical exercise design.',
        },
        {
          title: 'Goalkeeper Training',
          icon: '🧤',
          description: 'Specialized goalkeeper coaching. Technical development, decision making, distribution, and modern GK role.',
        },
        {
          title: 'Training & Match Practical Issues',
          icon: '📋',
          description: 'Real-world coaching challenges. Match-day preparation, half-time adjustments, and in-game management.',
        },
        {
          title: 'Strength & Conditioning',
          icon: '💪',
          description: 'Football-specific S&C. Physical preparation, injury prevention, load management, and performance optimization.',
        },
      ] as mc}
        <div class="bg-white rounded-2xl p-6 border border-sport-gray-100 hover:border-sport-red/30 hover:shadow-lg transition-all">
          <div class="text-3xl mb-3">{mc.icon}</div>
          <h3 class="font-sport-heading font-bold text-sport-dark text-lg mb-2">{mc.title}</h3>
          <p class="text-sport-gray-500 font-sport-body text-sm leading-relaxed mb-4">{mc.description}</p>
          <div class="pt-4 border-t border-sport-gray-100">
            <a href="/contact" class="inline-flex items-center gap-2 text-sm font-sport-heading font-semibold text-sport-red hover:text-red-700 transition-colors">
              Get a Quote
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
