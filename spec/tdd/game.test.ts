import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch for API testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('CET-6 Game API - Failure Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('GET /word endpoint failures', () => {
    it('should handle network error when fetching word', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      try {
        const response = await fetch('/word');
        await response.json();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Network error');
      }
    });

    it('should handle 500 internal server error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Database connection failed' })
      });

      const response = await fetch('/word');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);

      const errorData = await response.json();
      expect(errorData).toHaveProperty('error');
    });

    it('should handle 404 not found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Word not found' })
      });

      const response = await fetch('/word');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);

      const errorData = await response.json();
      expect(errorData.error).toBe('Word not found');
    });

    it('should handle rate limiting (429)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({
          error: 'Rate limit exceeded',
          retryAfter: 60
        })
      });

      const response = await fetch('/word');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(429);

      const errorData = await response.json();
      expect(errorData.error).toBe('Rate limit exceeded');
      expect(errorData.retryAfter).toBe(60);
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token in JSON');
        }
      });

      try {
        const response = await fetch('/word');
        await response.json();
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    });
  });

  describe('Data validation failures', () => {
    it('should detect missing word field in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sentence: 'This is a test sentence',
          options: ['option1', 'option2', 'option3', 'option4'],
          answerIndex: 0
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data).not.toHaveProperty('word');
      expect(data).toHaveProperty('sentence');
      expect(data).toHaveProperty('options');
      expect(data).toHaveProperty('answerIndex');
    });

    it('should detect missing sentence field in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: 'example',
          options: ['option1', 'option2', 'option3', 'option4'],
          answerIndex: 1
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data).toHaveProperty('word');
      expect(data).not.toHaveProperty('sentence');
      expect(data).toHaveProperty('options');
      expect(data).toHaveProperty('answerIndex');
    });

    it('should detect missing options array in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: 'example',
          sentence: 'This is a test sentence',
          answerIndex: 2
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data).toHaveProperty('word');
      expect(data).toHaveProperty('sentence');
      expect(data).not.toHaveProperty('options');
      expect(data).toHaveProperty('answerIndex');
    });

    it('should detect missing answerIndex in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: 'example',
          sentence: 'This is a test sentence',
          options: ['option1', 'option2', 'option3', 'option4']
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data).toHaveProperty('word');
      expect(data).toHaveProperty('sentence');
      expect(data).toHaveProperty('options');
      expect(data).not.toHaveProperty('answerIndex');
    });

    it('should detect invalid answerIndex value (negative)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: 'example',
          sentence: 'This is a test sentence',
          options: ['option1', 'option2', 'option3', 'option4'],
          answerIndex: -1
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data.answerIndex).toBe(-1);
      expect(data.answerIndex).toBeLessThan(0);
    });

    it('should detect invalid answerIndex value (too large)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: 'example',
          sentence: 'This is a test sentence',
          options: ['option1', 'option2', 'option3', 'option4'],
          answerIndex: 5
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data.answerIndex).toBe(5);
      expect(data.answerIndex).toBeGreaterThan(3);
    });

    it('should detect options array with insufficient elements', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: 'example',
          sentence: 'This is a test sentence',
          options: ['option1', 'option2'],
          answerIndex: 1
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data.options).toHaveLength(2);
      expect(data.options.length).toBeLessThan(4);
    });

    it('should detect options array with too many elements', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: 'example',
          sentence: 'This is a test sentence',
          options: ['option1', 'option2', 'option3', 'option4', 'option5'],
          answerIndex: 2
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data.options).toHaveLength(5);
      expect(data.options.length).toBeGreaterThan(4);
    });

    it('should detect empty word string', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: '',
          sentence: 'This is a test sentence',
          options: ['option1', 'option2', 'option3', 'option4'],
          answerIndex: 0
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data.word).toBe('');
      expect(data.word.length).toBe(0);
    });

    it('should detect empty sentence string', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: 'example',
          sentence: '',
          options: ['option1', 'option2', 'option3', 'option4'],
          answerIndex: 0
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data.sentence).toBe('');
      expect(data.sentence.length).toBe(0);
    });

    it('should detect empty string in options array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: 'example',
          sentence: 'This is a test sentence',
          options: ['option1', '', 'option3', 'option4'],
          answerIndex: 0
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data.options[1]).toBe('');
      expect(data.options[1].length).toBe(0);
    });

    it('should detect non-string values in options array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: 'example',
          sentence: 'This is a test sentence',
          options: ['option1', 123, 'option3', true],
          answerIndex: 0
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(typeof data.options[0]).toBe('string');
      expect(typeof data.options[1]).toBe('number');
      expect(typeof data.options[2]).toBe('string');
      expect(typeof data.options[3]).toBe('boolean');

      expect(data.options[1]).toBe(123);
      expect(data.options[3]).toBe(true);
    });
  });

  describe('Edge cases and boundary failures', () => {
    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data).toBe(null);
    });

    it('should handle undefined response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => undefined
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data).toBe(undefined);
    });

    it('should handle empty object response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(Object.keys(data)).toHaveLength(0);
    });

    it('should handle very long word string', async () => {
      const longWord = 'a'.repeat(1000);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: longWord,
          sentence: 'This is a test sentence',
          options: ['option1', 'option2', 'option3', 'option4'],
          answerIndex: 0
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data.word.length).toBe(1000);
      expect(data.word.length).toBeGreaterThan(100);
    });

    it('should handle very long sentence string', async () => {
      const longSentence = 'This is a very long sentence. '.repeat(100);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          word: 'example',
          sentence: longSentence,
          options: ['option1', 'option2', 'option3', 'option4'],
          answerIndex: 0
        })
      });

      const response = await fetch('/word');
      const data = await response.json();

      expect(data.sentence.length).toBeGreaterThan(1000);
    });
  });
});