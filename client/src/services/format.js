export function signedNumber(input) {
  const sign = input > 0 ? '+' : '';
  return `${sign}${input}`;
}
