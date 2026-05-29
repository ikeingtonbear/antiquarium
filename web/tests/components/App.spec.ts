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
  MockApi.prototype.getSystemInfo = vi.fn();
  return { SharkophagusApi: MockApi };
});

describe("App", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    const mockApi = SharkophagusApi.prototype;
    (mockApi.getSystemInfo as ReturnType<typeof vi.fn>).mockResolvedValue({
      version: "1.0.0",
      columns: [],
      stats: [],
      ftypes: [],
      capture_types: [],
      encap_types: [],
      nstat: [],
      convs: [],
      seqa: [],
      taps: [],
      eo: [],
      srt: [],
      rtd: [],
      follow: [],
    });
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

  it("closes the analysis modal overlay without terminating the session", async () => {
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

    wrapper = mount(App);
    const fileUpload = wrapper.findComponent({ name: "FileUpload" });

    const file = new File(["data"], "test.pcap");
    await fileUpload.vm.$emit("upload", file);
    await flushPromises();

    // Verify modal is open initially
    let modal = wrapper.findComponent({ name: "AnalysisModal" });
    expect(modal.exists()).toBe(true);

    // Close the modal
    await modal.vm.$emit("close");
    await flushPromises();

    // Modal should now be closed/hidden
    modal = wrapper.findComponent({ name: "AnalysisModal" });
    expect(modal.exists()).toBe(false);

    // StatsDashboard should be visible
    const dashboard = wrapper.findComponent({ name: "StatsDashboard" });
    expect(dashboard.exists()).toBe(true);
    expect(dashboard.props("fileName")).toBe("test.pcap");

    // Should not be back to idle
    const fileUploadAgain = wrapper.findComponent({ name: "FileUpload" });
    expect(fileUploadAgain.exists()).toBe(false);
  });

  it("handles end-session and resets to idle", async () => {
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

    // Close modal to see the dashboard
    const modal = wrapper.findComponent({ name: "AnalysisModal" });
    await modal.vm.$emit("close");
    await flushPromises();

    const dashboard = wrapper.findComponent({ name: "StatsDashboard" });
    expect(dashboard.exists()).toBe(true);

    // Trigger end-session
    await dashboard.vm.$emit("end-session");
    await flushPromises();

    // Wait for the 300ms transition
    await new Promise((r) => setTimeout(r, 350));
    await flushPromises();

    // Should be back to idle
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

    // Close modal
    const modal = wrapper.findComponent({ name: "AnalysisModal" });
    await modal.vm.$emit("close");
    await flushPromises();

    const dashboard = wrapper.findComponent({ name: "StatsDashboard" });
    await dashboard.vm.$emit("end-session");
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

  /* ──────────────────────────────────────────────────
     T005 [US1]: App Mount Queries Info
     ────────────────────────────────────────────────── */
  it("queries getSystemInfo on mount and displays footer info", async () => {
    const mockApi = SharkophagusApi.prototype;
    (mockApi.getSystemInfo as ReturnType<typeof vi.fn>).mockResolvedValue({
      version: "2.4.6-test",
      columns: [],
      stats: [],
      ftypes: [],
      capture_types: [],
      encap_types: [],
      nstat: [],
      convs: [],
      seqa: [],
      taps: [],
      eo: [],
      srt: [],
      rtd: [],
      follow: [],
    });

    wrapper = mount(App);
    await flushPromises();

    expect(mockApi.getSystemInfo).toHaveBeenCalledOnce();
    const footer = wrapper.findComponent({ name: "AppFooter" });
    expect(footer.exists()).toBe(true);
    expect(footer.text()).toContain("Sharkophagus online");
  });

  it("handles getSystemInfo failure on mount and updates footer", async () => {
    const mockApi = SharkophagusApi.prototype;
    (mockApi.getSystemInfo as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Offline"),
    );

    wrapper = mount(App);
    await flushPromises();

    expect(mockApi.getSystemInfo).toHaveBeenCalledOnce();
    const footer = wrapper.findComponent({ name: "AppFooter" });
    expect(footer.exists()).toBe(true);
    expect(footer.text()).toContain("Sharkophagus offline");
  });

  it("renders SettingsMenu and opens SystemInfoModal when open-info event is emitted", async () => {
    wrapper = mount(App);
    await flushPromises();

    // Verify SettingsMenu is rendered
    const settingsMenu = wrapper.findComponent({ name: "SettingsMenu" });
    expect(settingsMenu.exists()).toBe(true);

    // Modal should be closed initially
    let infoModal = wrapper.findComponent({ name: "SystemInfoModal" });
    expect(infoModal.exists()).toBe(true);
    expect(infoModal.props("isOpen")).toBe(false);

    // Emit open-info
    await settingsMenu.vm.$emit("open-info");
    await flushPromises();

    // Modal should be open now
    infoModal = wrapper.findComponent({ name: "SystemInfoModal" });
    expect(infoModal.exists()).toBe(true);
    expect(infoModal.props("isOpen")).toBe(true);
  });

  it("renders ConfigModal and opens it when open-preferences event is emitted", async () => {
    wrapper = mount(App);
    await flushPromises();

    // Verify SettingsMenu is rendered
    const settingsMenu = wrapper.findComponent({ name: "SettingsMenu" });
    expect(settingsMenu.exists()).toBe(true);

    // Modal should be closed initially
    let configModal = wrapper.findComponent({ name: "ConfigModal" });
    expect(configModal.exists()).toBe(true);
    expect(configModal.props("isOpen")).toBe(false);

    // Emit open-preferences
    await settingsMenu.vm.$emit("open-preferences");
    await flushPromises();

    // Modal should be open now
    configModal = wrapper.findComponent({ name: "ConfigModal" });
    expect(configModal.exists()).toBe(true);
    expect(configModal.props("isOpen")).toBe(true);
  });
});
