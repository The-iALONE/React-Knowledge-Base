import { createContext, useContext, useState, useMemo } from "react";
import { createPortal } from "react-dom";

const ModalContext = createContext(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal subcomponents must be used within <Modal>");
  }
  return context;
}

function Modal({ children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

function ModalTrigger({ children }) {
  const { open } = useModalContext();
  return (
    <button type="button" onClick={open}>{children}</button>
  );
}

function ModalContent({ children }) {
  const { isOpen, close } = useModalContext();
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={close}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

Modal.Trigger = ModalTrigger;
Modal.Content = ModalContent;

export default Modal;

// Usage:
// <Modal>
//   <Modal.Trigger>Delete cabin</Modal.Trigger>
//   <Modal.Content>
//     <h2>Confirm deletion</h2>
//   </Modal.Content>
// </Modal>
//
// Named modal pattern (openName + cloneElement):
// see CompoundModalNamed.jsx
