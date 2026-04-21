import { format, formatDistanceToNow } from 'date-fns';

export const shortDate = (date) => format(new Date(date), 'MMM d, yyyy');

export const timeAgo = (date) =>
  formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

export const compactNumber = (value) =>
  Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
