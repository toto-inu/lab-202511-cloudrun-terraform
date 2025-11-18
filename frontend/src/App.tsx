import { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { type User } from 'firebase/auth';
import { apolloClient } from './apollo';
import { Auth } from './components/Auth';
import { TodoList } from './components/TodoList';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <ApolloProvider client={apolloClient}>
      <div className="app">
        <header className="app-header">
          <h1>📝 Todo App with Firebase Auth</h1>
          <Auth onAuthChange={setUser} />
        </header>
        <main className="app-main">
          <TodoList user={user} />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;
