import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FilterBar from "@/components/FilterBar.vue";

const mockCheck = vi.fn().mockResolvedValue({ valid: true });

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
        check: mockCheck,
      };
    }),
  };
});

describe("FilterBar.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCheck.mockResolvedValue({ valid: true });
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

  it("validates input using debounced check endpoint and updates UI state", async () => {
    vi.useFakeTimers();
    const wrapper = mount(FilterBar, {
      props: { sessionId: "test-session-123" },
    });

    mockCheck.mockResolvedValueOnce({
      valid: false,
      errorMessage: "Invalid syntax",
    });

    const input = wrapper.find(".filter-input");
    await input.setValue("tcp.port == ");

    // Fast forward debounce timer (500ms)
    vi.advanceTimersByTime(500);
    // Wait for promises to resolve
    await vi.runAllTimersAsync();

    expect(mockCheck).toHaveBeenCalledWith(
      "test-session-123",
      "filter",
      "tcp.port ==",
    );

    // Check UI state
    expect(wrapper.find(".error-icon-wrapper").exists()).toBe(true);
    expect(wrapper.find(".error-icon-wrapper").attributes("title")).toContain(
      "Invalid syntax",
    );

    vi.useRealTimers();
  });

  it("disables Apply button when filter is invalid", async () => {
    vi.useFakeTimers();
    const wrapper = mount(FilterBar, {
      props: { sessionId: "test-session-123" },
    });

    mockCheck.mockResolvedValueOnce({
      valid: false,
      errorMessage: "Invalid syntax",
    });

    await wrapper.find(".filter-input").setValue("tcp.port == ");
    vi.advanceTimersByTime(500);
    await vi.runAllTimersAsync();

    const applyBtn = wrapper.find(".apply-btn");
    expect((applyBtn.element as HTMLButtonElement).disabled).toBe(true);

    vi.useRealTimers();
  });

  it("applies a valid filter", async () => {
    vi.useFakeTimers();
    const wrapper = mount(FilterBar, {
      props: { sessionId: "test-session-123" },
    });

    mockCheck.mockResolvedValueOnce({ valid: true });

    await wrapper.find(".filter-input").setValue("tcp.port == 80");
    vi.advanceTimersByTime(500);
    await vi.runAllTimersAsync();

    const applyBtn = wrapper.find(".apply-btn");
    expect((applyBtn.element as HTMLButtonElement).disabled).toBe(false);

    await applyBtn.trigger("click");
    expect(wrapper.emitted("apply")).toBeTruthy();
    expect(wrapper.emitted("apply")![0]).toEqual(["tcp.port == 80"]);

    vi.useRealTimers();
  });

  it("clearing filter resets validation state and emits empty apply", async () => {
    vi.useFakeTimers();
    const wrapper = mount(FilterBar, {
      props: { sessionId: "test-session-123", initialFilter: "tcp.port == 80" },
    });

    // Suppose we clear the input
    const input = wrapper.find(".filter-input");
    await input.setValue("");
    vi.advanceTimersByTime(500);
    await vi.runAllTimersAsync();

    // Check error state is reset
    expect(wrapper.find(".error-icon-wrapper").exists()).toBe(false);

    // Wait, clearing shouldn't auto-apply according to spec?
    // US3: "clearing filter resets validationError and emits empty apply" (wait, the task says "Ensure clearing filter resets validationError and emits empty apply")
    // Wait, "clears filter to return to viewing all packets" usually means clicking a "clear" button or manually applying empty text. Let's trigger apply.
    const applyBtn = wrapper.find(".apply-btn");
    await applyBtn.trigger("click");

    expect(wrapper.emitted("apply")).toBeTruthy();
    expect(wrapper.emitted("apply")![0]).toEqual([""]); // latest apply

    vi.useRealTimers();
  });
});
