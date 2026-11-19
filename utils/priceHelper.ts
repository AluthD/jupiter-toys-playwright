// Turns text like "$10.99" or "Total: 116.9" into a number.
export function parsePrice(text: string): number {
  return parseFloat(text.replace(/[^0-9.]/g, ''));
}

// Money is compared in cents. Adding decimals directly can give results like
// 116.89999999 instead of 116.9, which would make the total check fail.
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

// Turns cents back into a display price, e.g. 11690 -> "$116.90" (used in report messages)
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
