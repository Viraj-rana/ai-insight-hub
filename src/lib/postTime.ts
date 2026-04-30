const toDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

export const getRelativePostTime = (value: string) => {
  const date = toDate(value);
  if (!date) return 'Recently';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return 'Just now';

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.floor(diffMs / minute));
    return `${minutes} min ago`;
  }

  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  if (diffMs < month) {
    const days = Math.floor(diffMs / day);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  if (diffMs < year) {
    const months = Math.floor(diffMs / month);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }

  const years = Math.floor(diffMs / year);
  return `${years} year${years === 1 ? '' : 's'} ago`;
};

export const getFormattedPostDate = (value: string) => {
  const date = toDate(value);
  if (!date) return value;

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
};
