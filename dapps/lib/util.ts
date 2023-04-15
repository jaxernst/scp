export const shorthandAddress = (address: string) => {
  return "0x" + address.slice(2, 4) + "..." + address.slice(-4);
};

export function timeString(secondsAfterMidnight: number) {
  var hours = Math.floor(secondsAfterMidnight / 3600);
  var minutes = Math.floor((secondsAfterMidnight % 3600) / 60);
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  var minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutesFormatted + " " + ampm;
  return strTime;
}

export function formatTime(timeInSeconds: number) {
  const MINUTE_IN_SECONDS = 60;
  const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60;
  const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24;
  const WEEK_IN_SECONDS = DAY_IN_SECONDS * 7;

  if (timeInSeconds < MINUTE_IN_SECONDS) {
    return `${timeInSeconds} second${timeInSeconds === 1 ? "" : "s"}`;
  } else if (timeInSeconds < HOUR_IN_SECONDS) {
    const minutes = Math.floor(timeInSeconds / MINUTE_IN_SECONDS);
    const seconds = timeInSeconds % MINUTE_IN_SECONDS;
    return `${minutes} minute${minutes === 1 ? "" : "s"} and ${seconds} second${
      seconds === 1 ? "" : "s"
    }`;
  } else if (timeInSeconds < DAY_IN_SECONDS) {
    const hours = Math.floor(timeInSeconds / HOUR_IN_SECONDS);
    const minutes = Math.floor(
      (timeInSeconds % HOUR_IN_SECONDS) / MINUTE_IN_SECONDS
    );
    return `${hours} hour${hours === 1 ? "" : "s"}, ${minutes} minute${
      minutes === 1 ? "" : "s"
    }`;
  } else if (timeInSeconds < WEEK_IN_SECONDS) {
    const days = Math.floor(timeInSeconds / DAY_IN_SECONDS);
    const hours = Math.floor(
      (timeInSeconds % DAY_IN_SECONDS) / HOUR_IN_SECONDS
    );
    return `${days} day${days === 1 ? "" : "s"}, ${hours} hour${
      hours === 1 ? "" : "s"
    }`;
  } else {
    const weeks = Math.floor(timeInSeconds / WEEK_IN_SECONDS);
    const days = Math.floor((timeInSeconds % WEEK_IN_SECONDS) / DAY_IN_SECONDS);
    return `${weeks} week${weeks === 1 ? "" : "s"}, ${days} day${
      days === 1 ? "" : "s"
    }`;
  }
}
