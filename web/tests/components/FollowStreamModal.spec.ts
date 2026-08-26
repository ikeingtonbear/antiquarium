import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import FollowStreamModal from "../../src/components/FollowStreamModal.vue";

describe("FollowStreamModal", () => {
  it("renders loading state initially", () => {
    const wrapper = mount(FollowStreamModal, {
      props: {
        sessionId: "test-session",
        protocol: "TCP",
        filter: "tcp.stream eq 0",
      },
    });

    expect(wrapper.find(".loading").exists()).toBe(true);
    expect(wrapper.text()).toContain("Loading stream payload...");
  });

  it("emits close when close button is clicked", async () => {
    const wrapper = mount(FollowStreamModal, {
      props: {
        sessionId: "test-session",
        protocol: "TCP",
        filter: "tcp.stream eq 0",
      },
    });

    await wrapper.find(".close-button").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
