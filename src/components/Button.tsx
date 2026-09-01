import { omit, ParentProps, Ref } from 'solid-js';
import { JSX } from '@solidjs/web';
import './Button.css';

export type ButtonProps = ParentProps<
    JSX.ButtonHTMLAttributes<HTMLButtonElement> &
    { ref?: Ref<HTMLButtonElement> }
>;

export default function Button(props: ButtonProps) {
    // `omit` returns a reactive view of `props` without the listed keys,
    // so spreading `rest` keeps every native attribute reactive.
    const rest = omit(props, 'ref', 'class', 'type', 'children');

    return (
        <button
            {...rest}
            class={`increment ${props.class ?? ''}`.trim()}
            ref={[props.ref]}
            type={props.type ?? 'button'}>
            {props.children}
        </button>
    );
}
