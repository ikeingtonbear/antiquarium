# Quickstart & Verification: Sharkd Configuration Settings

This guide details the steps to verify the Sharkd Configuration settings feature on the frontend.

## Verification Checklist

1. **Settings Menu Option**:
   - Click the settings gear icon in the bottom-right corner.
   - Verify there is a menu item labeled exactly "Preferences".

2. **Viewing Preferences (No Session)**:
   - Click the "Preferences" menu item.
   - Verify that the preferences modal is loaded and displays a search input and configuration preferences.
   - Verify that the inputs are disabled and a warning notice is displayed: "Active session required to modify settings".

3. **Searching and Filtering**:
   - Type a filter term like "udp" in the search input.
   - Verify the displayed preferences list immediately filters down to matches containing "udp".

4. **Modifying Preferences (Active Session)**:
   - Upload a packet capture file to start a session.
   - Click "Preferences" in the settings menu.
   - Verify that inputs/dropdowns are now enabled.
   - Change a preference (e.g. toggle a checkbox).
   - Verify a `POST` request is sent to `/v1/sessions/{sessionId}/config` with the updated preference.
