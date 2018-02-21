export const QUOTE = 'quote';

export function quote(message) {
  return {
    type: QUOTE,
    message
  };
}
