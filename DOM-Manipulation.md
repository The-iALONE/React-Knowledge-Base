# DOM Manipulation — دستکاری DOM

> معمولاً DOM را در React به‌صورت `declarative` مدیریت کنید. گاهی نیاز به دستکاری `imperative` دارید — با `ref` و `escape hatch`ها.

## 📖 مفهوم

دستکاری DOM (`DOM Manipulation`) یعنی تغییر مستقیم DOM خارج از چرخه `render`/`commit` معمولی React. React ترجیح می‌دهد شما `state` را تغییر دهید و UI خودکار به‌روز شود؛ اما برای `focus`، `scroll`، `animation`، یا `integration` با کتابخانه‌های `third-party` گاهی `imperative` لازم است.

## چرا این ویژگی وجود دارد؟

همه چیز `declarative` نیست: `focus management`، `media playback`، `chart libraries`، `map SDK`ها.

## چه مشکلی را حل می‌کند؟

- کارهایی که React API `declarative` ندارد
- اتصال به کتابخانه‌های `imperative` (`D3`، `Leaflet`)

## ⚙️ نحوه کار

**روش توصیه‌شده:** `useRef` + `useEffect`

```jsx
function VideoPlayer({ src, isPlaying }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  return <video ref={videoRef} src={src} />;
}
```

**روش دوم:** `flushSync` برای `force sync commit` (نادر)

**روش سوم:** `dangerouslySetInnerHTML` برای HTML خام (با احتیاط XSS)

## Syntax

```jsx
// ref + effect
elementRef.current.focus();
elementRef.current.scrollIntoView();

// HTML خام
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
```

## مثال واقعی در پروژه

**نقشه شهرها (`worldwise`):** کتابخانه `Leaflet` DOM خودش را می‌سازد. با `useRef` `container div` را به `Leaflet` می‌دهید و `lifecycle` را در `useEffect` مدیریت می‌کنید (`mount` → `init map`، `unmount` → `cleanup`).

## ⚠️ اشتباهات رایج

- ❌ دستکاری DOM در `render` (نه در `effect`)
- ❌ تغییر DOM که React مالک آن است (`conflict` با Virtual DOM)
- ❌ `dangerouslySetInnerHTML` بدون `sanitize` (XSS)
- ❌ فراموش کردن `cleanup` در `effect`

## 🚀 Best Practices

- ✅ ابتدا راه `declarative` را بررسی کنید (`state` → JSX)
- ✅ دستکاری DOM فقط در `useEffect` / `event handler`
- ✅ `cleanup` در `return` `effect` برای `third-party libs`
- ✅ `useLayoutEffect` اگر قبل از `paint` نیاز دارید (اندازه‌گیری `layout`)

## چه زمانی استفاده کنیم؟

- `focus`، `scroll`، `selection`
- پخش/توقف `media`
- `mount`/`unmount` `third-party widget`
- اندازه‌گیری `element` (`width`/`height`)

## چه زمانی استفاده نکنیم؟

- نمایش/مخفی کردن `element` → `conditional rendering`
- تغییر `style` → `state` + `className`/`style` `prop`
- تغییر متن → `state` در JSX

## ارتباط با مفاهیم دیگر

- [Refs](./Refs.md)
- [Effects](./Effects.md)
- [Hooks/useLayoutEffect](./Hooks/useLayoutEffect.md)
- [Escape Hatches](./Escape-Hatches/README.md)

## 💡 نکات مهم

- React ممکن است DOM را دوباره `render` کند و تغییرات `imperative` شما را بازنویسی کند — مالکیت را مشخص کنید
- `useLayoutEffect` قبل از `browser paint` اجرا می‌شود (برای جلوگیری از `flicker`)

## 🎯 سوالات رایج مصاحبه

- تفاوت `useEffect` و `useLayoutEffect` برای DOM؟
- چرا نباید مستقیماً DOM را در `render` دستکاری کرد؟

## خلاصه

دستکاری `imperative` DOM فقط وقتی لازم است — با `ref` + `effect`، و همیشه `cleanup`.

## 📚 منابع

- [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
