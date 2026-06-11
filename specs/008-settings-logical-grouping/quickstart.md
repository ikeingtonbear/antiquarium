# Quickstart & Verification: Settings Logical Grouping

This guide details the steps to verify the logical grouping layout, responsive menus, and search behaviors in the settings modal.

## Manual Verification Checklist

### 1. Two-Column Layout (Desktop View)
- Open the application on a desktop browser (viewport width >= 768px).
- Click the settings gear icon and select **Preferences**.
- Verify the modal uses a two-column layout:
  - **Left Sidebar**: Navigation category list showing "All Preferences", "User Interface", "Capture", and "Protocols" section headers containing individual protocol sub-items (e.g. `IP`, `TCP`, `UDP`).
  - **Right Panel**: Detailed settings list with category title and description at the top.

### 2. Category Navigation & Transitions
- Click on different categories in the left sidebar (e.g. "User Interface", then "TCP").
- Verify that only the settings matching that category are displayed in the right panel.
- Verify that a smooth fade/slide animation occurs during transition switches.
- Verify that settings inside a specific protocol/category display their sub-property name as the main title (e.g., `check_checksum` instead of `udp.check_checksum`) and the full path is shown below as secondary monospace helper text.

### 3. Global Search with Category Grouping
- Click "All Preferences" or any category.
- Type a search query (e.g. `checksum` or `port`) in the search input.
- Verify that the right-hand panel displays matching settings grouped under clear category headers (e.g., "UDP" header containing `check_checksum`).
- Verify that clearing the search query immediately restores the category selection and list.

### 4. Responsive Mobile Layout
- Resize the browser window width below 768px (or open in mobile emulation mode at 375px).
- Verify the left sidebar collapses and disappears.
- Verify that a styled custom dropdown menu selector is displayed at the top of the settings panel.
- Open the dropdown and select a category (e.g. "UDP").
- Verify the settings panel updates to show the selected category's settings.
