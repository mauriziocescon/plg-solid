import { createSignal, onCleanup } from "solid-js";
import "./Counter.css";

function clickOutside(handler: () => void) {
  return (el: HTMLSpanElement) => {
    const onClick = (e: Event) => {
      if (!el.contains(e.target as Node)) handler();
    };
    document.addEventListener("click", onClick);
    onCleanup(() => document.removeEventListener("click", onClick));
  };
}

function autofocus() {
  return (el: HTMLElement) => el.focus();
}

function logValue() {
  return (el: HTMLElement & {value: string }) => {
    const log = () => console.log(el.value);
    el.addEventListener('input', log);
    onCleanup(() => el.removeEventListener("input", log));
  }
}

export default function Counter() {
  const [count, setCount] = createSignal(0);
  const [active, setActive] = createSignal(true);

  return (
    <div ref={clickOutside(() => setActive(false))}>
      <button
        class="increment"
        ref={autofocus()}
        onClick={() => setCount(count() + 1)}
        type="button"
      >
        Clicks: {count()}
      </button>
      {active() && <p ref={clickOutside(() => setActive(false))}>Active! Click outside to dismiss.</p>}
    </div>
  );
}
