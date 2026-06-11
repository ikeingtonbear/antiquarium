import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import ConfigModal from "@/components/ConfigModal.vue";
import { SharkophagusApi } from "@/services/api";
import type { PreferenceCategory } from "@/types";

// Mock SharkophagusApi class
vi.mock("@/services/api", () => {
  const getMockConfig = () => [
    { name: "udp.check_checksum", type: "boolean", value: true },
    { name: "ip.defragment", type: "boolean", value: false },
    {
      name: "ip.summary_in_comment",
      type: "enum",
      value: "None",
      choices: [
        { value: 0, description: "None", default: true },
        { value: 1, description: "Yes", default: false },
      ],
    },
    { name: "tcp.ports", type: "string", value: "80,443" },
    { name: "custom.table", type: "table", value: "some-table-data" },
  ];
  return {
    SharkophagusApi: vi.fn().mockImplementation(() => {
      return {
        getSystemConfig: vi
          .fn()
          .mockImplementation(() => Promise.resolve(getMockConfig())),
        getSessionConfig: vi
          .fn()
          .mockImplementation(() => Promise.resolve(getMockConfig())),
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
    expect((select?.element as HTMLSelectElement).value).toBe("None");

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

  it("renders a sidebar with categories and filters settings by selected category", async () => {
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    // Verify sidebar exists
    const sidebar = wrapper.find(".sidebar-container");
    expect(sidebar.exists()).toBe(true);

    // Verify categories list contains categories
    const categoryItems = wrapper.findAll(".category-item");
    expect(categoryItems.length).toBeGreaterThan(0);

    // Click on 'udp' category
    const udpCategory = categoryItems.find(
      (el) => el.text().includes("udp") || el.text().includes("UDP"),
    );
    expect(udpCategory).toBeDefined();

    await udpCategory?.trigger("click");
    await wrapper.vm.$nextTick();

    // Only udp.check_checksum should be displayed in the list
    const displayedItems = wrapper.findAll(".config-item");
    expect(displayedItems.length).toBe(1);
    expect(displayedItems[0].text()).toContain("check_checksum");
    // Verify it shows full path as subtitle/helper
    expect(displayedItems[0].text()).toContain("udp.check_checksum");
  });

  it("displays search results grouped by category headers when a search query is active", async () => {
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    const searchInput = wrapper.find(".search-input");
    expect(searchInput.exists()).toBe(true);

    // Filter for "checksum"
    await searchInput.setValue("checksum");
    await wrapper.vm.$nextTick();

    // The display list should show a group header for "UDP"
    const groupHeaders = wrapper.findAll(".search-group-header");
    expect(groupHeaders.length).toBe(1);
    expect(groupHeaders[0].text()).toContain("UDP");

    // The items under search results should show stripped display name
    const displayedItems = wrapper.findAll(".config-item");
    expect(displayedItems.length).toBe(1);
    expect(displayedItems[0].text()).toContain("check_checksum");
  });

  it("renders all settings in alphabetical order with full names when 'All Preferences' is selected", async () => {
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    // Select 'All Preferences'
    const categoryItems = wrapper.findAll(".category-item");
    const allCategory = categoryItems.find((el) =>
      el.text().includes("All Preferences"),
    );
    expect(allCategory).toBeDefined();
    await allCategory?.trigger("click");
    await wrapper.vm.$nextTick();

    // Verify all 5 configs are displayed
    const displayedItems = wrapper.findAll(".config-item");
    expect(displayedItems.length).toBe(5);

    // Verify alphabetical order and full names
    expect(displayedItems[0].text()).toContain("custom.table");
    expect(displayedItems[1].text()).toContain("ip.defragment");
    expect(displayedItems[2].text()).toContain("ip.summary_in_comment");
    expect(displayedItems[3].text()).toContain("tcp.ports");
    expect(displayedItems[4].text()).toContain("udp.check_checksum");

    // Verify they do not show the redundant small full name subtitle
    expect(displayedItems[4].find(".config-full-name").exists()).toBe(false);
  });

  it("collapses the sidebar into a top dropdown selector on mobile screens", async () => {
    await vi.dynamicImportSettled();

    // Mount a new instance to test lifecycle resize hook
    const mobileWrapper = mount(ConfigModal, {
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

    await vi.dynamicImportSettled();
    await mobileWrapper.vm.$nextTick();

    // Mock window.innerWidth to mobile size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });
    window.dispatchEvent(new Event("resize"));
    await mobileWrapper.vm.$nextTick();

    // Verify sidebar is hidden/not rendered
    expect(mobileWrapper.find(".sidebar-container").exists()).toBe(false);

    // Verify mobile dropdown selector exists
    const mobileSelect = mobileWrapper.find("select.mobile-category-select");
    expect(mobileSelect.exists()).toBe(true);

    // Verify select contains correct categories
    const options = mobileSelect.findAll("option");
    expect(options.length).toBeGreaterThan(0);

    // Change category to 'protocol-udp' using select dropdown
    await mobileSelect.setValue("protocol-udp");
    await mobileWrapper.vm.$nextTick();

    // Check that udp.check_checksum is filtered
    const displayedItems = mobileWrapper.findAll(".config-item");
    expect(displayedItems.length).toBe(1);
    expect(displayedItems[0].text()).toContain("check_checksum");

    mobileWrapper.unmount();
  });
});
