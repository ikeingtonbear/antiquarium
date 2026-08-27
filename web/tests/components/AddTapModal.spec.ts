import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import AddTapModal from "../../src/components/AddTapModal.vue";

describe("AddTapModal.vue - User Story 1", () => {
  it("does not render when isOpen is false", () => {
    const wrapper = mount(AddTapModal, {
      props: {
        isOpen: false,
        availableTaps: [],
      },
    });
    expect(wrapper.find(".modal-content").exists()).toBe(false);
  });

  it("renders correctly when isOpen is true", () => {
    const wrapper = mount(AddTapModal, {
      props: {
        isOpen: true,
        availableTaps: [{ name: "Expert Info", tap: "expert" }],
      },
    });
    expect(wrapper.find(".modal-content").exists()).toBe(true);
    expect(wrapper.text()).toContain("Expert Info");
  });

  it("emits close event when close button is clicked", async () => {
    const wrapper = mount(AddTapModal, {
      props: {
        isOpen: true,
        availableTaps: [],
      },
    });
    await wrapper.find(".close-btn").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("close");
  });

  it("emits apply event with selected tap string when Apply is clicked", async () => {
    const wrapper = mount(AddTapModal, {
      props: {
        isOpen: true,
        availableTaps: [{ name: "Export HTTP", tap: "eo:http" }],
      },
    });

    // Select the tap
    await wrapper.find("select").setValue("eo:http");
    // Click apply
    await wrapper.find(".apply-btn").trigger("click");

    expect(wrapper.emitted("apply")).toBeTruthy();
    expect(wrapper.emitted("apply")![0]).toEqual(["eo:http"]);
  });
});
