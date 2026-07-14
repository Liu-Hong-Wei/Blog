/**
 * Extract unique HTTP(S) URLs from plain text.
 * Strips trailing punctuation that commonly follows URLs in prose.
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const matches = text.match(urlRegex);
  if (!matches) return [];

  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of matches) {
    // Strip trailing punctuation that's unlikely to be part of the URL
    const cleaned = raw.replace(/[.,;:!?）)]+$/, '');
    if (!seen.has(cleaned)) {
      seen.add(cleaned);
      result.push(cleaned);
    }
  }

  return result;
}
