import {describe, it, expect} from 'vitest';
import {extractLocale, getDomainLocaleExtractorFunction} from './domains.js';
import {transformWithEsbuild} from 'vite';

describe('Setup i18n with domains', () => {
  it('extracts the locale from the domain', () => {
    expect(extractLocale('https://example.com')).toMatchObject({
      language: 'EN',
      country: 'US',
    });
    expect(extractLocale('https://example.jp')).toMatchObject({
      language: 'JA',
      country: 'JP',
    });
    expect(extractLocale('https://www.example.es')).toMatchObject({
      language: 'ES',
      country: 'ES',
    });
  });

  it('adds TS types correctly', async () => {
    const tsFn = getDomainLocaleExtractorFunction(true);

    expect(tsFn).toMatch(/function \w+\(\w+:\s*\w+\):\s*[{},\w\s;:]+{\n/i);

    const {code} = await transformWithEsbuild(tsFn, 'file.ts', {
      sourcemap: false,
      tsconfigRaw: {compilerOptions: {target: 'esnext'}},
    });

    expect(code.trim()).toEqual(extractLocale.toString().trim());
  });
});
