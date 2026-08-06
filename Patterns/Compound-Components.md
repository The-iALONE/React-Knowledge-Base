# Compound Components

الگویی برای API انعطاف‌پذیر کامپوننت‌ها با اشتراک `state` ضمنی بین والد و فرزند.

---
## 📖 مفهوم

الگوی `Compound Components` مجموعه‌ای از کامپوننت‌های مرتبط است که با هم یک واحد UI می‌سازند (مثل `<select>` و `<option>` در HTML). کاربر ترکیب و چیدمان را کنترل می‌کند؛ `state` داخلی مشترک است.

---
## چرا این ویژگی وجود دارد؟

به‌جای `prop drilling` و ده‌ها `prop` اختیاری، API خوانا و قابل ترکیب ارائه می‌دهد.

---
## چه مشکلی را حل می‌کند؟

کامپوننت‌های پیچیده (Modal، Tabs، Accordion) که نیاز به `customization` ساختاری دارند.

---
## ⚙️ نحوه کار

1. `Context` داخلی `state` و `handlers` را نگه می‌دارد.
2. کامپوننت والد `Provider` است.
3. زیرکامپوننت‌ها (`Modal.Header`, `Modal.Body`) از `Context` مصرف می‌کنند.
4. `children` یا `React.Children` برای `composition` استفاده می‌شود.

---
## چه زمانی استفاده کنیم؟

- UI kit (Modal، Dropdown، Tabs)
- وقتی `layout` باید قابل جابه‌جایی باشد
- وقتی API `declarative` می‌خواهید

---
## چه زمانی استفاده نکنیم؟

- کامپوننت ساده با چند `prop`
- وقتی `overhead` بی‌جهت `Context` است

---
## Syntax — الگوی Modal

```jsx
import { createContext, useContext, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

const ModalContext = createContext(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal subcomponents must be used within <Modal>');
  }
  return context;
}

function Modal({ children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const value = useMemo(
    () => ({ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }),
    [isOpen]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

function ModalTrigger({ children }) {
  const { open } = useModalContext();
  return <button type="button" onClick={open}>{children}</button>;
}

function ModalContent({ children }) {
  const { isOpen, close } = useModalContext();
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={close}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

function ModalHeader({ children }) {
  const { close } = useModalContext();
  return (
    <header className="modal-header">
      {children}
      <button type="button" onClick={close} aria-label="Close">×</button>
    </header>
  );
}

function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>;
}

function ModalFooter({ children }) {
  return <footer className="modal-footer">{children}</footer>;
}

Modal.Trigger = ModalTrigger;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
```

---
## 💡 مثال استفاده

```jsx
import Modal from './Modal';

function DeleteAccountPage() {
  return (
    <Modal>
      <Modal.Trigger>حذف حساب</Modal.Trigger>

      <Modal.Content>
        <Modal.Header>تأیید حذف</Modal.Header>
        <Modal.Body>آیا مطمئن هستید؟ این عمل غیرقابل بازگشت است.</Modal.Body>
        <Modal.Footer>
          <button type="button">انصراف</button>
          <button type="button" className="danger">حذف</button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
```

---
## مثال واقعی در پروژه

الگوی Modal بالا جایگزین مدرن کامپوننت‌های modal در دوره‌هاست: باز/بسته شدن، `portal`، و `slot`های Header/Body/Footer—بدون `prop` انبوه.

---
## 🚀 Best Practices

✅ `Context` را فقط برای `sub-tree` همان compound نگه دارید  
✅ `hook` اختصاصی (`useModalContext`) با guard خطا  
✅ export زیرکامپوننت‌ها به‌صورت `Parent.Child`  
✅ `Portal` برای Modal/Tooltip  
❌ `expose` کردن `state` خام بدون نیاز  
❌ وابستگی به ترتیب ثابت `children` بدون `documentation`

---
## ارتباط با مفاهیم دیگر

- [Context API](../State-Management/Context-API.md)
- [Portals](../Portals.md)
- [Render Props](./Render-Props.md)
- [Reusability Patterns](./Reusability-Patterns.md)

---
## خلاصه

`Compound Components` = API ترکیبی + `state` مشترک ضمنی. برای Modal، Tabs و UI kit ایده‌آل است.

---
## 📚 منابع

- [Compound Components — Kent C. Dodds](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [React Context — react.dev](https://react.dev/learn/passing-data-deeply-with-context)
