import {
  ACCOMMODATION_ASSET_CATEGORIES,
  ASSET_CATEGORY_OPTIONS_BY_TYPE,
  ASSET_FILTER_TICKET,
  ASSET_FILTER_TYPES,
  ASSET_TYPES,
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT,
  AppUtils,
  EVENT_FEEDBACK_LIST_FILTERS,
  EVENT_VISIBILITIES,
  SUB_EVENT_RESOURCE_FILTERS,
  SUPPLIES_ASSET_CATEGORIES,
  TRANSPORT_ASSET_CATEGORIES,
  isAssetType
} from "./chunk-XQ4NDAVX.js";
import {
  ActivityEventDetailDTO,
  EventFeedbackDetailDto,
  EventFeedbackPageResultDto
} from "./chunk-IECLTXM5.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-XJL7SWH7.js";

// src/app/shared/gdpr-data.ts
var GDPR_CONTENT = {
  title: "Privacy",
  subtitle: "How MyScoutee handles personal data for profile, events, and social activity (including GDPR rights).",
  updatedAt: "2026-02-01",
  contactDetailsHtml: "{{deployment.privacy.contactDetails}}",
  legalBases: [
    "Contract performance for account and event features.",
    "Legitimate interest for platform safety and abuse prevention.",
    "Consent for optional profile details, precise location coordinates, and marketing communication.",
    "Legal obligation for security logs and compliance records."
  ],
  rights: [
    {
      title: "Access",
      items: ["Request a copy of your stored personal data."]
    },
    {
      title: "Rectification",
      items: ["Correct inaccurate profile or account details."]
    },
    {
      title: "Erasure",
      items: ["Request account and personal data deletion where legally possible."]
    },
    {
      title: "Portability",
      items: ["Export your data in a commonly used machine-readable format."]
    },
    {
      title: "Restriction / Objection",
      items: ["Limit or object to specific processing activities."]
    }
  ],
  dataCategories: [
    {
      category: "Account & Identity",
      items: ["Name", "Birthday", "Home city", "Gender", "Profile images"]
    },
    {
      category: "Location & Coordinates",
      items: [
        "Approximate location (city/region)",
        "Precise GPS coordinates (latitude/longitude) when requested",
        "Location update timestamps for event logistics"
      ]
    },
    {
      category: "Activity Data",
      items: ["Chats", "Invitations", "Events", "Hosting interactions", "Ratings"]
    },
    {
      category: "Preference Data",
      items: ["Interests", "Values", "Visibility settings", "Language preferences"]
    },
    {
      category: "Technical Data",
      items: ["Device/browser metadata", "IP/log records", "Session events"]
    }
  ],
  purposes: [
    "Operate profile, chat, event, and hosting features.",
    "Match relevant members and improve discovery quality.",
    "Support location-based matching and distance-aware event coordination.",
    "Detect abuse, spam, and suspicious platform activity.",
    "Support account requests and compliance processes."
  ],
  retention: [
    "Account profile data: retained while account is active.",
    "Precise location coordinates: stored only for active location-enabled features and deleted when no longer required.",
    "Safety and audit logs: retained based on legal/compliance needs.",
    "Deleted accounts: data removed or anonymized after retention window."
  ],
  accountControls: [
    "Delete account is available from the user settings menu. Confirming it schedules the account for deletion and signs the user out.",
    "If the account has been deleted but not yet purged, signing in again can show a reactivation confirmation before the 30-day deletion window ends.",
    "If deletion is requested from Meta/Facebook account settings after Facebook login, Meta sends the request to the MyScoutee backend callback and matching accounts follow the same deletion schedule."
  ],
  sharing: [
    "Service providers for hosting, analytics, and support operations.",
    "Authorities only when required by applicable law.",
    "No sale of personal data."
  ],
  security: [
    "Role-based access control for internal tools.",
    "Encrypted transport for data in transit.",
    "Operational monitoring and incident response procedures."
  ]
};

// src/app/shared/app-static-data.ts
var VIBE_CATEGORIES = ["Energetic", "Social", "Deep", "Relaxed", "Creative", "Exclusive", "Focused"];
var HOSTED_EVENT_TYPES = ["Road Trip", "Game Night", "Brunch", "Hiking", "Coffee Meetup", "Sports"];
var VIBE_ICONS = {
  Energetic: "\u{1F525}",
  Social: "\u{1F4AC}",
  Deep: "\u{1F9E0}",
  Relaxed: "\u{1F33F}",
  Creative: "\u{1F3A8}",
  Exclusive: "\u{1F942}",
  Focused: "\u{1F3AF}"
};
var CATEGORY_ICONS = {
  Sports: "\u{1F3C5}",
  "Road Trip": "\u{1F6E3}\uFE0F",
  Outdoors: "\u{1F332}",
  Games: "\u{1F3AE}",
  Culture: "\u{1F3AD}"
};
var MEMBER_TRAIT_ICONS = {
  Adventurer: "\u{1F525}",
  "Deep Thinker": "\u{1F9E0}",
  Empath: "\u{1F49B}"
};
var NAVIGATOR_HOST_TIER_PRESENTERS = [
  {
    id: "platinum",
    aliases: ["platinum"],
    icon: "diamond",
    colorClass: "icon-tier-platinum",
    toneClass: "impression-shortcut-tone-platinum",
    menuPalette: "sky"
  },
  {
    id: "gold",
    aliases: ["gold"],
    icon: "emoji_events",
    colorClass: "icon-tier-gold",
    toneClass: "impression-shortcut-tone-gold",
    menuPalette: "gold"
  },
  {
    id: "silver",
    aliases: ["silver"],
    icon: "workspace_premium",
    colorClass: "icon-tier-silver",
    toneClass: "impression-shortcut-tone-silver",
    menuPalette: "slate"
  },
  {
    id: "bronze",
    aliases: ["bronze"],
    icon: "military_tech",
    colorClass: "icon-tier-bronze",
    toneClass: "impression-shortcut-tone-bronze",
    menuPalette: "brown"
  }
];
var NAVIGATOR_HOST_TIER_PRESENTER_DEFAULT = {
  aliases: [],
  icon: "workspace_premium",
  colorClass: "icon-tier-default",
  toneClass: "impression-shortcut-tone-platinum",
  menuPalette: "blue"
};
var NAVIGATOR_TRAIT_PRESENTERS = [
  {
    id: "creative",
    aliases: ["kreat", "creative"],
    icon: "palette",
    colorClass: "icon-trait-creative",
    toneClass: "impression-shortcut-tone-creative",
    menuPalette: "violet",
    memberTitle: "Creative Attendee"
  },
  {
    id: "empath",
    aliases: ["empat", "empath"],
    icon: "favorite",
    colorClass: "icon-trait-empath",
    toneClass: "impression-shortcut-tone-empath",
    menuPalette: "pink",
    memberTitle: "Empathetic Attendee"
  },
  {
    id: "reliable",
    aliases: ["megbizh", "reliable"],
    icon: "verified",
    colorClass: "icon-trait-reliable",
    toneClass: "impression-shortcut-tone-reliable",
    menuPalette: "green",
    memberTitle: "Reliable Attendee"
  },
  {
    id: "adventurer",
    aliases: ["advent"],
    icon: "hiking",
    colorClass: "icon-trait-adventurer",
    toneClass: "impression-shortcut-tone-adventurer",
    menuPalette: "sky",
    memberTitle: "Adventurous Attendee"
  },
  {
    id: "thinker",
    aliases: ["think"],
    icon: "psychology",
    colorClass: "icon-trait-thinker",
    toneClass: "impression-shortcut-tone-thinker",
    menuPalette: "blue",
    memberTitle: "Thoughtful Attendee"
  },
  {
    id: "social",
    aliases: ["social"],
    icon: "groups",
    colorClass: "icon-trait-social",
    toneClass: "impression-shortcut-tone-social",
    menuPalette: "teal",
    memberTitle: "Social Attendee"
  },
  {
    id: "playful",
    aliases: ["playful"],
    icon: "sports_esports",
    colorClass: "icon-trait-playful",
    toneClass: "impression-shortcut-tone-playful",
    menuPalette: "orange",
    memberTitle: "Playful Attendee"
  },
  {
    id: "ambitious",
    aliases: ["ambitious", "goal"],
    icon: "trending_up",
    colorClass: "icon-trait-ambitious",
    toneClass: "impression-shortcut-tone-ambitious",
    menuPalette: "purple",
    memberTitle: "Ambitious Attendee"
  }
];
var NAVIGATOR_MEMBER_IMPRESSION_TITLE_PRESENTERS = [
  NAVIGATOR_TRAIT_PRESENTERS[1],
  NAVIGATOR_TRAIT_PRESENTERS[3],
  NAVIGATOR_TRAIT_PRESENTERS[0],
  NAVIGATOR_TRAIT_PRESENTERS[4],
  NAVIGATOR_TRAIT_PRESENTERS[5],
  NAVIGATOR_TRAIT_PRESENTERS[6],
  NAVIGATOR_TRAIT_PRESENTERS[7],
  NAVIGATOR_TRAIT_PRESENTERS[2]
].filter((entry) => Boolean(entry));
var NAVIGATOR_TRAIT_PRESENTER_DEFAULT = {
  aliases: [],
  icon: "auto_awesome",
  colorClass: "icon-trait-default",
  toneClass: "impression-shortcut-tone-thinker",
  menuPalette: "violet",
  memberTitle: "Attendee"
};
var PERSONALITY_TRAIT_CATALOG = [
  {
    id: "social-charmer",
    label: "Social Charmer",
    aliases: ["The Social Charmer"],
    icon: "group",
    coreVibe: "Warm, magnetic, easy to talk to",
    highlights: ["Friendly", "Outgoing", "Funny"],
    toneClass: "trait-tone-social"
  },
  {
    id: "deep-thinker",
    label: "Deep Thinker",
    aliases: ["The Deep Thinker"],
    icon: "psychology",
    coreVibe: "Reflective, intellectual, meaningful",
    highlights: ["Thoughtful", "Curious", "Insightful"],
    toneClass: "trait-tone-deep"
  },
  {
    id: "adventurer",
    label: "Adventurer",
    aliases: ["The Adventurer"],
    icon: "explore",
    coreVibe: "Energetic, bold, spontaneous",
    highlights: ["Spontaneous", "Brave", "Active"],
    toneClass: "trait-tone-adventure"
  },
  {
    id: "reliable-one",
    label: "Reliable One",
    aliases: ["The Reliable One", "Megbizhato", "Megb\xEDzhat\xF3"],
    icon: "verified_user",
    coreVibe: "Stable, trustworthy, grounded",
    highlights: ["Loyal", "Honest", "Dependable"],
    toneClass: "trait-tone-reliable"
  },
  {
    id: "creative-soul",
    label: "Creative Soul",
    aliases: ["The Creative Soul", "Kreativ", "Kreat\xEDv"],
    icon: "palette",
    coreVibe: "Expressive, imaginative, artistic",
    highlights: ["Artistic", "Unique", "Visionary"],
    toneClass: "trait-tone-creative"
  },
  {
    id: "empath",
    label: "Empath",
    aliases: ["The Empath", "Empatikus"],
    icon: "favorite",
    coreVibe: "Kind, emotionally safe, nurturing",
    highlights: ["Caring", "Supportive", "Patient"],
    toneClass: "trait-tone-empath"
  },
  {
    id: "ambitious-go-getter",
    label: "Ambitious Go-Getter",
    aliases: ["The Ambitious Go-Getter"],
    icon: "trending_up",
    coreVibe: "Driven, goal-oriented, high standards",
    highlights: ["Motivated", "Focused", "Strategic thinker"],
    toneClass: "trait-tone-ambitious"
  },
  {
    id: "playful-spirit",
    label: "Playful Spirit",
    aliases: ["The Playful Spirit"],
    icon: "celebration",
    coreVibe: "Lighthearted, fun, youthful",
    highlights: ["Silly", "Optimistic", "Witty"],
    toneClass: "trait-tone-playful"
  }
];
var EVENT_FEEDBACK_PERSONALITY_TRAIT_OPTIONS = PERSONALITY_TRAIT_CATALOG.map((trait) => ({
  id: trait.id,
  label: trait.label,
  icon: trait.icon,
  coreVibe: trait.coreVibe
}));
var PHYSIQUE_OPTIONS = ["Slim", "Lean", "Athletic", "Fit", "Curvy", "Average", "Muscular"];
var LANGUAGE_SUGGESTIONS = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Hungarian",
  "Romanian",
  "Polish",
  "Dutch",
  "Turkish",
  "Arabic",
  "Hindi",
  "Japanese",
  "Korean",
  "Mandarin"
];
var CONTENT_LANGUAGES = [
  { lang: "en", label: "English" },
  { lang: "hu", label: "Magyar" }
];
var HELP_CENTER_HEADER_COLORS = [
  "amber",
  "blue",
  "green",
  "rose",
  "violet",
  "slate"
];
var HELP_CENTER_HEADER_COLOR_OPTIONS = [
  { id: "amber", label: "Amber" },
  { id: "blue", label: "Blue" },
  { id: "green", label: "Green" },
  { id: "rose", label: "Rose" },
  { id: "violet", label: "Violet" },
  { id: "slate", label: "Slate" }
];
var DOCUMENT_VIEWER_HEADER_PALETTES = [
  "amber",
  "blue",
  "green",
  "rose",
  "violet",
  "slate",
  "teal"
];
var EXPLAINABLE_SURFACES = [
  { key: "home.game", label: "Home cards", icon: "style", owner: "route", order: 10, enabled: true },
  { key: "activities.rates", label: "Activity ratings", icon: "star", owner: "popup", order: 20, enabled: true },
  { key: "chats", label: "Chats", icon: "forum", owner: "popup", order: 25, enabled: true },
  { key: "profile.editor", label: "Profile editor", icon: "manage_accounts", owner: "popup", order: 30, enabled: true },
  { key: "profile.view", label: "Profile details", icon: "visibility", owner: "popup", order: 40, enabled: true },
  { key: "contacts", label: "Contacts", icon: "contacts", owner: "popup", order: 45, enabled: true },
  { key: "assets", label: "Assets", icon: "inventory_2", owner: "popup", order: 50, enabled: true },
  { key: "assets.transport", label: "Assets \xB7 Transport", icon: "directions_car", owner: "popup", order: 51, enabled: true },
  { key: "assets.accommodation", label: "Assets \xB7 Accommodation", icon: "apartment", owner: "popup", order: 52, enabled: true },
  { key: "assets.supplies", label: "Assets \xB7 Supplies", icon: "inventory_2", owner: "popup", order: 53, enabled: true },
  { key: "assets.tickets", label: "Assets \xB7 Tickets", icon: "qr_code_2", owner: "popup", order: 54, enabled: true },
  { key: "events", label: "Events", icon: "event_note", owner: "popup", order: 60, enabled: true },
  { key: "event.editor", label: "Event editor", icon: "edit_calendar", owner: "popup", order: 65, enabled: true },
  { key: "event.feedback", label: "Event feedback", icon: "rate_review", owner: "popup", order: 70, enabled: true }
];
var PROFILE_STATUS_OPTIONS = [
  { value: "public", icon: "public" },
  { value: "friends only", icon: "groups" },
  { value: "host only", icon: "stadium" },
  { value: "inactive", icon: "visibility_off" }
];
var PROFILE_DETAIL_GROUP_TEMPLATES = [
  {
    title: "Basics",
    rows: [
      { labelKey: "profile.name", privacy: "Public" },
      { labelKey: "profile.city", privacy: "Public" },
      { labelKey: "profile.birthday", privacy: "Friends" },
      { labelKey: "profile.height", privacy: "Friends" },
      { labelKey: "profile.physique", privacy: "Friends" },
      { labelKey: "profile.languages", privacy: "Public" },
      { labelKey: "profile.horoscope", privacy: "Public" }
    ]
  },
  {
    title: "Lifestyle",
    rows: [
      { labelKey: "profile.details.interest", privacy: "Friends" },
      { labelKey: "profile.details.drinking", privacy: "Friends" },
      { labelKey: "profile.details.smoking", privacy: "Friends" },
      { labelKey: "profile.details.workout", privacy: "Public" },
      { labelKey: "profile.details.pets", privacy: "Public" }
    ]
  },
  {
    title: "Relationships",
    rows: [
      { labelKey: "profile.details.familyPlans", privacy: "Hosts" },
      { labelKey: "profile.details.children", privacy: "Private" },
      { labelKey: "profile.details.loveStyle", privacy: "Hosts" },
      { labelKey: "profile.details.communicationStyle", privacy: "Friends" },
      { labelKey: "profile.details.sexualOrientation", privacy: "Hosts" },
      { labelKey: "profile.gender", privacy: "Public" }
    ]
  },
  {
    title: "Beliefs",
    rows: [
      { labelKey: "profile.details.religion", privacy: "Private" },
      { labelKey: "profile.details.values", privacy: "Friends" }
    ]
  }
];
var PROFILE_DETAIL_VALUE_OPTIONS = {
  "profile.details.drinking": ["Never", "Socially", "Occasionally", "Weekends only"],
  "profile.details.smoking": ["Never", "Socially", "Occasionally", "Trying to quit"],
  "profile.details.workout": ["Daily", "4x / week", "2-3x / week", "Rarely"],
  "profile.details.pets": ["Dog-friendly", "Cat-friendly", "All pets welcome", "No pets"],
  "profile.details.familyPlans": ["Wants children", "Open to children", "Not sure yet", "Does not want children"],
  "profile.details.children": ["No", "Yes", "Prefer not to say"],
  "profile.details.loveStyle": ["Long-term partnership", "Slow-burn connection", "Open relationship", "Exploring"],
  "profile.details.communicationStyle": ["Direct + warm", "Calm + reflective", "Playful + light", "Honest + concise"],
  "profile.details.sexualOrientation": ["Straight", "Bisexual", "Gay", "Lesbian", "Pansexual", "Asexual", "Prefer not to say"],
  "profile.gender": ["Woman", "Man", "Non-binary", "Prefer not to say"],
  "profile.details.religion": ["Spiritual but not religious", "Christian", "Muslim", "Jewish", "Buddhist", "Hindu", "Atheist", "Prefer not to say"],
  "profile.details.values": [
    "Family-first, social impact, balanced life",
    "Career-driven, growth-oriented, adventurous",
    "Sustainability, empathy, community",
    "Creativity, freedom, authenticity"
  ]
};
var BELIEFS_VALUES_OPTION_GROUPS = [
  {
    title: "Relationship & Family",
    shortTitle: "Family",
    icon: "\u{1F46A}",
    toneClass: "section-family",
    options: [
      "Long-term partnership",
      "Marriage-oriented",
      "Casual dating",
      "Open / Exploring",
      "Family-first",
      "Wants children",
      "Independent lifestyle"
    ]
  },
  {
    title: "Life Focus & Ambition",
    shortTitle: "Ambition",
    icon: "\u{1F3AF}",
    toneClass: "section-ambition",
    options: [
      "Career-focused",
      "Entrepreneurial",
      "Stability-focused",
      "Balanced work-life",
      "Freedom-oriented",
      "Goal-driven"
    ]
  },
  {
    title: "Lifestyle Orientation",
    shortTitle: "Lifestyle",
    icon: "\u{1F33F}",
    toneClass: "section-lifestyle",
    options: [
      "Health & wellness focused",
      "Fitness-driven",
      "Mindfulness-oriented",
      "Social / party lifestyle",
      "Calm / home-centered",
      "Adventure-driven",
      "Balanced lifestyle"
    ]
  },
  {
    title: "Beliefs & Worldview",
    shortTitle: "Beliefs",
    icon: "\u2728",
    toneClass: "section-beliefs",
    options: [
      "Faith-oriented",
      "Spiritual but not religious",
      "Secular",
      "Traditional values",
      "Progressive values",
      "Community-driven",
      "Social impact oriented",
      "Environmentally conscious",
      "Politically engaged",
      "Apolitical"
    ]
  }
];
var INTEREST_OPTION_GROUPS = [
  {
    title: "Social & Lifestyle",
    shortTitle: "Social",
    icon: "\u{1F942}",
    toneClass: "section-social",
    options: ["#GoingOut", "#Nightlife", "#StayingIn", "#Brunch", "#WineTasting", "#CoffeeDates", "#ContentCreation", "#InfluencerLife"]
  },
  {
    title: "Arts & Entertainment",
    shortTitle: "Arts",
    icon: "\u{1F3AD}",
    toneClass: "section-arts",
    options: ["#Music", "#Concerts", "#Festivals", "#Movies", "#TVShows", "#Theatre", "#Gaming", "#Anime", "#Books", "#Photography", "#Creativity"]
  },
  {
    title: "Food & Experiences",
    shortTitle: "Food",
    icon: "\u{1F37D}",
    toneClass: "section-food",
    options: ["#Foodie", "#FineDining", "#StreetFood", "#Cooking", "#Cocktails", "#CraftBeer", "#Travel", "#LuxuryExperiences"]
  },
  {
    title: "Active & Adventure",
    shortTitle: "Active",
    icon: "\u{1F3D5}",
    toneClass: "section-active",
    options: ["#Sports", "#Gym", "#Running", "#Hiking", "#Outdoors", "#ExtremeSports", "#Yoga", "#Fitness"]
  },
  {
    title: "Mind & Wellness",
    shortTitle: "Mind",
    icon: "\u{1F9D8}",
    toneClass: "section-mind",
    options: ["#Wellness", "#Meditation", "#SelfDevelopment", "#MentalHealth", "#Spirituality", "#Biohacking", "#HealthyLifestyle"]
  },
  {
    title: "Values & Identity",
    shortTitle: "Identity",
    icon: "\u{1F30D}",
    toneClass: "section-identity",
    options: ["#Sustainability", "#Entrepreneurship", "#CareerDriven", "#FamilyOriented", "#Activism", "#Tech", "#Minimalism"]
  }
];
var DETAIL_PRIVACY_OPTIONS = ["Public", "Friends", "Hosts", "Private"];
var EXPERIENCE_FILTER_OPTIONS = [
  "All",
  "Workspace",
  "School",
  "Online Session",
  "Additional Project"
];
var EXPERIENCE_TYPE_OPTIONS = ["Workspace", "School", "Online Session", "Additional Project"];
var PROFILE_SAMPLE_EXPERIENCE_ENTRIES = [
  {
    id: "exp-1",
    type: "School",
    title: "BSc Computer Science",
    org: "State University",
    city: "Austin",
    dateFrom: "2014-09",
    dateTo: "2018-06",
    description: "Software engineering and distributed systems."
  },
  {
    id: "exp-2",
    type: "Additional Project",
    title: "Community Event Platform",
    org: "Independent Project",
    city: "Austin",
    dateFrom: "2018-09",
    dateTo: "2019-05",
    description: "Built MVP with profile, event, and chat modules."
  },
  {
    id: "exp-3",
    type: "Workspace",
    title: "Community Lead",
    org: "Studio Tide",
    city: "Chicago",
    dateFrom: "2019-06",
    dateTo: "2021-08",
    description: "Owned member engagement and host onboarding."
  },
  {
    id: "exp-4",
    type: "Online Session",
    title: "Remote Product Sprint",
    org: "Northwind Labs",
    city: "Online",
    dateFrom: "2021-10",
    dateTo: "2022-02",
    description: "Cross-functional delivery for profile editor v2."
  },
  {
    id: "exp-5",
    type: "Workspace",
    title: "Product Manager",
    org: "Northwind Labs",
    city: "Austin",
    dateFrom: "2022-03",
    dateTo: "Present",
    description: "Leads social graph and trust product areas."
  }
];
var ASSET_TYPE_OPTIONS = [...ASSET_TYPES];
var ASSET_FILTER_OPTIONS = [...ASSET_FILTER_TYPES];
var ASSET_TYPE_LABELS = {
  [ASSET_TYPE_TRANSPORT]: ASSET_TYPE_TRANSPORT,
  [ASSET_TYPE_ACCOMMODATION]: ASSET_TYPE_ACCOMMODATION,
  [ASSET_TYPE_SUPPLIES]: ASSET_TYPE_SUPPLIES,
  [ASSET_FILTER_TICKET]: ASSET_FILTER_TICKET
};
var ASSET_CATEGORY_OPTIONS_BY_TYPE2 = {
  [ASSET_TYPE_TRANSPORT]: [...ASSET_CATEGORY_OPTIONS_BY_TYPE[ASSET_TYPE_TRANSPORT]],
  [ASSET_TYPE_ACCOMMODATION]: [...ASSET_CATEGORY_OPTIONS_BY_TYPE[ASSET_TYPE_ACCOMMODATION]],
  [ASSET_TYPE_SUPPLIES]: [...ASSET_CATEGORY_OPTIONS_BY_TYPE[ASSET_TYPE_SUPPLIES]]
};
var ACTIVITIES_PRIMARY_FILTERS = [
  { key: "rates", label: "Rates", icon: "star" },
  { key: "chats", label: "Chats", icon: "chat" },
  { key: "invitations", label: "Invitations", icon: "mail" },
  { key: "events", label: "Events", icon: "event" },
  { key: "hosting", label: "Hosting", icon: "stadium" }
];
var ACTIVITIES_SECONDARY_FILTERS = [
  { key: "recent", label: "Upcoming", icon: "schedule" },
  { key: "relevant", label: "Relevant", icon: "auto_awesome" },
  { key: "past", label: "Past", icon: "history" }
];
var ACTIVITIES_CHAT_CONTEXT_FILTERS = [
  { key: "all", label: "all", icon: "forum" },
  { key: "event", label: "event", icon: "event" },
  { key: "subEvent", label: "sub.event", icon: "event_available" },
  { key: "group", label: "group", icon: "groups" },
  { key: "service", label: "service", icon: "support_agent" },
  { key: "appSupport", label: "app.support", icon: "admin_panel_settings" }
];
var RATE_FILTERS = [
  { key: "individual-given", label: "Given" },
  { key: "individual-received", label: "Received" },
  { key: "individual-mutual", label: "Mutual" },
  { key: "individual-met", label: "Met" },
  { key: "pair-given", label: "Given" },
  { key: "pair-received", label: "Received" }
];
var RATE_FILTER_ENTRIES = [
  { kind: "group", label: "Preferences" },
  { kind: "item", key: "individual-given", label: "Given" },
  { kind: "item", key: "individual-received", label: "Received" },
  { kind: "item", key: "individual-mutual", label: "Mutual" },
  { kind: "item", key: "individual-met", label: "Met" },
  { kind: "group", label: "Suggestions" },
  { kind: "item", key: "pair-given", label: "Given" },
  { kind: "item", key: "pair-received", label: "Received" }
];
var ACTIVITIES_VIEW_OPTIONS = [
  { key: "month", label: "Month", icon: "calendar_month" },
  { key: "week", label: "Week", icon: "date_range" },
  { key: "day", label: "Day", icon: "today" },
  { key: "distance", label: "Distance", icon: "social_distance" }
];
var EVENT_EXPLORE_ORDER_OPTIONS = [
  { key: "upcoming", label: "Upcoming", icon: "event_upcoming" },
  { key: "past-events", label: "Kor\xE1bbi", icon: "history" },
  { key: "nearby", label: "Nearby", icon: "near_me" },
  { key: "most-relevant", label: "Most Relevant", icon: "auto_awesome" },
  { key: "top-rated", label: "Top Rated", icon: "emoji_events" }
];
var HOME_GAME_FILTER_INTEREST_GROUPS = [
  {
    title: "Social",
    icon: "celebration",
    toneClass: "game-filter-group-tone-social",
    options: ["#GoingOut", "#Nightlife", "#StayingIn", "#Brunch", "#WineTasting", "#CoffeeDates", "#ContentCreation", "#InfluencerLife"]
  },
  {
    title: "Arts",
    icon: "palette",
    toneClass: "game-filter-group-tone-arts",
    options: ["#Music", "#Concerts", "#Festivals", "#Movies", "#TVShows", "#Theatre", "#Gaming", "#Anime", "#Books", "#Photography", "#Creativity"]
  },
  {
    title: "Food",
    icon: "restaurant",
    toneClass: "game-filter-group-tone-food",
    options: ["#Foodie", "#FineDining", "#StreetFood", "#Cooking", "#Cocktails", "#CraftBeer", "#Travel", "#LuxuryExperiences"]
  },
  {
    title: "Active",
    icon: "hiking",
    toneClass: "game-filter-group-tone-active",
    options: ["#Sports", "#Gym", "#Running", "#Hiking", "#Outdoors", "#ExtremeSports", "#Yoga", "#Fitness"]
  },
  {
    title: "Mind",
    icon: "self_improvement",
    toneClass: "game-filter-group-tone-mind",
    options: ["#Wellness", "#Meditation", "#SelfDevelopment", "#MentalHealth", "#Spirituality", "#Biohacking", "#HealthyLifestyle"]
  },
  {
    title: "Identity",
    icon: "public",
    toneClass: "game-filter-group-tone-identity",
    options: ["#Sustainability", "#Entrepreneurship", "#CareerDriven", "#FamilyOriented", "#Activism", "#Tech", "#Minimalism"]
  }
];
var HOME_GAME_FILTER_VALUES_GROUPS = [
  {
    title: "Family",
    icon: "family_restroom",
    toneClass: "game-filter-group-tone-family",
    options: ["Long-term partnership", "Marriage-oriented", "Casual dating", "Open / Exploring", "Family-first", "Wants children", "Independent lifestyle"]
  },
  {
    title: "Ambition",
    icon: "track_changes",
    toneClass: "game-filter-group-tone-ambition",
    options: ["Career-focused", "Entrepreneurial", "Stability-focused", "Balanced work-life", "Freedom-oriented", "Goal-driven"]
  },
  {
    title: "Lifestyle",
    icon: "eco",
    toneClass: "game-filter-group-tone-lifestyle",
    options: ["Health & wellness focused", "Fitness-driven", "Mindfulness-oriented", "Social / party lifestyle", "Calm / home-centered", "Adventure-driven", "Balanced lifestyle"]
  },
  {
    title: "Beliefs",
    icon: "auto_awesome",
    toneClass: "game-filter-group-tone-beliefs",
    options: ["Faith-oriented", "Spiritual but not religious", "Secular", "Traditional values", "Progressive values", "Community-driven", "Social impact oriented", "Environmentally conscious", "Politically engaged", "Apolitical"]
  }
];
var HOME_USER_FACET_BY_ID = {
  u1: {
    interests: ["#Outdoors", "#Travel", "#Brunch"],
    values: ["Family-first", "Balanced lifestyle", "Community-driven"],
    smoking: "socially",
    drinking: "socially",
    workout: "daily",
    pets: "all pets welcome",
    familyPlans: "wants children",
    children: "no",
    loveStyle: "open relationship",
    communicationStyle: "direct + warm",
    sexualOrientation: "bisexual",
    religion: "hindu"
  },
  u2: {
    interests: ["#Sports", "#Gaming", "#Tech"],
    values: ["Career-focused", "Goal-driven", "Stability-focused"],
    smoking: "never",
    drinking: "socially",
    workout: "few times / week",
    pets: "dog person",
    familyPlans: "wants children",
    children: "no",
    loveStyle: "long-term partnership",
    communicationStyle: "direct + warm",
    sexualOrientation: "straight",
    religion: "not religious"
  },
  u3: {
    interests: ["#Concerts", "#Photography", "#Outdoors"],
    values: ["Balanced lifestyle", "Mindfulness-oriented", "Community-driven"],
    smoking: "never",
    drinking: "occasionally",
    workout: "few times / week",
    pets: "cat person",
    familyPlans: "open to both",
    children: "no",
    loveStyle: "slow-burn connection",
    communicationStyle: "listener first",
    sexualOrientation: "bisexual",
    religion: "spiritual"
  },
  u4: {
    interests: ["#Outdoors", "#Sports", "#Travel"],
    values: ["Adventure-driven", "Social / party lifestyle", "Balanced lifestyle"],
    smoking: "occasionally",
    drinking: "socially",
    workout: "daily",
    pets: "all pets welcome",
    familyPlans: "open to both",
    children: "no",
    loveStyle: "exploring",
    communicationStyle: "energetic",
    sexualOrientation: "straight",
    religion: "christian"
  },
  u5: {
    interests: ["#Books", "#Wellness", "#Meditation"],
    values: ["Calm / home-centered", "Mindfulness-oriented", "Progressive values"],
    smoking: "never",
    drinking: "never",
    workout: "few times / week",
    pets: "pet free",
    familyPlans: "undecided",
    children: "no",
    loveStyle: "slow-burn connection",
    communicationStyle: "listener first",
    sexualOrientation: "lesbian",
    religion: "buddhist"
  },
  u6: {
    interests: ["#Travel", "#Outdoors", "#GoingOut"],
    values: ["Adventure-driven", "Social / party lifestyle", "Spiritual but not religious"],
    smoking: "socially",
    drinking: "socially",
    workout: "weekly",
    pets: "dog person",
    familyPlans: "open to both",
    children: "yes",
    loveStyle: "open relationship",
    communicationStyle: "direct + warm",
    sexualOrientation: "bisexual",
    religion: "spiritual"
  },
  u7: {
    interests: ["#Gaming", "#Tech", "#CoffeeDates"],
    values: ["Career-focused", "Goal-driven", "Secular"],
    smoking: "never",
    drinking: "occasionally",
    workout: "weekly",
    pets: "pet free",
    familyPlans: "not planning",
    children: "no",
    loveStyle: "long-term partnership",
    communicationStyle: "low-key",
    sexualOrientation: "straight",
    religion: "not religious"
  },
  u8: {
    interests: ["#Music", "#Movies", "#Foodie"],
    values: ["Balanced lifestyle", "Community-driven", "Family-first"],
    smoking: "occasionally",
    drinking: "socially",
    workout: "weekly",
    pets: "cat person",
    familyPlans: "open to both",
    children: "yes",
    loveStyle: "slow-burn connection",
    communicationStyle: "listener first",
    sexualOrientation: "bisexual",
    religion: "christian"
  },
  u9: {
    interests: ["#Sports", "#Outdoors", "#Travel"],
    values: ["Fitness-driven", "Goal-driven", "Stability-focused"],
    smoking: "never",
    drinking: "socially",
    workout: "daily",
    pets: "dog person",
    familyPlans: "wants children",
    children: "no",
    loveStyle: "long-term partnership",
    communicationStyle: "direct + warm",
    sexualOrientation: "straight",
    religion: "not religious"
  },
  u10: {
    interests: ["#Tech", "#Gaming", "#Movies"],
    values: ["Balanced work-life", "Career-focused", "Progressive values"],
    smoking: "occasionally",
    drinking: "occasionally",
    workout: "weekly",
    pets: "pet free",
    familyPlans: "undecided",
    children: "no",
    loveStyle: "exploring",
    communicationStyle: "low-key",
    sexualOrientation: "straight",
    religion: "not religious"
  },
  u11: {
    interests: ["#Wellness", "#Yoga", "#Books"],
    values: ["Family-first", "Health & wellness focused", "Faith-oriented"],
    smoking: "never",
    drinking: "never",
    workout: "few times / week",
    pets: "all pets welcome",
    familyPlans: "wants children",
    children: "yes",
    loveStyle: "long-term partnership",
    communicationStyle: "listener first",
    sexualOrientation: "straight",
    religion: "hindu"
  },
  u12: {
    interests: ["#Foodie", "#GoingOut", "#CoffeeDates"],
    values: ["Social impact oriented", "Community-driven", "Balanced lifestyle"],
    smoking: "socially",
    drinking: "socially",
    workout: "weekly",
    pets: "all pets welcome",
    familyPlans: "open to both",
    children: "no",
    loveStyle: "open relationship",
    communicationStyle: "energetic",
    sexualOrientation: "bisexual",
    religion: "spiritual"
  }
};
var ACTIVITY_RATING_SCALE = Array.from({ length: 10 }, (_, index) => index + 1);
var CALENDAR_WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var CALENDAR_WEEKDAY_OPTIONS = [
  { value: 1, labelKey: "weekday.monday" },
  { value: 2, labelKey: "weekday.tuesday" },
  { value: 3, labelKey: "weekday.wednesday" },
  { value: 4, labelKey: "weekday.thursday" },
  { value: 5, labelKey: "weekday.friday" },
  { value: 6, labelKey: "weekday.saturday" },
  { value: 7, labelKey: "weekday.sunday" }
];
var SCHEDULE_FREQUENCY_OPTIONS = [
  { value: "daily", labelKey: "schedule.frequency.daily" },
  { value: "weekly", labelKey: "schedule.frequency.weekly" },
  { value: "bi-weekly", labelKey: "schedule.frequency.bi.weekly" },
  { value: "monthly", labelKey: "schedule.frequency.monthly" },
  { value: "yearly", labelKey: "schedule.frequency.yearly" },
  { value: "one-time", labelKey: "schedule.frequency.one.time" }
];
var EVENT_VISIBILITY_OPTIONS = [...EVENT_VISIBILITIES];
var EVENT_BLIND_MODE_OPTIONS = ["Open Event", "Blind Event"];
var SUB_EVENT_RESOURCE_FILTER_OPTIONS = [...SUB_EVENT_RESOURCE_FILTERS];
var SUB_EVENT_RESOURCE_FILTER_LABELS = {
  Members: "Members",
  [ASSET_TYPE_TRANSPORT]: ASSET_TYPE_TRANSPORT,
  [ASSET_TYPE_ACCOMMODATION]: ASSET_TYPE_ACCOMMODATION,
  [ASSET_TYPE_SUPPLIES]: ASSET_TYPE_SUPPLIES
};
var EVENT_MODE_OPTIONS = ["Casual", "Tournament"];
var TOURNAMENT_LEADERBOARD_TYPE_OPTIONS = ["Score", "Fifa"];
var ACTIVITY_GROUP_LABELS = {
  dateUnavailable: "Date unavailable",
  weekPrefix: "Week"
};
var ACTIVITY_MEMBER_MET_PLACES = [
  "City Center Meetup",
  "Board Game Night",
  "Coffee Social",
  "Hiking Group",
  "Music Event",
  "Brunch Table"
];
var ACTIVITY_MEMBER_DEFAULTS = {
  forcedMetWhere: "Event Explore"
};
var REPORT_USER_REASONS = [
  "Harassment",
  "Spam",
  "Impersonation",
  "Hate speech",
  "Scam / Fraud",
  "Other"
];
var FEEDBACK_CATEGORIES = [
  "General",
  "Bug report",
  "Feature request",
  "UX improvement",
  "Performance"
];
var EVENT_FEEDBACK_EVENT_OVERALL_OPTIONS = [
  { value: "excellent", label: "Excellent", icon: "sentiment_very_satisfied", impressionTag: "Host vibe" },
  { value: "good", label: "Good", icon: "sentiment_satisfied", impressionTag: "Host reliability" },
  { value: "mixed", label: "Mixed", icon: "sentiment_neutral", impressionTag: "Host consistency" },
  { value: "needs-work", label: "Needs work", icon: "sentiment_dissatisfied", impressionTag: "Host quality" }
];
var EVENT_FEEDBACK_HOST_IMPROVE_OPTIONS = [
  { value: "timing", label: "Improve timing", icon: "schedule", impressionTag: "Host organization" },
  { value: "communication", label: "Improve communication", icon: "campaign", impressionTag: "Host communication" },
  { value: "resources", label: "Improve resources", icon: "inventory_2", impressionTag: "Host planning" },
  { value: "none", label: "No major change", icon: "verified", impressionTag: "Host consistency" }
];
var EVENT_FEEDBACK_ATTENDEE_COLLAB_OPTIONS = [
  { value: "great", label: "Great teamwork", icon: "handshake", impressionTag: "Attendee teamwork" },
  { value: "reliable", label: "Reliable", icon: "verified_user", impressionTag: "Attendee reliability" },
  { value: "neutral", label: "Neutral", icon: "sentiment_neutral", impressionTag: "Attendee neutrality" },
  { value: "rough", label: "Needs guidance", icon: "warning_amber", impressionTag: "Attendee fit" }
];
var EVENT_FEEDBACK_ATTENDEE_REJOIN_OPTIONS = [
  { value: "yes", label: "Would team up", icon: "group", impressionTag: "Attendee trust" },
  { value: "maybe", label: "Maybe", icon: "hourglass_top", impressionTag: "Attendee compatibility" },
  { value: "no", label: "Not now", icon: "do_not_disturb_alt", impressionTag: "Attendee risk" },
  { value: "context", label: "Depends on role", icon: "tune", impressionTag: "Attendee role-fit" }
];
var EVENT_FEEDBACK_LIST_FILTER_META = {
  "own-events": { label: "Own Events", icon: "stadium" },
  pending: { label: "Pending", icon: "schedule" },
  feedbacked: { label: "Feedbacked", icon: "task_alt" },
  removed: { label: "Removed", icon: "delete_outline" }
};
var EVENT_FEEDBACK_LIST_FILTER_OPTIONS = EVENT_FEEDBACK_LIST_FILTERS.map((key) => __spreadValues({ key }, EVENT_FEEDBACK_LIST_FILTER_META[key]));
var DEFAULT_HELP_CENTER_DESCRIPTION = "MyScoutee helps you plan events end-to-end: invite people, split into stages/groups, assign resources, and coordinate in context chats.";
var DEFAULT_PRIVACY_CENTER_DESCRIPTION = "Before continuing, please review and accept how your data is used in MyScoutee.";
var HELP_CENTER_SECTIONS = [
  {
    id: "events",
    icon: "event_note",
    title: "Events and Sub Events",
    blurb: "Build the full event flow with stages or optional items.",
    contentHtml: `
      <p><strong>Build the full event flow with stages or optional items.</strong></p>
      <p>Create a main event, then split execution into sub events for stages, side activities, or optional sessions.</p>
      <p>Each sub event carries its own date range, description, and status so planning stays clean and trackable.</p>
      <ul>
        <li>Supports casual and tournament structures</li>
        <li>Keeps stage context visible in related screens</li>
        <li>Lets hosts edit details without losing hierarchy</li>
      </ul>
    `,
    details: [
      "Create a main event, then split execution into sub events for stages, side activities, or optional sessions.",
      "Each sub event carries its own date range, description, and status so planning stays clean and trackable."
    ],
    points: [
      "Supports casual and tournament structures",
      "Keeps stage context visible in related screens",
      "Lets hosts edit details without losing hierarchy"
    ]
  },
  {
    id: "resources",
    icon: "inventory_2",
    title: "Resources and Capacity",
    blurb: "Assign people, transport, accommodation, and supplies with limits.",
    contentHtml: `
      <p><strong>Assign people, transport, accommodation, and supplies with limits.</strong></p>
      <p>Use resource menus to assign assets into sub events and groups, then adjust capacity ranges directly where needed.</p>
      <p>Badges summarize pending requests and remaining capacity so action priorities are visible at a glance.</p>
      <ul>
        <li>Capacity min/max control per assignment</li>
        <li>Contextual badges for pending requests</li>
        <li>Route and location support for travel resources</li>
      </ul>
    `,
    details: [
      "Use resource menus to assign assets into sub events and groups, then adjust capacity ranges directly where needed.",
      "Badges summarize pending requests and remaining capacity so action priorities are visible at a glance."
    ],
    points: [
      "Capacity min/max control per assignment",
      "Contextual badges for pending requests",
      "Route and location support for travel resources"
    ]
  },
  {
    id: "activities",
    icon: "forum",
    title: "Activities and Chats",
    blurb: "Coordinate with context-aware channels and filters.",
    contentHtml: `
      <p><strong>Coordinate with context-aware channels and filters.</strong></p>
      <p>Chat channels follow event scope: main event, optional sub event, and group channels can all coexist.</p>
      <p>Context actions in chat headers help jump directly to related event/sub-event views and resources.</p>
      <ul>
        <li>Fast channel filtering by context</li>
        <li>Unread counters scoped to relevant channels</li>
        <li>Works for both mobile and desktop flows</li>
      </ul>
    `,
    details: [
      "Chat channels follow event scope: main event, optional sub event, and group channels can all coexist.",
      "Context actions in chat headers help jump directly to related event/sub-event views and resources."
    ],
    points: [
      "Fast channel filtering by context",
      "Unread counters scoped to relevant channels",
      "Works for both mobile and desktop flows"
    ]
  },
  {
    id: "safety",
    icon: "verified_user",
    title: "Profiles and Safety",
    blurb: "Improve trust with profile quality and moderation tools.",
    contentHtml: `
      <p><strong>Improve trust with profile quality and moderation tools.</strong></p>
      <p>Profile completion updates in real time as users fill key fields and detail sections.</p>
      <p>Safety controls include report tools, privacy visibility options, and clear moderation pathways.</p>
      <ul>
        <li>Live profile completion feedback</li>
        <li>Report user and feedback workflows</li>
        <li>Privacy and access visibility controls</li>
      </ul>
    `,
    details: [
      "Profile completion updates in real time as users fill key fields and detail sections.",
      "Safety controls include report tools, privacy visibility options, and clear moderation pathways."
    ],
    points: [
      "Live profile completion feedback",
      "Report user and feedback workflows",
      "Privacy and access visibility controls"
    ]
  }
];
var htmlList = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
var DEFAULT_TERMS_CENTER_DESCRIPTION = "Review the terms that apply when you use MyScoutee features, accounts, events, chats, and community tools.";
var TERMS_CENTER_SECTIONS = [
  {
    id: "terms",
    icon: "rule",
    title: "Terms of service",
    blurb: "The baseline rules for using MyScoutee.",
    contentHtml: "<p>These terms describe the rules for using MyScoutee accounts, profiles, events, chats, moderation tools, and related services.</p><p><strong>Last updated:</strong> February 1, 2026</p>"
  },
  {
    id: "account-access",
    icon: "manage_accounts",
    title: "Account access",
    blurb: "You are responsible for the account and sign-in method you use.",
    contentHtml: "<ul><li>Use accurate account information and keep your sign-in method secure.</li><li>Do not impersonate another person or create accounts intended to mislead other members.</li><li>OAuth sign-in is also subject to the relevant provider terms.</li></ul>"
  },
  {
    id: "community-conduct",
    icon: "groups",
    title: "Community conduct",
    blurb: "Respectful behavior keeps events and chats usable for everyone.",
    contentHtml: "<ul><li>Do not harass, threaten, spam, scam, or intentionally mislead other members.</li><li>Do not post illegal, hateful, exploitative, or unsafe content.</li><li>Hosts and admins may moderate, limit, or remove content and accounts that violate these terms.</li></ul>"
  },
  {
    id: "events-and-content",
    icon: "event_note",
    title: "Events and content",
    blurb: "Hosts and members are responsible for the events and content they create.",
    contentHtml: "<ul><li>Only create events, invitations, chats, resources, and posts that you are allowed to share.</li><li>Respect other people&apos;s privacy, images, and intellectual property.</li><li>Event details, availability, and attendee behavior are managed by the relevant hosts and participants.</li></ul>"
  },
  {
    id: "safety-and-moderation",
    icon: "verified_user",
    title: "Safety and moderation",
    blurb: "MyScoutee may act when platform safety or policy compliance requires it.",
    contentHtml: "<ul><li>Reports, support cases, and automated signals may be reviewed for safety and abuse prevention.</li><li>Accounts may be warned, restricted, blocked, reactivated, or deleted according to platform policy and applicable law.</li><li>Critical operational and security actions may be logged for audit purposes.</li></ul>"
  },
  {
    id: "changes",
    icon: "history",
    title: "Changes to terms",
    blurb: "Published revisions define the active terms.",
    contentHtml: "<ul><li>MyScoutee may update these terms as features, legal requirements, or safety needs change.</li><li>The active published version is shown with the terms page and can be reviewed before continuing where required.</li></ul>"
  }
];
var PRIVACY_CENTER_SECTIONS = [
  {
    id: "privacy",
    icon: "policy",
    title: GDPR_CONTENT.title,
    blurb: GDPR_CONTENT.subtitle,
    contentHtml: `
      <p>${GDPR_CONTENT.subtitle}</p>
      <p><strong>Last updated:</strong> February 1, 2026</p>
    `
  },
  {
    id: "contact-details",
    icon: "contact_mail",
    title: "Contact details",
    blurb: "Who to contact about privacy and data protection.",
    contentHtml: GDPR_CONTENT.contactDetailsHtml
  },
  {
    id: "legal-basis",
    icon: "gavel",
    title: "Legal basis",
    blurb: "Why MyScoutee processes data for product and safety workflows.",
    contentHtml: htmlList(GDPR_CONTENT.legalBases)
  },
  {
    id: "your-rights",
    icon: "fact_check",
    title: "Your rights",
    blurb: "Rights available for your account and personal data.",
    contentHtml: GDPR_CONTENT.rights.map((section) => `<h4>${section.title}</h4>${htmlList(section.items)}`).join("\n")
  },
  {
    id: "data-categories",
    icon: "category",
    title: "Data categories",
    blurb: "Types of data MyScoutee may process.",
    contentHtml: GDPR_CONTENT.dataCategories.map((section) => `<h4>${section.category}</h4>${htmlList(section.items)}`).join("\n")
  },
  {
    id: "purposes",
    icon: "tips_and_updates",
    title: "Purposes",
    blurb: "How data supports profile, event, chat, and trust features.",
    contentHtml: htmlList(GDPR_CONTENT.purposes)
  },
  {
    id: "retention",
    icon: "schedule",
    title: "Retention",
    blurb: "How long data is kept.",
    contentHtml: htmlList(GDPR_CONTENT.retention)
  },
  {
    id: "account-data-deletion",
    icon: "manage_accounts",
    title: "Account and data deletion",
    blurb: "How account deletion, reactivation, and Meta/Facebook deletion requests are handled.",
    contentHtml: htmlList(GDPR_CONTENT.accountControls) + "{{deployment.privacy.deletionEmailRoute}}"
  },
  {
    id: "sharing",
    icon: "share",
    title: "Third-party sharing",
    blurb: "When data may be shared outside MyScoutee.",
    contentHtml: htmlList(GDPR_CONTENT.sharing)
  },
  {
    id: "security",
    icon: "security",
    title: "Security",
    blurb: "Controls used to protect data.",
    contentHtml: htmlList(GDPR_CONTENT.security)
  }
];
var HELP_CENTER_SECTIONS_HU = [
  {
    id: "events",
    icon: "event_note",
    title: "Esem\xE9nyek \xE9s alesem\xE9nyek",
    blurb: "\xC9p\xEDtsd fel a teljes esem\xE9nyfolyamatot szakaszokkal vagy opcion\xE1lis elemekkel.",
    contentHtml: "<p><strong>\xC9p\xEDtsd fel a teljes esem\xE9nyfolyamatot szakaszokkal vagy opcion\xE1lis elemekkel.</strong></p><p>Hozz l\xE9tre f\u0151 esem\xE9nyt, majd bontsd alesem\xE9nyekre szakaszokhoz, mell\xE9kprogramokhoz vagy opcion\xE1lis alkalmakhoz.</p><ul><li>Alkalmi \xE9s verseny jelleg\u0171 strukt\xFAr\xE1k t\xE1mogat\xE1sa</li><li>A szakaszkontextus l\xE1that\xF3 marad a kapcsol\xF3d\xF3 k\xE9perny\u0151k\xF6n</li><li>A szervez\u0151k a hierarchia elveszt\xE9se n\xE9lk\xFCl szerkeszthetnek</li></ul>"
  },
  {
    id: "resources",
    icon: "inventory_2",
    title: "Er\u0151forr\xE1sok \xE9s kapacit\xE1s",
    blurb: "Rendelj embereket, transportkat, sz\xE1ll\xE1st \xE9s kell\xE9keket limitekkel.",
    contentHtml: "<p><strong>Rendelj embereket, transportkat, sz\xE1ll\xE1st \xE9s kell\xE9keket limitekkel.</strong></p><p>Az er\u0151forr\xE1smen\xFCkben eszk\xF6z\xF6ket rendelhetsz alesem\xE9nyekhez \xE9s csoportokhoz, majd k\xF6zvetlen\xFCl \xE1ll\xEDthatod a kapacit\xE1sokat.</p><ul><li>Minimum/maximum kapacit\xE1s feladatonk\xE9nt</li><li>Kontextusos jelv\xE9nyek f\xFCgg\u0151 k\xE9r\xE9sekhez</li><li>\xDAtvonal- \xE9s helyt\xE1mogat\xE1s utaz\xE1si er\u0151forr\xE1sokhoz</li></ul>"
  },
  {
    id: "activities",
    icon: "forum",
    title: "Tev\xE9kenys\xE9gek \xE9s cseveg\xE9sek",
    blurb: "Koordin\xE1lj kontextustudatos csatorn\xE1kkal \xE9s sz\u0171r\u0151kkel.",
    contentHtml: "<p><strong>Koordin\xE1lj kontextustudatos csatorn\xE1kkal \xE9s sz\u0171r\u0151kkel.</strong></p><p>A cseveg\u0151csatorn\xE1k k\xF6vetik az esem\xE9ny hat\xF3k\xF6r\xE9t: f\u0151 esem\xE9ny, opcion\xE1lis alesem\xE9ny \xE9s csoportcsatorna is egy\xFCtt l\xE9tezhet.</p><ul><li>Gyors csatornasz\u0171r\xE9s kontextus szerint</li><li>Olvasatlan sz\xE1ml\xE1l\xF3k relev\xE1ns csatorn\xE1kra sz\u0171k\xEDtve</li><li>Mobilon \xE9s asztali n\xE9zetben is m\u0171k\xF6dik</li></ul>"
  },
  {
    id: "safety",
    icon: "verified_user",
    title: "Profilok \xE9s biztons\xE1g",
    blurb: "Er\u0151s\xEDtsd a bizalmat profilmin\u0151s\xE9ggel \xE9s moder\xE1ci\xF3s eszk\xF6z\xF6kkel.",
    contentHtml: "<p><strong>Er\u0151s\xEDtsd a bizalmat profilmin\u0151s\xE9ggel \xE9s moder\xE1ci\xF3s eszk\xF6z\xF6kkel.</strong></p><p>A profilk\xE9sz\xFClts\xE9g val\xF3s id\u0151ben friss\xFCl, ahogy a felhaszn\xE1l\xF3k kit\xF6ltik a fontos mez\u0151ket.</p><ul><li>\xC9l\u0151 profilk\xE9sz\xFClts\xE9gi visszajelz\xE9s</li><li>Felhaszn\xE1l\xF3jelent\xE9si \xE9s visszajelz\xE9si folyamatok</li><li>Adatv\xE9delmi \xE9s hozz\xE1f\xE9r\xE9si l\xE1that\xF3s\xE1gi kontrollok</li></ul>"
  }
];
var PRIVACY_CENTER_SECTIONS_HU = [
  {
    id: "privacy",
    icon: "policy",
    title: "Adatv\xE9delem",
    blurb: "Hogyan kezeli a MyScoutee a profilhoz, esem\xE9nyekhez \xE9s k\xF6z\xF6ss\xE9gi aktivit\xE1shoz kapcsol\xF3d\xF3 szem\xE9lyes adatokat.",
    contentHtml: "<p><strong>Utols\xF3 friss\xEDt\xE9s:</strong> 2026. febru\xE1r 1.</p>"
  },
  {
    id: "contact-details",
    icon: "contact_mail",
    title: "Kapcsolati adatok",
    blurb: "Kihez fordulhatsz adatv\xE9delemmel \xE9s adatkezel\xE9ssel kapcsolatban.",
    contentHtml: "{{deployment.privacy.contactDetails}}"
  },
  {
    id: "legal-basis",
    icon: "gavel",
    title: "Jogalap",
    blurb: "Mi\xE9rt kezel adatokat a MyScoutee a term\xE9k- \xE9s biztons\xE1gi folyamatokhoz.",
    contentHtml: "<ul><li>Szerz\u0151d\xE9s teljes\xEDt\xE9se a fi\xF3k- \xE9s esem\xE9nyfunkci\xF3khoz.</li><li>Jogos \xE9rdek a platform biztons\xE1ga \xE9s a vissza\xE9l\xE9sek megel\u0151z\xE9se \xE9rdek\xE9ben.</li><li>Hozz\xE1j\xE1rul\xE1s opcion\xE1lis profiladatokhoz, pontos helykoordin\xE1t\xE1khoz \xE9s marketingkommunik\xE1ci\xF3hoz.</li><li>Jogi k\xF6telezetts\xE9g biztons\xE1gi napl\xF3khoz \xE9s megfelel\u0151s\xE9gi nyilv\xE1ntart\xE1sokhoz.</li></ul>"
  },
  {
    id: "your-rights",
    icon: "fact_check",
    title: "Jogaid",
    blurb: "A fi\xF3koddal \xE9s szem\xE9lyes adataiddal kapcsolatos jogaid.",
    contentHtml: "<h4>Hozz\xE1f\xE9r\xE9s</h4><ul><li>K\xE9rhetsz m\xE1solatot a t\xE1rolt szem\xE9lyes adataidr\xF3l.</li></ul><h4>Helyesb\xEDt\xE9s</h4><ul><li>Jav\xEDthatod a pontatlan profil- vagy fi\xF3kadatokat.</li></ul><h4>T\xF6rl\xE9s</h4><ul><li>K\xE9rheted a fi\xF3k \xE9s a szem\xE9lyes adatok t\xF6rl\xE9s\xE9t, ahol ezt jogszab\xE1ly lehet\u0151v\xE9 teszi.</li></ul><h4>Adathordozhat\xF3s\xE1g</h4><ul><li>Export\xE1lhatod az adataidat \xE1ltal\xE1nosan haszn\xE1lt, g\xE9ppel olvashat\xF3 form\xE1tumban.</li></ul><h4>Korl\xE1toz\xE1s / tiltakoz\xE1s</h4><ul><li>Korl\xE1tozhatod vagy kifog\xE1solhatod egyes adatkezel\xE9si tev\xE9kenys\xE9geket.</li></ul>"
  },
  {
    id: "data-categories",
    icon: "category",
    title: "Adatkateg\xF3ri\xE1k",
    blurb: "Milyen t\xEDpus\xFA adatokat kezelhet a MyScoutee.",
    contentHtml: "<h4>Fi\xF3k \xE9s azonos\xEDt\xE1s</h4><ul><li>N\xE9v</li><li>Sz\xFClet\xE9snap</li><li>Lak\xF3hely v\xE1rosa</li><li>Nem</li><li>Profilk\xE9pek</li></ul><h4>Hely \xE9s koordin\xE1t\xE1k</h4><ul><li>Hozz\xE1vet\u0151leges hely (v\xE1ros/r\xE9gi\xF3)</li><li>Pontos GPS-koordin\xE1t\xE1k (sz\xE9less\xE9g/hossz\xFAs\xE1g), ha k\xE9red</li><li>Helyfriss\xEDt\xE9si id\u0151b\xE9lyegek esem\xE9nylogisztik\xE1hoz</li></ul><h4>Aktivit\xE1si adatok</h4><ul><li>Cseveg\xE9sek</li><li>Megh\xEDv\xE1sok</li><li>Esem\xE9nyek</li><li>Szervez\xE9si interakci\xF3k</li><li>\xC9rt\xE9kel\xE9sek</li></ul><h4>Preferenciaadatok</h4><ul><li>\xC9rdekl\u0151d\xE9si k\xF6r\xF6k</li><li>\xC9rt\xE9kek</li><li>L\xE1that\xF3s\xE1gi be\xE1ll\xEDt\xE1sok</li><li>Nyelvi preferenci\xE1k</li></ul><h4>Technikai adatok</h4><ul><li>Eszk\xF6z- \xE9s b\xF6ng\xE9sz\u0151metaadatok</li><li>IP- \xE9s napl\xF3rekordok</li><li>Munkamenetesem\xE9nyek</li></ul>"
  },
  {
    id: "purposes",
    icon: "tips_and_updates",
    title: "C\xE9lok",
    blurb: "Hogyan t\xE1mogatj\xE1k az adatok a profil-, esem\xE9ny-, chat- \xE9s bizalmi funkci\xF3kat.",
    contentHtml: "<ul><li>Profil-, chat-, esem\xE9ny- \xE9s szervez\xE9si funkci\xF3k m\u0171k\xF6dtet\xE9se.</li><li>Relev\xE1ns tagok aj\xE1nl\xE1sa \xE9s a felfedez\xE9s min\u0151s\xE9g\xE9nek jav\xEDt\xE1sa.</li><li>Helyalap\xFA p\xE1ros\xEDt\xE1s \xE9s t\xE1vols\xE1gtudatos esem\xE9nykoordin\xE1ci\xF3 t\xE1mogat\xE1sa.</li><li>Vissza\xE9l\xE9sek, spam \xE9s gyan\xFAs platformaktivit\xE1s \xE9szlel\xE9se.</li><li>Fi\xF3kk\xE9r\xE9sek \xE9s megfelel\u0151s\xE9gi folyamatok t\xE1mogat\xE1sa.</li></ul>"
  },
  {
    id: "retention",
    icon: "schedule",
    title: "Meg\u0151rz\xE9s",
    blurb: "Mennyi ideig \u0151rizz\xFCk meg az adatokat.",
    contentHtml: "<ul><li>Fi\xF3kprofil-adatok: am\xEDg a fi\xF3k akt\xEDv.</li><li>Pontos helykoordin\xE1t\xE1k: csak az akt\xEDv helyalap\xFA funkci\xF3khoz sz\xFCks\xE9ges ideig.</li><li>Biztons\xE1gi \xE9s auditnapl\xF3k: jogi vagy megfelel\u0151s\xE9gi ig\xE9ny szerint.</li><li>T\xF6r\xF6lt fi\xF3kok: az adatok a meg\u0151rz\xE9si id\u0151 ut\xE1n t\xF6rl\u0151dnek vagy anonimiz\xE1l\xF3dnak.</li></ul>"
  },
  {
    id: "account-data-deletion",
    icon: "manage_accounts",
    title: "Fi\xF3k \xE9s adatok t\xF6rl\xE9se",
    blurb: "Hogyan m\u0171k\xF6dik a fi\xF3kt\xF6rl\xE9s, az \xFAjraaktiv\xE1l\xE1s \xE9s a Meta/Facebook t\xF6rl\xE9si k\xE9r\xE9s.",
    contentHtml: "<ul><li>A fi\xF3k t\xF6rl\xE9se a felhaszn\xE1l\xF3i be\xE1ll\xEDt\xE1sok men\xFCben \xE9rhet\u0151 el. A meger\u0151s\xEDt\xE9s ut\xE1n a fi\xF3k t\xF6rl\xE9sre ker\xFCl \xFCtemez\xE9sre, \xE9s a felhaszn\xE1l\xF3 kijelentkezik.</li><li>Ha a fi\xF3k t\xF6r\xF6lt \xE1llapotban van, de m\xE9g nem lett v\xE9glegesen t\xF6r\xF6lve, az ism\xE9telt bejelentkez\xE9s \xFAjraaktiv\xE1l\xE1si meger\u0151s\xEDt\xE9st jelen\xEDthet meg a 30 napos t\xF6rl\xE9si id\u0151szak lej\xE1rta el\u0151tt.</li><li>Ha a t\xF6rl\xE9st Facebook-bel\xE9p\xE9s ut\xE1n a Meta/Facebook fi\xF3kbe\xE1ll\xEDt\xE1sokb\xF3l k\xE9rik, a Meta a MyScoutee backend callbacket h\xEDvja meg, \xE9s az egyez\u0151 fi\xF3kok ugyanazt a t\xF6rl\xE9si \xFCtemez\xE9st k\xF6vetik.</li></ul>{{deployment.privacy.deletionEmailRoute}}"
  },
  {
    id: "sharing",
    icon: "share",
    title: "Harmadik felekkel megoszt\xE1s",
    blurb: "Mikor ker\xFClhetnek adatok a MyScoutee-n k\xEDv\xFClre.",
    contentHtml: "<ul><li>Szolg\xE1ltat\xF3kkal t\xE1rhely, analitika \xE9s t\xE1mogat\xE1si m\u0171k\xF6d\xE9s c\xE9lj\xE1b\xF3l.</li><li>Hat\xF3s\xE1gokkal csak akkor, ha alkalmazand\xF3 jog el\u0151\xEDrja.</li><li>Szem\xE9lyes adatot nem \xE9rt\xE9kes\xEDt\xFCnk.</li></ul>"
  },
  {
    id: "security",
    icon: "security",
    title: "Biztons\xE1g",
    blurb: "Az adatok v\xE9delm\xE9t szolg\xE1l\xF3 kontrollok.",
    contentHtml: "<ul><li>Szerepk\xF6ralap\xFA hozz\xE1f\xE9r\xE9s bels\u0151 eszk\xF6z\xF6kh\xF6z.</li><li>Titkos\xEDtott adat\xE1tvitel.</li><li>\xDCzemeltet\xE9si monitoroz\xE1s \xE9s incidenskezel\xE9si folyamatok.</li></ul>"
  }
];
var TERMS_CENTER_SECTIONS_HU = [
  {
    id: "terms",
    icon: "rule",
    title: "Felhaszn\xE1l\xE1si felt\xE9telek",
    blurb: "A MyScoutee haszn\xE1lat\xE1nak alapvet\u0151 szab\xE1lyai.",
    contentHtml: "<p>Ezek a felt\xE9telek \xEDrj\xE1k le a MyScoutee fi\xF3kok, profilok, esem\xE9nyek, cseveg\xE9sek, moder\xE1ci\xF3s eszk\xF6z\xF6k \xE9s kapcsol\xF3d\xF3 szolg\xE1ltat\xE1sok haszn\xE1lat\xE1nak szab\xE1lyait.</p><p><strong>Utols\xF3 friss\xEDt\xE9s:</strong> 2026. febru\xE1r 1.</p>"
  },
  {
    id: "account-access",
    icon: "manage_accounts",
    title: "Fi\xF3khozz\xE1f\xE9r\xE9s",
    blurb: "Te felelsz a haszn\xE1lt fi\xF3k\xE9rt \xE9s bel\xE9p\xE9si m\xF3d\xE9rt.",
    contentHtml: "<ul><li>Haszn\xE1lj pontos fi\xF3kadatokat, \xE9s tartsd biztons\xE1gban a bel\xE9p\xE9si m\xF3dodat.</li><li>Ne add ki magad m\xE1s szem\xE9lynek, \xE9s ne hozz l\xE9tre megt\xE9veszt\u0151 fi\xF3kot.</li><li>Az OAuth-bel\xE9p\xE9sre az adott szolg\xE1ltat\xF3 felt\xE9telei is vonatkoznak.</li></ul>"
  },
  {
    id: "community-conduct",
    icon: "groups",
    title: "K\xF6z\xF6ss\xE9gi viselked\xE9s",
    blurb: "A tiszteletteljes m\u0171k\xF6d\xE9s tartja haszn\xE1lhat\xF3an az esem\xE9nyeket \xE9s cseveg\xE9seket.",
    contentHtml: "<ul><li>Ne zaklass, fenyeget\u0151zz, spammelj, csalj, \xE9s ne vezesd f\xE9lre sz\xE1nd\xE9kosan a tagokat.</li><li>Ne tegy\xE9l k\xF6zz\xE9 jogellenes, gy\u0171l\xF6letkelt\u0151, kizs\xE1km\xE1nyol\xF3 vagy vesz\xE9lyes tartalmat.</li><li>A szervez\u0151k \xE9s adminok moder\xE1lhatj\xE1k, korl\xE1tozhatj\xE1k vagy elt\xE1vol\xEDthatj\xE1k a felt\xE9teleket s\xE9rt\u0151 tartalmakat \xE9s fi\xF3kokat.</li></ul>"
  },
  {
    id: "events-and-content",
    icon: "event_note",
    title: "Esem\xE9nyek \xE9s tartalom",
    blurb: "A szervez\u0151k \xE9s tagok felelnek az \xE1ltaluk l\xE9trehozott esem\xE9nyek\xE9rt \xE9s tartalmak\xE9rt.",
    contentHtml: "<ul><li>Csak olyan esem\xE9nyt, megh\xEDv\xE1st, cseveg\xE9st, er\u0151forr\xE1st \xE9s bejegyz\xE9st hozz l\xE9tre, amelyet jogosult vagy megosztani.</li><li>Tartsd tiszteletben m\xE1sok mag\xE1nszf\xE9r\xE1j\xE1t, k\xE9peit \xE9s szellemi tulajdon\xE1t.</li><li>Az esem\xE9nyr\xE9szleteket, el\xE9rhet\u0151s\xE9get \xE9s r\xE9sztvev\u0151i viselked\xE9st az \xE9rintett szervez\u0151k \xE9s r\xE9sztvev\u0151k kezelik.</li></ul>"
  },
  {
    id: "safety-and-moderation",
    icon: "verified_user",
    title: "Biztons\xE1g \xE9s moder\xE1ci\xF3",
    blurb: "A MyScoutee l\xE9phet, ha a platform biztons\xE1ga vagy a szab\xE1lyok betart\xE1sa ezt ig\xE9nyli.",
    contentHtml: "<ul><li>A jelent\xE9seket, support \xFCgyeket \xE9s automatikus jelz\xE9seket biztons\xE1gi \xE9s vissza\xE9l\xE9s-megel\u0151z\xE9si c\xE9lb\xF3l \xE1t lehet tekinteni.</li><li>A fi\xF3kok figyelmeztethet\u0151k, korl\xE1tozhat\xF3k, blokkolhat\xF3k, \xFAjraaktiv\xE1lhat\xF3k vagy t\xF6r\xF6lhet\u0151k a platformszab\xE1lyok \xE9s az alkalmazand\xF3 jog szerint.</li><li>A kritikus m\u0171k\xF6d\xE9si \xE9s biztons\xE1gi m\u0171veletek audit c\xE9lb\xF3l napl\xF3zhat\xF3k.</li></ul>"
  },
  {
    id: "changes",
    icon: "history",
    title: "A felt\xE9telek v\xE1ltoz\xE1sa",
    blurb: "A k\xF6zz\xE9tett verzi\xF3k hat\xE1rozz\xE1k meg az akt\xEDv felt\xE9teleket.",
    contentHtml: "<ul><li>A MyScoutee friss\xEDtheti ezeket a felt\xE9teleket, ha a funkci\xF3k, jogi k\xF6vetelm\xE9nyek vagy biztons\xE1gi ig\xE9nyek v\xE1ltoznak.</li><li>Az akt\xEDv k\xF6zz\xE9tett verzi\xF3 megjelenik a felt\xE9telek oldalon, \xE9s sz\xFCks\xE9g eset\xE9n folytat\xE1s el\u0151tt \xE1ttekinthet\u0151.</li></ul>"
  }
];
var DEFAULT_HELP_CENTER_REVISION = {
  id: "help-default-v1",
  documentKind: "help",
  lang: "en",
  languageLabel: "English",
  version: 1,
  title: "MyScoutee help",
  summary: "What you can do in MyScoutee",
  description: DEFAULT_HELP_CENTER_DESCRIPTION,
  headerColor: "amber",
  sections: HELP_CENTER_SECTIONS,
  active: true,
  createdAtIso: "2026-05-01T00:00:00.000Z",
  createdByUserId: "system",
  updatedAtIso: "2026-05-01T00:00:00.000Z",
  updatedByUserId: "system"
};
var DEFAULT_HELP_CENTER_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_HELP_CENTER_REVISION), {
  id: "help-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "MyScoutee s\xFAg\xF3",
  summary: "Mit tehetsz a MyScoutee-ban",
  description: "A MyScoutee seg\xEDt az esem\xE9nyeket elej\xE9t\u0151l v\xE9g\xE9ig megtervezni: megh\xEDv\xE1sok, szakaszok \xE9s csoportok, er\u0151forr\xE1sok, valamint kontextushoz k\xF6t\xF6tt cseveg\xE9sek.",
  sections: HELP_CENTER_SECTIONS_HU
});
var DEFAULT_PRIVACY_CENTER_REVISION = {
  id: "privacy-default-v1",
  documentKind: "privacy",
  lang: "en",
  languageLabel: "English",
  version: 1,
  title: "Data privacy",
  summary: "Privacy first",
  description: DEFAULT_PRIVACY_CENTER_DESCRIPTION,
  headerColor: "amber",
  sections: PRIVACY_CENTER_SECTIONS,
  active: true,
  createdAtIso: "2026-02-01T00:00:00.000Z",
  createdByUserId: "system",
  updatedAtIso: "2026-02-01T00:00:00.000Z",
  updatedByUserId: "system"
};
var DEFAULT_PRIVACY_CENTER_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_PRIVACY_CENTER_REVISION), {
  id: "privacy-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Adatv\xE9delem",
  summary: "Adatv\xE9delem els\u0151k\xE9nt",
  description: "Folytat\xE1s el\u0151tt n\xE9zd \xE1t \xE9s fogadd el, hogyan haszn\xE1lja a MyScoutee az adataidat.",
  sections: PRIVACY_CENTER_SECTIONS_HU
});
var DEFAULT_TERMS_CENTER_REVISION = {
  id: "terms-default-v1",
  documentKind: "terms",
  lang: "en",
  languageLabel: "English",
  version: 1,
  title: "Terms of service",
  summary: "Usage terms",
  description: DEFAULT_TERMS_CENTER_DESCRIPTION,
  headerColor: "slate",
  sections: TERMS_CENTER_SECTIONS,
  active: true,
  createdAtIso: "2026-02-01T00:00:00.000Z",
  createdByUserId: "system",
  updatedAtIso: "2026-02-01T00:00:00.000Z",
  updatedByUserId: "system"
};
var DEFAULT_TERMS_CENTER_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_TERMS_CENTER_REVISION), {
  id: "terms-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Felhaszn\xE1l\xE1si felt\xE9telek",
  summary: "Haszn\xE1lati felt\xE9telek",
  description: "Tekintsd \xE1t a MyScoutee funkci\xF3ira, fi\xF3kjaira, esem\xE9nyeire, cseveg\xE9seire \xE9s k\xF6z\xF6ss\xE9gi eszk\xF6zeire vonatkoz\xF3 felt\xE9teleket.",
  sections: TERMS_CENTER_SECTIONS_HU
});
var EXPLANATION_HOME_SECTIONS = [
  {
    id: "affinity",
    icon: "tune",
    title: "Rate a card",
    blurb: "Choose a score from 1 to 10.",
    contentHtml: "<p>Tap or drag the <strong>Affinity</strong> bar. Your choice is saved immediately, then the next card appears.</p>"
  },
  {
    id: "affinity-network",
    icon: "hub",
    title: "Why ratings matter",
    blurb: "Ratings help improve later suggestions.",
    contentHtml: "<p>Your score shows how interested you are in the person or pair on the card. MyScoutee can use it with other signals to make future suggestions more relevant.</p>"
  },
  {
    id: "profile",
    icon: "visibility",
    title: "Photos and profile",
    blurb: "See more before you rate.",
    contentHtml: "<p>Tap the left or right side of the image to browse photos. Use the eye icon to open the full profile.</p>"
  },
  {
    id: "filters",
    icon: "filter_alt",
    title: "Filters and modes",
    blurb: "Choose which cards you want to see.",
    contentHtml: "<p>The filter button narrows the results, and its number shows how many matches remain. Use <strong>Preferences</strong>, <strong>Friends in Common</strong>, <strong>Inside Network</strong>, or <strong>Outside Network</strong> to switch card groups.</p>"
  },
  {
    id: "history",
    icon: "history",
    title: "Rating history",
    blurb: "Review or change an earlier rating.",
    contentHtml: "<p>Open history from the header. To change a rating later, open <strong>Activity ratings</strong> and select its star action.</p>"
  }
];
var EXPLANATION_HOME_SECTIONS_HU = [
  {
    id: "affinity",
    icon: "tune",
    title: "K\xE1rtya \xE9rt\xE9kel\xE9se",
    blurb: "V\xE1lassz egy \xE9rt\xE9ket 1 \xE9s 10 k\xF6z\xF6tt.",
    contentHtml: "<p>Koppints vagy h\xFAzd a <strong>Szimp\xE1tia</strong> s\xE1vot. A rendszer azonnal elmenti a v\xE1laszt\xE1st, majd megjelenik a k\xF6vetkez\u0151 k\xE1rtya.</p>"
  },
  {
    id: "affinity-network",
    icon: "hub",
    title: "Mi\xE9rt sz\xE1m\xEDt?",
    blurb: "Az \xE9rt\xE9kel\xE9s jav\xEDtja a k\xE9s\u0151bbi aj\xE1nl\xE1sokat.",
    contentHtml: "<p>A pontsz\xE1m megmutatja, mennyire \xE9rdekel a k\xE1rty\xE1n l\xE1that\xF3 ember vagy p\xE1ros. A MyScoutee ezt m\xE1s adatokkal egy\xFCtt haszn\xE1lhatja, hogy k\xE9s\u0151bb jobb aj\xE1nl\xE1sokat adjon.</p>"
  },
  {
    id: "profile",
    icon: "visibility",
    title: "K\xE9pek \xE9s profil",
    blurb: "\xC9rt\xE9kel\xE9s el\u0151tt t\xF6bbet is megn\xE9zhetsz.",
    contentHtml: "<p>A k\xE9p bal vagy jobb oldal\xE1ra koppintva lapozhatsz a fot\xF3k k\xF6z\xF6tt. A szem ikon megnyitja a teljes profilt.</p>"
  },
  {
    id: "filters",
    icon: "filter_alt",
    title: "Sz\u0171r\u0151k \xE9s m\xF3dok",
    blurb: "V\xE1laszd ki, milyen k\xE1rty\xE1kat szeretn\xE9l l\xE1tni.",
    contentHtml: "<p>A sz\u0171r\u0151gomb sz\u0171k\xEDti a tal\xE1latokat, a rajta l\xE9v\u0151 sz\xE1m pedig a megmaradt tal\xE1latokat mutatja. A <strong>Preferenci\xE1k</strong>, <strong>K\xF6z\xF6s ismer\u0151s\xF6k</strong>, <strong>H\xE1l\xF3zaton bel\xFCl</strong> \xE9s <strong>H\xE1l\xF3zaton k\xEDv\xFCl</strong> m\xF3dok m\xE1s-m\xE1s k\xE1rtyacsoportot nyitnak meg.</p>"
  },
  {
    id: "history",
    icon: "history",
    title: "\xC9rt\xE9kel\xE9si el\u0151zm\xE9nyek",
    blurb: "N\xE9zd meg vagy m\xF3dos\xEDtsd egy kor\xE1bbi \xE9rt\xE9kel\xE9sedet.",
    contentHtml: "<p>Az el\u0151zm\xE9nyeket a fejl\xE9cb\u0151l nyithatod meg. K\xE9s\u0151bbi m\xF3dos\xEDt\xE1shoz keresd meg a k\xE1rty\xE1t az <strong>\xC9rt\xE9kel\xE9sek</strong> k\xF6z\xF6tt, majd v\xE1laszd a csillagos m\u0171veletet.</p>"
  }
];
var EXPLANATION_ACTIVITY_RATES_SECTIONS = [
  {
    id: "activity-rate-filter",
    icon: "north_east",
    title: "Choose ratings",
    blurb: "Select which rating cards are shown.",
    contentHtml: "<p>The first menu switches between ratings you gave or received, mutual ratings, people you met, and suggestions. <strong>Social</strong> shows the social subset for the selected group; turning it off returns to the regular subset.</p>"
  },
  {
    id: "activity-header-controls",
    icon: "route",
    title: "Order and view",
    blurb: "Change how the same cards are arranged.",
    contentHtml: "<p><strong>Recent</strong>, <strong>Relevant</strong>, and <strong>Past</strong> change the order. <strong>Month</strong>, <strong>Week</strong>, <strong>Day</strong>, and <strong>Distance</strong> change the grouping without changing any score.</p>"
  },
  {
    id: "activity-score-badge",
    icon: "star",
    title: "Change a rating",
    blurb: "Select a card, then choose 1 to 10.",
    contentHtml: "<p>The star shows the current score. The bottom bar changes only the selected card; a received, read-only rating can be viewed but not edited.</p>"
  },
  {
    id: "activity-fullscreen",
    icon: "fullscreen",
    title: "Fullscreen rating",
    blurb: "Focus on one card at a time.",
    contentHtml: "<p>Fullscreen enlarges the selected card and keeps its rating bar below the image. Close it to return to the same filtered list.</p>"
  }
];
var EXPLANATION_ACTIVITY_RATES_SECTIONS_HU = [
  {
    id: "activity-rate-filter",
    icon: "north_east",
    title: "\xC9rt\xE9kel\xE9sek kiv\xE1laszt\xE1sa",
    blurb: "V\xE1laszd ki, melyik \xE9rt\xE9kel\xE9sk\xE1rty\xE1k l\xE1tszanak.",
    contentHtml: "<p>Az els\u0151 men\xFCben v\xE1lthatsz az adott, kapott \xE9s k\xF6lcs\xF6n\xF6s \xE9rt\xE9kel\xE9sek, a tal\xE1lkoz\xE1sok \xE9s az aj\xE1nl\xE1sok k\xF6z\xF6tt. A <strong>K\xF6z\xF6ss\xE9gi</strong> kapcsol\xF3 az adott csoport k\xF6z\xF6ss\xE9gi aj\xE1nl\xE1sait mutatja; kikapcsolva a norm\xE1l k\xE1rty\xE1k t\xE9rnek vissza.</p>"
  },
  {
    id: "activity-header-controls",
    icon: "route",
    title: "Sorrend \xE9s n\xE9zet",
    blurb: "Rendezd \xE1t ugyanazokat a k\xE1rty\xE1kat.",
    contentHtml: "<p>A <strong>Legut\xF3bbi</strong>, <strong>Relev\xE1ns</strong> \xE9s <strong>Kor\xE1bbi</strong> a sorrendet, a <strong>H\xF3nap</strong>, <strong>H\xE9t</strong>, <strong>Nap</strong> \xE9s <strong>T\xE1vols\xE1g</strong> pedig a csoportos\xEDt\xE1st v\xE1ltoztatja. Ett\u0151l egyetlen pontsz\xE1m sem m\xF3dosul.</p>"
  },
  {
    id: "activity-score-badge",
    icon: "star",
    title: "\xC9rt\xE9kel\xE9s m\xF3dos\xEDt\xE1sa",
    blurb: "Jel\xF6lj ki egy k\xE1rty\xE1t, majd v\xE1lassz 1 \xE9s 10 k\xF6z\xF6tt.",
    contentHtml: "<p>A csillag az aktu\xE1lis pontsz\xE1mot mutatja. Az als\xF3 s\xE1v csak a kijel\xF6lt k\xE1rty\xE1t m\xF3dos\xEDtja; a kapott, csak olvashat\xF3 \xE9rt\xE9kel\xE9st megn\xE9zheted, de nem \xEDrhatod \xE1t.</p>"
  },
  {
    id: "activity-fullscreen",
    icon: "fullscreen",
    title: "Teljes k\xE9perny\u0151s \xE9rt\xE9kel\xE9s",
    blurb: "Egyszerre egy k\xE1rty\xE1ra figyelj.",
    contentHtml: "<p>A teljes k\xE9perny\u0151 felnagy\xEDtja a kijel\xF6lt k\xE1rty\xE1t, az \xE9rt\xE9kel\u0151s\xE1v pedig a k\xE9p alatt marad. Bez\xE1r\xE1skor ugyanabba a sz\u0171rt list\xE1ba t\xE9rsz vissza.</p>"
  }
];
var EXPLANATION_EVENTS_SECTIONS = [
  {
    id: "activity-event-entry",
    icon: "event",
    title: "Choose an event list",
    blurb: "Open the group you need.",
    contentHtml: "<p>Switch between all or active events, pending items, invitations, your events, drafts, and trash. Use <strong>Explore</strong> for public events or the plus button to create one.</p>"
  },
  {
    id: "activity-event-card",
    icon: "event_note",
    title: "Read an event card",
    blurb: "See the key details at a glance.",
    contentHtml: "<p>The card shows the event image, title, time, place, and organizer. A badge such as <strong>1 / 5</strong> shows accepted people against capacity, while a red number marks pending items.</p>"
  },
  {
    id: "activity-event-actions",
    icon: "more_vert",
    title: "People and actions",
    blurb: "Open members or the actions available to you.",
    contentHtml: "<p>Tap the capacity badge to see participants and pending people. The three-dot menu changes with your role and the event state, so it may offer viewing, editing, publishing, invitation handling, sharing, leaving, deleting, or restoring.</p>"
  },
  {
    id: "activity-event-join",
    icon: "person_add",
    title: "Join an event",
    blurb: "The steps depend on the event settings.",
    contentHtml: "<p>You can accept or reject an invitation from its card. Some events confirm you immediately; others require approval, a ticket, accepted rules, payment, or choices before your place is final.</p>"
  },
  {
    id: "activity-event-hosting",
    icon: "emoji_events",
    title: "Create or host",
    blurb: "Start simple and add details when needed.",
    contentHtml: "<p>The plus button opens the event editor. You can create a basic meetup or add sub-events, groups, resources, tickets, pricing, and capacity rules.</p>"
  }
];
var EXPLANATION_EVENTS_SECTIONS_HU = [
  {
    id: "activity-event-entry",
    icon: "event",
    title: "Esem\xE9nylista v\xE1laszt\xE1sa",
    blurb: "Nyisd meg azt a csoportot, amelyikre sz\xFCks\xE9ged van.",
    contentHtml: "<p>V\xE1lthatsz az \xF6sszes vagy akt\xEDv esem\xE9ny, a f\xFCgg\u0151 elemek, megh\xEDv\xE1sok, saj\xE1t esem\xE9nyek, piszkozatok \xE9s a kuka k\xF6z\xF6tt. A <strong>Felfedez\xE9s</strong> nyilv\xE1nos esem\xE9nyeket keres, a plusz gomb pedig \xFAjat hoz l\xE9tre.</p>"
  },
  {
    id: "activity-event-card",
    icon: "event_note",
    title: "Esem\xE9nyk\xE1rtya",
    blurb: "A legfontosabb adatokat egy helyen l\xE1tod.",
    contentHtml: "<p>A k\xE1rty\xE1n az esem\xE9ny k\xE9pe, c\xEDme, ideje, helye \xE9s szervez\u0151je l\xE1tszik. Az <strong>1 / 5</strong> jelleg\u0171 jelv\xE9ny az elfogadott r\xE9sztvev\u0151ket \xE9s a f\xE9r\u0151helyet, a piros sz\xE1m pedig a f\xFCgg\u0151 elemeket mutatja.</p>"
  },
  {
    id: "activity-event-actions",
    icon: "more_vert",
    title: "R\xE9sztvev\u0151k \xE9s m\u0171veletek",
    blurb: "Nyisd meg a tagokat vagy a sz\xE1modra el\xE9rhet\u0151 m\u0171veleteket.",
    contentHtml: "<p>A f\xE9r\u0151helyjelv\xE9ny megnyitja a r\xE9sztvev\u0151ket \xE9s a f\xFCgg\u0151 jelentkez\u0151ket. A h\xE1rompontos men\xFC a szerepedhez \xE9s az esem\xE9ny \xE1llapot\xE1hoz igazodik, ez\xE9rt megtekint\xE9st, szerkeszt\xE9st, k\xF6zz\xE9t\xE9telt, megh\xEDv\xE1skezel\xE9st, megoszt\xE1st, kil\xE9p\xE9st, t\xF6rl\xE9st vagy vissza\xE1ll\xEDt\xE1st k\xEDn\xE1lhat.</p>"
  },
  {
    id: "activity-event-join",
    icon: "person_add",
    title: "Csatlakoz\xE1s",
    blurb: "A l\xE9p\xE9sek az esem\xE9ny be\xE1ll\xEDt\xE1sait\xF3l f\xFCggenek.",
    contentHtml: "<p>A megh\xEDv\xE1st a k\xE1rty\xE1r\xF3l fogadhatod el vagy utas\xEDthatod vissza. Egyes esem\xE9nyek azonnal visszaigazolnak, m\xE1sokn\xE1l j\xF3v\xE1hagy\xE1s, jegy, szab\xE1lyelfogad\xE1s, fizet\xE9s vagy tov\xE1bbi v\xE1laszt\xE1s kell a v\xE9gleges helyhez.</p>"
  },
  {
    id: "activity-event-hosting",
    icon: "emoji_events",
    title: "L\xE9trehoz\xE1s \xE9s szervez\xE9s",
    blurb: "Indulj egyszer\u0171en, \xE9s csak azt add hozz\xE1, amire sz\xFCks\xE9g van.",
    contentHtml: "<p>A plusz gomb megnyitja az esem\xE9nyszerkeszt\u0151t. K\xE9sz\xEDthetsz egyszer\u0171 tal\xE1lkoz\xF3t, vagy hozz\xE1adhatsz alesem\xE9nyeket, csoportokat, er\u0151forr\xE1sokat, jegyeket, \xE1raz\xE1st \xE9s f\xE9r\u0151helyszab\xE1lyokat.</p>"
  }
];
var EXPLANATION_CHATS_SECTIONS = [
  {
    id: "activity-chat-list",
    icon: "forum",
    title: "Choose a chat list",
    blurb: "Filter conversations by their purpose.",
    contentHtml: "<p>Show all chats or filter by <strong>Event</strong>, <strong>Sub-event</strong>, <strong>Group</strong>, <strong>Service</strong>, or <strong>App Support</strong>. Red counters show unread items.</p>"
  },
  {
    id: "activity-chat-card",
    icon: "chat_bubble",
    title: "Read a chat row",
    blurb: "See the latest activity before opening it.",
    contentHtml: "<p>A row shows the latest sender, channel, recent message, time, member count, and unread count. Tap it to open the conversation.</p>"
  },
  {
    id: "activity-chat-channels",
    icon: "account_tree",
    title: "Channel types",
    blurb: "Keep each conversation in the right place.",
    contentHtml: "<p>Event chats cover the whole event, sub-event chats cover one part, and group chats cover a smaller team. Service and App Support chats handle their own help or system-related topics.</p>"
  },
  {
    id: "activity-chat-message-window",
    icon: "mark_chat_unread",
    title: "Open a conversation",
    blurb: "Read messages and use the available actions.",
    contentHtml: "<p>The header opens members, the related event or group, and pinned messages. Message actions depend on ownership and content: you may reply, react, edit or unsend your own message, pin it, open an attachment, or report it.</p>"
  },
  {
    id: "activity-chat-tools",
    icon: "add_circle",
    title: "Send more than text",
    blurb: "Use chat tools for practical planning.",
    contentHtml: "<p>The plus button lets you add an image, voice clip, poll, event, or asset. Shared items stay in the conversation so participants can open them later.</p>"
  }
];
var EXPLANATION_CHATS_SECTIONS_HU = [
  {
    id: "activity-chat-list",
    icon: "forum",
    title: "Besz\xE9lget\xE9sek kiv\xE1laszt\xE1sa",
    blurb: "Sz\u0171rd a besz\xE9lget\xE9seket a c\xE9ljuk szerint.",
    contentHtml: "<p>Megn\xE9zheted az \xF6sszes besz\xE9lget\xE9st, vagy sz\u0171rhetsz <strong>Esem\xE9ny</strong>, <strong>Alesem\xE9ny</strong>, <strong>Csoport</strong>, <strong>Szerviz</strong> \xE9s <strong>Alkalmaz\xE1st\xE1mogat\xE1s</strong> szerint. A piros sz\xE1ml\xE1l\xF3 az olvasatlan elemek sz\xE1m\xE1t mutatja.</p>"
  },
  {
    id: "activity-chat-card",
    icon: "chat_bubble",
    title: "Besz\xE9lget\xE9ssor",
    blurb: "Megnyit\xE1s el\u0151tt l\xE1sd a legut\xF3bbi aktivit\xE1st.",
    contentHtml: "<p>A sor megmutatja az utols\xF3 \xEDr\xF3t, a csatorn\xE1t, a legut\xF3bbi \xFCzenetet, az id\u0151pontot, a tagok \xE9s az olvasatlan \xFCzenetek sz\xE1m\xE1t. Koppints r\xE1 a besz\xE9lget\xE9s megnyit\xE1s\xE1hoz.</p>"
  },
  {
    id: "activity-chat-channels",
    icon: "account_tree",
    title: "Csatornat\xEDpusok",
    blurb: "Minden besz\xE9lget\xE9s maradjon a megfelel\u0151 helyen.",
    contentHtml: "<p>Az esem\xE9nybesz\xE9lget\xE9s az eg\xE9sz esem\xE9nyhez, az alesem\xE9ny-besz\xE9lget\xE9s egy r\xE9szhez, a csoportbesz\xE9lget\xE9s pedig egy kisebb csapathoz tartozik. A <strong>Szerviz</strong> \xE9s az <strong>Alkalmaz\xE1st\xE1mogat\xE1s</strong> csatorn\xE1i a saj\xE1t \xFCgyint\xE9z\xE9si t\xE9m\xE1ikat kezelik.</p>"
  },
  {
    id: "activity-chat-message-window",
    icon: "mark_chat_unread",
    title: "Besz\xE9lget\xE9s megnyit\xE1sa",
    blurb: "Olvasd el az \xFCzeneteket, \xE9s haszn\xE1ld az el\xE9rhet\u0151 m\u0171veleteket.",
    contentHtml: "<p>A fejl\xE9cb\u0151l megnyithatod a tagokat, a kapcsol\xF3d\xF3 esem\xE9nyt vagy csoportot \xE9s a kit\u0171z\xF6tt \xFCzeneteket. Az \xFCzenet tulajdon\xE1t\xF3l \xE9s tartalm\xE1t\xF3l f\xFCgg\u0151en v\xE1laszolhatsz, reag\xE1lhatsz, saj\xE1t \xFCzenetet szerkeszthetsz vagy visszavonhatsz, kit\u0171zhetsz, mell\xE9kletet nyithatsz meg vagy jelenthetsz.</p>"
  },
  {
    id: "activity-chat-tools",
    icon: "add_circle",
    title: "T\xF6bb mint sz\xF6veg",
    blurb: "A besz\xE9lget\xE9s eszk\xF6zeivel k\xF6nnyebb a szervez\xE9s.",
    contentHtml: "<p>A plusz gombbal k\xE9pet, hang\xFCzenetet, szavaz\xE1st, esem\xE9nyt vagy eszk\xF6zt k\xFCldhetsz. A megosztott elemek a besz\xE9lget\xE9sben maradnak, \xEDgy k\xE9s\u0151bb is megnyithat\xF3k.</p>"
  }
];
var EXPLANATION_CONTACTS_SECTIONS = [
  {
    id: "contacts-list",
    icon: "contacts",
    title: "Saved contacts",
    blurb: "Keep useful people easy to find.",
    contentHtml: "<p>Search your saved contacts by name. <strong>Create Contact</strong> lets you choose a member and add that person to this list.</p>"
  },
  {
    id: "contacts-card",
    icon: "badge",
    title: "Contact card",
    blurb: "Open a profile or use a saved shortcut.",
    contentHtml: "<p>The card shows the person, city, and saved contact methods. The eye opens the profile; the chips and three-dot menu open phone, message, email, social, website, edit, or delete actions when available.</p>"
  },
  {
    id: "contacts-private-methods",
    icon: "alternate_email",
    title: "Edit contact methods",
    blurb: "Change only the shortcuts saved in your contact list.",
    contentHtml: "<p><strong>Edit</strong> adds, changes, or removes phone, email, messaging, social, and web links. It does not edit the person&rsquo;s profile, and deleting the contact only removes the entry from your list.</p>"
  }
];
var EXPLANATION_CONTACTS_SECTIONS_HU = [
  {
    id: "contacts-list",
    icon: "contacts",
    title: "Mentett kapcsolatok",
    blurb: "Tartsd k\xF6nnyen el\xE9rhet\u0151 helyen a fontos embereket.",
    contentHtml: "<p>A mentett kapcsolatok k\xF6z\xF6tt n\xE9v alapj\xE1n kereshetsz. A <strong>Kapcsolat l\xE9trehoz\xE1sa</strong> gombbal kiv\xE1laszthatsz egy tagot, \xE9s hozz\xE1adhatod ehhez a list\xE1hoz.</p>"
  },
  {
    id: "contacts-card",
    icon: "badge",
    title: "Kapcsolatk\xE1rtya",
    blurb: "Nyisd meg a profilt, vagy haszn\xE1ld a mentett gyorsgombokat.",
    contentHtml: "<p>A k\xE1rtya az embert, a v\xE1rost \xE9s a mentett el\xE9r\xE9si m\xF3dokat mutatja. A szem megnyitja a profilt; a c\xEDmk\xE9k \xE9s a h\xE1rompontos men\xFC telefonos, \xFCzenetk\xFCld\xE9si, e-mailes, k\xF6z\xF6ss\xE9gi, webes, szerkeszt\xE9si vagy t\xF6rl\xE9si m\u0171veletet nyithat.</p>"
  },
  {
    id: "contacts-private-methods",
    icon: "alternate_email",
    title: "El\xE9r\xE9si m\xF3dok szerkeszt\xE9se",
    blurb: "Csak a kapcsolatlist\xE1ban mentett gyorsgombokat m\xF3dos\xEDtod.",
    contentHtml: "<p>A <strong>Szerkeszt\xE9s</strong> alatt telefonos, e-mailes, \xFCzenetk\xFCld\xE9si, k\xF6z\xF6ss\xE9gi \xE9s webes el\xE9r\xE9st adhatsz hozz\xE1, m\xF3dos\xEDthatsz vagy t\xF6r\xF6lhetsz. Ett\u0151l az illet\u0151 profilja nem v\xE1ltozik, a kapcsolat t\xF6rl\xE9se pedig csak a saj\xE1t list\xE1db\xF3l t\xE1vol\xEDtja el.</p>"
  }
];
var EXPLANATION_PROFILE_EDITOR_SECTIONS = [
  {
    id: "profile-editor-basics",
    icon: "manage_accounts",
    title: "Basic details",
    blurb: "Complete the information used on your profile.",
    contentHtml: "<p>For a regular profile, name, birthday, city, height, physique, gender, and languages are required. The short About text, work, and school entries add useful context.</p>"
  },
  {
    id: "profile-editor-media",
    icon: "add_photo_alternate",
    title: "Profile photos",
    blurb: "Manage images in a separate panel.",
    contentHtml: "<p>Use the edit action on the profile card to open <strong>Images</strong>. Add, reorder, replace, or remove photos, then return to the main panel before saving.</p>"
  },
  {
    id: "profile-editor-details",
    icon: "tune",
    title: "Details and visibility",
    blurb: "Add optional details and choose who can see them.",
    contentHtml: "<p>Add experience, lifestyle, values, and interests as needed. The header controls the overall profile status, while visibility icons beside supported details choose <strong>Public</strong>, <strong>Friends</strong>, <strong>Hosts</strong>, or <strong>Private</strong>.</p>"
  },
  {
    id: "profile-editor-save",
    icon: "save",
    title: "Save your profile",
    blurb: "Use the checkmark when you are finished.",
    contentHtml: "<p>The checkmark saves your changes and closes the editor. Closing the main panel without saving does not submit the changes.</p>"
  }
];
var EXPLANATION_PROFILE_EDITOR_SECTIONS_HU = [
  {
    id: "profile-editor-basics",
    icon: "manage_accounts",
    title: "Alapadatok",
    blurb: "T\xF6ltsd ki a profilodon haszn\xE1lt adatokat.",
    contentHtml: "<p>Norm\xE1l profiln\xE1l a n\xE9v, sz\xFClet\xE9si d\xE1tum, v\xE1ros, magass\xE1g, testalkat, nem \xE9s nyelvek k\xF6telez\u0151k. A r\xF6vid bemutatkoz\xE1s, a munkahely \xE9s az iskola tov\xE1bbi hasznos inform\xE1ci\xF3t ad.</p>"
  },
  {
    id: "profile-editor-media",
    icon: "add_photo_alternate",
    title: "Profilk\xE9pek",
    blurb: "A k\xE9peket k\xFCl\xF6n panelen kezelheted.",
    contentHtml: "<p>A profilk\xE1rtya szerkeszt\xE9si m\u0171velet\xE9vel nyisd meg a <strong>K\xE9pek</strong> panelt. Itt hozz\xE1adhatsz, \xE1trendezhetsz, cser\xE9lhetsz vagy t\xF6r\xF6lhetsz fot\xF3kat; ment\xE9s el\u0151tt t\xE9rj vissza a f\u0151 panelre.</p>"
  },
  {
    id: "profile-editor-details",
    icon: "tune",
    title: "R\xE9szletek \xE9s l\xE1that\xF3s\xE1g",
    blurb: "Adj meg opcion\xE1lis r\xE9szleteket, \xE9s v\xE1laszd ki, ki l\xE1thatja \u0151ket.",
    contentHtml: "<p>Sz\xFCks\xE9g szerint adj meg tapasztalatokat, \xE9letm\xF3dot, \xE9rt\xE9keket \xE9s \xE9rdekl\u0151d\xE9si k\xF6r\xF6ket. A fejl\xE9c a teljes profil \xE1llapot\xE1t szab\xE1lyozza, a t\xE1mogatott r\xE9szletek melletti ikonokkal pedig <strong>Nyilv\xE1nos</strong>, <strong>Bar\xE1tok</strong>, <strong>Szervez\u0151k</strong> vagy <strong>Priv\xE1t</strong> l\xE1that\xF3s\xE1got v\xE1laszthatsz.</p>"
  },
  {
    id: "profile-editor-save",
    icon: "save",
    title: "Profil ment\xE9se",
    blurb: "Ha elk\xE9sz\xFClt\xE9l, haszn\xE1ld a pip\xE1t.",
    contentHtml: "<p>A pipa menti a m\xF3dos\xEDt\xE1sokat, majd bez\xE1rja a szerkeszt\u0151t. Ha ment\xE9s n\xE9lk\xFCl z\xE1rod be a f\u0151 panelt, a v\xE1ltoztat\xE1sok nem ker\xFClnek bek\xFCld\xE9sre.</p>"
  }
];
var EXPLANATION_PROFILE_VIEW_SECTIONS = [
  {
    id: "profile-view-overview",
    icon: "visibility",
    title: "Profile overview",
    blurb: "This screen shows a profile without editing it.",
    contentHtml: "<p>The top card shows the selected photo, name, age, city, and headline. The Basics section lists key profile details and marks missing values as not set.</p>"
  },
  {
    id: "profile-view-photos",
    icon: "photo_library",
    title: "Photos and details",
    blurb: "Browse the information available on this profile.",
    contentHtml: "<p>Select another photo on the profile card when more are available. Below it, the About area, non-empty detail groups, and experience entries are shown in separate sections.</p>"
  },
  {
    id: "profile-view-actions",
    icon: "more_horiz",
    title: "Read-only view",
    blurb: "This popup does not change the profile.",
    contentHtml: "<p>There are no edit or contact actions on this screen. Close the popup to return to the card, chat, contact, or member list where you opened it.</p>"
  }
];
var EXPLANATION_PROFILE_VIEW_SECTIONS_HU = [
  {
    id: "profile-view-overview",
    icon: "visibility",
    title: "Profil \xE1ttekint\xE9se",
    blurb: "Ezen a k\xE9perny\u0151n szerkeszt\xE9s n\xE9lk\xFCl n\xE9zheted meg a profilt.",
    contentHtml: "<p>A fels\u0151 k\xE1rty\xE1n a kiv\xE1lasztott k\xE9p, n\xE9v, \xE9letkor, v\xE1ros \xE9s r\xF6vid le\xEDr\xE1s l\xE1tszik. Az Alapadatok r\xE9sz felsorolja a fontos profiladatokat, a hi\xE1nyz\xF3 \xE9rt\xE9keket pedig nincs megadva jelz\xE9ssel mutatja.</p>"
  },
  {
    id: "profile-view-photos",
    icon: "photo_library",
    title: "K\xE9pek \xE9s r\xE9szletek",
    blurb: "N\xE9zd \xE1t a profilon el\xE9rhet\u0151 inform\xE1ci\xF3kat.",
    contentHtml: "<p>Ha t\xF6bb k\xE9p van, a profilk\xE1rty\xE1n m\xE1sik fot\xF3t v\xE1laszthatsz. Alatta k\xFCl\xF6n r\xE9szben jelenik meg a bemutatkoz\xE1s, a kit\xF6lt\xF6tt r\xE9szletcsoportok \xE9s a tapasztalatok.</p>"
  },
  {
    id: "profile-view-actions",
    icon: "more_horiz",
    title: "Csak olvashat\xF3 n\xE9zet",
    blurb: "Ez az ablak nem m\xF3dos\xEDtja a profilt.",
    contentHtml: "<p>Ezen a k\xE9perny\u0151n nincs szerkeszt\xE9si vagy kapcsolatfelv\xE9teli m\u0171velet. Z\xE1rd be az ablakot, hogy visszat\xE9rj ahhoz a k\xE1rty\xE1hoz, besz\xE9lget\xE9shez, kapcsolathoz vagy taglist\xE1hoz, ahonnan megnyitottad.</p>"
  }
];
var EXPLANATION_EVENT_FEEDBACK_SECTIONS = [
  {
    id: "event-feedback-entry",
    icon: "rate_review",
    title: "Feedback lists",
    blurb: "Choose the feedback state you want to see.",
    contentHtml: "<p><strong>Pending</strong> holds events waiting for your feedback, <strong>Feedbacked</strong> holds submitted items, and <strong>Removed</strong> holds skipped items that can be restored. <strong>Own Events</strong> shows feedback received for events you organized.</p>"
  },
  {
    id: "event-feedback-categories",
    icon: "checklist",
    title: "Answer the cards",
    blurb: "Complete each card, then review your answers.",
    contentHtml: "<p>On every event or participant card, answer the two questions and choose one to three traits. Review the summary, then use <strong>Submit feedback</strong> to send all answers.</p>"
  },
  {
    id: "event-feedback-save",
    icon: "task_alt",
    title: "After feedback",
    blurb: "Review submitted or received results.",
    contentHtml: "<p>Submitted feedback moves to <strong>Feedbacked</strong> and can be opened again. Organizers can view summaries and named responses for their own events; a separate note to the organizer requires at least eight characters.</p>"
  }
];
var EXPLANATION_EVENT_FEEDBACK_SECTIONS_HU = [
  {
    id: "event-feedback-entry",
    icon: "rate_review",
    title: "Visszajelz\xE9si list\xE1k",
    blurb: "V\xE1laszd ki, melyik \xE1llapotot szeretn\xE9d l\xE1tni.",
    contentHtml: "<p>A <strong>F\xFCgg\u0151ben</strong> list\xE1ban a kit\xF6lt\xE9sre v\xE1r\xF3, a <strong>Visszajelezve</strong> list\xE1ban a bek\xFCld\xF6tt, az <strong>Elt\xE1vol\xEDtva</strong> list\xE1ban pedig a kihagyott \xE9s vissza\xE1ll\xEDthat\xF3 esem\xE9nyek vannak. A <strong>Saj\xE1t esem\xE9nyek</strong> a szervez\u0151k\xE9nt kapott visszajelz\xE9seket mutatja.</p>"
  },
  {
    id: "event-feedback-categories",
    icon: "checklist",
    title: "K\xE1rty\xE1k kit\xF6lt\xE9se",
    blurb: "T\xF6lts ki minden k\xE1rty\xE1t, majd ellen\u0151rizd a v\xE1laszaidat.",
    contentHtml: "<p>Minden esem\xE9ny- vagy r\xE9sztvev\u0151k\xE1rty\xE1n v\xE1laszolj a k\xE9t k\xE9rd\xE9sre, \xE9s v\xE1lassz 1\u20133 jellemz\u0151t. Az \xF6sszegz\xE9s ut\xE1n a <strong>Visszajelz\xE9s bek\xFCld\xE9se</strong> gomb elk\xFCldi az \xF6sszes v\xE1laszt.</p>"
  },
  {
    id: "event-feedback-save",
    icon: "task_alt",
    title: "Bek\xFCld\xE9s ut\xE1n",
    blurb: "N\xE9zd meg az elk\xFCld\xF6tt vagy kapott eredm\xE9nyeket.",
    contentHtml: "<p>A bek\xFCld\xF6tt v\xE1lasz a <strong>Visszajelezve</strong> list\xE1ba ker\xFCl, \xE9s k\xE9s\u0151bb \xFAjra megnyithat\xF3. A szervez\u0151k a saj\xE1t esem\xE9nyeik \xF6sszes\xEDt\xE9s\xE9t \xE9s n\xE9vvel jel\xF6lt v\xE1laszait l\xE1tj\xE1k; a szervez\u0151nek sz\xF3l\xF3 k\xFCl\xF6n megjegyz\xE9shez legal\xE1bb nyolc karaktert kell \xEDrni.</p>"
  }
];
var EXPLANATION_ASSETS_SECTIONS = [
  {
    id: "assets-entry",
    icon: "inventory_2",
    title: "Choose an asset type",
    blurb: "Switch between your assets and tickets.",
    contentHtml: "<p>Use the top menu for <strong>Transport</strong>, <strong>Accommodation</strong>, <strong>Supplies</strong>, or <strong>Ticket</strong>. The first three are assets you can add and edit; tickets are event entry records.</p>"
  },
  {
    id: "assets-card",
    icon: "view_agenda",
    title: "Asset card",
    blurb: "See the item and its current availability.",
    contentHtml: "<p>The card shows the image, title, subtitle, and an availability or request count. Use the location icon when shown, or the three-dot menu for actions such as sharing, requests, editing, and deleting.</p>"
  },
  {
    id: "assets-editor",
    icon: "edit",
    title: "Edit an asset",
    blurb: "Transport, accommodation, and supplies use the same form.",
    contentHtml: "<p>Title, total capacity, and quantity are required. You can also add one image, a subtitle, source link, category, details, visibility, pricing, and lending rules; accommodation also requires a location.</p>"
  },
  {
    id: "assets-requests",
    icon: "assignment",
    title: "Requests",
    blurb: "Review who wants to use the asset.",
    contentHtml: "<p>Filter all, active, pending, or borrowed requests. You can accept or reject a pending request, and make an accepted user a <strong>Manager</strong> for this asset.</p>"
  },
  {
    id: "assets-scope",
    icon: "travel_explore",
    title: "Visibility and events",
    blurb: "Control discovery and assign assets separately.",
    contentHtml: "<p>Visibility controls who may find the asset in <strong>Asset Explorer</strong>. To use it in an event or sub-event, assign it from that event&rsquo;s resource screen.</p>"
  }
];
var EXPLANATION_ASSETS_SECTIONS_HU = [
  {
    id: "assets-entry",
    icon: "inventory_2",
    title: "Eszk\xF6zt\xEDpus v\xE1laszt\xE1sa",
    blurb: "V\xE1lts a saj\xE1t eszk\xF6z\xF6k \xE9s a jegyek k\xF6z\xF6tt.",
    contentHtml: "<p>A fels\u0151 men\xFCben a <strong>K\xF6zleked\xE9s</strong>, <strong>Sz\xE1ll\xE1s</strong>, <strong>Kell\xE9kek</strong> \xE9s <strong>Jegy</strong> k\xF6z\xF6tt v\xE1lthatsz. Az els\u0151 h\xE1rom hozz\xE1adhat\xF3 \xE9s szerkeszthet\u0151 eszk\xF6z, a jegy pedig esem\xE9nyhez tartoz\xF3 bel\xE9p\xE9si adat.</p>"
  },
  {
    id: "assets-card",
    icon: "view_agenda",
    title: "Eszk\xF6zk\xE1rtya",
    blurb: "L\xE1sd az eszk\xF6zt \xE9s az aktu\xE1lis el\xE9rhet\u0151s\xE9g\xE9t.",
    contentHtml: "<p>A k\xE1rty\xE1n a k\xE9p, c\xEDm, alc\xEDm \xE9s az el\xE9rhet\u0151 mennyis\xE9g vagy k\xE9r\xE9sek sz\xE1ma l\xE1tszik. Ha van helyikon, az megnyitja a t\xE9rk\xE9pet; a h\xE1rompontos men\xFCben t\xF6bbek k\xF6z\xF6tt megoszt\xE1s, k\xE9r\xE9skezel\xE9s, szerkeszt\xE9s \xE9s t\xF6rl\xE9s lehet.</p>"
  },
  {
    id: "assets-editor",
    icon: "edit",
    title: "Eszk\xF6z szerkeszt\xE9se",
    blurb: "A j\xE1rm\u0171vek, sz\xE1ll\xE1sok \xE9s kell\xE9kek ugyanazt az \u0171rlapot haszn\xE1lj\xE1k.",
    contentHtml: "<p>A c\xEDm, a teljes kapacit\xE1s \xE9s a mennyis\xE9g k\xF6telez\u0151. Megadhatsz m\xE9g egy k\xE9pet, alc\xEDmet, forr\xE1slinket, kateg\xF3ri\xE1t, r\xE9szleteket, l\xE1that\xF3s\xE1got, \xE1rat \xE9s k\xF6lcs\xF6nz\xE9si szab\xE1lyokat; sz\xE1ll\xE1sn\xE1l a helysz\xEDn is k\xF6telez\u0151.</p>"
  },
  {
    id: "assets-requests",
    icon: "assignment",
    title: "K\xE9r\xE9sek",
    blurb: "N\xE9zd meg, ki szeretn\xE9 haszn\xE1lni az eszk\xF6zt.",
    contentHtml: "<p>Sz\u0171rhetsz az \xF6sszes, akt\xEDv, f\xFCgg\u0151 vagy k\xF6lcs\xF6nadott k\xE9r\xE9sre. A f\xFCgg\u0151 k\xE9r\xE9st elfogadhatod vagy elutas\xEDthatod, az elfogadott felhaszn\xE1l\xF3t pedig az eszk\xF6z <strong>Kezel\u0151j\xE9v\xE9</strong> teheted.</p>"
  },
  {
    id: "assets-scope",
    icon: "travel_explore",
    title: "L\xE1that\xF3s\xE1g \xE9s esem\xE9nyek",
    blurb: "A felfedez\xE9st \xE9s az esem\xE9nyhez rendel\xE9st k\xFCl\xF6n \xE1ll\xEDtod.",
    contentHtml: "<p>A l\xE1that\xF3s\xE1g szab\xE1lyozza, ki tal\xE1lhatja meg az eszk\xF6zt az <strong>Eszk\xF6zkeres\u0151ben</strong>. Esem\xE9nyhez vagy alesem\xE9nyhez az adott esem\xE9ny er\u0151forr\xE1s-k\xE9perny\u0151j\xE9n rendelheted hozz\xE1.</p>"
  }
];
function assetExplanationSections(baseSections, overrides) {
  return baseSections.map((section) => __spreadValues(__spreadValues({}, section), overrides[section.id] ?? {}));
}
var EXPLANATION_ASSETS_TRANSPORT_SECTIONS = assetExplanationSections(EXPLANATION_ASSETS_SECTIONS, {
  "assets-entry": {
    icon: "directions_car",
    title: "Your transport",
    blurb: "Add and manage vehicles or other transport.",
    contentHtml: "<p>The <strong>Transport</strong> tab lists transport assets you own or manage. Use the plus button to create one, then set its title, capacity, quantity, details, visibility, and any optional price or rules.</p>"
  },
  "assets-card": {
    icon: "directions_car",
    title: "Transport card",
    contentHtml: "<p>The card shows the image, name, subtitle, and available capacity or requests. Open the three-dot menu to see the actions available for that transport.</p>"
  },
  "assets-editor": {
    title: "Transport details",
    contentHtml: "<p>Use total capacity for the available seats and quantity for the units offered. Put pickup, route, luggage, fuel, or driver information in <strong>Details</strong>; a separate route control appears only for a related event assignment.</p>"
  }
});
var EXPLANATION_ASSETS_ACCOMMODATION_SECTIONS = assetExplanationSections(EXPLANATION_ASSETS_SECTIONS, {
  "assets-entry": {
    icon: "apartment",
    title: "Your accommodation",
    blurb: "Add and manage places you can offer.",
    contentHtml: "<p>The <strong>Accommodation</strong> tab lists places you own or manage. Use the plus button to create one, then set its title, location, capacity, quantity, details, visibility, and any optional price or rules.</p>"
  },
  "assets-card": {
    icon: "apartment",
    title: "Accommodation card",
    contentHtml: "<p>The card shows the image, name, subtitle, and available capacity or requests. Use the location icon to open the saved place on a map.</p>"
  },
  "assets-editor": {
    title: "Accommodation details",
    contentHtml: "<p>A <strong>location</strong> is required for accommodation. Use capacity and quantity for the space offered, and Details for check-in, sleeping, parking, or house rules.</p>"
  }
});
var EXPLANATION_ASSETS_SUPPLIES_SECTIONS = assetExplanationSections(EXPLANATION_ASSETS_SECTIONS, {
  "assets-entry": {
    icon: "inventory_2",
    title: "Your supplies",
    blurb: "Add and manage equipment or other useful items.",
    contentHtml: "<p>The <strong>Supplies</strong> tab lists items you own or manage. Use the plus button to create one, then set its title, capacity, quantity, details, visibility, and any optional price or rules.</p>"
  },
  "assets-card": {
    icon: "inventory_2",
    title: "Supply card",
    contentHtml: "<p>The card shows the image, name, subtitle, and available quantity or requests. Open the three-dot menu to see the actions available for that item.</p>"
  },
  "assets-editor": {
    title: "Supply details",
    contentHtml: "<p>Set the total capacity and the quantity offered. Use <strong>Details</strong> for condition, included parts, pickup, return, or deposit information.</p>"
  }
});
var EXPLANATION_ASSETS_TICKETS_SECTIONS = [
  {
    id: "assets-tickets",
    icon: "qr_code_2",
    title: "Your tickets",
    blurb: "View your upcoming and past event tickets.",
    contentHtml: "<p>Switch between <strong>Upcoming</strong> and <strong>Past</strong>. If you manage an event, <strong>Scan Ticket</strong> opens the camera so you can check in an attendee.</p>"
  },
  {
    id: "assets-ticket-card",
    icon: "confirmation_number",
    title: "Ticket card",
    blurb: "Open your QR code or see when it was used.",
    contentHtml: "<p>Tap the QR badge to show your entry code. After check-in, the card changes to <strong>Checked in</strong>; the same popup then shows the scan time instead of the QR code.</p>"
  },
  {
    id: "assets-ticket-scanner",
    icon: "qr_code_scanner",
    title: "Scan a ticket",
    blurb: "Check in an attendee with a valid, unused ticket.",
    contentHtml: "<p>Use the <strong>Camera on / Camera off</strong> toggle to start or stop the live stream. The server checks that you can manage the event and that the ticket is active, eligible, unexpired, and unused. A successful scan stops the camera, keeps the accepted frame visible, checks in the named holder and uses the ticket once; turning the camera on again and scanning the same QR is rejected. The QR code contains only an anonymous ticket code.</p>"
  }
];
var EXPLANATION_ASSETS_TRANSPORT_SECTIONS_HU = assetExplanationSections(EXPLANATION_ASSETS_SECTIONS_HU, {
  "assets-entry": {
    icon: "directions_car",
    title: "Saj\xE1t j\xE1rm\u0171vek",
    blurb: "Adj hozz\xE1 \xE9s kezelj j\xE1rm\u0171vet vagy m\xE1s sz\xE1ll\xEDt\xE1si eszk\xF6zt.",
    contentHtml: "<p>A <strong>K\xF6zleked\xE9s</strong> f\xFCl a tulajdonodban vagy kezel\xE9sedben l\xE9v\u0151 sz\xE1ll\xEDt\xE1si eszk\xF6z\xF6ket mutatja. A plusz gombbal \xFAjat hozhatsz l\xE9tre, majd megadhatod a c\xEDm\xE9t, kapacit\xE1s\xE1t, mennyis\xE9g\xE9t, r\xE9szleteit, l\xE1that\xF3s\xE1g\xE1t, valamint az opcion\xE1lis \xE1rat \xE9s szab\xE1lyokat.</p>"
  },
  "assets-card": {
    icon: "directions_car",
    title: "J\xE1rm\u0171k\xE1rtya",
    contentHtml: "<p>A k\xE1rty\xE1n a k\xE9p, n\xE9v, alc\xEDm \xE9s az el\xE9rhet\u0151 kapacit\xE1s vagy k\xE9r\xE9sek sz\xE1ma l\xE1tszik. A h\xE1rompontos men\xFC megnyitja az adott j\xE1rm\u0171h\xF6z el\xE9rhet\u0151 m\u0171veleteket.</p>"
  },
  "assets-editor": {
    title: "J\xE1rm\u0171 adatai",
    contentHtml: "<p>A teljes kapacit\xE1sn\xE1l add meg a f\xE9r\u0151helyeket, a mennyis\xE9gn\xE9l pedig a felaj\xE1nlott egys\xE9geket. Az indul\xE1si helyet, \xFAtvonalat, csomagot, \xFCzemanyagot vagy sof\u0151rt a <strong>R\xE9szletek</strong> mez\u0151ben \xEDrd le; k\xFCl\xF6n \xFAtvonalbe\xE1ll\xEDt\xE1s csak esem\xE9nyhez kapcsolt hozz\xE1rendel\xE9sn\xE9l jelenik meg.</p>"
  }
});
var EXPLANATION_ASSETS_ACCOMMODATION_SECTIONS_HU = assetExplanationSections(EXPLANATION_ASSETS_SECTIONS_HU, {
  "assets-entry": {
    icon: "apartment",
    title: "Saj\xE1t sz\xE1ll\xE1sok",
    blurb: "Adj hozz\xE1 \xE9s kezelj felaj\xE1nlhat\xF3 helyeket.",
    contentHtml: "<p>A <strong>Sz\xE1ll\xE1s</strong> f\xFCl a tulajdonodban vagy kezel\xE9sedben l\xE9v\u0151 helyeket mutatja. A plusz gombbal \xFAjat hozhatsz l\xE9tre, majd megadhatod a c\xEDm\xE9t, helysz\xEDn\xE9t, kapacit\xE1s\xE1t, mennyis\xE9g\xE9t, r\xE9szleteit, l\xE1that\xF3s\xE1g\xE1t, valamint az opcion\xE1lis \xE1rat \xE9s szab\xE1lyokat.</p>"
  },
  "assets-card": {
    icon: "apartment",
    title: "Sz\xE1ll\xE1sk\xE1rtya",
    contentHtml: "<p>A k\xE1rty\xE1n a k\xE9p, n\xE9v, alc\xEDm \xE9s az el\xE9rhet\u0151 kapacit\xE1s vagy k\xE9r\xE9sek sz\xE1ma l\xE1tszik. A helyikonnal megnyithatod a mentett helysz\xEDnt a t\xE9rk\xE9pen.</p>"
  },
  "assets-editor": {
    title: "Sz\xE1ll\xE1s adatai",
    contentHtml: "<p>Sz\xE1ll\xE1sn\xE1l a <strong>helysz\xEDn</strong> k\xF6telez\u0151. A kapacit\xE1ssal \xE9s mennyis\xE9ggel add meg a felaj\xE1nlott helyet, a R\xE9szletek mez\u0151ben pedig \xEDrd le a bejut\xE1st, alv\xE1st, parkol\xE1st vagy h\xE1zirendet.</p>"
  }
});
var EXPLANATION_ASSETS_SUPPLIES_SECTIONS_HU = assetExplanationSections(EXPLANATION_ASSETS_SECTIONS_HU, {
  "assets-entry": {
    icon: "inventory_2",
    title: "Saj\xE1t kell\xE9kek",
    blurb: "Adj hozz\xE1 \xE9s kezelj felszerel\xE9st vagy m\xE1s hasznos t\xE1rgyat.",
    contentHtml: "<p>A <strong>Kell\xE9kek</strong> f\xFCl a tulajdonodban vagy kezel\xE9sedben l\xE9v\u0151 t\xE1rgyakat mutatja. A plusz gombbal \xFAjat hozhatsz l\xE9tre, majd megadhatod a c\xEDm\xE9t, kapacit\xE1s\xE1t, mennyis\xE9g\xE9t, r\xE9szleteit, l\xE1that\xF3s\xE1g\xE1t, valamint az opcion\xE1lis \xE1rat \xE9s szab\xE1lyokat.</p>"
  },
  "assets-card": {
    icon: "inventory_2",
    title: "Kell\xE9kk\xE1rtya",
    contentHtml: "<p>A k\xE1rty\xE1n a k\xE9p, n\xE9v, alc\xEDm \xE9s az el\xE9rhet\u0151 mennyis\xE9g vagy k\xE9r\xE9sek sz\xE1ma l\xE1tszik. A h\xE1rompontos men\xFC megnyitja az adott t\xE1rgyhoz el\xE9rhet\u0151 m\u0171veleteket.</p>"
  },
  "assets-editor": {
    title: "Kell\xE9k adatai",
    contentHtml: "<p>Add meg a teljes kapacit\xE1st \xE9s a felaj\xE1nlott mennyis\xE9get. A <strong>R\xE9szletek</strong> mez\u0151ben \xEDrd le az \xE1llapotot, a tartoz\xE9kokat, az \xE1tv\xE9telt, a visszaad\xE1st vagy a kauci\xF3t.</p>"
  }
});
var EXPLANATION_ASSETS_TICKETS_SECTIONS_HU = [
  {
    id: "assets-tickets",
    icon: "qr_code_2",
    title: "Saj\xE1t jegyek",
    blurb: "N\xE9zd meg a k\xF6zelg\u0151 \xE9s kor\xE1bbi esem\xE9nyjegyeidet.",
    contentHtml: "<p>V\xE1lts a <strong>K\xF6zelg\u0151</strong> \xE9s <strong>Kor\xE1bbi</strong> jegyek k\xF6z\xF6tt. Ha te kezeled az esem\xE9nyt, a <strong>Jegy szkennel\xE9se</strong> gombbal bel\xE9ptetheted a r\xE9sztvev\u0151t.</p>"
  },
  {
    id: "assets-ticket-card",
    icon: "confirmation_number",
    title: "Jegyk\xE1rtya",
    blurb: "Nyisd meg a QR-k\xF3dot, vagy n\xE9zd meg a bel\xE9ptet\xE9s idej\xE9t.",
    contentHtml: "<p>A QR-jelv\xE9ny megnyitja a bel\xE9p\u0151k\xF3dodat. Bel\xE9ptet\xE9s ut\xE1n a k\xE1rty\xE1n a <strong>Bel\xE9ptetve</strong> jelv\xE9ny jelenik meg; ugyanaz a felugr\xF3 ablak ekkor a beolvas\xE1s idej\xE9t mutatja a QR-k\xF3d helyett.</p>"
  },
  {
    id: "assets-ticket-scanner",
    icon: "qr_code_scanner",
    title: "Jegy beolvas\xE1sa",
    blurb: "\xC9rv\xE9nyes, m\xE9g nem haszn\xE1lt jeggyel l\xE9ptesd be a r\xE9sztvev\u0151t.",
    contentHtml: "<p>A <strong>Kamera be / Kamera ki</strong> kapcsol\xF3 ind\xEDtja vagy \xE1ll\xEDtja le az \xE9l\u0151 k\xE9pet. A szerver ellen\u0151rzi, hogy kezelheted-e az esem\xE9nyt, \xE9s a jegy akt\xEDv, jogosult r\xE9sztvev\u0151h\xF6z tartozik, nem j\xE1rt le \xE9s m\xE9g nem haszn\xE1lt\xE1k. A sikeres beolvas\xE1s le\xE1ll\xEDtja a kamer\xE1t, megtartja az elfogadott k\xE9pkock\xE1t, egyszer haszn\xE1lhat\xF3an bel\xE9pteti a megnevezett tulajdonost; a kamera \xFAjb\xF3li bekapcsol\xE1sa ut\xE1n ugyanazt a QR-k\xF3dot a rendszer elutas\xEDtja. A QR-k\xF3d csak egy szem\xE9lytelen jegyazonos\xEDt\xF3t tartalmaz.</p>"
  }
];
var EXPLANATION_EVENT_EDITOR_SECTIONS = [
  {
    id: "event-editor-main",
    icon: "edit_calendar",
    title: "Required event details",
    blurb: "Complete the fields needed for saving.",
    contentHtml: "<p>Name, description, minimum and maximum capacity, start time, and end time are required. The image and location are optional; use the header checkmark to save.</p>"
  },
  {
    id: "event-editor-switches",
    icon: "tune",
    title: "Visibility and joining",
    blurb: "Choose who can find the event and what joining requires.",
    contentHtml: "<p><strong>Public</strong>, <strong>Friends only</strong>, and <strong>Invitation only</strong> control discovery. The <strong>Open</strong>/<strong>Blind</strong> setting decides whether attendees can see each other before the event; you can also choose up to five topics and enable automatic invitations, ticketing, or approval.</p>"
  },
  {
    id: "event-editor-schedule",
    icon: "event_time",
    title: "Schedule, price, and rules",
    blurb: "Set when the event runs and any joining conditions.",
    contentHtml: "<p>Choose a one-time or repeating schedule and adjust its time slots when needed. Pricing and event policies are optional, and the location field sets the place shown for the event.</p>"
  },
  {
    id: "event-editor-subevents",
    icon: "account_tree",
    title: "Sub-events",
    blurb: "Split a larger event into smaller parts.",
    contentHtml: "<p>Sub-events can be mandatory parts or optional choices with their own capacity and price. <strong>Casual</strong> keeps a simple structure, while <strong>Tournament</strong> adds stages, groups, scores, and standings.</p>"
  },
  {
    id: "event-editor-members",
    icon: "groups",
    title: "Members and roles",
    blurb: "Manage participants in a separate member window.",
    contentHtml: "<p>Open <strong>Members</strong> to invite people and review accepted or pending participants. Available role and status actions depend on whether you are an organizer, manager, or member.</p>"
  },
  {
    id: "event-editor-assets",
    icon: "inventory_2",
    title: "Resources",
    blurb: "Assign people and assets to an event part.",
    contentHtml: "<p>From a sub-event or group, open members, transport, accommodation, or supplies. <strong>Assign</strong> uses an asset you already manage, while <strong>Explore</strong> finds one you can request.</p>"
  }
];
var EXPLANATION_EVENT_EDITOR_SECTIONS_HU = [
  {
    id: "event-editor-main",
    icon: "edit_calendar",
    title: "K\xF6telez\u0151 esem\xE9nyadatok",
    blurb: "T\xF6ltsd ki a ment\xE9shez sz\xFCks\xE9ges mez\u0151ket.",
    contentHtml: "<p>A n\xE9v, le\xEDr\xE1s, legkisebb \xE9s legnagyobb l\xE9tsz\xE1m, kezd\xE9si id\u0151 \xE9s befejez\xE9si id\u0151 k\xF6telez\u0151. A k\xE9p \xE9s a helysz\xEDn opcion\xE1lis; a fejl\xE9c pip\xE1ja menti az esem\xE9nyt.</p>"
  },
  {
    id: "event-editor-switches",
    icon: "tune",
    title: "L\xE1that\xF3s\xE1g \xE9s csatlakoz\xE1s",
    blurb: "\xC1ll\xEDtsd be, ki tal\xE1lhatja meg az esem\xE9nyt, \xE9s mi kell a bel\xE9p\xE9shez.",
    contentHtml: "<p>A <strong>Nyilv\xE1nos</strong>, <strong>Csak bar\xE1tok</strong> \xE9s <strong>Csak megh\xEDv\xE1ssal</strong> be\xE1ll\xEDt\xE1sok a megtal\xE1lhat\xF3s\xE1got szab\xE1lyozz\xE1k. A <strong>Nyitott</strong>/<strong>Vak</strong> be\xE1ll\xEDt\xE1s d\xF6nti el, hogy a r\xE9sztvev\u0151k l\xE1thatj\xE1k-e egym\xE1st az esem\xE9ny el\u0151tt; emellett legfeljebb \xF6t t\xE9m\xE1t v\xE1laszthatsz, \xE9s bekapcsolhatod az automatikus megh\xEDv\xE1st, a jegykezel\xE9st vagy a j\xF3v\xE1hagy\xE1st.</p>"
  },
  {
    id: "event-editor-schedule",
    icon: "event_time",
    title: "Id\u0151, \xE1r \xE9s szab\xE1lyok",
    blurb: "\xC1ll\xEDtsd be az id\u0151beoszt\xE1st \xE9s a csatlakoz\xE1s felt\xE9teleit.",
    contentHtml: "<p>V\xE1lassz egyszeri vagy ism\xE9tl\u0151d\u0151 id\u0151beoszt\xE1st, \xE9s sz\xFCks\xE9g eset\xE9n m\xF3dos\xEDtsd az id\u0151s\xE1vokat. Az \xE1raz\xE1s \xE9s az esem\xE9nyszab\xE1lyok opcion\xE1lisak, a helysz\xEDnmez\u0151 pedig az esem\xE9nyn\xE9l megjelen\u0151 helyet adja meg.</p>"
  },
  {
    id: "event-editor-subevents",
    icon: "account_tree",
    title: "Alesem\xE9nyek",
    blurb: "Bontsd kisebb r\xE9szekre a nagyobb esem\xE9nyt.",
    contentHtml: "<p>Az alesem\xE9ny lehet k\xF6telez\u0151 r\xE9sz vagy k\xFCl\xF6n v\xE1laszthat\xF3 program saj\xE1t l\xE9tsz\xE1mmal \xE9s \xE1rral. A <strong>K\xF6tetlen</strong> m\xF3d egyszer\u0171 fel\xE9p\xEDt\xE9st, a <strong>Bajnoks\xE1g</strong> pedig szakaszokat, csoportokat, pontokat \xE9s rangsort ad.</p>"
  },
  {
    id: "event-editor-members",
    icon: "groups",
    title: "Tagok \xE9s szerepek",
    blurb: "A r\xE9sztvev\u0151ket k\xFCl\xF6n tagablakban kezelheted.",
    contentHtml: "<p>A <strong>Tagok</strong> ablakban embereket h\xEDvhatsz meg, valamint megn\xE9zheted az elfogadott \xE9s f\xFCgg\u0151 r\xE9sztvev\u0151ket. A szerep- \xE9s \xE1llapotm\u0171veletek att\xF3l f\xFCggenek, hogy szervez\u0151, kezel\u0151 vagy r\xE9sztvev\u0151 vagy.</p>"
  },
  {
    id: "event-editor-assets",
    icon: "inventory_2",
    title: "Er\u0151forr\xE1sok",
    blurb: "Rendelj embereket \xE9s eszk\xF6z\xF6ket az esem\xE9ny egy r\xE9sz\xE9hez.",
    contentHtml: "<p>Egy alesem\xE9nyb\u0151l vagy csoportb\xF3l nyithatod meg a tagokat, j\xE1rm\u0171veket, sz\xE1ll\xE1sokat \xE9s kell\xE9keket. A <strong>Hozz\xE1rendel\xE9s</strong> egy m\xE1r kezelt eszk\xF6zt haszn\xE1l, a <strong>Felfedez\xE9s</strong> pedig k\xE9rhet\u0151 eszk\xF6zt keres.</p>"
  }
];
var EXPLANATION_IMAGE_SLOT_LIMIT = 8;
var SEEDED_EXPLANATION_IMAGE_REF_PREFIX = "help-seeded-image:";
var SEEDED_EXPLANATION_IMAGE_ASSET_ROOT = "assets/help-center/explanations";
var LAZY_IMAGE_PLACEHOLDER_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
var EXPLANATION_SECTION_SPANS = {
  "affinity-network": "span-2",
  "activity-chat-message-window": "span-2",
  "contacts-list": "span-2",
  "contacts-card": "span-2",
  "contacts-private-methods": "span-2",
  "assets-entry": "span-2",
  "assets-card": "span-2",
  "assets-editor": "span-2",
  "assets-requests": "span-2",
  "assets-scope": "span-2"
};
var SPAN_1_EXPLANATION_CONTEXTS = /* @__PURE__ */ new Set(["events", "event.editor"]);
function withSeededExplanationImages(contextKey, sections, lang) {
  return sections.map((section) => {
    const seededImageUrl = seededExplanationImageRef(contextKey, lang, section.id);
    return __spreadProps(__spreadValues({}, section), {
      panelSpan: SPAN_1_EXPLANATION_CONTEXTS.has(contextKey) ? "span-1" : section.panelSpan ?? EXPLANATION_SECTION_SPANS[section.id],
      contentHtml: withSeededExplanationImageHtml(section.contentHtml, seededImageUrl, section.title),
      imageUrls: uniqueHelpImageUrls([seededImageUrl, ...section.imageUrls ?? []])
    });
  });
}
function uniqueHelpImageUrls(imageUrls) {
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  for (const imageUrl of imageUrls) {
    const normalized = `${imageUrl ?? ""}`.trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(normalized);
    if (result.length >= EXPLANATION_IMAGE_SLOT_LIMIT) {
      break;
    }
  }
  return result;
}
function seededExplanationImageRef(contextKey, lang, sectionId) {
  return `${SEEDED_EXPLANATION_IMAGE_REF_PREFIX}${contentLangForSeed(lang)}/${seededExplanationPathSegment(contextKey)}/${seededExplanationPathSegment(sectionId)}`;
}
function withSeededExplanationImageHtml(contentHtml, imageUrl, title) {
  const html = `${contentHtml ?? ""}`.trim();
  const nextFigure = `<figure class="explanation-seeded-visual lazy-image-frame-loading"><img class="lazy-image-loading" src="${escapeHtmlAttribute(lazyImagePlaceholderSrc(imageUrl))}" alt="${escapeHtmlAttribute(title ?? "")}"></figure>`;
  const withoutExistingSeededFigure = html.replace(/<figure\b[^>]*\bexplanation-seeded-visual\b[^>]*>[\s\S]*?<\/figure>/gi, "").trim();
  if (/<img[\s>]/i.test(withoutExistingSeededFigure)) {
    return withoutExistingSeededFigure;
  }
  return `${withoutExistingSeededFigure}${withoutExistingSeededFigure ? "" : ""}${nextFigure}`;
}
function lazyImagePlaceholderSrc(imageUrl) {
  return `${LAZY_IMAGE_PLACEHOLDER_URL}#lazy-src=${encodeURIComponent(imageUrl)}`;
}
function seededExplanationPathSegment(value) {
  return `${value ?? ""}`.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "default";
}
function contentLangForSeed(lang) {
  return `${lang ?? ""}`.trim().toLowerCase().split("-")[0] === "hu" ? "hu" : "en";
}
function escapeHtmlAttribute(value) {
  return `${value ?? ""}`.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var DEFAULT_EXPLANATION_HOME_REVISION = {
  id: "explanation-home-default-v1",
  documentKind: "explanation",
  contextKey: "home.game",
  lang: "en",
  languageLabel: "English",
  version: 1,
  title: "Home cards",
  summary: "Rate cards, switch groups, and revisit ratings.",
  description: "Learn how to rate a card and control which suggestions appear.",
  headerColor: "violet",
  sections: withSeededExplanationImages("home.game", EXPLANATION_HOME_SECTIONS, "en"),
  active: true,
  createdAtIso: "2026-05-22T00:00:00.000Z",
  createdByUserId: "system",
  updatedAtIso: "2026-05-22T00:00:00.000Z",
  updatedByUserId: "system"
};
var DEFAULT_EXPLANATION_HOME_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_HOME_REVISION), {
  id: "explanation-home-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Kezd\u0151lap k\xE1rty\xE1i",
  summary: "\xC9rt\xE9kel\xE9s, k\xE1rtyacsoportok \xE9s el\u0151zm\xE9nyek.",
  description: "Itt megtudhatod, hogyan \xE9rt\xE9kelj, \xE9s hogyan v\xE1laszd ki a megjelen\u0151 aj\xE1nl\xE1sokat.",
  sections: withSeededExplanationImages("home.game", EXPLANATION_HOME_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_ACTIVITY_RATES_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_HOME_REVISION), {
  id: "explanation-activity-rates-default-v1",
  contextKey: "activities.rates",
  title: "Activity ratings",
  summary: "Filter, arrange, and update rating cards.",
  description: "See which ratings can be changed and how each view works.",
  sections: withSeededExplanationImages("activities.rates", EXPLANATION_ACTIVITY_RATES_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_ACTIVITY_RATES_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_ACTIVITY_RATES_REVISION), {
  id: "explanation-activity-rates-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Aktivit\xE1si \xE9rt\xE9kel\xE9sek",
  summary: "\xC9rt\xE9kel\xE9sk\xE1rty\xE1k sz\u0171r\xE9se, rendez\xE9se \xE9s m\xF3dos\xEDt\xE1sa.",
  description: "Itt l\xE1thatod, mely \xE9rt\xE9kel\xE9sek m\xF3dos\xEDthat\xF3k, \xE9s mire val\xF3k a n\xE9zetek.",
  sections: withSeededExplanationImages("activities.rates", EXPLANATION_ACTIVITY_RATES_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_EVENTS_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_HOME_REVISION), {
  id: "explanation-events-default-v1",
  contextKey: "events",
  title: "Events",
  summary: "Find, join, create, and manage events.",
  description: "Learn what event cards show and which actions are available.",
  sections: withSeededExplanationImages("events", EXPLANATION_EVENTS_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_EVENTS_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_EVENTS_REVISION), {
  id: "explanation-events-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Esem\xE9nyek",
  summary: "Esem\xE9nyek keres\xE9se, csatlakoz\xE1s, l\xE9trehoz\xE1s \xE9s kezel\xE9s.",
  description: "Itt megtudhatod, mit mutat egy esem\xE9nyk\xE1rtya, \xE9s milyen m\u0171veletek \xE9rhet\u0151k el.",
  sections: withSeededExplanationImages("events", EXPLANATION_EVENTS_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_ASSETS_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_HOME_REVISION), {
  id: "explanation-assets-default-v1",
  contextKey: "assets",
  title: "Assets",
  summary: "Manage assets, requests, assignments, and tickets.",
  description: "Learn how asset cards, editing, requests, and visibility work.",
  sections: withSeededExplanationImages("assets", EXPLANATION_ASSETS_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_ASSETS_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_ASSETS_REVISION), {
  id: "explanation-assets-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Eszk\xF6z\xF6k",
  summary: "Eszk\xF6z\xF6k, k\xE9r\xE9sek, hozz\xE1rendel\xE9sek \xE9s jegyek kezel\xE9se.",
  description: "Itt megismerheted az eszk\xF6zk\xE1rty\xE1kat, a szerkeszt\xE9st, a k\xE9r\xE9seket \xE9s a l\xE1that\xF3s\xE1got.",
  sections: withSeededExplanationImages("assets", EXPLANATION_ASSETS_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_ASSETS_TRANSPORT_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_ASSETS_REVISION), {
  id: "explanation-assets-transport-default-v1",
  contextKey: "assets.transport",
  title: "Transport assets",
  summary: "Manage transport details, capacity, and requests.",
  description: "Learn how to add, edit, share, and assign transport assets.",
  sections: withSeededExplanationImages("assets.transport", EXPLANATION_ASSETS_TRANSPORT_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_ASSETS_TRANSPORT_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_ASSETS_TRANSPORT_REVISION), {
  id: "explanation-assets-transport-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "J\xE1rm\u0171vek",
  summary: "J\xE1rm\u0171adatok, kapacit\xE1s \xE9s k\xE9r\xE9sek kezel\xE9se.",
  description: "Itt megtudhatod, hogyan adj hozz\xE1, szerkessz, ossz meg \xE9s rendelj esem\xE9nyhez j\xE1rm\u0171vet.",
  sections: withSeededExplanationImages("assets.transport", EXPLANATION_ASSETS_TRANSPORT_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_ASSETS_ACCOMMODATION_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_ASSETS_REVISION), {
  id: "explanation-assets-accommodation-default-v1",
  contextKey: "assets.accommodation",
  title: "Accommodation assets",
  summary: "Manage places, capacity, location, and requests.",
  description: "Learn how to add, edit, share, and assign accommodation.",
  sections: withSeededExplanationImages("assets.accommodation", EXPLANATION_ASSETS_ACCOMMODATION_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_ASSETS_ACCOMMODATION_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_ASSETS_ACCOMMODATION_REVISION), {
  id: "explanation-assets-accommodation-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Sz\xE1ll\xE1sok",
  summary: "Helysz\xEDn, kapacit\xE1s \xE9s k\xE9r\xE9sek kezel\xE9se.",
  description: "Itt megtudhatod, hogyan adj hozz\xE1, szerkessz, ossz meg \xE9s rendelj esem\xE9nyhez sz\xE1ll\xE1st.",
  sections: withSeededExplanationImages("assets.accommodation", EXPLANATION_ASSETS_ACCOMMODATION_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_ASSETS_SUPPLIES_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_ASSETS_REVISION), {
  id: "explanation-assets-supplies-default-v1",
  contextKey: "assets.supplies",
  title: "Supply assets",
  summary: "Manage supplies, quantities, and requests.",
  description: "Learn how to add, edit, share, and assign supplies.",
  sections: withSeededExplanationImages("assets.supplies", EXPLANATION_ASSETS_SUPPLIES_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_ASSETS_SUPPLIES_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_ASSETS_SUPPLIES_REVISION), {
  id: "explanation-assets-supplies-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Kell\xE9kek",
  summary: "Kell\xE9kek, mennyis\xE9gek \xE9s k\xE9r\xE9sek kezel\xE9se.",
  description: "Itt megtudhatod, hogyan adj hozz\xE1, szerkessz, ossz meg \xE9s rendelj esem\xE9nyhez kell\xE9ket.",
  sections: withSeededExplanationImages("assets.supplies", EXPLANATION_ASSETS_SUPPLIES_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_ASSETS_TICKETS_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_ASSETS_REVISION), {
  id: "explanation-assets-tickets-default-v1",
  contextKey: "assets.tickets",
  title: "Event tickets",
  summary: "Open your ticket or check in an attendee.",
  description: "See how ticket QR codes, one-time check-in, and used-ticket status work.",
  sections: withSeededExplanationImages("assets.tickets", EXPLANATION_ASSETS_TICKETS_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_ASSETS_TICKETS_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_ASSETS_TICKETS_REVISION), {
  id: "explanation-assets-tickets-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Esem\xE9nyjegyek",
  summary: "Nyisd meg a jegyedet, vagy l\xE9ptess be egy r\xE9sztvev\u0151t.",
  description: "Itt megtudhatod, hogyan m\u0171k\xF6dik a QR-k\xF3d, az egyszeri bel\xE9ptet\xE9s \xE9s a felhaszn\xE1lt jegy jelz\xE9se.",
  sections: withSeededExplanationImages("assets.tickets", EXPLANATION_ASSETS_TICKETS_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_EVENT_EDITOR_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_HOME_REVISION), {
  id: "explanation-event-editor-default-v1",
  contextKey: "event.editor",
  title: "Event editor",
  summary: "Set event details, schedule, members, and resources.",
  description: "Learn which fields are required and where advanced options belong.",
  sections: withSeededExplanationImages("event.editor", EXPLANATION_EVENT_EDITOR_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_EVENT_EDITOR_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_EVENT_EDITOR_REVISION), {
  id: "explanation-event-editor-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Esem\xE9nyszerkeszt\u0151",
  summary: "Esem\xE9nyadatok, id\u0151pontok, tagok \xE9s er\u0151forr\xE1sok be\xE1ll\xEDt\xE1sa.",
  description: "Itt megtudhatod, mely mez\u0151k k\xF6telez\u0151k, \xE9s hol tal\xE1lod a tov\xE1bbi be\xE1ll\xEDt\xE1sokat.",
  sections: withSeededExplanationImages("event.editor", EXPLANATION_EVENT_EDITOR_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_CHATS_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_HOME_REVISION), {
  id: "explanation-chats-default-v1",
  contextKey: "chats",
  title: "Chats",
  summary: "Find conversations, send messages, and use chat tools.",
  description: "Learn what each channel is for and which message actions are available.",
  sections: withSeededExplanationImages("chats", EXPLANATION_CHATS_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_CHATS_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_CHATS_REVISION), {
  id: "explanation-chats-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Besz\xE9lget\xE9sek",
  summary: "Besz\xE9lget\xE9sek keres\xE9se, \xFCzenetk\xFCld\xE9s \xE9s tov\xE1bbi eszk\xF6z\xF6k.",
  description: "Itt megtudhatod, mire val\xF3k a csatorn\xE1k, \xE9s milyen \xFCzenetm\u0171veletek \xE9rhet\u0151k el.",
  sections: withSeededExplanationImages("chats", EXPLANATION_CHATS_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_CONTACTS_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_HOME_REVISION), {
  id: "explanation-contacts-default-v1",
  contextKey: "contacts",
  title: "Contacts",
  summary: "Save people and manage contact shortcuts.",
  description: "Learn how contact cards and saved contact methods work.",
  sections: withSeededExplanationImages("contacts", EXPLANATION_CONTACTS_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_CONTACTS_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_CONTACTS_REVISION), {
  id: "explanation-contacts-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Kapcsolatok",
  summary: "Emberek ment\xE9se \xE9s el\xE9r\xE9si gyorsgombok kezel\xE9se.",
  description: "Itt megtudhatod, hogyan m\u0171k\xF6dnek a kapcsolatk\xE1rty\xE1k \xE9s a mentett el\xE9r\xE9si m\xF3dok.",
  sections: withSeededExplanationImages("contacts", EXPLANATION_CONTACTS_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_PROFILE_EDITOR_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_HOME_REVISION), {
  id: "explanation-profile-editor-default-v1",
  contextKey: "profile.editor",
  title: "Profile editor",
  summary: "Edit profile details, photos, visibility, and experience.",
  description: "Learn which details are required and how to save your profile.",
  sections: withSeededExplanationImages("profile.editor", EXPLANATION_PROFILE_EDITOR_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_PROFILE_EDITOR_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_PROFILE_EDITOR_REVISION), {
  id: "explanation-profile-editor-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Profilszerkeszt\u0151",
  summary: "Profiladatok, k\xE9pek, l\xE1that\xF3s\xE1g \xE9s tapasztalatok szerkeszt\xE9se.",
  description: "Itt megtudhatod, mely adatok k\xF6telez\u0151k, \xE9s hogyan mentsd el a profilodat.",
  sections: withSeededExplanationImages("profile.editor", EXPLANATION_PROFILE_EDITOR_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_PROFILE_VIEW_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_HOME_REVISION), {
  id: "explanation-profile-view-default-v1",
  contextKey: "profile.view",
  title: "Profile view",
  summary: "Browse photos, profile details, and experience.",
  description: "Learn what this read-only profile screen shows.",
  sections: withSeededExplanationImages("profile.view", EXPLANATION_PROFILE_VIEW_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_PROFILE_VIEW_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_PROFILE_VIEW_REVISION), {
  id: "explanation-profile-view-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Profiln\xE9zet",
  summary: "K\xE9pek, profiladatok \xE9s tapasztalatok megtekint\xE9se.",
  description: "Itt megtudhatod, mit mutat ez a csak olvashat\xF3 profilk\xE9perny\u0151.",
  sections: withSeededExplanationImages("profile.view", EXPLANATION_PROFILE_VIEW_SECTIONS_HU, "hu")
});
var DEFAULT_EXPLANATION_EVENT_FEEDBACK_REVISION = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_HOME_REVISION), {
  id: "explanation-event-feedback-default-v1",
  contextKey: "event.feedback",
  title: "Event feedback",
  summary: "Submit feedback and review event results.",
  description: "Learn how feedback lists, answer cards, and organizer results work.",
  sections: withSeededExplanationImages("event.feedback", EXPLANATION_EVENT_FEEDBACK_SECTIONS, "en")
});
var DEFAULT_EXPLANATION_EVENT_FEEDBACK_REVISION_HU = __spreadProps(__spreadValues({}, DEFAULT_EXPLANATION_EVENT_FEEDBACK_REVISION), {
  id: "explanation-event-feedback-default-hu-v1",
  lang: "hu",
  languageLabel: "Magyar",
  title: "Esem\xE9ny-visszajelz\xE9s",
  summary: "Visszajelz\xE9s bek\xFCld\xE9se \xE9s az eredm\xE9nyek \xE1ttekint\xE9se.",
  description: "Itt megismerheted a visszajelz\xE9si list\xE1kat, a v\xE1laszk\xE1rty\xE1kat \xE9s a szervez\u0151i eredm\xE9nyeket.",
  sections: withSeededExplanationImages("event.feedback", EXPLANATION_EVENT_FEEDBACK_SECTIONS_HU, "hu")
});
var APP_STATIC_DATA = {
  vibeCategories: VIBE_CATEGORIES,
  hostedEventTypes: HOSTED_EVENT_TYPES,
  vibeIcons: VIBE_ICONS,
  categoryIcons: CATEGORY_ICONS,
  memberTraitIcons: MEMBER_TRAIT_ICONS,
  navigatorHostTierPresenters: NAVIGATOR_HOST_TIER_PRESENTERS,
  navigatorHostTierPresenterDefault: NAVIGATOR_HOST_TIER_PRESENTER_DEFAULT,
  navigatorTraitPresenters: NAVIGATOR_TRAIT_PRESENTERS,
  navigatorMemberImpressionTitlePresenters: NAVIGATOR_MEMBER_IMPRESSION_TITLE_PRESENTERS,
  navigatorTraitPresenterDefault: NAVIGATOR_TRAIT_PRESENTER_DEFAULT,
  personalityTraitCatalog: PERSONALITY_TRAIT_CATALOG,
  physiqueOptions: PHYSIQUE_OPTIONS,
  languageSuggestions: LANGUAGE_SUGGESTIONS,
  activitiesPrimaryFilters: ACTIVITIES_PRIMARY_FILTERS,
  activitiesSecondaryFilters: ACTIVITIES_SECONDARY_FILTERS,
  activitiesChatContextFilters: ACTIVITIES_CHAT_CONTEXT_FILTERS,
  rateFilters: RATE_FILTERS,
  rateFilterEntries: RATE_FILTER_ENTRIES,
  activitiesViewOptions: ACTIVITIES_VIEW_OPTIONS,
  eventExploreOrderOptions: EVENT_EXPLORE_ORDER_OPTIONS,
  homeGameFilterInterestGroups: HOME_GAME_FILTER_INTEREST_GROUPS,
  homeGameFilterValuesGroups: HOME_GAME_FILTER_VALUES_GROUPS,
  homeUserFacetById: HOME_USER_FACET_BY_ID,
  profileStatusOptions: PROFILE_STATUS_OPTIONS,
  contentLanguages: CONTENT_LANGUAGES,
  helpCenterHeaderColors: HELP_CENTER_HEADER_COLORS,
  helpCenterHeaderColorOptions: HELP_CENTER_HEADER_COLOR_OPTIONS,
  documentViewerHeaderPalettes: DOCUMENT_VIEWER_HEADER_PALETTES,
  explainableSurfaces: EXPLAINABLE_SURFACES,
  profileDetailValueOptions: PROFILE_DETAIL_VALUE_OPTIONS,
  profileDetailGroupTemplates: PROFILE_DETAIL_GROUP_TEMPLATES,
  beliefsValuesOptionGroups: BELIEFS_VALUES_OPTION_GROUPS,
  interestOptionGroups: INTEREST_OPTION_GROUPS,
  detailPrivacyOptions: DETAIL_PRIVACY_OPTIONS,
  experienceFilterOptions: EXPERIENCE_FILTER_OPTIONS,
  experienceTypeOptions: EXPERIENCE_TYPE_OPTIONS,
  profileSampleExperienceEntries: PROFILE_SAMPLE_EXPERIENCE_ENTRIES,
  assetTypeOptions: ASSET_TYPE_OPTIONS,
  assetFilterOptions: ASSET_FILTER_OPTIONS,
  assetTypeLabels: ASSET_TYPE_LABELS,
  assetCategoryOptionsByType: ASSET_CATEGORY_OPTIONS_BY_TYPE2,
  activityRatingScale: ACTIVITY_RATING_SCALE,
  calendarWeekdayLabels: CALENDAR_WEEKDAY_LABELS,
  calendarWeekdayOptions: CALENDAR_WEEKDAY_OPTIONS,
  scheduleFrequencyOptions: SCHEDULE_FREQUENCY_OPTIONS,
  eventVisibilityOptions: EVENT_VISIBILITY_OPTIONS,
  eventBlindModeOptions: EVENT_BLIND_MODE_OPTIONS,
  subEventResourceFilterOptions: SUB_EVENT_RESOURCE_FILTER_OPTIONS,
  subEventResourceFilterLabels: SUB_EVENT_RESOURCE_FILTER_LABELS,
  modeOptions: EVENT_MODE_OPTIONS,
  tournamentLeaderboardTypeOptions: TOURNAMENT_LEADERBOARD_TYPE_OPTIONS,
  activityGroupLabels: ACTIVITY_GROUP_LABELS,
  activityMemberMetPlaces: ACTIVITY_MEMBER_MET_PLACES,
  activityMemberDefaults: ACTIVITY_MEMBER_DEFAULTS,
  reportUserReasons: REPORT_USER_REASONS,
  feedbackCategories: FEEDBACK_CATEGORIES,
  eventFeedbackEventOverallOptions: EVENT_FEEDBACK_EVENT_OVERALL_OPTIONS,
  eventFeedbackHostImproveOptions: EVENT_FEEDBACK_HOST_IMPROVE_OPTIONS,
  eventFeedbackAttendeeCollabOptions: EVENT_FEEDBACK_ATTENDEE_COLLAB_OPTIONS,
  eventFeedbackAttendeeRejoinOptions: EVENT_FEEDBACK_ATTENDEE_REJOIN_OPTIONS,
  eventFeedbackPersonalityTraitOptions: EVENT_FEEDBACK_PERSONALITY_TRAIT_OPTIONS,
  eventFeedbackListFilters: EVENT_FEEDBACK_LIST_FILTER_OPTIONS,
  helpCenterSections: HELP_CENTER_SECTIONS,
  helpCenterSectionsByLang: {
    en: HELP_CENTER_SECTIONS,
    hu: HELP_CENTER_SECTIONS_HU
  },
  privacyCenterSections: PRIVACY_CENTER_SECTIONS,
  privacyCenterSectionsByLang: {
    en: PRIVACY_CENTER_SECTIONS,
    hu: PRIVACY_CENTER_SECTIONS_HU
  },
  termsCenterSections: TERMS_CENTER_SECTIONS,
  termsCenterSectionsByLang: {
    en: TERMS_CENTER_SECTIONS,
    hu: TERMS_CENTER_SECTIONS_HU
  },
  defaultHelpCenterDescription: DEFAULT_HELP_CENTER_DESCRIPTION,
  defaultPrivacyCenterDescription: DEFAULT_PRIVACY_CENTER_DESCRIPTION,
  defaultTermsCenterDescription: DEFAULT_TERMS_CENTER_DESCRIPTION,
  defaultHelpCenterRevision: DEFAULT_HELP_CENTER_REVISION,
  defaultHelpCenterRevisionsByLang: {
    en: DEFAULT_HELP_CENTER_REVISION,
    hu: DEFAULT_HELP_CENTER_REVISION_HU
  },
  defaultPrivacyCenterRevision: DEFAULT_PRIVACY_CENTER_REVISION,
  defaultPrivacyCenterRevisionsByLang: {
    en: DEFAULT_PRIVACY_CENTER_REVISION,
    hu: DEFAULT_PRIVACY_CENTER_REVISION_HU
  },
  defaultTermsCenterRevision: DEFAULT_TERMS_CENTER_REVISION,
  defaultTermsCenterRevisionsByLang: {
    en: DEFAULT_TERMS_CENTER_REVISION,
    hu: DEFAULT_TERMS_CENTER_REVISION_HU
  },
  defaultExplanationHomeRevision: DEFAULT_EXPLANATION_HOME_REVISION,
  defaultExplanationHomeRevisionsByLang: {
    en: DEFAULT_EXPLANATION_HOME_REVISION,
    hu: DEFAULT_EXPLANATION_HOME_REVISION_HU
  },
  defaultExplanationRevisionsByContext: {
    "home.game": {
      en: DEFAULT_EXPLANATION_HOME_REVISION,
      hu: DEFAULT_EXPLANATION_HOME_REVISION_HU
    },
    "activities.rates": {
      en: DEFAULT_EXPLANATION_ACTIVITY_RATES_REVISION,
      hu: DEFAULT_EXPLANATION_ACTIVITY_RATES_REVISION_HU
    },
    chats: {
      en: DEFAULT_EXPLANATION_CHATS_REVISION,
      hu: DEFAULT_EXPLANATION_CHATS_REVISION_HU
    },
    "profile.editor": {
      en: DEFAULT_EXPLANATION_PROFILE_EDITOR_REVISION,
      hu: DEFAULT_EXPLANATION_PROFILE_EDITOR_REVISION_HU
    },
    "profile.view": {
      en: DEFAULT_EXPLANATION_PROFILE_VIEW_REVISION,
      hu: DEFAULT_EXPLANATION_PROFILE_VIEW_REVISION_HU
    },
    contacts: {
      en: DEFAULT_EXPLANATION_CONTACTS_REVISION,
      hu: DEFAULT_EXPLANATION_CONTACTS_REVISION_HU
    },
    assets: {
      en: DEFAULT_EXPLANATION_ASSETS_REVISION,
      hu: DEFAULT_EXPLANATION_ASSETS_REVISION_HU
    },
    "assets.transport": {
      en: DEFAULT_EXPLANATION_ASSETS_TRANSPORT_REVISION,
      hu: DEFAULT_EXPLANATION_ASSETS_TRANSPORT_REVISION_HU
    },
    "assets.accommodation": {
      en: DEFAULT_EXPLANATION_ASSETS_ACCOMMODATION_REVISION,
      hu: DEFAULT_EXPLANATION_ASSETS_ACCOMMODATION_REVISION_HU
    },
    "assets.supplies": {
      en: DEFAULT_EXPLANATION_ASSETS_SUPPLIES_REVISION,
      hu: DEFAULT_EXPLANATION_ASSETS_SUPPLIES_REVISION_HU
    },
    "assets.tickets": {
      en: DEFAULT_EXPLANATION_ASSETS_TICKETS_REVISION,
      hu: DEFAULT_EXPLANATION_ASSETS_TICKETS_REVISION_HU
    },
    events: {
      en: DEFAULT_EXPLANATION_EVENTS_REVISION,
      hu: DEFAULT_EXPLANATION_EVENTS_REVISION_HU
    },
    "event.editor": {
      en: DEFAULT_EXPLANATION_EVENT_EDITOR_REVISION,
      hu: DEFAULT_EXPLANATION_EVENT_EDITOR_REVISION_HU
    },
    "event.feedback": {
      en: DEFAULT_EXPLANATION_EVENT_FEEDBACK_REVISION,
      hu: DEFAULT_EXPLANATION_EVENT_FEEDBACK_REVISION_HU
    }
  },
  seededExplanationImageRefPrefix: SEEDED_EXPLANATION_IMAGE_REF_PREFIX,
  seededExplanationImageAssetRoot: SEEDED_EXPLANATION_IMAGE_ASSET_ROOT
};

// src/app/shared/core/base/builders/activity-members.builder.ts
var ActivityMembersBuilder = class {
  static buildActivityMembersSummary(owner, members, capacityTotal) {
    const acceptedMemberUserIds = members.filter((member) => member.status === "accepted").map((member) => member.userId);
    const pendingMemberUserIds = members.filter((member) => member.status === "pending").map((member) => member.userId);
    return {
      ownerType: owner.ownerType,
      ownerId: owner.ownerId,
      acceptedMembers: acceptedMemberUserIds.length,
      pendingMembers: pendingMemberUserIds.length,
      capacityTotal: Math.max(acceptedMemberUserIds.length, capacityTotal),
      acceptedMemberUserIds,
      pendingMemberUserIds
    };
  }
  static toActivityMemberDTO(user, row, rowKey, activeUserId, defaults, metPlaces = APP_STATIC_DATA.activityMemberMetPlaces) {
    const seed = AppUtils.hashText(`${rowKey}:${user.id}`);
    const metAt = AppUtils.addDays(/* @__PURE__ */ new Date("2026-02-24T12:00:00"), -(seed % 220 + 1));
    const place = metPlaces.length > 0 ? metPlaces[seed % metPlaces.length] : APP_STATIC_DATA.activityMemberDefaults.forcedMetWhere;
    return {
      id: `${rowKey}:${user.id}`,
      userId: user.id,
      name: user.name,
      initials: user.initials,
      gender: user.gender,
      city: user.city,
      statusText: user.statusText,
      role: row.isAdmin && user.id === activeUserId ? "Admin" : "Member",
      status: defaults.status,
      pendingSource: defaults.pendingSource,
      requestKind: defaults.status === "pending" ? "invite" : null,
      invitedByActiveUser: defaults.invitedByActiveUser,
      metAtIso: AppUtils.toIsoDateTime(metAt),
      actionAtIso: AppUtils.toIsoDateTime(metAt),
      metWhere: place,
      avatarUrl: AppUtils.firstImageUrl(user.images),
      profile: user
    };
  }
  static sortActivityMembersByActionTimeDesc(entries) {
    return [...entries].sort((a, b) => AppUtils.toSortableDate(b.actionAtIso) - AppUtils.toSortableDate(a.actionAtIso));
  }
  static sortActivityMembersByActionTimeAsc(entries) {
    return [...entries].sort((a, b) => AppUtils.toSortableDate(a.actionAtIso) - AppUtils.toSortableDate(b.actionAtIso));
  }
};

// src/app/shared/core/base/builders/pricing.builder.ts
var PricingBuilder = class {
  static createDefaultPricingConfig(context = "event") {
    return {
      enabled: false,
      mode: "fixed",
      basePrice: 0,
      currency: "USD",
      taxMode: "excluded",
      chargeType: "per_attendee",
      quantityRulesEnabled: false,
      quantityRules: [],
      minPrice: null,
      maxPrice: null,
      rounding: "none",
      demandRulesEnabled: false,
      demandRules: [],
      timeRulesEnabled: false,
      timeRules: [],
      cancellationPolicy: {
        enabled: false,
        rules: []
      },
      slotPricingEnabled: false,
      slotOverrides: [],
      audience: {
        enabled: false,
        memberPrice: null,
        vipPrice: null,
        inviteOnlyDiscountPercent: null,
        promoCodes: [],
        soldOutLabel: 'Show "Sold Out"'
      }
    };
  }
  static clonePricingConfig(pricing) {
    const normalized = pricing ?? this.createDefaultPricingConfig();
    return __spreadProps(__spreadValues({}, normalized), {
      quantityRules: (normalized.quantityRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), {
        action: __spreadValues({}, rule.action)
      })),
      demandRules: (normalized.demandRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), {
        action: __spreadValues({}, rule.action),
        slotIds: [...rule.slotIds ?? []]
      })),
      timeRules: (normalized.timeRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), {
        action: __spreadValues({}, rule.action),
        slotIds: [...rule.slotIds ?? []]
      })),
      cancellationPolicy: {
        enabled: normalized.cancellationPolicy?.enabled === true,
        rules: (normalized.cancellationPolicy?.rules ?? []).map((rule) => __spreadValues({}, rule))
      },
      slotOverrides: (normalized.slotOverrides ?? []).map((item) => __spreadValues({}, item)),
      audience: __spreadProps(__spreadValues({}, normalized.audience), {
        promoCodes: (normalized.audience?.promoCodes ?? []).map((code) => __spreadProps(__spreadValues({}, code), {
          action: __spreadValues({}, code.action)
        }))
      })
    });
  }
  static normalizePricingConfig(value, options = {}) {
    const context = options.context ?? "event";
    const allowSlotFeatures = options.allowSlotFeatures ?? context === "event";
    const slotCatalog = allowSlotFeatures ? options.slotCatalog ?? [] : [];
    const fallback = this.createDefaultPricingConfig(context);
    const source = typeof value === "object" && value !== null ? value : {};
    const audienceSource = typeof source["audience"] === "object" && source["audience"] !== null ? source["audience"] : {};
    const normalized = {
      enabled: this.normalizeBoolean(source["enabled"], this.hasMeaningfulPricingContent(source)),
      mode: this.normalizeMode(source["mode"]),
      basePrice: this.normalizeMoney(source["basePrice"] ?? source["amount"]) ?? fallback.basePrice,
      currency: this.normalizeCurrency(source["currency"]) || fallback.currency,
      taxMode: this.normalizeTaxMode(source["taxMode"]) ?? fallback.taxMode,
      chargeType: this.normalizeChargeType(source["chargeType"]) ?? fallback.chargeType,
      quantityRulesEnabled: this.normalizeBoolean(source["quantityRulesEnabled"], Array.isArray(source["quantityRules"]) && source["quantityRules"].length > 0),
      quantityRules: this.normalizeQuantityRules(source["quantityRules"]),
      minPrice: this.normalizeMoney(source["minPrice"]),
      maxPrice: this.normalizeMoney(source["maxPrice"]),
      rounding: this.normalizeRounding(source["rounding"]) ?? fallback.rounding,
      demandRulesEnabled: this.normalizeBoolean(source["demandRulesEnabled"], Array.isArray(source["demandRules"]) && source["demandRules"].length > 0),
      demandRules: this.normalizeDemandRules(source["demandRules"]),
      timeRulesEnabled: this.normalizeBoolean(source["timeRulesEnabled"], Array.isArray(source["timeRules"]) && source["timeRules"].length > 0),
      timeRules: this.normalizeTimeRules(source["timeRules"]),
      cancellationPolicy: this.normalizeCancellationPolicy(source["cancellationPolicy"]),
      slotPricingEnabled: this.normalizeBoolean(source["slotPricingEnabled"], Array.isArray(source["slotOverrides"]) && source["slotOverrides"].length > 0),
      slotOverrides: this.normalizeSlotOverrides(source["slotOverrides"]),
      audience: {
        enabled: this.normalizeBoolean(audienceSource["enabled"], Array.isArray(audienceSource["promoCodes"]) && audienceSource["promoCodes"].length > 0),
        memberPrice: this.normalizeMoney(audienceSource["memberPrice"]),
        vipPrice: this.normalizeMoney(audienceSource["vipPrice"]),
        inviteOnlyDiscountPercent: this.normalizePercent(audienceSource["inviteOnlyDiscountPercent"]),
        promoCodes: this.normalizePromoCodes(audienceSource["promoCodes"], options.preserveEmptyPromoCodes === true),
        soldOutLabel: this.normalizeText(audienceSource["soldOutLabel"]) || fallback.audience.soldOutLabel
      }
    };
    const allowedChargeTypes = this.allowedChargeTypesForContext(context, allowSlotFeatures, options.allowedChargeTypes);
    normalized.chargeType = allowedChargeTypes.includes(normalized.chargeType) ? normalized.chargeType : allowedChargeTypes[0] ?? fallback.chargeType;
    const slotCatalogIds = new Set(slotCatalog.map((item) => this.normalizeText(item.id)).filter((item) => item.length > 0));
    normalized.demandRules = normalized.demandRules.map((rule) => this.sanitizeRuleScope(rule, slotCatalogIds, allowSlotFeatures));
    normalized.timeRules = normalized.timeRules.map((rule) => this.sanitizeRuleScope(rule, slotCatalogIds, allowSlotFeatures));
    if (!allowSlotFeatures || slotCatalogIds.size === 0) {
      normalized.slotPricingEnabled = false;
      normalized.slotOverrides = [];
    }
    if (normalized.maxPrice !== null && normalized.minPrice !== null && normalized.maxPrice < normalized.minPrice) {
      normalized.maxPrice = normalized.minPrice;
    }
    return this.syncSlotOverrides(normalized, slotCatalog);
  }
  static compactPricingConfig(pricing, options = {}) {
    return this.normalizePricingConfig(pricing, __spreadProps(__spreadValues({}, options), {
      preserveEmptyPromoCodes: false
    }));
  }
  static syncSlotOverrides(pricing, slotCatalog = []) {
    const next = this.clonePricingConfig(pricing);
    const catalogById = new Map(slotCatalog.map((item) => [this.normalizeText(item.id), item]).filter((entry) => Boolean(entry[0])));
    next.slotOverrides = next.slotOverrides.map((item, index) => {
      const slotId = this.normalizeText(item.slotId);
      const linked = slotId ? catalogById.get(slotId) ?? null : null;
      const label = linked?.label?.trim() || this.normalizeText(item.label) || `Slot ${index + 1}`;
      return __spreadProps(__spreadValues({}, item), {
        id: this.normalizeText(item.id) || `slot-override-${index + 1}`,
        slotId: slotId || null,
        label,
        startAt: linked?.startAt ?? item.startAt ?? null,
        endAt: linked?.endAt ?? item.endAt ?? null,
        currency: this.normalizeCurrency(item.currency) || next.currency,
        price: this.normalizeMoney(item.price)
      });
    }).filter((item, index, source) => source.findIndex((candidate) => candidate.id === item.id) === index);
    return next;
  }
  static resolveAssetBorrowPricing(options) {
    const normalized = this.compactPricingConfig(options.pricing, {
      context: "asset",
      allowSlotFeatures: false
    });
    const currency = normalized.currency?.trim() || "USD";
    if (!normalized.enabled) {
      return {
        amount: 0,
        currency,
        rows: []
      };
    }
    const totalQuantity = Math.max(1, Math.trunc(Number(options.totalQuantity) || 1));
    const requestedQuantity = Math.max(1, Math.trunc(Number(options.requestedQuantity) || 1));
    const overlappingCommitted = (options.requests ?? []).filter((request) => request.status === "accepted" || request.requestKind === "manual").filter((request) => request.booking?.inventoryApplied !== true).filter((request) => this.isPricingWindowOverlap(request, options.startAtIso, options.endAtIso)).reduce((sum, request) => sum + this.assetRequestQuantity(request), 0);
    const capacityFilledPercent = Math.round(Math.min(totalQuantity, overlappingCommitted + requestedQuantity) / totalQuantity * 100);
    const hoursUntilStart = this.resolveHoursUntilStart(options.startAtIso);
    const billableDays = this.resolveAssetBorrowBillableDays(options.startAtIso, options.endAtIso);
    const rows = [{
      key: "base",
      label: "pricing.asset.daily.rate",
      detail: null,
      amount: normalized.basePrice,
      currency,
      multiplier: 1
    }];
    let nextPrice = normalized.basePrice;
    if (normalized.quantityRulesEnabled) {
      for (const rule of normalized.quantityRules) {
        if (requestedQuantity < rule.minQuantity) {
          continue;
        }
        const previousPrice = nextPrice;
        nextPrice = this.applyPricingAction(nextPrice, rule.action);
        rows.push({
          key: `quantity-rule:${rule.id}`,
          label: "pricing.quantity.adjustment",
          detail: `${rule.minQuantity}+ \xB7 ${this.describePricingAction(rule.action)}`,
          amount: this.roundMoney(nextPrice - previousPrice),
          currency,
          multiplier: 1
        });
      }
    }
    if ((normalized.mode === "demand-based" || normalized.mode === "hybrid") && normalized.demandRulesEnabled) {
      for (const rule of normalized.demandRules) {
        if (this.matchesPricingDemandRule(rule, capacityFilledPercent)) {
          const previousPrice = nextPrice;
          nextPrice = this.applyPricingAction(nextPrice, rule.action);
          rows.push({
            key: `demand:${rule.id}`,
            label: "pricing.demand.adjustment",
            detail: `${capacityFilledPercent}% \xB7 ${this.describePricingAction(rule.action)}`,
            amount: this.roundMoney(nextPrice - previousPrice),
            currency,
            multiplier: 1
          });
        }
      }
    }
    if ((normalized.mode === "time-based" || normalized.mode === "hybrid") && normalized.timeRulesEnabled) {
      for (const rule of normalized.timeRules) {
        if (this.matchesPricingTimeRule(rule, hoursUntilStart, options.startAtIso)) {
          const previousPrice = nextPrice;
          nextPrice = this.applyPricingAction(nextPrice, rule.action);
          rows.push({
            key: `time:${rule.id}`,
            label: "pricing.time.adjustment",
            detail: `${this.describePricingTimeCondition(rule)} \xB7 ${this.describePricingAction(rule.action)}`,
            amount: this.roundMoney(nextPrice - previousPrice),
            currency,
            multiplier: 1
          });
        }
      }
    }
    if (normalized.minPrice !== null) {
      const previousPrice = nextPrice;
      nextPrice = Math.max(normalized.minPrice, nextPrice);
      if (nextPrice !== previousPrice) {
        rows.push({
          key: "min-price",
          label: "pricing.minimum",
          detail: null,
          amount: this.roundMoney(nextPrice - previousPrice),
          currency,
          multiplier: 1
        });
      }
    }
    if (normalized.maxPrice !== null) {
      const previousPrice = nextPrice;
      nextPrice = Math.min(normalized.maxPrice, nextPrice);
      if (nextPrice !== previousPrice) {
        rows.push({
          key: "max-price",
          label: "pricing.maximum",
          detail: null,
          amount: this.roundMoney(nextPrice - previousPrice),
          currency,
          multiplier: 1
        });
      }
    }
    const roundedUnitPrice = this.applyPricingRounding(nextPrice, normalized.rounding);
    if (roundedUnitPrice !== nextPrice) {
      rows.push({
        key: "rounding",
        label: "pricing.rounding",
        detail: null,
        amount: this.roundMoney(roundedUnitPrice - nextPrice),
        currency,
        multiplier: 1
      });
    }
    const durationPrice = this.roundMoney(roundedUnitPrice * billableDays);
    if (billableDays > 1) {
      rows.push({
        key: "duration",
        label: "pricing.asset.billed.duration",
        detail: null,
        amount: this.roundMoney(roundedUnitPrice * (billableDays - 1)),
        currency,
        multiplier: billableDays
      });
    }
    const quantityMultiplier = normalized.chargeType === "per_attendee" ? requestedQuantity : 1;
    if (quantityMultiplier > 1) {
      rows.push({
        key: "quantity",
        label: "pricing.asset.items",
        detail: null,
        amount: this.roundMoney(durationPrice * (quantityMultiplier - 1)),
        currency,
        multiplier: quantityMultiplier
      });
    }
    return {
      amount: this.roundMoney(durationPrice * quantityMultiplier),
      currency,
      rows
    };
  }
  static matchesPricingDemandRule(rule, capacityFilledPercent) {
    if (rule.operator === "lte") {
      return capacityFilledPercent <= rule.capacityFilledPercent;
    }
    return capacityFilledPercent >= rule.capacityFilledPercent;
  }
  static matchesPricingTimeRule(rule, hoursUntilStart, comparisonIso) {
    if (rule.trigger === "specific_date") {
      const start = `${rule.specificDateStart ?? ""}`.trim();
      const end = `${rule.specificDateEnd ?? ""}`.trim();
      if (!start || !end || !comparisonIso) {
        return false;
      }
      const comparisonDate = comparisonIso.slice(0, 10);
      return comparisonDate >= start && comparisonDate <= end;
    }
    if (rule.trigger === "hours_before_start") {
      return hoursUntilStart <= Math.max(0, Number(rule.offsetValue) || 0);
    }
    const dayWindowHours = Math.max(0, Number(rule.offsetValue) || 0) * 24;
    return hoursUntilStart <= dayWindowHours;
  }
  static applyPricingAction(currentPrice, action) {
    const value = Number(action.value) || 0;
    if (action.kind === "set_exact_price") {
      return Math.max(0, value);
    }
    if (action.kind === "increase_amount") {
      return Math.max(0, currentPrice + value);
    }
    if (action.kind === "decrease_amount") {
      return Math.max(0, currentPrice - value);
    }
    const percent = value / 100;
    if (action.kind === "decrease_percent") {
      return Math.max(0, currentPrice * (1 - percent));
    }
    return Math.max(0, currentPrice * (1 + percent));
  }
  static describePricingAction(action) {
    const value = Math.max(0, Number(action.value) || 0);
    switch (action.kind) {
      case "set_exact_price":
        return `= ${value}`;
      case "increase_amount":
        return `+${value}`;
      case "decrease_amount":
        return `-${value}`;
      case "decrease_percent":
        return `-${value}%`;
      default:
        return `+${value}%`;
    }
  }
  static describePricingTimeCondition(rule) {
    if (rule.trigger === "specific_date") {
      return `${rule.specificDateStart ?? ""} \u2013 ${rule.specificDateEnd ?? ""}`.trim();
    }
    const value = Math.max(0, Number(rule.offsetValue) || 0);
    return rule.trigger === "hours_before_start" ? `\u2264 ${value}h` : `\u2264 ${value}d`;
  }
  static roundMoney(value) {
    return Math.round(value * 100) / 100;
  }
  static applyPricingRounding(price, rounding) {
    if (rounding === "whole") {
      return Math.round(price);
    }
    if (rounding === "half") {
      return Math.round(price * 2) / 2;
    }
    return Math.round(price * 100) / 100;
  }
  static resolveHoursUntilStart(startAtIso) {
    const start = AppUtils.isoLocalDateTimeToDate(startAtIso);
    if (!start) {
      return 0;
    }
    return Math.max(0, Math.round((start.getTime() - Date.now()) / (60 * 60 * 1e3)));
  }
  static resolveAssetBorrowBillableDays(startAtIso, endAtIso) {
    const start = AppUtils.isoLocalDateTimeToDate(startAtIso);
    const end = AppUtils.isoLocalDateTimeToDate(endAtIso);
    if (!start || !end || end.getTime() <= start.getTime()) {
      return 1;
    }
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1e3)));
  }
  static assetRequestQuantity(request) {
    return Math.max(1, Math.trunc(Number(request.booking?.quantity) || 0));
  }
  static isPricingWindowOverlap(request, startAtIso, endAtIso) {
    const requestStart = this.parseLocalDateMs(request.booking?.startAtIso);
    const requestEnd = this.parseLocalDateMs(request.booking?.endAtIso);
    const windowStart = this.parseLocalDateMs(startAtIso);
    const windowEnd = this.parseLocalDateMs(endAtIso);
    if (requestStart !== null && requestEnd !== null && windowStart !== null && windowEnd !== null) {
      return requestStart < windowEnd && windowStart < requestEnd;
    }
    const requestWindow = [
      `${request.booking?.eventId ?? ""}`.trim(),
      `${request.booking?.subEventId ?? ""}`.trim(),
      `${request.booking?.slotKey ?? ""}`.trim(),
      `${request.booking?.timeframe ?? ""}`.trim()
    ].filter(Boolean).join("|");
    const targetWindow = [startAtIso.trim(), endAtIso.trim()].filter(Boolean).join("|");
    if (requestWindow && targetWindow) {
      return requestWindow === targetWindow;
    }
    return true;
  }
  static parseLocalDateMs(value) {
    const parsed = AppUtils.isoLocalDateTimeToDate(`${value ?? ""}`.trim());
    return parsed ? parsed.getTime() : null;
  }
  static hasMeaningfulPricingContent(source) {
    const basePrice = this.normalizeMoney(source["basePrice"] ?? source["amount"]) ?? 0;
    const quantityRules = Array.isArray(source["quantityRules"]) ? source["quantityRules"].length : 0;
    const demandRules = Array.isArray(source["demandRules"]) ? source["demandRules"].length : 0;
    const timeRules = Array.isArray(source["timeRules"]) ? source["timeRules"].length : 0;
    const slotOverrides = Array.isArray(source["slotOverrides"]) ? source["slotOverrides"].length : 0;
    const cancellationPolicySource = typeof source["cancellationPolicy"] === "object" && source["cancellationPolicy"] !== null ? source["cancellationPolicy"] : {};
    const cancellationRules = Array.isArray(cancellationPolicySource["rules"]) ? cancellationPolicySource["rules"].length : 0;
    const audienceSource = typeof source["audience"] === "object" && source["audience"] !== null ? source["audience"] : {};
    const promoCodes = Array.isArray(audienceSource["promoCodes"]) ? audienceSource["promoCodes"].length : 0;
    const memberPrice = this.normalizeMoney(audienceSource["memberPrice"]);
    const vipPrice = this.normalizeMoney(audienceSource["vipPrice"]);
    const inviteOnlyDiscount = this.normalizePercent(audienceSource["inviteOnlyDiscountPercent"]);
    return basePrice > 0 || demandRules > 0 || quantityRules > 0 || timeRules > 0 || cancellationRules > 0 || slotOverrides > 0 || promoCodes > 0 || memberPrice !== null || vipPrice !== null || inviteOnlyDiscount !== null;
  }
  static slotOverrideFromReference(reference, price = null, currency = "USD") {
    return {
      id: `slot-override-${reference.id}`,
      slotId: reference.id,
      label: reference.label,
      startAt: reference.startAt ?? null,
      endAt: reference.endAt ?? null,
      price,
      currency
    };
  }
  static slotCatalogFromEventSlotTemplates(slots) {
    return slots.map((slot, index) => ({
      id: `${slot.id ?? `slot-${index + 1}`}`.trim() || `slot-${index + 1}`,
      label: `Slot ${index + 1}`,
      startAt: `${slot.startAt ?? ""}`.trim() || null,
      endAt: null
    }));
  }
  static allowedChargeTypesForContext(context, allowSlotFeatures, override) {
    const normalizedOverride = (override ?? []).filter((value, index, source) => (value === "per_attendee" || value === "per_booking" || value === "per_slot") && source.indexOf(value) === index);
    if (normalizedOverride.length > 0) {
      return allowSlotFeatures ? normalizedOverride : normalizedOverride.filter((value) => value !== "per_slot");
    }
    const defaults = context === "asset" ? ["per_booking", "per_attendee"] : ["per_attendee", "per_booking"];
    if (allowSlotFeatures) {
      defaults.push("per_slot");
    }
    return defaults;
  }
  static sanitizeRuleScope(rule, slotCatalogIds, allowSlotFeatures) {
    if (!allowSlotFeatures || slotCatalogIds.size === 0 || rule.appliesTo !== "selected_slots") {
      return __spreadProps(__spreadValues({}, rule), {
        appliesTo: "all_slots",
        slotIds: []
      });
    }
    const slotIds = (rule.slotIds ?? []).map((item) => this.normalizeText(item)).filter((item) => slotCatalogIds.has(item));
    if (slotIds.length === 0) {
      return __spreadProps(__spreadValues({}, rule), {
        appliesTo: "all_slots",
        slotIds: []
      });
    }
    return __spreadProps(__spreadValues({}, rule), {
      slotIds
    });
  }
  static normalizeDemandRules(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry, index) => {
      const source = typeof entry === "object" && entry !== null ? entry : {};
      return {
        id: this.normalizeText(source["id"]) || `demand-rule-${index + 1}`,
        operator: this.normalizeDemandOperator(source["operator"]) ?? "gte",
        capacityFilledPercent: this.normalizePercent(source["capacityFilledPercent"]) ?? 50,
        action: this.normalizeAction(source["action"], source["actionKind"], source["value"]),
        appliesTo: this.normalizeRuleScope(source["appliesTo"]) ?? "all_slots",
        slotIds: this.normalizeStringArray(source["slotIds"])
      };
    });
  }
  static normalizeQuantityRules(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry, index) => {
      const source = typeof entry === "object" && entry !== null ? entry : {};
      return {
        id: this.normalizeText(source["id"]) || `quantity-rule-${index + 1}`,
        minQuantity: this.normalizePositiveInteger(source["minQuantity"] ?? source["quantity"]) ?? 2,
        action: this.normalizeAction(source["action"], source["actionKind"], source["value"])
      };
    });
  }
  static normalizeTimeRules(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry, index) => {
      const source = typeof entry === "object" && entry !== null ? entry : {};
      return __spreadValues({}, this.normalizeTimeRuleDateRange({
        id: this.normalizeText(source["id"]) || `time-rule-${index + 1}`,
        trigger: this.normalizeTimeTrigger(source["trigger"]) ?? "days_before_start",
        offsetValue: this.normalizeOffset(source["offsetValue"]),
        specificDateStart: this.normalizeDate(source["specificDateStart"]),
        specificDateEnd: this.normalizeDate(source["specificDateEnd"]),
        action: this.normalizeAction(source["action"], source["actionKind"], source["value"]),
        appliesTo: this.normalizeRuleScope(source["appliesTo"]) ?? "all_slots",
        slotIds: this.normalizeStringArray(source["slotIds"])
      }));
    });
  }
  static normalizeCancellationPolicy(value) {
    const source = typeof value === "object" && value !== null ? value : {};
    const rules = this.normalizeCancellationRules(source["rules"]);
    return {
      enabled: this.normalizeBoolean(source["enabled"], rules.length > 0),
      rules
    };
  }
  static normalizeCancellationRules(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry, index) => {
      const source = typeof entry === "object" && entry !== null ? entry : {};
      const refundKind = this.normalizeCancellationRefundKind(source["refundKind"]) ?? "percent";
      return {
        id: this.normalizeText(source["id"]) || `cancellation-rule-${index + 1}`,
        offsetUnit: this.normalizeCancellationUnit(source["offsetUnit"]) ?? "days",
        offsetValue: this.normalizeOffset(source["offsetValue"]),
        refundKind,
        refundValue: refundKind === "percent" ? this.normalizePercent(source["refundValue"]) : refundKind === "fixed_amount" ? this.normalizeMoney(source["refundValue"]) : null
      };
    });
  }
  static normalizeSlotOverrides(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry, index) => {
      const source = typeof entry === "object" && entry !== null ? entry : {};
      return {
        id: this.normalizeText(source["id"]) || `slot-override-${index + 1}`,
        slotId: this.normalizeText(source["slotId"]) || null,
        label: this.normalizeText(source["label"]) || `Slot ${index + 1}`,
        startAt: this.normalizeText(source["startAt"]) || null,
        endAt: this.normalizeText(source["endAt"]) || null,
        price: this.normalizeMoney(source["price"]),
        currency: this.normalizeCurrency(source["currency"]) || null
      };
    });
  }
  static normalizePromoCodes(value, preserveEmpty = false) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry, index) => {
      const source = typeof entry === "object" && entry !== null ? entry : {};
      return {
        id: this.normalizeText(source["id"]) || `promo-code-${index + 1}`,
        code: this.normalizeText(source["code"]).toUpperCase(),
        action: this.normalizeAction(source["action"], source["actionKind"], source["value"])
      };
    }).filter((item) => preserveEmpty || item.code.length > 0);
  }
  static normalizeAction(actionValue, actionKindValue, rawValue) {
    const source = typeof actionValue === "object" && actionValue !== null ? actionValue : {};
    return {
      kind: this.normalizeActionKind(source["kind"] ?? actionKindValue) ?? "increase_percent",
      value: this.normalizeMoney(source["value"] ?? rawValue) ?? 0
    };
  }
  static normalizeStringArray(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((item) => this.normalizeText(item)).filter((item, index, source) => item.length > 0 && source.indexOf(item) === index);
  }
  static normalizeBoolean(value, fallback = false) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true" || normalized === "on" || normalized === "enabled") {
        return true;
      }
      if (normalized === "false" || normalized === "off" || normalized === "disabled") {
        return false;
      }
    }
    return fallback;
  }
  static normalizeText(value) {
    return typeof value === "string" ? value.trim() : "";
  }
  static normalizeMoney(value) {
    if (value === null || value === void 0 || value === "") {
      return null;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return Math.round(parsed * 100) / 100;
  }
  static normalizePercent(value) {
    const parsed = this.normalizeMoney(value);
    if (parsed === null) {
      return null;
    }
    return Math.max(0, Math.min(100, parsed));
  }
  static normalizePositiveInteger(value) {
    const parsed = this.normalizeMoney(value);
    if (parsed === null) {
      return null;
    }
    return Math.max(1, Math.trunc(parsed));
  }
  static normalizeOffset(value) {
    const parsed = this.normalizeMoney(value);
    if (parsed === null) {
      return null;
    }
    return Math.max(0, parsed);
  }
  static normalizeCurrency(value) {
    return this.normalizeText(value).toUpperCase().slice(0, 8);
  }
  static normalizeCancellationUnit(value) {
    const normalized = this.normalizeText(value);
    return normalized === "hours" || normalized === "days" || normalized === "weeks" || normalized === "months" ? normalized : null;
  }
  static normalizeCancellationRefundKind(value) {
    const normalized = this.normalizeText(value);
    return normalized === "percent" || normalized === "fixed_amount" || normalized === "full" || normalized === "none" ? normalized : null;
  }
  static normalizeDate(value) {
    const normalized = this.normalizeText(value);
    return normalized.length > 0 ? normalized : null;
  }
  static normalizeTimeRuleDateRange(rule) {
    const start = rule.specificDateStart;
    const end = rule.specificDateEnd;
    if (!start && !end) {
      return __spreadProps(__spreadValues({}, rule), {
        specificDateStart: null,
        specificDateEnd: null
      });
    }
    if (start && !end) {
      return __spreadProps(__spreadValues({}, rule), {
        specificDateStart: start,
        specificDateEnd: start
      });
    }
    if (!start && end) {
      return __spreadProps(__spreadValues({}, rule), {
        specificDateStart: end,
        specificDateEnd: end
      });
    }
    if ((start ?? "") > (end ?? "")) {
      return __spreadProps(__spreadValues({}, rule), {
        specificDateStart: end,
        specificDateEnd: start
      });
    }
    return rule;
  }
  static normalizeMode(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "demand-based" || normalized === "demand") {
      return "demand-based";
    }
    if (normalized === "time-based" || normalized === "time") {
      return "time-based";
    }
    if (normalized === "hybrid") {
      return "hybrid";
    }
    return "fixed";
  }
  static normalizeTaxMode(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "included") {
      return "included";
    }
    if (normalized === "excluded") {
      return "excluded";
    }
    return null;
  }
  static normalizeChargeType(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "per_booking" || normalized === "booking") {
      return "per_booking";
    }
    if (normalized === "per_slot" || normalized === "slot") {
      return "per_slot";
    }
    if (normalized === "per_attendee" || normalized === "attendee" || normalized === "person") {
      return "per_attendee";
    }
    return null;
  }
  static normalizeRounding(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "whole" || normalized === "whole_number") {
      return "whole";
    }
    if (normalized === "half" || normalized === "0.5") {
      return "half";
    }
    if (normalized === "none" || normalized === "no_rounding") {
      return "none";
    }
    return null;
  }
  static normalizeActionKind(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "set_exact_price" || normalized === "exact_price") {
      return "set_exact_price";
    }
    if (normalized === "decrease_percent" || normalized === "discount") {
      return "decrease_percent";
    }
    if (normalized === "decrease_amount" || normalized === "discount_amount" || normalized === "fixed_discount") {
      return "decrease_amount";
    }
    if (normalized === "increase_amount" || normalized === "surcharge_amount" || normalized === "fixed_increase") {
      return "increase_amount";
    }
    if (normalized === "increase_percent" || normalized === "increase") {
      return "increase_percent";
    }
    return null;
  }
  static normalizeRuleScope(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "selected_slots" || normalized === "selected") {
      return "selected_slots";
    }
    if (normalized === "all_slots" || normalized === "all") {
      return "all_slots";
    }
    return null;
  }
  static normalizeDemandOperator(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "lte" || normalized === "<=" || normalized === "lt") {
      return "lte";
    }
    if (normalized === "gte" || normalized === ">=" || normalized === "gt") {
      return "gte";
    }
    return null;
  }
  static normalizeTimeTrigger(value) {
    const normalized = this.normalizeText(value).toLowerCase();
    if (normalized === "hours_before_start" || normalized === "hours") {
      return "hours_before_start";
    }
    if (normalized === "specific_date" || normalized === "date") {
      return "specific_date";
    }
    if (normalized === "days_before_start" || normalized === "days") {
      return "days_before_start";
    }
    return null;
  }
};

// src/app/shared/core/base/builders/activity-resource.builder.ts
var ActivityResourceBuilder = class {
  static authorizationEventId(ownerIdValue, subEventIdValue = "") {
    const ownerId = `${ownerIdValue ?? ""}`.trim();
    const subEventId = `${subEventIdValue ?? ""}`.trim();
    if (!ownerId) {
      return "";
    }
    let runtimeOwnerId = ownerId;
    if (subEventId) {
      const groupOwnerMarker = ownerId.indexOf(`:${subEventId}:`);
      if (groupOwnerMarker > 0) {
        runtimeOwnerId = ownerId.slice(0, groupOwnerMarker);
      }
    }
    const slotMarker = runtimeOwnerId.indexOf(":slot:");
    return slotMarker > 0 ? runtimeOwnerId.slice(0, slotMarker) : runtimeOwnerId;
  }
  static ownerKey(ref) {
    return `${ref.assetOwnerUserId}:${ref.ownerId}`;
  }
  static recordId(ref) {
    return `${ref.assetOwnerUserId}:${ref.ownerId}:${ref.subEventId}`;
  }
  static createEmptyState(ref) {
    return {
      ownerId: ref.ownerId.trim(),
      subEventId: ref.subEventId.trim(),
      assetOwnerUserId: ref.assetOwnerUserId.trim(),
      assetAssignmentIds: {},
      assetSettingsByType: {},
      supplyContributionEntriesByAssetId: {},
      fallbackAssetCardsByType: {},
      resourceMetricsByType: {}
    };
  }
  static cloneState(state) {
    if (!state) {
      return null;
    }
    return {
      ownerId: `${state.ownerId ?? ""}`.trim(),
      subEventId: `${state.subEventId ?? ""}`.trim(),
      assetOwnerUserId: `${state.assetOwnerUserId ?? ""}`.trim(),
      assetAssignmentIds: this.cloneAssetAssignmentIds(state.assetAssignmentIds),
      assetSettingsByType: this.cloneAssetSettingsByType(state.assetSettingsByType),
      supplyContributionEntriesByAssetId: this.cloneSupplyContributionEntriesByAssetId(state.supplyContributionEntriesByAssetId),
      fallbackAssetCardsByType: this.cloneFallbackAssetCardsByType(state.fallbackAssetCardsByType),
      resourceMetricsByType: this.cloneResourceMetricsByType(state.resourceMetricsByType)
    };
  }
  static normalizeState(state, fallbackRef) {
    const fallback = fallbackRef ? this.createEmptyState(fallbackRef) : null;
    if (!state && !fallback) {
      return null;
    }
    const next = this.cloneState(state) ?? fallback;
    if (!next) {
      return null;
    }
    if (!next.ownerId || !next.subEventId || !next.assetOwnerUserId) {
      return fallback;
    }
    next.assetAssignmentIds = this.cloneAssetAssignmentIds(next.assetAssignmentIds);
    next.assetSettingsByType = this.cloneAssetSettingsByType(next.assetSettingsByType);
    next.supplyContributionEntriesByAssetId = this.cloneSupplyContributionEntriesByAssetId(next.supplyContributionEntriesByAssetId);
    next.fallbackAssetCardsByType = this.cloneFallbackAssetCardsByType(next.fallbackAssetCardsByType);
    next.resourceMetricsByType = this.cloneResourceMetricsByType(next.resourceMetricsByType);
    return next;
  }
  static cloneResourceMetricsByType(source) {
    const next = {};
    for (const type of ASSET_TYPES) {
      const metric = source?.[type];
      if (!metric) {
        continue;
      }
      next[type] = {
        accepted: Math.max(0, Math.trunc(Number(metric.accepted) || 0)),
        pending: Math.max(0, Math.trunc(Number(metric.pending) || 0)),
        capacityMin: Math.max(0, Math.trunc(Number(metric.capacityMin) || 0)),
        capacityMax: Math.max(0, Math.trunc(Number(metric.capacityMax) || 0))
      };
    }
    return next;
  }
  static cloneAssetAssignmentIds(source) {
    const next = {};
    for (const type of ASSET_TYPES) {
      const ids = Array.isArray(source?.[type]) ? source?.[type] : [];
      const normalizedIds = Array.from(new Set(ids.map((id) => `${id ?? ""}`.trim()).filter((id) => id.length > 0)));
      if (normalizedIds.length > 0) {
        next[type] = normalizedIds;
      }
    }
    return next;
  }
  static cloneAssetSettingsByType(source) {
    const next = {};
    for (const type of ASSET_TYPES) {
      const rawMap = source?.[type];
      if (!rawMap || typeof rawMap !== "object") {
        continue;
      }
      const normalizedMap = {};
      for (const [assetId, settings] of Object.entries(rawMap)) {
        const normalizedAssetId = `${assetId ?? ""}`.trim();
        if (!normalizedAssetId || !settings) {
          continue;
        }
        const routes = this.normalizeRoutes(settings.routes);
        normalizedMap[normalizedAssetId] = {
          capacityMin: Math.max(0, Math.trunc(Number(settings.capacityMin) || 0)),
          capacityMax: Math.max(0, Math.trunc(Number(settings.capacityMax) || 0)),
          quantity: Math.max(0, Math.trunc(Number(settings.quantity) || 0)),
          addedByUserId: `${settings.addedByUserId ?? ""}`.trim(),
          routeEnabled: this.normalizeRouteEnabled(settings, routes),
          routes
        };
      }
      if (Object.keys(normalizedMap).length > 0) {
        next[type] = normalizedMap;
      }
    }
    return next;
  }
  static cloneSupplyContributionEntriesByAssetId(source) {
    const next = {};
    if (!source || typeof source !== "object") {
      return next;
    }
    for (const [assetId, rawEntries] of Object.entries(source)) {
      const normalizedAssetId = `${assetId ?? ""}`.trim();
      if (!normalizedAssetId || !Array.isArray(rawEntries)) {
        continue;
      }
      const entries = rawEntries.map((entry) => ({
        id: `${entry?.id ?? ""}`.trim(),
        userId: `${entry?.userId ?? ""}`.trim(),
        quantity: Math.max(0, Math.trunc(Number(entry?.quantity) || 0)),
        addedAtIso: `${entry?.addedAtIso ?? ""}`.trim()
      })).filter((entry) => entry.id.length > 0 && entry.userId.length > 0 && entry.quantity > 0).sort((left, right) => AppUtils.toSortableDate(left.addedAtIso) - AppUtils.toSortableDate(right.addedAtIso));
      if (entries.length > 0) {
        next[normalizedAssetId] = entries;
      }
    }
    return next;
  }
  static cloneFallbackAssetCardsByType(source) {
    const next = {};
    for (const type of ASSET_TYPES) {
      const cards = source?.[type];
      if (!Array.isArray(cards) || cards.length === 0) {
        continue;
      }
      next[type] = cards.map((card) => this.cloneAssetCard(card));
    }
    return next;
  }
  static resolveAssignedAssetIds(state, type, assets) {
    const eligibleIds = this.resolveAvailableAssetCards(type, state, assets).map((card) => card.id);
    const eligible = new Set(eligibleIds);
    const stored = state?.assetAssignmentIds?.[type] ?? [];
    return stored.filter((id) => eligible.has(id));
  }
  static resolveAssignedAssetSettings(state, type) {
    return __spreadValues({}, state?.assetSettingsByType?.[type] ?? {});
  }
  static resolveSupplyContributionEntries(state, assetId) {
    const normalizedAssetId = assetId.trim();
    if (!normalizedAssetId) {
      return [];
    }
    return [
      ...state?.supplyContributionEntriesByAssetId?.[normalizedAssetId] ?? []
    ].map((entry) => __spreadValues({}, entry));
  }
  static resourceAcceptedCount(subEvent, type, state, assets) {
    const assignedCards = this.resolveAssignedCards(type, state, assets);
    if (assignedCards.length > 0) {
      if (type === ASSET_TYPE_SUPPLIES) {
        return assignedCards.reduce((sum, card) => sum + this.resolveSupplyContributionEntries(state, card.id).reduce((entrySum, entry) => entrySum + Math.max(0, Math.trunc(Number(entry.quantity) || 0)), 0), 0);
      }
      return assignedCards.reduce((sum, card) => sum + this.subEventOccupancyRequestCount(card, subEvent.id, "accepted", state?.ownerId), 0);
    }
    if (state) {
      return 0;
    }
    if (type === ASSET_TYPE_TRANSPORT) {
      return Math.max(0, Math.trunc(Number(subEvent.carsAccepted) || 0));
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return Math.max(0, Math.trunc(Number(subEvent.accommodationAccepted) || 0));
    }
    return Math.max(0, Math.trunc(Number(subEvent.suppliesAccepted) || 0));
  }
  static resourcePendingCount(subEvent, type, state, assets) {
    const assignedCards = this.resolveAssignedCards(type, state, assets);
    if (assignedCards.length > 0) {
      if (type === ASSET_TYPE_SUPPLIES) {
        return 0;
      }
      return assignedCards.reduce((sum, card) => sum + this.subEventOccupancyRequestCount(card, subEvent.id, "pending", state?.ownerId), 0);
    }
    if (state) {
      return 0;
    }
    if (type === ASSET_TYPE_TRANSPORT) {
      return Math.max(0, Math.trunc(Number(subEvent.carsPending) || 0));
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return Math.max(0, Math.trunc(Number(subEvent.accommodationPending) || 0));
    }
    return Math.max(0, Math.trunc(Number(subEvent.suppliesPending) || 0));
  }
  static resourceCapacityBounds(subEvent, type, state, assets, accepted, pending) {
    const assignedCards = this.resolveAssignedCards(type, state, assets);
    if (assignedCards.length > 0) {
      const settings = this.resolveAssignedAssetSettings(state, type);
      return {
        capacityMin: 0,
        capacityMax: assignedCards.reduce((sum, card) => sum + Math.max(0, Math.trunc(Number(settings[card.id]?.capacityMax ?? card.capacityTotal) || 0)), 0)
      };
    }
    if (state) {
      return { capacityMin: 0, capacityMax: 0 };
    }
    const observed = Math.max(accepted, accepted + pending);
    if (type === ASSET_TYPE_TRANSPORT) {
      const min2 = Math.max(0, Math.trunc(Number(subEvent.carsCapacityMin) || 0));
      const max2 = Math.max(min2, Math.trunc(Number(subEvent.carsCapacityMax) || observed));
      return { capacityMin: min2, capacityMax: max2 };
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      const min2 = Math.max(0, Math.trunc(Number(subEvent.accommodationCapacityMin) || 0));
      const max2 = Math.max(min2, Math.trunc(Number(subEvent.accommodationCapacityMax) || observed));
      return { capacityMin: min2, capacityMax: max2 };
    }
    const min = Math.max(0, Math.trunc(Number(subEvent.suppliesCapacityMin) || 0));
    const max = Math.max(min, Math.trunc(Number(subEvent.suppliesCapacityMax) || observed));
    return { capacityMin: min, capacityMax: max };
  }
  static buildPersistedResourceMetrics(state, assets) {
    return Object.fromEntries(ASSET_TYPES.map((type) => {
      const assignedCards = this.resolveAssignedCards(type, state, assets);
      const settings = this.resolveAssignedAssetSettings(state, type);
      const accepted = type === ASSET_TYPE_SUPPLIES ? assignedCards.reduce((sum, card) => sum + this.resolveSupplyContributionEntries(state, card.id).reduce((entrySum, entry) => entrySum + Math.max(0, Math.trunc(Number(entry.quantity) || 0)), 0), 0) : assignedCards.reduce((sum, card) => sum + this.subEventOccupancyRequestCount(card, state.subEventId, "accepted", state.ownerId), 0);
      const pending = type === ASSET_TYPE_SUPPLIES ? 0 : assignedCards.reduce((sum, card) => sum + this.subEventOccupancyRequestCount(card, state.subEventId, "pending", state.ownerId), 0);
      const capacityMin = assignedCards.reduce((sum, card) => sum + Math.max(0, Math.trunc(Number(settings[card.id]?.capacityMin) || 0)), 0);
      const capacityMax = assignedCards.reduce((sum, card) => sum + Math.max(0, Math.trunc(Number(settings[card.id]?.capacityMax ?? card.capacityTotal) || 0)), 0);
      return [type, {
        accepted,
        pending,
        capacityMin,
        capacityMax: Math.max(capacityMin, capacityMax)
      }];
    }));
  }
  static resolveAssignedCards(type, state, assets) {
    const assignedIds = this.resolveAssignedAssetIds(state, type, assets);
    const availableCards = this.resolveAvailableAssetCards(type, state, assets);
    return assignedIds.map((id) => availableCards.find((card) => card.id === id && card.type === type) ?? null).filter((card) => card !== null);
  }
  static resolveAvailableAssetCards(type, state, assets) {
    const nextById = /* @__PURE__ */ new Map();
    for (const card of assets) {
      if (card.type !== type) {
        continue;
      }
      nextById.set(card.id, card);
    }
    for (const card of state?.fallbackAssetCardsByType?.[type] ?? []) {
      if (card.type !== type || nextById.has(card.id)) {
        continue;
      }
      nextById.set(card.id, card);
    }
    return [...nextById.values()];
  }
  static isSubEventManualAssignmentRequest(request, subEventId) {
    const normalizedSubEventId = subEventId.trim();
    return request.requestKind === "manual" && normalizedSubEventId.length > 0 && request.id.startsWith(`manual:${normalizedSubEventId}:`);
  }
  static isSubEventScopedAssetRequest(request, subEventId, ownerId) {
    const normalizedSubEventId = subEventId.trim();
    const normalizedOwnerId = `${ownerId ?? ""}`.trim();
    const bookingOwnerId = `${request.booking?.eventId ?? ""}`.trim();
    const ownerIdsMatchExactly = bookingOwnerId === normalizedOwnerId;
    const groupOwnerMarker = normalizedSubEventId ? `:${normalizedSubEventId}:` : "";
    const ownerIsUngroupedSlotRuntime = normalizedOwnerId.includes(":slot:") && (!groupOwnerMarker || !normalizedOwnerId.includes(groupOwnerMarker));
    const bookingIsUngroupedSlotRuntime = bookingOwnerId.includes(":slot:") && (!groupOwnerMarker || !bookingOwnerId.includes(groupOwnerMarker));
    const ownerIdsMatchSlotAuthorizationScope = (ownerIsUngroupedSlotRuntime || bookingIsUngroupedSlotRuntime) && this.authorizationEventId(normalizedOwnerId, normalizedSubEventId) === this.authorizationEventId(bookingOwnerId, normalizedSubEventId);
    if (normalizedOwnerId && !ownerIdsMatchExactly && !ownerIdsMatchSlotAuthorizationScope) {
      return false;
    }
    return this.isSubEventManualAssignmentRequest(request, normalizedSubEventId) || `${request.booking?.subEventId ?? ""}`.trim() === normalizedSubEventId;
  }
  static assetRequestQuantity(request) {
    return Math.max(1, Math.trunc(Number(request.booking?.quantity) || 1));
  }
  static subEventOccupancyRequestCount(card, subEventId, status, ownerId) {
    const normalizedSubEventId = subEventId.trim();
    if (!normalizedSubEventId) {
      return 0;
    }
    return card.requests.filter((request) => request.status === status && this.isSubEventScopedAssetRequest(request, normalizedSubEventId, ownerId) && !this.isSubEventManualAssignmentRequest(request, normalizedSubEventId)).reduce((sum, request) => sum + this.assetRequestQuantity(request), 0);
  }
  static assetRequestSyncSignature(request) {
    return JSON.stringify({
      id: request.id,
      userId: request.userId ?? "",
      status: request.status,
      requestKind: request.requestKind ?? "",
      bookingQuantity: request.booking?.quantity ?? "",
      bookingAcceptedPolicyIds: [...request.booking?.acceptedPolicyIds ?? []]
    });
  }
  static subEventAssetAssignmentKey(subEventId, type) {
    return `${subEventId}:${type}`;
  }
  static subEventSupplyAssignmentKey(subEventId, cardId) {
    return `${subEventId}:${cardId}`;
  }
  static assetDetailText(card) {
    return `${card.details ?? card.description ?? ""}`.trim();
  }
  static assetSourceLink(card) {
    return `${card.sourceLink ?? ""}`.trim();
  }
  static normalizeAssetRoutes(type, routes) {
    if (type === ASSET_TYPE_SUPPLIES) {
      return [];
    }
    const cleaned = (routes ?? []).map((value) => `${value ?? ""}`.trim()).filter((value, index, arr) => value.length > 0 && arr.indexOf(value) === index);
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return cleaned.length > 0 ? [cleaned[0]] : [""];
    }
    return cleaned.length > 0 ? cleaned : [""];
  }
  static assetRequestTimeframeLabel(startAtIso, endAtIso) {
    const start = AppUtils.isoLocalDateTimeToDate(startAtIso);
    const end = AppUtils.isoLocalDateTimeToDate(endAtIso);
    if (!start || !end) {
      return "";
    }
    const sameDay = start.toDateString() === end.toDateString();
    const startDate = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endDate = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const endTime = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return sameDay ? `${startDate} \xB7 ${startTime} - ${endTime}` : `${startDate} ${startTime} - ${endDate} ${endTime}`;
  }
  static defaultAssetExploreRange(subEvent) {
    const startAtIso = `${subEvent.startAt ?? ""}`.trim() || AppUtils.toIsoDateTimeLocal(/* @__PURE__ */ new Date());
    const endAtIso = `${subEvent.endAt ?? ""}`.trim();
    if (endAtIso) {
      return {
        startAtIso,
        endAtIso
      };
    }
    const base = AppUtils.isoLocalDateTimeToDate(startAtIso) ?? /* @__PURE__ */ new Date();
    const nextEnd = new Date(base);
    nextEnd.setHours(nextEnd.getHours() + 2);
    return {
      startAtIso,
      endAtIso: AppUtils.toIsoDateTimeLocal(nextEnd)
    };
  }
  static cloneAssetCard(card) {
    return __spreadProps(__spreadValues({}, card), {
      routes: [...card.routes ?? []],
      topics: [...card.topics ?? []],
      policies: (card.policies ?? []).map((item) => __spreadValues({}, item)),
      pricing: card.pricing ? PricingBuilder.clonePricingConfig(card.pricing) : void 0,
      requests: card.requests.map((request) => __spreadProps(__spreadValues({}, request), {
        booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
          acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
        }) : null
      }))
    });
  }
  static normalizeRoutes(routes) {
    if (!Array.isArray(routes)) {
      return [];
    }
    return routes.map((route) => `${route ?? ""}`.trim()).filter((route) => route.length > 0);
  }
  static normalizeRouteEnabled(settings, routes) {
    return typeof settings.routeEnabled === "boolean" ? settings.routeEnabled : routes.length > 0;
  }
};

// src/app/shared/core/base/builders/asset-defaults.builder.ts
var AssetDefaultsBuilder = class {
  static transportCategories = TRANSPORT_ASSET_CATEGORIES;
  static accommodationCategories = ACCOMMODATION_ASSET_CATEGORIES;
  static suppliesCategories = SUPPLIES_ASSET_CATEGORIES;
  static assetTypeLabel(type) {
    return APP_STATIC_DATA.assetTypeLabels[type];
  }
  static assetTypeIcon(type) {
    if (type === ASSET_TYPE_TRANSPORT) {
      return "directions_car";
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return "apartment";
    }
    if (type === ASSET_FILTER_TICKET) {
      return "qr_code_2";
    }
    return "inventory_2";
  }
  static assetTypeClass(type) {
    if (type === ASSET_TYPE_TRANSPORT) {
      return "asset-filter-transport";
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return "asset-filter-accommodation";
    }
    if (type === ASSET_TYPE_SUPPLIES) {
      return "asset-filter-supplies";
    }
    if (type === ASSET_FILTER_TICKET) {
      return "asset-filter-ticket";
    }
    return "asset-filter-transport";
  }
  static eventVisibilityClass(option) {
    switch (option) {
      case "Public":
        return "event-visibility-public";
      case "Friends only":
        return "event-visibility-friends";
      default:
        return "event-visibility-invitation";
    }
  }
  static visibilityIcon(option) {
    switch (option) {
      case "Friends only":
        return "groups";
      case "Invitation only":
        return "mail_lock";
      default:
        return "public";
    }
  }
  static assetCategoryOptions(type) {
    return [...APP_STATIC_DATA.assetCategoryOptionsByType[type] ?? []];
  }
  static assetCategoryLabel(category) {
    return `${category ?? ""}`.trim();
  }
  static assetCategoryIcon(category, fallbackType = this.assetCategoryType(category)) {
    switch (`${category ?? ""}`.trim().toLowerCase()) {
      case "sedan":
        return "directions_car";
      case "suv":
        return "directions_car";
      case "van":
      case "shuttle":
        return "airport_shuttle";
      case "bus":
        return "directions_bus";
      case "truck":
        return "local_shipping";
      case "motorcycle":
        return "two_wheeler";
      case "bicycle":
        return "pedal_bike";
      case "boat":
        return "directions_boat";
      case "flight":
        return "flight";
      case "hotel":
        return "hotel";
      case "apartment":
        return "apartment";
      case "house":
        return "home";
      case "room":
        return "meeting_room";
      case "venue":
        return "stadium";
      case "campsite":
        return "cabin";
      case "storage":
        return "warehouse";
      case "workspace":
        return "business_center";
      case "camping":
        return "forest";
      case "cooking":
        return "restaurant";
      case "games":
        return "sports_esports";
      case "audio":
        return "speaker";
      case "sports":
        return "sports_basketball";
      case "safety":
        return "health_and_safety";
      case "decor":
        return "celebration";
      case "tech":
        return "memory";
      default:
        return this.assetTypeIcon(fallbackType);
    }
  }
  static assetCategoryClass(category, fallbackType = this.assetCategoryType(category)) {
    switch (`${category ?? ""}`.trim().toLowerCase()) {
      case "camping":
        return "asset-category-camping";
      case "cooking":
        return "asset-category-cooking";
      case "games":
        return "asset-category-games";
      case "audio":
        return "asset-category-audio";
      case "sports":
        return "asset-category-sports";
      case "safety":
        return "asset-category-safety";
      case "decor":
        return "asset-category-decor";
      case "tech":
        return "asset-category-tech";
      default:
        return this.assetTypeClass(fallbackType);
    }
  }
  static assetCategoryType(category) {
    const normalized = this.normalizedCategory(category);
    if (this.includesCategory(this.transportCategories, normalized)) {
      return ASSET_TYPE_TRANSPORT;
    }
    if (this.includesCategory(this.accommodationCategories, normalized)) {
      return ASSET_TYPE_ACCOMMODATION;
    }
    if (this.includesCategory(this.suppliesCategories, normalized)) {
      return ASSET_TYPE_SUPPLIES;
    }
    return ASSET_TYPE_SUPPLIES;
  }
  static defaultCategory(type) {
    return this.assetCategoryOptions(type)[0] ?? "";
  }
  static normalizeCategory(type, value) {
    const normalized = `${value ?? ""}`.trim();
    const options = this.assetCategoryOptions(type);
    if (options.some((option) => option === normalized)) {
      return normalized;
    }
    return this.defaultCategory(type);
  }
  static normalizedCategory(category) {
    return `${category ?? ""}`.trim().toLowerCase();
  }
  static includesCategory(options, normalizedCategory) {
    return options.some((option) => option.toLowerCase() === normalizedCategory);
  }
};

// src/app/shared/core/contracts/asset.interface.ts
var AssetDto = class _AssetDto {
  id = "";
  type = ASSET_TYPE_TRANSPORT;
  title = "";
  subtitle = "";
  category;
  city = "";
  capacityTotal = 0;
  quantity = 0;
  description = "";
  imageUrl = "";
  sourceLink = "";
  locationLabel;
  priceLabel;
  policiesEnabled;
  policyCount;
  visibility;
  status;
  ownerUserId;
  ownerName;
  requests = [];
  metrics;
  menuActions;
  constructor(card) {
    if (!card) {
      return;
    }
    const detailCard = "details" in card ? card : null;
    const policiesEnabled = _AssetDto.assetPoliciesEnabled(card);
    Object.assign(this, {
      id: card.id,
      type: card.type,
      title: card.title,
      subtitle: card.subtitle,
      category: card.category,
      city: card.city,
      capacityTotal: card.capacityTotal,
      quantity: card.quantity,
      description: "description" in card ? card.description : card.details,
      imageUrl: card.imageUrl,
      sourceLink: ("sourceLink" in card ? card.sourceLink : detailCard?.sourceLink)?.trim() ?? "",
      locationLabel: "locationLabel" in card ? card.locationLabel : detailCard ? _AssetDto.locationLabelFromDetail(detailCard) : card.city,
      priceLabel: "priceLabel" in card ? card.priceLabel : void 0,
      policiesEnabled,
      policyCount: policiesEnabled ? "policyCount" in card ? card.policyCount : (detailCard?.policies ?? []).length : 0,
      visibility: card.visibility,
      status: card.status,
      ownerUserId: card.ownerUserId,
      ownerName: card.ownerName,
      requests: card.requests.map((request) => __spreadProps(__spreadValues({}, request), {
        booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
          acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
        }) : null
      })),
      metrics: _AssetDto.cloneMetrics(card.metrics),
      menuActions: card.menuActions ? [...card.menuActions] : void 0
    });
  }
  equals(other) {
    if (!other) {
      return false;
    }
    return this.id === other.id && this.type === other.type && this.title === other.title && this.subtitle === other.subtitle && (this.category ?? "") === (other.category ?? "") && this.city === other.city && this.capacityTotal === other.capacityTotal && this.quantity === other.quantity && this.description === other.description && this.imageUrl === other.imageUrl && this.sourceLink === (other.sourceLink ?? "") && (this.locationLabel ?? "") === (other.locationLabel ?? "") && (this.priceLabel ?? "") === (other.priceLabel ?? "") && (this.policiesEnabled ?? false) === (other.policiesEnabled ?? false) && (this.policyCount ?? 0) === (other.policyCount ?? 0) && (this.visibility ?? "") === (other.visibility ?? "") && (this.status ?? "") === (other.status ?? "") && (this.ownerUserId ?? "") === (other.ownerUserId ?? "") && (this.ownerName ?? "") === (other.ownerName ?? "") && _AssetDto.sameRequests(this.requests, other.requests) && _AssetDto.sameMetrics(this.metrics, other.metrics) && _AssetDto.sameStringList(this.menuActions, other.menuActions);
  }
  static equals(left, right) {
    if (!left || !right) {
      return left === right;
    }
    return new _AssetDto(left).equals(right);
  }
  static listEquals(left, right) {
    if (left.length !== right.length) {
      return false;
    }
    return left.every((card, index) => _AssetDto.equals(card, right[index]));
  }
  static clone(card) {
    return new _AssetDto(card);
  }
  static cloneList(cards) {
    return cards.map((card) => this.clone(card));
  }
  static locationLabelFromDetail(card) {
    if (card.type !== ASSET_TYPE_ACCOMMODATION) {
      return card.city;
    }
    return (card.routes ?? []).map((route) => route.trim()).find((route) => route.length > 0) ?? card.city;
  }
  static assetPoliciesEnabled(card) {
    if ("policiesEnabled" in card && card.policiesEnabled !== void 0) {
      return card.policiesEnabled === true;
    }
    if ("policyCount" in card && Number.isFinite(Number(card.policyCount)) && Number(card.policyCount) > 0) {
      return true;
    }
    return "policies" in card && (card.policies ?? []).length > 0;
  }
  static sameStringList(left, right) {
    const leftItems = left ?? [];
    const rightItems = right ?? [];
    return leftItems.length === rightItems.length && leftItems.every((item, index) => item === rightItems[index]);
  }
  static cloneMetrics(metrics) {
    return metrics ? {
      allItems: _AssetDto.normalizeCount(metrics.allItems),
      activeItems: _AssetDto.normalizeCount(metrics.activeItems),
      assignedItems: _AssetDto.normalizeCount(metrics.assignedItems),
      borrowedItems: _AssetDto.normalizeCount(metrics.borrowedItems),
      pendingItems: _AssetDto.normalizeCount(metrics.pendingItems)
    } : null;
  }
  static sameMetrics(left, right) {
    const leftMetrics = _AssetDto.cloneMetrics(left);
    const rightMetrics = _AssetDto.cloneMetrics(right);
    return (leftMetrics?.allItems ?? 0) === (rightMetrics?.allItems ?? 0) && (leftMetrics?.activeItems ?? 0) === (rightMetrics?.activeItems ?? 0) && (leftMetrics?.assignedItems ?? 0) === (rightMetrics?.assignedItems ?? 0) && (leftMetrics?.borrowedItems ?? 0) === (rightMetrics?.borrowedItems ?? 0) && (leftMetrics?.pendingItems ?? 0) === (rightMetrics?.pendingItems ?? 0);
  }
  static normalizeCount(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(0, Math.trunc(numeric)) : 0;
  }
  static sameRequests(left, right) {
    const leftItems = left ?? [];
    const rightItems = right ?? [];
    return leftItems.length === rightItems.length && leftItems.every((item, index) => {
      const other = rightItems[index];
      return other !== void 0 && _AssetDto.sameRequest(item, other);
    });
  }
  static sameRequest(left, right) {
    return left.id === right.id && (left.userId ?? "") === (right.userId ?? "") && left.name === right.name && left.initials === right.initials && left.gender === right.gender && left.status === right.status && left.note === right.note && (left.requestKind ?? "") === (right.requestKind ?? "") && (left.requestedAtIso ?? "") === (right.requestedAtIso ?? "") && (left.booking?.eventId ?? "") === (right.booking?.eventId ?? "") && (left.booking?.subEventId ?? "") === (right.booking?.subEventId ?? "") && (left.booking?.slotKey ?? "") === (right.booking?.slotKey ?? "") && (left.booking?.quantity ?? "") === (right.booking?.quantity ?? "") && (left.booking?.totalAmount ?? "") === (right.booking?.totalAmount ?? "") && (left.booking?.timeframe ?? "") === (right.booking?.timeframe ?? "");
  }
};

// src/app/shared/core/contracts/user.interface.ts
var UserDto = class {
  id = "";
  name = "";
  age = 0;
  birthday = "";
  city = "";
  height = "";
  physique = "";
  languages = [];
  horoscope = "";
  initials = "";
  gender = "man";
  statusText = "";
  hostTier = "";
  traitLabel = "";
  completion = 0;
  profileFormVersion;
  headline = "";
  about = "";
  affinity;
  locationCoordinates;
  partitionKey;
  images;
  profileDetails;
  impressions;
  profileStatus = "public";
  previousProfileStatus;
  deletedAtIso;
  admin;
  operator;
  notificationPreferences;
  activities = {
    game: 0,
    chats: 0,
    invitations: 0,
    events: 0,
    hosting: 0
  };
  constructor() {
    this.images = [];
    this.profileDetails = [];
  }
};
var ProfileExtDto = class {
  profile = new UserDto();
  experienceEntries = [];
};

// src/app/shared/core/contracts/chat.interface.ts
var RANDOM_ROOM_WELCOME_MESSAGE = "Welcome! We matched you here by affinity and past interactions. Leave anytime. Set visibility to non-public in Global Settings to stop future Random Rooms.";

// src/app/shared/core/base/builders/asset-card.builder.ts
var AssetCardBuilder = class {
  static buildEmptyAssetForm(type) {
    return {
      type,
      title: "",
      subtitle: "",
      category: AssetDefaultsBuilder.defaultCategory(type),
      city: "",
      capacityTotal: type === ASSET_TYPE_SUPPLIES ? 6 : 4,
      quantity: this.defaultQuantity(type),
      details: "",
      imageUrl: "",
      sourceLink: "",
      routes: this.normalizeAssetRoutes(type, []),
      topics: [],
      policiesEnabled: false,
      policies: [],
      pricing: PricingBuilder.createDefaultPricingConfig("asset")
    };
  }
  static buildAssetFormFromCard(card) {
    const detailCard = this.asDetail(card);
    const imageUrl = this.normalizeAssetLink(card.imageUrl);
    const sourceLink = this.normalizeAssetLink(card.sourceLink ?? detailCard?.sourceLink);
    return {
      type: card.type,
      title: card.title,
      subtitle: card.subtitle,
      category: AssetDefaultsBuilder.normalizeCategory(card.type, card.category),
      city: card.city,
      capacityTotal: card.capacityTotal,
      quantity: card.quantity,
      details: detailCard?.details ?? ("description" in card ? card.description : ""),
      imageUrl,
      sourceLink,
      routes: this.normalizeAssetRoutes(card.type, detailCard?.routes),
      topics: [...detailCard?.topics ?? []],
      policiesEnabled: this.assetPoliciesEnabled(card),
      policies: (detailCard?.policies ?? []).map((item) => __spreadValues({}, item)),
      pricing: PricingBuilder.clonePricingConfig(detailCard?.pricing ?? PricingBuilder.createDefaultPricingConfig("asset"))
    };
  }
  static buildAssetSavePayload(assetForm, resolvedImageUrl = null) {
    const title = assetForm.title.trim();
    const city = assetForm.city.trim();
    const routes = this.normalizeAssetRoutes(assetForm.type, assetForm.routes);
    const accommodationLocation = routes.find((stop) => stop.trim().length > 0)?.trim() || "";
    const imageUrl = this.normalizeAssetLink(resolvedImageUrl || assetForm.imageUrl);
    const sourceLink = this.normalizeAssetLink(assetForm.sourceLink);
    return {
      type: assetForm.type,
      title,
      subtitle: assetForm.subtitle.trim(),
      category: AssetDefaultsBuilder.normalizeCategory(assetForm.type, assetForm.category),
      city: assetForm.type === ASSET_TYPE_ACCOMMODATION ? accommodationLocation : city,
      capacityTotal: Math.max(1, Number(assetForm.capacityTotal) || (assetForm.type === ASSET_TYPE_SUPPLIES ? 6 : 4)),
      quantity: this.normalizeQuantity(assetForm.type, assetForm.quantity, assetForm.capacityTotal),
      details: assetForm.details.trim(),
      imageUrl,
      sourceLink,
      routes,
      topics: [...assetForm.topics ?? []],
      policiesEnabled: assetForm.policiesEnabled === true,
      policies: this.normalizePolicies(assetForm.policies),
      pricing: PricingBuilder.compactPricingConfig(assetForm.pricing ?? PricingBuilder.createDefaultPricingConfig("asset"), { context: "asset", allowSlotFeatures: false })
    };
  }
  static visibilityFromCard(card) {
    return card.visibility === "Friends only" ? "Friends only" : card.visibility === "Invitation only" ? "Invitation only" : "Public";
  }
  static activeAssetTypeFromFilter(filter) {
    if (filter === ASSET_TYPE_ACCOMMODATION) {
      return ASSET_TYPE_ACCOMMODATION;
    }
    if (filter === ASSET_TYPE_SUPPLIES) {
      return ASSET_TYPE_SUPPLIES;
    }
    return ASSET_TYPE_TRANSPORT;
  }
  static cloneCard(card) {
    return AssetDto.clone(card);
  }
  static cloneCards(cards) {
    return cards.map((card) => this.cloneCard(card));
  }
  static cloneRequest(request) {
    return __spreadProps(__spreadValues({}, request), {
      menuActions: [...request.menuActions ?? []],
      booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
        acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
      }) : null
    });
  }
  static normalizeAssetStatus(status) {
    const normalized = `${status ?? ""}`.trim();
    switch (normalized) {
      case "active":
        return "A";
      case "under-review":
      case "under review":
        return "UR";
      case "blocked":
        return "B";
      case "deleted":
        return "D";
      case "inactive":
        return "I";
      case "trashed":
      case "trash":
        return "T";
      default:
        return normalized || "A";
    }
  }
  static restoredAssetStatus(_card) {
    return "A";
  }
  static normalizeAssetRoutes(type, routes) {
    if (type === ASSET_TYPE_SUPPLIES) {
      return [];
    }
    const cleaned = (routes ?? []).map((value) => value.trim()).filter((value, index, arr) => value.length > 0 && arr.indexOf(value) === index);
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return cleaned.length > 0 ? [cleaned[0]] : [""];
    }
    return cleaned.length > 0 ? cleaned : [""];
  }
  static normalizeAssetLink(value, fallbackLink = "") {
    const trimmed = (value ?? "").trim();
    if (!trimmed || this.isGoogleMapsLikeLink(trimmed) || this.isLegacyGeneratedAssetImage(trimmed)) {
      return `${fallbackLink ?? ""}`.trim();
    }
    return trimmed;
  }
  static normalizeAssetMedia(card, options = {}) {
    const imageUrl = this.normalizeAssetLink(card.imageUrl, options.fallbackImageUrl);
    return __spreadProps(__spreadValues({}, AssetDto.clone(card)), {
      imageUrl
    });
  }
  static normalizeAssetMediaCards(cards, options = {}) {
    return cards.map((card) => this.normalizeAssetMedia(card, {
      fallbackImageUrl: options.fallbackImageUrl?.(card) ?? ""
    }));
  }
  static capacityLabel(card) {
    return `${this.capacityValue(card)}`;
  }
  static quantityLabel(card) {
    return `${this.quantityValue(card)}`;
  }
  static capacityValue(card) {
    return Math.max(1, Math.trunc(Number(card.capacityTotal) || 0));
  }
  static quantityValue(card) {
    return this.normalizeQuantity(card.type, card.quantity, card.capacityTotal);
  }
  static storedQuantityValue(card) {
    const parsed = Math.trunc(Number(card.quantity));
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
    return this.normalizeQuantity(card.type, card.quantity, card.capacityTotal);
  }
  static defaultQuantity(type) {
    return type === ASSET_TYPE_SUPPLIES ? 6 : 1;
  }
  static normalizeQuantity(type, value, capacityFallback = null) {
    const parsed = Math.trunc(Number(value) || 0);
    if (parsed > 0) {
      return parsed;
    }
    if (type === ASSET_TYPE_SUPPLIES) {
      return Math.max(1, Math.trunc(Number(capacityFallback) || 0));
    }
    return this.defaultQuantity(type);
  }
  static primaryLocation(card) {
    return card.type === ASSET_TYPE_ACCOMMODATION ? card.locationLabel?.trim() || card.city.trim() : "";
  }
  static canOpenMap(card) {
    return card.type === ASSET_TYPE_ACCOMMODATION && this.primaryLocation(card).length > 0;
  }
  static assetPoliciesEnabled(card) {
    if (!card) {
      return false;
    }
    if ("policiesEnabled" in card && card.policiesEnabled !== void 0) {
      return card.policiesEnabled === true;
    }
    if ("policyCount" in card && Number.isFinite(Number(card.policyCount)) && Number(card.policyCount) > 0) {
      return true;
    }
    return "policies" in card && (card.policies ?? []).length > 0;
  }
  static normalizePolicies(policies) {
    return (policies ?? []).map((item) => ({
      id: `${item.id ?? ""}`.trim(),
      title: `${item.title ?? ""}`.trim(),
      description: `${item.description ?? ""}`.trim(),
      required: item.required !== false
    })).filter((item) => item.id || item.title || item.description);
  }
  static isGoogleMapsLikeLink(value) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return false;
    }
    return normalized.includes("google.com/maps") || normalized.includes("maps.google.") || normalized.includes("goo.gl/maps");
  }
  static isLegacyGeneratedAssetImage(value) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return false;
    }
    return normalized.includes("loremflickr.com/");
  }
  static asDetail(card) {
    return "details" in card && "sourceLink" in card ? card : null;
  }
};

// src/app/shared/core/base/builders/asset-ticket.builder.ts
var AssetTicketBuilder = class {
  static identity(row) {
    return `${row.type}:${row.id}`;
  }
  static revision(row) {
    const explicit = `${row.revision ?? ""}`.trim();
    if (explicit) {
      return explicit;
    }
    return [
      row.scanCode,
      row.status,
      row.usedAtIso,
      row.issuedAtIso,
      row.title,
      row.subtitle,
      row.detail,
      row.dateIso,
      row.startAt,
      row.endAt,
      row.imageUrl,
      row.visibility
    ].map((value) => `${value ?? ""}`).join("");
  }
  static pollPosition(row) {
    return row.dateIso;
  }
  static createScanPayload(row, holder) {
    const issuedAtIso = `${row.issuedAtIso ?? row.startAt ?? row.dateIso}`.trim() || row.dateIso;
    const userId = row.holderUserId.trim() || holder.id?.trim() || "";
    const userName = holder.name?.trim() || "Ticket Holder";
    const holderAge = Math.max(0, Math.trunc(Number(holder.age) || 0));
    const holderCity = holder.city?.trim() || "";
    return {
      code: row.scanCode.trim(),
      holderUserId: userId,
      holderName: userName,
      holderInitials: holder.initials?.trim() || AppUtils.initialsFromText(userName),
      holderAvatarUrl: AppUtils.firstImageUrl(holder.images),
      holderAge,
      holderCity,
      holderRole: row.isAdmin ? "Admin" : "Member",
      eventId: row.id,
      eventTitle: row.title,
      eventSubtitle: row.subtitle,
      eventTimeframe: row.detail,
      eventDateLabel: this.dateLabel(row),
      issuedAtIso,
      usedAtIso: `${row.usedAtIso ?? ""}`.trim()
    };
  }
  static createDemoScanCode(eventId, holderUserId) {
    const normalizedEventId = eventId.trim();
    const normalizedHolderUserId = holderUserId.trim();
    if (!normalizedEventId || !normalizedHolderUserId) {
      return "";
    }
    const source = `${normalizedEventId.length}:${normalizedEventId}${normalizedHolderUserId}`;
    const token = [0, 1, 2, 3].map((round) => this.demoScanHash(`ticket:${round}${source}`).toString(16).padStart(8, "0")).join("");
    return `DEMO-${token}`;
  }
  static isDemoScanCode(code) {
    return /^DEMO-[0-9a-f]{32}$/.test(code.trim());
  }
  static demoScanHash(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
  static dateLabel(row) {
    const parsed = new Date(row.dateIso);
    if (Number.isNaN(parsed.getTime())) {
      return row.detail;
    }
    return parsed.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }
  static groupLabel(dateIso) {
    const parsed = new Date(dateIso);
    if (Number.isNaN(parsed.getTime())) {
      return "Date unavailable";
    }
    return parsed.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  }
};

// src/app/shared/core/base/builders/help-center-content.builder.ts
var HelpCenterContentBuilder = class {
  static defaultTitle(kind, version, lang = "en") {
    if (this.normalizeLang(lang) === "hu") {
      return kind === "privacy" ? `Adatv\xE9delmi verzi\xF3 v${version}` : kind === "terms" ? `Felt\xE9telek verzi\xF3 v${version}` : kind === "explanation" ? `Magyar\xE1zat verzi\xF3 v${version}` : `S\xFAg\xF3 verzi\xF3 v${version}`;
    }
    return `${this.documentLabel(kind)} revision v${version}`;
  }
  static defaultDescription(kind, lang = "en") {
    if (this.normalizeLang(lang) === "hu") {
      return kind === "privacy" ? "Folytat\xE1s el\u0151tt n\xE9zd \xE1t \xE9s fogadd el, hogyan haszn\xE1lja a MyScoutee az adataidat." : kind === "terms" ? APP_STATIC_DATA.defaultTermsCenterRevisionsByLang.hu.description : kind === "explanation" ? APP_STATIC_DATA.defaultExplanationHomeRevisionsByLang.hu.description : "A MyScoutee seg\xEDt az esem\xE9nyeket elej\xE9t\u0151l v\xE9g\xE9ig megtervezni: megh\xEDv\xE1sok, szakaszok \xE9s csoportok, er\u0151forr\xE1sok, valamint kontextushoz k\xF6t\xF6tt cseveg\xE9sek.";
    }
    return kind === "privacy" ? APP_STATIC_DATA.defaultPrivacyCenterDescription : kind === "terms" ? APP_STATIC_DATA.defaultTermsCenterDescription : kind === "explanation" ? "" : APP_STATIC_DATA.defaultHelpCenterDescription;
  }
  static documentLabel(kind) {
    switch (kind) {
      case "privacy":
        return "Privacy";
      case "terms":
        return "Terms";
      case "explanation":
        return "Explanation";
      default:
        return "Help";
    }
  }
  static defaultSectionIcon(kind) {
    switch (kind) {
      case "privacy":
        return "policy";
      case "terms":
        return "rule";
      case "explanation":
        return "tips_and_updates";
      default:
        return "help_outline";
    }
  }
  static normalizeLang(lang) {
    const normalized = `${lang ?? ""}`.trim().toLowerCase().split("-")[0];
    return normalized === "hu" ? "hu" : "en";
  }
};

// src/app/shared/core/common/tournament-group-count.ts
function tournamentGroupCountForIncoming(input) {
  const groupCapacityMin = nonNegativeInteger(input.groupCapacityMin);
  const groupCapacityMax = Math.max(groupCapacityMin, nonNegativeInteger(input.groupCapacityMax));
  if (groupCapacityMin <= 0 && groupCapacityMax <= 0) {
    return 0;
  }
  const incomingCapacityMax = nonNegativeInteger(input.incomingCapacityMax);
  const stageCapacityMax = nonNegativeInteger(input.stageCapacityMax);
  const effectiveCapacityMax = incomingCapacityMax > 0 && stageCapacityMax > 0 ? Math.min(incomingCapacityMax, stageCapacityMax) : Math.max(incomingCapacityMax, stageCapacityMax);
  if (effectiveCapacityMax <= 0) {
    return 0;
  }
  const divisor = Math.max(1, groupCapacityMax > 0 ? groupCapacityMax : groupCapacityMin);
  const groupsNeededForMaximum = Math.ceil(effectiveCapacityMax / divisor);
  const groupsAllowedByMinimum = groupCapacityMin > 0 ? Math.max(1, Math.floor(effectiveCapacityMax / groupCapacityMin)) : groupsNeededForMaximum;
  return Math.min(groupsNeededForMaximum, groupsAllowedByMinimum);
}
function tournamentCurrentStageFromSubEvents(items) {
  const stages = (items ?? []).filter((item) => isTournamentStage(item));
  if (stages.length === 0) {
    return null;
  }
  let currentIndex = 0;
  while (currentIndex + 1 < stages.length && normalizeStageStatus(stages[currentIndex]?.stageStatus) === "F") {
    currentIndex += 1;
  }
  const stage = stages[currentIndex];
  return {
    id: `${stage?.id ?? ""}`.trim(),
    name: `${stage?.name ?? ""}`.trim(),
    stageNumber: currentIndex + 1,
    totalStages: stages.length,
    status: normalizeStageStatus(stage?.stageStatus)
  };
}
function isTournamentStage(stage) {
  if (!stage || stage.optional === true) {
    return false;
  }
  const leaderboardType = `${stage.tournamentLeaderboardType ?? ""}`.trim().toLowerCase();
  return nonNegativeInteger(stage.tournamentGroupCapacityMin) > 0 || nonNegativeInteger(stage.tournamentGroupCapacityMax) > 0 || leaderboardType === "score" || leaderboardType === "fifa";
}
function normalizeStageStatus(value) {
  const status = `${value ?? ""}`.trim().toUpperCase();
  return status === "RS" || status === "SR" || status === "F" || status === "S" || status === "E" ? status : "A";
}
function nonNegativeInteger(value) {
  const parsed = Math.trunc(Number(value));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

// src/app/shared/core/local/source/mappers/help-center.mapper.ts
var LocalHelpCenterMapper = class {
  static toDto(record) {
    if ("approvedOptionalSectionIds" in record) {
      return this.privacyConsentDto(record);
    }
    if ("action" in record) {
      return this.auditDto(record);
    }
    return this.revisionDto(record);
  }
  static toRecord(dto) {
    if ("approvedOptionalSectionIds" in dto) {
      return this.privacyConsentRecord(dto);
    }
    if ("action" in dto) {
      return this.auditRecord(dto);
    }
    return this.revisionRecord(dto);
  }
  static revisionDto(record) {
    return {
      id: record.id,
      documentKind: this.toDocumentKind(record.documentKind),
      contextKey: record.contextKey,
      lang: record.lang,
      languageLabel: record.languageLabel,
      version: record.version,
      title: record.title,
      summary: record.summary,
      description: record.description,
      headerColor: this.toHeaderColor(record.headerColor),
      sections: record.sections.map((section) => this.toSectionDTO(section)),
      active: record.active,
      createdAtIso: record.createdAtIso,
      createdByUserId: record.createdByUserId,
      updatedAtIso: record.updatedAtIso,
      updatedByUserId: record.updatedByUserId
    };
  }
  static revisionRecord(dto) {
    return {
      id: dto.id,
      documentKind: dto.documentKind,
      contextKey: dto.contextKey,
      lang: dto.lang,
      languageLabel: dto.languageLabel,
      version: dto.version,
      title: dto.title,
      summary: dto.summary,
      description: dto.description,
      headerColor: dto.headerColor,
      sections: dto.sections.map((section) => this.toSectionRecord(section)),
      active: dto.active,
      createdAtIso: dto.createdAtIso,
      createdByUserId: dto.createdByUserId,
      updatedAtIso: dto.updatedAtIso,
      updatedByUserId: dto.updatedByUserId
    };
  }
  static auditDto(record) {
    return {
      id: record.id,
      documentKind: this.toDocumentKind(record.documentKind),
      lang: record.lang,
      languageLabel: record.languageLabel,
      revisionId: record.revisionId,
      version: record.version,
      action: this.toAuditAction(record.action),
      actorUserId: record.actorUserId,
      createdAtIso: record.createdAtIso,
      message: record.message
    };
  }
  static auditRecord(dto) {
    return {
      id: dto.id,
      documentKind: dto.documentKind,
      lang: dto.lang,
      languageLabel: dto.languageLabel,
      revisionId: dto.revisionId,
      version: dto.version,
      action: dto.action,
      actorUserId: dto.actorUserId,
      createdAtIso: dto.createdAtIso,
      message: dto.message
    };
  }
  static privacyConsentDto(record) {
    return {
      id: record.id,
      userId: record.userId,
      revisionId: record.revisionId,
      revisionVersion: record.revisionVersion,
      approvedOptionalSectionIds: [...record.approvedOptionalSectionIds],
      acceptedAtIso: record.acceptedAtIso,
      updatedAtIso: record.updatedAtIso,
      source: this.toPrivacyConsentSource(record.source)
    };
  }
  static privacyConsentRecord(dto) {
    return {
      id: dto.id,
      userId: dto.userId,
      revisionId: dto.revisionId,
      revisionVersion: dto.revisionVersion,
      approvedOptionalSectionIds: [...dto.approvedOptionalSectionIds],
      acceptedAtIso: dto.acceptedAtIso,
      updatedAtIso: dto.updatedAtIso,
      source: dto.source
    };
  }
  static toSectionDTO(record) {
    return {
      id: record.id,
      icon: record.icon,
      title: record.title,
      blurb: record.blurb,
      contentHtml: record.contentHtml,
      imageUrls: record.imageUrls ? [...record.imageUrls] : record.imageUrls,
      panelSpan: this.toSectionPanelSpan(record.panelSpan),
      optional: record.optional,
      details: record.details ? [...record.details] : record.details,
      points: record.points ? [...record.points] : record.points
    };
  }
  static toSectionRecord(dto) {
    return {
      id: dto.id,
      icon: dto.icon,
      title: dto.title,
      blurb: dto.blurb,
      contentHtml: dto.contentHtml,
      imageUrls: dto.imageUrls ? [...dto.imageUrls] : dto.imageUrls,
      panelSpan: dto.panelSpan,
      optional: dto.optional,
      details: dto.details ? [...dto.details] : dto.details,
      points: dto.points ? [...dto.points] : dto.points
    };
  }
  static toDocumentKind(value) {
    switch (`${value ?? ""}`.trim()) {
      case "help":
      case "privacy":
      case "terms":
      case "explanation":
        return value;
      default:
        return void 0;
    }
  }
  static toHeaderColor(value) {
    return AppUtils.enumValueOrNull(value, APP_STATIC_DATA.helpCenterHeaderColors) ?? void 0;
  }
  static toSectionPanelSpan(value) {
    switch (`${value ?? ""}`.trim()) {
      case "span-1":
      case "span-2":
      case "span-3":
        return value;
      default:
        return void 0;
    }
  }
  static toAuditAction(value) {
    switch (`${value ?? ""}`.trim()) {
      case "seed":
      case "create":
      case "update":
      case "activate":
      case "delete":
        return value;
      default:
        return "update";
    }
  }
  static toPrivacyConsentSource(value) {
    return `${value ?? ""}`.trim() === "settings" ? "settings" : "entry";
  }
};

// src/app/shared/core/local/source/mappers/profile-experiences.mapper.ts
var LocalProfileExperiencesMapper = class {
  static toEntry(entry) {
    const id = `${entry?.id ?? ""}`.trim();
    if (!id) {
      return null;
    }
    return {
      id,
      type: this.normalizeType(entry?.type),
      title: `${entry?.title ?? ""}`.trim(),
      org: `${entry?.org ?? ""}`.trim(),
      city: `${entry?.city ?? ""}`.trim(),
      dateFrom: `${entry?.dateFrom ?? ""}`.trim(),
      dateTo: `${entry?.dateTo ?? ""}`.trim() || "Present",
      description: `${entry?.description ?? ""}`.trim()
    };
  }
  static toEntries(entries) {
    return entries.map((entry) => this.toEntry(entry)).filter((entry) => Boolean(entry));
  }
  static cloneEntries(entries) {
    return entries.map((entry) => __spreadValues({}, entry));
  }
  static normalizeType(value) {
    if (value === "School" || value === "Online Session" || value === "Additional Project") {
      return value;
    }
    return "Workspace";
  }
};

// src/app/shared/core/local/source/mappers/chat-message.mapper.ts
var LocalChatMessageMapper = class {
  static toDto(record) {
    return {
      id: record.messageId,
      clientId: record.clientId ?? void 0,
      sender: record.senderName,
      senderAvatar: this.avatarToDto(record.senderAvatar),
      text: record.bodyText,
      time: record.timeLabel,
      sentAtIso: record.sentAtIso,
      mine: record.mine,
      readBy: (record.readBy ?? []).map((reader) => this.avatarToDto(reader)),
      deliveryState: record.deliveryState ?? void 0,
      deletedAtIso: record.deletedAtIso,
      deletedByUserId: record.deletedByUserId,
      deletedByName: record.deletedByName,
      editedAtIso: record.editedAtIso,
      pinnedAtIso: record.pinnedAtIso,
      pinnedByUserId: record.pinnedByUserId,
      replyTo: record.replyTo ? {
        id: record.replyTo.messageId,
        sender: record.replyTo.senderName,
        text: record.replyTo.bodyText
      } : record.replyTo,
      reactions: (record.reactions ?? []).map((reaction) => this.reactionToDto(reaction)),
      attachments: (record.attachments ?? []).map((attachment) => this.attachmentToDto(attachment))
    };
  }
  static toRecord(ownerUserId, chatId, dto) {
    const normalizedOwnerUserId = `${ownerUserId ?? ""}`.trim();
    const normalizedChatId = `${chatId ?? ""}`.trim();
    const messageId = `${dto.id ?? ""}`.trim();
    return {
      recordId: this.recordKey(normalizedOwnerUserId, normalizedChatId, messageId),
      ownerUserId: normalizedOwnerUserId,
      chatId: normalizedChatId,
      messageId,
      clientId: dto.clientId ?? null,
      senderName: `${dto.sender ?? ""}`.trim(),
      senderAvatar: this.avatarToRecord(dto.senderAvatar),
      bodyText: `${dto.text ?? ""}`,
      timeLabel: `${dto.time ?? ""}`.trim(),
      sentAtIso: `${dto.sentAtIso ?? ""}`.trim(),
      mine: dto.mine === true,
      readBy: (dto.readBy ?? []).map((reader) => this.avatarToRecord(reader)),
      deliveryState: dto.deliveryState ?? null,
      deletedAtIso: dto.deletedAtIso ?? null,
      deletedByUserId: dto.deletedByUserId ?? null,
      deletedByName: dto.deletedByName ?? null,
      editedAtIso: dto.editedAtIso ?? null,
      pinnedAtIso: dto.pinnedAtIso ?? null,
      pinnedByUserId: dto.pinnedByUserId ?? null,
      replyTo: dto.replyTo ? {
        messageId: `${dto.replyTo.id ?? ""}`.trim(),
        senderName: `${dto.replyTo.sender ?? ""}`.trim(),
        bodyText: `${dto.replyTo.text ?? ""}`
      } : dto.replyTo,
      reactions: (dto.reactions ?? []).map((reaction) => this.reactionToRecord(reaction)),
      attachments: (dto.attachments ?? []).map((attachment) => this.attachmentToRecord(attachment))
    };
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static recordKey(ownerUserId, chatId, messageId) {
    return `${ownerUserId.trim()}:${chatId.trim()}:${messageId.trim()}`;
  }
  static chatKey(ownerUserId, chatId) {
    return `${ownerUserId.trim()}:${chatId.trim()}`;
  }
  static avatarToDto(record) {
    return {
      id: record.userId,
      initials: record.initials,
      gender: record.gender,
      imageUrl: record.imageUrl
    };
  }
  static avatarToRecord(dto) {
    return {
      userId: `${dto.id ?? ""}`.trim(),
      initials: `${dto.initials ?? ""}`.trim(),
      gender: dto.gender,
      imageUrl: dto.imageUrl ?? null
    };
  }
  static reactionToDto(record) {
    return {
      emoji: record.emoji,
      userId: record.userId,
      userName: record.userName,
      userInitials: record.userInitials,
      userGender: record.userGender,
      reactedAtIso: record.reactedAtIso
    };
  }
  static reactionToRecord(dto) {
    return {
      emoji: `${dto.emoji ?? ""}`.trim(),
      userId: `${dto.userId ?? ""}`.trim(),
      userName: `${dto.userName ?? ""}`.trim(),
      userInitials: `${dto.userInitials ?? ""}`.trim(),
      userGender: dto.userGender,
      reactedAtIso: `${dto.reactedAtIso ?? ""}`.trim()
    };
  }
  static attachmentToDto(record) {
    return {
      id: record.attachmentId,
      type: record.type,
      title: record.title,
      entityId: record.entityId,
      assetType: record.assetType,
      ownerUserId: record.ownerUserId,
      status: record.status,
      unavailableReason: record.unavailableReason,
      subtitle: record.subtitle,
      description: record.description,
      url: record.url,
      previewUrl: record.previewUrl,
      mimeType: record.mimeType,
      sizeBytes: record.sizeBytes
    };
  }
  static attachmentToRecord(dto) {
    return {
      attachmentId: `${dto.id ?? ""}`.trim(),
      type: dto.type,
      title: `${dto.title ?? ""}`.trim(),
      entityId: dto.entityId ?? null,
      assetType: dto.assetType ?? null,
      ownerUserId: dto.ownerUserId ?? null,
      status: dto.status ?? null,
      unavailableReason: dto.unavailableReason ?? null,
      subtitle: dto.subtitle ?? null,
      description: dto.description ?? null,
      url: dto.url ?? null,
      previewUrl: dto.previewUrl ?? null,
      mimeType: dto.mimeType ?? null,
      sizeBytes: dto.sizeBytes ?? null
    };
  }
};

// src/app/shared/core/local/source/mappers/chat-thread.mapper.ts
var LocalChatThreadMapper = class {
  static toDto(record) {
    return {
      id: record.id,
      avatar: record.avatar,
      title: record.title,
      lastMessage: record.lastMessage,
      lastSenderId: record.lastSenderId,
      memberIds: [...record.memberIds ?? []],
      members: this.cloneMembers(record.members),
      unread: Math.max(0, Math.trunc(Number(record.unread) || 0)),
      dateIso: record.dateIso,
      distanceKm: record.distanceKm,
      distanceMetersExact: record.distanceMetersExact,
      channelType: record.channelType,
      serviceContext: record.serviceContext,
      ownerId: record.ownerId,
      eventId: record.eventId,
      ownerStatus: record.ownerStatus ?? null,
      revision: Math.max(1, Math.trunc(Number(record.revision) || 1)),
      subEventId: record.subEventId,
      supportCase: this.cloneSupportCase(record.supportCase),
      ownerUserId: record.ownerUserId,
      metrics: null
    };
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static toMap(records) {
    const result = /* @__PURE__ */ new Map();
    for (const record of records ?? []) {
      const ownerId = `${record.ownerId ?? ""}`.trim();
      if (ownerId) {
        result.set(ownerId, this.toDto(record));
      }
    }
    return result;
  }
  static toDtoPage(page) {
    return {
      items: this.toDtoList(page.items),
      total: Math.max(0, Math.trunc(Number(page.total) || 0)),
      nextCursor: page.nextCursor ?? null
    };
  }
  static withMetrics(dto, metrics) {
    return __spreadProps(__spreadValues({}, dto), {
      memberIds: [...dto.memberIds ?? []],
      members: this.cloneMembers(dto.members),
      supportCase: this.cloneSupportCase(dto.supportCase),
      metrics: this.cloneMetrics(metrics)
    });
  }
  static cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      memberIds: [...record.memberIds],
      members: this.cloneMembers(record.members),
      supportCase: this.cloneSupportCase(record.supportCase)
    });
  }
  static buildRecordKey(ownerUserId, sourceId) {
    return `${ownerUserId}:${sourceId}`;
  }
  static cloneSupportCase(supportCase) {
    return supportCase ? __spreadProps(__spreadValues({}, supportCase), {
      assignee: supportCase.assignee ? __spreadValues({}, supportCase.assignee) : supportCase.assignee
    }) : supportCase;
  }
  static cloneMetrics(metrics) {
    return metrics ? {
      members: metrics.members ? __spreadValues({}, metrics.members) : null,
      transport: metrics.transport ? __spreadValues({}, metrics.transport) : null,
      accommodation: metrics.accommodation ? __spreadValues({}, metrics.accommodation) : null,
      supplies: metrics.supplies ? __spreadValues({}, metrics.supplies) : null,
      groupsCount: metrics.groupsCount ?? null,
      pendingTotal: Math.max(0, Math.trunc(Number(metrics.pendingTotal) || 0))
    } : null;
  }
  static cloneMembers(members) {
    return members ? members.map((member) => __spreadValues({}, member)) : members;
  }
};

// src/app/shared/core/base/mappers/rate.mapper.ts
var BaseUserRatesMapper = class {
  static toRecord(ownerUserIdOrInput, item) {
    if (typeof ownerUserIdOrInput === "string") {
      return this.toActivityRateRecord(ownerUserIdOrInput, item);
    }
    switch (ownerUserIdOrInput.kind) {
      case "game-card":
        return this.toGameCardRateRecord(ownerUserIdOrInput);
      case "game-card-pair":
        return this.toGameCardPairRateRecord(ownerUserIdOrInput);
      case "activity-rate":
        return this.toActivityRateInputRecord(ownerUserIdOrInput);
      default:
        return null;
    }
  }
  static toActivityRateRecord(ownerUserId, item) {
    const normalizedOwnerUserId = ownerUserId.trim();
    const normalizedCounterpartyUserId = item.userId.trim();
    const normalizedSecondaryUserId = item.secondaryUserId?.trim() ?? "";
    const activityRateId = item.id.trim() || this.createRateId();
    const scoreGiven = this.normalizeRateScore(item.scoreGiven);
    const scoreReceived = this.normalizeRateScore(item.scoreReceived);
    let fromUserId = normalizedOwnerUserId;
    let toUserId = normalizedCounterpartyUserId;
    let rate = scoreGiven;
    if (item.mode === "pair" && normalizedSecondaryUserId && normalizedSecondaryUserId !== normalizedCounterpartyUserId) {
      fromUserId = normalizedCounterpartyUserId;
      toUserId = normalizedSecondaryUserId;
      rate = item.direction === "received" ? scoreReceived : scoreGiven;
    } else {
      if (item.direction === "received") {
        fromUserId = normalizedCounterpartyUserId;
        toUserId = normalizedOwnerUserId;
        rate = scoreReceived;
      } else if (item.direction === "met") {
        rate = 0;
      }
    }
    const happenedAtIso = item.happenedAt?.trim() || (/* @__PURE__ */ new Date()).toISOString();
    return {
      id: activityRateId,
      fromUserId,
      toUserId,
      rate,
      mode: item.mode === "pair" ? "pair" : "single",
      createdAtIso: happenedAtIso,
      updatedAtIso: happenedAtIso,
      ownerUserId: normalizedOwnerUserId,
      displayId: activityRateId,
      displayDirection: item.direction,
      socialContext: item.socialContext,
      bridgeUserId: item.bridgeUserId,
      bridgeCount: item.bridgeCount,
      scoreGiven,
      scoreReceived,
      eventName: item.eventName,
      happenedAtIso,
      distanceMetersExact: this.normalizeDistanceMetersExact(item.distanceMetersExact)
    };
  }
  static toGameCardRateRecord(input) {
    const normalizedRaterId = input.raterUserId.trim();
    const normalizedRatedUserId = input.ratedUserId.trim();
    const mode = input.mode === "pair" ? "pair" : "single";
    if (!normalizedRaterId || !normalizedRatedUserId || normalizedRaterId === normalizedRatedUserId) {
      return null;
    }
    const normalizedRating = this.normalizeRequiredRateScore(input.rating);
    if (!Number.isFinite(normalizedRating) || normalizedRating <= 0) {
      return null;
    }
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const normalizedSocialContext = this.normalizeRateSocialContext(mode, input.socialContext);
    const normalizedBridgeUserId = normalizedSocialContext === "friends-in-common" ? input.bridgeUserId?.trim() ?? "" : "";
    const normalizedBridgeCount = normalizedSocialContext === "friends-in-common" && Number.isFinite(Number(input.bridgeCount)) ? Math.max(1, Math.trunc(Number(input.bridgeCount))) : void 0;
    return this.toActivityRateRecord(normalizedRaterId, __spreadProps(__spreadValues(__spreadValues({
      id: `game-card:${normalizedRaterId}:${normalizedRatedUserId}`,
      userId: normalizedRatedUserId,
      mode: mode === "pair" ? "pair" : "individual",
      direction: "given",
      socialContext: normalizedSocialContext ?? void 0
    }, normalizedBridgeUserId ? { bridgeUserId: normalizedBridgeUserId } : {}), normalizedBridgeCount ? { bridgeCount: normalizedBridgeCount } : {}), {
      scoreGiven: normalizedRating,
      scoreReceived: 0,
      eventName: "Single rate",
      happenedAt: nowIso,
      distanceMetersExact: 0
    }));
  }
  static toGameCardPairRateRecord(input) {
    const normalizedOwnerUserId = input.raterUserId.trim();
    const normalizedFirstUserId = input.firstRatedUserId.trim();
    const normalizedSecondUserId = input.secondRatedUserId.trim();
    if (!normalizedOwnerUserId || !normalizedFirstUserId || !normalizedSecondUserId || normalizedFirstUserId === normalizedSecondUserId || normalizedFirstUserId === normalizedOwnerUserId || normalizedSecondUserId === normalizedOwnerUserId) {
      return null;
    }
    const normalizedRating = this.normalizeRequiredRateScore(input.rating);
    if (!Number.isFinite(normalizedRating) || normalizedRating <= 0) {
      return null;
    }
    const [fromUserId, toUserId] = [normalizedFirstUserId, normalizedSecondUserId].sort((left, right) => left.localeCompare(right));
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    return this.toActivityRateRecord(normalizedOwnerUserId, {
      id: `game-card-pair:${normalizedOwnerUserId}:${fromUserId}:${toUserId}`,
      userId: fromUserId,
      secondaryUserId: toUserId,
      mode: "pair",
      direction: "given",
      socialContext: this.normalizeRateSocialContext("pair", input.socialContext) ?? void 0,
      scoreGiven: normalizedRating,
      scoreReceived: 0,
      eventName: "Pair rate",
      happenedAt: nowIso,
      distanceMetersExact: 0
    });
  }
  static toActivityRateInputRecord(input) {
    const normalizedOwnerUserId = input.ownerUserId.trim();
    const normalizedUserId = input.item.userId.trim();
    if (!normalizedOwnerUserId || !normalizedUserId) {
      return null;
    }
    const nextDirection = this.normalizeRateDirection(input.direction ?? input.item.direction);
    if (!nextDirection) {
      return null;
    }
    return this.toActivityRateRecord(normalizedOwnerUserId, __spreadProps(__spreadValues({}, input.item), {
      userId: normalizedUserId,
      secondaryUserId: input.item.secondaryUserId?.trim() || void 0,
      direction: nextDirection,
      socialContext: input.item.socialContext,
      bridgeUserId: input.item.bridgeUserId?.trim() || void 0,
      bridgeCount: Number.isFinite(input.item.bridgeCount) ? Math.max(0, Math.trunc(Number(input.item.bridgeCount))) : void 0,
      scoreGiven: this.normalizeRequiredRateScore(input.rating),
      scoreReceived: this.normalizeOptionalRateScore(input.item.scoreReceived),
      eventName: input.item.eventName?.trim() || "Rate",
      happenedAt: input.item.happenedAt?.trim() || (/* @__PURE__ */ new Date()).toISOString(),
      distanceMetersExact: Number.isFinite(input.item.distanceMetersExact) ? Math.max(0, Math.trunc(Number(input.item.distanceMetersExact))) : 0
    }));
  }
  static toDto(record) {
    const direction = record.displayDirection;
    const ownerUserId = record.ownerUserId?.trim() ?? "";
    if (!direction || !ownerUserId) {
      return null;
    }
    if (record.mode === "pair") {
      const firstUserId = record.fromUserId.trim();
      const secondUserId = record.toUserId.trim();
      if (!firstUserId || !secondUserId || firstUserId === secondUserId) {
        return null;
      }
      const socialContext = this.resolvePairSocialContext(record);
      if (direction === "received") {
        if (firstUserId === ownerUserId) {
          return {
            id: record.displayId?.trim() || record.id,
            userId: secondUserId,
            secondaryUserId: firstUserId,
            mode: "pair",
            direction,
            socialContext,
            bridgeUserId: record.bridgeUserId,
            bridgeCount: record.bridgeCount,
            scoreGiven: this.normalizeRateScore(record.scoreGiven),
            scoreReceived: this.normalizeRateScore(record.scoreReceived),
            eventName: record.eventName?.trim() || "Rate",
            happenedAt: record.happenedAtIso?.trim() || record.updatedAtIso,
            distanceMetersExact: this.normalizeDistanceMetersExact(record.distanceMetersExact)
          };
        }
        if (secondUserId === ownerUserId) {
          return {
            id: record.displayId?.trim() || record.id,
            userId: firstUserId,
            secondaryUserId: secondUserId,
            mode: "pair",
            direction,
            socialContext,
            bridgeUserId: record.bridgeUserId,
            bridgeCount: record.bridgeCount,
            scoreGiven: this.normalizeRateScore(record.scoreGiven),
            scoreReceived: this.normalizeRateScore(record.scoreReceived),
            eventName: record.eventName?.trim() || "Rate",
            happenedAt: record.happenedAtIso?.trim() || record.updatedAtIso,
            distanceMetersExact: this.normalizeDistanceMetersExact(record.distanceMetersExact)
          };
        }
      } else if (firstUserId === ownerUserId || secondUserId === ownerUserId) {
        return null;
      }
      return {
        id: record.displayId?.trim() || record.id,
        userId: firstUserId,
        secondaryUserId: secondUserId,
        mode: "pair",
        direction,
        socialContext,
        bridgeUserId: record.bridgeUserId,
        bridgeCount: record.bridgeCount,
        scoreGiven: this.normalizeRateScore(record.scoreGiven),
        scoreReceived: this.normalizeRateScore(record.scoreReceived),
        eventName: record.eventName?.trim() || "Rate",
        happenedAt: record.happenedAtIso?.trim() || record.updatedAtIso,
        distanceMetersExact: this.normalizeDistanceMetersExact(record.distanceMetersExact)
      };
    }
    const counterpartyUserId = record.fromUserId === ownerUserId ? record.toUserId : record.fromUserId;
    return {
      id: record.displayId?.trim() || record.id,
      userId: counterpartyUserId,
      mode: "individual",
      direction,
      socialContext: record.socialContext,
      bridgeUserId: record.bridgeUserId,
      bridgeCount: record.bridgeCount,
      scoreGiven: this.normalizeRateScore(record.scoreGiven),
      scoreReceived: this.normalizeRateScore(record.scoreReceived),
      eventName: record.eventName?.trim() || "Rate",
      happenedAt: record.happenedAtIso?.trim() || record.updatedAtIso,
      distanceMetersExact: this.normalizeDistanceMetersExact(record.distanceMetersExact)
    };
  }
  static toSyncPayload(record) {
    const id = record.id?.trim() ?? "";
    const fromUserId = record.fromUserId?.trim() ?? "";
    const toUserId = record.toUserId?.trim() ?? "";
    const mode = record.mode === "pair" ? "pair" : record.mode === "single" ? "single" : null;
    if (!id || !fromUserId || !toUserId || !mode || fromUserId === toUserId) {
      return null;
    }
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const createdAtIso = record.createdAtIso?.trim() || record.happenedAtIso?.trim() || record.updatedAtIso?.trim() || nowIso;
    const updatedAtIso = record.updatedAtIso?.trim() || createdAtIso;
    const payload = {
      id,
      fromUserId,
      toUserId,
      rate: this.normalizeOptionalRateScore(record.rate),
      mode,
      createdAtIso,
      updatedAtIso
    };
    const ownerUserId = record.ownerUserId?.trim() ?? "";
    if (ownerUserId) {
      payload.ownerUserId = ownerUserId;
    }
    const displayId = record.displayId?.trim() ?? "";
    if (displayId) {
      payload.displayId = displayId;
    }
    const displayDirection = this.normalizeRateDirection(record.displayDirection);
    if (displayDirection) {
      payload.displayDirection = displayDirection;
    }
    const socialContext = this.normalizeRateSocialContext(mode, record.socialContext);
    if (socialContext) {
      payload.socialContext = socialContext;
    }
    const bridgeUserId = record.bridgeUserId?.trim() ?? "";
    if (bridgeUserId) {
      payload.bridgeUserId = bridgeUserId;
    }
    if (Number.isFinite(Number(record.bridgeCount))) {
      payload.bridgeCount = Math.max(0, Math.trunc(Number(record.bridgeCount)));
    }
    payload.scoreGiven = this.normalizeOptionalRateScore(record.scoreGiven);
    payload.scoreReceived = this.normalizeOptionalRateScore(record.scoreReceived);
    const eventName = record.eventName?.trim() ?? "";
    if (eventName) {
      payload.eventName = eventName;
    }
    const happenedAtIso = record.happenedAtIso?.trim() ?? "";
    if (happenedAtIso) {
      payload.happenedAtIso = happenedAtIso;
    }
    if (Number.isFinite(Number(record.distanceMetersExact))) {
      payload.distanceMetersExact = Math.max(0, Math.trunc(Number(record.distanceMetersExact)));
    }
    return payload;
  }
  static normalizeRateDirection(direction) {
    if (direction === "given" || direction === "received" || direction === "mutual" || direction === "met") {
      return direction;
    }
    return null;
  }
  static normalizeRateScore(value) {
    if (!Number.isFinite(Number(value))) {
      return 0;
    }
    return Math.max(0, Math.min(10, Math.trunc(Number(value))));
  }
  static normalizeOptionalRateScore(value) {
    if (!Number.isFinite(Number(value))) {
      return 0;
    }
    return Math.max(0, Math.min(10, Math.trunc(Number(value))));
  }
  static normalizeRequiredRateScore(value) {
    return Math.max(1, Math.min(10, Math.trunc(Number(value) || 0)));
  }
  static normalizeRateSocialContext(mode, value) {
    if (mode === "single") {
      return value === "friends-in-common" ? "friends-in-common" : null;
    }
    return value === "separated-friends" ? "separated-friends" : null;
  }
  static createRateId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `rate-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
  static resolvePairSocialContext(record) {
    return record.socialContext;
  }
  static normalizeDistanceMetersExact(value) {
    if (Number.isFinite(Number(value))) {
      return Math.max(0, Math.trunc(Number(value)));
    }
    return 0;
  }
};

// src/app/shared/core/local/source/mappers/rate.mapper.ts
var LocalUserRatesMapper = class {
  static toRecord(ownerUserIdOrInput, item) {
    return typeof ownerUserIdOrInput === "string" ? BaseUserRatesMapper.toRecord(ownerUserIdOrInput, item) : BaseUserRatesMapper.toRecord(ownerUserIdOrInput);
  }
  static toDto(record) {
    return BaseUserRatesMapper.toDto(record);
  }
};
var LocalUserFilterPreferencesMapper = class {
  static toDto(record) {
    return this.clone(record);
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static toRecord(dto) {
    return this.clone(dto);
  }
  static toRecordList(dtos) {
    return dtos.map((dto) => this.toRecord(dto));
  }
  static clone(preferences) {
    return __spreadProps(__spreadValues({}, preferences), {
      interests: [...preferences.interests ?? []],
      values: [...preferences.values ?? []],
      physiques: [...preferences.physiques ?? []],
      languages: [...preferences.languages ?? []],
      genders: [...preferences.genders ?? []],
      horoscopes: [...preferences.horoscopes ?? []],
      traitLabels: [...preferences.traitLabels ?? []],
      smoking: [...preferences.smoking ?? []],
      drinking: [...preferences.drinking ?? []],
      workout: [...preferences.workout ?? []],
      pets: [...preferences.pets ?? []],
      familyPlans: [...preferences.familyPlans ?? []],
      children: [...preferences.children ?? []],
      loveStyles: [...preferences.loveStyles ?? []],
      communicationStyles: [...preferences.communicationStyles ?? []],
      sexualOrientations: [...preferences.sexualOrientations ?? []],
      religions: [...preferences.religions ?? []]
    });
  }
};

// src/app/shared/core/local/source/mappers/user.mapper.ts
var LocalUsersMapper = class {
  static toDto(record) {
    return this.cloneUser(record);
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static toSelectorListItem(record) {
    return {
      id: record.id,
      name: record.name,
      city: record.city,
      initials: record.initials,
      avatarUrl: (record.images ?? []).find((imageUrl) => `${imageUrl ?? ""}`.trim())?.replace(/\/large\.webp$/, "/small.webp") ?? "",
      gender: record.gender,
      statusText: record.statusText,
      completion: record.completion,
      profileFormVersion: record.profileFormVersion,
      status: record.status,
      deletedAtIso: record.deletedAtIso ?? null
    };
  }
  static toSelectorListItemList(records) {
    return records.map((record) => this.toSelectorListItem(record));
  }
  static toRecord(dto) {
    const record = this.cloneUser(dto);
    record.images = this.normalizeImages(record.images);
    record.affinity = this.resolveUserAffinity(record);
    return record;
  }
  static toRecordList(dtos) {
    return dtos.map((dto) => this.toRecord(dto));
  }
  static cloneRecord(record) {
    return this.toRecord(this.toDto(record));
  }
  static cloneUser(user) {
    return __spreadProps(__spreadValues({}, user), {
      locationCoordinates: user.locationCoordinates ? {
        latitude: user.locationCoordinates.latitude,
        longitude: user.locationCoordinates.longitude
      } : void 0,
      languages: [...user.languages ?? []],
      images: [...user.images ?? []],
      profileDetails: user.profileDetails ? user.profileDetails.map((group) => ({
        title: `${group.title ?? ""}`,
        rows: (group.rows ?? []).map((row) => ({
          labelKey: `${row.labelKey ?? ""}`,
          value: `${row.value ?? ""}`,
          privacy: row.privacy,
          options: [...row.options ?? []]
        }))
      })) : void 0,
      impressions: user.impressions ? {
        host: user.impressions.host ? __spreadProps(__spreadValues({}, user.impressions.host), {
          vibeBadges: [...user.impressions.host.vibeBadges ?? []],
          personalityBadges: [...user.impressions.host.personalityBadges ?? []],
          personalityTraits: (user.impressions.host.personalityTraits ?? []).map((trait) => __spreadValues({}, trait)),
          categoryBadges: [...user.impressions.host.categoryBadges ?? []]
        }) : void 0,
        member: user.impressions.member ? __spreadProps(__spreadValues({}, user.impressions.member), {
          vibeBadges: [...user.impressions.member.vibeBadges ?? []],
          personalityBadges: [...user.impressions.member.personalityBadges ?? []],
          personalityTraits: (user.impressions.member.personalityTraits ?? []).map((trait) => __spreadValues({}, trait)),
          categoryBadges: [...user.impressions.member.categoryBadges ?? []]
        }) : void 0
      } : void 0,
      notificationPreferences: user.notificationPreferences ? {
        muted: user.notificationPreferences.muted === true
      } : void 0,
      activities: __spreadValues({}, user.activities)
    });
  }
  static normalizeImages(images) {
    return (images ?? []).map((image) => image?.trim() ?? "").filter((image) => image.length > 0);
  }
  static resolveUserAffinity(user) {
    const tokens = this.uniqueAffinityTokens([
      user.name,
      user.city,
      user.physique,
      ...user.languages ?? [],
      user.horoscope,
      user.gender,
      user.hostTier,
      user.traitLabel
    ]);
    const heightCm = this.parseHeightCm(user.height) ?? 170;
    return this.resolveAffinityTokenScore(tokens, `user:${user.id}`) * 97 + Math.max(18, Math.trunc(Number(user.age) || 30)) * 17 + heightCm * 11 + Math.max(0, Math.trunc(Number(user.completion) || 0)) * 13;
  }
  static uniqueAffinityTokens(values) {
    const seen = /* @__PURE__ */ new Set();
    for (const value of values) {
      const normalized = AppUtils.normalizeText(`${value ?? ""}`.replace(/^#+\s*/, "").trim());
      if (normalized) {
        seen.add(normalized);
      }
    }
    return [...seen];
  }
  static resolveAffinityTokenScore(tokens, seedPrefix) {
    return tokens.reduce((total, token) => total + (AppUtils.hashText(`${seedPrefix}:${token}`) % 997 + 1), 0);
  }
  static parseHeightCm(value) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return Math.max(40, Math.min(250, parsed));
  }
};

// src/app/shared/core/local/source/mappers/activity.mapper.ts
var LocalActivityInviteCandidatesMapper = class {
  static toEntry(query, candidate) {
    const user = candidate.user;
    const rowKey = `${query.owner.sourceType}:${query.owner.ownerId}`;
    return {
      id: `${rowKey}:${user.id}`,
      userId: user.id,
      name: user.name,
      initials: user.initials,
      gender: user.gender,
      city: user.city,
      statusText: user.statusText,
      role: query.owner.isAdmin && user.id === query.activeUserId ? "Admin" : "Member",
      status: "pending",
      pendingSource: "admin",
      requestKind: "invite",
      invitedByActiveUser: true,
      metAtIso: candidate.metAtIso,
      actionAtIso: candidate.metAtIso,
      metWhere: candidate.metWhere,
      avatarUrl: AppUtils.firstImageUrl(user.images),
      profile: user
    };
  }
  static toEntries(query, candidates) {
    return candidates.map((candidate) => this.toEntry(query, candidate));
  }
};
var LocalActivityMembersBuilder = class {
  static toEntry(record, resolveProfile, involvementRecords = []) {
    return {
      id: record.id,
      userId: record.userId,
      name: record.name,
      initials: record.initials,
      gender: record.gender,
      city: record.city,
      statusText: record.statusText,
      role: record.role,
      status: record.status,
      pendingSource: record.pendingSource,
      requestKind: record.requestKind,
      invitedByActiveUser: record.invitedByActiveUser,
      invitedByUserId: record.invitedByUserId ?? null,
      metAtIso: record.metAtIso,
      actionAtIso: record.actionAtIso,
      metWhere: record.metWhere,
      avatarUrl: record.avatarUrl,
      involvements: this.toInvolvementEntries(involvementRecords),
      revision: record.updatedAtIso,
      attendanceStatus: record.attendanceStatus ?? null,
      checkedInAtIso: record.checkedInAtIso ?? null,
      checkedInByUserId: record.checkedInByUserId ?? null,
      checkedInTicketId: record.checkedInTicketId ?? null,
      profile: resolveProfile(record.userId, {
        name: record.name,
        initials: record.initials,
        city: record.city,
        gender: record.gender
      })
    };
  }
  static toRecord(owner, member, existingRecord) {
    const normalizedOwner = this.normalizeOwner(owner);
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    const _a = member, { involvements: _involvements } = _a, persistedMember = __objRest(_a, ["involvements"]);
    const invitedByUserId = member.status === "pending" && (member.requestKind === "invite" || member.requestKind === "waitlist-invite" || member.requestKind === "approval") ? member.invitedByUserId?.trim() || null : null;
    return __spreadProps(__spreadValues({}, persistedMember), {
      invitedByUserId,
      invitedByActiveUser: invitedByUserId ? member.invitedByActiveUser === true : false,
      ownerType: normalizedOwner.ownerType,
      ownerId: normalizedOwner.ownerId,
      ownerKey: this.ownerKey(normalizedOwner),
      createdMs: Number.isFinite(Number(existingRecord?.createdMs)) ? Number(existingRecord?.createdMs) : nowMs,
      updatedMs: nowMs,
      createdAtIso: existingRecord?.createdAtIso?.trim() || nowIso,
      updatedAtIso: nowIso
    });
  }
  static recordsToOwnerSnapshot(owner, records, capacityTotal) {
    const normalizedOwner = this.normalizeOwner(owner);
    const normalizedRecords = this.cloneRecords(records);
    const acceptedMemberUserIds = this.memberUserIds(normalizedRecords, (record) => record.status === "accepted");
    const pendingMemberUserIds = this.memberUserIds(normalizedRecords, (record) => record.status === "pending");
    return {
      ownerType: normalizedOwner.ownerType,
      ownerId: normalizedOwner.ownerId,
      records: normalizedRecords,
      acceptedMemberUserIds,
      pendingMemberUserIds,
      invitedMemberUserIds: this.memberUserIds(normalizedRecords, (record) => record.status === "pending" && this.isInvitationRecord(record)),
      pendingRequestMemberUserIds: this.memberUserIds(normalizedRecords, (record) => record.status === "pending" && !this.isInvitationRecord(record)),
      adminUserIds: this.memberUserIds(normalizedRecords, (record) => record.status === "accepted" && (record.role === "Admin" || record.role === "Manager")),
      capacityTotal: Math.max(acceptedMemberUserIds.length, this.normalizeCount(capacityTotal) ?? acceptedMemberUserIds.length)
    };
  }
  static ownerSnapshotToSummary(snapshot) {
    return {
      ownerType: snapshot.ownerType,
      ownerId: snapshot.ownerId,
      acceptedMembers: snapshot.acceptedMemberUserIds.length,
      pendingMembers: snapshot.pendingMemberUserIds.length,
      capacityTotal: Math.max(snapshot.acceptedMemberUserIds.length, this.normalizeCount(snapshot.capacityTotal) ?? 0),
      acceptedMemberUserIds: [...snapshot.acceptedMemberUserIds],
      pendingMemberUserIds: [...snapshot.pendingMemberUserIds]
    };
  }
  static cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      profile: record.profile ? __spreadValues({}, record.profile) : record.profile
    });
  }
  static cloneRecords(records) {
    return records.map((record) => this.cloneRecord(record));
  }
  static toInvolvementEntries(records) {
    const seen = /* @__PURE__ */ new Set();
    return records.filter((record) => record.status !== "deleted").map((record) => this.toInvolvementEntry(record)).filter((entry) => Boolean(entry)).filter((entry) => {
      const key = `${entry.ownerType}:${entry.ownerId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
  static toInvolvementEntry(record) {
    const ownerId = `${record.ownerId ?? ""}`.trim();
    if (!ownerId) {
      return null;
    }
    const scope = this.ownerTypeLabel(record.ownerType);
    const slotDate = this.slotDateLabel(ownerId);
    const label = [
      record.metWhere?.trim() || scope,
      slotDate
    ].filter((value) => value.length > 0).join(" \xB7 ");
    const detail = [
      scope,
      this.statusLabel(record.status),
      record.role
    ].filter((value) => value.length > 0).join(" \xB7 ");
    return {
      id: `${record.ownerType}:${ownerId}`,
      ownerType: record.ownerType,
      ownerId,
      label,
      detail,
      status: record.status,
      role: record.role,
      actionAtIso: record.actionAtIso
    };
  }
  static ownerTypeLabel(ownerType) {
    switch (ownerType) {
      case "event":
        return "Event";
      case "subEvent":
        return "Sub event";
      case "group":
        return "Group";
      case "asset":
        return "Asset";
    }
  }
  static statusLabel(status) {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "pending":
        return "Pending";
      case "disqualified":
        return "Disqualified";
      case "removed":
        return "Removed";
      case "deleted":
        return "Deleted";
    }
  }
  static slotDateLabel(ownerId) {
    const marker = ":slot:";
    const markerIndex = ownerId.indexOf(marker);
    if (markerIndex < 0) {
      return "";
    }
    const tail = ownerId.slice(markerIndex + marker.length);
    const separatorIndex = tail.indexOf(":");
    const dateText = separatorIndex >= 0 ? tail.slice(separatorIndex + 1) : tail;
    const dateMs = Date.parse(dateText);
    if (!Number.isFinite(dateMs)) {
      return "";
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric"
    }).format(new Date(dateMs));
  }
  static sortEntriesForManagement(entries) {
    return [...entries].sort((left, right) => {
      const priorityComparison = this.managementPriority(left) - this.managementPriority(right);
      if (priorityComparison !== 0) {
        return priorityComparison;
      }
      const actionComparison = AppUtils.toSortableDate(right.actionAtIso) - AppUtils.toSortableDate(left.actionAtIso);
      return actionComparison !== 0 ? actionComparison : left.userId.localeCompare(right.userId);
    });
  }
  static managementPriority(entry) {
    if (entry.status === "pending") {
      return 0;
    }
    if (entry.status === "accepted" && (entry.role === "Admin" || entry.role === "Manager")) {
      return 1;
    }
    if (entry.status === "accepted") {
      return 2;
    }
    return entry.status === "disqualified" ? 3 : 4;
  }
  static normalizeOwner(owner) {
    return {
      ownerType: owner.ownerType,
      ownerId: owner.ownerId.trim()
    };
  }
  static ownerKey(owner) {
    return `${owner.ownerType}:${owner.ownerId}`;
  }
  static memberUserIds(records, predicate) {
    const ids = [];
    const seen = /* @__PURE__ */ new Set();
    for (const record of records) {
      const userId = record.userId.trim();
      if (!userId || seen.has(userId) || !predicate(record)) {
        continue;
      }
      seen.add(userId);
      ids.push(userId);
    }
    return ids;
  }
  static isInvitationRecord(record) {
    return record.requestKind === "invite" || record.requestKind === "waitlist-invite";
  }
  static normalizeCount(value) {
    if (!Number.isFinite(Number(value))) {
      return null;
    }
    return Math.max(0, Math.trunc(Number(value)));
  }
};
var LocalActivityResourcesMapper = class {
  static STATUS_ACTIVE = "A";
  static STATUS_DELETED = "D";
  static normalizeRef(ref) {
    const ownerId = `${ref?.ownerId ?? ""}`.trim();
    const subEventId = `${ref?.subEventId ?? ""}`.trim();
    const assetOwnerUserId = `${ref?.assetOwnerUserId ?? ""}`.trim();
    if (!ownerId || !subEventId || !assetOwnerUserId) {
      return null;
    }
    return {
      ownerId,
      subEventId,
      assetOwnerUserId
    };
  }
  static recordId(ref) {
    return ActivityResourceBuilder.recordId(ref);
  }
  static ownerKey(ref) {
    return ActivityResourceBuilder.ownerKey(ref);
  }
  static normalizeState(state, fallbackRef) {
    return ActivityResourceBuilder.normalizeState(state, fallbackRef);
  }
  static toRecord(state, existing) {
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    return {
      id: this.recordId(state),
      status: this.STATUS_ACTIVE,
      ownerKey: this.ownerKey(state),
      ownerId: state.ownerId,
      subEventId: state.subEventId,
      assetOwnerUserId: state.assetOwnerUserId,
      assetAssignmentIds: ActivityResourceBuilder.cloneAssetAssignmentIds(state.assetAssignmentIds),
      assetSettingsByType: ActivityResourceBuilder.cloneAssetSettingsByType(state.assetSettingsByType),
      supplyContributionEntriesByAssetId: ActivityResourceBuilder.cloneSupplyContributionEntriesByAssetId(state.supplyContributionEntriesByAssetId),
      fallbackAssetCardsByType: ActivityResourceBuilder.cloneFallbackAssetCardsByType(state.fallbackAssetCardsByType),
      resourceMetricsByType: ActivityResourceBuilder.cloneResourceMetricsByType(state.resourceMetricsByType),
      createdMs: existing?.createdMs ?? nowMs,
      updatedMs: nowMs,
      createdAtIso: existing?.createdAtIso ?? nowIso,
      updatedAtIso: nowIso
    };
  }
  static toState(record) {
    if (this.isDeleted(record)) {
      return null;
    }
    const normalizedState = ActivityResourceBuilder.normalizeState({
      ownerId: record.ownerId,
      subEventId: record.subEventId,
      assetOwnerUserId: record.assetOwnerUserId,
      assetAssignmentIds: ActivityResourceBuilder.cloneAssetAssignmentIds(record.assetAssignmentIds),
      assetSettingsByType: ActivityResourceBuilder.cloneAssetSettingsByType(record.assetSettingsByType),
      supplyContributionEntriesByAssetId: ActivityResourceBuilder.cloneSupplyContributionEntriesByAssetId(record.supplyContributionEntriesByAssetId),
      fallbackAssetCardsByType: ActivityResourceBuilder.cloneFallbackAssetCardsByType(record.fallbackAssetCardsByType),
      resourceMetricsByType: ActivityResourceBuilder.cloneResourceMetricsByType(record.resourceMetricsByType)
    }, record);
    return normalizedState ? ActivityResourceBuilder.cloneState(normalizedState) : null;
  }
  static cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      assetAssignmentIds: ActivityResourceBuilder.cloneAssetAssignmentIds(record.assetAssignmentIds),
      assetSettingsByType: ActivityResourceBuilder.cloneAssetSettingsByType(record.assetSettingsByType),
      supplyContributionEntriesByAssetId: ActivityResourceBuilder.cloneSupplyContributionEntriesByAssetId(record.supplyContributionEntriesByAssetId),
      fallbackAssetCardsByType: ActivityResourceBuilder.cloneFallbackAssetCardsByType(record.fallbackAssetCardsByType)
    });
  }
  static isDeleted(record) {
    return `${record?.status ?? ""}`.trim() === this.STATUS_DELETED;
  }
};
var LocalActivitySubEventStageRuntimeMapper = class {
  static STATUS_ACTIVE = "A";
  static STATUS_DELETED = "D";
  static normalizeRef(ref) {
    const ownerId = `${ref?.ownerId ?? ""}`.trim();
    const subEventId = `${ref?.subEventId ?? ""}`.trim();
    if (!ownerId || !subEventId) {
      return null;
    }
    return {
      ownerId,
      subEventId
    };
  }
  static recordId(ref) {
    return `${ref.ownerId.trim()}:${ref.subEventId.trim()}`;
  }
  static ownerKey(ref) {
    return ref.ownerId.trim();
  }
  static normalizeState(state, fallbackRef) {
    const ref = this.normalizeRef(state) ?? this.normalizeRef(fallbackRef);
    if (!ref) {
      return null;
    }
    return {
      ownerId: ref.ownerId,
      subEventId: ref.subEventId,
      stageStatus: `${state?.stageStatus ?? ""}`.trim() || null,
      stageStatusReason: `${state?.stageStatusReason ?? ""}`.trim() || null,
      stageStatusUpdatedAt: `${state?.stageStatusUpdatedAt ?? ""}`.trim() || null,
      stageFinalizedAt: `${state?.stageFinalizedAt ?? ""}`.trim() || null,
      stageFinalizedByUserId: `${state?.stageFinalizedByUserId ?? ""}`.trim() || null,
      stageResultRevision: this.normalizeCount(state?.stageResultRevision),
      groupsCount: this.normalizeCount(state?.groupsCount)
    };
  }
  static toRecord(state, existing) {
    const normalized = this.normalizeState(state);
    if (!normalized) {
      throw new Error("Invalid sub-event stage runtime state.");
    }
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    return {
      id: this.recordId(normalized),
      status: this.STATUS_ACTIVE,
      ownerKey: this.ownerKey(normalized),
      ownerId: normalized.ownerId,
      subEventId: normalized.subEventId,
      stageStatus: `${normalized.stageStatus ?? ""}`.trim() || null,
      stageStatusReason: `${normalized.stageStatusReason ?? ""}`.trim() || null,
      stageStatusUpdatedAt: `${normalized.stageStatusUpdatedAt ?? ""}`.trim() || null,
      stageFinalizedAt: `${normalized.stageFinalizedAt ?? ""}`.trim() || null,
      stageFinalizedByUserId: `${normalized.stageFinalizedByUserId ?? ""}`.trim() || null,
      stageResultRevision: normalized.stageResultRevision ?? existing?.stageResultRevision ?? null,
      groupsCount: normalized.groupsCount ?? existing?.groupsCount ?? null,
      groupResourceMetricsByAssetOwnerId: this.cloneGroupResourceMetrics(existing?.groupResourceMetricsByAssetOwnerId),
      createdMs: existing?.createdMs ?? nowMs,
      updatedMs: nowMs,
      createdAtIso: existing?.createdAtIso ?? nowIso,
      updatedAtIso: nowIso
    };
  }
  static toState(record) {
    if (this.isDeleted(record)) {
      return null;
    }
    const normalized = this.normalizeState({
      ownerId: record.ownerId,
      subEventId: record.subEventId,
      stageStatus: record.stageStatus,
      stageStatusReason: record.stageStatusReason,
      stageStatusUpdatedAt: record.stageStatusUpdatedAt,
      stageFinalizedAt: record.stageFinalizedAt,
      stageFinalizedByUserId: record.stageFinalizedByUserId,
      stageResultRevision: record.stageResultRevision,
      groupsCount: record.groupsCount
    }, record);
    return normalized ? __spreadValues({}, normalized) : null;
  }
  static cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      groupResourceMetricsByAssetOwnerId: this.cloneGroupResourceMetrics(record.groupResourceMetricsByAssetOwnerId)
    });
  }
  static cloneGroupResourceMetrics(source) {
    return Object.fromEntries(Object.entries(source ?? {}).map(([groupId, byAssetOwner]) => [
      groupId,
      Object.fromEntries(Object.entries(byAssetOwner ?? {}).map(([assetOwnerUserId, metricsByType]) => [
        assetOwnerUserId,
        ActivityResourceBuilder.cloneResourceMetricsByType(metricsByType)
      ]))
    ]));
  }
  static isDeleted(record) {
    return `${record?.status ?? ""}`.trim() === this.STATUS_DELETED;
  }
  static normalizeCount(value) {
    if (!Number.isFinite(Number(value))) {
      return null;
    }
    return Math.max(0, Math.trunc(Number(value)));
  }
};

// src/app/shared/core/local/source/mappers/contacts.mapper.ts
var LocalContactsMapper = class {
  static toStoredContact(value) {
    if (!value) {
      return null;
    }
    const id = `${value.id ?? ""}`.trim();
    const userId = `${value.userId ?? ""}`.trim();
    if (!id && !userId) {
      return null;
    }
    return {
      id: id || userId,
      userId,
      name: `${value.name ?? ""}`.trim() || "Contact",
      initials: `${value.initials ?? ""}`.trim(),
      gender: value.gender === "woman" ? "woman" : "man",
      city: `${value.city ?? ""}`.trim(),
      avatarUrl: `${value.avatarUrl ?? ""}`.trim(),
      headline: `${value.headline ?? ""}`.trim(),
      createdAtIso: `${value.createdAtIso ?? ""}`.trim(),
      updatedAtIso: `${value.updatedAtIso ?? ""}`.trim(),
      methods: (value.methods ?? []).map((method) => this.toMethodDraft(method)).filter((method) => Boolean(method))
    };
  }
  static toStoredContacts(values) {
    return values.map((value) => this.toStoredContact(value)).filter((contact) => Boolean(contact));
  }
  static cloneContacts(contacts) {
    return contacts.map((contact) => __spreadProps(__spreadValues({}, contact), {
      methods: contact.methods.map((method) => __spreadValues({}, method))
    }));
  }
  static toMethodDraft(value) {
    if (!value) {
      return null;
    }
    const type = `${value.type ?? ""}`.trim();
    const methodType = [
      "phone",
      "sms",
      "whatsapp",
      "email",
      "facebook",
      "instagram",
      "telegram",
      "linkedin",
      "website"
    ].includes(type) ? type : "phone";
    const methodValue = `${value.value ?? ""}`.trim();
    if (!methodValue) {
      return null;
    }
    return {
      id: `${value.id ?? ""}`.trim(),
      type: methodType,
      value: methodValue
    };
  }
};

// src/app/shared/core/local/source/mappers/event.mapper.ts
var LocalActivityEventsMapper = class {
  static toDto(record) {
    return {
      id: record.id,
      userId: record.userId,
      type: record.type,
      status: record.status,
      statusBeforeSuppression: record.statusBeforeSuppression ?? null,
      trashedAtIso: record.trashedAtIso ?? null,
      adminIds: [...record.adminIds ?? []],
      title: record.title,
      subtitle: record.subtitle,
      timeframe: record.timeframe,
      inviter: record.inviter ?? null,
      activity: this.aggregateRuntimeActivity(record),
      creatorUserId: record.creatorUserId,
      creatorName: record.creatorName,
      creatorInitials: record.creatorInitials,
      creatorCity: record.creatorCity,
      organizerUserId: record.organizerUserId ?? record.creatorUserId,
      visibility: record.visibility,
      startAtIso: record.startAtIso,
      endAtIso: record.endAtIso,
      distanceKm: record.distanceKm,
      imageUrl: record.imageUrl,
      location: record.location,
      capacityTotal: record.capacityTotal,
      full: record.full === true,
      capacityMin: record.capacityMin,
      capacityMax: record.capacityMax,
      eventType: record.eventType,
      mode: ActivityEventDetailDTO.normalizeMode(record.mode),
      currentStage: record.currentStage ? __spreadValues({}, record.currentStage) : null,
      slotsEnabled: record.slotsEnabled === true,
      acceptedMembers: record.acceptedMembers,
      pendingMembers: record.pendingMembers,
      acceptedMemberUserIds: [...record.acceptedMemberUserIds ?? []],
      pendingMemberUserIds: [...record.pendingMemberUserIds ?? []],
      invitedMemberUserIds: [...record.invitedMemberUserIds ?? []],
      pendingRequestMemberUserIds: [...record.pendingRequestMemberUserIds ?? []],
      pendingReason: record.pendingReason,
      approvalRequired: record.approvalRequired === true,
      checkoutResultState: null,
      boost: record.boost
    };
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static toDtoPage(page) {
    return {
      items: page.records.map((record) => this.toDto(record)),
      total: page.total,
      nextCursor: page.nextCursor
    };
  }
  static toSubEventsSlots(parentEventId, parentRecord, query) {
    const normalizedParentEventId = `${parentEventId ?? ""}`.trim();
    const direction = `${query?.order ?? ""}`.trim().toLowerCase() === "past" ? -1 : 1;
    const nowMs = Date.now();
    const sources = this.subEventsSlotSources(normalizedParentEventId, parentRecord, query).filter((source) => source.definitions.length > 0).filter((source) => this.slotSourceMatchesOrder(source, query, nowMs)).filter((source) => this.slotSourceOverlapsRange(source, query)).sort((left, right) => direction * (this.dateMs(left.startAt) - this.dateMs(right.startAt)));
    const groupCountsBySource = this.stageGroupCountsBySource(sources, parentRecord.capacityMax);
    return sources.map((source) => this.toSubEventsSlot(source, groupCountsBySource.get(source) ?? /* @__PURE__ */ new Map()));
  }
  static toSubEventsSlot(source, groupCountsByStageId) {
    const subEventItems = this.subEventItemsForSlot(source.startAt, source.definitions, groupCountsByStageId);
    return {
      id: source.id,
      parentEventId: source.parentEventId,
      slotSourceId: source.slotSourceId,
      slotTemplateId: source.slotTemplateId,
      title: source.title,
      timeframe: source.timeframe,
      startAt: source.startAt,
      endAt: source.endAt,
      subEventItems
    };
  }
  static subEventResourceLookups(slots, assetOwnerUserId) {
    return this.subEventStateLookups(slots, assetOwnerUserId).resourceLookups;
  }
  static subEventStateLookups(slots, assetOwnerUserId) {
    const normalizedAssetOwnerUserId = `${assetOwnerUserId ?? ""}`.trim();
    const resourceLookups = [];
    const stageRuntimeLookups = [];
    for (const slot of slots ?? []) {
      const ownerId = this.subEventResourceOwnerIdFromSlot(slot);
      if (!ownerId) {
        continue;
      }
      for (let index = 0; index < (slot.subEventItems ?? []).length; index += 1) {
        const item = slot.subEventItems[index];
        const subEventId = `${item.id ?? ""}`.trim() || this.fallbackSubEventId(index);
        if (!subEventId) {
          continue;
        }
        stageRuntimeLookups.push({ ownerId, subEventId });
        if (normalizedAssetOwnerUserId) {
          resourceLookups.push({ ownerId, subEventId, assetOwnerUserId: normalizedAssetOwnerUserId });
        }
      }
    }
    return {
      resourceLookups,
      stageRuntimeLookups
    };
  }
  static subEventResourceRecordKey(ref) {
    const ownerId = `${ref.ownerId ?? ""}`.trim();
    const subEventId = `${ref.subEventId ?? ""}`.trim();
    const assetOwnerUserId = `${ref.assetOwnerUserId ?? ""}`.trim();
    return ownerId && subEventId && assetOwnerUserId ? `${ownerId}:${subEventId}:${assetOwnerUserId}` : "";
  }
  static withSubEventResourceRecords(slots, resourcesByKey, assetOwnerUserId) {
    return this.withSubEventStates(slots, resourcesByKey, /* @__PURE__ */ new Map(), assetOwnerUserId);
  }
  static subEventStageRuntimeRecordKey(ref) {
    const ownerId = `${ref.ownerId ?? ""}`.trim();
    const subEventId = `${ref.subEventId ?? ""}`.trim();
    return ownerId && subEventId ? `${ownerId}:${subEventId}` : "";
  }
  static subEventResourceMetricKey(ownerIdValue, subEventIdValue, typeValue) {
    const ownerId = `${ownerIdValue ?? ""}`.trim();
    const subEventId = `${subEventIdValue ?? ""}`.trim();
    const type = `${typeValue ?? ""}`.trim();
    return ownerId && subEventId && type ? `${ownerId}:${subEventId}:${type}` : "";
  }
  static withSubEventStates(slots, resourcesByKey, stageRuntimeByKey, assetOwnerUserId, resourceMetricsByKey = /* @__PURE__ */ new Map()) {
    return slots.map((slot) => this.withSubEventStatesForSlot(slot, resourcesByKey, stageRuntimeByKey, assetOwnerUserId, resourceMetricsByKey));
  }
  static withSubEventStatesForSlot(slot, resourcesByKey, stageRuntimeByKey, assetOwnerUserId, resourceMetricsByKey) {
    const ownerId = this.subEventResourceOwnerIdFromSlot(slot);
    return __spreadProps(__spreadValues({}, slot), {
      subEventItems: (slot.subEventItems ?? []).map((item, index) => {
        const subEventId = `${item.id ?? ""}`.trim() || this.fallbackSubEventId(index);
        const resource = resourcesByKey.get(this.subEventResourceRecordKey({
          ownerId,
          subEventId,
          assetOwnerUserId
        })) ?? null;
        const stageRuntime = stageRuntimeByKey.get(this.subEventStageRuntimeRecordKey({
          ownerId,
          subEventId
        })) ?? null;
        return this.withSubEventStageRuntime(this.withSubEventResource(item, resource, resourceMetricsByKey), stageRuntime);
      })
    });
  }
  static subEventsSlotSources(parentEventId, parentRecord, query) {
    if (!parentRecord) {
      return [];
    }
    if (this.isGeneratedSlotRecord(parentRecord)) {
      return [this.recordSlotSource(parentEventId, parentRecord)];
    }
    if (parentRecord.subEventsEnabled === false) {
      return [];
    }
    const templates = parentRecord.slotsEnabled === true ? parentRecord.slotTemplates ?? [] : [];
    if (templates.length > 0) {
      return this.templateSlotSources(parentEventId, parentRecord, templates, query);
    }
    const definitions = ActivityEventDetailDTO.normalizeSubEventDefinitions(parentRecord.subEventDefinitions ?? []);
    return definitions.length > 0 ? [{
      id: `${parentEventId}:default`,
      parentEventId,
      slotSourceId: null,
      slotTemplateId: null,
      title: null,
      timeframe: null,
      startAt: `${parentRecord.startAtIso ?? ""}`.trim() || null,
      endAt: `${parentRecord.endAtIso ?? ""}`.trim() || null,
      definitions
    }] : [];
  }
  static recordSlotSource(parentEventId, record) {
    return {
      id: `${record.id ?? ""}`.trim() || `${parentEventId}:slot`,
      parentEventId,
      slotSourceId: `${record.id ?? ""}`.trim() || null,
      slotTemplateId: `${record.slotTemplateId ?? ""}`.trim() || null,
      title: `${record.title ?? ""}`.trim() || null,
      timeframe: `${record.timeframe ?? ""}`.trim() || null,
      startAt: `${record.startAtIso ?? ""}`.trim() || null,
      endAt: `${record.endAtIso ?? ""}`.trim() || null,
      definitions: ActivityEventDetailDTO.normalizeSubEventDefinitions(record.subEventDefinitions ?? [])
    };
  }
  static templateSlotSources(parentEventId, parentRecord, templates, query) {
    const parentStart = AppUtils.parseDate(`${parentRecord.startAtIso ?? ""}`.trim());
    const parentEnd = AppUtils.parseDate(`${parentRecord.endAtIso ?? ""}`.trim());
    if (!parentStart || !parentEnd || parentEnd.getTime() < parentStart.getTime()) {
      return [];
    }
    const horizon = this.slotGenerationHorizon(parentStart, parentEnd, query);
    if (!horizon) {
      return [];
    }
    const sources = [];
    const overrideDates = new Set(templates.map((template) => this.slotOverrideDateKey(template.overrideDate)).filter((value) => Boolean(value)));
    for (const template of templates) {
      if (template.closed === true || this.slotOverrideDateKey(template.overrideDate)) {
        continue;
      }
      const templateStart = AppUtils.parseDate(`${template.startAt ?? ""}`.trim());
      if (!templateStart) {
        continue;
      }
      const definitions = this.slotTemplateSubEventDefinitions(parentRecord, template);
      const durationMs = this.subEventDefinitionsDurationMinutes(definitions) * 60 * 1e3;
      for (const startAt of this.generateSlotOccurrenceStarts(parentRecord.frequency ?? "One-time", templateStart, horizon.start, horizon.end)) {
        const occurrenceDateKey = this.slotOccurrenceAnchorDateKey(startAt, templateStart, parentStart);
        if (occurrenceDateKey && overrideDates.has(occurrenceDateKey)) {
          continue;
        }
        const endAt = new Date(startAt.getTime() + durationMs);
        if (startAt.getTime() < parentStart.getTime() || endAt.getTime() > parentEnd.getTime()) {
          continue;
        }
        sources.push(this.templateSlotSource(parentEventId, parentRecord, template, definitions, startAt, endAt));
      }
    }
    for (const template of templates) {
      if (template.closed === true || !this.slotOverrideDateKey(template.overrideDate)) {
        continue;
      }
      const startAt = AppUtils.parseDate(`${template.startAt ?? ""}`.trim());
      if (!startAt) {
        continue;
      }
      const definitions = this.slotTemplateSubEventDefinitions(parentRecord, template);
      const endAt = new Date(startAt.getTime() + this.subEventDefinitionsDurationMinutes(definitions) * 60 * 1e3);
      if (startAt.getTime() < horizon.start.getTime() || startAt.getTime() > horizon.end.getTime()) {
        continue;
      }
      if (startAt.getTime() < parentStart.getTime() || endAt.getTime() > parentEnd.getTime()) {
        continue;
      }
      sources.push(this.templateSlotSource(parentEventId, parentRecord, template, definitions, startAt, endAt));
    }
    return sources;
  }
  static templateSlotSource(parentEventId, parentRecord, template, definitions, startAt, endAt) {
    const slotTemplateId = `${template.id ?? ""}`.trim();
    const sourceId = this.generatedSlotSourceId(parentEventId, slotTemplateId, startAt);
    return {
      id: sourceId,
      parentEventId,
      slotSourceId: sourceId,
      slotTemplateId,
      title: `${parentRecord.title ?? ""}`.trim() || null,
      timeframe: this.generatedSlotTimeframe(startAt, endAt),
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      definitions: ActivityEventDetailDTO.normalizeSubEventDefinitions(definitions)
    };
  }
  static slotTemplateSubEventDefinitions(parentRecord, template) {
    const overrideDefinitions = ActivityEventDetailDTO.normalizeSubEventDefinitions(template.subEventDefinitions ?? []);
    return overrideDefinitions.length > 0 ? overrideDefinitions : ActivityEventDetailDTO.normalizeSubEventDefinitions(parentRecord.subEventDefinitions ?? []);
  }
  static slotGenerationHorizon(parentStart, parentEnd, query) {
    const rangeStart = this.queryRangeStart(query);
    const rangeEnd = this.queryRangeEnd(query);
    const nowMs = Date.now();
    const dayMs = 24 * 60 * 60 * 1e3;
    const isPast = `${query?.order ?? ""}`.trim().toLowerCase() === "past";
    const defaultStart = new Date(nowMs - (isPast ? 45 : 1) * dayMs);
    const defaultEnd = new Date(nowMs + (isPast ? 1 : 45) * dayMs);
    const start = new Date(Math.max(parentStart.getTime(), (rangeStart ?? defaultStart).getTime()));
    const end = new Date(Math.min(parentEnd.getTime(), (rangeEnd ?? defaultEnd).getTime()));
    return end.getTime() < start.getTime() ? null : { start, end };
  }
  static slotSourceMatchesOrder(source, query, nowMs) {
    const start = this.dateMs(source.startAt);
    let end = this.dateMs(source.endAt);
    if (!Number.isFinite(end) || end <= 0) {
      end = start;
    }
    if (!Number.isFinite(end) || end <= 0) {
      return false;
    }
    const isPast = end < nowMs;
    return `${query?.order ?? ""}`.trim().toLowerCase() === "past" ? isPast : !isPast;
  }
  static slotSourceOverlapsRange(source, query) {
    const rangeStart = this.queryRangeStart(query);
    const rangeEnd = this.queryRangeEnd(query);
    if (!rangeStart && !rangeEnd) {
      return true;
    }
    const start = this.dateMs(source.startAt);
    let end = this.dateMs(source.endAt);
    if (!Number.isFinite(end) || end <= 0) {
      end = start;
    }
    if (rangeStart && end < rangeStart.getTime()) {
      return false;
    }
    if (rangeEnd && start > rangeEnd.getTime()) {
      return false;
    }
    return true;
  }
  static subEventDefinitionsDurationMinutes(definitions) {
    return this.subEventDefinitionTimeline(definitions).reduce((maxEnd, entry) => Math.max(maxEnd, entry.startOffsetMinutes + entry.durationMinutes), 0);
  }
  static generateSlotOccurrenceStarts(frequency, templateStart, horizonStart, horizonEnd) {
    const normalizedFrequency = `${frequency ?? ""}`.trim().toLowerCase();
    if (!normalizedFrequency || normalizedFrequency === "one-time" || normalizedFrequency === "custom") {
      return templateStart.getTime() >= horizonStart.getTime() && templateStart.getTime() <= horizonEnd.getTime() ? [new Date(templateStart)] : [];
    }
    const starts = [];
    const cursor = new Date(horizonStart);
    cursor.setHours(0, 0, 0, 0);
    const endDate = new Date(horizonEnd);
    endDate.setHours(0, 0, 0, 0);
    while (cursor.getTime() <= endDate.getTime()) {
      if (this.matchesSlotFrequency(cursor, templateStart, normalizedFrequency)) {
        const next = new Date(cursor);
        next.setHours(templateStart.getHours(), templateStart.getMinutes(), templateStart.getSeconds(), templateStart.getMilliseconds());
        if (next.getTime() >= horizonStart.getTime() && next.getTime() <= horizonEnd.getTime()) {
          starts.push(next);
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return starts;
  }
  static matchesSlotFrequency(date, templateStart, frequency) {
    if (frequency === "daily") {
      return true;
    }
    if (frequency === "weekly") {
      return date.getDay() === templateStart.getDay();
    }
    if (frequency === "bi-weekly" || frequency === "biweekly") {
      if (date.getDay() !== templateStart.getDay()) {
        return false;
      }
      const diffDays = Math.floor((date.getTime() - AppUtils.dateOnly(templateStart).getTime()) / (24 * 60 * 60 * 1e3));
      const diffWeeks = Math.floor(diffDays / 7);
      return diffWeeks >= 0 && diffWeeks % 2 === 0;
    }
    if (frequency === "monthly") {
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      return date.getDate() === Math.min(templateStart.getDate(), lastDayOfMonth);
    }
    if (frequency === "yearly" || frequency === "annual" || frequency === "annually") {
      if (date.getMonth() !== templateStart.getMonth()) {
        return false;
      }
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      return date.getDate() === Math.min(templateStart.getDate(), lastDayOfMonth);
    }
    return false;
  }
  static generatedSlotSourceId(parentEventId, slotTemplateId, startAt) {
    return `${parentEventId}:slot:${slotTemplateId}:${startAt.toISOString()}`;
  }
  static generatedSlotTimeframe(startAt, endAt) {
    const dateLabel = startAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startLabel = startAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const endLabel = endAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${dateLabel} \xB7 ${startLabel} - ${endLabel}`;
  }
  static queryRangeStart(query) {
    const value = `${query?.rangeStart ?? ""}`.trim();
    const parsed = AppUtils.parseDateOnly(value);
    return parsed ? AppUtils.dateOnly(parsed) : null;
  }
  static queryRangeEnd(query) {
    const value = `${query?.rangeEnd ?? ""}`.trim();
    const parsed = AppUtils.parseDateOnly(value);
    if (!parsed) {
      return null;
    }
    const end = AppUtils.dateOnly(parsed);
    end.setHours(23, 59, 59, 999);
    return end;
  }
  static slotOverrideDateKey(value) {
    const raw = `${value ?? ""}`.trim();
    if (!raw) {
      return null;
    }
    const parsed = AppUtils.parseDate(raw.includes("T") ? raw : `${raw}T00:00`);
    if (!parsed) {
      return null;
    }
    const year = parsed.getFullYear();
    const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
    const day = `${parsed.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  static slotOccurrenceAnchorDateKey(occurrenceStart, templateStart, parentStart) {
    const templateOffsetMs = templateStart.getTime() - parentStart.getTime();
    return this.slotOverrideDateKey(new Date(occurrenceStart.getTime() - templateOffsetMs).toISOString());
  }
  static dateMs(value) {
    return AppUtils.parseDate(value)?.getTime() ?? Number.POSITIVE_INFINITY;
  }
  static subEventItemsForSlot(slotStartIso, definitions, groupCountsByStageId) {
    const slotStart = AppUtils.parseDate(`${slotStartIso ?? ""}`.trim()) ?? /* @__PURE__ */ new Date();
    return this.subEventDefinitionTimeline(definitions).map(({ item, startOffsetMinutes, durationMinutes }, index) => {
      const startAt = new Date(slotStart.getTime() + startOffsetMinutes * 60 * 1e3);
      const endAt = new Date(startAt.getTime() + durationMinutes * 60 * 1e3);
      const isTournamentStage2 = this.isTournamentStageDefinition(item);
      const stageStatus = isTournamentStage2 ? "RS" : void 0;
      const stageId = `${item.id ?? this.fallbackSubEventId(index)}`.trim() || this.fallbackSubEventId(index);
      return {
        id: stageId,
        name: `${item.name ?? `Sub Event ${index + 1}`}`.trim(),
        description: `${item.description ?? ""}`.trim(),
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        location: `${item.location ?? ""}`.trim(),
        tournamentGroupCapacityMin: item.tournamentGroupCapacityMin,
        tournamentGroupCapacityMax: item.tournamentGroupCapacityMax,
        tournamentLeaderboardType: item.tournamentLeaderboardType,
        tournamentAdvancePerGroup: item.tournamentAdvancePerGroup,
        optional: item.optional,
        pricing: item.pricing ? PricingBuilder.clonePricingConfig(item.pricing) : item.pricing,
        capacityMin: item.capacityMin,
        capacityMax: item.capacityMax,
        membersAccepted: 0,
        membersPending: 0,
        groupsCount: groupCountsByStageId.get(stageId),
        groupsPending: 0,
        carsPending: 0,
        accommodationPending: 0,
        suppliesPending: 0,
        slotStartOffsetMinutes: startOffsetMinutes,
        slotDurationMinutes: durationMinutes,
        stageStatus,
        stageStatusReason: stageStatus === "RS" ? "awaiting-tournament-start" : void 0
      };
    });
  }
  static subEventDefinitionTimeline(items) {
    let previousStartOffsetMinutes = 0;
    let previousEndOffsetMinutes = 0;
    let hasPrevious = false;
    return ActivityEventDetailDTO.normalizeSubEventDefinitions(items).map((item) => {
      const durationMinutes = Math.max(0, Math.trunc(Number(item.durationMinutes) || 0));
      const offsetMinutes = Math.max(0, Math.trunc(Number(item.offsetMinutes) || 0));
      const timing = ActivityEventDetailDTO.normalizeSubEventDefinitionTiming(item.timing);
      const startOffsetMinutes = !hasPrevious ? offsetMinutes : timing === "During" ? previousStartOffsetMinutes + offsetMinutes : previousEndOffsetMinutes + offsetMinutes;
      previousStartOffsetMinutes = startOffsetMinutes;
      previousEndOffsetMinutes = startOffsetMinutes + durationMinutes;
      hasPrevious = true;
      return { item, startOffsetMinutes, durationMinutes };
    });
  }
  static isTournamentStageDefinition(item) {
    return item.optional !== true && ((item.tournamentGroupCapacityMin ?? 0) > 0 || (item.tournamentGroupCapacityMax ?? 0) > 0 || item.tournamentLeaderboardType === "Score" || item.tournamentLeaderboardType === "Fifa");
  }
  static stageGroupCountsByStageId(definitions, eventCapacityMax) {
    const countsByStageId = /* @__PURE__ */ new Map();
    let incomingCapacityMax = this.nonNegativeInteger(eventCapacityMax);
    this.subEventDefinitionTimeline(definitions).forEach(({ item }, index) => {
      const stageId = `${item.id ?? this.fallbackSubEventId(index)}`.trim() || this.fallbackSubEventId(index);
      const groupCount = this.autoTournamentGroupCountForIncoming(item, incomingCapacityMax);
      countsByStageId.set(stageId, groupCount);
      if (!this.isTournamentStageDefinition(item)) {
        return;
      }
      const advancePerGroup = this.nonNegativeInteger(item.tournamentAdvancePerGroup);
      incomingCapacityMax = groupCount > 0 && advancePerGroup > 0 ? groupCount * advancePerGroup : 0;
    });
    return countsByStageId;
  }
  static stageGroupCountsBySource(sources, eventCapacityMax) {
    const countsBySource = /* @__PURE__ */ new Map();
    const countsByDefinitionsKey = /* @__PURE__ */ new Map();
    for (const source of sources) {
      const key = this.stageGroupCalculationKey(source.definitions, eventCapacityMax);
      let countsByStageId = countsByDefinitionsKey.get(key);
      if (!countsByStageId) {
        countsByStageId = this.stageGroupCountsByStageId(source.definitions, eventCapacityMax);
        countsByDefinitionsKey.set(key, countsByStageId);
      }
      countsBySource.set(source, countsByStageId);
    }
    return countsBySource;
  }
  static stageGroupCalculationKey(definitions, eventCapacityMax) {
    return [
      this.nonNegativeInteger(eventCapacityMax),
      ...ActivityEventDetailDTO.normalizeSubEventDefinitions(definitions).map((item, index) => [
        `${item.id ?? this.fallbackSubEventId(index)}`.trim() || this.fallbackSubEventId(index),
        item.optional === true ? "1" : "0",
        this.nonNegativeInteger(item.tournamentGroupCapacityMin),
        this.nonNegativeInteger(item.tournamentGroupCapacityMax),
        `${item.tournamentLeaderboardType ?? ""}`.trim(),
        this.nonNegativeInteger(item.tournamentAdvancePerGroup)
      ].join(":"))
    ].join("|");
  }
  static autoTournamentGroupCountForIncoming(item, incomingCapacityMax) {
    if (!this.isTournamentStageDefinition(item)) {
      return 0;
    }
    return tournamentGroupCountForIncoming({
      groupCapacityMin: item.tournamentGroupCapacityMin,
      groupCapacityMax: item.tournamentGroupCapacityMax,
      incomingCapacityMax,
      stageCapacityMax: item.capacityMax
    });
  }
  static withSubEventResource(item, resource, resourceMetricsByKey) {
    const car = this.resourceMetric(resource, ASSET_TYPE_TRANSPORT, {
      accepted: item.carsAccepted,
      pending: item.carsPending,
      capacityMin: item.carsCapacityMin,
      capacityMax: item.carsCapacityMax
    }, resourceMetricsByKey);
    const accommodation = this.resourceMetric(resource, ASSET_TYPE_ACCOMMODATION, {
      accepted: item.accommodationAccepted,
      pending: item.accommodationPending,
      capacityMin: item.accommodationCapacityMin,
      capacityMax: item.accommodationCapacityMax
    }, resourceMetricsByKey);
    const supplies = this.resourceMetric(resource, ASSET_TYPE_SUPPLIES, {
      accepted: item.suppliesAccepted,
      pending: item.suppliesPending,
      capacityMin: item.suppliesCapacityMin,
      capacityMax: item.suppliesCapacityMax
    }, resourceMetricsByKey);
    return __spreadProps(__spreadValues({}, item), {
      carsAccepted: car.accepted,
      carsPending: car.pending,
      carsCapacityMin: car.capacityMin,
      carsCapacityMax: car.capacityMax,
      accommodationAccepted: accommodation.accepted,
      accommodationPending: accommodation.pending,
      accommodationCapacityMin: accommodation.capacityMin,
      accommodationCapacityMax: accommodation.capacityMax,
      suppliesAccepted: supplies.accepted,
      suppliesPending: supplies.pending,
      suppliesCapacityMin: supplies.capacityMin,
      suppliesCapacityMax: supplies.capacityMax
    });
  }
  static withSubEventStageRuntime(item, stageRuntime) {
    if (!stageRuntime) {
      return item;
    }
    return __spreadProps(__spreadValues({}, item), {
      stageStatus: `${stageRuntime.stageStatus ?? ""}`.trim() || item.stageStatus,
      stageStatusReason: `${stageRuntime.stageStatusReason ?? ""}`.trim() || item.stageStatusReason,
      stageStatusUpdatedAt: `${stageRuntime.stageStatusUpdatedAt ?? ""}`.trim() || item.stageStatusUpdatedAt,
      stageFinalizedAt: `${stageRuntime.stageFinalizedAt ?? ""}`.trim() || item.stageFinalizedAt,
      stageFinalizedByUserId: `${stageRuntime.stageFinalizedByUserId ?? ""}`.trim() || item.stageFinalizedByUserId,
      stageResultRevision: stageRuntime.stageResultRevision ?? item.stageResultRevision,
      groupsCount: stageRuntime.groupsCount ?? item.groupsCount,
      groupsPending: item.groupsPending
    });
  }
  static resourceMetric(resource, type, fallback, resourceMetricsByKey) {
    if (!resource) {
      return {
        accepted: this.nonNegativeInteger(fallback.accepted),
        pending: this.nonNegativeInteger(fallback.pending),
        capacityMin: this.nonNegativeInteger(fallback.capacityMin),
        capacityMax: this.nonNegativeInteger(fallback.capacityMax)
      };
    }
    const settingsById = resource.assetSettingsByType[type] ?? {};
    const assignedIds = resource.assetAssignmentIds[type] ?? [];
    const assetIds = this.normalizedAssetIds(assignedIds.length > 0 ? assignedIds : Object.keys(settingsById));
    const capacityMin = assetIds.reduce((sum, assetId) => sum + this.nonNegativeInteger(settingsById[assetId]?.capacityMin), 0);
    const capacityMax = assetIds.reduce((sum, assetId) => sum + this.nonNegativeInteger(settingsById[assetId]?.capacityMax), 0);
    const accepted = type === ASSET_TYPE_SUPPLIES ? assetIds.reduce((sum, assetId) => sum + (resource.supplyContributionEntriesByAssetId[assetId] ?? []).reduce((entrySum, entry) => entrySum + this.nonNegativeInteger(entry.quantity), 0), 0) : assetIds.length;
    const pending = 0;
    const metric = resourceMetricsByKey.get(this.subEventResourceMetricKey(resource.ownerId, resource.subEventId, type));
    return {
      accepted: metric ? this.nonNegativeInteger(metric.accepted) : accepted,
      pending: metric ? this.nonNegativeInteger(metric.pending) : pending,
      capacityMin,
      capacityMax
    };
  }
  static normalizedAssetIds(source) {
    const ids = /* @__PURE__ */ new Set();
    source.forEach((item) => {
      const assetId = `${item ?? ""}`.trim();
      if (assetId) {
        ids.add(assetId);
      }
    });
    return [...ids];
  }
  static subEventResourceOwnerIdFromSlot(slot) {
    return `${slot.slotSourceId ?? ""}`.trim() || `${slot.parentEventId ?? ""}`.trim() || `${slot.id ?? ""}`.trim();
  }
  static fallbackSubEventId(index) {
    return `subevent-${index + 1}`;
  }
  static isGeneratedSlotRecord(record) {
    return record?.generated === true || record?.eventType === "slot" || Boolean(record?.parentEventId);
  }
  static aggregateRuntimeActivity(record) {
    const mode = ActivityEventDetailDTO.normalizeMode(record.mode);
    const subEventPending = (record.subEvents ?? []).reduce((total, item) => {
      if (mode === "Tournament") {
        return total + this.nonNegativeInteger(item.groupsPending);
      }
      return total + (item.optional === true ? this.nonNegativeInteger(item.membersPending) : 0) + this.nonNegativeInteger(item.carsPending) + this.nonNegativeInteger(item.accommodationPending) + this.nonNegativeInteger(item.suppliesPending);
    }, 0);
    return Math.max(this.nonNegativeInteger(record.activity), subEventPending);
  }
  static nonNegativeInteger(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return 0;
    }
    return Math.max(0, Math.trunc(parsed));
  }
};
var LocalActivityEventDetailsMapper = class {
  static toRecord(payload) {
    const id = payload.id.trim();
    const creatorUserId = payload.creatorUserId.trim() || payload.userId.trim();
    const adminIds = this.uniqueUserIds([
      ...payload.adminIds ?? [],
      creatorUserId
    ]);
    const creatorName = payload.creatorName.trim() || "Unknown Host";
    const creatorInitials = payload.creatorInitials.trim() || AppUtils.initialsFromText(creatorName);
    const startAtIso = payload.startAtIso.trim() || (/* @__PURE__ */ new Date()).toISOString();
    const endAtIso = payload.endAtIso.trim() || new Date(new Date(startAtIso).getTime() + 2 * 60 * 60 * 1e3).toISOString();
    const title = payload.title.trim() || "Untitled draft event";
    const subtitle = payload.subtitle.trim() || "Draft event in progress";
    const type = this.normalizeRepositoryItemType(payload.type);
    const visibility = this.normalizeVisibility(payload.visibility);
    const blindMode = this.normalizeBlindMode(payload.blindMode);
    const frequency = this.normalizeFrequency(payload.frequency);
    const hasSlots = payload.slotsEnabled === true;
    const topics = this.normalizeTopics(payload.topics);
    const slotTemplates = hasSlots ? this.normalizeSlotTemplates(payload.slotTemplates) : [];
    const subEventsEnabled = payload.subEventsEnabled !== false;
    const subEventDefinitions = ActivityEventDetailDTO.normalizeSubEventDefinitions(payload.subEventDefinitions);
    const subEvents = this.normalizeSubEvents(payload.subEvents);
    const policiesEnabled = payload.policiesEnabled === true;
    const policies = this.normalizePolicies(payload.policies);
    const slotCatalog = PricingBuilder.slotCatalogFromEventSlotTemplates(slotTemplates);
    const ticketing = payload.ticketing === true;
    const approvalRequired = payload.approvalRequired === true;
    const pricing = PricingBuilder.syncSlotOverrides(PricingBuilder.normalizePricingConfig(payload.pricing, {
      context: "event",
      slotCatalog
    }), slotCatalog);
    const acceptedMembers = this.nonNegativeInteger(payload.acceptedMembers);
    const pendingMembers = this.nonNegativeInteger(payload.pendingMembers);
    const capacityTotal = Math.max(acceptedMembers, this.normalizeCount(payload.capacityTotal) ?? this.normalizeCount(payload.capacityMax) ?? acceptedMembers);
    const rating = this.nonNegativeInteger(payload.rating) || 6 + AppUtils.hashText(`${id}:${title}`) % 35 / 10;
    const boost = this.nonNegativeInteger(payload.boost) || 50 + AppUtils.hashText(`${id}:${title}`) % 51;
    const affinity = this.nonNegativeInteger(payload.affinity) || this.resolveEventAffinity({
      id,
      title,
      subtitle,
      topics,
      visibility,
      blindMode,
      rating,
      acceptedMembers,
      capacityTotal
    });
    return {
      id,
      userId: payload.userId.trim() || creatorUserId,
      type,
      status: this.normalizeEventStatus(payload.status),
      statusBeforeSuppression: payload.statusBeforeSuppression ?? null,
      adminIds,
      avatar: payload.avatar.trim() || creatorInitials,
      title,
      subtitle,
      timeframe: payload.timeframe.trim() || this.buildTimeframeLabel(startAtIso, endAtIso, frequency),
      inviter: payload.inviter ?? null,
      unread: this.nonNegativeInteger(payload.unread),
      activity: this.nonNegativeInteger(payload.activity),
      trashedAtIso: payload.trashedAtIso ?? null,
      creatorUserId,
      creatorName,
      creatorInitials,
      creatorGender: payload.creatorGender ?? "man",
      creatorCity: payload.creatorCity,
      visibility,
      blindMode,
      startAtIso,
      endAtIso,
      distanceKm: Math.max(0, Number(payload.distanceKm) || 0),
      imageUrl: payload.imageUrl.trim(),
      sourceLink: payload.sourceLink.trim(),
      location: this.normalizeLocation(payload.location),
      locationCoordinates: this.normalizeLocationCoordinates(payload.locationCoordinates),
      capacityMin: this.normalizeCount(payload.capacityMin) ?? 0,
      capacityMax: this.normalizeCount(payload.capacityMax) ?? capacityTotal,
      capacityTotal,
      full: payload.full === true || capacityTotal > 0 && acceptedMembers >= capacityTotal,
      autoInviter: payload.autoInviter === true,
      frequency,
      ticketing,
      approvalRequired,
      pricing,
      policiesEnabled,
      policies,
      slotsEnabled: hasSlots,
      slotTemplates,
      parentEventId: payload.parentEventId ?? null,
      slotTemplateId: payload.slotTemplateId ?? null,
      generated: payload.generated === true,
      eventType: payload.eventType ?? "main",
      nextSlot: payload.nextSlot ? __spreadValues({}, payload.nextSlot) : null,
      upcomingSlots: payload.upcomingSlots.map((item) => __spreadValues({}, item)),
      checkoutBasket: ActivityEventDetailDTO.cloneCheckoutBasket(payload.checkoutBasket),
      acceptedMembers,
      pendingMembers,
      acceptedMemberUserIds: [...payload.acceptedMemberUserIds],
      pendingMemberUserIds: [...payload.pendingMemberUserIds],
      invitedMemberUserIds: [...payload.invitedMemberUserIds],
      pendingRequestMemberUserIds: [...payload.pendingRequestMemberUserIds],
      pendingReason: payload.pendingReason,
      topics,
      subEventsEnabled,
      subEventDefinitions,
      subEvents,
      mode: this.normalizeEventMode(payload.mode ?? this.inferredEventMode(subEvents)),
      currentStage: tournamentCurrentStageFromSubEvents(subEvents),
      rating,
      boost,
      affinity
    };
  }
  static toDto(record) {
    return new ActivityEventDetailDTO().apply({
      id: record.id,
      userId: record.userId,
      type: record.type,
      status: record.status,
      statusBeforeSuppression: "statusBeforeSuppression" in record ? record.statusBeforeSuppression ?? null : void 0,
      adminIds: [...record.adminIds ?? []],
      avatar: record.avatar,
      title: record.title,
      subtitle: record.subtitle,
      timeframe: record.timeframe,
      inviter: record.inviter ?? null,
      unread: record.unread,
      activity: this.aggregateRuntimeActivity(record),
      trashedAtIso: "trashedAtIso" in record ? record.trashedAtIso ?? null : void 0,
      creatorUserId: record.creatorUserId,
      creatorName: record.creatorName,
      creatorInitials: record.creatorInitials,
      creatorGender: "creatorGender" in record ? record.creatorGender : void 0,
      creatorCity: record.creatorCity,
      visibility: record.visibility,
      blindMode: record.blindMode ?? "Open Event",
      startAtIso: record.startAtIso,
      endAtIso: record.endAtIso,
      distanceKm: record.distanceKm,
      imageUrl: record.imageUrl,
      sourceLink: record.sourceLink ?? "",
      location: record.location,
      locationCoordinates: this.cloneLocationCoordinates(record.locationCoordinates),
      capacityMin: record.capacityMin,
      capacityMax: record.capacityMax,
      capacityTotal: record.capacityTotal,
      full: record.full === true,
      autoInviter: record.autoInviter ?? false,
      frequency: record.frequency ?? "One-time",
      ticketing: record.ticketing,
      approvalRequired: record.approvalRequired === true,
      pricing: record.pricing ?? null,
      policiesEnabled: record.policiesEnabled === true,
      policies: record.policies ?? [],
      slotsEnabled: record.slotsEnabled === true,
      slotTemplates: record.slotTemplates ?? [],
      parentEventId: record.parentEventId ?? null,
      slotTemplateId: record.slotTemplateId ?? null,
      generated: record.generated === true,
      eventType: record.eventType ?? "main",
      nextSlot: record.nextSlot ? __spreadValues({}, record.nextSlot) : null,
      upcomingSlots: (record.upcomingSlots ?? []).map((item) => __spreadValues({}, item)),
      checkoutBasket: ActivityEventDetailDTO.cloneCheckoutBasket(record.checkoutBasket),
      acceptedMembers: record.acceptedMembers,
      pendingMembers: record.pendingMembers,
      acceptedMemberUserIds: [...record.acceptedMemberUserIds ?? []],
      pendingMemberUserIds: [...record.pendingMemberUserIds ?? []],
      invitedMemberUserIds: [...record.invitedMemberUserIds ?? []],
      pendingRequestMemberUserIds: [...record.pendingRequestMemberUserIds ?? []],
      pendingReason: record.pendingReason,
      topics: [...record.topics ?? []],
      subEventsEnabled: record.subEventsEnabled !== false,
      subEventDefinitions: record.subEventDefinitions ?? [],
      subEvents: record.subEvents ?? [],
      mode: this.normalizeEventMode(record.mode),
      currentStage: record.currentStage ? __spreadValues({}, record.currentStage) : null,
      rating: record.rating,
      boost: record.boost,
      affinity: record.affinity,
      paymentSessionId: null
    });
  }
  static inferredEventMode(items) {
    if (items.some((item) => !item.optional && ((item.tournamentGroupCapacityMin ?? 0) > 0 || (item.tournamentGroupCapacityMax ?? 0) > 0 || item.tournamentLeaderboardType === "Score" || item.tournamentLeaderboardType === "Fifa"))) {
      return "Tournament";
    }
    return "Casual";
  }
  static normalizeEventMode(value) {
    return `${value ?? ""}`.trim().toLowerCase() === "tournament" ? "Tournament" : "Casual";
  }
  static resolveEventAffinity(options) {
    const tokens = this.uniqueAffinityTokens([
      options.title,
      options.subtitle ?? "",
      ...options.topics,
      options.visibility,
      options.blindMode
    ]);
    return this.resolveAffinityTokenScore(tokens, `event:${options.id}`) * 89 + Math.round(AppUtils.clampNumber(Number(options.rating) || 0, 0, 10) * 100) * 29 + Math.max(0, Math.trunc(Number(options.acceptedMembers) || 0)) * 19 + Math.max(0, Math.trunc(Number(options.capacityTotal) || 0)) * 7;
  }
  static uniqueAffinityTokens(values) {
    const seen = /* @__PURE__ */ new Set();
    for (const value of values) {
      const normalized = AppUtils.normalizeText(`${value ?? ""}`.replace(/^#+\s*/, "").trim());
      if (normalized) {
        seen.add(normalized);
      }
    }
    return [...seen];
  }
  static resolveAffinityTokenScore(tokens, seedPrefix) {
    return tokens.reduce((total, token) => total + (AppUtils.hashText(`${seedPrefix}:${token}`) % 997 + 1), 0);
  }
  static cloneLocationCoordinates(value) {
    if (!value || !Number.isFinite(value.latitude) || !Number.isFinite(value.longitude)) {
      return null;
    }
    return {
      latitude: value.latitude,
      longitude: value.longitude
    };
  }
  static normalizeEventStatus(status) {
    const normalized = `${status ?? ""}`.trim();
    switch (normalized) {
      case "A":
      case "DR":
      case "T":
      case "UR":
      case "B":
      case "D":
      case "I":
        return normalized;
      default:
        return "A";
    }
  }
  static normalizeTopics(topics) {
    return Array.from(new Set(topics.map((topic) => `${topic ?? ""}`.trim().replace(/^#+/, "")).filter((topic) => topic.length > 0).slice(0, 5)));
  }
  static normalizeRepositoryItemType(value) {
    return value === "hosting" || value === "invitations" ? value : "events";
  }
  static normalizeVisibility(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    if (normalized === "private" || normalized.includes("friend")) {
      return "Friends only";
    }
    if (normalized.includes("invitation")) {
      return "Invitation only";
    }
    return "Public";
  }
  static normalizeBlindMode(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    return normalized.includes("blind") ? "Blind Event" : "Open Event";
  }
  static normalizeFrequency(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    if (normalized === "custom") {
      return "Custom";
    }
    if (normalized === "daily") {
      return "Daily";
    }
    if (normalized === "weekly") {
      return "Weekly";
    }
    if (normalized.includes("bi-week") || normalized.includes("bi week")) {
      return "Bi-weekly";
    }
    if (normalized === "monthly") {
      return "Monthly";
    }
    if (normalized === "yearly" || normalized === "annual" || normalized === "annually") {
      return "Yearly";
    }
    return "One-time";
  }
  static buildTimeframeLabel(startAt, endAt, frequency) {
    const start = this.parseDate(startAt);
    const end = this.parseDate(endAt);
    if (!start || !end) {
      return startAt || endAt || "";
    }
    const dateLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const endTime = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const normalizedFrequency = this.normalizeFrequency(frequency);
    if (normalizedFrequency === "One-time") {
      return `${dateLabel} \xB7 ${startTime} - ${endTime}`;
    }
    return `${normalizedFrequency} \xB7 ${dateLabel} \xB7 ${startTime} - ${endTime}`;
  }
  static normalizePolicies(items) {
    return items.map((item, index) => ({
      id: `${item.id ?? `policy-${index + 1}`}`.trim() || `policy-${index + 1}`,
      title: `${item.title ?? ""}`.trim() || `Policy ${index + 1}`,
      description: `${item.description ?? ""}`.trim(),
      required: item.required !== false
    })).filter((item) => item.id || item.title || item.description);
  }
  static normalizeSlotTemplates(items) {
    return items.map((item, index) => {
      if (item.closed === true) {
        return {
          id: `${item.id ?? `slot-${index + 1}`}`.trim() || `slot-${index + 1}`,
          startAt: "",
          overrideDate: this.normalizeSlotOverrideDate(item.overrideDate),
          closed: true,
          subEventDefinitions: ActivityEventDetailDTO.normalizeSubEventDefinitions(item.subEventDefinitions ?? [])
        };
      }
      const normalizedStart = `${item.startAt ?? ""}`.trim();
      const parsedStart = this.parseDate(normalizedStart) ?? /* @__PURE__ */ new Date();
      return {
        id: `${item.id ?? `slot-${index + 1}`}`.trim() || `slot-${index + 1}`,
        startAt: this.parseDate(normalizedStart) ? normalizedStart : this.toIsoDateTimeLocal(parsedStart),
        overrideDate: this.normalizeSlotOverrideDate(item.overrideDate),
        closed: false,
        subEventDefinitions: ActivityEventDetailDTO.normalizeSubEventDefinitions(item.subEventDefinitions ?? [])
      };
    });
  }
  static normalizeSubEvents(items) {
    return items.map((item, index) => {
      const capacityMin = this.nonNegativeInteger(item.capacityMin);
      const capacityMax = Math.max(capacityMin, this.nonNegativeInteger(item.capacityMax));
      return {
        id: `${item.id ?? `subevent-${index + 1}`}`.trim() || `subevent-${index + 1}`,
        name: `${item.name ?? `Sub Event ${index + 1}`}`.trim(),
        description: `${item.description ?? ""}`.trim(),
        startAt: `${item.startAt ?? ""}`.trim(),
        endAt: `${item.endAt ?? ""}`.trim(),
        location: this.normalizeLocation(item.location),
        createdByUserId: item.createdByUserId?.trim() || void 0,
        optional: item.optional === true,
        pricing: this.clonePricingConfig(item.pricing),
        capacityMin,
        capacityMax,
        tournamentGroupCapacityMin: this.optionalNonNegativeInteger(item.tournamentGroupCapacityMin),
        tournamentGroupCapacityMax: this.optionalNonNegativeInteger(item.tournamentGroupCapacityMax),
        tournamentLeaderboardType: item.tournamentLeaderboardType === "Fifa" ? "Fifa" : "Score",
        tournamentAdvancePerGroup: this.optionalNonNegativeInteger(item.tournamentAdvancePerGroup),
        groupsCount: this.optionalNonNegativeInteger(item.groupsCount),
        groupsPending: this.optionalNonNegativeInteger(item.groupsPending),
        membersAccepted: this.nonNegativeInteger(item.membersAccepted),
        membersPending: this.nonNegativeInteger(item.membersPending),
        carsPending: this.nonNegativeInteger(item.carsPending),
        accommodationPending: this.nonNegativeInteger(item.accommodationPending),
        suppliesPending: this.nonNegativeInteger(item.suppliesPending),
        carsAccepted: this.optionalNonNegativeInteger(item.carsAccepted),
        accommodationAccepted: this.optionalNonNegativeInteger(item.accommodationAccepted),
        suppliesAccepted: this.optionalNonNegativeInteger(item.suppliesAccepted),
        carsCapacityMin: this.optionalNonNegativeInteger(item.carsCapacityMin),
        carsCapacityMax: this.optionalNonNegativeInteger(item.carsCapacityMax),
        accommodationCapacityMin: this.optionalNonNegativeInteger(item.accommodationCapacityMin),
        accommodationCapacityMax: this.optionalNonNegativeInteger(item.accommodationCapacityMax),
        suppliesCapacityMin: this.optionalNonNegativeInteger(item.suppliesCapacityMin),
        suppliesCapacityMax: this.optionalNonNegativeInteger(item.suppliesCapacityMax),
        slotStartOffsetMinutes: this.optionalNonNegativeInteger(item.slotStartOffsetMinutes),
        slotDurationMinutes: this.optionalNonNegativeInteger(item.slotDurationMinutes),
        stageStatus: `${item.stageStatus ?? ""}`.trim() || void 0,
        stageStatusReason: `${item.stageStatusReason ?? ""}`.trim() || void 0,
        stageStatusUpdatedAt: `${item.stageStatusUpdatedAt ?? ""}`.trim() || void 0,
        stageFinalizedAt: `${item.stageFinalizedAt ?? ""}`.trim() || void 0,
        stageFinalizedByUserId: `${item.stageFinalizedByUserId ?? ""}`.trim() || void 0,
        stageResultRevision: this.optionalNonNegativeInteger(item.stageResultRevision)
      };
    });
  }
  static clonePricingConfig(value) {
    if (!value) {
      return null;
    }
    return __spreadProps(__spreadValues({}, value), {
      demandRules: (value.demandRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), { action: __spreadValues({}, rule.action), slotIds: [...rule.slotIds ?? []] })),
      timeRules: (value.timeRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), { action: __spreadValues({}, rule.action), slotIds: [...rule.slotIds ?? []] })),
      cancellationPolicy: __spreadProps(__spreadValues({}, value.cancellationPolicy), {
        rules: (value.cancellationPolicy?.rules ?? []).map((rule) => __spreadValues({}, rule))
      }),
      slotOverrides: (value.slotOverrides ?? []).map((slot) => __spreadValues({}, slot)),
      audience: __spreadProps(__spreadValues({}, value.audience), {
        promoCodes: (value.audience?.promoCodes ?? []).map((code) => __spreadProps(__spreadValues({}, code), { action: __spreadValues({}, code.action) }))
      })
    });
  }
  static normalizeLocation(value) {
    return `${value ?? ""}`.trim();
  }
  static normalizeSlotOverrideDate(value) {
    const parsed = this.parseDateOnly(value);
    return parsed ? this.toIsoDate(parsed) : null;
  }
  static normalizeCount(value) {
    if (!Number.isFinite(Number(value))) {
      return null;
    }
    return Math.max(0, Math.trunc(Number(value)));
  }
  static nonNegativeInteger(value) {
    return this.normalizeCount(value) ?? 0;
  }
  static aggregateRuntimeActivity(record) {
    const mode = ActivityEventDetailDTO.normalizeMode(record.mode);
    const subEventPending = (record.subEvents ?? []).reduce((total, item) => {
      if (mode === "Tournament") {
        return total + this.nonNegativeInteger(item.groupsPending);
      }
      return total + (item.optional === true ? this.nonNegativeInteger(item.membersPending) : 0) + this.nonNegativeInteger(item.carsPending) + this.nonNegativeInteger(item.accommodationPending) + this.nonNegativeInteger(item.suppliesPending);
    }, 0);
    return Math.max(this.nonNegativeInteger(record.activity), subEventPending);
  }
  static uniqueUserIds(userIds) {
    const unique = [];
    for (const userId of userIds) {
      const normalizedUserId = `${userId ?? ""}`.trim();
      if (!normalizedUserId || unique.includes(normalizedUserId)) {
        continue;
      }
      unique.push(normalizedUserId);
    }
    return unique;
  }
  static optionalNonNegativeInteger(value) {
    return this.normalizeCount(value) ?? void 0;
  }
  static normalizeLocationCoordinates(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    const latitude = Number(value.latitude);
    const longitude = Number(value.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }
    return {
      latitude,
      longitude
    };
  }
  static parseDate(value) {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : new Date(value);
    }
    if (typeof value !== "string" || !value.trim()) {
      return null;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  static parseDateOnly(value) {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }
    if (typeof value !== "string" || !value.trim()) {
      return null;
    }
    const dateOnlyMatch = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      const parsed2 = new Date(Number(year), Number(month) - 1, Number(day));
      return Number.isNaN(parsed2.getTime()) ? null : parsed2;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }
  static toIsoDateTimeLocal(value) {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    const hours = `${value.getHours()}`.padStart(2, "0");
    const minutes = `${value.getMinutes()}`.padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  static toIsoDate(value) {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};

// src/app/shared/core/local/source/mappers/event-checkout-basket.mapper.ts
var LocalEventCheckoutBasketsMapper = class {
  static toRecordFromRequest(request) {
    const userId = request.userId?.trim() ?? "";
    const sourceId = request.sourceId?.trim() ?? "";
    if (!userId || !sourceId) {
      return null;
    }
    const status = this.normalizeDtoStatus(request.checkoutState);
    const currency = request.currency?.trim() || "USD";
    const items = (request.basketItems ?? []).map((item) => this.itemRecordFromDto(__spreadProps(__spreadValues({}, item), {
      status: item?.status === "pay" ? "pay" : status,
      resultState: item?.resultState ?? "pending"
    }), status, currency)).filter((item) => Boolean(item));
    return this.cloneRecord({
      userId,
      sourceId,
      status,
      items,
      pricingSummaryRows: this.pricingRowsToRecords(request.pricingSummaryRows, currency),
      lineItems: this.lineItemsToRecords(request.lineItems, currency),
      totalAmount: this.roundMoney(request.totalAmount),
      currency,
      slotSourceId: request.slotSourceId?.trim() || items.find((item) => item.slotSourceId?.trim())?.slotSourceId || null,
      selectedDateKey: items.find((item) => item.selectedDateKey?.trim())?.selectedDateKey ?? null,
      checkoutSessionId: items.find((item) => item.checkoutSessionId?.trim())?.checkoutSessionId ?? null,
      expiresAtIso: items.find((item) => item.expiresAtIso?.trim())?.expiresAtIso ?? null,
      appliedPromoCodes: this.normalizeAppliedPromoCodes(request.appliedPromoCodes)
    });
  }
  static toStatePatchRecord(request) {
    const userId = request.userId?.trim() ?? "";
    const sourceId = request.sourceId?.trim() ?? "";
    if (!userId || !sourceId) {
      return null;
    }
    return {
      userId,
      sourceId,
      checkoutState: this.normalizeStatus(request.checkoutState),
      resultState: request.resultState == null ? null : this.normalizeResultState(request.resultState),
      checkoutSessionId: request.checkoutSessionId?.trim() || null
    };
  }
  static toRecord(dto) {
    if (!dto) {
      return null;
    }
    const userId = dto.userId?.trim() ?? "";
    const sourceId = dto.sourceId?.trim() ?? "";
    if (!userId || !sourceId) {
      return null;
    }
    const currency = dto.currency?.trim() || "USD";
    const status = this.normalizeStatus(dto.status);
    const items = (dto.items ?? []).map((item) => this.itemRecordFromDto(item, status, currency)).filter((item) => Boolean(item));
    return this.cloneRecord({
      userId,
      sourceId,
      status,
      items,
      pricingSummaryRows: this.pricingRowsToRecords(dto.pricingSummaryRows, currency),
      lineItems: this.lineItemsToRecords(dto.lineItems, currency),
      totalAmount: this.roundMoney(dto.totalAmount),
      currency,
      slotSourceId: dto.slotSourceId?.trim() || null,
      selectedDateKey: dto.selectedDateKey?.trim() || null,
      checkoutSessionId: dto.checkoutSessionId?.trim() || null,
      expiresAtIso: dto.expiresAtIso?.trim() || null,
      appliedPromoCodes: this.normalizeAppliedPromoCodes(dto.appliedPromoCodes)
    });
  }
  static toDto(record) {
    const cloned = this.cloneRecord(record);
    if (!cloned) {
      return null;
    }
    return {
      userId: cloned.userId,
      sourceId: cloned.sourceId,
      status: this.normalizeDtoStatus(cloned.status),
      items: this.itemRecordsToDtos(cloned.items),
      pricingSummaryRows: cloned.pricingSummaryRows.map((row) => this.pricingRowToDto(row, cloned.currency)),
      lineItems: cloned.lineItems.map((item) => ({
        id: item.id,
        kind: item.kind,
        label: item.label,
        detail: item.detail,
        amount: item.amount,
        currency: item.currency || cloned.currency || "USD"
      })),
      totalAmount: cloned.totalAmount,
      currency: cloned.currency || "USD",
      slotSourceId: cloned.slotSourceId ?? null,
      selectedDateKey: cloned.selectedDateKey ?? null,
      checkoutSessionId: cloned.checkoutSessionId ?? null,
      expiresAtIso: cloned.expiresAtIso ?? null,
      appliedPromoCodes: [...cloned.appliedPromoCodes]
    };
  }
  static itemRecordsToDtos(records) {
    return (records ?? []).map((record) => this.itemRecordToDto(record)).filter((item) => Boolean(item));
  }
  static itemRecordToDto(record) {
    const cloned = this.cloneItemRecord(record);
    if (!cloned) {
      return null;
    }
    return {
      id: cloned.id,
      kind: cloned.kind,
      sourceId: cloned.sourceId,
      slotSourceId: cloned.slotSourceId ?? null,
      slotTemplateId: cloned.slotTemplateId ?? null,
      selectedDateKey: cloned.selectedDateKey ?? null,
      subEventId: cloned.subEventId ?? null,
      resourceType: cloned.resourceType ?? null,
      label: cloned.label,
      detail: cloned.detail,
      amount: cloned.amount,
      currency: cloned.currency,
      quantity: cloned.quantity,
      status: this.normalizeDtoStatus(cloned.status),
      resultState: this.normalizeResultState(cloned.resultState),
      pricingSummaryRows: cloned.pricingSummaryRows.map((row) => this.pricingRowToDto(row, cloned.currency)),
      checkoutSessionId: cloned.checkoutSessionId ?? null,
      createdAtIso: cloned.createdAtIso ?? null,
      updatedAtIso: cloned.updatedAtIso ?? null,
      expiresAtIso: cloned.expiresAtIso ?? null
    };
  }
  static cloneRecord(record) {
    const userId = record?.userId?.trim() ?? "";
    const sourceId = record?.sourceId?.trim() ?? "";
    if (!userId || !sourceId) {
      return null;
    }
    const currency = record?.currency?.trim() || "USD";
    const status = this.normalizeStatus(record?.status);
    return {
      userId,
      sourceId,
      status,
      items: (record?.items ?? []).map((item) => this.cloneItemRecord(item, status, currency)).filter((item) => Boolean(item)),
      pricingSummaryRows: this.pricingRowsToRecords(record?.pricingSummaryRows, currency),
      lineItems: this.lineItemsToRecords(record?.lineItems, currency),
      totalAmount: this.roundMoney(record?.totalAmount),
      currency,
      slotSourceId: record?.slotSourceId?.trim() || null,
      selectedDateKey: record?.selectedDateKey?.trim() || null,
      checkoutSessionId: record?.checkoutSessionId?.trim() || null,
      expiresAtIso: record?.expiresAtIso?.trim() || null,
      appliedPromoCodes: this.normalizeAppliedPromoCodes(record?.appliedPromoCodes)
    };
  }
  static cloneItemRecord(record, fallbackStatus = "draft", fallbackCurrency) {
    const id = record?.id?.trim() ?? "";
    const sourceId = record?.sourceId?.trim() ?? "";
    const label = record?.label?.trim() ?? "";
    if (!id || !sourceId || !label) {
      return null;
    }
    const currency = record?.currency?.trim() || fallbackCurrency?.trim() || "USD";
    return {
      id,
      kind: this.normalizeKind(record?.kind),
      sourceId,
      slotSourceId: record?.slotSourceId?.trim() || null,
      slotTemplateId: record?.slotTemplateId?.trim() || null,
      selectedDateKey: record?.selectedDateKey?.trim() || null,
      subEventId: record?.subEventId?.trim() || null,
      resourceType: record?.resourceType ?? null,
      label,
      detail: record?.detail?.trim() || "",
      amount: this.roundMoney(record?.amount),
      currency,
      quantity: Math.max(1, Math.trunc(Number(record?.quantity) || 1)),
      status: this.normalizeStatus(record?.status ?? fallbackStatus),
      resultState: this.normalizeResultState(record?.resultState),
      pricingSummaryRows: this.pricingRowsToRecords(record?.pricingSummaryRows, currency),
      checkoutSessionId: record?.checkoutSessionId?.trim() || null,
      createdAtIso: record?.createdAtIso?.trim() || null,
      updatedAtIso: record?.updatedAtIso?.trim() || null,
      expiresAtIso: record?.expiresAtIso?.trim() || null
    };
  }
  static normalizeStatus(value) {
    return value === "confirmed" || value === "waiting" || value === "approval-pending" || value === "approved" || value === "pay" || value === "cancelled" || value === "rejected" || value === "deleted" ? value : "draft";
  }
  static normalizeDtoStatus(value) {
    const status = this.normalizeStatus(value);
    return status === "deleted" ? "draft" : status;
  }
  static normalizeResultState(value) {
    return value === "deleted" || value === "succeeded" || value === "failed" ? value : "pending";
  }
  static isInactiveResultState(resultState) {
    return resultState === "deleted" || resultState === "succeeded";
  }
  static isActiveStatus(status) {
    return status === "draft" || status === "confirmed" || status === "waiting" || status === "approval-pending" || status === "approved" || status === "pay";
  }
  static recordKey(userId, sourceId) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    const normalizedSourceId = `${sourceId ?? ""}`.trim();
    return normalizedUserId && normalizedSourceId ? `${normalizedUserId}::${normalizedSourceId}` : "";
  }
  static itemRecordFromDto(item, fallbackStatus, fallbackCurrency) {
    if (!item) {
      return null;
    }
    return this.cloneItemRecord({
      id: item.id,
      kind: item.kind,
      sourceId: item.sourceId,
      slotSourceId: item.slotSourceId ?? null,
      slotTemplateId: item.slotTemplateId ?? null,
      selectedDateKey: item.selectedDateKey ?? null,
      subEventId: item.subEventId ?? null,
      resourceType: item.resourceType ?? null,
      label: item.label,
      detail: item.detail,
      amount: item.amount,
      currency: item.currency,
      quantity: item.quantity,
      status: this.normalizeStatus(item.status ?? fallbackStatus),
      resultState: this.normalizeResultState(item.resultState),
      pricingSummaryRows: this.pricingRowsToRecords(item.pricingSummaryRows, item.currency || fallbackCurrency),
      checkoutSessionId: item.checkoutSessionId ?? null,
      createdAtIso: item.createdAtIso ?? null,
      updatedAtIso: item.updatedAtIso ?? null,
      expiresAtIso: item.expiresAtIso ?? null
    }, fallbackStatus, fallbackCurrency);
  }
  static pricingRowToDto(row, fallbackCurrency) {
    return {
      key: row.key,
      label: row.label,
      detail: row.detail ?? null,
      amount: Number.isFinite(row.amount) ? Number(row.amount) : null,
      currency: row.currency?.trim() || fallbackCurrency?.trim() || "USD",
      multiplier: Number.isFinite(row.multiplier) ? Math.max(1, Math.trunc(Number(row.multiplier))) : null
    };
  }
  static pricingRowsToRecords(rows, fallbackCurrency) {
    const currency = fallbackCurrency?.trim() || "USD";
    return (rows ?? []).map((row) => ({
      key: row.key?.trim() || row.label?.trim() || "pricing",
      label: row.label?.trim() || "Pricing",
      detail: row.detail?.trim() || null,
      amount: Number.isFinite(row.amount) ? this.roundMoney(Number(row.amount)) : null,
      currency: row.currency?.trim() || currency,
      multiplier: Number.isFinite(row.multiplier) ? Math.max(1, Math.trunc(Number(row.multiplier))) : null
    })).filter((row) => row.label);
  }
  static lineItemsToRecords(items, fallbackCurrency) {
    const currency = fallbackCurrency?.trim() || "USD";
    return (items ?? []).map((item) => ({
      id: item.id?.trim() ?? "",
      kind: this.normalizeKind(item.kind),
      label: item.label?.trim() ?? "",
      detail: item.detail?.trim() ?? "",
      amount: this.roundMoney(item.amount),
      currency: item.currency?.trim() || currency
    })).filter((item) => item.id && item.label);
  }
  static normalizeKind(value) {
    return value === "sub_event" || value === "resource" ? value : "event";
  }
  static normalizeAppliedPromoCodes(value) {
    return [...new Set((value ?? []).map((code) => `${code ?? ""}`.trim().toUpperCase()).filter(Boolean))];
  }
  static roundMoney(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }
};

// src/app/shared/core/local/source/mappers/event-feedback.mapper.ts
var LocalEventFeedbackMapper = class {
  static DEFAULT_UNLOCK_DELAY_MS = 2 * 60 * 60 * 1e3;
  static toPageResult(options) {
    const query = this.normalizeQuery(options.query);
    const events = this.uniqueEvents(options.events);
    const organizerEvents = this.uniqueEvents(options.organizerEvents ?? options.events);
    const users = this.uniqueUsers(options.users, options.activeUser);
    const state = this.stateSnapshotFromDtos(options.states);
    const receivedEvents = this.cloneReceivedEvents(options.receivedEvents);
    const receivedByEventId = new Map(receivedEvents.map((item) => [item.eventId, item.entries]));
    const unlockDelayMs = options.eventFeedbackUnlockDelayMs ?? this.DEFAULT_UNLOCK_DELAY_MS;
    const nowMs = options.nowMs ?? Date.now();
    const feedbackCards = this.toFeedbackCards({
      events,
      users,
      activeUser: options.activeUser,
      eventFeedbackUnlockDelayMs: unlockDelayMs,
      nowMs
    });
    const cardsByEventId = this.cardsByEventId(feedbackCards);
    const allItems = this.toFeedbackEventItems({
      events,
      cardsByEventId,
      state,
      activeUserId: options.activeUser.id,
      eventFeedbackUnlockDelayMs: unlockDelayMs,
      nowMs
    });
    const organizerItems = this.toOrganizerItems(organizerEvents, receivedByEventId, unlockDelayMs, nowMs);
    const filtered = this.filterItems(query.filter, allItems, organizerItems);
    const pageItems = filtered.slice(query.page * query.pageSize, query.page * query.pageSize + query.pageSize);
    return new EventFeedbackPageResultDto({
      items: pageItems,
      total: filtered.length,
      allItems,
      organizerItems,
      receivedEvents,
      state,
      counts: this.counts(options.activeUser)
    });
  }
  static toDetail(options) {
    const eventId = options.query.eventId.trim();
    const userId = options.query.userId.trim();
    if (!userId || !eventId) {
      return new EventFeedbackDetailDto({ eventId });
    }
    const events = this.uniqueEvents(options.events);
    const event = events.find((item) => item.id === eventId) ?? null;
    if (!event) {
      return new EventFeedbackDetailDto({ eventId });
    }
    const users = this.uniqueUsers(options.users, options.activeUser);
    const cards = this.toFeedbackCards({
      events: [event],
      users,
      activeUser: options.activeUser,
      eventFeedbackUnlockDelayMs: options.eventFeedbackUnlockDelayMs ?? this.DEFAULT_UNLOCK_DELAY_MS,
      nowMs: options.nowMs ?? Date.now()
    }).filter((card) => card.eventId === eventId);
    return new EventFeedbackDetailDto({
      eventId,
      title: event.title,
      cards
    });
  }
  static toStat(options) {
    const eventId = options.query.eventId.trim();
    const records = options.records.filter((record) => record.eventId === eventId).map((record) => ({
      eventId,
      viewerUserId: record.viewerUserId.trim(),
      submittedAtIso: record.submittedAtIso.trim(),
      updatedAtIso: record.updatedAtIso.trim(),
      overallValue: record.overallValue.trim(),
      improveValue: record.improveValue.trim(),
      personalityTraitIds: (record.personalityTraitIds ?? []).map((traitId) => traitId.trim()).filter(Boolean)
    })).filter((record) => record.viewerUserId.length > 0);
    const totalResponses = records.length;
    return {
      eventId,
      totalResponses,
      sections: [
        this.toStatSection("overall", totalResponses, records.map((record) => record.overallValue)),
        this.toStatSection("improve", totalResponses, records.map((record) => record.improveValue)),
        this.toStatSection("traits", totalResponses, records.flatMap((record) => record.personalityTraitIds))
      ]
    };
  }
  static toFeedbackCards(options) {
    const cards = [];
    for (const event of options.events) {
      if (!this.isFeedbackAttendeeEvent(event)) {
        continue;
      }
      const startMs = this.eventStartAtMs(event);
      if (startMs === null || options.nowMs < startMs + options.eventFeedbackUnlockDelayMs) {
        continue;
      }
      const eventLabel = this.eventFeedbackWhenLabel(event);
      const host = this.feedbackHostUserForEvent(event, options.users, options.activeUser);
      const attendees = this.feedbackAttendeesForEvent(event, host.id, options.users, options.activeUser.id);
      cards.push({
        id: `feedback-event-${event.id}`,
        eventId: event.id,
        kind: "event",
        targetUserId: host.id,
        targetRole: "Admin",
        eventTitle: event.title,
        eventSubtitle: event.subtitle,
        eventImageUrl: event.imageUrl?.trim() || "",
        eventTimeframe: event.timeframe,
        eventStartAtIso: event.startAtIso?.trim() ?? "",
        eventLabel,
        targetName: host.name,
        targetAge: host.age,
        targetCity: host.city,
        targetGender: host.gender,
        targetTraitLabel: host.traitLabel,
        targetImageUrl: AppUtils.firstImageUrl(host.images)
      });
      for (const attendee of attendees) {
        const attendeeRole = this.feedbackRoleForAttendee(event.id, attendee.id);
        cards.push({
          id: `feedback-attendee-${event.id}-${attendee.id}`,
          eventId: event.id,
          kind: "attendee",
          attendeeUserId: attendee.id,
          targetUserId: attendee.id,
          targetRole: attendeeRole,
          eventTitle: event.title,
          eventSubtitle: event.subtitle,
          eventImageUrl: event.imageUrl?.trim() || "",
          eventTimeframe: event.timeframe,
          eventStartAtIso: event.startAtIso?.trim() ?? "",
          eventLabel,
          targetName: attendee.name,
          targetAge: attendee.age,
          targetCity: attendee.city,
          targetGender: attendee.gender,
          targetTraitLabel: attendee.traitLabel,
          targetImageUrl: AppUtils.firstImageUrl(attendee.images)
        });
      }
    }
    return cards;
  }
  static toFeedbackEventItems(options) {
    const items = [];
    for (const event of options.events) {
      if (!this.isFeedbackAttendeeEvent(event)) {
        continue;
      }
      const startMs = this.eventStartAtMs(event);
      if (startMs === null || options.nowMs < startMs + options.eventFeedbackUnlockDelayMs) {
        continue;
      }
      const cards = (options.cardsByEventId[event.id] ?? []).filter((card) => !(card.kind === "attendee" && card.attendeeUserId === options.activeUserId));
      if (cards.length === 0) {
        continue;
      }
      const eventSubmitted = Boolean(options.state.submittedEventsById[event.id]);
      const pendingCards = eventSubmitted ? 0 : cards.filter((card) => !options.state.submittedCardsById[card.id]).length;
      const isRemoved = Boolean(options.state.removedEventsById[event.id]);
      items.push({
        eventId: event.id,
        title: event.title,
        subtitle: event.subtitle,
        timeframe: event.timeframe,
        imageUrl: event.imageUrl?.trim() || "",
        startAtMs: startMs,
        pendingCards,
        totalCards: cards.length,
        isRemoved,
        isFeedbacked: !isRemoved && pendingCards === 0,
        feedbackedAtMs: this.isoToMs(options.state.submittedEventsById[event.id]),
        removedAtMs: this.isoToMs(options.state.removedEventDatesById[event.id])
      });
    }
    return this.sortPendingItems(items);
  }
  static toOrganizerItems(events, receivedByEventId, eventFeedbackUnlockDelayMs, nowMs) {
    return events.filter((event) => !this.isTrashedEvent(event) && !this.isInvitationEvent(event) && this.isEventAdmin(event)).filter((event) => this.isFeedbackUnlocked(event, eventFeedbackUnlockDelayMs, nowMs)).map((event) => {
      const entries = receivedByEventId.get(event.id) ?? [];
      return {
        eventId: event.id,
        title: event.title,
        subtitle: event.subtitle,
        timeframe: event.timeframe,
        imageUrl: event.imageUrl?.trim() || "",
        startAtMs: this.eventStartAtMs(event) ?? 0,
        pendingCards: entries.length,
        totalCards: entries.length,
        isRemoved: false,
        isFeedbacked: false,
        feedbackedAtMs: this.entriesLatestAtMs(entries),
        removedAtMs: null,
        isOwnEvent: true
      };
    }).filter((item) => item.eventId.length > 0).sort((left, right) => this.compareDates(left.startAtMs, right.startAtMs, "asc") || left.title.localeCompare(right.title) || right.totalCards - left.totalCards || this.compareDates(left.feedbackedAtMs, right.feedbackedAtMs, "desc"));
  }
  static filterItems(filter, allItems, organizerItems) {
    switch (filter) {
      case "own-events":
        return organizerItems.map((item) => __spreadValues({}, item));
      case "feedbacked":
        return allItems.filter((item) => item.isFeedbacked).sort((left, right) => this.compareDates(left.feedbackedAtMs ?? left.startAtMs, right.feedbackedAtMs ?? right.startAtMs, "desc") || right.title.localeCompare(left.title));
      case "removed":
        return allItems.filter((item) => item.isRemoved).sort((left, right) => this.compareDates(left.removedAtMs ?? left.feedbackedAtMs ?? left.startAtMs, right.removedAtMs ?? right.feedbackedAtMs ?? right.startAtMs, "desc") || right.title.localeCompare(left.title));
      case "pending":
      default:
        return this.sortPendingItems(allItems.filter((item) => !item.isRemoved && item.pendingCards > 0));
    }
  }
  static sortPendingItems(items) {
    return [...items].sort((left, right) => this.compareDates(left.startAtMs, right.startAtMs, "asc") || left.title.localeCompare(right.title));
  }
  static isFeedbackUnlocked(event, eventFeedbackUnlockDelayMs, nowMs) {
    const endAtMs = new Date(event.endAtIso ?? "").getTime();
    return Number.isFinite(endAtMs) && nowMs >= endAtMs + eventFeedbackUnlockDelayMs;
  }
  static counts(activeUser) {
    const counters = activeUser.activities?.eventFeedback;
    return {
      ownEvents: this.counter(counters?.ownEvents),
      pending: this.counter(counters?.pending),
      feedbacked: this.counter(counters?.feedbacked),
      removed: this.counter(counters?.removed)
    };
  }
  static counter(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
  static toStatSection(key, responseCount, values) {
    return {
      key,
      responseCount,
      options: this.countStatOptions(values)
    };
  }
  static countStatOptions(values) {
    const countByKey = /* @__PURE__ */ new Map();
    for (const value of values) {
      const normalizedValue = value.trim();
      if (!normalizedValue) {
        continue;
      }
      countByKey.set(normalizedValue, (countByKey.get(normalizedValue) ?? 0) + 1);
    }
    return [...countByKey.entries()].map(([key, count]) => ({ key, count })).sort((left, right) => right.count - left.count || left.key.localeCompare(right.key));
  }
  static stateSnapshotFromDtos(states) {
    const snapshot = this.emptyStateSnapshot();
    for (const state of states) {
      const eventId = state.eventId?.trim() ?? "";
      if (!eventId) {
        continue;
      }
      if (state.removed) {
        snapshot.removedEventsById[eventId] = true;
        const removedAtIso = state.removedAtIso?.trim() ?? "";
        if (removedAtIso) {
          snapshot.removedEventDatesById[eventId] = removedAtIso;
        }
      }
      const submittedAtIso = state.submittedAtIso?.trim() ?? "";
      if (submittedAtIso) {
        snapshot.submittedEventsById[eventId] = submittedAtIso;
      }
      const organizerNote = state.organizerNote?.trim() ?? "";
      if (organizerNote) {
        snapshot.organizerNotesByEventId[eventId] = organizerNote;
      }
      for (const [cardId, answer] of Object.entries(state.answersByCardId ?? {})) {
        const normalizedCardId = cardId.trim();
        if (!normalizedCardId || !answer) {
          continue;
        }
        snapshot.submittedCardsById[normalizedCardId] = true;
        snapshot.submittedAnswersByCardId[normalizedCardId] = this.cloneSubmittedEventFeedbackAnswer(answer);
      }
    }
    return snapshot;
  }
  static emptyStateSnapshot() {
    return {
      submittedCardsById: {},
      submittedAnswersByCardId: {},
      submittedEventsById: {},
      removedEventsById: {},
      removedEventDatesById: {},
      organizerNotesByEventId: {}
    };
  }
  static cloneReceivedEvents(events) {
    return (events ?? []).map((item) => {
      const eventId = item.eventId?.trim() ?? "";
      return {
        eventId,
        entries: (item.entries ?? []).map((entry) => ({
          viewerUserId: entry.viewerUserId?.trim() ?? "",
          viewerName: entry.viewerName?.trim() ?? "",
          viewerInitials: entry.viewerInitials?.trim() ?? "",
          viewerGender: entry.viewerGender === "woman" ? "woman" : "man",
          viewerImageUrl: entry.viewerImageUrl?.trim() ?? "",
          eventId: entry.eventId?.trim() || eventId,
          submittedAtIso: entry.submittedAtIso?.trim() ?? "",
          updatedAtIso: entry.updatedAtIso?.trim() ?? "",
          organizerNote: entry.organizerNote?.trim() ?? "",
          answers: (entry.answers ?? []).map((answer) => this.cloneSubmittedEventFeedbackAnswer(answer))
        })).filter((entry) => entry.viewerUserId.length > 0)
      };
    }).filter((item) => item.eventId.length > 0);
  }
  static cardsByEventId(cards) {
    const next = {};
    for (const card of cards) {
      const eventId = card.eventId?.trim() ?? "";
      if (!eventId) {
        continue;
      }
      next[eventId] = [...next[eventId] ?? [], __spreadValues({}, card)];
    }
    return next;
  }
  static uniqueEvents(events) {
    const byId = /* @__PURE__ */ new Map();
    for (const event of events) {
      const eventId = event.id?.trim() ?? "";
      if (!eventId) {
        continue;
      }
      const current = byId.get(eventId);
      if (!current || this.eventPreferenceScore(event) > this.eventPreferenceScore(current)) {
        byId.set(eventId, event);
      }
    }
    return [...byId.values()];
  }
  static eventPreferenceScore(event) {
    return (this.isEventAdmin(event) ? 8 : 0) + (event.type === "hosting" ? 4 : 0) + (!this.isInvitationEvent(event) ? 2 : 0) + (!this.isTrashedEvent(event) ? 1 : 0);
  }
  static isFeedbackAttendeeEvent(event) {
    return event.type === "events" && !this.isTrashedEvent(event) && !this.isInvitationEvent(event) && !this.isEventAdmin(event);
  }
  static isEventAdmin(event) {
    const userId = `${event.userId ?? ""}`.trim();
    return !!userId && (event.creatorUserId === userId || (event.adminIds ?? []).some((adminId) => `${adminId ?? ""}`.trim() === userId));
  }
  static isInvitationEvent(event) {
    return event.type === "invitations";
  }
  static isTrashedEvent(event) {
    return event.status === "T";
  }
  static uniqueUsers(users, activeUser) {
    const byId = /* @__PURE__ */ new Map();
    for (const user of [activeUser, ...users]) {
      const userId = user.id?.trim() ?? "";
      if (userId) {
        byId.set(userId, user);
      }
    }
    return [...byId.values()];
  }
  static normalizeQuery(query) {
    return {
      userId: query.userId.trim(),
      filter: query.filter,
      page: Math.max(0, Math.trunc(Number(query.page) || 0)),
      pageSize: Math.max(1, Math.trunc(Number(query.pageSize) || 1))
    };
  }
  static feedbackHostUserForEvent(event, users, activeUser) {
    const creatorUserId = event.creatorUserId?.trim() ?? "";
    if (creatorUserId) {
      const creator = users.find((user) => user.id === creatorUserId);
      if (creator) {
        return creator;
      }
    }
    const candidates = users.filter((user) => user.id !== activeUser.id);
    if (candidates.length === 0) {
      return activeUser;
    }
    const index = AppUtils.hashText(`feedback-host:${event.id}`) % candidates.length;
    return candidates[index] ?? candidates[0];
  }
  static feedbackAttendeesForEvent(event, hostId, users, activeUserId) {
    const attendeeIds = [...new Set([
      ...event.acceptedMemberUserIds ?? [],
      ...event.pendingMemberUserIds ?? []
    ].map((userId) => `${userId}`.trim()).filter(Boolean))].filter((userId) => userId !== activeUserId && userId !== hostId);
    if (attendeeIds.length > 0) {
      const usersById = new Map(users.map((user) => [user.id, user]));
      const resolved = attendeeIds.map((userId) => usersById.get(userId)).filter((user) => Boolean(user));
      if (resolved.length > 0) {
        return resolved.slice(0, Math.min(5, resolved.length));
      }
    }
    const candidates = users.filter((user) => user.id !== activeUserId && user.id !== hostId);
    if (candidates.length === 0) {
      return [];
    }
    const seed = AppUtils.hashText(`feedback-attendees:${event.id}`);
    const desired = Math.min(candidates.length, 3 + seed % 4);
    const picked = [];
    for (let index = 0; index < candidates.length && picked.length < desired; index += 1) {
      const candidate = candidates[(seed + index * 3) % candidates.length];
      if (!candidate || candidate.id === activeUserId || picked.some((item) => item.id === candidate.id)) {
        continue;
      }
      picked.push(candidate);
    }
    return picked;
  }
  static feedbackRoleForAttendee(eventId, attendeeUserId) {
    const seed = AppUtils.hashText(`feedback-role:${eventId}:${attendeeUserId}`);
    if (seed % 11 === 0) {
      return "Admin";
    }
    if (seed % 4 === 0) {
      return "Manager";
    }
    return "Member";
  }
  static eventStartAtMs(event) {
    const iso = event.startAtIso?.trim() ?? "";
    if (!iso) {
      return null;
    }
    const value = new Date(iso).getTime();
    return Number.isNaN(value) ? null : value;
  }
  static eventFeedbackWhenLabel(event) {
    const startMs = this.eventStartAtMs(event);
    if (startMs === null) {
      return "Recent event";
    }
    const parsed = new Date(startMs);
    const day = parsed.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const time = parsed.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return `${day} \xB7 ${time}`;
  }
  static entriesLatestAtMs(entries) {
    let latestAtMs = null;
    for (const entry of entries) {
      const candidateMs = this.entryTimestampMs(entry);
      if (candidateMs <= 0) {
        continue;
      }
      latestAtMs = latestAtMs === null ? candidateMs : Math.max(latestAtMs, candidateMs);
    }
    return latestAtMs;
  }
  static entryTimestampMs(entry) {
    const iso = entry.updatedAtIso?.trim() || entry.submittedAtIso?.trim() || (entry.answers ?? []).map((answer) => answer.submittedAtIso?.trim() ?? "").find(Boolean) || "";
    return this.isoToMs(iso) ?? 0;
  }
  static cloneSubmittedEventFeedbackAnswer(answer) {
    return __spreadProps(__spreadValues({}, answer), {
      cardId: answer.cardId?.trim() ?? "",
      eventId: answer.eventId?.trim() ?? "",
      kind: answer.kind === "attendee" ? "attendee" : "event",
      targetUserId: answer.targetUserId?.trim() || null,
      targetRole: answer.targetRole === "Admin" || answer.targetRole === "Manager" ? answer.targetRole : "Member",
      primaryValue: answer.primaryValue?.trim() ?? "",
      secondaryValue: answer.secondaryValue?.trim() ?? "",
      eventComment: answer.kind === "event" ? answer.eventComment?.trim() ?? "" : "",
      personalityTraitIds: [...answer.personalityTraitIds ?? []],
      tags: [...answer.tags ?? []],
      submittedAtIso: answer.submittedAtIso?.trim() ?? ""
    });
  }
  static isoToMs(iso) {
    const normalizedIso = iso?.trim() ?? "";
    if (!normalizedIso) {
      return null;
    }
    const value = new Date(normalizedIso).getTime();
    return Number.isNaN(value) ? null : value;
  }
  static compareDates(leftMs, rightMs, direction) {
    const left = Number.isFinite(leftMs) && (leftMs ?? 0) > 0 ? Number(leftMs) : null;
    const right = Number.isFinite(rightMs) && (rightMs ?? 0) > 0 ? Number(rightMs) : null;
    if (left === null && right === null) {
      return 0;
    }
    if (left === null) {
      return 1;
    }
    if (right === null) {
      return -1;
    }
    return direction === "asc" ? left - right : right - left;
  }
};

// src/app/shared/core/local/source/mappers/event-participation-action.mapper.ts
var LocalEventParticipationActionMapper = class {
  static toResult(record, userId, options = {}) {
    const acceptedMembers = this.nonNegativeInteger(record.acceptedMembers);
    const pendingMembers = this.nonNegativeInteger(record.pendingMembers);
    const capacityTotal = Math.max(acceptedMembers, this.nonNegativeInteger(record.capacityTotal));
    const pendingReason = this.normalizePendingReason(options.pendingReason ?? record.pendingReason);
    const normalizedUserId = userId.trim();
    return {
      sourceId: record.id,
      slotSourceId: options.slotSourceId?.trim() || null,
      action: "join",
      membershipStatus: pendingReason || !record.acceptedMemberUserIds?.includes(normalizedUserId) ? "pending" : "accepted",
      pendingReason,
      acceptedMembers,
      pendingMembers,
      capacityTotal,
      full: record.full === true || capacityTotal > 0 && acceptedMembers >= capacityTotal,
      paymentSessionId: options.paymentSessionId?.trim() || null
    };
  }
  static normalizePendingReason(value) {
    if (value === "waitlist") {
      return "waitlist";
    }
    if (value === "approval") {
      return "approval";
    }
    return null;
  }
  static nonNegativeInteger(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
};

// src/app/shared/core/local/source/mappers/idea-post.mapper.ts
var LocalIdeaPostsMapper = class {
  static IMAGE_LIMIT = 24;
  static toDto(record) {
    const contentHtml = this.normalizeHtml(record.contentHtml);
    const imageUrls = this.imageUrls(record.imageUrls, record.imageUrl);
    return __spreadProps(__spreadValues({}, record), {
      id: `${record.id ?? ""}`.trim(),
      contentKey: this.contentKey(record.contentKey, record.id),
      lang: this.normalizeLang(record.lang),
      languageLabel: this.languageLabel(record.lang),
      title: `${record.title ?? ""}`.trim() || "Untitled idea",
      excerpt: this.excerpt(record.excerpt, contentHtml),
      contentHtml,
      imageUrl: `${record.imageUrl ?? ""}`.trim() || imageUrls[0] || "",
      imageUrls,
      featured: record.featured === true,
      published: record.published !== false,
      trashed: record.trashed === true,
      trashedAtIso: `${record.trashedAtIso ?? ""}`.trim(),
      trashedByUserId: `${record.trashedByUserId ?? ""}`.trim(),
      submittedAtIso: `${record.submittedAtIso ?? ""}`.trim() || `${record.updatedAtIso ?? ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString(),
      createdAtIso: `${record.createdAtIso ?? ""}`.trim(),
      createdByUserId: `${record.createdByUserId ?? ""}`.trim(),
      updatedAtIso: `${record.updatedAtIso ?? record.createdAtIso ?? ""}`.trim(),
      updatedByUserId: `${record.updatedByUserId ?? record.createdByUserId ?? ""}`.trim()
    });
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static toDtoPage(page) {
    return {
      records: this.toDtoList(page.records),
      total: Math.max(0, Math.trunc(Number(page.total) || 0)),
      nextCursor: `${page.nextCursor ?? ""}`.trim() || null
    };
  }
  static toAdminDtoPage(page) {
    return {
      records: this.toDtoList(page.records),
      total: Math.max(0, Math.trunc(Number(page.total) || 0)),
      nextCursor: `${page.nextCursor ?? ""}`.trim() || null,
      counts: {
        all: Math.max(0, Math.trunc(Number(page.counts.all) || 0)),
        featured: Math.max(0, Math.trunc(Number(page.counts.featured) || 0)),
        published: Math.max(0, Math.trunc(Number(page.counts.published) || 0)),
        drafts: Math.max(0, Math.trunc(Number(page.counts.drafts) || 0)),
        trashed: Math.max(0, Math.trunc(Number(page.counts.trashed) || 0))
      }
    };
  }
  static toRecord(request, options) {
    const lang = this.normalizeLang(request.lang);
    const contentHtml = this.normalizeHtml(request.contentHtml);
    const imageUrls = this.imageUrls(request.imageUrls, request.imageUrl);
    const actorUserId = `${request.actorUserId ?? ""}`.trim() || "admin";
    return {
      id: options.id,
      contentKey: this.contentKey(request.contentKey, options.id),
      lang,
      languageLabel: this.languageLabel(lang),
      title: `${request.title ?? ""}`.trim() || "Untitled idea",
      excerpt: this.excerpt(request.excerpt, contentHtml),
      contentHtml,
      imageUrl: `${request.imageUrl ?? ""}`.trim() || imageUrls[0] || "",
      imageUrls,
      featured: request.featured === true,
      published: request.published !== false,
      trashed: false,
      trashedAtIso: "",
      trashedByUserId: "",
      submittedAtIso: this.submittedAtIso(request.submittedAtIso),
      createdAtIso: options.nowIso,
      createdByUserId: actorUserId,
      updatedAtIso: options.nowIso,
      updatedByUserId: actorUserId
    };
  }
  static normalizeHtml(value) {
    return `${value ?? ""}`.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "").replace(/\s(?:href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\1/gi, "").trim();
  }
  static excerpt(explicitExcerpt, contentHtml) {
    const value = `${explicitExcerpt ?? ""}`.trim() || this.htmlToText(contentHtml);
    const normalized = value.replace(/\s+/g, " ").trim();
    return normalized.length <= 180 ? normalized : `${normalized.slice(0, 179).trim()}...`;
  }
  static htmlToText(value) {
    if (typeof document === "undefined") {
      return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    }
    const template = document.createElement("template");
    template.innerHTML = value;
    return `${template.content.textContent ?? ""}`.replace(/\s+/g, " ").trim();
  }
  static normalizeLang(lang) {
    return `${lang ?? ""}`.trim().toLowerCase().split("-")[0] === "hu" ? "hu" : "en";
  }
  static languageLabel(lang) {
    return this.normalizeLang(lang) === "hu" ? "Magyar" : "English";
  }
  static contentKey(value, fallbackId) {
    const normalized = `${value ?? ""}`.trim() || fallbackId.trim();
    return normalized.endsWith("-hu") ? normalized.slice(0, -3) : normalized;
  }
  static imageUrls(imageUrls, primaryImageUrl) {
    const urls = /* @__PURE__ */ new Set();
    const primary = `${primaryImageUrl ?? ""}`.trim();
    if (primary) {
      urls.add(primary);
    }
    for (const value of imageUrls ?? []) {
      const normalized = `${value ?? ""}`.trim();
      if (normalized) {
        urls.add(normalized);
      }
      if (urls.size >= this.IMAGE_LIMIT) {
        break;
      }
    }
    return [...urls];
  }
  static submittedAtIso(requested) {
    const normalized = `${requested ?? ""}`.trim();
    if (!normalized) {
      return "";
    }
    const parsed = Date.parse(normalized);
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : normalized;
  }
};

// src/app/shared/core/local/source/mappers/asset.mapper.ts
var LocalAssetsMapper = class {
  static cloneCards(cards) {
    return AssetCardBuilder.cloneCards(cards);
  }
  static normalizeCards(cards) {
    return cards.map((card) => this.normalizeCard(card)).filter((card) => Boolean(card));
  }
  static normalizeCard(card) {
    const id = card?.id?.trim() ?? "";
    if (!id) {
      return null;
    }
    const type = card?.type;
    if (!isAssetType(type)) {
      return null;
    }
    const requests = this.normalizeRequests(card?.requests);
    return {
      id,
      type,
      title: card?.title?.trim() ?? "",
      subtitle: card?.subtitle?.trim() ?? "",
      category: AssetDefaultsBuilder.normalizeCategory(type, card?.category),
      city: card?.city?.trim() ?? "",
      capacityTotal: AssetCardBuilder.capacityValue({ capacityTotal: card?.capacityTotal ?? 0 }),
      quantity: AssetCardBuilder.storedQuantityValue({
        type,
        quantity: card?.quantity,
        capacityTotal: card?.capacityTotal ?? 0
      }),
      description: this.assetDescription(card),
      imageUrl: card?.imageUrl?.trim() ?? "",
      locationLabel: this.assetLocationLabel(card, type),
      priceLabel: this.assetPriceLabel(card),
      policyCount: this.assetPolicyCount(card),
      visibility: card?.visibility === "Friends only" ? "Friends only" : card?.visibility === "Invitation only" ? "Invitation only" : "Public",
      status: this.normalizeAssetStatus(card?.status),
      ownerUserId: `${card?.ownerUserId ?? ""}`.trim() || void 0,
      ownerName: `${card?.ownerName ?? ""}`.trim() || void 0,
      menuActions: Array.isArray(card?.menuActions) ? card.menuActions.map((action) => `${action ?? ""}`.trim()).filter((action) => action.length > 0) : [],
      requests,
      metrics: this.assetRequestMetrics(card?.metrics)
    };
  }
  static fallbackAssetDto(card) {
    const requests = this.normalizeRequests(card.requests);
    return this.normalizeCard(card) ?? {
      id: `${card.id ?? ""}`.trim(),
      type: isAssetType(card.type) ? card.type : ASSET_TYPE_TRANSPORT,
      title: `${card.title ?? ""}`.trim(),
      subtitle: `${card.subtitle ?? ""}`.trim(),
      category: AssetDefaultsBuilder.normalizeCategory(card.type, card.category),
      city: `${card.city ?? ""}`.trim(),
      capacityTotal: AssetCardBuilder.capacityValue({ capacityTotal: card.capacityTotal ?? 0 }),
      quantity: AssetCardBuilder.storedQuantityValue({
        type: isAssetType(card.type) ? card.type : ASSET_TYPE_TRANSPORT,
        quantity: card.quantity,
        capacityTotal: card.capacityTotal ?? 0
      }),
      description: this.assetDescription(card),
      imageUrl: `${card.imageUrl ?? ""}`.trim(),
      sourceLink: `${card.sourceLink ?? ""}`.trim(),
      visibility: card.visibility,
      status: this.normalizeAssetStatus(card.status),
      ownerUserId: `${card.ownerUserId ?? ""}`.trim() || void 0,
      ownerName: `${card.ownerName ?? ""}`.trim() || void 0,
      requests,
      metrics: this.assetRequestMetrics(card.metrics),
      menuActions: Array.isArray(card.menuActions) ? [...card.menuActions] : void 0
    };
  }
  static normalizeDetail(card) {
    const id = card?.id?.trim() ?? "";
    if (!id) {
      return null;
    }
    const type = card?.type;
    if (!isAssetType(type)) {
      return null;
    }
    const requests = this.normalizeRequests(card?.requests);
    return {
      id,
      type,
      title: card?.title?.trim() ?? "",
      subtitle: card?.subtitle?.trim() ?? "",
      category: AssetDefaultsBuilder.normalizeCategory(type, card?.category),
      city: card?.city?.trim() ?? "",
      capacityTotal: AssetCardBuilder.capacityValue({ capacityTotal: card?.capacityTotal ?? 0 }),
      quantity: AssetCardBuilder.storedQuantityValue({
        type,
        quantity: card?.quantity,
        capacityTotal: card?.capacityTotal ?? 0
      }),
      details: card?.details?.trim() ?? "",
      imageUrl: card?.imageUrl?.trim() ?? "",
      sourceLink: card?.sourceLink?.trim() ?? "",
      routes: Array.isArray(card?.routes) ? card.routes.map((route) => `${route ?? ""}`.trim()).filter((route) => route.length > 0) : [],
      topics: Array.isArray(card?.topics) ? card.topics.map((topic) => `${topic ?? ""}`.trim()).filter((topic) => topic.length > 0) : [],
      policiesEnabled: AssetCardBuilder.assetPoliciesEnabled(card),
      policies: Array.isArray(card?.policies) ? card.policies.map((item) => ({
        id: `${item?.id ?? ""}`.trim(),
        title: `${item?.title ?? ""}`.trim(),
        description: `${item?.description ?? ""}`.trim(),
        required: item?.required !== false
      })).filter((item) => item.id || item.title || item.description) : [],
      pricing: PricingBuilder.normalizePricingConfig(card?.pricing, { context: "asset" }),
      visibility: card?.visibility === "Friends only" ? "Friends only" : card?.visibility === "Invitation only" ? "Invitation only" : "Public",
      status: this.normalizeAssetStatus(card?.status),
      ownerUserId: `${card?.ownerUserId ?? ""}`.trim() || void 0,
      ownerName: `${card?.ownerName ?? ""}`.trim() || void 0,
      menuActions: Array.isArray(card?.menuActions) ? card.menuActions.map((action) => `${action ?? ""}`.trim()).filter((action) => action.length > 0) : [],
      requests,
      metrics: this.assetRequestMetrics(card?.metrics)
    };
  }
  static normalizeAssetStatus(status) {
    return AssetCardBuilder.normalizeAssetStatus(status);
  }
  static restoredAssetStatus(card) {
    return AssetCardBuilder.restoredAssetStatus(card);
  }
  static cloneRequest(request) {
    return AssetCardBuilder.cloneRequest(request);
  }
  static toAssetDto(record, options = {}) {
    const viewerUserId = options.viewerUserId?.trim() ?? "";
    return {
      id: record.id,
      type: record.type,
      title: record.title,
      subtitle: record.subtitle,
      category: AssetDefaultsBuilder.normalizeCategory(record.type, record.category),
      city: record.city,
      capacityTotal: record.capacityTotal,
      quantity: AssetCardBuilder.storedQuantityValue({
        type: record.type,
        quantity: record.quantity,
        capacityTotal: record.capacityTotal
      }),
      description: record.details,
      imageUrl: record.imageUrl,
      sourceLink: record.sourceLink,
      locationLabel: record.type === ASSET_TYPE_ACCOMMODATION ? (record.routes ?? []).map((route) => route.trim()).find(Boolean) ?? record.city : record.city,
      priceLabel: this.assetPriceLabelFromRecord(record),
      policiesEnabled: record.policiesEnabled === true,
      policyCount: record.policiesEnabled === true ? (record.policies ?? []).length : 0,
      visibility: record.visibility,
      status: this.normalizeAssetStatus(record.status),
      ownerUserId: record.ownerUserId,
      ownerName: record.ownerName,
      requests: record.requests.map((request) => {
        const dto = this.cloneRequest(request);
        return __spreadProps(__spreadValues({}, dto), {
          menuActions: options.resolveRequestMenuActions?.(record, dto, viewerUserId) ?? dto.menuActions ?? []
        });
      }),
      metrics: this.assetRequestMetrics(options.requestMetrics),
      menuActions: options.resolveMenuActions?.(record, viewerUserId) ?? [...record.menuActions ?? []]
    };
  }
  static toAssetDtos(records, options = {}) {
    return records.map((record) => this.toAssetDto(record, options));
  }
  static toAssetDetailDto(record, options = {}) {
    const viewerUserId = options.viewerUserId?.trim() ?? "";
    return {
      id: record.id,
      type: record.type,
      title: record.title,
      subtitle: record.subtitle,
      category: AssetDefaultsBuilder.normalizeCategory(record.type, record.category),
      city: record.city,
      capacityTotal: record.capacityTotal,
      quantity: AssetCardBuilder.storedQuantityValue({
        type: record.type,
        quantity: record.quantity,
        capacityTotal: record.capacityTotal
      }),
      details: record.details,
      imageUrl: record.imageUrl,
      sourceLink: record.sourceLink,
      routes: [...record.routes ?? []],
      topics: [...record.topics ?? []],
      policiesEnabled: record.policiesEnabled === true,
      policies: (record.policies ?? []).map((item) => __spreadValues({}, item)),
      pricing: record.pricing ? PricingBuilder.clonePricingConfig(record.pricing) : void 0,
      visibility: record.visibility,
      status: this.normalizeAssetStatus(record.status),
      ownerUserId: record.ownerUserId,
      ownerName: record.ownerName,
      requests: record.requests.map((request) => {
        const dto = this.cloneRequest(request);
        return __spreadProps(__spreadValues({}, dto), {
          menuActions: options.resolveRequestMenuActions?.(record, dto, viewerUserId) ?? dto.menuActions ?? []
        });
      }),
      metrics: this.assetRequestMetrics(options.requestMetrics),
      menuActions: options.resolveMenuActions?.(record, viewerUserId) ?? [...record.menuActions ?? []]
    };
  }
  static toAssetAvailabilityDtoPage(page) {
    return {
      items: page.records.map((record) => this.toAssetAvailabilityRowDto(record)),
      total: page.total,
      nextCursor: page.nextCursor
    };
  }
  static toAssetAvailabilityStatDtoPage(page) {
    return {
      items: page.records.map((record) => this.toAssetAvailabilityStatDto(record)),
      total: page.total,
      nextCursor: page.nextCursor
    };
  }
  static toAssetAvailabilityStatDto(record) {
    const day = AppUtils.dateOnly(record.date);
    const nextDay = AppUtils.addDays(day, 1);
    const overlapping = record.requests.filter((request) => this.assetRequestDateRangeOverlaps(request, day, nextDay));
    const occupied = overlapping.filter((request) => this.isCommittedAssetRequest(request)).reduce((sum, request) => sum + this.assetRequestOccupancyCount(request), 0);
    const pending = overlapping.filter((request) => this.isPendingAssetRequest(request));
    const pendingQuantity = pending.reduce((sum, request) => sum + this.assetRequestQuantity(request), 0);
    const dateIso = AppUtils.dateKey(day);
    return {
      id: `${record.assetId}:${dateIso}`,
      assetId: record.assetId,
      ownerUserId: record.ownerUserId,
      dateIso,
      startAtIso: AppUtils.toIsoDateTimeLocal(day),
      endAtIso: AppUtils.toIsoDateTimeLocal(nextDay),
      occupied,
      capacity: Math.max(0, Math.trunc(Number(record.assetCapacity) || 0)),
      pendingCount: pending.length,
      pendingQuantity,
      itemCount: overlapping.length
    };
  }
  static toAssetAvailabilityRowDto(record) {
    const request = record.request;
    const requestRange = this.assetRequestDateRange(request);
    const status = request.requestKind === "manual" ? "assigned" : request.status;
    const overlappingCommitted = record.requests.filter((other) => this.isCommittedAssetRequest(other)).filter((other) => {
      if (record.dateRange) {
        return this.assetRequestDateRangeOverlaps(other, record.dateRange.start, record.dateRange.end);
      }
      return this.assetRequestsOverlap(request, other);
    }).reduce((sum, other) => sum + this.assetRequestOccupancyCount(other), 0);
    const pendingCurrentQuantity = this.isCommittedAssetRequest(request) ? 0 : this.assetRequestQuantity(request);
    const capacity = Math.max(0, Math.trunc(Number(request.assetCapacity) || 0));
    const pendingForWindow = record.requests.filter((other) => this.isPendingAssetRequest(other)).filter((other) => {
      if (record.dateRange) {
        return this.assetRequestDateRangeOverlaps(other, record.dateRange.start, record.dateRange.end);
      }
      return this.assetRequestsOverlap(request, other);
    });
    return {
      id: this.sourceAssetRequestId(request),
      assetId: request.assetId,
      ownerUserId: request.ownerUserId,
      userId: request.userId,
      isManager: (request.menuActions ?? []).includes("revokeManager"),
      dateIso: requestRange ? AppUtils.dateKey(requestRange.start) : "",
      startAtIso: request.booking?.startAtIso,
      endAtIso: request.booking?.endAtIso,
      title: request.name,
      subtitle: [
        `${request.booking?.eventTitle ?? ""}`.trim(),
        `${request.booking?.subEventTitle ?? ""}`.trim()
      ].filter(Boolean).join(" \xB7 ") || void 0,
      detail: this.visibleAssetRequestNote(request),
      scheduleLabel: this.assetRequestScheduleLabel(request),
      avatarInitials: request.initials,
      gender: request.gender,
      status,
      requestKind: request.requestKind ?? "borrow",
      quantity: this.assetRequestQuantity(request),
      occupied: overlappingCommitted,
      capacity,
      remaining: capacity - overlappingCommitted - pendingCurrentQuantity,
      pendingCount: pendingForWindow.length,
      pendingQuantity: pendingForWindow.reduce((sum, other) => sum + this.assetRequestQuantity(other), 0),
      eventId: `${request.booking?.eventId ?? ""}`.trim() || void 0,
      eventTitle: `${request.booking?.eventTitle ?? ""}`.trim() || void 0,
      subEventId: `${request.booking?.subEventId ?? ""}`.trim() || void 0,
      subEventTitle: `${request.booking?.subEventTitle ?? ""}`.trim() || void 0,
      subEventStartAtIso: `${request.booking?.startAtIso ?? ""}`.trim() || void 0,
      subEventEndAtIso: `${request.booking?.endAtIso ?? ""}`.trim() || void 0,
      menuActions: this.assetRequestMenuActions(request)
    };
  }
  static sourceAssetRequestId(request) {
    const requestId = `${request.requestId ?? ""}`.trim();
    if (requestId) {
      return requestId;
    }
    const projectionId = `${request.id ?? ""}`.trim();
    const prefix = `${request.assetId ?? ""}`.trim() + ":request:";
    return projectionId.startsWith(prefix) ? projectionId.slice(prefix.length).trim() : projectionId;
  }
  static assetRequestsOverlap(left, right) {
    if (left.id === right.id) {
      return true;
    }
    const leftRange = this.assetRequestDateRange(left);
    const rightRange = this.assetRequestDateRange(right);
    if (leftRange && rightRange) {
      return leftRange.start.getTime() < rightRange.end.getTime() && rightRange.start.getTime() < leftRange.end.getTime();
    }
    const leftWindow = this.assetRequestWindowKey(left);
    const rightWindow = this.assetRequestWindowKey(right);
    return Boolean(leftWindow && rightWindow && leftWindow === rightWindow);
  }
  static assetRequestDateRangeOverlaps(request, start, end) {
    const range = this.assetRequestDateRange(request);
    return range ? range.start.getTime() < end.getTime() && start.getTime() < range.end.getTime() : false;
  }
  static assetRequestDateRange(request) {
    const start = this.parseAssetRequestDate(request.booking?.startAtIso ?? request.requestedAtIso);
    if (!start) {
      return null;
    }
    const parsedEnd = this.parseAssetRequestDate(request.booking?.endAtIso);
    const end = parsedEnd && parsedEnd.getTime() > start.getTime() ? parsedEnd : AppUtils.addDays(start, 1);
    return { start, end };
  }
  static assetRequestWindowKey(request) {
    return [
      `${request.booking?.eventId ?? ""}`.trim(),
      `${request.booking?.subEventId ?? ""}`.trim(),
      `${request.booking?.slotLabel ?? ""}`.trim(),
      `${request.booking?.timeframe ?? ""}`.trim()
    ].filter(Boolean).join("|");
  }
  static parseAssetRequestDate(value) {
    const normalized = `${value ?? ""}`.trim();
    if (!normalized) {
      return null;
    }
    return AppUtils.isoLocalDateTimeToDate(normalized) ?? AppUtils.parseDate(normalized);
  }
  static isCommittedAssetRequest(request) {
    return request.status === "accepted" || request.requestKind === "manual";
  }
  static isPendingAssetRequest(request) {
    return request.status === "pending" && request.requestKind !== "manual";
  }
  static assetRequestQuantity(request) {
    return Math.max(1, Math.trunc(Number(request.booking?.quantity) || 1));
  }
  static assetRequestOccupancyCount(request) {
    return request.requestKind === "manual" ? 1 : this.assetRequestQuantity(request);
  }
  static visibleAssetRequestNote(request) {
    const note = `${request.note ?? ""}`.trim();
    if (!note || this.isSystemAssetRequestNote(note)) {
      return void 0;
    }
    return note;
  }
  static isSystemAssetRequestNote(note) {
    return note === "Awaiting owner confirmation." || note === "Approved and synced with the plan." || note === "Reserved and assigned by the owner." || note === "Borrow request approved by the owner." || note === "Promoted to asset manager.";
  }
  static assetRequestScheduleLabel(request) {
    const start = this.parseAssetRequestDate(request.booking?.startAtIso);
    const end = this.parseAssetRequestDate(request.booking?.endAtIso);
    if (start && end) {
      return this.formatAssetRequestDateRange(start, end);
    }
    return `${request.booking?.timeframe ?? request.booking?.slotLabel ?? ""}`.trim() || void 0;
  }
  static formatAssetRequestDateRange(start, end) {
    const sameDay = AppUtils.dateKey(start) === AppUtils.dateKey(end);
    const startDate = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endDate = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const endTime = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return sameDay ? `${startDate} ${startTime} - ${endTime}` : `${startDate} ${startTime} - ${endDate} ${endTime}`;
  }
  static assetRequestMenuActions(request) {
    if (this.isPendingAssetRequest(request)) {
      return (request.menuActions ?? []).includes("makeManager") ? ["accept", "makeManager", "remove"] : ["accept", "remove"];
    }
    if (request.requestKind === "manual") {
      return request.booking?.eventId && request.booking?.subEventId ? ["manage"] : [];
    }
    return (request.menuActions ?? []).includes("makeManager") ? ["makeManager"] : [];
  }
  static normalizedCount(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(0, Math.trunc(numeric)) : 0;
  }
  static toAssetRequestMetrics(requests) {
    const rows = (requests ?? []).filter((request) => this.isLaterAssetRequestMetric(request));
    const assignedItems = rows.filter((request) => request.requestKind === "manual").length;
    const borrowedItems = rows.filter((request) => request.status === "accepted" && request.requestKind !== "manual").length;
    const pendingItems = rows.filter((request) => request.status === "pending" && request.requestKind !== "manual").length;
    const activeItems = assignedItems + borrowedItems;
    return {
      allItems: activeItems + pendingItems,
      activeItems,
      assignedItems,
      borrowedItems,
      pendingItems
    };
  }
  static isLaterAssetRequestMetric(request) {
    const end = this.assetRequestDateRange(request)?.end ?? this.parseAssetRequestDate(request.requestedAtIso);
    return end !== null && end.getTime() >= Date.now();
  }
  static assetRequestMetrics(metrics) {
    if (metrics) {
      return {
        allItems: this.normalizedCount(metrics.allItems),
        activeItems: this.normalizedCount(metrics.activeItems),
        assignedItems: this.normalizedCount(metrics.assignedItems),
        borrowedItems: this.normalizedCount(metrics.borrowedItems),
        pendingItems: this.normalizedCount(metrics.pendingItems)
      };
    }
    return this.emptyAssetRequestMetrics();
  }
  static emptyAssetRequestMetrics() {
    return {
      allItems: 0,
      activeItems: 0,
      assignedItems: 0,
      borrowedItems: 0,
      pendingItems: 0
    };
  }
  static toAssetRecord(asset, ownerUserId) {
    const summary = this.normalizeCard(asset);
    if (!summary) {
      return null;
    }
    const detail = "details" in asset ? this.normalizeDetail(asset) : null;
    const now = /* @__PURE__ */ new Date();
    const nowMs = now.getTime();
    return {
      id: summary.id,
      type: summary.type,
      title: summary.title,
      subtitle: summary.subtitle,
      category: summary.category,
      city: summary.city,
      capacityTotal: summary.capacityTotal,
      quantity: summary.quantity,
      details: detail?.details ?? summary.description,
      imageUrl: summary.imageUrl,
      sourceLink: detail?.sourceLink ?? summary.sourceLink ?? "",
      routes: detail?.routes ? [...detail.routes] : [],
      topics: detail?.topics ? [...detail.topics] : [],
      policiesEnabled: detail?.policiesEnabled === true,
      policies: detail?.policies ? detail.policies.map((item) => __spreadValues({}, item)) : [],
      pricing: detail?.pricing ? PricingBuilder.clonePricingConfig(detail.pricing) : detail?.pricing,
      visibility: summary.visibility ?? "Public",
      status: summary.status ?? "A",
      statusBeforeSuppression: null,
      ownerUserId: ownerUserId.trim(),
      ownerName: summary.ownerName,
      requests: this.normalizeRequests(summary.requests),
      menuActions: [...summary.menuActions ?? []],
      createdAtIso: now.toISOString(),
      updatedAtIso: now.toISOString(),
      createdMs: nowMs,
      updatedMs: nowMs
    };
  }
  static normalizeRequests(requests) {
    return Array.isArray(requests) ? requests.map((request) => __spreadProps(__spreadValues({}, request), {
      id: `${request?.id ?? ""}`.trim(),
      userId: `${request?.userId ?? ""}`.trim() || void 0,
      name: `${request?.name ?? ""}`.trim(),
      initials: `${request?.initials ?? ""}`.trim(),
      gender: request?.gender === "woman" ? "woman" : "man",
      status: request?.status === "accepted" ? "accepted" : "pending",
      note: `${request?.note ?? ""}`.trim(),
      requestKind: request?.requestKind === "manual" ? "manual" : "borrow",
      requestedAtIso: `${request?.requestedAtIso ?? ""}`.trim() || void 0,
      menuActions: Array.isArray(request?.menuActions) ? request.menuActions.map((action) => `${action ?? ""}`.trim()).filter((action) => action.length > 0) : [],
      booking: request?.booking ? __spreadProps(__spreadValues({}, request.booking), {
        acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
      }) : null
    })).filter((request) => request.id.length > 0) : [];
  }
  static assetDescription(card) {
    return "description" in card ? card.description.trim() : card.details.trim();
  }
  static assetLocationLabel(card, type) {
    if ("locationLabel" in card && card.locationLabel?.trim()) {
      return card.locationLabel.trim();
    }
    if (type !== ASSET_TYPE_ACCOMMODATION || !("routes" in card)) {
      return card.city?.trim() ?? "";
    }
    return (card.routes ?? []).map((route) => `${route ?? ""}`.trim()).find((route) => route.length > 0) ?? card.city.trim();
  }
  static assetPriceLabel(card) {
    if ("priceLabel" in card && card.priceLabel?.trim()) {
      return card.priceLabel.trim();
    }
    if (!("pricing" in card) || !card.pricing?.enabled) {
      return void 0;
    }
    const amount = Math.max(0, Number(card.pricing.basePrice) || 0);
    if (amount <= 0) {
      return "Free borrow";
    }
    const currency = card.pricing.currency || "USD";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(0)}`;
    }
  }
  static assetPolicyCount(card) {
    if (!AssetCardBuilder.assetPoliciesEnabled(card)) {
      return 0;
    }
    if ("policyCount" in card && Number.isFinite(Number(card.policyCount))) {
      return Math.max(0, Math.trunc(Number(card.policyCount)));
    }
    return "policies" in card ? (card.policies ?? []).length : 0;
  }
  static assetPriceLabelFromRecord(record) {
    if (!record.pricing?.enabled) {
      return void 0;
    }
    const amount = Math.max(0, Number(record.pricing.basePrice) || 0);
    if (amount <= 0) {
      return "Free borrow";
    }
    const currency = record.pricing.currency || "USD";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(0)}`;
    }
  }
  static cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      routes: [...record.routes ?? []],
      topics: [...record.topics ?? []],
      policiesEnabled: record.policiesEnabled === true,
      policies: (record.policies ?? []).map((item) => __spreadValues({}, item)),
      pricing: record.pricing ? PricingBuilder.clonePricingConfig(record.pricing) : void 0,
      requests: record.requests.map((request) => this.cloneRequest(request)),
      menuActions: [...record.menuActions ?? []]
    });
  }
};
var LocalAssetTicketsMapper = class {
  static toTicketDTOs(records) {
    return this.cloneDTOs(records.filter(({ ticket }) => ticket.status === "A").map(({ ticket, event }) => this.toTicketDTO(ticket, event, LocalActivityEventsMapper.toDto(event))));
  }
  static pageRows(rows, query) {
    const page = Math.max(0, Math.trunc(Number(query.page) || 0));
    const pageSize = Math.max(1, Math.trunc(Number(query.pageSize) || 1));
    const orderedRows = [...rows].sort((left, right) => this.toSortableDate(left.dateIso) - this.toSortableDate(right.dateIso));
    const visibleRows = orderedRows.filter((row) => this.matchesTicketOrder(row, query.order));
    if (query.order === "past") {
      visibleRows.reverse();
    }
    const startIndex = page * pageSize;
    return {
      items: this.cloneDTOs(visibleRows.slice(startIndex, startIndex + pageSize)),
      total: visibleRows.length
    };
  }
  static cloneDTOs(rows) {
    return rows.map((row) => __spreadValues({}, row));
  }
  static toTicketDTO(ticket, record, dto) {
    return {
      id: dto.id,
      revision: [
        ticket.id,
        ticket.code,
        ticket.status,
        ticket.issuedAtIso,
        ticket.usedAtIso,
        dto.status,
        dto.title,
        dto.subtitle,
        dto.timeframe,
        dto.startAtIso,
        dto.endAtIso,
        dto.imageUrl,
        dto.visibility
      ].map((value) => `${value ?? ""}`).join(""),
      scanCode: ticket.code,
      holderUserId: ticket.holderUserId,
      usedAtIso: `${ticket.usedAtIso ?? ""}`.trim() || null,
      issuedAtIso: ticket.issuedAtIso,
      type: "events",
      status: dto.status,
      title: dto.title,
      subtitle: dto.subtitle,
      detail: dto.timeframe,
      dateIso: dto.startAtIso,
      distanceMetersExact: Math.max(0, Math.round((Number(dto.distanceKm) || 0) * 1e3)),
      isAdmin: false,
      startAt: dto.startAtIso,
      endAt: dto.endAtIso,
      imageUrl: dto.imageUrl,
      visibility: dto.visibility,
      avatarInitials: dto.creatorInitials,
      creatorInitials: dto.creatorInitials
    };
  }
  static matchesTicketOrder(row, order) {
    const isPast = this.resolveTicketEndTimestamp(row) < Date.now();
    return order === "past" ? isPast : !isPast;
  }
  static resolveTicketEndTimestamp(row) {
    const endAtMs = this.toSortableDate(row.endAt ?? "");
    if (endAtMs > 0) {
      return endAtMs;
    }
    return this.toSortableDate(row.dateIso);
  }
  static toSortableDate(dateIso) {
    const parsed = new Date(dateIso);
    const value = parsed.getTime();
    return Number.isNaN(value) ? 0 : value;
  }
};

// src/app/shared/core/local/source/mappers/notification.mapper.ts
var LocalNotificationMapper = class {
  static toDto(record) {
    return __spreadProps(__spreadValues({}, record), {
      readAtIso: record.readAtIso ?? null,
      senderUserId: record.senderUserId ?? null,
      senderName: record.senderName ?? null,
      senderAvatarUrl: record.senderAvatarUrl ?? null,
      actionPath: record.actionPath ?? null,
      sourceType: record.sourceType ?? null,
      sourceId: record.sourceId ?? null,
      payload: record.payload ? __spreadValues({}, record.payload) : null,
      revision: Math.max(1, Math.trunc(Number(record.revision) || 1))
    });
  }
  static toDtoList(records) {
    return records.map((record) => this.toDto(record));
  }
  static toRecord(dto) {
    return __spreadProps(__spreadValues({}, dto), {
      readAtIso: dto.readAtIso ?? null,
      senderUserId: dto.senderUserId ?? null,
      senderName: dto.senderName ?? null,
      senderAvatarUrl: dto.senderAvatarUrl ?? null,
      actionPath: dto.actionPath ?? null,
      sourceType: dto.sourceType ?? null,
      sourceId: dto.sourceId ?? null,
      payload: dto.payload ? __spreadValues({}, dto.payload) : null,
      revision: Math.max(1, Math.trunc(Number(dto.revision) || 1))
    });
  }
  static toDtoPage(page) {
    return {
      records: this.toDtoList(page.records),
      total: Math.max(0, Math.trunc(Number(page.total) || 0)),
      nextCursor: `${page.nextCursor ?? ""}`.trim() || null,
      unreadCount: Math.max(0, Math.trunc(Number(page.unreadCount) || 0)),
      muted: page.muted === true
    };
  }
};

export {
  APP_STATIC_DATA,
  ActivityMembersBuilder,
  PricingBuilder,
  ActivityResourceBuilder,
  AssetDefaultsBuilder,
  AssetDto,
  RANDOM_ROOM_WELCOME_MESSAGE,
  ProfileExtDto,
  AssetCardBuilder,
  AssetTicketBuilder,
  HelpCenterContentBuilder,
  LocalActivityInviteCandidatesMapper,
  LocalActivityMembersBuilder,
  LocalActivityResourcesMapper,
  LocalActivitySubEventStageRuntimeMapper,
  LocalContactsMapper,
  tournamentGroupCountForIncoming,
  tournamentCurrentStageFromSubEvents,
  LocalActivityEventsMapper,
  LocalActivityEventDetailsMapper,
  LocalEventCheckoutBasketsMapper,
  LocalEventFeedbackMapper,
  LocalEventParticipationActionMapper,
  LocalHelpCenterMapper,
  LocalIdeaPostsMapper,
  LocalProfileExperiencesMapper,
  LocalAssetsMapper,
  LocalAssetTicketsMapper,
  LocalChatMessageMapper,
  LocalChatThreadMapper,
  LocalNotificationMapper,
  BaseUserRatesMapper,
  LocalUserRatesMapper,
  LocalUserFilterPreferencesMapper,
  LocalUsersMapper
};
//# sourceMappingURL=chunk-Y2Y4ZDHH.js.map
