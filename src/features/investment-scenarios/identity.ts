import { createHash } from 'node:crypto';

type CanonicalValue = null | boolean | number | string | CanonicalValue[] | { [key: string]: CanonicalValue };
export function canonicalJSON(value: CanonicalValue): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJSON).join(',')}]`;
  if (value !== null && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJSON(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
export const fingerprint = (value: CanonicalValue) => createHash('sha256').update(canonicalJSON(value)).digest('hex');
