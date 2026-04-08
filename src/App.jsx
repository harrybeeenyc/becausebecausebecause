import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// BECAUSE BECAUSE BECAUSE — Daily Consciousness & Reflection App
// Full video content library embedded (90 videos)
// One video per day, rotates by date
// ═══════════════════════════════════════════════════════════════

const VIDEOS = [
  { file: " Bayyinah Bello.mp4", person: "Bayyinah Bello", title: "Spirituality is not a business", lines: ["Bayyinah Bello says spirituality is not something you sell — the moment it has a price tag, something sacred has been swapped for something cheap.", "Real practice doesn't need a logo or a launch.", "Today, do one spiritual or creative thing with no audience and no monetization attached."] },
  { file: "2pac trump.mp4", person: "2Pac", title: "Give, give, give", lines: ["Pac said the people with the most should give the most — and that includes the rich man down the street with the empty house.", "Generosity isn't charity. It's a redistribution of energy.", "Today, give something away — time, attention, money, or credit — without needing it back."] },
  { file: "2pac_real.mp4", person: "2Pac", title: "Real character, real person", lines: ["Pac talked about real recognizing real — that the only currency that matters in the long run is character.", "You can fake a lot of things. You can't fake the way people feel after they leave the room.", "Today, choose the harder, more honest move. People remember it."] },
  { file: "2pac_rich.mp4", person: "2Pac", title: "I'm gonna go through it my way", lines: ["Pac said if he was going to go through hell, he was going to go through it his way — not on someone else's terms.", "The path being hard doesn't mean it's wrong. It means it's yours.", "Today, do the hard thing the way only you would do it."] },
  { file: "50cent.mp4", person: "50 Cent", title: "Crazy enough to believe it", lines: ["50 said you have to be crazy enough to believe in yourself when no one else does — because the gap between vision and reality is closed by belief alone.", "Confidence isn't earned by results. Results are earned by confidence.", "Today, act on the belief before you have proof."] },
  { file: "60sHippie.mp4", person: "60s Hippie", title: "I just live", lines: ["Asked how he survives, the hippie answers simply: I just live. No plan, no résumé, no five-year vision.", "There's a freedom most of us have edited out of our lives in exchange for predictability.", "Today, do one thing without needing a reason for it."] },
  { file: "AQM4u2uf1F2WJinAECyy2gwp2RfCRIYko-0SM5a-d6Pa9Q3MKjsoAD7kSj5nhLjqrrKqnrZQk6ryktAZqKe9fBcGyCF1yac3LYEn8Nc.mp4", person: "Anonymous", title: "Turn around", lines: ["What are you running from? Turn your back to the front seat. Look at where you've been.", "We spend so much energy fleeing forward that we never see what we're carrying.", "Today, look back at one thing you've been avoiding. Just look. That's enough."] },
  { file: "Abbie Hoffman .mp4", person: "Abbie Hoffman", title: "Education is subversive", lines: ["Hoffman believed real education isn't training — it's revolt. The moment you learn to think, you become dangerous to anyone trying to control you.", "School teaches obedience. Learning teaches freedom.", "Today, learn one thing nobody asked you to learn."] },
  { file: "Adnre3000.mp4", person: "André 3000", title: "Stay on your path", lines: ["André talks about how the path he was on always felt strange to other people — and how staying on it was the only thing that made sense.", "If everyone gets your move immediately, it's probably not new.", "Today, walk the weird path one more step. Don't explain it."] },
  { file: "Andre3000concert.mp4", person: "André 3000", title: "Bring it where it isn't", lines: ["André plays flute in places nobody expects flute. He brings the thing to where the thing has never been.", "Innovation is just context-shifting. Take your gift somewhere it doesn't belong.", "Today, put your work in front of an audience that wasn't asking for it."] },
  { file: "Anthony Bourdain.mp4", person: "Anthony Bourdain", title: "Pay attention", lines: ["Bourdain said life becomes beautiful the moment you start paying attention — to strangers, to meals, to the small dignities people offer each other.", "Most of life is invisible because we're scrolling past it.", "Today, look up. Notice one ordinary thing like it's the first time."] },
  { file: "Asarci.mp4", person: "Asarci", title: "Knowledge of self", lines: ["Asarci says the solution everyone is searching for is knowledge of self — once you know who you are, every action lines up.", "Most people are solving the wrong problem because they never asked the first question.", "Today, ask yourself what you actually believe — not what you've inherited."] },
  { file: "Bob_dylan_magic.mp4", person: "Bob Dylan", title: "Magically written", lines: ["Dylan looks back at his early songs and says he doesn't know how he wrote them — they came through him, almost magically.", "The best work doesn't always come from effort. Sometimes it comes from being a clean channel.", "Today, get out of your own way. Let something move through you instead of out of you."] },
  { file: "Brian_eno_econmics.mp4", person: "Brian Eno", title: "A poverty of ideas", lines: ["Eno says when he looks at economics he sees a poverty of ideas — everyone repeating the same story as if no other story exists.", "Imagination is a political act. So is refusing the inevitable.", "Today, question one 'this is just how it works' assumption in your field."] },
  { file: "Brian_eno_whyart.mp4", person: "Brian Eno", title: "Art is how we imagine futures", lines: ["Eno says art is how we digest the new — how we sort out what we feel about what's coming.", "Making things isn't decoration. It's how culture metabolizes change.", "Today, make something that helps you feel out a future you can't quite see yet."] },
  { file: "Cassavetes.mp4", person: "John Cassavetes", title: "We don't make films for them", lines: ["Cassavetes refused the studios — even when they came begging — because their help would have destroyed the work.", "Sometimes the bravest creative act is the no.", "Today, turn down something that would compromise the thing you're actually trying to build."] },
  { file: "Charles Bukowski.:om Waits.mp4", person: "Charles Bukowski / Tom Waits", title: "Be on the watch", lines: ["Your life is your life. Don't let it be clubbed into dank submission. There are ways out.", "The gods will offer you chances. Know them and take them.", "Today, take the chance that's been quietly sitting in front of you."] },
  { file: "Comedian.mp4", person: "Comedian", title: "Bored is being yourself", lines: ["Just be yourself. If people don't like it, that's the message.", "The version of you that's trying to be liked is exhausting and forgettable.", "Today, drop the performance for one conversation."] },
  { file: "DENNIS HOPPER.mp4", person: "Dennis Hopper", title: "If it were denied you", lines: ["Hopper asks: if you were denied the ability to create, would you truly die? If yes, then there's only one place for you — the place of creation.", "Some people want to make things. Some people need to.", "Today, find out which one you are. Then act accordingly."] },
  { file: "DMX GOD.mp4", person: "DMX", title: "He won't walk you to what He won't walk you through", lines: ["DMX said God won't walk you to anything He won't walk you through.", "Whatever you're in the middle of, you were equipped before you arrived.", "Today, trust that you have what you need for the room you're already in."] },
  { file: "Damendash.mp4", person: "Dame Dash", title: "Bad breath", lines: ["Dame says everyone around him was corny, weird, manipulative — it just smelled like bad breath.", "Some environments aren't bad people. They're just wrong air.", "Today, notice which rooms drain you. That's data, not drama."] },
  { file: "David Bowie.mp4", person: "David Bowie", title: "Don't title it after", lines: ["Bowie said artists who title their work after they finish are giving themselves away — they didn't know what they were making.", "Make first. Meaning shows up later, if at all.", "Today, start something without naming it. Let it tell you what it is."] },
  { file: "David Whyte,.mp4", person: "David Whyte", title: "How do you know you're on your path", lines: ["Whyte says you know you're on your path because it disappears — you can't see where you're going and everything you leaned on for identity is gone.", "Real change feels like loss before it feels like anything else.", "Today, sit with the disorientation. It's evidence, not failure."] },
  { file: "David lynch interview Harry dean actor.mp4", person: "David Lynch & Harry Dean Stanton", title: "There's no self", lines: ["How would you describe yourself? There's nothing. There's no self. How would you like to be remembered? Doesn't matter.", "Stanton lived without the burden of legacy. He just was.", "Today, do one thing with no thought of how it'll be remembered."] },
  { file: "DavidLynch_today.mp4", person: "David Lynch", title: "Theater of the absurd", lines: ["Lynch said today is a great time to be alive if you love the theater of the absurd.", "When the world stops making sense, the artist's job gets easier, not harder.", "Today, find the comedy in the chaos. It's a form of survival."] },
  { file: "David_bowe_art.mp4", person: "David Bowie", title: "The new construction", lines: ["Bowie embraced the demystification between artist and audience — he saw it as a community thing, a new construction.", "The wall between maker and watcher is dissolving. Lean in.", "Today, let someone in on the process, not just the polished result."] },
  { file: "DenzelWashington.mp4", person: "Denzel Washington", title: "Not healthy", lines: ["Denzel said he can't live based on what other people think — it's just not healthy.", "Caring about strangers' opinions is a slow leak.", "Today, make one decision purely for yourself."] },
  { file: "EL Gunna•Liberation X peace (Intro).mp4", person: "El Hajj Malik", title: "Liberation, not peace", lines: ["You can have peace and be enslaved. Peace isn't the answer — liberation is.", "Comfort and freedom are not the same thing.", "Today, choose freedom over comfort, even in something small."] },
  { file: "Erykabadu_authenticyt.mp4", person: "Erykah Badu", title: "Authenticity is the strongest power", lines: ["Badu says authenticity is the strongest power of attraction on earth.", "Trying to be appealing makes you forgettable. Being yourself makes you magnetic.", "Today, stop performing. Watch what changes."] },
  { file: "ErykahBadu-people.mp4", person: "Erykah Badu", title: "85, 10, and 5", lines: ["Badu repeats the philosophy: 85% follow, 10% create, 5% observe and pull the strings.", "You don't have to be in the 85.", "Today, decide which percentage you're operating in — and move."] },
  { file: "Erykahbadu_evolution.mp4", person: "Erykah Badu", title: "A 24 hour job", lines: ["Being your highest self is a 24-hour, 7-day-a-week job. It never finishes.", "Evolution isn't an event. It's a practice.", "Today, do one small thing that the next version of you would thank you for."] },
  { file: "Erykahbadu_leave.mp4", person: "Erykah Badu", title: "Leave the corpse", lines: ["Badu says every time you evolve, you have to die — leave the beautiful old you behind and walk forward without looking back.", "The hardest part isn't leaving. It's not turning around.", "Today, let one old version of yourself go. Don't grieve it. Just walk."] },
  { file: "Erykahbadu_shadow.mp4", person: "Erykah Badu", title: "It's okay to feel bad about doing the right thing", lines: ["The hardest thing is leaving a situation you're enjoying that you know isn't fruitful — and it's okay to feel bad about doing the right thing.", "Discomfort isn't a sign you're wrong. Sometimes it's proof you're right.", "Today, do the right thing even though it'll sting."] },
  { file: "EvelKnievel.mp4", person: "Evel Knievel", title: "Not that heaven", lines: ["Knievel said he didn't want to go to the kind of heaven the preachers describe — sitting on a marble slab in a white robe.", "Your version of paradise should look like you, not like a sermon.", "Today, define what you're actually building toward. In your own words."] },
  { file: "Fran Lebowitzd 1.mp4", person: "Fran Lebowitz", title: "Closest to being a god", lines: ["Lebowitz says writing a book is the closest thing to being a god — you create a whole thing where there was nothing.", "Making something from nothing is the original miracle.", "Today, start one tiny thing from scratch. Anything. The act matters more than the artifact."] },
  { file: "FrankZappa.mp4", person: "Frank Zappa", title: "Two things", lines: ["There are two things you have to do: don't stop, and keep going. When you get there, it's still tough.", "Persistence isn't a strategy. It's the entire game.", "Today, just don't stop. That's the whole instruction."] },
  { file: "Gil Scott-Heron.mp4", person: "Gil Scott-Heron", title: "Change your mind first", lines: ["Gil Scott-Heron said the revolution starts in your mind — you have to change how you think before you change how you live.", "Real change is never first visible from the outside.", "Today, change one thought before you try to change one situation."] },
  { file: "Harmony Korine .mp4", person: "Harmony Korine", title: "Six to eight weeks in 20 days", lines: ["Korine made the whole film in 20 days — no rest, no time to think about what they were doing.", "Sometimes thinking less is the only way to make something honest.", "Today, move faster than your inner critic. Finish before it catches up."] },
  { file: "JAyz.mp4", person: "Jay-Z", title: "Skill in a human body", lines: ["Jay says they can't believe his skill is in a human body — that the gift looks bigger than the vessel.", "When you fully inhabit your gift, people stop seeing the person and start seeing the force.", "Today, show up to your craft like the gift is bigger than you. Because it is."] },
  { file: "JZ.mp4", person: "Jay-Z", title: "Far ahead of my time", lines: ["Jay says he's so far ahead of his time he's about to start another life. The future is a place he's already been.", "Vision is just patience plus pattern recognition.", "Today, make a move only your future self will understand."] },
  { file: "James Baldwin_love.mp4", person: "James Baldwin", title: "If they had, they'd treat their children differently", lines: ["Baldwin says if everyone had really been in love, they'd treat their children differently.", "Love is a verb measured by what people downstream of you experience.", "Today, love someone in a way that shows up in how you act, not just how you feel."] },
  { file: "JamesBrown.mp4", person: "James Brown", title: "I smell good, I feel good", lines: ["James Brown's secret to being loved on stage: I smell good, I feel good, I sing good.", "Showing up for your own body is part of showing up for the work.", "Today, take care of the vessel before you ask it to perform."] },
  { file: "Jean-MichelBasquiat Anger.mp4", person: "Jean-Michel Basquiat", title: "I don't remember", lines: ["Asked about the anger inside him, Basquiat says yes there's anger — and then says he doesn't remember what it's about.", "Some fuel doesn't need to be understood. It just needs to be channeled.", "Today, take an emotion you can't fully explain and put it into the work anyway."] },
  { file: "JerrySeinfeld_money.mp4", person: "Jerry Seinfeld", title: "How cool is your job", lines: ["Seinfeld says in the 70s, nobody asked how much you made — they asked how cool your job was.", "Status used to be about the work itself. Then we forgot.", "Today, measure your day by how cool the work was, not what it paid."] },
  { file: "JimCarrey1.mp4", person: "Jim Carrey", title: "Most meaningless thing I could find", lines: ["Carrey says he wanted to find the most meaningless thing he could and join it — because there's no meaning to any of this.", "Finding the joke in the spectacle is its own form of freedom.", "Today, take something seriously enough to find it absurd."] },
  { file: "John Kanary.mp4", person: "John Kanary", title: "State of vibration", lines: ["The only difference between steam and ice is vibration. The only difference between where you are and where you want to be is the same.", "Everything you need to get there is already here.", "Today, raise your frequency before you change your circumstances."] },
  { file: "JuiceWorld.mp4", person: "Juice WRLD", title: "Slavery is mental now", lines: ["Juice said slavery isn't physical anymore — it's mental, and the new world order arrived in the shape of electronics.", "Your attention is the resource being mined. Guard it.", "Today, take back 30 minutes from a feed and give it to your own mind."] },
  { file: "KRS1-Revolution.mp4", person: "KRS-One", title: "Control the information", lines: ["KRS says the revolution isn't running down the street with a gun — it's controlling what goes into your mind in the first place.", "Your inputs become your actions. Curate them like your life depends on it.", "Today, change one input. A book, a feed, a person you let close."] },
  { file: "KarlLagerfeld_vintage.mp4", person: "Karl Lagerfeld", title: "You become vintage", lines: ["Lagerfeld said the moment you think the past was better, your present is second-hand and you yourself become vintage.", "Nostalgia is a form of giving up.", "Today, do something only the present version of you could make."] },
  { file: "Kurt Cobain _wealth.mp4", person: "Kurt Cobain", title: "Second-hand stores", lines: ["Cobain said the second-hand stores meant more to him — finding a small treasure was a stab in the heart of consumerism.", "The hunt is more meaningful than the haul.", "Today, find joy in something small and unbought."] },
  { file: "LOUISE BOURGEOIS.mp4", person: "Louise Bourgeois", title: "If it doesn't touch you, I have failed", lines: ["Bourgeois said the work doesn't have to be explained — if it doesn't touch you, she has failed.", "Explaining your work too much is admitting it can't carry itself.", "Today, let the work speak. Resist the urge to caption it."] },
  { file: "LaurenHill Don't be afraid.mp4", person: "Lauryn Hill", title: "Don't get stuck on the peak", lines: ["Hill says life is peaks and valleys, and people get stuck on top of one mountain instead of climbing down to climb the next.", "Your last win can become your prison if you stay there too long.", "Today, climb down. The next mountain needs you."] },
  { file: "LaurenHill truth.mp4", person: "Lauryn Hill", title: "Same boat", lines: ["Hill says the so-called big shots are in the same boat as everyone else, dealing with the same issues.", "The performance of having it together is the loneliest performance.", "Today, drop the act with one person."] },
  { file: "Liam_gallagher.mp4", person: "Liam Gallagher", title: "Look cool, write good", lines: ["Liam says you can make the best record in the world but if you look like a dickhead you might as well stick the tune up your ass.", "Aesthetic is part of the work, not separate from it.", "Today, pay attention to the form, not just the content."] },
  { file: "Lil Wayne -repetition.mp4", person: "Lil Wayne", title: "Repetition is the father of learning", lines: ["Wayne says repetition is the father of learning — intelligence, awareness, money, all of it comes from repetition.", "Mastery is just the same move done a thousand times.", "Today, do the boring rep. Then do it again."] },
  { file: "LilB_reading.mp4", person: "Lil B", title: "Don't shut down", lines: ["Lil B says no matter what happens, don't hide, don't shut down, don't be ashamed of the past. Stay creative. Try something new every week.", "The only real failure is closing yourself off.", "Today, try one thing you've never tried. Anything."] },
  { file: "Lou Reed.mp4", person: "Lou Reed", title: "Something to do", lines: ["Asked why he plays with identity, Lou says: it's something to do.", "Sometimes the most honest answer about your art is the simplest one.", "Today, make something just to make it. No bigger reason required."] },
  { file: "MFDoom_follow.mp4", person: "MF DOOM", title: "Follow your heart", lines: ["DOOM said follow your heart all the way through — people might call you crazy, but that's how you make new ground.", "The path nobody sees yet is the only path worth walking.", "Today, follow the instinct that doesn't make sense to anyone else."] },
  { file: "Mac Miller Wirrd.mp4", person: "Mac Miller", title: "Weird and a heart", lines: ["Mac said he was weird, but he had a real heart underneath. Both are true.", "You don't have to choose between being strange and being kind.", "Today, be both."] },
  { file: "Marcus Aurelius.mp4", person: "Marcus Aurelius", title: "The obstacle is the way", lines: ["Marcus Aurelius said what stands in your way becomes the way. The impediment to action advances the action.", "The thing blocking you is the thing teaching you.", "Today, walk straight at the obstacle. It's the curriculum."] },
  { file: "MosDef_heart.mp4", person: "Mos Def", title: "Heartbroken means your heart is working", lines: ["Mos says if you're heartbroken, your heart is working. If you're maladjusted to a sick society, you're healthy.", "Your distress is sometimes the most accurate measurement in the room.", "Today, trust the part of you that refuses to get used to it."] },
  { file: "Mr.Rogers1996.mp4", person: "Mister Rogers", title: "Goosebumps", lines: ["Mr. Rogers gave a tough guy goosebumps for two days just by talking gently. The softness was the strategy.", "Kindness is not weakness. It's the most underrated form of force.", "Today, be gentler than the situation requires."] },
  { file: "Nan Goldin .mp4", person: "Nan Goldin", title: "Put down your phone", lines: ["Goldin's advice to young people: put down your phone. The most important thing is standing in front of another person and feeling empathy.", "The real archive is the one you live, not the one you scroll.", "Today, have one conversation with no phone in the room."] },
  { file: "Nas-Belly.mp4", person: "Nas", title: "Live righteously", lines: ["Nas says: just raise your family right, live righteously, and you'll be alright.", "Sometimes the strategy is just to be a good person, repeatedly.", "Today, do the right thing in the small invisible moment."] },
  { file: "NeemKarolbaba.mp4", person: "Neem Karoli Baba", title: "Two tears", lines: ["Asked how Christ meditated, Maharaj-ji closed his eyes, became still, and two tears came down his cheek. The room felt the world stop.", "Some teachings can't be spoken. They have to be transmitted.", "Today, sit in stillness for five minutes. Don't do anything. Just be there."] },
  { file: "Nipsey needs.mp4", person: "Nipsey Hussle", title: "Pyramid of needs", lines: ["Nipsey breaks down Maslow's pyramid — physiological needs at the base, then safety, belonging, esteem, self-actualization at the top.", "You can't skip floors. The base has to be built.", "Today, take care of the foundational thing you've been ignoring."] },
  { file: "NipseyHussel Power.mp4", person: "Nipsey Hussle", title: "Three Magic Words", lines: ["Nipsey credits a book called Three Magic Words by U.S. Andersen for changing how he thinks — about understanding your power as a creator.", "We are all creators. Most people just don't know it yet.", "Today, act like the creator of your own situation. Because you are."] },
  { file: "Noam CHomsky.mp4", person: "Noam Chomsky", title: "Challenge authority", lines: ["Chomsky says no form of authority should ever be trusted by default — your job is to ask it to justify itself.", "Skepticism is not cynicism. It's hygiene.", "Today, ask one authority — boss, algorithm, tradition — to justify itself."] },
  { file: "Pharell_insignificance.mp4", person: "Pharrell", title: "The insignificance of you", lines: ["Pharrell says the sun you look up at is one of trillions — and once you realize how insignificant you are, you're free.", "Smallness isn't a wound. It's a release.", "Today, zoom out until your problems shrink to scale. Then go play."] },
  { file: "PitBull.mp4", person: "Pitbull", title: "Short steps, long vision", lines: ["Pitbull says: short steps, long vision. Slow but sure.", "The people who burn out are the ones running long steps with short vision.", "Today, take one small step toward the long thing."] },
  { file: "Prince_bday.mp4", person: "Prince", title: "Don't celebrate the day I die", lines: ["Prince said he doesn't celebrate birthdays — he'd rather not be reminded he's moving toward death.", "You don't have to perform any ritual that doesn't feel true to you.", "Today, opt out of one tradition that never fit."] },
  { file: "Prince_internet.mp4", person: "Prince", title: "Don't let the computer use you", lines: ["Prince warned: it's cool to use the computer, but don't let the computer use you. There's a war for the soul.", "The tool is fine. The dependency is the danger.", "Today, use the device. Don't let it use you."] },
  { file: "RZA_truth.mp4", person: "RZA", title: "Live the truth, teach the truth", lines: ["RZA breaks down the percentages: 5% know the truth, live it, and teach it. 10% know it and use it against people. 85% are unaware.", "Knowing isn't enough. Living it is the bar.", "Today, live what you already know to be true."] },
  { file: "RickOwens_broke.mp4", person: "Rick Owens", title: "I can be poor", lines: ["Owens says he never made money for years and it didn't matter — he can be poor, that's not hard for him.", "Comfort with broke is a creative superpower.", "Today, make a decision that prioritizes the work over the money."] },
  { file: "RickOwens_life.mp4", person: "Rick Owens", title: "A reaction to intolerance", lines: ["Owens says his whole life is a reaction to hostility and intolerance — he's not burning anything down, just providing options.", "Making space for others is as creative as making the work itself.", "Today, build a door for someone who's been locked out."] },
  { file: "Saul Williams I know god.mp4", person: "Saul Williams", title: "I know god", lines: ["Saul Williams speaks like someone who has touched something the rest of us only theorize about. He doesn't believe — he knows.", "Direct experience outranks every theology.", "Today, trust what you've actually felt over what you've been told."] },
  { file: "Saul_willaims.mp4", person: "Saul Williams", title: "We get the leaders we deserve", lines: ["Saul says we've been excited about people who make money without thinking about the exploitation behind it. We get the leaders we deserve.", "Culture is just the sum of what we celebrate.", "Today, celebrate someone who deserves it instead of someone who's loud."] },
  { file: "Snoop Dogg_speach.mp4", person: "Snoop Dogg", title: "Stay humble, hungry, true", lines: ["Snoop says: stay humble, stay hungry, stay true. The underdog story is the only real story.", "When you come from nothing, you appreciate everything.", "Today, remember where you came from. Then go further."] },
  { file: "Style - Charles Bukowski.mp4", person: "Charles Bukowski", title: "Style is the answer to everything", lines: ["Bukowski said style is the answer to everything. To do a dull thing with style is preferable to doing a dangerous thing without it.", "Style isn't decoration. It's how you do anything.", "Today, do one ordinary thing with full style."] },
  { file: "Terrance MCKenna 1999.mp4", person: "Terence McKenna", title: "Weirder and weirder", lines: ["McKenna predicted things would get weirder until people had no choice but to talk about how weird it is.", "We're living in the prophecy. Welcome.", "Today, name the weirdness out loud instead of pretending it's normal."] },
  { file: "Tupac Hell.mp4", person: "Tupac", title: "Karma comes back", lines: ["Pac said he believes in karma — anything bad you do comes back. But in his world, what he was doing felt right.", "Living with conviction means accepting the bill when it arrives.", "Today, do the thing you can stand behind in ten years."] },
  { file: "Tupac push .mp4", person: "Tupac", title: "Outside the boundaries", lines: ["Pac said if we don't ever go outside the boundaries, we'll never change anything — we'll just talk about the people who did.", "The line was drawn by someone who didn't want you crossing it.", "Today, cross one line that isn't yours."] },
  { file: "Tyler, The Creator_crazy.mp4", person: "Tyler, the Creator", title: "You have to be delusional", lines: ["Tyler says to make stuff you have to be delusional — and you need people around you who trust the delusion.", "Sanity is not a creative asset. Conviction is.", "Today, protect your delusion. Surround it with people who don't try to fix it."] },
  { file: "Vivienne_status.mp4", person: "Vivienne Westwood", title: "Buy less", lines: ["Westwood said the real status symbol is a book under your arm — buy less, wear what you love.", "Consumption is the opposite of taste.", "Today, want less. Use what you already have."] },
  { file: "Werner Herzog.mp4", person: "Werner Herzog", title: "Running out of fantasy", lines: ["Herzog says he's running out of fantasy. He doesn't know what else can happen now.", "Even masters have moments where the well looks dry. They keep going.", "Today, work even when the well feels empty. It refills through use, not rest."] },
  { file: "Yohji Yamamoto copy.mp4", person: "Yohji Yamamoto", title: "Copy until you find yourself", lines: ["Yamamoto says copy someone you love, copy them until you end up copying yourself.", "Imitation isn't the opposite of originality. It's the path to it.", "Today, copy something you love openly. Watch what becomes yours."] },
  { file: "YohjiYamamoto_profit.mp4", person: "Yohji Yamamoto", title: "Comfortable profit is enough", lines: ["Yamamoto says in America, success means fame and money. For him, comfortable profit is enough — enough to keep going.", "Enough is a number most people refuse to define for themselves.", "Today, define your enough. Then stop chasing past it."] },
  { file: "YohjiYamamoto_property.mp4", person: "Yohji Yamamoto", title: "My most gorgeous moment", lines: ["Yamamoto doesn't care about big houses or private jets — his most gorgeous moment is creating, growing.", "The making is the reward. Everything else is decoration.", "Today, locate your most gorgeous moment. Spend more time there."] },
  { file: "ZackDeLaRocha_history.mp4", person: "Zack de la Rocha", title: "Inheritors", lines: ["Zack lays it out: this country inherited genocide, slavery, and the only nuclear bomb ever dropped on another country.", "You can't make honest art without honest history.", "Today, look at the inheritance, not just the inventory."] },
  { file: "alexanderBell.mp4", person: "Alexander Graham Bell story", title: "Trying to help one person", lines: ["Bell invented the telephone trying to build a hearing aid for a family member. He wasn't trying to change the world — he was trying to help one person.", "The biggest inventions usually start as the smallest acts of love.", "Today, solve a problem for one specific person you care about."] },
  { file: "andyWarhol.mp4", person: "Andy Warhol", title: "I ran out of ideas", lines: ["Asked what prompted his self-portraits, Warhol shrugged: I ran out of ideas.", "Permission to be empty is its own kind of creative discipline.", "Today, when you run out of ideas, make something about that."] },
  { file: "bjork_pleaes.mp4", person: "Björk", title: "Don't try to please anyone", lines: ["Björk says if you don't try to please anyone, you have a slight chance of pleasing everyone. If you try to please ten people, you'll please nobody.", "Targeting an audience is how you lose them.", "Today, make the thing you want. Let the audience find you."] },
  { file: "davidLynch_meditaion.mp4", person: "David Lynch", title: "Sweetest nectar", lines: ["Lynch compares meditation to tasting a donut for the first time — except the sweetness is infinite. Pure bliss consciousness.", "There's a layer beneath the noise that's always available.", "Today, sit quietly for ten minutes. Just to taste it."] },
  { file: "johncleese.mp4", person: "John Cleese", title: "Fear of mistakes", lines: ["Cleese says nothing stops creativity faster than fear of making a mistake. True play is experiment.", "The willingness to look stupid is the entry fee for being interesting.", "Today, do something where you might look ridiculous."] },
  { file: "ohn Lydon on authentic.mp4", person: "John Lydon", title: "I don't give a shit what you think", lines: ["Lydon says he tries to shock no one — he's just honest, and honesty is shocking enough on its own.", "Authenticity offends people who are performing.", "Today, say one true thing without softening it."] },
  { file: "rasta elder.mp4", person: "Rasta Elder", title: "Love yourself first", lines: ["The elder says you have to love yourself first — if you don't, you don't have any love to give.", "Self-love isn't selfish. It's the source.", "Today, do one thing for yourself out of love, not maintenance."] },
  { file: "rickOwens.mp4", person: "Rick Owens", title: "Almost rage", lines: ["Owens says he still feels the same urgency — almost rage — that he had when he started. There are things he wants to see that don't exist, so he has to make them.", "Rage at absence is one of the purest creative engines.", "Today, make the thing you've been waiting for someone else to make."] },
  { file: "rickandmorty.mp4", person: "Rick (Rick and Morty)", title: "Your boos don't mean anything", lines: ["Rick says: your boos don't mean anything to me, I've seen what you people cheer for.", "Disapproval from people with bad taste is a compliment.", "Today, ignore the boos from the wrong room."] },
  { file: "sade_truth.mp4", person: "Sade", title: "Bricks in the wall", lines: ["Sade says every time you hold something back from someone, you put another brick in the wall between you.", "Honesty is maintenance. Silence is construction.", "Today, take down one brick. Say the held-back thing."] },
  { file: "slackers.mp4", person: "Slacker", title: "Every thought is its own reality", lines: ["Every thought you have creates its own reality. The choices you don't make fork off and become their own worlds.", "Your unlived lives are real somewhere. The one you're in is the one that needs you.", "Today, live the life you're actually in. Fully."] },
  { file: "steve Jobs crazy ones.mp4", person: "Steve Jobs", title: "Here's to the crazy ones", lines: ["Here's to the crazy ones, the misfits, the rebels. The only thing you can't do is ignore them, because they change things.", "The people who change things are always uncomfortable to be around at first.", "Today, be one of the crazy ones in one small way."] },
  { file: "steve_jobs_speach.mp4", person: "Steve Jobs", title: "Books got me out", lines: ["Jobs said books kept him out of jail — he could read Aristotle or Plato directly, no intermediary.", "Reading is the original direct line to the source.", "Today, read something old. Skip the commentary."] },
  { file: "sunRa_inspiration.mp4", person: "Sun Ra", title: "The planets, the creator, real and mythical gods", lines: ["Sun Ra's influences: the planets, the creator, mythical and real gods, people, flowers, everything in nature.", "Inspiration is everywhere if your antenna is up.", "Today, get inspiration from something non-human."] },
  { file: "synoxys .mp4", person: "Synoxys", title: "Trading time for things", lines: ["Poor and middle class people feel like everything is expensive because they pay with money they exchanged their time for. They're paying with their life — because they are.", "Time is the only real currency. Spend it like it.", "Today, calculate one purchase in hours of your life. See if you still want it."] },
  { file: "sza.mp4", person: "SZA", title: "Not everything has to be said", lines: ["Coming off a silent retreat, SZA says she learned not everything has to be said — and that waiting is really important.", "Silence is a form of intelligence we've forgotten how to use.", "Today, leave one thing unsaid. See what fills the space."] },
  { file: "tricky.mp4", person: "Tricky", title: "Don't learn to sing", lines: ["Björk told Tricky never to take a singing lesson — because if he learned to sing properly, his weird melodies would disappear.", "Sometimes refinement kills the thing that made you you.", "Today, protect the part of your craft that's untrained. That's the magic."] },
  { file: "twilightZone.mp4", person: "Rod Serling", title: "Filed under M for mankind", lines: ["Any state that fails to recognize the worth and dignity of man is obsolete — filed under M for mankind in the Twilight Zone.", "The dignity of people is the only test that matters.", "Today, treat one person like their dignity is the whole point. Because it is."] },
];

// get today's video based on date
function getTodayContent() {
  const now = new Date();
  const start = new Date(2026, 0, 1); // Jan 1, 2026 as epoch
  const daysSinceStart = Math.floor((now - start) / 86400000);
  const index = ((daysSinceStart % VIDEOS.length) + VIDEOS.length) % VIDEOS.length;
  const video = VIDEOS[index];

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const moonPhases = ["new moon", "waxing crescent", "first quarter moon", "waxing gibbous", "full moon", "waning gibbous", "last quarter moon", "waning crescent"];
  const moonIndex = Math.floor((daysSinceStart % 29.5) / 3.69);

  const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const context = `${days[now.getDay()]}. ${moonPhases[moonIndex % 8]}.`;

  return { ...video, dateStr, context, index };
}

const font = "Courier New, Courier, monospace";
const link = { background: "none", border: "none", fontFamily: font, fontSize: 15, color: "#0000EE", textDecoration: "underline", cursor: "pointer", padding: "4px 2px", minHeight: 32 };

function Login({ onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");

  return (
    <div style={{ fontFamily: font, maxWidth: 480, margin: "24px auto 48px", padding: "0 16px" }}>
      <h2 style={{ fontSize: 16, fontWeight: "normal", marginBottom: 4 }}>becausebecausebecause.xyz</h2>
      <p style={{ fontSize: 13, color: "#666", marginTop: 0, marginBottom: 24 }}>a daily reflection practice</p>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", marginBottom: 16 }} />
      <p style={{ fontSize: 14, marginBottom: 16 }}>
        <button onClick={() => setMode("login")} style={{ ...link, fontWeight: mode === "login" ? "bold" : "normal" }}>log in</button>
        {" | "}
        <button onClick={() => setMode("signup")} style={{ ...link, fontWeight: mode === "signup" ? "bold" : "normal" }}>create account</button>
      </p>
      {mode === "signup" && (
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 13, display: "block", marginBottom: 2 }}>name:</label>
          <input style={{ fontFamily: font, fontSize: 16, padding: "8px 10px", width: "100%", maxWidth: 320, border: "1px solid #999" }} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      )}
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 13, display: "block", marginBottom: 2 }}>email:</label>
        <input type="email" style={{ fontFamily: font, fontSize: 16, padding: "8px 10px", width: "100%", maxWidth: 320, border: "1px solid #999" }} value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, display: "block", marginBottom: 2 }}>password:</label>
        <input type="password" style={{ fontFamily: font, fontSize: 16, padding: "8px 10px", width: "100%", maxWidth: 320, border: "1px solid #999" }} value={pass} onChange={(e) => setPass(e.target.value)} />
      </div>
      <button onClick={() => mode === "login" ? onLogin(email) : onSignup(name || "friend", email)} style={{ fontFamily: font, fontSize: 14, padding: "4px 16px", cursor: "pointer", background: "#eee", border: "1px solid #999" }}>
        {mode === "login" ? "log in" : "create account"}
      </button>
    </div>
  );
}

function Nav({ current, onNavigate, onLogout }) {
  return (
    <div style={{ fontSize: 14, marginBottom: 16, display: "flex", flexWrap: "wrap", gap: "4px 8px", alignItems: "center" }}>
      {current !== "daily" && <><button style={link} onClick={() => onNavigate("daily")}>today</button><span style={{ color: "#ccc" }}>|</span></>}
      {current !== "journal" && <><button style={link} onClick={() => onNavigate("journal")}>journal</button><span style={{ color: "#ccc" }}>|</span></>}
      {current !== "archive" && <><button style={link} onClick={() => onNavigate("archive")}>archive</button><span style={{ color: "#ccc" }}>|</span></>}
      {current !== "donate" && <><button style={link} onClick={() => onNavigate("donate")}>donate</button><span style={{ color: "#ccc" }}>|</span></>}
      <button style={link} onClick={onLogout}>log out</button>
    </div>
  );
}

function Daily({ notes, setNotes, onSave, onNavigate, onLogout }) {
  const today = useMemo(getTodayContent, []);
  const [playing, setPlaying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState("");

  const handleSave = () => {
    if (notes.trim()) { onSave(today); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  const handleShare = async () => {
    const url = "https://becausebecausebecause.xyz";
    const text = `becausebecausebecause.xyz — today: ${today.person}, "${today.title}"`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "becausebecausebecause.xyz", text, url });
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
    <div style={{ fontFamily: font, maxWidth: 540, margin: "24px auto 48px", padding: "0 16px" }}>
      <h2 style={{ fontSize: 16, fontWeight: "normal", marginBottom: 4 }}>becausebecausebecause.xyz</h2>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", marginBottom: 8 }} />
      <Nav current="daily" onNavigate={onNavigate} onLogout={onLogout} />

      <h1 style={{ fontSize: 18, fontWeight: "normal", margin: "24px 0 2px", lineHeight: 1.2 }}>{today.dateStr}</h1>
      <p style={{ fontSize: 12, color: "#666", margin: "0 0 24px" }}>{today.context}</p>

      <p style={{ fontSize: 12, color: "#999", margin: "0 0 4px" }}>featuring: {today.person}</p>
      <h3 style={{ fontSize: 18, fontWeight: "bold", margin: "0 0 12px" }}>{today.title}</h3>
      {today.lines.map((line, i) => (
        <p key={i} style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 8px" }}>{line}</p>
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
          <p style={{ fontSize: 12, color: "#666", margin: 0 }}>watch, then write.</p>
          <button onClick={handleShare} style={link}>share this page</button>
        </div>
        {shared && <p style={{ fontSize: 12, color: "#666", margin: "2px 0 0", textAlign: "right" }}>{shared}</p>}
      </div>

      <div style={{ margin: "24px 0" }}>
        <p style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>your reflection:</p>
        <textarea placeholder="what came up for you..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ fontFamily: font, fontSize: 14, width: "100%", minHeight: 120, padding: 8, border: "1px solid #999", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6 }} />
        <div style={{ marginTop: 8 }}>
          <button onClick={handleSave} style={{ fontFamily: font, fontSize: 14, padding: "4px 16px", cursor: "pointer", background: "#eee", border: "1px solid #999" }}>save to journal</button>
          {saved && <span style={{ fontSize: 13, color: "#666", marginLeft: 8 }}>saved.</span>}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "32px 0 8px" }} />
      <p style={{ fontSize: 11, color: "#999" }}>becausebecausebecause.xyz — {VIDEOS.length} videos in rotation</p>
    </div>
  );
}

function Journal({ savedNotes, onNavigate, onLogout }) {
  return (
    <div style={{ fontFamily: font, maxWidth: 540, margin: "24px auto 48px", padding: "0 16px" }}>
      <h2 style={{ fontSize: 16, fontWeight: "normal", marginBottom: 4 }}>becausebecausebecause.xyz</h2>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", marginBottom: 8 }} />
      <Nav current="journal" onNavigate={onNavigate} onLogout={onLogout} />
      <h1 style={{ fontSize: 24, fontWeight: "normal", margin: "24px 0 16px" }}>your journal</h1>
      {savedNotes.length === 0
        ? <p style={{ fontSize: 14, color: "#666" }}>no entries yet. <button style={link} onClick={() => onNavigate("daily")}>go to today's reflection</button>.</p>
        : savedNotes.map((entry, i) => (
          <div key={i} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #eee" }}>
            <p style={{ fontSize: 12, color: "#999", margin: "0 0 2px" }}>{entry.date}</p>
            <p style={{ fontSize: 13, color: "#666", margin: "0 0 4px" }}>{entry.person} — {entry.title}</p>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{entry.text}</p>
          </div>
        ))
      }
      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "32px 0 8px" }} />
      <p style={{ fontSize: 11, color: "#999" }}>becausebecausebecause.xyz</p>
    </div>
  );
}

function Archive({ onNavigate, onLogout }) {
  return (
    <div style={{ fontFamily: font, maxWidth: 540, margin: "24px auto 48px", padding: "0 16px" }}>
      <h2 style={{ fontSize: 16, fontWeight: "normal", marginBottom: 4 }}>becausebecausebecause.xyz</h2>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", marginBottom: 8 }} />
      <Nav current="archive" onNavigate={onNavigate} onLogout={onLogout} />
      <h1 style={{ fontSize: 18, fontWeight: "normal", margin: "24px 0 16px" }}>past reflections</h1>
      {(() => {
        const now = new Date();
        const start = new Date(2026, 0, 1);
        const daysSinceStart = Math.floor((now - start) / 86400000);
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const past = [];
        for (let d = daysSinceStart - 1; d >= 0; d--) {
          const idx = ((d % VIDEOS.length) + VIDEOS.length) % VIDEOS.length;
          const date = new Date(start.getTime() + d * 86400000);
          past.push({ v: VIDEOS[idx], date: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}` });
        }
        if (past.length === 0) return <p style={{ fontSize: 13, color: "#666" }}>nothing here yet. come back tomorrow.</p>;
        return past.map((entry, i) => (
          <div key={i} style={{ marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: "#999", marginRight: 8 }}>{entry.date}</span>
            <span style={{ fontWeight: "bold" }}>{entry.v.title}</span>
            <span style={{ color: "#666" }}> — {entry.v.person}</span>
          </div>
        ));
      })()}
      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "32px 0 8px" }} />
      <p style={{ fontSize: 11, color: "#999" }}>becausebecausebecause.xyz</p>
    </div>
  );
}

function Donate({ onNavigate, onLogout }) {
  const [amount, setAmount] = useState("");
  const [thanked, setThanked] = useState(false);

  return (
    <div style={{ fontFamily: font, maxWidth: 540, margin: "24px auto 48px", padding: "0 16px" }}>
      <h2 style={{ fontSize: 16, fontWeight: "normal", marginBottom: 4 }}>becausebecausebecause.xyz</h2>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", marginBottom: 8 }} />
      <Nav current="donate" onNavigate={onNavigate} onLogout={onLogout} />
      <h1 style={{ fontSize: 24, fontWeight: "normal", margin: "24px 0 8px" }}>donate</h1>
      <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>this is a free daily practice. if it means something to you, help keep it going.</p>
      {!thanked ? (
        <>
          <p style={{ fontSize: 14 }}>
            {["$5", "$10", "$25", "$50"].map((amt) => (
              <button key={amt} onClick={() => setAmount(amt)} style={{ ...link, fontWeight: amount === amt ? "bold" : "normal", marginRight: 12, color: amount === amt ? "#000" : "#0000EE" }}>{amt}</button>
            ))}
          </p>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13 }}>other amount: </label>
            <input style={{ fontFamily: font, fontSize: 14, padding: "4px 6px", width: 80, border: "1px solid #999" }} value={amount.startsWith("$") ? "" : amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <button onClick={() => { if (amount) setThanked(true); }} style={{ fontFamily: font, fontSize: 14, padding: "4px 16px", cursor: "pointer", background: "#eee", border: "1px solid #999" }}>donate</button>
        </>
      ) : (
        <p style={{ fontSize: 14 }}>thank you. <span style={{ color: "#999" }}>(stripe integration goes here)</span></p>
      )}
      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "32px 0 8px" }} />
      <p style={{ fontSize: 11, color: "#999" }}>becausebecausebecause.xyz</p>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("daily");
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  const handleSave = (today) => {
    if (notes.trim()) {
      setSavedNotes((prev) => [{ date: today.dateStr, person: today.person, title: today.title, text: notes.trim() }, ...prev]);
      setNotes("");
    }
  };

  const logout = () => { setUser(null); setPage("daily"); };

  if (!user) return <Login onLogin={(email) => setUser({ email })} onSignup={(name, email) => setUser({ name, email })} />;
  if (page === "journal") return <Journal savedNotes={savedNotes} onNavigate={setPage} onLogout={logout} />;
  if (page === "archive") return <Archive onNavigate={setPage} onLogout={logout} />;
  if (page === "donate") return <Donate onNavigate={setPage} onLogout={logout} />;
  return <Daily notes={notes} setNotes={setNotes} onSave={handleSave} onNavigate={setPage} onLogout={logout} />;
}
