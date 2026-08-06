import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  cloneElement,
} from "react";
import { createPortal } from "react-dom";

const ModalContext = createContext(null);

function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);
    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}

function Modal({ children }) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-panel" ref={ref}>
        <button type="button" onClick={close} aria-label="Close">×</button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;

// Usage:
// <Modal>
//   <Modal.Open opens="cabin-form">
//     <Button>Add new cabin</Button>
//   </Modal.Open>
//   <Modal.Window name="cabin-form">
//     <CreateCabinForm />
//   </Modal.Window>
// </Modal>
