# Feature Specification: Refactor Tap UI

**Feature Branch**: `019-refactor-tap-ui`

**Created**: 2026-08-26

**Status**: Draft

**Input**: User description: "I want to refact the tap ui interfaces. first, i want to add a limit of 16 taps per tap request that can be added. This is a limitation set by sharkd on the backend. second, I want to change the ui so that the "add tap" is in the modal as it currently is, but the modal applies to all tap related items. In the tap selection area I want each tap to be a button that can be clicked to apply the data, but I want the buttons to be organized by category with an accordion per category and a button per tap. I would like a N/16 taps counter visible to display how many of the taps have been applied in this request. Once a user clicks "Apply" the single request with all taps should be sent to the sharkophagus backend. Resulting statistic data should be displayed as described in the following. Third, i want to remove the analytic dashboard from the main overview, and add it as tab in the tap modal that has the taps that have been applied during the session which will display the statistics from the taps. fourth, i want to resolve whether or not data is being return for the statistics. Right now I see "mock data" and it says "waiting for statistics". Right now let's just display the data as JSON and then once we see that data is working we can work on how to display it properly."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tap Selection and Batch Application (Priority: P1)

Users need to select multiple taps from categorized lists and apply them simultaneously to the backend, up to a maximum limit of 16 taps.

**Why this priority**: The core functionality of the feature is allowing the user to select and apply taps efficiently without exceeding backend limits.

**Independent Test**: Can be fully tested by opening the tap modal, navigating through the accordions, selecting a number of taps, observing the counter, attempting to exceed the limit, and clicking apply to verify the network request payload.

**Acceptance Scenarios**:

1. **Given** the user is viewing the tap selection modal, **When** they expand a category accordion, **Then** they see buttons for each tap in that category.
2. **Given** the user is selecting taps, **When** they click a tap button, **Then** the tap is marked as selected and the "N/16" counter increments.
3. **Given** the user has selected 16 taps, **When** they attempt to select a 17th tap, **Then** the selection is prevented and/or an appropriate UI warning is displayed.
4. **Given** the user has selected one or more taps (up to 16), **When** they click "Apply", **Then** a single request containing all selected taps is sent to the sharkophagus backend.

---

### User Story 2 - Analytics Dashboard Migration and Data Verification (Priority: P2)

Users need to view the statistics of the taps applied during the current session within a dedicated tab in the modal, and view the actual raw data from the backend to verify functionality.

**Why this priority**: Migrating the dashboard cleans up the main UI, and displaying the raw JSON is a necessary step to debug and verify the backend statistics data flow.

**Independent Test**: Can be tested by applying taps, navigating to the Analytics Dashboard tab in the modal, and verifying that the applied taps are listed and their raw JSON statistics are displayed instead of mock data.

**Acceptance Scenarios**:

1. **Given** the user is on the main overview page, **When** they look for the analytics dashboard, **Then** it is no longer visible on the main page.
2. **Given** the user opens the tap modal, **When** they navigate to the "Analytics Dashboard" tab, **Then** they see a list of taps applied during the current session.
3. **Given** the user views the Analytics Dashboard tab with applied taps, **When** the statistics are loaded, **Then** the real data from the backend is displayed as raw JSON.

---

### Edge Cases

- What happens if the user tries to select more than 16 taps?
- What happens if the backend request fails after clicking Apply?
- What happens if a category has no taps available?
- What happens if statistics return an empty payload or error from the backend?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST group available taps by category in collapsible accordion sections within the tap modal.
- **FR-002**: System MUST represent each available tap as a clickable button within its respective category accordion.
- **FR-003**: System MUST enforce a maximum limit of 16 selected taps per request, preventing further selection once the limit is reached.
- **FR-004**: System MUST display a real-time visual counter showing the number of selected taps against the maximum limit (e.g., "N/16").
- **FR-005**: System MUST send a single, consolidated request containing all selected taps to the sharkophagus backend when the user clicks "Apply".
- **FR-006**: System MUST remove the analytic dashboard component from the main overview screen.
- **FR-007**: System MUST provide an "Analytics Dashboard" tab within the tap modal interface.
- **FR-008**: System MUST display the list of taps applied during the current session in the new Analytics Dashboard tab.
- **FR-009**: System MUST fetch and display raw statistical data (formatted as JSON) from the backend for the applied taps, replacing the existing "mock data" and "waiting for statistics" placeholder text.

### Key Entities *(include if feature involves data)*

- **Tap**: Represents a data interception point. Has attributes like ID, name, and category.
- **Tap Request Payload**: The batch of selected taps sent to the backend (max 16).
- **Session Statistics**: The analytics data retrieved from the backend for taps applied in the current session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully navigate categories and select up to 16 taps in the modal.
- **SC-002**: Users are successfully prevented from adding more than 16 taps to a single request payload.
- **SC-003**: A single network request containing the batch of selected taps is successfully sent to the backend upon application.
- **SC-004**: Raw JSON statistics data is visibly populated in the Analytics Dashboard tab for applied taps, proving successful data retrieval from the backend.
- **SC-005**: The main overview page successfully renders without the analytic dashboard component.

## Assumptions

- The backend API endpoint is already capable of receiving a batch of up to 16 taps in a single request.
- Tap category data is already available or can be derived from existing frontend data structures/backend responses.
- The state of "taps applied during the session" is maintained by the frontend and resets on a new session or page reload.
- The raw JSON data structure returned by the backend is suitable for direct display in the UI for debugging/verification purposes.
