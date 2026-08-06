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

کامپوننت‌های پیچیده (`Modal`، `Tabs`، `Accordion`، `Table`، منوی کانتکست) که نیاز به `customization` ساختاری دارند.

---
## ⚙️ نحوه کار

1. `Context` داخلی `state` و `handlers` را نگه می‌دارد.
2. کامپوننت والد `Provider` است.
3. زیرکامپوننت‌ها (`Modal.Header`, `Table.Row`) از `Context` مصرف می‌کنند.
4. `children` یا `cloneElement` برای `composition` استفاده می‌شود.

---
## چه زمانی استفاده کنیم؟

- `UI kit` (`Modal`، `Dropdown`، `Tabs`، `Table`)
- وقتی `layout` باید قابل جابه‌جایی باشد
- وقتی API `declarative` می‌خواهید

---
## چه زمانی استفاده نکنیم؟

- کامپوننت ساده با چند `prop`
- وقتی `overhead` بی‌جهت `Context` است

---
## Syntax — الگوی Modal ساده

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
## الگوی Named Modal — `openName` + `cloneElement`

در دوره (the-wild-oasis) مودال با نام (`openName`) و `Modal.Open` / `Modal.Window` پیاده می‌شود — چند مودال در یک `Modal` والد بدون `state` جداگانه.

### `cloneElement`

وقتی نمی‌توانید JSX مستقیم به `children` بدهید و باید `prop` (مثل `onClick`) به کامپوننت فرزند inject کنید، از `cloneElement` استفاده می‌شود:

```jsx
import { cloneElement } from 'react';

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}
```

> مستندات react.dev ترجیح می‌دهد `composition` و `prop` صریح به‌جای `cloneElement`. این الگو در کد دوره و `legacy` رایج است؛ در کد جدید در صورت امکان دکمه `wrapper` یا `slot` صریح بهتر است.

### پیاده‌سازی کامل Named Modal

```jsx
import { createContext, useContext, useState, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { useOutsideClick } from './useOutsideClick';

const ModalContext = createContext(null);

function Modal({ children }) {
  const [openName, setOpenName] = useState('');
  const close = () => setOpenName('');
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
```

### مثال استفاده — چند مودال در یک صفحه

```jsx
function AddCabin() {
  return (
    <Modal>
      <Modal.Open opens="cabin-form">
        <Button>افزودن کابین</Button>
      </Modal.Open>
      <Modal.Window name="cabin-form">
        <CreateCabinForm />
      </Modal.Window>
    </Modal>
  );
}

function CabinRow({ cabin }) {
  return (
    <Table.Row>
      <Cabin>{cabin.name}</Cabin>
      <Modal>
        <Modal.Open opens="edit">
          <button type="button">ویرایش</button>
        </Modal.Open>
        <Modal.Window name="edit">
          <CreateCabinForm cabinToEdit={cabin} />
        </Modal.Window>
        <Modal.Open opens="delete">
          <button type="button">حذف</button>
        </Modal.Open>
        <Modal.Window name="delete">
          <ConfirmDelete onConfirm={() => deleteCabin(cabin.id)} />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}
```

---
## `useOutsideClick` — کلیک خارج از مودال

```jsx
import { useEffect, useRef } from 'react';

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }

    document.addEventListener('click', handleClick, listenCapturing);
    return () =>
      document.removeEventListener('click', handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}
```

`listenCapturing = true` یعنی listener در فاز `capture` ثبت می‌شود (قبل از `bubble`) — برای بستن مودال وقتی کلیک روی overlay یا خارج از پنل است مفید است.

---
## الگوی Table — compound با `columns` در Context

```jsx
const TableContext = createContext(null);

function Table({ columns, children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <table className="styled-table" role="table">{children}</table>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <thead role="rowgroup">
      <tr role="row" style={{ gridTemplateColumns: columns }}>{children}</tr>
    </thead>
  );
}

function Row({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <tr role="row" style={{ gridTemplateColumns: columns }}>{children}</tr>
  );
}

function Body({ data, render }) {
  if (!data.length) return <p>داده‌ای برای نمایش نیست</p>;
  return <tbody>{data.map((item) => render(item))}</tbody>;
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;

export default Table;
```

`Table.Body` با `render` — ترکیب `Compound` + `Render Props` (جزوه دوره). جزئیات در [Render Props](./Render-Props.md).

---
## منوی کانتکست

منوی کانتکست (کلیک راست) هم با همان ایده compound پیاده می‌شود: `Menu` والد + `Menu.Item` فرزند + `Context` برای موقعیت و باز/بسته. ساختار مشابه `Modal`/`Tabs` است.

---
## 💡 مثال استفاده — Modal ساده

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

- مودال compound در the-wild-oasis: `openName`، `Portal`، `useOutsideClick`
- جدول compound: ستون‌های grid با `columns` در `Context`
- مودال ساده در fast-react-pizza: `Trigger` / `Content` / `Header` / `Body`

---
## 🚀 Best Practices

✅ `Context` را فقط برای `sub-tree` همان compound نگه دارید  
✅ `hook` اختصاصی (`useModalContext`) با guard خطا  
✅ export زیرکامپوننت‌ها به‌صورت `Parent.Child`  
✅ `Portal` برای Modal/Tooltip — [Portals](../Portals.md)  
✅ `useMemo` برای `value` در `Provider` اگر `object` جدید هر بار  
❌ `expose` کردن `state` خام بدون نیاز  
❌ `cloneElement` در کد جدید بدون دلیل — ترجیح `composition`  
❌ وابستگی به ترتیب ثابت `children` بدون `documentation`

---
## ارتباط با مفاهیم دیگر

- [Context](../Context.md)
- [Portals](../Portals.md)
- [Custom Hooks](../Custom-Hooks.md)
- [Render Props](./Render-Props.md)
- [Reusability Patterns](./Reusability-Patterns.md)

---
## خلاصه

`Compound Components` = API ترکیبی + `state` مشترک ضمنی. برای `Modal`، `Table`، `Tabs` و `UI kit` ایده‌آل است. الگوی دوره: `openName` + `cloneElement` برای چند مودال در یک والد.

---
## 📚 منابع

- [Compound Components — Kent C. Dodds](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [React Context — react.dev](https://react.dev/learn/passing-data-deeply-with-context)
- [cloneElement — react.dev](https://react.dev/reference/react/cloneElement)
