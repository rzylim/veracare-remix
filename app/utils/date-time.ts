export const MS_IN_SECOND = 1000;
export const SECONDS_IN_MINUTE = 60;
export const MS_IN_MINUTE = SECONDS_IN_MINUTE * MS_IN_SECOND;
export const MINUTES_IN_HOUR = 60;
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
export const MS_IN_HOUR = SECONDS_IN_HOUR * MS_IN_SECOND;

export const mapDayOfWeekString = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// use toISOString() as toDateString() produces inconsistent results between web and react-native.
// does not include time on web, but does on react-native.
// toISOString() uses local time.
export const getDateString = (date: Date) => date.toISOString().slice(0, 10);

export const msFromHoursMinutes = (
  hours: number,
  minutes?: number,
  seconds?: number,
  milliseconds?: number
) =>
  (hours * SECONDS_IN_HOUR +
    (minutes || 0) * SECONDS_IN_MINUTE +
    (seconds || 0)) *
    MS_IN_SECOND +
  (milliseconds || 0);

// returns duration or time since midnight given ms since midnight.
export const durationMsToHoursMinutes = (timeInMs: number) => {
  const hours = Math.floor(timeInMs / MS_IN_HOUR);
  let remainderTimeInMs = timeInMs % MS_IN_HOUR;
  const minutes = Math.floor(remainderTimeInMs / MS_IN_MINUTE);
  remainderTimeInMs %= MS_IN_MINUTE;
  const seconds = Math.floor(remainderTimeInMs / MS_IN_SECOND);
  const milliseconds = remainderTimeInMs % MS_IN_SECOND;

  return { hours, minutes, seconds, milliseconds };
};

// returns duration or time since midnight given ms since midnight as a 24h HH:mm string.
export const durationMsToHoursMinutesString = (durationInMs: number) =>
  // create date object for display of time. uses UTC time.
  // get section of string showing hours and minutes.
  new Date(durationInMs).toUTCString().slice(17, 22);

// returns timestamp at last local midnight.
export const msAtMidnight = (date: Date) =>
  date.getTime() -
  msFromHoursMinutes(
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );

// returns milliseconds since last local midnight.
export const msSinceMidnight = (date: Date) =>
  date.getTime() - msAtMidnight(date);
