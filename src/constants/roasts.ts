/**
 * @fileoverview Humorous roast messages and motivational content for each wealth tier.
 * These messages give the app its personality. Keep them funny but never mean-spirited.
 * Use {{placeholders}} for dynamic values like neighborhood name.
 */

import { WealthTier } from '../types';

// ============================================================================
// ROAST MESSAGES BY TIER
// ============================================================================

/**
 * Roast messages for each wealth tier.
 * {{neighborhood}} - will be replaced with the neighborhood/city name
 * {{homePrice}} - will be replaced with formatted home price
 * {{income}} - will be replaced with formatted income
 */
export const ROAST_MESSAGES: Record<WealthTier, ReadonlyArray<string>> = {
  [WealthTier.MODEST]: [
    "Welcome to {{neighborhood}}, where the vibes are real and the landlords are... present. This is 'we have food at home' territory, and honestly? Nothing wrong with that.",
    
    "{{neighborhood}} is giving strong 'works hard, keeps it real' energy. These folks know every dollar menu item by heart. Respect.",
    
    "Ah, {{neighborhood}}. The kind of place where neighbors actually talk to each other because nobody's too fancy for conversation. The Dollar General knows everyone by name here.",
    
    "{{neighborhood}} keeps it 100. No pretense, no overpriced smoothie shops, just honest living. The American dream without the Instagram filter.",
    
    "This is {{neighborhood}}, where your net worth is measured in character, not commas. People here have real jobs, real problems, and real community.",
    
    "{{neighborhood}}: where 'brunch' is just called 'late breakfast' and nobody judges you for it. These folks prioritize correctly.",
    
    "Welcome to {{neighborhood}}, where the hustle is real and the coffee is $1. No shame in the game here.",
    
    "{{neighborhood}} is proof that you don't need a six-figure salary to live a good life. Just a reasonable commute and a Costco membership.",
    
    "The people of {{neighborhood}} have something the wealthy often lack: time to actually enjoy life. And parking. Always available parking.",
    
    "{{neighborhood}}: where everyone drives slightly older cars but actually owns them. No lease payments, no problems.",
  ],

  [WealthTier.COMFORTABLE]: [
    "{{neighborhood}} is peak 'comfortable but not flashy' - these folks have a 401k, a reliable car, and strong opinions about lawn care. Living the actual dream.",
    
    "Welcome to {{neighborhood}}, where people have figured out the whole 'adulting' thing. Two-car garages, decent school districts, and everyone pretends to like their neighbors.",
    
    "{{neighborhood}} energy: Costco runs, weekend soccer games, and the occasional Olive Garden splurge. This is what stability looks like.",
    
    "Ah, the classic middle class vibe of {{neighborhood}}. These folks vacation in Destin, drive Toyotas, and have actually read their mortgage documents.",
    
    "{{neighborhood}} residents: employed, reasonable, probably have a Ring doorbell. They meal prep on Sundays and complain about property taxes.",
    
    "This is {{neighborhood}}, where people say 'we should do this more often' at neighborhood BBQs and then don't for 8 months.",
    
    "Welcome to {{neighborhood}}, the goldilocks zone: not struggling, not flexing. Just... comfortable. Probably has a Peloton gathering dust somewhere.",
    
    "{{neighborhood}}: where the hedges are trimmed, the credit scores are good, and everyone has opinions about the best route to avoid traffic.",
    
    "The people of {{neighborhood}} have achieved the milestone of 'my problems are mostly optional.' Like deciding which streaming service to cancel.",
    
    "{{neighborhood}} is giving 'we looked at the Whole Foods prices and went to Kroger instead' sophistication. Sensible. Admirable.",
  ],

  [WealthTier.AFFLUENT]: [
    "{{neighborhood}} has entered the chat with its organic grocery bags and 'actually, we prefer experiences over things' energy. Sure, Jan.",
    
    "Welcome to {{neighborhood}}, where everyone drives a crossover SUV that costs more than some people's houses. The children are in travel sports. The coffee is pour-over.",
    
    "{{neighborhood}}: where 'casual Friday' means switching from Lululemon to Athleta. These folks have multiple subscription boxes.",
    
    "Ah, {{neighborhood}}. The land of 'we only use the good olive oil' and 'actually, our financial advisor suggested...' conversations.",
    
    "This is {{neighborhood}}, where people 'summer' as a verb and the dogs have better healthcare than most Americans.",
    
    "{{neighborhood}} residents think Trader Joe's is reasonably priced and have strong opinions about wine regions. They've 'been meaning to use their Peloton more.'",
    
    "Welcome to {{neighborhood}}, where everyone has a cleaning service but still complains about how hard it is to find 'good help.'",
    
    "{{neighborhood}}: where the kids go to private school, the parents go to therapy, and everyone goes to Cabo for spring break.",
    
    "The people of {{neighborhood}} say things like 'money can't buy happiness' from their heated bathroom floors. Technically true!",
    
    "{{neighborhood}} is peak 'we renovated the kitchen last year' energy. Marble countertops. Wolf range. Still orders Uber Eats 4x a week.",
  ],

  [WealthTier.WEALTHY]: [
    "{{neighborhood}}: where 'budget' is a foreign concept and 'gated community' is just common sense. These folks have a guy for everything.",
    
    "Welcome to {{neighborhood}}, where the cars are German, the nannies are certified, and nobody checks the price at restaurants. Must be nice.",
    
    "{{neighborhood}} is giving 'multiple properties' energy. These folks have a main house, a lake house, and a 'place in the city.'",
    
    "Ah, {{neighborhood}}. Where 'roughing it' means the Four Seasons was fully booked and they had to stay at the Ritz instead.",
    
    "This is {{neighborhood}}, where people have wine cellars, art collections, and accountants on retainer. Normal stuff.",
    
    "{{neighborhood}} residents don't ask 'how much' - they ask 'when can it be delivered?' Different level of existence.",
    
    "Welcome to {{neighborhood}}, where the landscaping costs more annually than some college tuitions. Those hedges WILL be perfect.",
    
    "{{neighborhood}}: where everyone has a Tesla for daily driving and a 'fun car' for weekends. The garages are temperature-controlled.",
    
    "The people of {{neighborhood}} fly first class, not for the leg room, but because the lounge has better champagne. Relatable... not.",
    
    "{{neighborhood}} is where 'let's just get a boat' is a casual Tuesday thought. These folks have helicopter-parented their way to success.",
  ],

  [WealthTier.ULTRA_WEALTHY]: [
    "{{neighborhood}}: You've found the 0.1%. These folks don't have jobs, they have 'portfolios.' They don't retire, they 'step back from day-to-day operations.'",
    
    "Welcome to {{neighborhood}}, where the houses have names and the driveways have roundabouts. This isn't wealth, it's a different dimension.",
    
    "{{neighborhood}} is giving 'my accountant has an accountant' energy. These people's pools have pools.",
    
    "Ah, {{neighborhood}}. Where 'problems' means deciding which charity gala to attend or which private jet membership offers better snacks.",
    
    "This is {{neighborhood}}, where homes are 'estates,' parties are 'affairs,' and money is just... present. Like oxygen.",
    
    "{{neighborhood}} residents have staff. Not employees. STAFF. There's a whole organizational chart for the household.",
    
    "Welcome to {{neighborhood}}, where 'casual' means only one helicopter per property. These folks make rich people look middle class.",
    
    "{{neighborhood}}: where the kids' trust funds have trust funds and 'shopping' means calling someone who brings options to you.",
    
    "The people of {{neighborhood}} don't Google things, they have people who Google things for them. Maximum delegation achieved.",
    
    "{{neighborhood}} is where 'family office' isn't a room in the house, it's a team of 15 managing generational wealth. Different planet.",
  ],
} as const;

// ============================================================================
// MOTIVATIONAL MESSAGES BY TIER GAP
// ============================================================================

/**
 * Motivational messages based on how far the user needs to go.
 * Keys represent the "tier gap" (0 = same tier, 4 = MODEST to ULTRA_WEALTHY)
 */
export const MOTIVATIONAL_MESSAGES: Record<number, ReadonlyArray<string>> = {
  0: [
    "Plot twist: you could already live here! Time to start packing? 📦",
    "Hey, you're already playing in this league. Now that's what I call life goals achieved.",
    "Look at you, already at this level. This is just window shopping for you!",
  ],
  1: [
    "One level up? That's totally doable. A promotion, a side hustle, or one really good stock pick away.",
    "You're closer than you think! A few strategic moves and this could be your zip code.",
    "Just one tier to climb. That's like... a really good year or two of career moves. You've got this.",
  ],
  2: [
    "Two levels to go - ambitious, I like it. This is 'change careers strategically' territory.",
    "A solid stretch goal! This is going to take some planning, but absolutely possible.",
    "Two tiers up means you're thinking big. Time to optimize that career trajectory!",
  ],
  3: [
    "Three levels up - we're talking major life restructuring here. But hey, dreams don't have price tags! (Okay, they do. But still.)",
    "This is a 5-10 year plan kind of goal. Buckle up, focus up, and start making moves.",
    "Significant climb ahead! But every mansion started with someone saying 'what if?'",
  ],
  4: [
    "Maximum ambition unlocked! From here to there is a full life transformation. But legends are made, not born.",
    "Going for the top, I see. This is 'start a company that gets acquired' or 'become a specialist surgeon' territory.",
    "The biggest gap possible! This is either incredibly motivating or we should talk about adjusting expectations. Either way, respect for dreaming big.",
  ],
} as const;

// ============================================================================
// LEVEL UP STEP TEMPLATES
// ============================================================================

/**
 * Templates for generating "Level Up Steps".
 * These are actionable (but humorous) steps to reach target income.
 * {{targetIncome}} - formatted target income
 * {{gap}} - the income gap to cover
 * {{years}} - estimated years to achieve
 */
export const LEVEL_UP_STEP_TEMPLATES = {
  EDUCATION: [
    {
      action: "Get that degree (or another one)",
      funNote: "Student loans are just delayed disappointment, but statistically they pay off!",
      estimatedImpact: "+$15,000-40,000/year",
    },
    {
      action: "Get certified in something lucrative",
      funNote: "Letters after your name = dollars in your account. Usually.",
      estimatedImpact: "+$10,000-25,000/year",
    },
  ],
  CAREER_SWITCH: [
    {
      action: "Pivot to a higher-paying industry",
      funNote: "Tech companies are still hiring! Probably. Hopefully.",
      estimatedImpact: "+$30,000-80,000/year",
    },
    {
      action: "Become a specialist in your field",
      funNote: "The riches are in the niches. Be the person they HAVE to call.",
      estimatedImpact: "+$25,000-50,000/year",
    },
  ],
  SIDE_HUSTLE: [
    {
      action: "Start a side hustle",
      funNote: "Your evenings and weekends called - they want to be productive now.",
      estimatedImpact: "+$10,000-30,000/year",
    },
    {
      action: "Monetize a skill you already have",
      funNote: "You're good at something. Someone will pay for it. Probably.",
      estimatedImpact: "+$5,000-20,000/year",
    },
  ],
  NEGOTIATE: [
    {
      action: "Actually negotiate your salary this time",
      funNote: "The worst they can say is no. Actually, the worst is getting fired. Don't get fired.",
      estimatedImpact: "+$5,000-15,000/year",
    },
    {
      action: "Job hop strategically every 2-3 years",
      funNote: "Loyalty is cute. But disloyalty pays better. Sorry, boomers.",
      estimatedImpact: "+$10,000-30,000/year",
    },
  ],
  INVEST: [
    {
      action: "Start investing yesterday (or today, I guess)",
      funNote: "Compound interest is the 8th wonder of the world. Einstein said that. Probably.",
      estimatedImpact: "Builds wealth over time",
    },
    {
      action: "Max out that 401k match",
      funNote: "Free money! Why does anyone leave this on the table?",
      estimatedImpact: "+$3,000-10,000/year in free money",
    },
  ],
  LIFESTYLE: [
    {
      action: "Cut the subscriptions you forgot about",
      funNote: "You're paying for 4 streaming services and watching TikTok. Be honest.",
      estimatedImpact: "Save $100-300/month",
    },
    {
      action: "Cook at home more (revolutionary, I know)",
      funNote: "Every Uber Eats order is a tiny betrayal of your financial goals.",
      estimatedImpact: "Save $200-500/month",
    },
  ],
  HOUSING: [
    {
      action: "House hack (rent a room, get a duplex, etc.)",
      funNote: "Roommates are annoying. But so is being broke. Pick your struggle.",
      estimatedImpact: "Save $500-1,500/month",
    },
    {
      action: "Move somewhere with a lower cost of living",
      funNote: "Remote work means you can live anywhere. Consider it.",
      estimatedImpact: "Save $1,000-3,000/month",
    },
  ],
  BIG_MOVES: [
    {
      action: "Start a business",
      funNote: "90% of startups fail, but 100% of non-startups don't make you a millionaire. Math.",
      estimatedImpact: "Potential: unlimited",
    },
    {
      action: "Get really good at sales",
      funNote: "Everything is sales. Jobs, relationships, convincing yourself to exercise.",
      estimatedImpact: "+$50,000-200,000/year",
    },
  ],
} as const;

// ============================================================================
// SPECIAL LOCATION EASTER EGGS
// ============================================================================

/**
 * Special roast messages for specific famous locations.
 */
export const LOCATION_EASTER_EGGS: Record<string, string> = {
  '90210': "Beverly Hills, 90210! The ZIP code so fancy it got its own TV show. Twice. These folks consider a $500 dinner 'casual Tuesday.'",
  '10001': "Manhattan, baby! Where studio apartments cost more than houses elsewhere and 'space' is a theoretical concept.",
  '33109': "Fisher Island - you literally need a boat to get here. If you have to ask how much, you definitely can't afford it.",
  '94027': "Atherton, CA - the most expensive ZIP code in America. Tech billionaires and venture capitalists vibing.",
  '33480': "Palm Beach - where old money goes to golf and judge new money for being too flashy.",
  '02199': "Back Bay, Boston - where everyone went to Harvard and they'll find a way to mention it within 5 minutes.",
  '60614': "Lincoln Park, Chicago - young professionals, overpriced brunch, and Cubs fans pretending they were fans before 2016.",
} as const;

// ============================================================================
// SHARE TEXT TEMPLATES
// ============================================================================

/**
 * Templates for shareable content.
 */
export const SHARE_TEMPLATES = {
  RESULT_SHARE: "I just found out what it takes to live in {{neighborhood}}! 💰 Median home: {{homePrice}} | Income needed: {{income}} | My career path: {{career}}. Check your neighborhood on Level Up Life!",
  
  ROAST_SHARE: "Level Up Life just roasted my dream neighborhood 💀: '{{shortRoast}}' - Download the app to get your reality check!",
} as const;
