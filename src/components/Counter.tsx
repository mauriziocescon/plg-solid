import { createEffect, createSignal, Ref } from 'solid-js';
import './Counter.css';

// clickOutside: the listener depends on the element, so we capture it in
// apply, then do the subscribe/cleanup in setup via an effect keyed on `el`.
function clickOutside(handler: () => void) {
    const [el, setEl] = createSignal<HTMLElement>();

    // Setup phase (owned): subscription + cleanup live here.
    createEffect(
        () => el(),
        (node) => {
            if (!node) return;
            const onClick = (e: Event) => {
                if (!node.contains(e.target as Node)) handler();
            };
            document.addEventListener('click', onClick);
            return () => document.removeEventListener('click', onClick); // cleanup
        },
    );

    // Apply phase (unowned): just hand the element to setup.
    return (node: HTMLElement) => setEl(node);
}

// autofocus: no reactive state, so setup is empty; apply just focuses.
function autofocus() {
    // Apply phase only — pure DOM write.
    return (el: HTMLElement) => el.focus();
}

// logValue: subscription + cleanup belong in setup; apply forwards the element.
function logValue() {
    const [el, setEl] = createSignal<HTMLInputElement>();

    // Setup phase (owned).
    createEffect(
        () => el(),
        (node) => {
            if (!node) return;
            const log = () => console.log(node.value);
            node.addEventListener('input', log);
            return () => node.removeEventListener('input', log);
        },
    );

    // Apply phase (unowned).
    return (node: HTMLInputElement) => setEl(node);
}

interface ButtonProps {
    ref?: Ref<HTMLButtonElement>;
}

function Button(props: ButtonProps) {
    return (
        <button
            class="increment"
            ref={[props.ref]}
            type="button">
            Clicks
        </button>
    );
}

export default function Counter() {
    const [count, setCount] = createSignal(0);
    const [active, setActive] = createSignal(true);

    return (
        <div ref={clickOutside(() => setActive(false))}>
            <button
                class="increment"
                ref={[autofocus()]}
                onClick={() => setCount(count() + 1)}
                type="button"
            >
                Clicks: {count()}
            </button>
            {active() && <p ref={clickOutside(() => setActive(false))}>Active! Click outside to dismiss.</p>}

            <Button ref={[autofocus()]} />
        </div>
    );
}
