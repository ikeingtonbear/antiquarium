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
  MockApi.prototype.getAnalysis = vi.fn();
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

  it("transitions to ready state after successful upload, stats, and analysis fetch", async () => {
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
      bytes: 1024,
      filename: "test.pcap",
    });
    (mockApi.getAnalysis as ReturnType<typeof vi.fn>).mockResolvedValue({
      frames: 100,
      protocols: ["eth", "ip"],
      first: 100,
      last: 200,
    });

    wrapper = mount(App);
    const fileUpload = wrapper.findComponent({ name: "FileUpload" });

    const file = new File(["data"], "test.pcap");
    await fileUpload.vm.$emit("upload", file);
    await flushPromises();

    // Should show analysis modal
    const analysisModal = wrapper.findComponent({ name: "AnalysisModal" });
    expect(analysisModal.exists()).toBe(true);
    expect(analysisModal.props("statistics")).toEqual({
      frames: 100,
      duration: 1.5,
      bytes: 1024,
      filename: "test.pcap",
    });
    expect(analysisModal.props("analysis")).toEqual({
      frames: 100,
      protocols: ["eth", "ip"],
      first: 100,
      last: 200,
    });
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

  it("handles acknowledge/close and resets to idle", async () => {
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
      bytes: 1024,
      filename: "test.pcap",
    });
    (mockApi.getAnalysis as ReturnType<typeof vi.fn>).mockResolvedValue({
      frames: 50,
      protocols: ["eth"],
      first: 5,
      last: 10,
    });
    (mockApi.closeSession as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );

    wrapper = mount(App);
    const fileUpload = wrapper.findComponent({ name: "FileUpload" });

    const file = new File(["data"], "test.pcap");
    await fileUpload.vm.$emit("upload", file);
    await flushPromises();

    // Now close
    const modal = wrapper.findComponent({ name: "AnalysisModal" });
    await modal.vm.$emit("close");
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
      bytes: 1024,
      filename: "test.pcap",
    });
    (mockApi.getAnalysis as ReturnType<typeof vi.fn>).mockResolvedValue({
      frames: 50,
      protocols: ["eth"],
      first: 5,
      last: 10,
    });
    (mockApi.closeSession as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Delete failed"),
    );

    wrapper = mount(App);
    const fileUpload = wrapper.findComponent({ name: "FileUpload" });

    const file = new File(["data"], "test.pcap");
    await fileUpload.vm.$emit("upload", file);
    await flushPromises();

    const modal = wrapper.findComponent({ name: "AnalysisModal" });
    await modal.vm.$emit("close");
    await flushPromises();

    const errorToast = wrapper.findComponent({ name: "ErrorNotification" });
    expect(errorToast.exists()).toBe(true);
    expect(errorToast.props("message")).toBe("Delete failed");
  });

  /* ──────────────────────────────────────────────────
     T010 [US2]: Stats/Analyse Failure Error Handling
     ────────────────────────────────────────────────── */
  it("shows error notification and resets to idle if stats or analysis fetch fails", async () => {
    const mockApi = SharkophagusApi.prototype;
    (mockApi.createSession as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "session-4",
      status: "active",
      fileName: "test.pcap",
      fileSize: 1024,
    });
    (mockApi.getStatistics as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Stats endpoint failed"),
    );
    (mockApi.getAnalysis as ReturnType<typeof vi.fn>).mockResolvedValue({
      frames: 10,
      protocols: [],
      first: 0,
      last: 0,
    });
    (mockApi.closeSession as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );

    wrapper = mount(App);
    const fileUpload = wrapper.findComponent({ name: "FileUpload" });

    const file = new File(["data"], "test.pcap");
    await fileUpload.vm.$emit("upload", file);
    await flushPromises();

    // Verify error toast is shown
    const errorToast = wrapper.findComponent({ name: "ErrorNotification" });
    expect(errorToast.exists()).toBe(true);
    expect(errorToast.props("message")).toBe("Stats endpoint failed");

    // UI should reset to idle (meaning FileUpload is back)
    const fileUploadAgain = wrapper.findComponent({ name: "FileUpload" });
    expect(fileUploadAgain.exists()).toBe(true);
  });
});
