import { describe, it, expect } from 'vitest';
import { getSourceBias, SOURCE_BIAS_DATA } from '../src/config/sources';

describe('SOURCE_BIAS_DATA', () => {
  it('contains data for major outlets', () => {
    const requiredDomains = [
      'reuters.com',
      'apnews.com',
      'nytimes.com',
      'foxnews.com',
      'bbc.com',
    ];
    for (const domain of requiredDomains) {
      expect(SOURCE_BIAS_DATA[domain]).toBeDefined();
      expect(SOURCE_BIAS_DATA[domain].name).toBeTruthy();
      expect(SOURCE_BIAS_DATA[domain].bias).toBeTruthy();
      expect(SOURCE_BIAS_DATA[domain].factualReporting).toBeTruthy();
    }
  });

  it('has valid bias categories for all entries', () => {
    const validBias = ['left', 'left-center', 'center', 'right-center', 'right', 'independent'];
    for (const [domain, data] of Object.entries(SOURCE_BIAS_DATA)) {
      expect(validBias).toContain(data.bias);
    }
  });

  it('has valid factuality ratings for all entries', () => {
    const validFactuality = ['very-high', 'high', 'mostly-factual', 'mixed', 'low'];
    for (const [domain, data] of Object.entries(SOURCE_BIAS_DATA)) {
      expect(validFactuality).toContain(data.factualReporting);
    }
  });
});

describe('getSourceBias', () => {
  it('returns exact match for known domains', () => {
    const result = getSourceBias('reuters.com');
    expect(result).toBeDefined();
    expect(result!.name).toBe('Reuters');
    expect(result!.bias).toBe('center');
  });

  it('returns partial match for subdomains', () => {
    const result = getSourceBias('www.nytimes.com');
    expect(result).toBeDefined();
    expect(result!.name).toBe('The New York Times');
  });

  it('returns undefined for unknown domains', () => {
    expect(getSourceBias('randomsite.xyz')).toBeUndefined();
  });

  it('matches subdomains via partial match', () => {
    const result = getSourceBias('www.foxnews.com');
    expect(result).toBeDefined();
    expect(result!.name).toBe('Fox News');
  });
});
