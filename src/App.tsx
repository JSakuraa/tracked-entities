import { EntityList } from './components/EntityList';

export function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1>Tracked Entities</h1>
      </header>
      <EntityList />
    </main>
  );
}
