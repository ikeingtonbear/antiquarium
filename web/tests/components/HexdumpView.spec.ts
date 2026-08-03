import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import HexdumpView from "../../src/components/HexdumpView.vue";

describe("HexdumpView.vue", () => {
  it("renders 'No raw data available' when bytes is empty", () => {
    const wrapper = mount(HexdumpView, {
      props: {
        bytes: "",
      },
    });
    expect(wrapper.text()).toContain("No raw data available");
  });

  it("renders hexdump correctly when bytes are provided", () => {
    // "Hello World" -> Base64: SGVsbG8gV29ybGQ=
    const wrapper = mount(HexdumpView, {
      props: {
        bytes: "SGVsbG8gV29ybGQ=",
      },
    });

    // Check offset
    expect(wrapper.text()).toContain("0000");
    // Check hex bytes for "H", "e", "l" (48 65 6C)
    expect(wrapper.text()).toContain("48");
    expect(wrapper.text()).toContain("65");
    expect(wrapper.text()).toContain("6C");
    // Check ASCII
    expect(wrapper.text()).toContain("H");
    expect(wrapper.text()).toContain("e");
    expect(wrapper.text()).toContain("l");
  });

  it("applies highlight class to the correct bytes based on activeRange", () => {
    // "Hello World"
    const wrapper = mount(HexdumpView, {
      props: {
        bytes: "SGVsbG8gV29ybGQ=",
        activeRange: [0, 5], // Highlight "Hello"
      },
    });

    const hexBytes = wrapper.findAll(".hex-byte");
    // First 5 should be highlighted
    for (let i = 0; i < 5; i++) {
      expect(hexBytes[i].classes()).toContain("highlighted");
    }
    // 6th should not be highlighted
    expect(hexBytes[5].classes()).not.toContain("highlighted");

    const asciiBytes = wrapper.findAll(".ascii-byte");
    for (let i = 0; i < 5; i++) {
      expect(asciiBytes[i].classes()).toContain("highlighted");
    }
    expect(asciiBytes[5].classes()).not.toContain("highlighted");
  });
});
