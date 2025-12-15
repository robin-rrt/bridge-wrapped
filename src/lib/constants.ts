// Year for Bridge Wrapped
export const WRAPPED_YEAR = 2025;

// Timestamps for 2025
export const YEAR_START_TIMESTAMP = Math.floor(
  new Date('2025-01-01T00:00:00Z').getTime() / 1000
);
export const YEAR_END_TIMESTAMP = Math.floor(
  new Date('2025-12-31T23:59:59Z').getTime() / 1000
);

// API Base URLs
export const API_URLS = {
  ACROSS: 'https://app.across.to/api',
  RELAY: 'https://api.relay.link',
  LIFI: 'https://li.quest/v1',
} as const;

// Pagination limits
export const PAGINATION = {
  ACROSS_LIMIT: 100,
  RELAY_LIMIT: 100,
  LIFI_LIMIT: 100,
} as const;

// Month names for display
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

// Slide types for wrapped experience
export const SLIDE_TYPES = {
  INTRO: 'intro',
  TOTAL_BRIDGES: 'total_bridges',
  TOP_SOURCE: 'top_source',
  TOP_DESTINATION: 'top_destination',
  VOLUME: 'volume',
  TOP_TOKEN: 'top_token',
  BUSIEST_DAY: 'busiest_day',
  SUMMARY: 'summary',
} as const;

// Gradient colors for slides
export const SLIDE_GRADIENTS = {
  [SLIDE_TYPES.INTRO]: 'from-purple-600 via-pink-500 to-orange-400',
  [SLIDE_TYPES.TOTAL_BRIDGES]: 'from-blue-600 via-cyan-500 to-teal-400',
  [SLIDE_TYPES.TOP_SOURCE]: 'from-green-600 via-emerald-500 to-lime-400',
  [SLIDE_TYPES.TOP_DESTINATION]: 'from-orange-600 via-amber-500 to-yellow-400',
  [SLIDE_TYPES.VOLUME]: 'from-pink-600 via-rose-500 to-red-400',
  [SLIDE_TYPES.TOP_TOKEN]: 'from-indigo-600 via-violet-500 to-purple-400',
  [SLIDE_TYPES.BUSIEST_DAY]: 'from-cyan-600 via-blue-500 to-indigo-400',
  [SLIDE_TYPES.SUMMARY]: 'from-slate-800 via-slate-700 to-slate-600',
} as const;
