/**
 * Returns a password strength descriptor based on the password value.
 * @param {string} pw
 * @returns {{ label: string, score: number, color: string }}
 */
export function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: 'Weak', score: 1, color: '#ef4444' };
  if (score === 2) return { label: 'Fair', score: 2, color: '#f59e0b' };
  if (score === 3) return { label: 'Good', score: 3, color: '#3b82f6' };
  return { label: 'Strong', score: 4, color: '#10b981' };
}
