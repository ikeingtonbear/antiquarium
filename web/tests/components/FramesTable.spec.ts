import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import FramesTable from "@/components/FramesTable.vue";
import type { Frame } from "@/types";

const mockColumns = [
  "No.",
  "Time",
  "Source",
  "Destination",
  "Protocol",
  "Length",
  "Info",
  "extra.col",
];

const mockFrames: Frame[] = [
  {
    num: 1,
    c: ["1", "0.000", "10.0.0.1", "10.0.0.2", "TCP", "74", "SYN", "val1"],
  },
  {
    num: 2,
    c: ["2", "0.001", "10.0.0.2", "10.0.0.1", "TCP", "74", "SYN, ACK", "val2"],
  },
];

describe("FramesTable", () => {
  let wrapper: VueWrapper;
  let getSessionFramesMock: any;

  beforeEach(() => {
    getSessionFramesMock = vi.fn().mockResolvedValue(mockFrames);
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.restoreAllMocks();
  });

  function createWrapper(props = {}) {
    return mount(FramesTable, {
      global: {
        provide: {
          api: {
            getSessionFrames: getSessionFramesMock,
          },
        },
      },
      props: {
        sessionId: "session-abc-123",
        columns: mockColumns,
        totalFrames: 100,
        ...props,
      },
    });
  }

  it("renders default columns on initial load", async () => {
    wrapper = createWrapper();
    // Wait for initial API fetch and render cycles
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    const headers = wrapper.findAll(".table-header");
    const headerTexts = headers.map((h) => h.text().trim());

    // Should contain default set: Packet Number (No.), Time, Source, Destination, Protocol, Length, Info
    expect(headerTexts).toContain("No.");
    expect(headerTexts).toContain("Time");
    expect(headerTexts).toContain("Source");
    expect(headerTexts).toContain("Destination");
    expect(headerTexts).toContain("Protocol");
    expect(headerTexts).toContain("Length");
    expect(headerTexts).toContain("Info");

    // "extra.col" is not in the default columns set, but here it's part of props.columns, so it renders initially
    expect(headerTexts).toContain("extra.col");
  });

  it("locks the No. column as the first column always", async () => {
    wrapper = createWrapper();
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    const headers = wrapper.findAll(".table-header");
    expect(headers[0].text().trim()).toBe("No.");
  });

  it("fetches and renders frames on mount", async () => {
    wrapper = createWrapper();
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick(); // Extra tick for async fetch completion

    expect(getSessionFramesMock).toHaveBeenCalledWith(
      "session-abc-123",
      0,
      100,
    );

    const rows = wrapper.findAll(".table-row");
    expect(rows.length).toBe(2);

    const firstRowCells = rows[0].findAll(".table-cell");
    expect(firstRowCells[0].text().trim()).toBe("1"); // Packet Number
    expect(firstRowCells[1].text().trim()).toBe("0.000"); // Time
    expect(firstRowCells[2].text().trim()).toBe("10.0.0.1"); // Source
  });

  it("triggers subsequent chunk fetch on scroll near bottom", async () => {
    wrapper = createWrapper();
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    getSessionFramesMock.mockClear();
    getSessionFramesMock.mockResolvedValue([
      { num: 3, c: ["3", "0.002", "10.0.0.1", "10.0.0.2", "TCP", "66", "ACK", "val3"] },
    ]);

    // Simulate scroll to bottom
    const scrollContainer = wrapper.find(".table-scroll-container");
    expect(scrollContainer.exists()).toBe(true);

    // Mock scrolling measurements
    Object.defineProperty(scrollContainer.element, "scrollTop", {
      value: 800,
      configurable: true,
    });
    Object.defineProperty(scrollContainer.element, "scrollHeight", {
      value: 1000,
      configurable: true,
    });
    Object.defineProperty(scrollContainer.element, "clientHeight", {
      value: 200,
      configurable: true,
    });

    await scrollContainer.trigger("scroll");
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Should fetch next chunk: skip = 2, limit = 100
    expect(getSessionFramesMock).toHaveBeenCalledWith(
      "session-abc-123",
      2,
      100,
    );

    // Rows count should now be 3
    const rows = wrapper.findAll(".table-row");
    expect(rows.length).toBe(3);
  });

  it("reorders columns on drag and drop drop event", async () => {
    wrapper = createWrapper();
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    const draggableHeaders = wrapper.findAll(".table-header.draggable");
    expect(draggableHeaders.length).toBeGreaterThan(1);

    // Swap first two draggable headers
    await draggableHeaders[0].trigger("dragstart");
    await draggableHeaders[1].trigger("drop");
    await wrapper.vm.$nextTick();

    const headersAfter = wrapper.findAll(".table-header");
    expect(headersAfter[1].text().trim()).toBe("Source");
    expect(headersAfter[2].text().trim()).toBe("Time");

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "sharkophagus_columns_layout",
      expect.stringContaining('"orderNames"'),
    );
  });

  it("restores column order from localStorage on mount", async () => {
    const mockLayout = {
      visibleNames: [
        "Time",
        "Source",
        "Destination",
        "Protocol",
        "Length",
        "Info",
      ],
      orderNames: [
        "Source",
        "Time",
        "Destination",
        "Protocol",
        "Length",
        "Info",
      ],
    };
    localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(mockLayout));

    wrapper = createWrapper();
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    const headers = wrapper.findAll(".table-header");
    expect(headers[0].text().trim()).toBe("No.");
    expect(headers[1].text().trim()).toBe("Source");
    expect(headers[2].text().trim()).toBe("Time");
  });

  it("opens the columns selector dropdown and toggles visibility", async () => {
    wrapper = createWrapper();
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    // Verify dropdown starts closed
    expect(wrapper.find(".columns-dropdown").exists()).toBe(false);

    // Open dropdown
    const btn = wrapper.find(".control-btn");
    await btn.trigger("click");
    expect(wrapper.find(".columns-dropdown").exists()).toBe(true);

    // Find and toggle the first column checkbox (Time)
    // Time has name "Time"
    const checkbox = wrapper.find('input[type="checkbox"]:not(:disabled)');
    expect(checkbox.exists()).toBe(true);
    await checkbox.setValue(false);
    await wrapper.vm.$nextTick();

    // Check Time column is hidden
    const headersAfter = wrapper.findAll(".table-header");
    const headerTexts = headersAfter.map((h) => h.text().trim());
    expect(headerTexts).not.toContain("Time");

    // Check LocalStorage saved
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "sharkophagus_columns_layout",
      expect.stringContaining('"visibleNames"'),
    );
  });

  it("locks the packet number checkbox as disabled and checked", async () => {
    wrapper = createWrapper();
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    const btn = wrapper.find(".control-btn");
    await btn.trigger("click");

    const disabledCheckbox = wrapper.find('input[type="checkbox"]:disabled');
    expect(disabledCheckbox.exists()).toBe(true);
    expect((disabledCheckbox.element as HTMLInputElement).checked).toBe(true);
  });

  it("renders error banner when API fails and re-fetches on retry", async () => {
    getSessionFramesMock.mockRejectedValueOnce(new Error("API offline"));

    wrapper = createWrapper();
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Verify error banner is visible
    expect(wrapper.find(".frames-error-banner").exists()).toBe(true);
    expect(wrapper.find(".error-banner-message").text()).toContain(
      "API offline",
    );

    // Click retry button
    getSessionFramesMock.mockResolvedValueOnce(mockFrames);
    const retryBtn = wrapper.find(".retry-btn");
    expect(retryBtn.exists()).toBe(true);
    await retryBtn.trigger("click");
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Verify error is cleared and rows render
    expect(wrapper.find(".frames-error-banner").exists()).toBe(false);
    expect(wrapper.findAll(".table-row").length).toBe(2);
  });
});
