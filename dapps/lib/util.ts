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
