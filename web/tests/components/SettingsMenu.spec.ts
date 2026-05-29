import { describe, it, expect, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import SettingsMenu from "@/components/SettingsMenu.vue";

describe("SettingsMenu", () => {
  let wrapper: VueWrapper;

  afterEach(() => {
    wrapper?.unmount();
  });

  it("renders the settings button with gear icon", () => {
    wrapper = mount(SettingsMenu);
    const btn = wrapper.find(".settings-btn");
    expect(btn.exists()).toBe(true);
    expect(wrapper.find(".settings-popover").exists()).toBe(false);
  });

  it("toggles the settings popover menu when button clicked", async () => {
    wrapper = mount(SettingsMenu);
    const btn = wrapper.find(".settings-btn");

    // Open
    await btn.trigger("click");
    expect(wrapper.find(".settings-popover").exists()).toBe(true);

    // Close
    await btn.trigger("click");
    expect(wrapper.find(".settings-popover").exists()).toBe(false);
  });

  it("emits 'open-info' when Info item clicked", async () => {
    wrapper = mount(SettingsMenu);
    const btn = wrapper.find(".settings-btn");

    await btn.trigger("click");
    const infoItem = wrapper.find(".menu-item-info");
    expect(infoItem.exists()).toBe(true);
    expect(infoItem.text().trim()).toBe("Info");

    await infoItem.trigger("click");
    expect(wrapper.emitted("open-info")).toBeTruthy();
    expect(wrapper.emitted("open-info")?.length).toBe(1);

    // Should auto-close the menu after selection
    expect(wrapper.find(".settings-popover").exists()).toBe(false);
  });
});
