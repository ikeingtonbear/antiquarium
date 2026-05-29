import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import ConfigModal from "@/components/ConfigModal.vue";
import { SharkophagusApi } from "@/services/api";

// Mock SharkophagusApi class
vi.mock("@/services/api", () => {
  return {
    SharkophagusApi: vi.fn().mockImplementation(() => {
      return {
        getSystemConfig: vi.fn().mockResolvedValue([
          { name: "udp.check_checksum", type: "boolean", value: true },
          { name: "ip.defragment", type: "boolean", value: false },
          {
            name: "ip.summary_in_comment",
            type: "enum",
            value: 0,
            choices: [
              { value: 0, description: "None", default: true },
              { value: 1, description: "Yes", default: false },
            ],
          },
          { name: "tcp.ports", type: "string", value: "80,443" },
          { name: "custom.table", type: "table", value: "some-table-data" },
        ]),
        updateSessionConfig: vi.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

describe("ConfigModal", () => {
  let wrapper: VueWrapper;
  let mockApiInstance: any;

  beforeEach(() => {
    mockApiInstance = new SharkophagusApi();
    wrapper = mount(ConfigModal, {
      props: {
        isOpen: true,
        sessionId: null,
      },
      global: {
        provide: {
          api: mockApiInstance,
        },
      },
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllMocks();
  });

  it("renders modal container and close button when isOpen is true", () => {
    expect(wrapper.find(".modal-overlay").exists()).toBe(true);
    expect(wrapper.find(".modal-close-btn").exists()).toBe(true);
    expect(wrapper.find(".modal-title").text()).toBe("Preferences");
  });

  it("does not render when isOpen is false", () => {
    const closedWrapper = mount(ConfigModal, {
      props: {
        isOpen: false,
        sessionId: null,
      },
      global: {
        provide: {
          api: mockApiInstance,
        },
      },
    });
    expect(closedWrapper.find(".modal-overlay").exists()).toBe(false);
    closedWrapper.unmount();
  });

  it("disables editing and shows notice when sessionId is null", async () => {
    // Wait for async getSystemConfig to resolve
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".session-warning").exists()).toBe(true);
    expect(wrapper.find(".session-warning").text()).toContain(
      "Active session required to modify settings",
    );

    const inputs = wrapper.findAll(
      "input:not([placeholder]):not([readonly]), select",
    );
    expect(inputs.length).toBeGreaterThan(0);
    inputs.forEach((input) => {
      expect(input.attributes("disabled")).toBeDefined();
    });
  });

  it("enables editing when sessionId is present", async () => {
    const activeWrapper = mount(ConfigModal, {
      props: {
        isOpen: true,
        sessionId: "active-session-id",
      },
      global: {
        provide: {
          api: mockApiInstance,
        },
      },
    });

    await vi.dynamicImportSettled();
    await activeWrapper.vm.$nextTick();

    expect(activeWrapper.find(".session-warning").exists()).toBe(false);

    const inputs = activeWrapper.findAll("input:not([placeholder]), select");
    expect(inputs.length).toBeGreaterThan(0);
    inputs.forEach((input) => {
      expect(input.attributes("disabled")).toBeUndefined();
    });

    activeWrapper.unmount();
  });

  it("fetches and renders configurations with correct input types", async () => {
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    expect(mockApiInstance.getSystemConfig).toHaveBeenCalledOnce();

    // udp.check_checksum is boolean -> checkbox
    const checksumItem = wrapper
      .findAll(".config-item")
      .find((el) => el.text().includes("udp.check_checksum"));
    expect(checksumItem).toBeDefined();
    const checkbox = checksumItem?.find('input[type="checkbox"]');
    expect(checkbox?.exists()).toBe(true);
    expect((checkbox?.element as HTMLInputElement).checked).toBe(true);

    // ip.summary_in_comment is enum -> select
    const summaryItem = wrapper
      .findAll(".config-item")
      .find((el) => el.text().includes("ip.summary_in_comment"));
    expect(summaryItem).toBeDefined();
    const select = summaryItem?.find("select");
    expect(select?.exists()).toBe(true);
    expect((select?.element as HTMLSelectElement).value).toBe("0");

    // tcp.ports is string -> text input
    const tcpItem = wrapper
      .findAll(".config-item")
      .find((el) => el.text().includes("tcp.ports"));
    expect(tcpItem).toBeDefined();
    const textInput = tcpItem?.find('input[type="text"]');
    expect(textInput?.exists()).toBe(true);
    expect((textInput?.element as HTMLInputElement).value).toBe("80,443");

    // custom.table is table -> read-only text input or text display
    const tableItem = wrapper
      .findAll(".config-item")
      .find((el) => el.text().includes("custom.table"));
    expect(tableItem).toBeDefined();
    const readOnlyInput = tableItem?.find("input");
    expect(readOnlyInput?.attributes("readonly")).toBeDefined();
  });

  it("filters configuration items based on search query", async () => {
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    const searchInput = wrapper.find(".search-input");
    expect(searchInput.exists()).toBe(true);

    // Initial count
    let items = wrapper.findAll(".config-item");
    expect(items.length).toBe(5);

    // Filter for "udp"
    await searchInput.setValue("udp");
    await wrapper.vm.$nextTick();

    items = wrapper.findAll(".config-item");
    expect(items.length).toBe(1);
    expect(items[0].text()).toContain("udp.check_checksum");

    // Filter for "ip"
    await searchInput.setValue("ip");
    await wrapper.vm.$nextTick();

    items = wrapper.findAll(".config-item");
    expect(items.length).toBe(2);
    expect(items[0].text()).toContain("ip.defragment");
    expect(items[1].text()).toContain("ip.summary_in_comment");
  });

  it("calls updateSessionConfig when a configuration value is modified and session is active", async () => {
    const activeWrapper = mount(ConfigModal, {
      props: {
        isOpen: true,
        sessionId: "active-session-id",
      },
      global: {
        provide: {
          api: mockApiInstance,
        },
      },
    });

    await vi.dynamicImportSettled();
    await activeWrapper.vm.$nextTick();

    const checksumItem = activeWrapper
      .findAll(".config-item")
      .find((el) => el.text().includes("udp.check_checksum"));
    const checkbox = checksumItem?.find('input[type="checkbox"]');
    expect(checkbox?.exists()).toBe(true);

    // Toggle the checkbox
    await checkbox?.setValue(false);
    await activeWrapper.vm.$nextTick();

    expect(mockApiInstance.updateSessionConfig).toHaveBeenCalledWith(
      "active-session-id",
      "udp.check_checksum",
      false,
    );

    activeWrapper.unmount();
  });

  it("reverts value and shows error notification if updateSessionConfig fails", async () => {
    const activeWrapper = mount(ConfigModal, {
      props: {
        isOpen: true,
        sessionId: "active-session-id",
      },
      global: {
        provide: {
          api: mockApiInstance,
        },
      },
    });

    await vi.dynamicImportSettled();
    await activeWrapper.vm.$nextTick();

    // Mock API failure for updateSessionConfig
    mockApiInstance.updateSessionConfig.mockRejectedValueOnce(
      new Error("Failed to set configuration: Invalid value"),
    );

    const checksumItem = activeWrapper
      .findAll(".config-item")
      .find((el) => el.text().includes("udp.check_checksum"));
    const checkbox = checksumItem?.find('input[type="checkbox"]');

    // Toggle the checkbox
    await checkbox?.setValue(false);
    await activeWrapper.vm.$nextTick();

    // Should call API
    expect(mockApiInstance.updateSessionConfig).toHaveBeenCalledOnce();

    // Wait for the rejection handling and tick
    await vi.dynamicImportSettled();
    await activeWrapper.vm.$nextTick();

    // Verify value reverted
    expect((checkbox?.element as HTMLInputElement).checked).toBe(true);

    // Should display error notice
    expect(activeWrapper.find(".error-notice").exists()).toBe(true);
    expect(activeWrapper.find(".error-notice").text()).toContain(
      "Failed to set configuration: Invalid value",
    );

    activeWrapper.unmount();
  });
});
