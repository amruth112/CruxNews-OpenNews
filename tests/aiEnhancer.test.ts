import { describe, it, expect } from 'vitest';
import { selectBestOllamaModel } from '../src/services/aiEnhancer';

describe('selectBestOllamaModel', () => {
  it('returns null for empty models array', () => {
    expect(selectBestOllamaModel([])).toBeNull();
  });

  it('returns null for null/undefined input', () => {
    expect(selectBestOllamaModel(null as any)).toBeNull();
  });

  it('prefers llama3.2:3b when available', () => {
    const models = ['phi3:mini', 'llama3.2:3b', 'mistral:7b'];
    expect(selectBestOllamaModel(models)).toBe('llama3.2:3b');
  });

  it('falls back to mistral when llama is unavailable', () => {
    const models = ['gemma:2b', 'mistral:latest'];
    expect(selectBestOllamaModel(models)).toBe('mistral:latest');
  });

  it('returns first available model when no preferences match', () => {
    const models = ['codellama:13b', 'deepseek:6.7b'];
    expect(selectBestOllamaModel(models)).toBe('codellama:13b');
  });

  it('matches partial model names', () => {
    const models = ['llama3.1:8b-instruct-q4_0'];
    expect(selectBestOllamaModel(models)).toBe('llama3.1:8b-instruct-q4_0');
  });
});
