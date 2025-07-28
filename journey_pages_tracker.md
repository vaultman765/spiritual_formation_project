# Journey Pages Refactoring Tracker

## 1. Abstract Shared Logic into a Custom Hook ✅

- Create a `useJourneyEditor` hook to handle:
  - Fetching available arcs.
  - Managing selected arcs.
  - Handling reordering logic.
  - Managing the journey title.

## 2. Create a Shared Component for Arc Lists ✅

- Build an `ArcList` component to:
  - Render arcs with drag-and-drop support.
  - Display tooltips and metadata.
  - Handle `onReorder` and `onRemove` actions.

## 3. Generalize Save and Update Logic

- Create a utility function `saveOrUpdateJourney` to:
  - Handle both creating and updating journeys.
  - Accept journey ID, title, and arcs as parameters.

## 4. Combine `CustomJourneyPage` and `EditCustomJourneyPage`

- Create a single `JourneyEditorPage` component with:
  - Props for `mode` (`"create"` or `"edit"`).
  - `initialJourney` data for edit mode.

## 5. Refactor Tooltip and ArcCard Logic

- Abstract tooltip and card rendering into a reusable `ArcCardWithTooltip` component.

## 6. Update Context API if Needed

- Consolidate overlapping logic in the journey context (`useJourney`) into a single function like `saveJourney`.

## 7. Test and Validate Changes

- Ensure all refactored components and hooks work as expected.
- Update unit tests for `CustomJourneyPage` and `EditCustomJourneyPage`.

## 8. Update Routing in `App.tsx`

- Replace `CustomJourneyPage` and `EditCustomJourneyPage` with the new `JourneyEditorPage`.
