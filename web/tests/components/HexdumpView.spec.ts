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

  it("applies hovered and selected classes to the correct bytes based on ranges", () => {
    const wrapper = mount(HexdumpView, {
      props: {
        bytes: "SGVsbG8gV29ybGQ=", // 11 bytes
        hoveredByteRange: [0, 5],
        selectedByteRange: [3, 2],
      },
    });

    const hexBytes = wrapper.findAll(".hex-byte");

    // Bytes 0,1,2: hovered only
    for (let i = 0; i < 3; i++) {
      expect(hexBytes[i].classes()).toContain("hovered");
      expect(hexBytes[i].classes()).not.toContain("selected");
      expect(hexBytes[i].classes()).not.toContain("selected-exact");
    }

    // Bytes 3,4: both hovered and selected
    for (let i = 3; i < 5; i++) {
      expect(hexBytes[i].classes()).toContain("hovered");
      expect(hexBytes[i].classes()).toContain("selected");
    }

    // Byte 5+: neither
    for (let i = 5; i < 11; i++) {
      expect(hexBytes[i].classes()).not.toContain("hovered");
      expect(hexBytes[i].classes()).not.toContain("selected");
    }
  });

  it("applies selected-exact class to the selectedSingleByte", () => {
    const wrapper = mount(HexdumpView, {
      props: {
        bytes: "SGVsbG8gV29ybGQ=", // 11 bytes
        selectedByteRange: [3, 2],
        selectedSingleByte: 4
      },
    });

    const hexBytes = wrapper.findAll(".hex-byte");
    
    // Byte 3 is selected but not exact
    expect(hexBytes[3].classes()).toContain("selected");
    expect(hexBytes[3].classes()).not.toContain("selected-exact");
    
    // Byte 4 is selected AND exact
    expect(hexBytes[4].classes()).toContain("selected");
    expect(hexBytes[4].classes()).toContain("selected-exact");
  });

  it("emits hover-byte on mouseenter and mouseleave", async () => {
    const wrapper = mount(HexdumpView, {
      props: {
        bytes: "SGVsbG8gV29ybGQ=",
      },
    });

    const firstHexByte = wrapper.findAll(".hex-byte")[0];
    await firstHexByte.trigger("mouseenter");
    expect(wrapper.emitted("hover-byte")).toBeTruthy();
    expect(wrapper.emitted("hover-byte")![0]).toEqual([[0, 1]]);

    await firstHexByte.trigger("mouseleave");
    expect(wrapper.emitted("hover-byte")![1]).toEqual([null]);
  });

  it("emits select-byte on click", async () => {
    const wrapper = mount(HexdumpView, {
      props: {
        bytes: "SGVsbG8gV29ybGQ=",
      },
    });

    const firstHexByte = wrapper.findAll(".hex-byte")[0];
    await firstHexByte.trigger("click");
    expect(wrapper.emitted("select-byte")).toBeTruthy();
    expect(wrapper.emitted("select-byte")![0]).toEqual([[0, 1]]);
  });
});
