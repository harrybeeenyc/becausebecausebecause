import { useState, useMemo, useEffect } from "react";

// Supabase config
const SUPABASE_URL = "https://bptmguzronuleohgprlt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdG1ndXpyb251bGVvaGdwcmx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDg4MTQsImV4cCI6MjA5MTMyNDgxNH0.oz_iigpjBAWX2S19DP4sl3uAjfDzAbA8jNCxOabmfbI";

const sb = (path, opts = {}) => fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
  ...opts,
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: opts.method === "POST" ? "return=representation" : (opts.method === "PATCH" ? "return=representation" : ""),
    ...opts.headers,
  },
}).then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t); }));

// ═══════════════════════════════════════════════════════════════
// BECAUSE BECAUSE BECAUSE — Daily Consciousness & Reflection App
// Full video content library embedded (90 videos)
// One video per day, rotates by date
// ═══════════════════════════════════════════════════════════════

const VIDEOS = [
  { file: " Bayyinah Bello.mp4", person: "Bayyinah Bello", title: "Spirituality is not a business", lines: ["The second you monetize the sacred, you've already lost it. Something shifts the moment a price tag appears. Real spiritual work happens in the spaces where nothing's being sold, where the only exchange is what moves through you and into someone else. It's not about being broke or rejecting value. It's about understanding that some things die the moment you try to own them. The medicine only works if it's freely given.", "Sit with this: Do one spiritual or creative thing today with no audience and no monetization attached."] },
  { file: "2pac trump.mp4", person: "2Pac", title: "Give, give, give", lines: ["Pac said the people with the most should give the most, and he wasn't being poetic. He meant it. There's something about holding onto things too tightly that makes you smaller, like the thing starts owning you instead of the other way around. The mystics always said the same thing in different words: attachment is the root of suffering, and the fastest way to free yourself is to open your hands. The people who move through the world the lightest figured out early that what you give away is the only thing that was ever really yours.", "Sit with this: Give something away today. Time, money, credit, whatever. Don't tell anyone you did it."] },
  { file: "2pac_real.mp4", person: "2Pac", title: "Real character, real person", lines: ["Real recognizes real because there's no other currency that actually matters. You can fake everything else on the surface, but character shows up in how you move when nobody's watching. It's the only thing that compounds over time, the only thing people actually remember about you when the noise fades. Your resume means nothing. Your integrity means everything.", "Sit with this: Choose the harder, more honest move today. That's the one people remember."] },
  { file: "2pac_rich.mp4", person: "2Pac", title: "I'm gonna go through it my way", lines: ["Going through hell on someone else's terms is just another kind of hell. The difference between surviving and actually living is whether you're moving through your own story or performing in someone else's script. Yeah, the path is brutal either way, but at least when you walk it your way, you own what comes out the other side. The permission you're waiting for was already inside you.", "Sit with this: Do the hard thing today the way only you would do it. Own the process."] },
  { file: "50cent.mp4", person: "50 Cent", title: "Crazy enough to believe it", lines: ["You have to be insane enough to believe in yourself when the entire world is betting against you. That's not delusion, that's faith, and there's a difference. Everyone who built anything real had to hold onto their vision when it looked ridiculous from the outside. The breakthrough only comes if you're willing to look foolish for long enough. Sanity is just consensus. Genius looks like madness until it doesn't.", "Sit with this: Act on the belief before you have proof. That's how proof gets made."] },
  { file: "60sHippie.mp4", person: "60s Hippie", title: "I just live", lines: ["Asked how he survives without a plan or resume or safety net, he just says 'I just live.' There's a radical simplicity in that response that most of us spend decades trying to circle back to. We layer on so many systems and contingencies and proof of worth that we forget the basic requirement was just to be here and figure it out as we go. The plan is the trap. The living is what frees you.", "Sit with this: Do one thing today without needing a reason for it. Just to see what happens."] },
  { file: "AQM4u2uf1F2WJinAECyy2gwp2RfCRIYko-0SM5a-d6Pa9Q3MKjsoAD7kSj5nhLjqrrKqnrZQk6ryktAZqKe9fBcGyCF1yac3LYEn8Nc.mp4", person: "Anonymous", title: "Turn around", lines: ["What are you running from? Turn around and look at where you've been, because the thing chasing you is usually just the thing you won't face. Most people spend their whole lives in forward motion trying to escape something that only has power because they won't turn to meet it. The hero's journey always requires the moment where you stop fleeing and face what scared you. That's when it transforms.", "Sit with this: Look back at one thing you've been avoiding. Just look. That's enough."] },
  { file: "Abbie Hoffman .mp4", person: "Abbie Hoffman", title: "Education is subversive", lines: ["Real education isn't training for a job, it's revolt. It teaches you to think instead of obey, to question instead of accept, to imagine alternatives instead of swallowing the world as given. The system doesn't fear your ignorance, it fears your awakening. True learning cracks you open in ways that make you dangerous to anyone who profits from your compliance.", "Sit with this: Learn one thing today that nobody asked you to learn."] },
  { file: "Adnre3000.mp4", person: "André 3000", title: "Stay on your path", lines: ["The path always felt strange to other people, and that strangeness was actually the clearest signal he was on the right one. Everyone who's done something singular has felt that same displacement, that sense that their way doesn't match the approved route. You can't be original and expected. If you're staying on your path, some people will think you're lost. You just have to know differently.", "Sit with this: Walk the weird path one more step today. Don't explain it."] },
  { file: "Andre3000concert.mp4", person: "André 3000", title: "Bring it where it isn't", lines: ["He plays flute in places nobody expects, brings the sacred instrument to spaces that never knew they needed it. That's the whole move: not just making the thing, but understanding where the world's hungry for it. The real work isn't about perfecting what already exists, it's about introducing something to the places that are starving for it without knowing.", "Sit with this: Put your work in front of an audience that wasn't asking for it. That's where it lands hardest."] },
  { file: "Anthony Bourdain.mp4", person: "Anthony Bourdain", title: "Pay attention", lines: ["Life becomes beautiful the moment you stop moving through it on autopilot and actually start paying attention. Most people miss their own existence because they're too busy checking boxes and moving to the next thing. The minute you slow down enough to notice the details, the light, the person in front of you, something shifts. Beauty isn't rare. Your awareness of it is.", "Sit with this: Look up today. Notice one ordinary thing like it's the first time."] },
  { file: "Asarci.mp4", person: "Asarci", title: "Knowledge of self", lines: ["Everyone's searching for the solution outside themselves, looking for the teacher or the system or the answer, when it's been available the whole time. The only real knowledge that matters is knowledge of self. You already contain everything you need to understand. The work isn't about getting smarter, it's about seeing clearly what was already there.", "Sit with this: Ask yourself what you actually believe today, not what you've inherited."] },
  { file: "Bob_dylan_magic.mp4", person: "Bob Dylan", title: "Magically written", lines: ["He doesn't know how he wrote his early songs, says they came through him magically. That's the real description of creation: not something you do through force and effort, but something that moves through you when you get yourself out of the way. The best work always feels like it wrote itself. Your only job is to be a clean enough channel to let it through.", "Sit with this: Get out of your own way today. Let something move through you instead of out of you."] },
  { file: "Brian_eno_econmics.mp4", person: "Brian Eno", title: "A poverty of ideas", lines: ["When he looks at economics, he sees a poverty of ideas, everyone endlessly repeating the same script like it's the only story available. The real crisis isn't resources, it's imagination. We're trapped in a loop of thinking that's been recycled so many times nobody remembers it's just one possibility among infinite ones. Breaking out requires someone brave enough to imagine differently.", "Sit with this: Question one 'this is just how it works' assumption in your field today."] },
  { file: "Brian_eno_whyart.mp4", person: "Brian Eno", title: "Art is how we imagine futures", lines: ["Art is how we digest the new, how we sort out what we actually feel about what's coming next. It's the space where we get to feel our way through change before we have to live it. Artists are basically processing what's already shifting in the collective, translating it into something we can actually understand. That's why it always feels like art's ahead of reality. It usually is.", "Sit with this: Make something today that helps you feel out a future you can't quite see yet."] },
  { file: "Cassavetes.mp4", person: "John Cassavetes", title: "We don't make films for them", lines: ["He refused the studios because he knew their involvement would have destroyed the work, would have turned it into something safe and palatable. Sometimes the only way to protect the integrity of what you're making is to refuse the resources that come with strings. The most pure creations happen in the margins, in the spaces where nobody important is watching.", "Sit with this: Turn down something today that would compromise the thing you're actually trying to build."] },
  { file: "Charles Bukowski.:om Waits.mp4", person: "Charles Bukowski / Tom Waits", title: "Be on the watch", lines: ["Your life is your life. Don't let it be clubbed into submission by what's expected of you, don't let it get dank and small. There are always ways out if you're paying attention. Most people accept the slow death because they can't imagine an alternative. But there are people everywhere who chose differently, who figured out escape routes. You're capable of that too.", "Sit with this: Take the chance that's been quietly sitting in front of you. The gods will offer you chances. Know them."] },
  { file: "Comedian.mp4", person: "Comedian", title: "Bored is being yourself", lines: ["Just be yourself. If people don't like it, that's actually the message working. The version of you that's approved by everyone is the version that disappeared a long time ago. Being boring is the price you pay for trying to please too many people at once. Your actual self, your weird specific self, is the only thing you have that nobody else can replicate.", "Sit with this: Drop the performance for one conversation today. See who stays."] },
  { file: "DENNIS HOPPER.mp4", person: "Dennis Hopper", title: "If it were denied you", lines: ["If you were denied the ability to create, would you actually die? Because the answer to that question tells you everything about what you need to be doing. Most people go through life never having to face what they'd truly perish without. But the people who know the answer to this question, who've felt that urgency, they're the ones who make things that matter.", "Sit with this: Find out today if you want to create or if you need to. Then act accordingly."] },
  { file: "DMX GOD.mp4", person: "DMX", title: "He won't walk you to what He won't walk you through", lines: ["God won't walk you to anything He won't walk you through. You're not in over your head. You're just somewhere you've never been, and that always feels like drowning right before you realize you can stand. Every protagonist in every story had to enter the cave alone, and every one thought they weren't ready. The fear isn't a warning, it's an invitation to become who you're supposed to be.", "Sit with this: Whatever situation has you spinning right now, you were built for it. Stop second-guessing and start moving."] },
  { file: "Damendash.mp4", person: "Dame Dash", title: "Bad breath", lines: ["Everyone around him was corny and manipulative, smelled like desperation trying to pass itself off as connection. Sometimes you have to recognize the bad energy and walk away, even when it's surrounded by status and access. The people worth knowing don't carry that stale, stagnant vibe. Trust your instinct when something feels off. It usually is.", "Sit with this: Notice which rooms drain you today. That's data, not drama."] },
  { file: "David Bowie.mp4", person: "David Bowie", title: "Don't title it after", lines: ["Artists who title their work after they finish didn't know what they were making while they were making it. The best creations come from moving without a predetermined endpoint, following the thread and trusting what emerges. The second you name something too early, you stop discovering it. Let the thing complete itself before you decide what it means.", "Sit with this: Start something today without naming it. Let it tell you what it is."] },
  { file: "David Whyte,.mp4", person: "David Whyte", title: "How do you know you're on your path", lines: ["You know you're on your path because it disappears. You can't see where you're going, everything you leaned on is gone, you're suspended between what was and what's becoming. That's not a sign you're lost. That's exactly the signal you're exactly where you need to be. The path that's visible and safe is someone else's path. Yours only announces itself when you're brave enough to move blind.", "Sit with this: Sit with the disorientation today. It's evidence, not failure."] },
  { file: "David lynch interview Harry dean actor.mp4", person: "David Lynch & Harry Dean Stanton", title: "There's no self", lines: ["Asked to describe yourself, there's nothing there, there's no self. That's not nihilism, that's freedom. The self you're so busy protecting and promoting is mostly just a collection of patterns you inherited and stories you believed. The moment you stop treating it like a solid thing that needs defending, you become available to everything else. There's so much more space when you're not so convinced of your own realness.", "Sit with this: Do one thing today with no thought of how it'll be remembered."] },
  { file: "DavidLynch_today.mp4", person: "David Lynch", title: "Theater of the absurd", lines: ["Today is a great time to be alive if you love the theater of the absurd. Reality's gotten so strange that the surreal has basically become the baseline. The people who are surviving are the ones who can find the dark humor in it, who can hold both the terror and the comedy at the same time. The world's not ending, it's just finally admitting what it always was.", "Sit with this: Find the comedy in the chaos today. It's a form of survival."] },
  { file: "David_bowe_art.mp4", person: "David Bowie", title: "The new construction", lines: ["He embraced the demystification between artist and audience, created a new construction where the line between creator and witness blurred. He understood that the future wasn't about gatekeeping the mystery, it was about inviting people into the process. That openness is what made him actually revolutionary. The power wasn't in being distant and unknowable, it was in being radically accessible.", "Sit with this: Let someone in on the process today, not just the polished result."] },
  { file: "DenzelWashington.mp4", person: "Denzel Washington", title: "Not healthy", lines: ["You can't build a life based on what other people think about you. It's not healthy, it's slow suicide dressed up as responsibility. At some point you have to decide whose opinion actually matters, and for most people that list should be surprisingly short. Your peace of mind is worth more than their approval.", "Sit with this: Make one decision today purely for yourself. No committee required."] },
  { file: "EL Gunna•Liberation X peace (Intro).mp4", person: "El Hajj Malik", title: "Liberation, not peace", lines: ["You can have peace and still be enslaved. Peace without freedom is just submission that's learned to be quiet. Liberation is the actual goal, and it costs more than most people want to pay. But slavery with a smile is still slavery. Some of us would rather be turbulent and free.", "Sit with this: Choose freedom over comfort today, even in something small."] },
  { file: "Erykabadu_authenticyt.mp4", person: "Erykah Badu", title: "Authenticity is the strongest power", lines: ["Authenticity is the strongest power of attraction on earth. Not beauty, not status, not whatever the algorithm is selling this week. The people who command actual presence are the ones who stopped performing and started being. There's a magnetism that comes with just being unapologetically yourself that no filter can replicate.", "Sit with this: Stop performing today. Watch what changes."] },
  { file: "ErykahBadu-people.mp4", person: "Erykah Badu", title: "85, 10, and 5", lines: ["85 percent follow, 10 percent create, 5 percent observe and pull the strings. Most people spend their whole lives in the first category, believing that's just how it's set up. It is set up that way, but only because most people never notice the 5 percent and what they're actually doing. You don't have to stay in the percentage you were born into.", "Sit with this: Decide which percentage you're operating in today. Then move."] },
  { file: "Erykahbadu_evolution.mp4", person: "Erykah Badu", title: "A 24 hour job", lines: ["Being your highest self isn't something you do on Mondays and Wednesdays, it's a 24 hour, 7 day a week job. It's a practice, not a destination. The moment you think you've arrived is the moment you start declining. The people who stay elevated are the ones who treat it like a discipline, like meditation, like something you recommit to every single day.", "Sit with this: Do one small thing today that the next version of you would thank you for."] },
  { file: "Erykahbadu_leave.mp4", person: "Erykah Badu", title: "Leave the corpse", lines: ["Every time you evolve, you have to die. You have to leave the old version behind, even the beautiful one, even the one people loved. Staying attached to who you were is just slow decomposition. The work is in learning to grieve yourself while celebrating who you're becoming. That's the real courage. The mask that protected you in the last chapter will suffocate you in the next one.", "Sit with this: Let one old version of yourself go today. Don't grieve it. Just walk."] },
  { file: "Erykahbadu_shadow.mp4", person: "Erykah Badu", title: "It's okay to feel bad about doing the right thing", lines: ["Leaving a situation you genuinely enjoy that just isn't fruitful anymore, doing the right thing but mourning what it costs. That's allowed. You can do what you need to do and still feel the loss. Maturity isn't about being able to make clean cuts without feeling anything. It's about moving forward while honoring that something real is ending.", "Sit with this: Do the right thing today even though it'll sting. Feel it anyway."] },
  { file: "EvelKnievel.mp4", person: "Evel Knievel", title: "Not that heaven", lines: ["He didn't want the kind of heaven the preachers described, all passive and serene. He wanted to feel alive, to push it, to risk it all. There's a spirituality in that too, in refusing the safe version and demanding something more vivid and real. Courage is its own kind of transcendence.", "Sit with this: Define what you're actually building toward today. In your own words, not theirs."] },
  { file: "Fran Lebowitzd 1.mp4", person: "Fran Lebowitz", title: "Closest to being a god", lines: ["Writing a book is the closest thing to being a god, creating something from nothing, breathing it into existence, watching it become its own world. That's the real alchemy, not turning lead to gold, but turning blank pages into entire universes. Every creator knows that feeling of being a channel for something that wants to exist.", "Sit with this: Start one tiny thing from scratch today. Anything. The act matters more than the artifact."] },
  { file: "FrankZappa.mp4", person: "Frank Zappa", title: "Two things", lines: ["Don't stop and keep going. When you finally get there, it's still tough, the ground still shifts, there's always another mountain. The people who stay relevant figured out that the work never ends, you just get better at enjoying it. The destination doesn't exist. The only thing that matters is whether you still want to move.", "Sit with this: Just don't stop today. That's the whole instruction."] },
  { file: "Gil Scott-Heron.mp4", person: "Gil Scott-Heron", title: "Change your mind first", lines: ["The revolution, he said, won't be televised. But before it happens anywhere else, it happens in your head. You can spend your whole life waiting for the world to shift, or you can start by getting curious about what you actually believe and why. Most of us inherit our thoughts like hand-me-downs, never questioning if they fit. The work begins in the quiet, in the moment you decide to think differently about something that matters to you.", "Sit with this: Change one thought today before you try to change one situation."] },
  { file: "Harmony Korine .mp4", person: "Harmony Korine", title: "Six to eight weeks in 20 days", lines: ["Time isn't linear when you're fully present. You can compress experiences, stretch moments, live more in less. The obsession with productivity misses something essential: depth happens when you stop counting hours and start counting what actually moved you. There's a freedom in accepting that some seasons happen fast and some slow, and both are teaching you something about how to be alive.", "Sit with this: Move faster than your inner critic today. Finish before it catches up."] },
  { file: "JAyz.mp4", person: "Jay-Z", title: "Skill in a human body", lines: ["Mastery is humble. It's showing up, grinding, becoming so good at your craft that the struggle becomes invisible to people watching. Your hands know what to do before your mind catches up. This is how you move through the world with real power, not the kind that needs to announce itself. Skill is freedom because it means you're not dependent on anyone else's permission or approval.", "Sit with this: Show up to your craft today like the gift is bigger than you. Because it is."] },
  { file: "JZ.mp4", person: "Jay-Z", title: "Far ahead of my time", lines: ["Vision is a lonely place sometimes. You see where things are going before most people catch up, and that gap can feel isolating. But that's exactly what creates change. You're not ahead of your time to win a prize, you're ahead because you're paying attention to what's actually happening beneath the surface. The people who shape culture aren't trying to be trendy, they're just following what feels true.", "Sit with this: Make a move today only your future self will understand."] },
  { file: "James Baldwin_love.mp4", person: "James Baldwin", title: "If they had, they'd treat their children differently", lines: ["Compassion is what happens when you realize someone's harshness usually comes from their own wound. Understanding this doesn't excuse cruelty, but it shifts how you carry anger. When you see someone clearly, without the veil of blame, something in you softens. This is radical because it means taking responsibility for your own healing instead of waiting for an apology that might never come.", "Sit with this: Love someone today in a way that shows up in how you act, not just how you feel."] },
  { file: "JamesBrown.mp4", person: "James Brown", title: "I smell good, I feel good", lines: ["There's a sophistication in celebrating yourself without apology. Not arrogance, but the simple act of knowing your worth and moving accordingly. When you feel good in your body, in your choices, in who you are, it changes everything. The work isn't about becoming someone else or earning the right to feel pride. It's about stopping the habit of diminishment and letting yourself be fully here.", "Sit with this: Take care of the vessel today before you ask it to perform."] },
  { file: "Jean-MichelBasquiat Anger.mp4", person: "Jean-Michel Basquiat", title: "I don't remember", lines: ["Forgetting is underrated. You don't need to carry every history, every slight, every moment of shame. The mind that holds onto everything becomes a museum of pain. There's freedom in selective amnesia about things that no longer serve you. This isn't about denial, it's about choosing what gets to take up space in your consciousness. Let the past teach you, then let it go.", "Sit with this: Take an emotion you can't fully explain and put it into the work today anyway."] },
  { file: "JerrySeinfeld_money.mp4", person: "Jerry Seinfeld", title: "How cool is your job", lines: ["The mundane contains everything if you look at it right. A conversation, a commute, the way light hits your desk. The cool part isn't the job itself, it's the attention you bring to it. Most people sleepwalk through their lives looking for something extraordinary when the extraordinary is already here, happening in the smallest details.", "Sit with this: Measure your day today by how cool the work was, not what it paid."] },
  { file: "JimCarrey1.mp4", person: "Jim Carrey", title: "Most meaningless thing I could find", lines: ["Sometimes you have to go all the way into the absurd to understand what matters. Taking things seriously all the time is its own trap. Laughter and play aren't distractions from the work of being human, they're essential to it. The boundaries you think are solid dissolve when you stop protecting them. Permission to be ridiculous is permission to be free.", "Sit with this: Take something seriously enough today to find it absurd. That's where freedom lives."] },
  { file: "John Kanary.mp4", person: "John Kanary", title: "State of vibration", lines: ["Everything is frequency. Your mood shapes what you attract, who you meet, what opportunities show up. This isn't magical thinking, it's basic physics dressed in practical language. You radiate something, and the world responds in kind. The work is subtle: cleaning up your thoughts, your words, the energy you bring into a room. When you shift your vibration, the whole picture changes.", "Sit with this: Raise your frequency today before you change your circumstances."] },
  { file: "JuiceWorld.mp4", person: "Juice WRLD", title: "Slavery is mental now", lines: ["The chains you can't see are the hardest to break. Your thoughts can trap you better than any external force. The people around you might be free on paper, but enslaved by habits, by beliefs they inherited, by the stories they tell about what's possible. The real work is noticing where you've internalized the limitation. Freedom starts with recognizing the cage is often one you're maintaining yourself.", "Sit with this: Take back 30 minutes from a feed today and give it to your own mind."] },
  { file: "KRS1-Revolution.mp4", person: "KRS-One", title: "Control the information", lines: ["Knowledge is power because it shapes your entire reality. What you consume, who you listen to, where you get your truth from, all of this matters profoundly. You're surrounded by people trying to shape your understanding of the world. The resistance begins with curiosity, with asking deeper questions, with seeking sources that actually illuminate instead of just validate. Your thinking is the most valuable real estate you own.", "Sit with this: Change one input today. A book, a feed, a person you let close."] },
  { file: "KarlLagerfeld_vintage.mp4", person: "Karl Lagerfeld", title: "You become vintage", lines: ["Time is the ultimate editor. What seemed essential drops away, and what was true remains. The work you put in, the style you develop, the person you're becoming right now, it all gets tested by seasons. Excellence doesn't chase trends because trends fade. When you focus on depth and quality over novelty, you naturally become the thing people return to. This is how you build something that lasts.", "Sit with this: Do something today only the present version of you could make. Don't go vintage."] },
  { file: "Kurt Cobain _wealth.mp4", person: "Kurt Cobain", title: "Second-hand stores", lines: ["There's an honesty in what's worn, used, lived in. Everything perfect and new has a sterility to it. Second-hand things have stories, they've been tested, they carry the marks of actual use. This is true of people too. The person who's survived something, who's not afraid to show the cracks, has more integrity than the person still performing perfection. The most beautiful things aren't always the newest.", "Sit with this: Find joy in something small and unbought today."] },
  { file: "LOUISE BOURGEOIS.mp4", person: "Louise Bourgeois", title: "If it doesn't touch you, I have failed", lines: ["Art, work, connection, meaning, it all has to move you. If it's just technically perfect but leaves you unmoved, it's empty. This is the standard to hold everything to. Does this relationship touch me? Does this job matter to my soul? Am I making work that actually lands? The craft matters but only in service of something deeper. You're looking for resonance, for that feeling of being truly reached.", "Sit with this: Let the work speak today. Resist the urge to caption it."] },
  { file: "LaurenHill Don't be afraid.mp4", person: "Lauryn Hill", title: "Don't get stuck on the peak", lines: ["The moment you think you've arrived is the moment you stop growing. Every achievement is a platform for the next question, not a place to rest. The people who keep evolving are the ones who never get too comfortable at the top. Attachment to a particular version of success locks you in place. The real work is staying hungry, staying curious, knowing that the peak was just a waypoint.", "Sit with this: Climb down today. The next mountain needs you."] },
  { file: "LaurenHill truth.mp4", person: "Lauryn Hill", title: "Same boat", lines: ["We're all in it together, dealing with the same fundamental fears and longings. Your struggle isn't unique in its pain but in how you meet it. This realization is humbling and liberating at once. The moment you stop believing your suffering is special and start seeing it as part of the human experience, something shifts. You're not alone.", "Sit with this: Drop the act with one person today. See what opens up."] },
  { file: "Liam_gallagher.mp4", person: "Liam Gallagher", title: "Look cool, write good", lines: ["Substance and style aren't enemies. You can care about how you present yourself and what you actually have to say. The best work has both a visual language and depth. When you develop a strong point of view, it shows in everything, not just your art. Confidence comes from knowing what you believe and expressing it clearly. The cool part isn't the facade, it's the conviction underneath.", "Sit with this: Pay attention to the form today, not just the content."] },
  { file: "Lil Wayne -repetition.mp4", person: "Lil Wayne", title: "Repetition is the father of learning", lines: ["Mastery looks like doing the same thing over and over until your body knows it, until it becomes second nature. There's no shortcut to deep skill. The myth of the prodigy ignores the endless repetition that made them dangerous. Your discipline isn't boring, it's the price of actually becoming good. Show up the same way, with the same commitment, and eventually you transform into the thing you're practicing.", "Sit with this: Do the boring rep today. Then do it again."] },
  { file: "LilB_reading.mp4", person: "Lil B", title: "Don't shut down", lines: ["Staying open is harder than closing. The world will offer you reasons to harden, to protect yourself, to stop feeling so deeply. But the moment you shut down is the moment you stop creating, stop connecting, stop being alive in the way that matters. Vulnerability is the opposite of weakness. It's the only way anything real gets built. Keep your heart available even when it would be easier to lock the door.", "Sit with this: Try one thing you've never tried today. Anything. Stay open."] },
  { file: "Lou Reed.mp4", person: "Lou Reed", title: "Something to do", lines: ["Purpose doesn't have to be grand. Sometimes it's just something to do that engages your hands and your mind. Work that matters is work that keeps you from dying of boredom and despair. It doesn't have to change the world, it just has to matter to you enough to show up for it. The freedom is in finding whatever it is that makes you want to be here.", "Sit with this: Make something today just to make it. No bigger reason required."] },
  { file: "MFDoom_follow.mp4", person: "MF DOOM", title: "Follow your heart", lines: ["The intellect is smart but the heart is wise. You can think your way into a corner, but your heart knows things before your mind catches up. The people who trusted their gut over the logical path are the ones who created something original. This doesn't mean ignore your mind, but give weight to what your deeper self is telling you. Intuition is just information arriving before you can prove it.", "Sit with this: Follow the instinct today that doesn't make sense to anyone else."] },
  { file: "Mac Miller Wirrd.mp4", person: "Mac Miller", title: "Weird and a heart", lines: ["The combination of strangeness and tenderness is what makes someone magnetic. You don't have to be conventional to be valuable. The parts of you that don't fit the mold, that see things differently, that feel things deeply, those are your edges. That's where your power lives. When you stop trying to sand down your weirdness and instead pair it with genuine care, you become unforgettable.", "Sit with this: Be both today. Weird and kind. That's the whole thing."] },
  { file: "Marcus Aurelius.mp4", person: "Marcus Aurelius", title: "The obstacle is the way", lines: ["What's in your way is the way. The resistance you're facing isn't keeping you from your path, it is your path. Every limitation teaches you something about who you are and what you're capable of. The people who move through obstacles with curiosity instead of resentment come out the other side transformed. The work isn't to remove the obstacle, it's to move through it with grace and learn what it's here to teach.", "Sit with this: Walk straight at the obstacle today. It's the curriculum."] },
  { file: "MosDef_heart.mp4", person: "Mos Def", title: "Heartbroken means your heart is working", lines: ["Pain is the price of engagement. If you've never had your heart broken, you haven't loved fully. This is how you know you're alive and capable of connection. The people who've survived heartbreak and didn't harden are the ones with the most to offer. Grief and joy are interwoven. You don't get one without the capacity for the other. The work is feeling it all without getting stuck in the feeling.", "Sit with this: Trust the part of you that refuses to get used to it. That's your compass."] },
  { file: "Mr.Rogers1996.mp4", person: "Mister Rogers", title: "Goosebumps", lines: ["That feeling of recognition, when something resonates so deeply you get chills, that's you knowing something true. It's a physical response to encountering something that matches who you are or who you're becoming. Trust that feeling. It's rare and real. Most noise passes through us without that reaction. When something gives you goosebumps, pay attention. It's showing you where your real values live.", "Sit with this: Be gentler than the situation requires today. Watch what happens."] },
  { file: "Nan Goldin .mp4", person: "Nan Goldin", title: "Put down your phone", lines: ["You can't see what's in front of you if you're looking through a screen. Presence requires putting the device down and meeting the moment without mediation. The life you're living right now, with real people, with genuine sensations, with actual light and sound, that's the art. Documentation matters less than experience. You don't need to record everything to prove it happened. Let yourself just be there.", "Sit with this: Have one conversation today with no phone in the room."] },
  { file: "Nas-Belly.mp4", person: "Nas", title: "Live righteously", lines: ["There's a power in knowing you're doing the right thing even when no one's watching. Integrity isn't performative, it's something you maintain with yourself first. The hunger that drives you should come from internal conviction, not external validation. Live in a way that you respect when you're alone with yourself. This is the foundation everything else is built on. Everything else is just echoes.", "Sit with this: Do the right thing in the small invisible moment today."] },
  { file: "NeemKarolbaba.mp4", person: "Neem Karoli Baba", title: "Two tears", lines: ["Compassion can break you open. When you really witness someone's suffering without turning away, something cracks. The saintly people aren't the ones who never feel overwhelmed by the world's pain, they're the ones who let themselves feel it and stay open anyway. This is not weakness. This is the strength it takes to love in a broken world. Two tears and you've understood something essential about being human.", "Sit with this: Sit in stillness for five minutes today. Don't do anything. Just be there."] },
  { file: "Nipsey needs.mp4", person: "Nipsey Hussle", title: "Pyramid of needs", lines: ["You have to build a foundation before you can build a tower. Each level matters. You can't skip the ground floor and go straight to the top. The people who seem to appear overnight actually spent years putting in invisible work on the basics. Understand your own pyramid. What needs to be stable before you can reach for what's next? The work is unglamorous, it's foundational, it's essential.", "Sit with this: Take care of the foundational thing you've been ignoring today."] },
  { file: "NipseyHussel Power.mp4", person: "Nipsey Hussle", title: "Three Magic Words", lines: ["There's a difference between knowing you have power and actually using it. Most people sleepwalk through their creative force, waiting for someone to give them a title or a platform before they act. But the power was always there. You don't need a certification to be a creator. You just need to start creating. The people who changed the game didn't wait for permission, they gave it to themselves.", "Sit with this: Act like the creator of your own situation today. Because you are."] },
  { file: "Noam CHomsky.mp4", person: "Noam Chomsky", title: "Challenge authority", lines: ["Question everything, especially the things that feel most true. Authority survives on your compliance and your assumption that someone else knows better. But you have access to your own clarity if you take time to develop it. The resistance begins with skepticism, with asking who benefits from you believing this, with refusing to accept someone's expertise as a substitute for your own thinking. You're smarter than you've been told to believe.", "Sit with this: Ask one authority today to justify itself. Boss, algorithm, tradition."] },
  { file: "Pharell_insignificance.mp4", person: "Pharrell", title: "The insignificance of you", lines: ["You're not the center of the universe and that's actually liberating. Your problems are real but small in the scheme of things. This perspective doesn't make your life less meaningful, it makes it more free. You don't have to carry the weight of being important all the time. You can just be here, doing your thing, and let the universe do what it does. Insignificance is another word for freedom from constant judgment.", "Sit with this: Zoom out today until your problems shrink to scale. Then go play."] },
  { file: "PitBull.mp4", person: "Pitbull", title: "Short steps, long vision", lines: ["You don't have to see the whole staircase to take the first step. Vision is important but it can paralyze you if you're waiting for perfect clarity. The work is taking the next small action while keeping the bigger picture in your peripheral. This is how momentum builds. You don't arrive anywhere by standing still and thinking about it. Every single step, taken with intention, moves you closer to somewhere that matters.", "Sit with this: Take one small step toward the long thing today."] },
  { file: "Prince_bday.mp4", person: "Prince", title: "Don't celebrate the day I die", lines: ["Live in a way where your presence matters more than your absence ever could. Do the work now, show up now, love now. Don't defer your best self to some imaginary future or wait for some moment of recognition. The waste isn't in dying, it's in not fully living before that happens. Your legacy isn't what people say about you after you're gone. It's what you do while you're here.", "Sit with this: Opt out of one tradition today that never fit. You're allowed."] },
  { file: "Prince_internet.mp4", person: "Prince", title: "Don't let the computer use you", lines: ["Tools are meant to serve your vision, not replace it. The technology is supposed to be an extension of your will, not a substitute for it. When the tool becomes the master, you've lost yourself. Master the technology enough to make it do what you want, then forget about it and focus on what you're actually trying to create. The best work has a person behind it, not an algorithm.", "Sit with this: Use the device today. Don't let it use you. There's a war for the soul."] },
  { file: "RZA_truth.mp4", person: "RZA", title: "Live the truth, teach the truth", lines: ["There's a difference between knowing something and living it so completely that it becomes contagious. Truth isn't a concept you hold in your mind, it's a frequency you emit into the world. When you stop performing the version of yourself people expect and just become real, other people feel permission to do the same. It's the most powerful teaching there is because it doesn't require words. You become the proof that another way is possible.", "Sit with this: Live what you already know to be true today. That's the bar."] },
  { file: "RickOwens_broke.mp4", person: "Rick Owens", title: "I can be poor", lines: ["Poverty isn't a tragedy if you're not afraid of it. The moment you make peace with having nothing, everything changes. The rich are haunted by the fear of losing what they have. The free are the ones who've already let it go. This isn't about martyrdom or rejecting beauty. It's about understanding that your worth isn't negotiable, that you're not less if the world takes everything away. That kind of groundedness is its own kind of wealth.", "Sit with this: Make a decision today that prioritizes the work over the money."] },
  { file: "RickOwens_life.mp4", person: "Rick Owens", title: "A reaction to intolerance", lines: ["Intolerance always comes from fear of the unknown, and fear feeds on silence. The antidote isn't anger back at anger, it's the steady expansion of what you're willing to see and understand. When you meet rigidity with curiosity instead of judgment, something shifts. You're not trying to convince anyone. You're just showing them that there's more room in the world than they thought. That kind of generosity is radical.", "Sit with this: Build a door today for someone who's been locked out."] },
  { file: "Saul Williams I know god.mp4", person: "Saul Williams", title: "I know god", lines: ["God isn't a person sitting somewhere keeping score. God is the aliveness in everything, the consciousness that moves through you when you're fully present. You don't need to find it outside yourself because it's already running through your blood. The mystics said it centuries ago in every language: divinity isn't distant, it's intimate. It's the breath you're taking right now. Most people spend their whole lives looking for something they're already made of.", "Sit with this: Trust what you've actually felt today over what you've been told."] },
  { file: "Saul_willaims.mp4", person: "Saul Williams", title: "We get the leaders we deserve", lines: ["This isn't cynicism, it's accountability. The leaders we follow reflect what we're willing to tolerate, what we've stopped questioning, what we're too comfortable to challenge. Real change doesn't happen from the top down, it happens when enough people decide they're not going to play small anymore. Every choice you make about who you are and what you stand for is an act of leadership.", "Sit with this: Celebrate someone who deserves it today instead of someone who's loud."] },
  { file: "Snoop Dogg_speach.mp4", person: "Snoop Dogg", title: "Stay humble, hungry, true", lines: ["Humility keeps you sharp because it keeps you learning. Hunger keeps you moving because you remember why you started. Truth keeps you sane because you don't have to remember lies. These three things together are a way of life, not a motto. Arrogance closes the door to new information. Satisfaction kills momentum. Stay humble, hungry, true, and you stay alive.", "Sit with this: Remember where you came from today. Then go further."] },
  { file: "Style - Charles Bukowski.mp4", person: "Charles Bukowski", title: "Style is the answer to everything", lines: ["Style isn't about fashion or aesthetics. It's about how you show up. It's the fingerprint of your soul on everything you do. Two people can do the exact same thing and one will have style and one won't because style is honesty. It's the refusal to pretend. It's doing your thing so completely that there's no room for apology or explanation. The people with real style aren't trying to look good, they're too busy being real.", "Sit with this: Do one ordinary thing today with full style. That's the answer to everything."] },
  { file: "Terrance MCKenna 1999.mp4", person: "Terence McKenna", title: "Weirder and weirder", lines: ["Reality is already stranger than anything you could make up. The universe is weirder than we have the capacity to imagine, and getting weirder the deeper we look. Instead of fighting that strangeness or pretending the world is simpler than it is, you could embrace it. Weirdness is just truth that doesn't fit into comfortable categories. The people who change things are usually the ones weird enough to see what others can't.", "Sit with this: Name the weirdness out loud today instead of pretending it's normal."] },
  { file: "Tupac Hell.mp4", person: "Tupac", title: "Karma comes back", lines: ["You don't need a cosmic referee to make this true. The energy you put out shapes the reality that comes back to you, not because the universe is keeping score but because you become the kind of person who attracts that energy. If you move through the world with suspicion, you'll see betrayal everywhere. If you move with openness, opportunity finds you. Your choices become your circumstances become your life.", "Sit with this: Do the thing today you can stand behind in ten years."] },
  { file: "Tupac push .mp4", person: "Tupac", title: "Outside the boundaries", lines: ["The boundaries that hold you are mostly invisible because you agreed to them so long ago you forgot you were choosing. You learned what was possible and what wasn't from people who were doing the same thing. But the truth is there's always more room than you think. The people who move the furthest are the ones who get uncomfortable with how small their box has gotten. They step outside. They find out the wall was made of paper.", "Sit with this: Cross one line today that isn't yours. See what's on the other side."] },
  { file: "Tyler, The Creator_crazy.mp4", person: "Tyler, the Creator", title: "You have to be delusional", lines: ["There's a gap between who you are and who you could become, and the only thing that bridges that gap is belief. Not hope. Belief. Belief that's so clear and complete that it doesn't need evidence yet. The world will tell you what's realistic, what's proven, what's already been done. But everything that exists was delusional once, before it wasn't. You have to believe in yourself harder than reality currently supports.", "Sit with this: Protect your delusion today. Surround it with people who don't try to fix it."] },
  { file: "Vivienne_status.mp4", person: "Vivienne Westwood", title: "Buy less", lines: ["The less you own, the more attention you can give to each thing. Quality changes when quantity drops. You actually know your clothes. You actually wear what you own. There's a kind of freedom in that scarcity, a kind of richness in having only what you love. Most of the clutter in our lives is low-grade anxiety wearing the costume of choice. Buy less, own what matters.", "Sit with this: Want less today. Use what you already have."] },
  { file: "Werner Herzog.mp4", person: "Werner Herzog", title: "Running out of fantasy", lines: ["Imagination isn't infinite like people pretend. If you spend it all on screens and stories that aren't yours, you'll look up one day and find you've used it up. The world needs people who've preserved their fantasy, their capacity to envision what isn't here yet. This means being selective about what gets your attention. The people with real vision are the ones who protected their imagination like it was precious, because it is.", "Sit with this: Work today even when the well feels empty. It refills through use, not rest."] },
  { file: "Yohji Yamamoto copy.mp4", person: "Yohji Yamamoto", title: "Copy until you find yourself", lines: ["The path to originality doesn't start with trying to be different. It starts with admiration. You study what you love until your hands know it, until it gets absorbed into your muscle memory and comes out the other side as something new. Imitation is just the first language you learn. At some point the student becomes the thing and stops needing the model.", "Sit with this: Copy something you love today openly. Watch what becomes yours."] },
  { file: "YohjiYamamoto_profit.mp4", person: "Yohji Yamamoto", title: "Comfortable profit is enough", lines: ["The insatiability that chases bigger and bigger wins is a hole you can never fill. But a life built around something you love that sustains itself is a kind of victory no amount of money can replicate. There's a point where more becomes heavy instead of fulfilling. The artists and makers who last are the ones who figured out they don't need to dominate, they just need to survive doing what matters.", "Sit with this: Define your enough today. Then stop chasing past it."] },
  { file: "YohjiYamamoto_property.mp4", person: "Yohji Yamamoto", title: "My most gorgeous moment", lines: ["Beauty doesn't announce itself. It's not the loudest thing in the room. Sometimes your most gorgeous moment will be quiet, will pass in the time it takes to breathe, will be visible only to you and maybe one other person. The world trains you to make everything bigger and more visible. But the moments that actually transform you are usually the small ones. The ones you almost miss.", "Sit with this: Locate your most gorgeous moment today. Spend more time there."] },
  { file: "ZackDeLaRocha_history.mp4", person: "Zack de la Rocha", title: "Inheritors", lines: ["You didn't invent the struggle you're in. You inherited it. And you're going to hand it forward to whoever comes next. The question is what you do with it while it's in your hands. Do you make it smaller or bigger? Do you solve it or pass along the pain? You have more agency in this than you think. The people who changed things were the ones who decided their moment mattered.", "Sit with this: Look at the inheritance today, not just the inventory."] },
  { file: "alexanderBell.mp4", person: "Alexander Graham Bell story", title: "Trying to help one person", lines: ["The big impact usually starts so small you wouldn't notice it if you weren't paying attention. One person. One problem. One authentic attempt to help. You don't need to know how it scales. You don't need a five-year plan. You just need to care about someone enough to keep trying until something shifts. The great changes in the world are just accumulated moments of someone deciding that one person mattered enough.", "Sit with this: Solve a problem today for one specific person you care about."] },
  { file: "andyWarhol.mp4", person: "Andy Warhol", title: "I ran out of ideas", lines: ["The second you think you've figured out what art is supposed to be, you've already closed a door. The moment you stop being confused is the moment you stop creating. Everything becomes a copy of the copy. The real work happens in the space of not knowing, where you're willing to try something because you have no idea if it will work. Once you've run out of ideas, you have to start looking at what everyone else throws away.", "Sit with this: When you run out of ideas today, make something about that."] },
  { file: "bjork_pleaes.mp4", person: "Björk", title: "Don't try to please anyone", lines: ["The moment you're conscious of an audience is the moment you become smaller. You start editing yourself, filtering out the weird parts, smoothing the rough edges. But the parts of you that don't fit neatly are usually where your power is. The greatest work comes from people who were too busy following their own impulse to check whether anyone would like it. That kind of freedom shows.", "Sit with this: Make the thing you want today. Let the audience find you."] },
  { file: "davidLynch_meditaion.mp4", person: "David Lynch", title: "Sweetest nectar", lines: ["There's a difference between consuming something and being nourished by it. Most of what we consume leaves us empty because it was made to, because keeping you hungry is the business model. But there are things, moments, experiences, that actually feed you. They're usually quieter. They require your attention. Real sweetness is something you have to slow down enough to taste. That slowness is its own kind of rebellion.", "Sit with this: Sit quietly for ten minutes today. Just to taste it."] },
  { file: "johncleese.mp4", person: "John Cleese", title: "Fear of mistakes", lines: ["Creativity requires failure. That's not inspirational talk, that's mechanical fact. The people frozen by the fear of being wrong never learn how to be right. They're stuck at the drawing board of their own anxiety. But if you make mistakes in the open, in front of people, in front of yourself, you move. You iterate. You find out what works because you find out what doesn't. The safety you're protecting yourself with is the same safety that keeps you small.", "Sit with this: Do something today where you might look ridiculous. That's the entry fee."] },
  { file: "ohn Lydon on authentic.mp4", person: "John Lydon", title: "I don't give a shit what you think", lines: ["This isn't arrogance. It's clarity. The second you start filtering yourself based on the anticipated judgment of strangers, you've already lost. You're not making for them anymore, you're making against them. But the moment you make for yourself completely, something shifts. People feel the difference. They can tell when something comes from conviction versus calculation. Conviction moves people.", "Sit with this: Say one true thing today without softening it."] },
  { file: "rasta elder.mp4", person: "Rasta Elder", title: "Love yourself first", lines: ["Everything else follows from this. You can't give what you don't have. You can't teach what you don't believe. You can't love anyone else the way they need until you've made some kind of peace with yourself. This isn't selfish. This is the foundation. The people who love fiercely are the ones who aren't at war with themselves. Self-love isn't the opposite of service, it's the prerequisite.", "Sit with this: Do one thing for yourself today out of love, not maintenance."] },
  { file: "rickOwens.mp4", person: "Rick Owens", title: "Almost rage", lines: ["There's an energy that sits just beneath the surface of beautiful things, a tension that keeps them alive. Too relaxed and it becomes soft. Too tight and it becomes brittle. The real stuff vibrates at the edge between control and chaos, holding both without collapsing into either. This almost-rage is the refusal to be comfortable, the constant interrogation of what you're making and why.", "Sit with this: Make the thing today you've been waiting for someone else to make."] },
  { file: "rickandmorty.mp4", person: "Rick (Rick and Morty)", title: "Your boos don't mean anything", lines: ["The truth doesn't need validation to be true. The people who understand already understand. The people who don't, their confusion is their problem to solve, not yours. Most people spend their lives trying to translate themselves into language everyone can accept. But the closer you get to what's actually real, the fewer people will get it immediately. That's not a failure of the thing.", "Sit with this: Ignore the boos from the wrong room today."] },
  { file: "sade_truth.mp4", person: "Sade", title: "Bricks in the wall", lines: ["You become a wall by accumulating small hardnesses, small refusals to feel, small decisions to protect yourself that made sense at the time. Each brick is reasonable. Together they become a prison. The work of staying alive is the daily choice to stay soft enough to be moved, to keep feeling even when it would be easier to shut down. The wall protects you from nothing that matters.", "Sit with this: Take down one brick today. Say the held-back thing."] },
  { file: "slackers.mp4", person: "Slacker", title: "Every thought is its own reality", lines: ["You move through the world inside a story you're telling yourself about it. The story shapes what you see, and what you see confirms the story. But here's the part: you wrote the story. You can edit it. Not by positive thinking or delusion, but by actually paying attention to how much of what you believe about reality is just narrative running on repeat. The moment you see the thought as separate from the fact, you get distance. That distance is where freedom lives.", "Sit with this: Live the life you're actually in today. Fully."] },
  { file: "steve Jobs crazy ones.mp4", person: "Steve Jobs", title: "Here's to the crazy ones", lines: ["The boundary between vision and delusion is time. Everyone thought the crazy ones were wrong until they weren't. Thirty seconds of hindsight makes genius look obvious, but in the moment it looks like obsession with something nobody asked for. The person who sees what doesn't exist yet has to be different enough to see outside the current frame. That difference costs something. But their cost is everyone else's foundation later.", "Sit with this: Be one of the crazy ones today in one small way."] },
  { file: "steve_jobs_speach.mp4", person: "Steve Jobs", title: "Books got me out", lines: ["Books are portals. They're proof that other people have thought deeply about everything you're confused about. They're preserved intelligence. And they ask nothing from you except attention. When you're stuck in one reality, trapped in one way of seeing, a book can crack the walls open. The people who read deeply rarely stay exactly where they started. Something inevitably shifts.", "Sit with this: Read something old today. Skip the commentary. Go to the source."] },
  { file: "sunRa_inspiration.mp4", person: "Sun Ra", title: "The planets, the creator, real and mythical gods", lines: ["Reality isn't as solid as your senses report. There's always more happening than what you can see. The people who access that more, whether through music or meditation or ceremony, report the same thing: everything is connected, everything is alive, everything is participating in something bigger. You don't have to believe in gods to feel this. You just have to pay attention to the vastness.", "Sit with this: Get inspiration from something non-human today. The planets are talking."] },
  { file: "synoxys .mp4", person: "Synoxys", title: "Trading time for things", lines: ["Time is the only currency you can't get back. Everything you buy is made of hours you won't live again. That's the actual cost, not the price tag. Most people never do the conversion. They just trade automatically, hours for stuff, until one day they look up and the time's gone. But if you actually held the equation in your mind, every purchase becomes conscious. You start asking if this thing is worth that many hours of your life.", "Sit with this: Calculate one purchase in hours of your life today. See if you still want it."] },
  { file: "sza.mp4", person: "SZA", title: "Not everything has to be said", lines: ["There's a power in restraint that gets lost in a culture of oversharing. Some things don't need explanation. Some feelings don't need to be broadcast. Some moments stay bigger if you keep them close. The unsaid carries more weight than the said. It's more mysterious. It keeps its power. The people with real presence are often the ones saying less, knowing that what you withhold speaks louder than what you explain.", "Sit with this: Leave one thing unsaid today. See what fills the space."] },
  { file: "tricky.mp4", person: "Tricky", title: "Don't learn to sing", lines: ["The moment you learn the rules of something is the moment you can break them intelligently. But if you only learn the rules, you've already lost the thing. The voice that's rough or weird or untrained is the one with something to say. The second you optimize for technical perfection, you're optimizing for blandness. The great art comes from people doing it wrong in the right way.", "Sit with this: Protect the part of your craft that's untrained today. That's the magic."] },
  { file: "twilightZone.mp4", person: "Rod Serling", title: "Filed under M for mankind", lines: ["The most interesting things about being human get filed away as too strange, too specific, too small to matter. But that's where the real story is. The ordinary-weird things that everyone experiences but nobody talks about. The small contradictions. The double consciousness. The way you're different people in different rooms. The unseen interior life that's more real than anything you perform. Humanity lives there.", "Sit with this: Treat one person today like their dignity is the whole point. Because it is."] },
];

// Deterministic shuffle that avoids back-to-back same person
const SHUFFLED = (() => {
  // Seeded random for deterministic order
  const seed = 42;
  let s = seed;
  const rand = () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };

  // First, shuffle all videos
  const arr = [...VIDEOS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // Then spread out same-person entries so they don't appear back-to-back
  for (let pass = 0; pass < 5; pass++) {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].person === arr[i - 1].person) {
        // Find the nearest different-person entry to swap with
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[j].person !== arr[i].person && arr[j].person !== arr[i - 1].person &&
              (i + 1 >= arr.length || arr[j].person !== arr[i + 1]?.person)) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            break;
          }
        }
      }
    }
  }
  return arr;
})();

// get today's video based on date
function getTodayContent() {
  const now = new Date();
  const start = new Date(2026, 0, 1); // Jan 1, 2026 as epoch
  const daysSinceStart = Math.floor((now - start) / 86400000);
  const index = ((daysSinceStart % SHUFFLED.length) + SHUFFLED.length) % SHUFFLED.length;
  const video = SHUFFLED[index];

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const moonPhases = ["new moon", "waxing crescent", "first quarter moon", "waxing gibbous", "full moon", "waning gibbous", "last quarter moon", "waning crescent"];
  const moonIndex = Math.floor((daysSinceStart % 29.5) / 3.69);

  const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const context = `${days[now.getDay()]}. ${moonPhases[moonIndex % 8]}.`;

  return { ...video, dateStr, context, index };
}

const font = "Courier New, Courier, monospace";
const link = { background: "none", border: "none", fontFamily: font, fontSize: 16, color: "#0000EE", textDecoration: "underline", cursor: "pointer", padding: "4px 2px", minHeight: 32 };

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState("email"); // email -> password -> (name if new)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const hashPw = async (pw) => {
    const enc = new TextEncoder().encode(pw);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  };

  const handleSubmit = async () => {
    setError("");
    if (step === "email") {
      if (!email.trim()) { setError("please enter your email."); return; }
      setStep("password");
      return;
    }
    if (!password.trim()) { setError("please enter a password."); return; }
    const key = email.trim().toLowerCase();
    setLoading(true);
    try {
      const hashed = await hashPw(password);
      const existing = await sb(`profiles?email=eq.${encodeURIComponent(key)}&select=*`);
      if (existing.length > 0) {
        // Existing user - check password
        if (existing[0].password_hash && existing[0].password_hash !== hashed) {
          setError("wrong password."); setLoading(false); return;
        }
        // If no password set yet, save it now
        if (!existing[0].password_hash) {
          await sb(`profiles?email=eq.${encodeURIComponent(key)}`, {
            method: "PATCH",
            body: JSON.stringify({ password_hash: hashed }),
          });
        }
        onLogin(existing[0].email, existing[0].name);
      } else {
        // New user
        if (!isNew) { setIsNew(true); setLoading(false); return; }
        if (!name.trim()) { setError("please enter your name."); setLoading(false); return; }
        const created = await sb("profiles", {
          method: "POST",
          body: JSON.stringify({ email: key, name: name.trim(), password_hash: hashed }),
        });
        onLogin(created[0].email, created[0].name);
      }
    } catch (e) {
      console.error("Login error:", e);
      setError("something went wrong. try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bbb-page" style={{ maxWidth: 540, margin: "60px auto", padding: "0 24px", fontFamily: "monospace", color: "#111" }}>
      <h1 style={{ fontSize: 21, fontWeight: "bold", margin: 0 }}>becausebecausebecause</h1>
      <p style={{ fontSize: 14, margin: "2px 0 16px", opacity: 0.5 }}>a daily reflection practice, updated daily</p>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", marginBottom: 16 }} />
      {error && <p style={{ color: "red", fontSize: 14 }}>{error}</p>}
      <label style={{ fontSize: 14 }}>email:</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={step !== "email"}
        style={{ width: "100%", padding: 8, marginBottom: 8, fontFamily: "monospace", fontSize: 15, boxSizing: "border-box" }}
        onKeyDown={e => e.key === "Enter" && handleSubmit()} />
      {step === "password" && (<>
        <label style={{ fontSize: 14 }}>{isNew ? "create a password:" : "password:"}</label>
        <p style={{ fontSize: 12, opacity: 0.5, margin: "0 0 4px" }}>{isNew ? "first time here — create a password to get started" : "new here? just enter a password to create your account"}</p>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoFocus
          style={{ width: "100%", padding: 8, marginBottom: 8, fontFamily: "monospace", fontSize: 15, boxSizing: "border-box" }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()} />
      </>)}
      {isNew && (<>
        <label style={{ fontSize: 14 }}>your name:</label>
        <input value={name} onChange={e => setName(e.target.value)} autoFocus
          style={{ width: "100%", padding: 8, marginBottom: 4, fontFamily: "monospace", fontSize: 15, boxSizing: "border-box" }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        <p style={{ fontSize: 12, opacity: 0.5, margin: "0 0 8px" }}>first time here \u2014 what should we call you?</p>
      </>)}
      <button onClick={handleSubmit} disabled={loading}
        style={{ width: "100%", padding: 10, background: "#000", color: "#fff", border: "none", cursor: "pointer", fontFamily: "monospace", fontSize: 15, marginTop: 4 }}>
        {loading ? "..." : step === "email" ? "continue" : isNew ? "get started" : "log in"}
      </button>
    </div>
  );
}

function Nav({ current, onNavigate, onLogout }) {
  const items = ["daily", "journal", "about"];
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, fontFamily: "monospace", fontSize: 14 }}>
      <div style={{ display: "flex", gap: 16 }}>
        {items.map(item => (
          <span
            key={item}
            onClick={() => onNavigate(item)}
            style={{ cursor: "pointer", textDecoration: current === item ? "underline" : "none", opacity: current === item ? 1 : 0.5 }}
          >
            {item}
          </span>
        ))}
      </div>
      <span onClick={onLogout} style={{ cursor: "pointer", opacity: 0.5 }}>logout</span>
    </div>
  );
}

function Daily({ user, notes, setNotes, onSave, onNavigate, onLogout }) {
  const today = useMemo(getTodayContent, []);
  const [playing, setPlaying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const todayDate = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    // Query by created_at within today's local day (converted to UTC for Supabase)
    const startLocal = new Date();
    startLocal.setHours(0, 0, 0, 0);
    const endLocal = new Date();
    endLocal.setHours(23, 59, 59, 999);
    const startUTC = startLocal.toISOString();
    const endUTC = endLocal.toISOString();
    sb(`comments?created_at=gte.${startUTC}&created_at=lte.${endUTC}&order=created_at.asc&select=*`)
      .then(setComments)
      .catch(err => console.error("Failed to load comments:", err));
  }, [todayDate]);

  const handlePostComment = async () => {
    if (!newComment.trim() || !user?.email) return;
    setPostingComment(true);
    try {
      const created = await sb("comments", {
        method: "POST",
        body: JSON.stringify({
          video_date: todayDate,
          user_email: user.email,
          user_name: user.name || user.email.split("@")[0],
          comment: newComment.trim(),
        }),
      });
      setComments(prev => [...prev, created[0]]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
    setPostingComment(false);
  };

  const handleSave = async () => {
    if (notes.trim()) {
      try { await onSave(today); setSaved(true); setTimeout(() => setSaved(false), 2000); }
      catch (e) { /* error handled in parent */ }
    }
  };

  const handleShare = async () => {
    const url = "https://becausebecausebecause.today";
    const text = `becausebecausebecause.today — today: ${today.person}, "${today.title}"`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "becausebecausebecause.today", text, url });
        setShared("shared.");
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setShared("copied.");
      } else {
        setShared("copy: " + url);
      }
    } catch (e) {
      setShared("");
    }
    setTimeout(() => setShared(""), 2500);
  };

  return (
    <div className="bbb-page" style={{ fontFamily: font, maxWidth: 540, margin: "24px auto 48px", padding: "0 16px", color: "#111" }}>
      <h2 style={{ fontSize: 17, fontWeight: "normal", marginBottom: 4 }}>becausebecausebecause.today</h2>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", marginBottom: 8 }} />
      <Nav current="daily" onNavigate={onNavigate} onLogout={onLogout} />

      <h1 style={{ fontSize: 19, fontWeight: "normal", margin: "24px 0 2px", lineHeight: 1.2 }}>{today.dateStr}</h1>
      <p style={{ fontSize: 13, color: "#444", margin: "0 0 24px" }}>{today.context}</p>

      <p style={{ fontSize: 13, color: "#666", margin: "0 0 4px" }}>featuring: {today.person}</p>
      <h3 style={{ fontSize: 19, fontWeight: "bold", margin: "0 0 12px" }}>{today.title}</h3>
      {today.lines.map((line, i) => (
        <p key={i} style={{ fontSize: 16, lineHeight: 1.6, margin: "0 0 8px" }}>{line}</p>
      ))}

      <div style={{ margin: "24px 0 4px" }}>
        <video
          key={today.file}
          src={`https://pub-e0caa3896f9841198f09ad2d1a154b43.r2.dev/${encodeURIComponent(today.file)}`}
          controls
          playsInline
          style={{ background: "#000", width: "100%", height: "auto", maxHeight: "70vh", objectFit: "contain", display: "block" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <p style={{ fontSize: 13, color: "#444", margin: 0 }}>watch, then write.</p>
          <button onClick={handleShare} style={link}>share this page</button>
        </div>
        {shared && <p style={{ fontSize: 13, color: "#444", margin: "2px 0 0", textAlign: "right" }}>{shared}</p>}
      </div>

      <div style={{ margin: "24px 0", borderTop: "1px solid #eee", paddingTop: 16 }}>
        <p style={{ fontSize: 15, fontWeight: "bold", marginBottom: 12 }}>comments</p>
        {comments.length === 0 && <p style={{ fontSize: 14, color: "#666", margin: "0 0 12px" }}>no comments yet. be the first.</p>}
        {comments.map((c) => (
          <div key={c.id} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 14, fontWeight: "bold" }}>{c.user_name}</span>
              <span style={{ fontSize: 12, color: "#666" }}>{new Date(c.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.5, margin: "4px 0 0", whiteSpace: "pre-wrap" }}>{c.comment}</p>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            type="text"
            placeholder="add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
            style={{ fontFamily: font, fontSize: 14, flex: 1, padding: "6px 8px", border: "1px solid #ccc", boxSizing: "border-box" }}
          />
          <button
            onClick={handlePostComment}
            disabled={postingComment || !newComment.trim()}
            style={{ fontFamily: font, fontSize: 14, padding: "6px 12px", cursor: "pointer", background: "#eee", border: "1px solid #999", opacity: postingComment || !newComment.trim() ? 0.5 : 1 }}
          >
            {postingComment ? "..." : "post"}
          </button>
        </div>
      </div>

      <div style={{ margin: "24px 0" }}>
        <p style={{ fontSize: 15, fontWeight: "bold", marginBottom: 6 }}>your reflection:</p>
        <textarea placeholder="what came up for you..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ fontFamily: font, fontSize: 15, width: "100%", minHeight: 120, padding: 8, border: "1px solid #999", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6 }} />
        <div style={{ marginTop: 8 }}>
          <button onClick={handleSave} style={{ fontFamily: font, fontSize: 15, padding: "4px 16px", cursor: "pointer", background: "#eee", border: "1px solid #999" }}>save to journal</button>
          {saved && <span style={{ fontSize: 14, color: "#444", marginLeft: 8 }}>saved.</span>}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "32px 0 8px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 12, color: "#666", margin: 0 }}>becausebecausebecause.today — {SHUFFLED.length} videos in rotation</p>
        {user?.email === "harrybeeenyc@gmail.com" && (
          <span onClick={() => onNavigate("dashboard")} style={{ fontSize: 11, color: "#999", cursor: "pointer" }}>dashboard</span>
        )}
      </div>
    </div>
  );
}

function Journal({ savedNotes, loading, onNavigate, onLogout }) {
  return (
    <div className="bbb-page" style={{ fontFamily: font, maxWidth: 540, margin: "24px auto 48px", padding: "0 16px", color: "#111" }}>
      <h2 style={{ fontSize: 17, fontWeight: "normal", marginBottom: 4 }}>becausebecausebecause.today</h2>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", marginBottom: 8 }} />
      <Nav current="journal" onNavigate={onNavigate} onLogout={onLogout} />
      <h1 style={{ fontSize: 25, fontWeight: "normal", margin: "24px 0 16px" }}>your journal</h1>
      {loading
        ? <p style={{ fontSize: 15, color: "#444" }}>loading your entries...</p>
        : savedNotes.length === 0
        ? <p style={{ fontSize: 15, color: "#444" }}>no entries yet. <button style={link} onClick={() => onNavigate("daily")}>go to today's reflection</button>.</p>
        : savedNotes.map((entry, i) => (
          <div key={entry.id || i} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #eee" }}>
            <p style={{ fontSize: 13, color: "#666", margin: "0 0 2px" }}>{entry.date}</p>
            <p style={{ fontSize: 14, color: "#444", margin: "0 0 4px" }}>{entry.person} — {entry.title}</p>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{entry.text}</p>
          </div>
        ))
      }
      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "32px 0 8px" }} />
      <p style={{ fontSize: 12, color: "#666" }}>becausebecausebecause.today</p>
    </div>
  );
}

function About({ onNavigate, onLogout }) {
  return (
    <div className="bbb-page" style={{ fontFamily: font, maxWidth: 540, margin: "24px auto 48px", padding: "0 16px", color: "#111" }}>
      <h2 style={{ fontSize: 17, fontWeight: "normal", marginBottom: 4 }}>becausebecausebecause.today</h2>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", marginBottom: 8 }} />
      <Nav current="about" onNavigate={onNavigate} onLogout={onLogout} />
      <h1 style={{ fontSize: 25, fontWeight: "normal", margin: "24px 0 16px" }}>about</h1>
      <p style={{ fontSize: 16, lineHeight: 1.7, margin: "0 0 16px" }}>
        Before or after I meditate, I look for something outside the noise in my head. So, I built Because Today — a daily app for reflections.
      </p>
      <p style={{ fontSize: 16, lineHeight: 1.7, margin: "0 0 16px" }}>
        Each video lives for one day, and so does the conversation. I also journal the thoughts that surface, so I made a place to keep those reflections for whenever you need them.
      </p>
      <p style={{ fontSize: 16, lineHeight: 1.7, margin: "0 0 16px" }}>
        Questions or comments — <a href="mailto:harrybeeenyc@gmail.com" style={{ color: "#0000EE" }}>harrybeeenyc@gmail.com</a>
      </p>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "32px 0 8px" }} />
      <p style={{ fontSize: 12, color: "#666" }}>becausebecausebecause.today</p>
    </div>
  );
}

function Archive({ onNavigate, onLogout }) {
  return (
    <div className="bbb-page" style={{ fontFamily: font, maxWidth: 540, margin: "24px auto 48px", padding: "0 16px", color: "#111" }}>
      <h2 style={{ fontSize: 17, fontWeight: "normal", marginBottom: 4 }}>becausebecausebecause.today</h2>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", marginBottom: 8 }} />
      <Nav current="archive" onNavigate={onNavigate} onLogout={onLogout} />
      <h1 style={{ fontSize: 19, fontWeight: "normal", margin: "24px 0 16px" }}>past reflections</h1>
      {(() => {
        const now = new Date();
        const start = new Date(2026, 0, 1);
        const daysSinceStart = Math.floor((now - start) / 86400000);
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const past = [];
        for (let d = daysSinceStart - 1; d >= 0; d--) {
          const idx = ((d % SHUFFLED.length) + SHUFFLED.length) % SHUFFLED.length;
          const date = new Date(start.getTime() + d * 86400000);
          past.push({ v: SHUFFLED[idx], date: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}` });
        }
        if (past.length === 0) return <p style={{ fontSize: 14, color: "#444" }}>nothing here yet. come back tomorrow.</p>;
        return past.map((entry, i) => (
          <div key={i} style={{ marginBottom: 8, fontSize: 15 }}>
            <span style={{ color: "#666", marginRight: 8 }}>{entry.date}</span>
            <span style={{ fontWeight: "bold" }}>{entry.v.title}</span>
            <span style={{ color: "#444" }}> — {entry.v.person}</span>
          </div>
        ));
      })()}
      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "32px 0 8px" }} />
      <p style={{ fontSize: 12, color: "#666" }}>becausebecausebecause.today</p>
    </div>
  );
}

function Donate({ onNavigate, onLogout }) {
  const [amount, setAmount] = useState("");
  const [thanked, setThanked] = useState(false);

  return (
    <div className="bbb-page" style={{ fontFamily: font, maxWidth: 540, margin: "24px auto 48px", padding: "0 16px", color: "#111" }}>
      <h2 style={{ fontSize: 17, fontWeight: "normal", marginBottom: 4 }}>becausebecausebecause.today</h2>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", marginBottom: 8 }} />
      <Nav current="donate" onNavigate={onNavigate} onLogout={onLogout} />
      <h1 style={{ fontSize: 25, fontWeight: "normal", margin: "24px 0 8px" }}>donate</h1>
      <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>this is a free daily practice. if it means something to you, help keep it going.</p>
      {!thanked ? (
        <>
          <p style={{ fontSize: 15 }}>
            {["$5", "$10", "$25", "$50"].map((amt) => (
              <button key={amt} onClick={() => setAmount(amt)} style={{ ...link, fontWeight: amount === amt ? "bold" : "normal", marginRight: 12, color: amount === amt ? "#000" : "#0000EE" }}>{amt}</button>
            ))}
          </p>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 14 }}>other amount: </label>
            <input style={{ fontFamily: font, fontSize: 15, padding: "4px 6px", width: 80, border: "1px solid #999" }} value={amount.startsWith("$") ? "" : amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <button onClick={() => { if (amount) setThanked(true); }} style={{ fontFamily: font, fontSize: 15, padding: "4px 16px", cursor: "pointer", background: "#eee", border: "1px solid #999" }}>donate</button>
        </>
      ) : (
        <p style={{ fontSize: 15 }}>thank you. <span style={{ color: "#666" }}>(stripe integration goes here)</span></p>
      )}
      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "32px 0 8px" }} />
      <p style={{ fontSize: 12, color: "#666" }}>becausebecausebecause.today</p>
    </div>
  );
}

function Dashboard({ onNavigate, onLogout }) {
  const [profiles, setProfiles] = useState([]);
  const [comments, setComments] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("users");

  useEffect(() => {
    Promise.all([
      sb("profiles?select=*&order=created_at.desc"),
      sb("comments?select=*&order=created_at.desc&limit=200"),
      sb("journal_entries?select=*&order=created_at.desc&limit=200"),
    ]).then(([p, c, e]) => {
      setProfiles(p);
      setComments(c);
      setEntries(e);
    }).catch(err => console.error("Dashboard load error:", err))
      .finally(() => setLoading(false));
  }, []);

  // helper: get which video was showing on a given date
  const getVideoForDate = (dateStr) => {
    const d = new Date(dateStr);
    const start = new Date(2026, 0, 1);
    const daysSince = Math.floor((d - start) / 86400000);
    const vidIdx = ((daysSince % SHUFFLED.length) + SHUFFLED.length) % SHUFFLED.length;
    return SHUFFLED[vidIdx];
  };

  const stat = { display: "inline-block", textAlign: "center", marginRight: 24, marginBottom: 16 };
  const statNum = { fontSize: 28, fontWeight: "bold", display: "block" };
  const statLabel = { fontSize: 12, color: "#666" };
  const sectionHead = { fontSize: 15, fontWeight: "bold", margin: "24px 0 8px", borderBottom: "1px solid #eee", paddingBottom: 4 };
  const row = { fontSize: 13, lineHeight: 1.6, padding: "4px 0", borderBottom: "1px solid #f5f5f5" };
  const tabStyle = (active) => ({ cursor: "pointer", fontSize: 14, padding: "8px 16px", borderBottom: active ? "2px solid #111" : "2px solid transparent", fontWeight: active ? "bold" : "normal", color: active ? "#111" : "#999" });

  return (
    <div className="bbb-page" style={{ fontFamily: font, maxWidth: 700, margin: "24px auto 48px", padding: "0 16px", color: "#111" }}>
      <h2 style={{ fontSize: 17, fontWeight: "normal", marginBottom: 4 }}>becausebecausebecause.today</h2>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", marginBottom: 8 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, fontSize: 14 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span onClick={() => onNavigate("daily")} style={{ cursor: "pointer", opacity: 0.5 }}>daily</span>
          <span style={{ textDecoration: "underline" }}>dashboard</span>
        </div>
        <span onClick={onLogout} style={{ cursor: "pointer", opacity: 0.5 }}>logout</span>
      </div>

      <h1 style={{ fontSize: 25, fontWeight: "normal", margin: "16px 0 16px" }}>dashboard</h1>

      {loading ? <p style={{ fontSize: 15, color: "#444" }}>loading...</p> : (<>
        <div style={{ marginBottom: 8 }}>
          <span style={stat}><span style={statNum}>{profiles.length}</span><span style={statLabel}>total users</span></span>
          <span style={stat}><span style={statNum}>{comments.length}</span><span style={statLabel}>total comments</span></span>
          <span style={stat}><span style={statNum}>{entries.length}</span><span style={statLabel}>journal entries</span></span>
        </div>

        {/* ── TAB SWITCHER ── */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #ddd", marginBottom: 16 }}>
          <span style={tabStyle(tab === "users")} onClick={() => setTab("users")}>users</span>
          <span style={tabStyle(tab === "posts")} onClick={() => setTab("posts")}>posts</span>
        </div>

        {/* ══════════════════════════════════════════════ */}
        {/* SECTION 1: USERS — activity, comments on posts */}
        {/* ══════════════════════════════════════════════ */}
        {tab === "users" && (<>
          <p style={sectionHead}>users ({profiles.length})</p>
          <div style={{ maxHeight: 250, overflowY: "auto" }}>
            {profiles.map((p, i) => (
              <div key={i} style={row}>
                <strong>{p.name || "—"}</strong> &nbsp;
                <span style={{ color: "#444" }}>{p.email}</span> &nbsp;
                <span style={{ color: "#999", fontSize: 11 }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}</span>
              </div>
            ))}
          </div>

          <p style={sectionHead}>comments ({comments.length})</p>
          <p style={{ fontSize: 11, color: "#888", margin: "0 0 8px" }}>each comment shows which post it was left on</p>
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {comments.map((c, i) => {
              const vid = getVideoForDate(c.created_at);
              return (
                <div key={i} style={{ ...row, padding: "8px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span>
                      <strong>{c.user_name}</strong> &nbsp;
                      <span style={{ color: "#999", fontSize: 11 }}>
                        {new Date(c.created_at).toLocaleDateString()} · {new Date(c.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </span>
                  </div>
                  <div style={{ background: "#f7f7f7", borderRadius: 4, padding: "6px 8px", margin: "4px 0", fontSize: 11, color: "#666" }}>
                    <strong style={{ color: "#444" }}>{vid.person}</strong> — {vid.title}
                    <br />
                    <span style={{ fontSize: 10, color: "#aaa" }}>{vid.lines[0]?.slice(0, 80)}...</span>
                  </div>
                  <span style={{ color: "#222" }}>{c.comment}</span>
                </div>
              );
            })}
          </div>

          <p style={sectionHead}>journal entries ({entries.length})</p>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {entries.map((e, i) => {
              const vid = getVideoForDate(e.created_at || e.entry_date);
              return (
                <div key={i} style={{ ...row, padding: "8px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span>
                      <strong>{e.user_email?.split("@")[0]}</strong> &nbsp;
                      <span style={{ color: "#999", fontSize: 11 }}>{e.entry_date}</span>
                    </span>
                  </div>
                  <div style={{ background: "#f7f7f7", borderRadius: 4, padding: "6px 8px", margin: "4px 0", fontSize: 11, color: "#666" }}>
                    <strong style={{ color: "#444" }}>{vid.person}</strong> — {vid.title}
                  </div>
                  {e.prompt && <p style={{ fontSize: 11, color: "#888", margin: "2px 0" }}>prompt: {e.prompt}</p>}
                  <span style={{ color: "#222" }}>{e.entry?.slice(0, 200)}{e.entry?.length > 200 ? "..." : ""}</span>
                </div>
              );
            })}
          </div>
        </>)}

        {/* ══════════════════════════════════════════════ */}
        {/* SECTION 2: POSTS — all entries as users see them */}
        {/* ══════════════════════════════════════════════ */}
        {tab === "posts" && (<>
          <p style={sectionHead}>all posts — rotation order ({SHUFFLED.length})</p>
          <p style={{ fontSize: 11, color: "#888", margin: "0 0 12px" }}>posts in the order they rotate daily. each shows the copy users see and the original transcript.</p>
          <div>
            {SHUFFLED.map((v, i) => {
              // count comments on this post
              const postComments = comments.filter(c => {
                const vid = getVideoForDate(c.created_at);
                return vid.file === v.file;
              });
              return (
                <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #eee" }}>
                  {/* post header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span>
                      <span style={{ color: "#999", fontSize: 11, marginRight: 8 }}>#{i + 1}</span>
                      <strong style={{ fontSize: 14 }}>{v.person}</strong>
                      <span style={{ color: "#444", fontSize: 14 }}> — {v.title}</span>
                    </span>
                    {postComments.length > 0 && (
                      <span style={{ fontSize: 10, color: "#888", background: "#f0f0f0", padding: "2px 6px", borderRadius: 8 }}>
                        {postComments.length} comment{postComments.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* the copy users see */}
                  <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.7, color: "#222" }}>
                    {v.lines.map((line, li) => (
                      <p key={li} style={{ margin: li === 0 ? "0 0 8px" : "0 0 4px", color: li === 1 ? "#555" : "#222", fontStyle: li === 1 ? "italic" : "normal" }}>{line}</p>
                    ))}
                  </div>

                  {/* transcript / original */}
                  <details style={{ marginTop: 6, fontSize: 11, color: "#999" }}>
                    <summary style={{ cursor: "pointer" }}>transcript / file info</summary>
                    <p style={{ margin: "4px 0", fontSize: 10, color: "#bbb" }}>file: {v.file}</p>
                    <p style={{ margin: "4px 0", color: "#888" }}>This is the video entry as it appears in rotation. The copy above is what users read alongside the video.</p>
                  </details>

                  {/* comments on this post */}
                  {postComments.length > 0 && (
                    <details style={{ marginTop: 6, fontSize: 11, color: "#999" }}>
                      <summary style={{ cursor: "pointer" }}>comments ({postComments.length})</summary>
                      {postComments.map((c, ci) => (
                        <div key={ci} style={{ padding: "4px 0", borderBottom: "1px solid #f8f8f8" }}>
                          <strong style={{ color: "#444" }}>{c.user_name}</strong>
                          <span style={{ color: "#bbb", marginLeft: 6 }}>{new Date(c.created_at).toLocaleDateString()}</span>
                          <br />
                          <span style={{ color: "#555" }}>{c.comment}</span>
                        </div>
                      ))}
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        </>)}
      </>)}

      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "32px 0 8px" }} />
      <p style={{ fontSize: 12, color: "#666" }}>admin dashboard — becausebecausebecause.today</p>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem("bbb_session"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [page, setPage] = useState("daily");
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    setLoadingEntries(true);
    sb(`journal_entries?user_email=eq.${encodeURIComponent(user.email)}&order=entry_date.desc,created_at.desc&select=*`)
      .then(entries => {
        setSavedNotes(entries.map(e => ({
          id: e.id,
          date: e.entry_date,
          person: e.prompt ? e.prompt.split(" \u2014 ")[0] : "",
          title: e.prompt ? e.prompt.split(" \u2014 ")[1] : "",
          text: e.entry,
        })));
      })
      .catch(err => console.error("Failed to load entries:", err))
      .finally(() => setLoadingEntries(false));
  }, [user?.email]);

  const handleSave = async (today) => {
    if (!notes.trim() || !user?.email) return;
    const entry = {
      user_email: user.email,
      entry_date: new Date().toISOString().slice(0, 10),
      prompt: `${today.person} \u2014 ${today.title}`,
      entry: notes.trim(),
    };
    try {
      const created = await sb("journal_entries", {
        method: "POST",
        body: JSON.stringify(entry),
      });
      setSavedNotes(prev => [{
        id: created[0].id,
        date: created[0].entry_date,
        person: today.person,
        title: today.title,
        text: created[0].entry,
      }, ...prev]);
      setNotes("");
    } catch (err) {
      console.error("Failed to save entry:", err);
      alert("Failed to save. Please try again.");
    }
  };

  const loginUser = (u) => { setUser(u); localStorage.setItem("bbb_session", JSON.stringify(u)); };
  const logout = () => { setUser(null); setSavedNotes([]); localStorage.removeItem("bbb_session"); setPage("daily"); };

  if (!user) return <Login onLogin={(email, name) => loginUser({ email, name })} />;
  if (page === "dashboard" && user.email === "harrybeeenyc@gmail.com") return <Dashboard onNavigate={setPage} onLogout={logout} />;
  if (page === "journal") return <Journal savedNotes={savedNotes} loading={loadingEntries} onNavigate={setPage} onLogout={logout} />;
  if (page === "about") return <About onNavigate={setPage} onLogout={logout} />;
  if (page === "archive") return <Archive onNavigate={setPage} onLogout={logout} />;
  if (page === "donate") return <Donate onNavigate={setPage} onLogout={logout} />;
  return <Daily user={user} notes={notes} setNotes={setNotes} onSave={handleSave} onNavigate={setPage} onLogout={logout} />;
}
