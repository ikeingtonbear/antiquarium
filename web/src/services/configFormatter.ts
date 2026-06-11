/**
 * Configuration Formatter Service
 *
 * Pure-utility functions for converting raw snake_case / dot-notated
 * preference keys into human-readable labels, and for dynamically
 * grouping related preferences into visual sub-groups.
 *
 * @see specs/009-settings-visual-cleanup/data-model.md
 * @see specs/009-settings-visual-cleanup/research.md §1, §2
 */
import type {
  ConfigPreference,
  PreferenceGroup,
  CategoryViewData,
} from "../types";

/* ──────────────────────────────────────────────────────
   Abbreviation Translation Dictionary
   ────────────────────────────────────────────────────── */

/**
 * Static dictionary that maps common technical abbreviations or
 * compound words to their human-friendly equivalents.
 *
 * Keys MUST be lowercase. Lookups are case-insensitive.
 */
const ABBREVIATION_MAP: Record<string, string> = {
  pmode: "Promiscuous Mode",
  buffersize: "Buffer Size",
  fileopen: "File Open",
  ringbuffer: "Ring Buffer",
  snaplen: "Snap Length",
  autostop: "Auto Stop",
  autoscroll: "Auto Scroll",
  realtime: "Real Time",
  recv: "Receive",
  src: "Source",
  dst: "Destination",
  addr: "Address",
  proto: "Protocol",
  reassembly: "Reassembly",
  retransmission: "Retransmission",
  maxcount: "Max Count",
  timestamp: "Timestamp",
};

/* ──────────────────────────────────────────────────────
   Label Formatting
   ────────────────────────────────────────────────────── */

/**
 * Capitalizes the first letter of a word.
 */
function capitalize(word: string): string {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Converts a raw setting sub-key (e.g. `check_checksum`, `devices_pmode`)
 * into a human-readable Title Case label.
 *
 * Processing steps:
 * 1. Split by underscores into tokens.
 * 2. For each token, check the abbreviation dictionary for an expansion.
 * 3. If no expansion, simply capitalize the token.
 * 4. Join all expanded tokens with spaces.
 *
 * @param key - The raw sub-key portion of a preference name
 *              (e.g. `check_checksum`, NOT the full `udp.check_checksum`).
 * @returns The human-readable label (e.g. "Check Checksum").
 */
export function toHumanReadableLabel(key: string): string {
  if (!key) return "";

  // Split by underscores, filter out empty segments
  const tokens = key.split("_").filter((t) => t.length > 0);

  return tokens
    .map((token) => {
      const lower = token.toLowerCase();
      if (ABBREVIATION_MAP[lower]) {
        return ABBREVIATION_MAP[lower];
      }
      return capitalize(lower);
    })
    .join(" ");
}

/* ──────────────────────────────────────────────────────
   Preference Grouping
   ────────────────────────────────────────────────────── */

/**
 * Dynamically groups an array of preferences into visual sub-groups
 * based on shared prefix segments of their sub-keys.
 *
 * Algorithm:
 * 1. Strip the category prefix from each preference name to get the sub-key.
 * 2. Split the sub-key by underscore to extract the first segment (the group prefix).
 * 3. Count occurrences of each group prefix.
 * 4. Prefixes with >= 2 items form a PreferenceGroup.
 * 5. Prefixes with only 1 item remain standalone.
 *
 * @param preferences - Array of ConfigPreference objects under a single category.
 * @param categoryPrefix - The category prefix to strip (e.g. "capture.", "gui.").
 *                         Pass "" for the "All Preferences" view.
 * @returns CategoryViewData with standalone preferences and preference groups.
 */
export function groupPreferences(
  preferences: ConfigPreference[],
  categoryPrefix: string,
): CategoryViewData {
  if (preferences.length === 0) {
    return { standalonePreferences: [], preferenceGroups: [] };
  }

  // If no category prefix (all view), don't group — everything is standalone
  if (!categoryPrefix) {
    return { standalonePreferences: [...preferences], preferenceGroups: [] };
  }

  // Map each pref to its sub-key and extract the first underscore segment
  interface PrefWithMeta {
    pref: ConfigPreference;
    subKey: string;
    groupKey: string; // first segment before underscore
    remainder: string; // everything after first underscore
  }

  const prefsWithMeta: PrefWithMeta[] = preferences.map((pref) => {
    const subKey = pref.name.startsWith(categoryPrefix)
      ? pref.name.substring(categoryPrefix.length)
      : pref.name;

    const underscoreIndex = subKey.indexOf("_");
    if (underscoreIndex === -1) {
      // No underscore — the entire sub-key is the group key
      return { pref, subKey, groupKey: subKey, remainder: "" };
    }

    return {
      pref,
      subKey,
      groupKey: subKey.substring(0, underscoreIndex),
      remainder: subKey.substring(underscoreIndex + 1),
    };
  });

  // Count how many prefs share each group key
  const groupCounts: Record<string, number> = {};
  prefsWithMeta.forEach(({ groupKey }) => {
    groupCounts[groupKey] = (groupCounts[groupKey] || 0) + 1;
  });

  // Build groups and standalone lists
  const groupsMap: Record<string, ConfigPreference[]> = {};
  const standalonePreferences: ConfigPreference[] = [];

  prefsWithMeta.forEach(({ pref, groupKey }) => {
    if (groupCounts[groupKey] >= 2) {
      if (!groupsMap[groupKey]) {
        groupsMap[groupKey] = [];
      }
      groupsMap[groupKey].push(pref);
    } else {
      standalonePreferences.push(pref);
    }
  });

  // Convert groups map to sorted PreferenceGroup array
  const preferenceGroups: PreferenceGroup[] = Object.entries(groupsMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupKey, prefs]) => ({
      id: `${categoryPrefix.replace(".", "")}-${groupKey}`,
      title: toHumanReadableLabel(groupKey),
      prefix: groupKey + "_",
      preferences: prefs,
    }));

  return { standalonePreferences, preferenceGroups };
}

/**
 * Extracts the display label for a preference within a group,
 * stripping the group prefix from the sub-key.
 *
 * @param configName - Full preference name (e.g. "capture.devices_hide")
 * @param categoryPrefix - The category prefix (e.g. "capture.")
 * @param groupPrefix - The group prefix (e.g. "devices_")
 * @returns The formatted remainder label (e.g. "Hide")
 */
export function getGroupItemLabel(
  configName: string,
  categoryPrefix: string,
  groupPrefix: string,
): string {
  let subKey = configName;
  if (categoryPrefix && configName.startsWith(categoryPrefix)) {
    subKey = configName.substring(categoryPrefix.length);
  }
  if (groupPrefix && subKey.startsWith(groupPrefix)) {
    subKey = subKey.substring(groupPrefix.length);
  }
  return toHumanReadableLabel(subKey);
}
