/**
 * Unit Tests — API Client Service
 *
 * TDD: These tests are written BEFORE the API client implementation
 * to drive the design of the SharkophagusApi class.
 *
 * Tests cover:
 * - T012 [US1]: Upload session creation with progress callback
 * - T018 [US2]: Statistics retrieval
 * - T023 [US3]: Session close/deletion
 *
 * @see contracts/api-client.md — API contract specification
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SharkophagusApi } from '@/services/api';
import type { CaptureSession, CaptureStatistics } from '@/types';

/* ── Mock global fetch ── */
const mockFetch = vi.fn();

describe('SharkophagusApi', () => {
  let api: SharkophagusApi;

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    api = new SharkophagusApi('http://localhost:8080/v1');
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /* ──────────────────────────────────────────────────
     T012 [US1]: createSession
     ────────────────────────────────────────────────── */

  describe('createSession', () => {
    it('sends a POST request to /sessions with multipart/form-data', async () => {
      const mockSession: CaptureSession = {
        id: 'test-uuid-123',
        status: 'active',
        createdAt: '2026-05-21T18:00:00Z',
        fileName: 'test.pcap',
        fileSize: 1024,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            id: 'test-uuid-123',
            status: 'active',
            createdAt: '2026-05-21T18:00:00Z',
          }),
      });

      const file = new File(['test-content'], 'test.pcap', {
        type: 'application/octet-stream',
      });

      const result = await api.createSession(file);

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe('http://localhost:8080/v1/sessions');
      expect(options.method).toBe('POST');
      expect(options.body).toBeInstanceOf(FormData);
    });

    it('returns a CaptureSession with client-derived fields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () =>
          Promise.resolve({
            id: 'uuid-abc',
            status: 'active',
            createdAt: '2026-05-21T18:00:00Z',
          }),
      });

      const file = new File(['a'.repeat(2048)], 'capture.pcapng', {
        type: 'application/octet-stream',
      });

      const result = await api.createSession(file);

      expect(result.id).toBe('uuid-abc');
      expect(result.status).toBe('active');
      expect(result.fileName).toBe('capture.pcapng');
      expect(result.fileSize).toBe(2048);
    });

    it('throws on server error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () =>
          Promise.resolve({
            code: 'SHARKD_ERROR',
            message: 'Failed to start sharkd',
          }),
      });

      const file = new File(['data'], 'test.pcap');

      await expect(api.createSession(file)).rejects.toThrow(
        'Failed to start sharkd'
      );
    });

    it('throws on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const file = new File(['data'], 'test.pcap');

      await expect(api.createSession(file)).rejects.toThrow(
        'API server is unreachable. Please verify backend connection.'
      );
    });
  });

  /* ──────────────────────────────────────────────────
     T018 [US2]: getStatistics
     ────────────────────────────────────────────────── */

  describe('getStatistics', () => {
    it('sends a GET request to /sessions/{id}/stats', async () => {
      const mockStats: CaptureStatistics = {
        frames: 1280,
        bytes: 524288,
        duration: 4.529,
        firstPacketTime: '2026-05-21T18:00:00.001Z',
        lastPacketTime: '2026-05-21T18:00:04.530Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockStats),
      });

      const result = await api.getStatistics('session-123');

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe('http://localhost:8080/v1/sessions/session-123/stats');
    });

    it('returns correct statistics data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            frames: 500,
            bytes: 102400,
            duration: 2.1,
            firstPacketTime: '2026-01-01T00:00:00Z',
            lastPacketTime: '2026-01-01T00:00:02.100Z',
          }),
      });

      const stats = await api.getStatistics('id-456');

      expect(stats.frames).toBe(500);
      expect(stats.bytes).toBe(102400);
      expect(stats.duration).toBe(2.1);
      expect(stats.firstPacketTime).toBe('2026-01-01T00:00:00Z');
      expect(stats.lastPacketTime).toBe('2026-01-01T00:00:02.100Z');
    });

    it('throws on 404 (session expired)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            code: 'NOT_FOUND',
            message: 'Session not found',
          }),
      });

      await expect(api.getStatistics('expired-id')).rejects.toThrow(
        'Session expired. Resetting application...'
      );
    });
  });

  /* ──────────────────────────────────────────────────
     T023 [US3]: closeSession
     ────────────────────────────────────────────────── */

  describe('closeSession', () => {
    it('sends a DELETE request to /sessions/{id}', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await api.closeSession('session-789');

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe('http://localhost:8080/v1/sessions/session-789');
      expect(options.method).toBe('DELETE');
    });

    it('resolves on successful 204 response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await expect(api.closeSession('id-abc')).resolves.toBeUndefined();
    });

    it('throws on 404 (session not found)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            code: 'NOT_FOUND',
            message: 'Session does not exist',
          }),
      });

      await expect(api.closeSession('missing-id')).rejects.toThrow();
    });

    it('throws on server error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () =>
          Promise.resolve({
            code: 'INTERNAL_ERROR',
            message: 'Failed to terminate daemon cleanly',
          }),
      });

      await expect(api.closeSession('id-fail')).rejects.toThrow(
        'Failed to terminate daemon cleanly'
      );
    });
  });
});
