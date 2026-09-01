import { createEffect, createSignal } from 'solid-js';

import Button from './Button';

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

export default function Counter() {
    const [count, setCount] = createSignal(0);
    const [active, setActive] = createSignal(true);

    const behaviours = [
        clickOutside(() => alert('Yeah!')),
        clickOutside(() => setActive(false)),
    ];

    return (
        <>
            {active() && <p>Active! Click outside to dismiss.</p>}

            <Button
                type="button"
                style={{ 'background-color': 'red' }}
                onClick={() => setCount(count() + 1)}
                ref={behaviours}>
                Clicks: {count()}
            </Button>
        </>
    );
}
