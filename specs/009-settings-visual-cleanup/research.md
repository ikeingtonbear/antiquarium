# Research: Settings Visual Cleanup

## 1. Title Case & Abbreviation Formatting
### Decision
Create a pure formatting function `toHumanReadableLabel` that:
1. Strips underscores and dots.
2. Converts to Title Case.
3. Applies a dictionary of specific replacements for common technical terms (e.g. `pmode` -> "Promiscuous Mode", `buffersize` to "Buffer Size", `fileopen` to "File Open").

### Rationale
Purely capitalization-based Title Case leaves abbreviations like `pmode` as "Pmode", which is still unfriendly. A translation dictionary paired with a generic regex tokenizer provides the optimal balance of automation and human-centric translation.

### Alternatives Considered
- **Direct String Mapping**: Hand-authoring mapping for all possible settings. Rejected because it doesn't scale to new settings added dynamically in the future.
- **Pure Title Case**: Capitalizing words without a dictionary. Rejected because terms like "pmode" remain obscure.

---

## 2. Dynamic Grouping Algorithm
### Decision
Implement a client-side grouping algorithm in a helper file `web/src/services/configFormatter.ts` that:
1. Receives an array of `ConfigPreference` objects.
2. Extracts their category prefixes (e.g. `capture.`).
3. For the remaining string, tokenizes by the first delimiter (`.` or `_`) to find potential subgroup prefixes.
4. Groups items if **two or more** preferences share a prefix.
5. Simplifies item labels inside the group by removing the group prefix.
6. Places single-item prefixes as standalone root-level settings.

### Rationale
This ensures settings modal structures are organized dynamically even if the backend configuration changes. It avoids visual clutter from single-item group sections while automatically clustering related options (e.g., `devices_` options under "Devices").

### Alternatives Considered
- **Hardcoded Group Schemas**: Defining fixed groups and manually mapping preferences to them. Rejected because it requires ongoing maintenance and breaks if backend settings names change or new settings are introduced.

---

## 3. Visual Styling and Collapsible Sections
### Decision
Use Vue `Transition` or CSS height transition wrappers for smooth collapsing/expanding of visual groups. Group containers will be rendered as card-like panels (`bg: rgba(15, 23, 42, 0.4)` with light borders) to provide visual boundaries.

### Rationale
This visually distinguishes grouped settings from standalone ones, establishing clear boundaries. Collapsible behaviors help users manage vertical scrolling inside categories containing many options.

### Alternatives Considered
- **Plain Header Text (No Card Styling)**: Using simple headers to separate groups. Rejected because it doesn't convey nested relationships as clearly as a structured card layout.
