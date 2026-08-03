import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PacketDetails from "../../src/components/PacketDetails.vue";
import { SharkophagusApi } from "../../src/services/api";

// Mock the ApiService
vi.mock("../../src/services/api");

describe("PacketDetails.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a placeholder when no frameId is provided", () => {
    const wrapper = mount(PacketDetails, {
      props: {
        sessionId: "session-123",
        frameId: null,
      },
    });
    expect(wrapper.text()).toContain("Select a packet to view details");
  });

  it("fetches and renders frame details when frameId is provided", async () => {
    const mockDetail = {
      err: 0,
      tree: [{ label: "IPv4" }],
      bytes: "mock-bytes",
    };

    // @ts-ignore - Mocking prototype method
    SharkophagusApi.prototype.getSessionFrameDetail = vi
      .fn()
      .mockResolvedValue(mockDetail);

    const wrapper = mount(PacketDetails, {
      props: {
        sessionId: "session-123",
        frameId: 42,
      },
    });

    // Wait for async fetch to complete
    await new Promise((r) => setTimeout(r, 10));

    expect(
      SharkophagusApi.prototype.getSessionFrameDetail,
    ).toHaveBeenCalledWith("session-123", 42);
    // Since HexdumpView and LayerView will be rendered as children,
    // their props or text should be present if they are integrated properly.
  });
});
