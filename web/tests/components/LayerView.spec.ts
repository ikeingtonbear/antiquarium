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
    await wrapper.find(".layer-header").trigger("click");

    expect(wrapper.text()).toContain("Destination: 00:11:22:33:44:55");
    expect(wrapper.text()).toContain("IPv4");
  });
  it("emits hover-node with range on mouseenter and null on mouseleave", async () => {
    const mockTree = [
      {
        l: "Ethernet II",
        h: [0, 14],
      },
    ];

    const wrapper = mount(LayerView, {
      props: {
        tree: mockTree,
      },
    });

    const header = wrapper.find(".layer-header");

    await header.trigger("mouseenter");
    expect(wrapper.emitted("hover-node")).toBeTruthy();
    expect(wrapper.emitted("hover-node")![0]).toEqual([[0, 14]]);

    await header.trigger("mouseleave");
    expect(wrapper.emitted("hover-node")![1]).toEqual([null]);
  });
});
