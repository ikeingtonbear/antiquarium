import { describe, it, expect, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import AnalysisModal from "@/components/AnalysisModal.vue";
import type { CaptureStatistics, CaptureAnalysis } from "@/types";

const defaultStats: CaptureStatistics = {
  frames: 1280,
  duration: 4.529,
  bytes: 524288,
  filename: "capture_traffic.pcapng",
};

const defaultAnalysis: CaptureAnalysis = {
  frames: 1280,
  protocols: ["eth", "ip", "tcp", "http"],
  first: 1599818818.123,
  last: 1599818822.652,
};

describe("AnalysisModal", () => {
  let wrapper: VueWrapper;

  afterEach(() => {
    wrapper?.unmount();
  });

  it("renders status information from stats", () => {
    wrapper = mount(AnalysisModal, {
      props: {
        statistics: defaultStats,
        analysis: defaultAnalysis,
        isClosing: false,
      },
    });

    const text = wrapper.text();
    expect(text).toContain("capture_traffic.pcapng");
    expect(text).toContain("512.00 KB");
    expect(text).toContain("1,280");
    expect(text).toContain("4.529s");
  });

  it("renders analysis findings", () => {
    wrapper = mount(AnalysisModal, {
      props: {
        statistics: defaultStats,
        analysis: defaultAnalysis,
        isClosing: false,
      },
    });

    const text = wrapper.text();
    expect(text).toContain("eth");
    expect(text).toContain("ip");
    expect(text).toContain("tcp");
    expect(text).toContain("http");
    // Epoch timestamp formatting check
    expect(text).toContain("1599818818.123");
    expect(text).toContain("1599818822.652");
  });

  it("emits close event when close button is clicked", async () => {
    wrapper = mount(AnalysisModal, {
      props: {
        statistics: defaultStats,
        analysis: defaultAnalysis,
        isClosing: false,
      },
    });

    const btn = wrapper.find(".modal-close-btn");
    expect(btn.exists()).toBe(true);
    await btn.trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
    expect(wrapper.emitted("close")!.length).toBe(1);
  });

  it("shows loading state when isClosing is true", () => {
    wrapper = mount(AnalysisModal, {
      props: {
        statistics: defaultStats,
        analysis: defaultAnalysis,
        isClosing: true,
      },
    });

    const btn = wrapper.find(".modal-close-btn");
    expect(btn.attributes("disabled")).toBeDefined();
    expect(wrapper.find(".btn-spinner").exists()).toBe(true);
  });
});
