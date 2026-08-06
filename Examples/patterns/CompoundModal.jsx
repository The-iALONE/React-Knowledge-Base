import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

function Modal({ children }) {
  const { isOpen, close } = useContext(ModalContext);
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalOpen({ children }) {
  const { open } = useContext(ModalContext);
  return <button onClick={open}>{children}</button>;
}

function ModalClose({ children }) {
  const { close } = useContext(ModalContext);
  return <button onClick={close}>{children}</button>;
}

function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

Modal.Open = ModalOpen;
Modal.Close = ModalClose;

export { Modal, ModalProvider };

// Usage:
// <ModalProvider>
//   <Modal.Open>Delete cabin</Modal.Open>
//   <Modal>
//     <h2>Confirm deletion</h2>
//     <Modal.Close>Cancel</Modal.Close>
//   </Modal>
// </ModalProvider>
