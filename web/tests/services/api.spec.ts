import { describe, it, expect, vi, beforeEach } from "vitest";
import { SharkophagusApi } from "../../src/services/api";

describe("api.ts - applyTap", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should call the correct endpoint with the payload", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const api = new SharkophagusApi();
    await api.applyTap("session-123", { tap0: "eo:http" });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/v1/sessions/session-123/tap",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taps: {
            tap0: "eo:http",
          },
        }),
      },
    );
  });

  it("should throw an error if the response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: "Failed to apply tap" }),
    });

    const api = new SharkophagusApi();
    await expect(
      api.applyTap("session-123", { tap0: "eo:http" }),
    ).rejects.toThrow("Failed to apply tap");
  });
});

describe("api.ts - getAvailableTaps", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch system info and flatten taps", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          stats: [{ name: "Stat1", tap: "stat:1" }],
          taps: [{ name: "Tap1", tap: "tap:1" }],
          eo: [],
          srt: [],
          rtd: [],
          follow: [],
        }),
    });

    const api = new SharkophagusApi();
    const taps = await api.getAvailableTaps();

    expect(taps).toHaveLength(2);
    expect(taps[0].tap).toBe("stat:1");
    expect(taps[1].tap).toBe("tap:1");
  });
});
