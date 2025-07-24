# Modal Refactor Plan

## Goals

1. Simplify `NoteModal.tsx` by breaking it into smaller, reusable components.
2. Improve `BaseModal.tsx` to make it more flexible and reusable.
3. Consolidate repetitive logic (e.g., buttons) into shared utilities.
4. Enhance type safety and readability across all modal-related files.
5. Ensure the refactored code is well-documented and easy to maintain.

---

## Steps to Refactor

### **1. Simplify `NoteModal.tsx`**

- **1.1** Extract reusable components:
  - Move `EditNoteContent` to a separate file (e.g., `EditNoteContent.tsx`).
  - Move `EditNoteModalButtons` and `ViewNoteModalButtons` to a shared file (e.g., `ModalButtons.tsx`).
- **1.2** Consolidate button logic:
  - Create a generic `ModalButton` component to handle `Save`, `Delete`, `Edit`, and `Cancel` buttons.
- **1.3** Refactor `EditNoteModal` and `ViewerNoteModal`:
  - Use the extracted components for content and buttons.
  - Simplify props by creating a shared `NoteModalProps` interface.

---

### **2. Improve `BaseModal.tsx`**

- **2.1** Add support for custom close behavior:
  - Allow passing an `onClose` callback to handle additional logic when the modal is closed.
- **2.2** Make styling more flexible:
  - Add support for additional `className` props to customize modal appearance.
- **2.3** Add a utility function for rendering modals:
  - Create a `ModalRenderer` component to manage multiple modals dynamically.

---

### **3. Consolidate Button Logic**

- **3.1** Create a `ModalButton` component:
  - Accept props like `variant` (`primary`, `secondary`, `danger`) and `onClick`.
  - Replace `SaveButton`, `DeleteButton`, and `EditButton` with this generic component.
- **3.2** Update all modal files to use the new `ModalButton`.

---

### **4. Enhance Type Safety**

- **4.1** Create shared types:
  - Define a `ModalProps` interface for all modal components.
  - Use `Pick` or `Omit` to extend or customize props for specific modals.
- **4.2** Add stricter types for `useModal`:
  - Ensure `modalId` is strongly typed (e.g., using a union of valid modal IDs).

---

### **5. Add Documentation**

- **5.1** Add comments to all modal components:
  - Explain the purpose of each component and its props.
- **5.2** Create a `README.md` in the `modals` folder:
  - Document how to use `BaseModal`, `NoteModal`, and other shared components.

---

## Deliverables

1. Refactored `NoteModal.tsx` with extracted components.
2. Improved `BaseModal.tsx` with flexible styling and custom close behavior.
3. A new `ModalButton` component for shared button logic.
4. Enhanced type safety across all modal-related files.
5. Updated documentation for the modal system.

---

## Checklist

- [x] Extract `EditNoteContent` to `EditNoteContent.tsx`.
- [x] Extract `EditNoteModalButtons` and `ViewNoteModalButtons` to `ModalButtons.tsx`.
- [x] Create a `ModalButton` component.
- [ ] Refactor `EditNoteModal` to use extracted components.
- [ ] Refactor `ViewerNoteModal` to use extracted components.
- [ ] Add `onClose` support to `BaseModal.tsx`.
- [ ] Add `className` support to `BaseModal.tsx`.
- [ ] Create a `ModalRenderer` for dynamic modal management.
- [ ] Enhance type safety for `useModal` and modal props.
- [ ] Add comments to all modal components.
- [ ] Write a `README.md` for the `modals` folder.
