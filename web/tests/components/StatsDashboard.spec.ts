/**
 * Unit Tests — StatsDashboard Component
 *
 * TDD: These tests drive the design of the updated StatsDashboard Vue SFC.
 *
 * Tests cover:
 * - T017 [US2]: Session stats display format (filename, filesize, frames, duration only)
 * - T022 [US3]: Session termination action and state reset
 */

import { describe, it, expect, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import StatsDashboard from "@/components/StatsDashboard.vue";
import type { CaptureStatistics } from "@/types";

const defaultStats: CaptureStatistics = {
  frames: 1280,
  duration: 4.529,
};

const defaultFileName = "capture_traffic.pcapng";
const defaultFileSize = 524288; // 512 KB

describe("StatsDashboard", () => {
  let wrapper: VueWrapper;

  afterEach(() => {
    wrapper?.unmount();
  });

  /* ──────────────────────────────────────────────────
     T017 [US2]: Stats Display Format
     ────────────────────────────────────────────────── */

  describe("Stats Display", () => {
    it("renders the filename", () => {
      wrapper = mount(StatsDashboard, {
        props: {
          statistics: defaultStats,
          fileName: defaultFileName,
          fileSize: defaultFileSize,
          isDeleting: false,
        },
      });

      expect(wrapper.text()).toContain(defaultFileName);
    });

    it("renders the formatted file size", () => {
      wrapper = mount(StatsDashboard, {
        props: {
          statistics: defaultStats,
          fileName: defaultFileName,
          fileSize: defaultFileSize,
          isDeleting: false,
        },
      });

      // 524288 bytes = 512.00 KB
      expect(wrapper.text()).toContain("512.00 KB");
    });

    it("renders the frames count", () => {
      wrapper = mount(StatsDashboard, {
        props: {
          statistics: defaultStats,
          fileName: defaultFileName,
          fileSize: defaultFileSize,
          isDeleting: false,
        },
      });

      expect(wrapper.text()).toContain("1,280");
    });

    it("renders duration formatted to 3 decimal places", () => {
      wrapper = mount(StatsDashboard, {
        props: {
          statistics: defaultStats,
          fileName: defaultFileName,
          fileSize: defaultFileSize,
          isDeleting: false,
        },
      });

      expect(wrapper.text()).toContain("4.529s");
    });

    it("renders exactly four stat cards with appropriate labels", () => {
      wrapper = mount(StatsDashboard, {
        props: {
          statistics: defaultStats,
          fileName: defaultFileName,
          fileSize: defaultFileSize,
          isDeleting: false,
        },
      });

      const text = wrapper.text();
      expect(text).toContain("File Name");
      expect(text).toContain("File Size");
      expect(text).toContain("Frames");
      expect(text).toContain("Duration");

      // Assert that old cards are NOT rendered
      expect(text).not.toContain("Bytes");
      expect(text).not.toContain("First Packet");
      expect(text).not.toContain("Last Packet");

      const cards = wrapper.findAll(".stat-card");
      expect(cards.length).toBe(4);
    });
  });

  /* ──────────────────────────────────────────────────
     T022 [US3]: Acknowledge Button & Session Termination
     ────────────────────────────────────────────────── */

  describe("Acknowledge Button", () => {
    it("renders an Acknowledge button", () => {
      wrapper = mount(StatsDashboard, {
        props: {
          statistics: defaultStats,
          fileName: defaultFileName,
          fileSize: defaultFileSize,
          isDeleting: false,
        },
      });

      const btn = wrapper.find("button");
      expect(btn.exists()).toBe(true);
      expect(btn.text()).toContain("Acknowledge");
    });

    it('emits "acknowledge" when clicked', async () => {
      wrapper = mount(StatsDashboard, {
        props: {
          statistics: defaultStats,
          fileName: defaultFileName,
          fileSize: defaultFileSize,
          isDeleting: false,
        },
      });

      const btn = wrapper.find("button");
      await btn.trigger("click");

      expect(wrapper.emitted("acknowledge")).toBeTruthy();
      expect(wrapper.emitted("acknowledge")!.length).toBe(1);
    });

    it("disables button and shows spinner when isDeleting is true", () => {
      wrapper = mount(StatsDashboard, {
        props: {
          statistics: defaultStats,
          fileName: defaultFileName,
          fileSize: defaultFileSize,
          isDeleting: true,
        },
      });

      const btn = wrapper.find("button");
      expect(btn.attributes("disabled")).toBeDefined();

      // Should show a loading state
      const spinner = wrapper.find(".btn-spinner");
      expect(spinner.exists()).toBe(true);
    });
  });
});
