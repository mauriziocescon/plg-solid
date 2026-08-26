import { createEffect, createSignal, Ref } from 'solid-js';
import './Counter.css';

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

function autofocus() {
    // Apply phase only — pure DOM write.
    return (el: HTMLElement) => el.focus();
}

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

function Button(props: { ref?: Ref<HTMLButtonElement>, label: string }) {
    return (
        <button
            class="increment"
            ref={[props.ref]}
            type="button">
            {props.label}
        </button>
    );
}

export default function Counter() {
    const [count, setCount] = createSignal(0);
    const [active, setActive] = createSignal(true);

    const directives = [
        clickOutside(() => alert('Yeah!')),
        clickOutside(() => setActive(false)),
    ];

    return (
        <>
            {active() && <p ref={[]}>Active! Click outside to dismiss.</p>}

            <button
                class="increment"
                ref={[autofocus()]}
                onClick={() => setCount(count() + 1)}
                type="button">
                Clicks: {count()}
            </button>

            <p>Click outside for triggering directives on Button!</p>
            <Button ref={directives} label={'Button'} />
        </>
    );
}
