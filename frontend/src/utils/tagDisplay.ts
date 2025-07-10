export function formatTagLabel(tag: string): string {
  const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];

  const words = tag.replace(/-/g, ' ').split(' ');

  return words.map((word, i) => {
    const lower = word.toLowerCase();
    const isFirstOrLast = i === 0 || i === words.length - 1;
    if (isFirstOrLast || !smallWords.includes(lower)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return lower;
  }).join(' ');
}
