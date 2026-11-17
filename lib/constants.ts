export const WEDDING_CATEGORIES = [
  'Photography & Videography',
  'Wedding Venues',
  'Decoration & Florist',
  'Catering Services',
  'Makeup & Styling',
  'Wedding Fashion',
] as const;

export const BOOKING_STATUSES = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
} as const;

export const APP_CONFIG = {
  name: 'WedPlan',
  tagline: 'Luxury Wedding Planning Platform',
  supportEmail: 'concierge@wedplan.com',
  premiumTierPrice: 49,
};
