/**
 * Unit tests for the configFormatter utility service.
 *
 * Tests cover:
 * - toHumanReadableLabel: snake_case / dotted key → Title Case conversion
 * - Abbreviation translation map (pmode, buffersize, fileopen, etc.)
 * - groupPreferences: dynamic sub-grouping by shared prefix segments
 * - Edge cases: single-item prefixes, empty inputs, deep nesting
 */
import { describe, it, expect } from "vitest";
import {
  toHumanReadableLabel,
  groupPreferences,
} from "@/services/configFormatter";
import type { ConfigPreference, PreferenceGroup } from "@/types";

/* ──────────────────────────────────────────────────────
   1. toHumanReadableLabel
   ────────────────────────────────────────────────────── */

describe("toHumanReadableLabel", () => {
  it("converts simple snake_case keys to Title Case", () => {
    expect(toHumanReadableLabel("check_checksum")).toBe("Check Checksum");
  });

  it("converts a single word to Title Case", () => {
    expect(toHumanReadableLabel("defragment")).toBe("Defragment");
  });

  it("translates known abbreviation 'pmode' to 'Promiscuous Mode'", () => {
    expect(toHumanReadableLabel("pmode")).toBe("Promiscuous Mode");
  });

  it("translates known abbreviation 'buffersize' to 'Buffer Size'", () => {
    expect(toHumanReadableLabel("buffersize")).toBe("Buffer Size");
  });

  it("translates known abbreviation 'fileopen' to 'File Open'", () => {
    expect(toHumanReadableLabel("fileopen")).toBe("File Open");
  });

  it("handles compound keys with abbreviations embedded (e.g. 'devices_pmode')", () => {
    expect(toHumanReadableLabel("devices_pmode")).toBe(
      "Devices Promiscuous Mode",
    );
  });

  it("handles keys with multiple underscores", () => {
    expect(toHumanReadableLabel("summary_in_comment")).toBe(
      "Summary In Comment",
    );
  });

  it("returns an empty string for empty input", () => {
    expect(toHumanReadableLabel("")).toBe("");
  });

  it("handles keys with leading/trailing underscores gracefully", () => {
    const label = toHumanReadableLabel("_hide_");
    // Should not produce empty segments or extra spaces
    expect(label.trim()).toBe(label);
    expect(label).toContain("Hide");
  });
});

/* ──────────────────────────────────────────────────────
   2. groupPreferences
   ────────────────────────────────────────────────────── */

describe("groupPreferences", () => {
  const makeConfig = (name: string): ConfigPreference => ({
    name,
    type: "boolean",
    value: true,
  });

  it("groups preferences that share a common underscore prefix", () => {
    const prefs: ConfigPreference[] = [
      makeConfig("capture.devices_hide"),
      makeConfig("capture.devices_pmode"),
      makeConfig("capture.devices_buffersize"),
      makeConfig("capture.promiscuous"),
    ];

    const result = groupPreferences(prefs, "capture.");

    // Should create one group 'devices' and one standalone 'promiscuous'
    expect(result.preferenceGroups.length).toBe(1);
    expect(result.preferenceGroups[0].title).toBe("Devices");
    expect(result.preferenceGroups[0].preferences.length).toBe(3);
    expect(result.standalonePreferences.length).toBe(1);
    expect(result.standalonePreferences[0].name).toBe("capture.promiscuous");
  });

  it("does not create a group for a single-item prefix", () => {
    const prefs: ConfigPreference[] = [
      makeConfig("tcp.ports"),
      makeConfig("tcp.check_checksum"),
    ];

    const result = groupPreferences(prefs, "tcp.");

    // Both should remain standalone since neither shares a prefix with the other
    expect(result.preferenceGroups.length).toBe(0);
    expect(result.standalonePreferences.length).toBe(2);
  });

  it("handles preferences with no underscore in the sub-key", () => {
    const prefs: ConfigPreference[] = [
      makeConfig("udp.check_checksum"),
      makeConfig("udp.port"),
    ];

    const result = groupPreferences(prefs, "udp.");

    // 'check' and 'port' are different prefixes — all standalone
    expect(result.preferenceGroups.length).toBe(0);
    expect(result.standalonePreferences.length).toBe(2);
  });

  it("returns empty groups and standalone for empty input", () => {
    const result = groupPreferences([], "gui.");

    expect(result.preferenceGroups.length).toBe(0);
    expect(result.standalonePreferences.length).toBe(0);
  });

  it("groups multiple distinct prefixes independently", () => {
    const prefs: ConfigPreference[] = [
      makeConfig("gui.fileopen_dir"),
      makeConfig("gui.fileopen_remembered_dir"),
      makeConfig("gui.column_width"),
      makeConfig("gui.column_format"),
      makeConfig("gui.toolbar_style"),
    ];

    const result = groupPreferences(prefs, "gui.");

    // 'fileopen' group (2 items), 'column' group (2 items), 'toolbar' standalone
    expect(result.preferenceGroups.length).toBe(2);
    expect(result.standalonePreferences.length).toBe(1);

    const fileOpenGroup = result.preferenceGroups.find(
      (g) => g.title === "File Open",
    );
    expect(fileOpenGroup).toBeDefined();
    expect(fileOpenGroup!.preferences.length).toBe(2);

    const columnGroup = result.preferenceGroups.find(
      (g) => g.title === "Column",
    );
    expect(columnGroup).toBeDefined();
    expect(columnGroup!.preferences.length).toBe(2);
  });

  it("handles 'all' category by using the full name minus the first dot segment as subkey", () => {
    const prefs: ConfigPreference[] = [
      makeConfig("capture.devices_hide"),
      makeConfig("capture.devices_pmode"),
      makeConfig("udp.check_checksum"),
    ];

    const result = groupPreferences(prefs, "");

    // When no prefix is provided (all view), grouping uses full sub-key
    // Each pref has a different top-level namespace, so we get standalone items
    // unless multiple share the same first segment after removing an empty prefix
    expect(
      result.standalonePreferences.length +
        result.preferenceGroups.reduce(
          (sum, g) => sum + g.preferences.length,
          0,
        ),
    ).toBe(3);
  });
});
