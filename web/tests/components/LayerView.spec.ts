import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import LayerView from "../../src/components/LayerView.vue";

describe("LayerView.vue", () => {
  it("renders a 'No layers available' message when tree is empty", () => {
    const wrapper = mount(LayerView, {
      props: {
        tree: [],
      },
    });
    expect(wrapper.text()).toContain("No layers available");
  });

  it("renders the layer nodes recursively", async () => {
    const mockTree = [
      {
        l: "Ethernet II",
        n: [
          { l: "Destination: 00:11:22:33:44:55" },
          { l: "Source: aa:bb:cc:dd:ee:ff" },
        ],
      },
      {
        l: "IPv4",
        n: [],
      },
    ];

    const wrapper = mount(LayerView, {
      props: {
        tree: mockTree,
      },
    });

    expect(wrapper.text()).toContain("Ethernet II");

    // Click to expand Ethernet II
    await wrapper.find(".expander").trigger("click");

    expect(wrapper.text()).toContain("Destination: 00:11:22:33:44:55");
    expect(wrapper.text()).toContain("IPv4");
  });

  it("emits hover-layer with range on mouseenter and null on mouseleave", async () => {
    const mockTree = [
      {
        l: "Ethernet II",
        h: [0, 14] as [number, number],
      },
    ];

    const wrapper = mount(LayerView, {
      props: {
        tree: mockTree,
      },
    });

    const header = wrapper.find(".layer-header");

    await header.trigger("mouseenter");
    expect(wrapper.emitted("hover-layer")).toBeTruthy();
    expect(wrapper.emitted("hover-layer")![0]).toEqual([[0, 14]]);

    await header.trigger("mouseleave");
    expect(wrapper.emitted("hover-layer")![1]).toEqual([null]);
  });

  it("emits select-layer with range on click on node content", async () => {
    const mockTree = [
      {
        l: "Ethernet II",
        h: [0, 14] as [number, number],
      },
    ];

    const wrapper = mount(LayerView, {
      props: {
        tree: mockTree,
      },
    });

    const headerContent = wrapper.find(".layer-header");

    await headerContent.trigger("click");
    expect(wrapper.emitted("select-layer")).toBeTruthy();
    expect(wrapper.emitted("select-layer")![0]).toEqual([[0, 14]]);
  });

  it("applies hovered and selected classes based on prop ranges", async () => {
    const mockTree = [
      {
        l: "Ethernet II",
        h: [0, 14] as [number, number],
        n: [{ l: "Destination", h: [0, 6] as [number, number] }],
      },
    ];

    const wrapper = mount(LayerView, {
      props: {
        tree: mockTree,
        hoveredByteRange: [0, 6], // Should highlight Destination, since it's the most specific
        selectedByteRange: [0, 14], // Should highlight Ethernet II
      },
    });

    // Need to expand to see Destination (wait, auto-expand should actually have expanded it because selectedByteRange is [0, 14]!
    // But selectedByteRange is [0, 14], which perfectly matches Ethernet II.
    // The auto-expand logic: containsRange(node.h, newRange) && !isEqual(node.h, newRange).
    // So Ethernet II won't auto-expand for [0, 14]. We must expand it manually.
    await wrapper.find(".expander").trigger("click");

    const headers = wrapper.findAll(".layer-header");
    // Ethernet II (index 0)
    expect(headers[0].classes()).toContain("selected");
    expect(headers[0].classes()).not.toContain("hovered");

    // Destination (index 1)
    expect(headers[1].classes()).toContain("hovered");
    expect(headers[1].classes()).not.toContain("selected");
  });
});
