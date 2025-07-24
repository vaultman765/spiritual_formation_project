# Modal System Documentation

## Overview

The modal system in this project is designed to provide reusable, flexible, and dynamic modals for various use cases. It
includes a `BaseModal` component, utility hooks, and specialized modal components for specific features like notes.

---

## Components

### 1. `BaseModal`

- **Purpose**: A generic modal component that serves as the foundation for all modals.
- **Props**:
  - `modalId` (string): Unique identifier for the modal.
  - `children` (ReactNode): Content to render inside the modal.
  - `modalBackground` (string, optional): CSS class for the modal background.
  - `modalClassName` (string, optional): CSS class for the modal container.

#### Example:

```tsx
<BaseModal modalId="exampleModal">
  <h2>Example Modal</h2>
  <p>This is an example modal.</p>
</BaseModal>
```

---

### 2. `ModalRenderer`

- **Purpose**: Dynamically renders multiple modals based on a list of modal configurations.
- **Props**:
  - `modals` (array): An array of objects with `id` and `content` properties.

#### Example:

```tsx
<ModalRenderer
  modals={[
    { id: "modal1", content: <div>Modal 1 Content</div> },
    { id: "modal2", content: <div>Modal 2 Content</div> },
  ]}
/>
```

---

### 3. `NoteModal`

- **Purpose**: Specialized modal for viewing, editing, and managing notes.
- **Subcomponents**:
  - `EditNoteModal`
  - `ViewerNoteModal`

#### Example:

```tsx
<EditNoteModal
  modalId="editNoteModal"
  title="Edit Note"
  content="Note content here"
  master_day_number={1}
  onClose={() => console.log("Modal closed")}
  onUpdate={() => console.log("Note updated")}
/>
```

---

### 4. `NoteModalButtons`

- **Purpose**: Provides buttons for actions like saving, deleting, and editing notes.
- **Components**:
  - `NoteActionButton`
  - `EditNoteModalButtons`
  - `ViewNoteModalButtons`

#### Example:

```tsx
<NoteActionButton
  modalId="editNoteModal"
  actionType="save"
  master_day_number={1}
  content="Note content"
  onUpdate={() => console.log("Note updated")}
/>
```

---

## Hooks

### 1. `useModal`

- **Purpose**: Provides utility functions to manage modal state.
- **Functions**:
  - `isOpen(modalId: string)`: Checks if a modal is open.
  - `openModal(modalId: string)`: Opens a modal.
  - `closeModal(modalId: string)`: Closes a modal.

#### Example:

```tsx
const { openModal, closeModal } = useModal("exampleModal");

<button onClick={openModal}>Open Modal</button>;
<button onClick={closeModal}>Close Modal</button>;
```

---

## Best Practices

1. Use `BaseModal` for all new modals to ensure consistency.
2. Use `ModalRenderer` for managing multiple modals dynamically.
3. Keep modal-specific logic (e.g., buttons) in separate components for better reusability.
4. Use `useModal` to manage modal state instead of manually toggling visibility.

---

## Folder Structure

``` text
modals/
  BaseModal.tsx
  NoteModal/
    NoteModal.tsx
    NoteModalButtons.tsx
    EditNoteContent.tsx
```

---

## Future Improvements

1. Add animations for modal transitions.
2. Implement accessibility features (e.g., focus trapping, ARIA roles).
3. Create a `ModalProvider` wrapper for global modal state management.
