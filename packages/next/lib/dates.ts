const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const tommorrow = (date) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
};

const weekend = (date) => {
  const newDate = new Date(date);
  let daysToWeekend = 6 - newDate.getDay();
  daysToWeekend = daysToWeekend < 1 ? 0 : daysToWeekend;

  newDate.setDate(newDate.getDate() + daysToWeekend);
  return newDate;
};

const nextWeek = (date) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 7);
  return newDate;
};

const formatDate = (date: Date) => {
  const diffInMs = Math.abs(new Date().getTime() - date.getTime());
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return `${weekdays[date.getDay()]} ${diffInDays > 5 ? date.getDate() : ""}`;
};

export { tommorrow, weekend, nextWeek, formatDate };
