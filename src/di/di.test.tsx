import { render } from '@solidjs/testing-library';
import { describe, expect, test, vi } from 'vitest';

import { createToken, inject, Provide, ProvideFactory } from './di';

describe('di', () => {
    test('inject() resolves a provided value', () => {
        const TOKEN = createToken<string>('Greeting');

        function Consumer() {
            return <p>{inject(TOKEN)}</p>;
        }

        const { getByText } = render(() => (
            <Provide token={TOKEN} value="hello">
                <Consumer />
            </Provide>
        ));

        expect(getByText('hello')).toBeInTheDocument();
    });

    test('inject() throws a named error when no provider exists', () => {
        const TOKEN = createToken<string>('Missing');

        function Consumer() {
            return <p>{inject(TOKEN)}</p>;
        }

        // Solid surfaces render errors on the console; silence it for this case.
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(() => <Consumer />)).toThrowError(
            /No provider found for token "Missing"/,
        );
        spy.mockRestore();
    });

    test('a service can inject another service at construction', () => {
        // Dependency
        class HttpClient {
            get(path: string) {
                return `GET ${path}`;
            }
        }
        const HTTP = createToken<HttpClient>('HttpClient');

        // Dependent service that injects HTTP in its constructor (field initializer).
        class UserService {
            private http = inject(HTTP);
            load(id: string) {
                return this.http.get(`/users/${id}`);
            }
        }
        const USER_SERVICE = createToken<UserService>('UserService');

        function Consumer() {
            const users = inject(USER_SERVICE);
            return <p>{users.load('42')}</p>;
        }

        const { getByText } = render(() => (
            <ProvideFactory token={HTTP} factory={() => new HttpClient()}>
                <ProvideFactory token={USER_SERVICE} factory={() => new UserService()}>
                    <Consumer />
                </ProvideFactory>
            </ProvideFactory>
        ));

        expect(getByText('GET /users/42')).toBeInTheDocument();
    });
});
