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

function backgroundColor(color: string = 'red') {
    const [el, setEl] = createSignal<HTMLElement>();

    // Setup phase (owned): apply the color and restore the previous value on cleanup.
    createEffect(
        () => el(),
        (node) => {
            if (!node) return;
            const previous = node.style.backgroundColor;
            node.style.backgroundColor = color;
            return () => {
                node.style.backgroundColor = previous;
            };
        },
    );

    // Apply phase (unowned): just hand the element to setup.
    return (node: HTMLElement) => setEl(node);
}

export default function Counter() {
    const [count, setCount] = createSignal(0);
    const [active, setActive] = createSignal(true);

    const behaviours = [
        // clickOutside(() => alert('Yeah!')),
        // clickOutside(() => setActive(false)),
        backgroundColor(),
    ];

    return (
        <>
            {active() && <p>Active! Click outside to dismiss.</p>}

            <Button
                ref={behaviours}
                style="background-color: pink"
                class="btn-variant">
                Clicks: {count()}
            </Button>

            <Button
                style="background-color: pink"
                class="btn-variant">
                Click me!
            </Button>

            <Button
                class="btn-variant">
                Click me!
            </Button>

            <Button>
                Click me!
            </Button>
        </>
    );
}
