/**
 * Unit Tests — FileUpload Component
 *
 * TDD: These tests are written BEFORE the component implementation
 * to drive the design of the FileUpload Vue SFC.
 *
 * Tests cover:
 * - T011 [US1]: File extension and size validation
 * - T014 [US1]: Drag-and-drop zone and validation hooks
 *
 * @see plan.md §2 — Layout Grid and Drag-and-Drop File Upload
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import FileUpload from "@/components/FileUpload.vue";

describe("FileUpload", () => {
  let wrapper: VueWrapper;

  afterEach(() => {
    wrapper?.unmount();
  });

  /* ──────────────────────────────────────────────────
     Rendering & Structure
     ────────────────────────────────────────────────── */

  it('renders a dropzone with role="button"', () => {
    wrapper = mount(FileUpload);

    const dropzone = wrapper.find('[role="button"]');
    expect(dropzone.exists()).toBe(true);
  });

  it('has aria-label="Upload capture file"', () => {
    wrapper = mount(FileUpload);

    const dropzone = wrapper.find('[aria-label="Upload capture file"]');
    expect(dropzone.exists()).toBe(true);
  });

  it("displays supported file extensions", () => {
    wrapper = mount(FileUpload);

    const text = wrapper.text();
    expect(text).toContain(".pcap");
    expect(text).toContain(".pcapng");
    expect(text).toContain(".cap");
    expect(text).toContain(".dmp");
  });

  it("displays the max file size limit", () => {
    wrapper = mount(FileUpload);

    expect(wrapper.text()).toContain("10 MB");
  });

  it("renders a hidden file input element", () => {
    wrapper = mount(FileUpload);

    const input = wrapper.find('input[type="file"]');
    expect(input.exists()).toBe(true);
  });

  /* ──────────────────────────────────────────────────
     T011: File Extension Validation
     ────────────────────────────────────────────────── */

  it("rejects files with invalid extensions", async () => {
    wrapper = mount(FileUpload);

    const file = new File(["content"], "document.txt", {
      type: "text/plain",
    });

    // Simulate file input change
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, "files", {
      value: [file],
      writable: false,
    });
    await input.trigger("change");

    // Should NOT emit upload
    expect(wrapper.emitted("upload")).toBeFalsy();

    // Should show error state
    expect(wrapper.text()).toContain("Invalid file type");
  });

  it("rejects .png files", async () => {
    wrapper = mount(FileUpload);

    const file = new File(["image-data"], "screenshot.png", {
      type: "image/png",
    });

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, "files", {
      value: [file],
      writable: false,
    });
    await input.trigger("change");

    expect(wrapper.emitted("upload")).toBeFalsy();
  });

  it("accepts .pcap files", async () => {
    wrapper = mount(FileUpload);

    const file = new File(["pcap-data"], "capture.pcap", {
      type: "application/octet-stream",
    });

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, "files", {
      value: [file],
      writable: false,
    });
    await input.trigger("change");

    expect(wrapper.emitted("upload")).toBeTruthy();
    expect(wrapper.emitted("upload")![0][0]).toEqual(file);
  });

  it("accepts .pcapng files (case-insensitive)", async () => {
    wrapper = mount(FileUpload);

    const file = new File(["data"], "Capture.PCAPNG", {
      type: "application/octet-stream",
    });

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, "files", {
      value: [file],
      writable: false,
    });
    await input.trigger("change");

    expect(wrapper.emitted("upload")).toBeTruthy();
  });

  it("accepts .cap files", async () => {
    wrapper = mount(FileUpload);

    const file = new File(["data"], "traffic.cap");

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, "files", {
      value: [file],
      writable: false,
    });
    await input.trigger("change");

    expect(wrapper.emitted("upload")).toBeTruthy();
  });

  it("accepts .dmp files", async () => {
    wrapper = mount(FileUpload);

    const file = new File(["data"], "dump.dmp");

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, "files", {
      value: [file],
      writable: false,
    });
    await input.trigger("change");

    expect(wrapper.emitted("upload")).toBeTruthy();
  });

  /* ──────────────────────────────────────────────────
     T011: File Size Validation
     ────────────────────────────────────────────────── */

  it("rejects files exceeding 10MB", async () => {
    wrapper = mount(FileUpload);

    // Create a file larger than 10MB (10 * 1024 * 1024 + 1 bytes)
    const size = 10 * 1024 * 1024 + 1;
    const file = new File([new ArrayBuffer(size)], "huge.pcap", {
      type: "application/octet-stream",
    });

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, "files", {
      value: [file],
      writable: false,
    });
    await input.trigger("change");

    expect(wrapper.emitted("upload")).toBeFalsy();
    expect(wrapper.text()).toContain("exceeds");
  });

  it("accepts files exactly 10MB", async () => {
    wrapper = mount(FileUpload);

    const size = 10 * 1024 * 1024;
    const file = new File([new ArrayBuffer(size)], "max.pcap", {
      type: "application/octet-stream",
    });

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, "files", {
      value: [file],
      writable: false,
    });
    await input.trigger("change");

    expect(wrapper.emitted("upload")).toBeTruthy();
  });

  /* ──────────────────────────────────────────────────
     Keyboard Accessibility
     ────────────────────────────────────────────────── */

  it("opens file dialog on Enter key", async () => {
    wrapper = mount(FileUpload);

    const dropzone = wrapper.find('[role="button"]');
    const input = wrapper.find('input[type="file"]');
    const clickSpy = vi.spyOn(input.element as HTMLInputElement, "click");

    await dropzone.trigger("keydown", { key: "Enter" });

    expect(clickSpy).toHaveBeenCalled();
  });

  it("opens file dialog on Space key", async () => {
    wrapper = mount(FileUpload);

    const dropzone = wrapper.find('[role="button"]');
    const input = wrapper.find('input[type="file"]');
    const clickSpy = vi.spyOn(input.element as HTMLInputElement, "click");

    await dropzone.trigger("keydown", { key: " " });

    expect(clickSpy).toHaveBeenCalled();
  });
});
