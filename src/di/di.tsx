import { type Context, createContext, useContext } from 'solid-js';
// oxlint-disable-next-line solid/imports -- JSX is re-exported from the jsxImportSource in Solid 2.0.
import { Dynamic, type JSX } from '@solidjs/web';

/** Unique per-token sentinel: lets us detect "no provider" even for `undefined` values. */
const MISSING = Symbol('di.missing');

/**
 * A typed injection token — the Solid analogue of an Angular DI token.
 *
 * Identity is carried by the underlying Solid context; `name` exists only to
 * produce a helpful error when no provider is found.
 */
export interface InjectionToken<T> {
    readonly name: string;
    readonly context: Context<T | typeof MISSING>;
}

/** Creates a typed token. Analogous to `new InjectionToken<T>('name')` in Angular. */
export function createToken<T>(name: string): InjectionToken<T> {
    return {
        name,
        // Default to the sentinel so `inject` can distinguish "not provided"
        // from a legitimately provided `undefined`/`null` value.
        context: createContext<T | typeof MISSING>(MISSING),
    };
}

/**
 * Resolves the value provided for `token`, walking up the component tree.
 *
 * Like Angular's `inject()`, this must be called during setup — i.e. while a
 * component (or a factory passed to {@link ProvideFactory}) is executing. The
 * resolved value should be captured then (e.g. in a class field), not looked up
 * later from an async callback or event handler, where the context stack is gone.
 *
 * Throws if no ancestor provided the token, instead of silently returning a default.
 */
export function inject<T>(token: InjectionToken<T>): T {
    const value = useContext(token.context);
    if (value === MISSING) {
        throw new Error(`[di] No provider found for token "${token.name}".`);
    }
    return value;
}

/**
 * Provides an already-constructed `value` for `token` to descendants.
 *
 * Use this for values that don't themselves need to `inject()` anything.
 */
export function Provide<T>(props: {
    token: InjectionToken<T>;
    value: T;
    children: JSX.Element;
}): JSX.Element {
    // In Solid 2.0 the context object is itself the provider component;
    // <Dynamic> renders it from a prop while keeping reactivity tracked.
    return (
        <Dynamic component={props.token.context} value={props.value}>
            {props.children}
        </Dynamic>
    );
}

/**
 * Provides a value built lazily by `factory`, which runs during this component's
 * render. Because the factory executes in render context, it may itself call
 * {@link inject} to resolve dependencies — enabling service-into-service injection.
 *
 * Ordering constraint: a dependency's provider must be an ancestor of the
 * `ProvideFactory` that constructs the dependent service.
 */
export function ProvideFactory<T>(props: {
    token: InjectionToken<T>;
    factory: () => T;
    children: JSX.Element;
}): JSX.Element {
    // factory() runs during render → inject() inside it resolves against this owner.
    return (
        <Dynamic component={props.token.context} value={props.factory()}>
            {props.children}
        </Dynamic>
    );
}
