import BrandName from '../components/shared/BrandName';

/**
 * Splits a plain text string at every occurrence of "EAXY STORE"
 * and interleaves it with the two-tone <BrandName /> component.
 */
export function parseBrandText(text) {
  const parts = text.split('EAXY STORE');
  if (parts.length === 1) return text;
  return parts.reduce((acc, part, i) => {
    if (i === 0) return [part];
    return [...acc, <BrandName key={i} />, part];
  }, []);
}
