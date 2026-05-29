import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SystemInfoModal from "@/components/SystemInfoModal.vue";
import type { SystemInfo } from "@/types";

const mockSystemInfo: SystemInfo = {
  version: "1.2.3-git",
  columns: [
    { name: "Number", format: "%m" },
    { name: "Time", format: "%t" },
  ],
  stats: [{ name: "Stats Tap", tap: "stats_tap" }],
  ftypes: ["ip", "tcp", "udp"],
  capture_types: [{ name: "pcap", description: "PCAP capture format" }],
  encap_types: [{ name: "ether", description: "Ethernet encapsulation" }],
  nstat: [{ name: "NStats Tap", tap: "nstats_tap" }],
  convs: [{ name: "Convs Tap", tap: "convs_tap" }],
  seqa: [{ name: "Seq Tap", tap: "seq_tap" }],
  taps: [{ name: "General Tap", tap: "general_tap" }],
  eo: [{ name: "Export Object", tap: "eo_tap" }],
  srt: [{ name: "SRT Tap", tap: "srt_tap" }],
  rtd: [{ name: "RTD Tap", tap: "rtd_tap" }],
  follow: [{ name: "Follow Tap", tap: "follow_tap" }],
};

describe("SystemInfoModal", () => {
  it("renders nothing when isOpen is false", () => {
    const wrapper = mount(SystemInfoModal, {
      props: {
        isOpen: false,
        systemInfo: mockSystemInfo,
      },
    });

    expect(wrapper.find(".modal-overlay").exists()).toBe(false);
  });

  it("renders overlay and structured categories when isOpen is true", () => {
    const wrapper = mount(SystemInfoModal, {
      props: {
        isOpen: true,
        systemInfo: mockSystemInfo,
      },
    });

    expect(wrapper.find(".modal-overlay").exists()).toBe(true);
    expect(wrapper.text()).toContain("System Capabilities");
    expect(wrapper.text()).toContain("1.2.3-git");

    // Checks if tabs are present
    const tabs = wrapper.findAll(".tab-button");
    expect(tabs.length).toBeGreaterThanOrEqual(4);
  });

  it("switches tabs and displays active tab contents", async () => {
    const wrapper = mount(SystemInfoModal, {
      props: {
        isOpen: true,
        systemInfo: mockSystemInfo,
      },
    });

    // Default tab is usually "overview" or "columns"
    expect(wrapper.text()).toContain("Columns");

    // Find tab button for "Formats" and click it
    const formatTab = wrapper
      .findAll(".tab-button")
      .find((t) => t.text() === "Formats");
    expect(formatTab).toBeDefined();
    await formatTab?.trigger("click");

    expect(wrapper.text()).toContain("PCAP capture format");
    expect(wrapper.text()).toContain("Ethernet encapsulation");
  });

  it("emits close event when close button or overlay is clicked", async () => {
    const wrapper = mount(SystemInfoModal, {
      props: {
        isOpen: true,
        systemInfo: mockSystemInfo,
      },
    });

    const closeBtn = wrapper.find(".modal-close-btn");
    expect(closeBtn.exists()).toBe(true);
    await closeBtn.trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();

    const overlay = wrapper.find(".modal-overlay");
    await overlay.trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
