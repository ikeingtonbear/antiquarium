import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import AddTapModal from "../../src/components/AddTapModal.vue";

describe("AddTapModal.vue - User Story 1", () => {
  const mockTaps = [
    { name: "Expert Info", tap: "expert" },
    { name: "Export HTTP", tap: "eo:http" },
    { name: "Export SMB", tap: "eo:smb" },
    { name: "Follow TCP", tap: "follow:tcp" },
  ];

  it("does not render when isOpen is false", () => {
    const wrapper = mount(AddTapModal, {
      props: {
        isOpen: false,
        availableTaps: [],
        activeSessionStats: null,
      },
    });
    expect(wrapper.find(".modal-content").exists()).toBe(false);
  });

  it("T004: groups available taps by category in accordions", () => {
    const wrapper = mount(AddTapModal, {
      props: {
        isOpen: true,
        availableTaps: mockTaps,
        activeSessionStats: null,
      },
    });

    const categoryHeaders = wrapper.findAll(".category-header");
    expect(categoryHeaders.length).toBeGreaterThan(0);
    const headersText = categoryHeaders.map((h) => h.text().toLowerCase());
    expect(headersText.some((t) => t.includes("export objects"))).toBe(true);
    expect(headersText.some((t) => t.includes("follow stream"))).toBe(true);
  });

  it("T005: limits selection to 16 taps and displays counter", async () => {
    // Generate 20 mock taps all in the same "test" category
    const manyTaps = Array.from({ length: 20 }, (_, i) => ({
      name: `Tap ${i}`,
      tap: `test:${i}`,
    }));

    const wrapper = mount(AddTapModal, {
      props: {
        isOpen: true,
        availableTaps: manyTaps,
        activeSessionStats: null,
      },
    });

    // Expand the "test" category
    const headers = wrapper.findAll(".category-header");
    await headers[0].trigger("click");

    const buttons = wrapper.findAll(".tap-item-btn");
    expect(buttons.length).toBe(20);

    // Select 16 taps
    for (let i = 0; i < 16; i++) {
      await buttons[i].trigger("click");
    }

    // Counter should show 16/16
    expect(wrapper.find(".tap-counter").text()).toContain("16/16");

    // Try to select 17th
    await buttons[16].trigger("click");
    expect(wrapper.find(".tap-counter").text()).toContain("16/16");
    expect(wrapper.find(".error").text()).toContain(
      "Maximum limit of 16 taps reached",
    );
  });

  it("T006: emits apply event with Record of selected taps when Apply is clicked", async () => {
    const wrapper = mount(AddTapModal, {
      props: {
        isOpen: true,
        availableTaps: mockTaps,
        activeSessionStats: null,
      },
    });

    // Expand all categories
    const headers = wrapper.findAll(".category-header");
    for (const h of headers) {
      await h.trigger("click");
    }

    // Select expert and eo:http
    const buttons = wrapper.findAll(".tap-item-btn");
    const expertBtn = buttons.find((b) => b.text().includes("expert"));
    const eoBtn = buttons.find((b) => b.text().includes("eo:http"));

    await expertBtn!.trigger("click");
    await eoBtn!.trigger("click");

    await wrapper.find(".apply-btn").trigger("click");

    expect(wrapper.emitted("apply")).toBeTruthy();
    const emittedPayload = wrapper.emitted("apply")![0][0];
    expect(emittedPayload).toEqual({
      tap0: "expert",
      tap1: "eo:http",
    });
  });
});
