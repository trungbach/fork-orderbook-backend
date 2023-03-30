/**
 * https://stackoverflow.com/questions/4968250/how-to-round-time-to-the-nearest-quarter-hour-in-javascript
 *
 */

function roundTime(timeIn: Date, interval: number): number {
  const roundTo = interval * 60 * 1000;

  const dateOut = Math.round(timeIn.getTime() / roundTo) * roundTo;
  return dateOut / 1000;
}

export { roundTime };
