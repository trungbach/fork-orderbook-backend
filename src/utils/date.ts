
/**
 * https://stackoverflow.com/questions/3553964/how-to-round-time-to-the-nearest-quarter-hour-in-java/37423588
 * 
 */

function roundTime(timeIn: Date, interval: number): number {
  const roundTo = interval * 60 * 1000;

  const dateOut = Math.round(timeIn.getTime() / roundTo) * roundTo;
  return Math.floor(dateOut / 1000);
}

export { roundTime };
