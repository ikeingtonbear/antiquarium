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

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SharkophagusApi } from "@/services/api";
import type { CaptureSession, CaptureStatistics } from "@/types";

/* ── Mock global fetch ── */
const mockFetch = vi.fn();

describe("SharkophagusApi", () => {
  let api: SharkophagusApi;

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    api = new SharkophagusApi("http://localhost:8080/v1");
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /* ──────────────────────────────────────────────────
     T012 [US1]: createSession
     ────────────────────────────────────────────────── */

  describe("createSession", () => {
    it("sends a POST request to /sessions with multipart/form-data", async () => {
      const mockSession: CaptureSession = {
        id: "test-uuid-123",
        status: "active",
        createdAt: "2026-05-21T18:00:00Z",
        fileName: "test.pcap",
        fileSize: 1024,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            id: "test-uuid-123",
            status: "active",
            createdAt: "2026-05-21T18:00:00Z",
          }),
      });

      const file = new File(["test-content"], "test.pcap", {
        type: "application/octet-stream",
      });

      const result = await api.createSession(file);

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("http://localhost:8080/v1/sessions");
      expect(options.method).toBe("POST");
      expect(options.body).toBeInstanceOf(FormData);
    });

    it("returns a CaptureSession with client-derived fields", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () =>
          Promise.resolve({
            id: "uuid-abc",
            status: "active",
            createdAt: "2026-05-21T18:00:00Z",
          }),
      });

      const file = new File(["a".repeat(2048)], "capture.pcapng", {
        type: "application/octet-stream",
      });

      const result = await api.createSession(file);

      expect(result.id).toBe("uuid-abc");
      expect(result.status).toBe("active");
      expect(result.fileName).toBe("capture.pcapng");
      expect(result.fileSize).toBe(2048);
    });

    it("throws on server error response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () =>
          Promise.resolve({
            code: "SHARKD_ERROR",
            message: "Failed to start sharkd",
          }),
      });

      const file = new File(["data"], "test.pcap");

      await expect(api.createSession(file)).rejects.toThrow(
        "Failed to start sharkd",
      );
    });

    it("throws on network failure", async () => {
      mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      const file = new File(["data"], "test.pcap");

      await expect(api.createSession(file)).rejects.toThrow(
        "API server is unreachable. Please verify backend connection.",
      );
    });
  });

  /* ──────────────────────────────────────────────────
     T018 [US2]: getStatistics
     ────────────────────────────────────────────────── */

  describe("getStatistics", () => {
    it("sends a GET request to /sessions/{id}/stats", async () => {
      const mockStats: CaptureStatistics = {
        frames: 1280,
        duration: 4.529,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockStats),
      });

      const result = await api.getStatistics("session-123");

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe("http://localhost:8080/v1/sessions/session-123/stats");
    });

    it("returns correct statistics data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            frames: 500,
            duration: 2.1,
          }),
      });

      const stats = await api.getStatistics("id-456");

      expect(stats.frames).toBe(500);
      expect(stats.duration).toBe(2.1);
    });

    it("throws on 404 (session expired)", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            code: "NOT_FOUND",
            message: "Session not found",
          }),
      });

      await expect(api.getStatistics("expired-id")).rejects.toThrow(
        "Session expired. Resetting application...",
      );
    });
  });

  /* ──────────────────────────────────────────────────
     T023 [US3]: closeSession
     ────────────────────────────────────────────────── */

  describe("closeSession", () => {
    it("sends a DELETE request to /sessions/{id}", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await api.closeSession("session-789");

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("http://localhost:8080/v1/sessions/session-789");
      expect(options.method).toBe("DELETE");
    });

    it("resolves on successful 204 response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await expect(api.closeSession("id-abc")).resolves.toBeUndefined();
    });

    it("throws on 404 (session not found)", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            code: "NOT_FOUND",
            message: "Session does not exist",
          }),
      });

      await expect(api.closeSession("missing-id")).rejects.toThrow();
    });

    it("throws on server error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () =>
          Promise.resolve({
            code: "INTERNAL_ERROR",
            message: "Failed to terminate daemon cleanly",
          }),
      });

      await expect(api.closeSession("id-fail")).rejects.toThrow(
        "Failed to terminate daemon cleanly",
      );
    });
  });

  /* ──────────────────────────────────────────────────
     T004 [US1]: getAnalysis
     ────────────────────────────────────────────────── */
  describe("getAnalysis", () => {
    it("sends a GET request to /sessions/{id}/analyse", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            frames: 10,
            protocols: ["eth", "ip"],
            first: 100.5,
            last: 200.5,
          }),
      });

      const result = await api.getAnalysis("session-123");

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe("http://localhost:8080/v1/sessions/session-123/analyse");
      expect(result).toEqual({
        frames: 10,
        protocols: ["eth", "ip"],
        first: 100.5,
        last: 200.5,
      });
    });

    it("throws on 404 (session not found)", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            code: "NOT_FOUND",
            message: "Session not found",
          }),
      });

      await expect(api.getAnalysis("expired-id")).rejects.toThrow(
        "Session not found",
      );
    });
  });

  /* ──────────────────────────────────────────────────
     T002 [US1]: getSystemInfo
     ────────────────────────────────────────────────── */
  describe("getSystemInfo", () => {
    it("sends a GET request to /info", async () => {
      const mockInfo = {
        version: "1.2.3",
        columns: [{ name: "No.", format: "%m" }],
        stats: [{ name: "Taps", tap: "taps" }],
        ftypes: ["ip", "tcp"],
        capture_types: [{ name: "pcap", description: "PCAP" }],
        encap_types: [{ name: "ether", description: "Ethernet" }],
        nstat: [],
        convs: [],
        seqa: [],
        taps: [],
        eo: [],
        srt: [],
        rtd: [],
        follow: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockInfo),
      });

      const result = await api.getSystemInfo();

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe("http://localhost:8080/v1/info");
      expect(result).toEqual(mockInfo);
    });

    it("throws on server error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () =>
          Promise.resolve({
            code: "INTERNAL_ERROR",
            message: "Internal server error",
          }),
      });

      await expect(api.getSystemInfo()).rejects.toThrow(
        "Internal server error",
      );
    });
  });

  /* ──────────────────────────────────────────────────
     T004 [US1]: getSystemConfig
     ────────────────────────────────────────────────── */
  describe("getSystemConfig", () => {
    it("sends a GET request to /config", async () => {
      const mockConfig = [
        { name: "udp.check_checksum", type: "boolean", value: true },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockConfig),
      });

      const result = await api.getSystemConfig();

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe("http://localhost:8080/v1/config");
      expect(result).toEqual(mockConfig);
    });

    it("sends a GET request to /config?pref=udp.check_checksum when pref is provided", async () => {
      const mockConfig = [
        { name: "udp.check_checksum", type: "boolean", value: true },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockConfig),
      });

      await api.getSystemConfig("udp.check_checksum");

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe(
        "http://localhost:8080/v1/config?pref=udp.check_checksum",
      );
    });
  });

  /* ──────────────────────────────────────────────────
     T013 [US3]: updateSessionConfig
     ────────────────────────────────────────────────── */
  describe("updateSessionConfig", () => {
    it("sends a POST request to /sessions/{sessionId}/config", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await api.updateSessionConfig("session-abc", "udp.check_checksum", true);

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("http://localhost:8080/v1/sessions/session-abc/config");
      expect(options.method).toBe("POST");
      expect(JSON.parse(options.body)).toEqual({
        name: "udp.check_checksum",
        value: true,
      });
    });
  });

  /* ──────────────────────────────────────────────────
     T004: getSessionFrames
     ────────────────────────────────────────────────── */
  describe("getSessionFrames", () => {
    it("sends a GET request to /sessions/{sessionId}/frames with parameters", async () => {
      const mockFrames = [
        { num: 1, c: ["0.0", "1.1.1.1", "2.2.2.2", "TCP", "64", "Info"] },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockFrames),
      });

      const result = await api.getSessionFrames("session-123", 10, 50, "ip");

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe(
        "http://localhost:8080/v1/sessions/session-123/frames?skip=10&limit=50&filter=ip",
      );
      expect(result).toEqual(mockFrames);
    });

    it("throws on 404 (session not found)", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            code: "NOT_FOUND",
            message: "Session not found",
          }),
      });

      await expect(api.getSessionFrames("missing-session")).rejects.toThrow(
        "Session not found",
      );
    });
  });

  describe("getSessionFrameDetail", () => {
    it("sends a GET request to /sessions/{sessionId}/frames/{frameId} with proto=true by default", async () => {
      const mockDetail = {
        err: 0,
        tree: [{ label: "Ethernet II" }],
        fol: [],
        bytes: "abcd",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockDetail),
      });

      const result = await api.getSessionFrameDetail("session-123", 42);

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe(
        "http://localhost:8080/v1/sessions/session-123/frames/42?proto=true",
      );
      expect(result).toEqual(mockDetail);
    });

    it("throws on 404 (frame not found)", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            code: "NOT_FOUND",
            message: "Frame not found",
          }),
      });

      await expect(
        api.getSessionFrameDetail("session-123", 999),
      ).rejects.toThrow("Frame not found");
    });
  });

  describe("getComplete", () => {
    it("sends a GET request to /sessions/{sessionId}/complete with correct query params", async () => {
      const mockCompleteResponse = {
        completions: [
          { value: "tcp.port", description: "TCP Port" },
          { value: "tcp.options", description: "TCP Options" },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockCompleteResponse),
      });

      const result = await api.getComplete(
        "session-123",
        "preference",
        "tcp.po",
      );

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe(
        "http://localhost:8080/v1/sessions/session-123/complete?type=preference&prefix=tcp.po",
      );
      expect(result).toEqual(mockCompleteResponse);
    });

    it("throws on network error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(
        api.getComplete("session-123", "preference", "tcp"),
      ).rejects.toThrow(
        "API server is unreachable. Please verify backend connection.",
      );
    });

    it("throws on 404", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            code: "NOT_FOUND",
            message: "Session not found",
          }),
      });

      await expect(
        api.getComplete("session-123", "preference", "tcp"),
      ).rejects.toThrow("Session not found");
    });
  });

  describe("check", () => {
    it("should call the API check endpoint and return CheckResponse", async () => {
      const mockResponse = { valid: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.check(
        "test-session",
        "filter",
        "tcp.port == 80",
      );

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/v1/sessions/test-session/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "filter",
            expression: "tcp.port == 80",
          }),
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle error cases for the check endpoint", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ code: 2, message: "Syntax error" }),
      });

      await expect(
        api.check("test-session", "filter", "invalid"),
      ).rejects.toThrow("Syntax error");
    });
  });

  describe("followStream", () => {
    it("should call the follow endpoint and return stream response", async () => {
      const mockResponse = {
        shost: "192.168.1.1",
        sport: "80",
        sbytes: 100,
        chost: "192.168.1.2",
        cport: "12345",
        cbytes: 50,
        payloads: [{ n: 10, d: "dGVzdA==", s: 0 }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.followStream("test-session", "TCP", "tcp.stream eq 0");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/v1/sessions/test-session/follow?follow=TCP&filter=tcp.stream+eq+0",
        { method: "GET", headers: { Accept: "application/json" } },
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
