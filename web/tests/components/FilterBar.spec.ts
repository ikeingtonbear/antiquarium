import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FilterBar from "@/components/FilterBar.vue";

// Mock SharkophagusApi
vi.mock("@/services/api", () => {
  return {
    SharkophagusApi: vi.fn().mockImplementation(() => {
      return {
        getComplete: vi.fn().mockResolvedValue({
          completions: [
            { value: "ip.addr", description: "IP Address" },
            { value: "ip.src", description: "Source IP" },
          ],
        }),
      };
    }),
  };
});

describe("FilterBar.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    const wrapper = mount(FilterBar, {
      props: {
        sessionId: "test-session-123",
      },
    });

    expect(wrapper.find(".filter-input").exists()).toBe(true);
    expect(wrapper.find(".apply-btn").exists()).toBe(true);
  });

  it("emits apply event when apply button is clicked with valid text", async () => {
    const wrapper = mount(FilterBar, {
      props: {
        sessionId: "test-session-123",
        initialFilter: "tcp.port == 80",
      },
    });

    await wrapper.find(".apply-btn").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("apply");
    expect(wrapper.emitted("apply")?.[0]).toEqual(["tcp.port == 80"]);
  });

  it("shows error when apply button is clicked with invalid text (ERROR)", async () => {
    const wrapper = mount(FilterBar, {
      props: {
        sessionId: "test-session-123",
        initialFilter: "ERROR",
      },
    });

    await wrapper.find(".apply-btn").trigger("click");
    expect(wrapper.emitted()).not.toHaveProperty("apply");
    expect(wrapper.find(".error-container").exists()).toBe(true);
  });
});
