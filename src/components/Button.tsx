import { createMemo, omit, ParentProps, Ref } from 'solid-js';
import { JSX } from '@solidjs/web';
import './Button.css';

export type ButtonProps = ParentProps<
    JSX.ButtonHTMLAttributes<HTMLButtonElement> &
    { ref?: Ref<HTMLButtonElement> }
>;

export default function Button(props: ButtonProps) {
    // `omit` returns a reactive view of `props` without the listed keys,
    // so spreading `rest` keeps every native attribute reactive.
    const rest = omit(props, 'ref', 'style', 'class', 'children');
    const derivedStyle = createMemo(() => `${props.style}; font-size: 1.1rem;`);
    const derivedClass = createMemo(() => `btn ${props.class}`);

    return (
        <button
            {...rest}
            ref={[props.ref]}
            style={derivedStyle()}
            class={derivedClass()}>
            {props.children}
        </button>
    );
}
