import { describe, it, expect } from 'vitest';
import { getAPIKey } from '../../api/auth.js';
import { IncomingHttpHeaders } from 'http';

describe('getAPIKey', () => {
  it('should return the API key when Authorization header is valid', () => {
    const headers: IncomingHttpHeaders = {
      authorization: 'ApiKey secret123',
    };

    const result = getAPIKey(headers);

    expect(result).toBe('secret123');
  });

  it('should return null when Authorization header is missing', () => {
    const headers: IncomingHttpHeaders = {};

    const result = getAPIKey(headers);

    expect(result).toBeNull();
  });

  it('should return null when Authorization header is empty string', () => {
    const headers: IncomingHttpHeaders = {
      authorization: '',
    };

    const result = getAPIKey(headers);

    expect(result).toBeNull();
  });

  it('should return null when Authorization header lacks a space separator', () => {
    const headers: IncomingHttpHeaders = {
      authorization: 'ApiKeyNoSpace',
    };

    const result = getAPIKey(headers);

    expect(result).toBeNull();
  });

  it('should return null when Authorization header uses a different scheme', () => {
    const headers: IncomingHttpHeaders = {
      authorization: 'Bearer token123',
    };

    const result = getAPIKey(headers);

    expect(result).toBeNull();
  });

  it('should return null when Authorization header has no key after the scheme', () => {
    const headers: IncomingHttpHeaders = {
      authorization: 'ApiKey',
    };

    const result = getAPIKey(headers);

    expect(result).toBeNull();
  });

  it('should handle extra spaces after the scheme correctly', () => {
    const headers: IncomingHttpHeaders = {
      authorization: 'ApiKey  secret123',
    };

    const result = getAPIKey(headers);

    // Note: The current implementation splits by single space, 
    // so 'ApiKey  secret123' becomes ['ApiKey', '', 'secret123'].
    // It will return 'secret123' because it takes index 1 (which is empty) 
    // or index 2 depending on logic. 
    // Based on the code: splitAuth[1] would be empty string.
    // Let's verify the current logic behavior:
    // "ApiKey  secret".split(" ") -> ["ApiKey", "", "secret"]
    // splitAuth[1] is "".
    // So this test expects null based on the current implementation logic.
    expect(result).toBeNull();
  });

  it('should handle case sensitivity of the scheme', () => {
    const headers: IncomingHttpHeaders = {
      authorization: 'apikey secret123', // lowercase
    };

    const result = getAPIKey(headers);

    // The code checks strictly for 'ApiKey' (case-sensitive)
    expect(result).toBeNull();
  });

  it('should handle case sensitivity of the scheme (mixed case)', () => {
    const headers: IncomingHttpHeaders = {
      authorization: 'APIKEY secret123',
    };

    const result = getAPIKey(headers);

    expect(result).toBeNull();
  });
});