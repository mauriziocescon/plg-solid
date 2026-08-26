import { Title } from '@solidjs/meta';
import Counter from '../components/Counter';

export default function Home() {
    return (
        <main>
            <Title>Home - Solid App</Title>
            <h1>Hello Solid!</h1>
            <Counter />
        </main>
    );
}
