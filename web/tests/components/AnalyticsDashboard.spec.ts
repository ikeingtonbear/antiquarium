import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AnalyticsDashboard from "../../src/components/AnalyticsDashboard.vue";

describe("AnalyticsDashboard.vue - User Story 3", () => {
  it("renders active taps if there are any", () => {
    const activeTaps = [
      {
        id: "tap_1",
        name: "HTTP Expert Info",
        tapString: "eo:http",
        results: { text: "Some stats" },
      },
    ];

    const wrapper = mount(AnalyticsDashboard, {
      props: {
        activeTaps,
      },
    });

    expect(wrapper.text()).toContain("HTTP Expert Info");
    expect(wrapper.text()).toContain("Some stats");
  });

  it("displays a message when no taps are active", () => {
    const wrapper = mount(AnalyticsDashboard, {
      props: {
        activeTaps: [],
      },
    });

    expect(wrapper.text()).toContain("No active taps");
  });
});
