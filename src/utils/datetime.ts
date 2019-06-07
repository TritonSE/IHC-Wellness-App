const timeDifference = (current: number, previous: number): string => {
  const milliSecondsPerMinute: number = 60 * 1000;
  const milliSecondsPerHour: number = milliSecondsPerMinute * 60;
  const milliSecondsPerDay: number = milliSecondsPerHour * 24;
  const milliSecondsPerMonth: number = milliSecondsPerDay * 30;
  const milliSecondsPerYear: number = milliSecondsPerDay * 365;
  const elapsed: number = current - previous;

  if (elapsed < milliSecondsPerMinute / 3) {
    return 'just now';
  }

  if (elapsed < milliSecondsPerMinute) {
    return 'less than 1 min';
  } if (elapsed < milliSecondsPerHour) {
    return `${Math.round(elapsed / milliSecondsPerMinute)} min`;
  } if (elapsed < milliSecondsPerDay) {
    return `${Math.round(elapsed / milliSecondsPerHour)} h`;
  } if (elapsed < milliSecondsPerMonth) {
    const days = Math.round(elapsed / milliSecondsPerDay);
    return `${days} day${days > 1 ? 's' : ''}`;
  } if (elapsed < milliSecondsPerYear) {
    return `${Math.round(elapsed / milliSecondsPerMonth)} mo`;
  }
  return `${Math.round(elapsed / milliSecondsPerYear)} years`;
};

const timeDifferenceForDate = (date: string) => {
  const now = new Date().getTime();
  const updated = new Date(date).getTime();

  return timeDifference(now, updated);
};

export { timeDifference, timeDifferenceForDate };
