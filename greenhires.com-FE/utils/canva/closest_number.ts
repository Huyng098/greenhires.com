export function closestNumber(n: number, m: number): number {
  const q = Math.trunc(n / m);
  const n1 = m * q;
  const n2 = n * m > 0 ? m * (q + 1) : m * (q - 1);
  if (Math.abs(n - n1) < Math.abs(n - n2)) return n1;
  return n2;
}
