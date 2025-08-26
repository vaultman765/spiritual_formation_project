import { render, screen, fireEvent } from "@/test-utils/testing-library-exports";
import {
  BaseModal,
  ModalRenderer,
  ModalButton,
  CloseButton,
  SaveButton,
  DeleteButton,
  CancelButton,
  ModalTitle,
} from "@/components/modals/BaseModal";
import { useModal } from "@/hooks/useModal";

jest.mock("@/hooks/useModal", () => ({
  useModal: jest.fn(),
}));

describe("BaseModal", () => {
  it("renders children when the modal is open", () => {
    (useModal as jest.Mock).mockReturnValue({
      isOpen: true,
      closeModal: jest.fn(),
    });

    render(
      <BaseModal modalId="testModal">
        <p>Modal Content</p>
      </BaseModal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("does not render when the modal is closed", () => {
    (useModal as jest.Mock).mockReturnValue({
      isOpen: false,
      closeModal: jest.fn(),
    });

    render(
      <BaseModal modalId="testModal">
        <p>Modal Content</p>
      </BaseModal>
    );

    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  it("closes the modal when the Escape key is pressed", () => {
    const closeModal = jest.fn();
    (useModal as jest.Mock).mockReturnValue({ isOpen: true, closeModal });

    render(
      <BaseModal modalId="testModal">
        <p>Modal Content</p>
      </BaseModal>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeModal).toHaveBeenCalled();
  });
});

describe("ModalRenderer", () => {
  it("renders multiple modals", () => {
    (useModal as jest.Mock).mockReturnValue({
      isOpen: true,
      closeModal: jest.fn(),
    });

    render(
      <ModalRenderer
        modals={[
          { id: "modal1", content: <p>Modal 1 Content</p> },
          { id: "modal2", content: <p>Modal 2 Content</p> },
        ]}
      />
    );

    expect(screen.getByText("Modal 1 Content")).toBeInTheDocument();
    expect(screen.getByText("Modal 2 Content")).toBeInTheDocument();
  });
});

describe("ModalButton", () => {
  it("renders with the correct text and variant", () => {
    render(<ModalButton text="Click Me" onClick={jest.fn()} variant="danger" />);

    const button = screen.getByText("Click Me");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-red-600");
  });

  it("calls the onClick handler when clicked", () => {
    const onClick = jest.fn();
    render(<ModalButton text="Click Me" onClick={onClick} />);

    fireEvent.click(screen.getByText("Click Me"));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("CloseButton", () => {
  it("closes the modal when clicked", () => {
    const closeModal = jest.fn();
    (useModal as jest.Mock).mockReturnValue({ closeModal });

    render(<CloseButton modalId="testModal" />);

    fireEvent.click(screen.getByText("×"));
    expect(closeModal).toHaveBeenCalled();
  });
});

describe("SaveButton", () => {
  it("calls onClick and closes the modal", async () => {
    const closeModal = jest.fn(); // Mock closeModal
    const onClick = jest.fn(); // Mock onClick
    (useModal as jest.Mock).mockReturnValue({ closeModal }); // Mock useModal

    render(<SaveButton modalId="testModal" onClick={onClick} />);

    // Simulate button click
    fireEvent.click(screen.getByText("Save"));

    // Wait for async actions to complete
    await Promise.resolve();

    // Assert that onClick and closeModal were called
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});

describe("DeleteButton", () => {
  it("calls onClick and closes the modal", async () => {
    const closeModal = jest.fn(); // Mock closeModal
    const onClick = jest.fn(); // Mock onClick
    (useModal as jest.Mock).mockReturnValue({ closeModal }); // Mock useModal

    render(<DeleteButton modalId="testModal" onClick={onClick} />);

    // Simulate button click
    fireEvent.click(screen.getByText("Delete"));

    // Wait for async actions to complete
    await Promise.resolve();

    // Assert that onClick and closeModal were called
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});

describe("CancelButton", () => {
  it("calls onClick and closes the modal", () => {
    const closeModal = jest.fn();
    const onClick = jest.fn();
    (useModal as jest.Mock).mockReturnValue({ closeModal });

    render(<CancelButton modalId="testModal" onClick={onClick} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(onClick).toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalled();
  });
});

describe("ModalTitle", () => {
  it("renders the title", () => {
    render(<ModalTitle title="Test Title" />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });
});
