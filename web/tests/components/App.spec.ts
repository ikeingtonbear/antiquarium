/**
 * Integration Tests — App Component
 *
 * Tests the root application component's state machine transitions,
 * event handling, and component orchestration.
 *
 * @see data-model.md §2 — Client-Side Lifecycle & State Machine
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, VueWrapper, flushPromises } from "@vue/test-utils";
import App from "@/App.vue";
import { SharkophagusApi } from "@/services/api";

/* Mock the API service */
vi.mock("@/services/api", () => {
  const MockApi = vi.fn();
  MockApi.prototype.createSession = vi.fn();
  MockApi.prototype.getStatistics = vi.fn();
  MockApi.prototype.closeSession = vi.fn();
  return { SharkophagusApi: MockApi };
});

describe("App", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it("renders the application title", () => {
    wrapper = mount(App);
    expect(wrapper.text()).toContain("Sharkophagus");
  });

  it("renders the subtitle", () => {
    wrapper = mount(App);
    expect(wrapper.text()).toContain("Packet Capture Analysis Dashboard");
  });

  it("starts in idle state showing FileUpload", () => {
    wrapper = mount(App);
    const fileUpload = wrapper.findComponent({ name: "FileUpload" });
    expect(fileUpload.exists()).toBe(true);
  });

  it("does not show error notification initially", () => {
    wrapper = mount(App);
    const errorToast = wrapper.findComponent({ name: "ErrorNotification" });
    expect(errorToast.exists()).toBe(false);
  });

  it("transitions to uploading state when file is submitted", async () => {
    const mockApi = SharkophagusApi.prototype;
    (mockApi.createSession as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {}), // never resolves — stays in uploading state
    );

    wrapper = mount(App);
    const fileUpload = wrapper.findComponent({ name: "FileUpload" });

    const file = new File(["data"], "test.pcap");
    await fileUpload.vm.$emit("upload", file);
    await flushPromises();

    // Should show upload progress section
    expect(wrapper.text()).toContain("Uploading Capture");
  });

  it("transitions to ready state after successful upload and stats fetch", async () => {
    const mockApi = SharkophagusApi.prototype;
    (mockApi.createSession as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "session-1",
      status: "active",
      createdAt: "2026-01-01T00:00:00Z",
      fileName: "test.pcap",
      fileSize: 1024,
    });
    (mockApi.getStatistics as ReturnType<typeof vi.fn>).mockResolvedValue({
      frames: 100,
      duration: 1.5,
    });

    wrapper = mount(App);
    const fileUpload = wrapper.findComponent({ name: "FileUpload" });

    const file = new File(["data"], "test.pcap");
    await fileUpload.vm.$emit("upload", file);
    await flushPromises();

    // Should show stats dashboard
    const statsDashboard = wrapper.findComponent({ name: "StatsDashboard" });
    expect(statsDashboard.exists()).toBe(true);
    expect(statsDashboard.props("fileName")).toBe("test.pcap");
    expect(statsDashboard.props("fileSize")).toBe(1024);
  });

  it("shows error notification on upload failure", async () => {
    const mockApi = SharkophagusApi.prototype;
    (mockApi.createSession as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Server down"),
    );

    wrapper = mount(App);
    const fileUpload = wrapper.findComponent({ name: "FileUpload" });

    const file = new File(["data"], "test.pcap");
    await fileUpload.vm.$emit("upload", file);
    await flushPromises();

    const errorToast = wrapper.findComponent({ name: "ErrorNotification" });
    expect(errorToast.exists()).toBe(true);
    expect(errorToast.props("message")).toBe("Server down");
  });

  it("dismisses error notification when dismiss event fires", async () => {
    const mockApi = SharkophagusApi.prototype;
    (mockApi.createSession as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Oops"),
    );

    wrapper = mount(App);
    const fileUpload = wrapper.findComponent({ name: "FileUpload" });

    const file = new File(["data"], "test.pcap");
    await fileUpload.vm.$emit("upload", file);
    await flushPromises();

    let errorToast = wrapper.findComponent({ name: "ErrorNotification" });
    expect(errorToast.exists()).toBe(true);

    await errorToast.vm.$emit("dismiss");
    await flushPromises();

    errorToast = wrapper.findComponent({ name: "ErrorNotification" });
    expect(errorToast.exists()).toBe(false);
  });

  it("handles acknowledge and resets to idle", async () => {
    const mockApi = SharkophagusApi.prototype;
    (mockApi.createSession as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "session-2",
      status: "active",
      createdAt: "2026-01-01T00:00:00Z",
      fileName: "test.pcap",
      fileSize: 1024,
    });
    (mockApi.getStatistics as ReturnType<typeof vi.fn>).mockResolvedValue({
      frames: 50,
      duration: 0.5,
    });
    (mockApi.closeSession as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );

    wrapper = mount(App);
    const fileUpload = wrapper.findComponent({ name: "FileUpload" });

    const file = new File(["data"], "test.pcap");
    await fileUpload.vm.$emit("upload", file);
    await flushPromises();

    // Now acknowledge
    const dashboard = wrapper.findComponent({ name: "StatsDashboard" });
    await dashboard.vm.$emit("acknowledge");
    await flushPromises();

    // Wait for the 300ms transition
    await new Promise((r) => setTimeout(r, 350));
    await flushPromises();

    // Should be back to idle with FileUpload visible
    const fileUploadAgain = wrapper.findComponent({ name: "FileUpload" });
    expect(fileUploadAgain.exists()).toBe(true);
  });

  it("shows error notification on session close failure", async () => {
    const mockApi = SharkophagusApi.prototype;
    (mockApi.createSession as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "session-3",
      status: "active",
      createdAt: "2026-01-01T00:00:00Z",
      fileName: "test.pcap",
      fileSize: 1024,
    });
    (mockApi.getStatistics as ReturnType<typeof vi.fn>).mockResolvedValue({
      frames: 50,
      duration: 0.5,
    });
    (mockApi.closeSession as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Delete failed"),
    );

    wrapper = mount(App);
    const fileUpload = wrapper.findComponent({ name: "FileUpload" });

    const file = new File(["data"], "test.pcap");
    await fileUpload.vm.$emit("upload", file);
    await flushPromises();

    const dashboard = wrapper.findComponent({ name: "StatsDashboard" });
    await dashboard.vm.$emit("acknowledge");
    await flushPromises();

    const errorToast = wrapper.findComponent({ name: "ErrorNotification" });
    expect(errorToast.exists()).toBe(true);
    expect(errorToast.props("message")).toBe("Delete failed");
  });
});
