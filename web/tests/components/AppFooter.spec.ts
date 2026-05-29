import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppFooter from "@/components/AppFooter.vue";
import type { SystemInfo } from "@/types";

const mockSystemInfo: SystemInfo = {
  version: "1.0.0-test",
  columns: [],
  stats: [],
  ftypes: [],
  capture_types: [],
  encap_types: [],
  nstat: [],
  convs: [],
  seqa: [],
  taps: [],
  eo: [],
  srt: [],
  rtd: [],
  follow: [],
};

describe("AppFooter", () => {
  it("renders offline status when system is offline", () => {
    const wrapper = mount(AppFooter, {
      props: {
        systemInfo: null,
        isOnline: false,
        isLoading: false,
        error: "Unreachable",
      },
    });

    expect(wrapper.text()).toContain("Sharkophagus offline");
    expect(wrapper.find(".offline-indicator").exists()).toBe(true);
    expect(wrapper.find(".info-btn").exists()).toBe(false);
  });

  it("renders loading status when system is loading info", () => {
    const wrapper = mount(AppFooter, {
      props: {
        systemInfo: null,
        isOnline: false,
        isLoading: true,
        error: null,
      },
    });

    expect(wrapper.text()).toContain("Loading system info...");
    expect(wrapper.find(".info-btn").exists()).toBe(false);
  });

  it("renders online status without version stamp when system is online", () => {
    const wrapper = mount(AppFooter, {
      props: {
        systemInfo: mockSystemInfo,
        isOnline: true,
        isLoading: false,
        error: null,
      },
    });

    expect(wrapper.text()).toContain("Sharkophagus online");
    expect(wrapper.text()).not.toContain("v1.0.0-test");
    expect(wrapper.find(".online-indicator").exists()).toBe(true);
    expect(wrapper.find(".info-btn").exists()).toBe(false);
  });
});
