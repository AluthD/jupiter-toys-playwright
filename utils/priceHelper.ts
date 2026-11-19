// Turns text like "$10.99" or "Total: 116.9" into a number.
export function parsePrice(text: string): number {
  return parseFloat(text.replace(/[^0-9.]/g, ''));
}

// Money is compared in cents. Adding decimals directly can give results like
// 116.89999999 instead of 116.9, which would make the total check fail.
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}
