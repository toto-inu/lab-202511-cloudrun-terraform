import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { type User } from 'firebase/auth';

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      description
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      title
      description
      completed
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!, $input: UpdateTodoInput!) {
    updateTodo(id: $id, input: $input) {
      id
      title
      description
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: String!) {
    removeTodo(id: $id)
  }
`;

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface TodoListProps {
  user: User | null;
}

export function TodoList({ user }: TodoListProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const { loading, error, data, refetch } = useQuery(GET_TODOS);
  const [createTodo] = useMutation(CREATE_TODO, {
    onCompleted: () => {
      refetch();
      setNewTitle('');
      setNewDescription('');
    },
    onError: (error) => {
      alert(`Failed to create todo: ${error.message}`);
    },
  });

  const [updateTodo] = useMutation(UPDATE_TODO, {
    onCompleted: () => {
      refetch();
      setEditingId(null);
    },
    onError: (error) => {
      alert(`Failed to update todo: ${error.message}`);
    },
  });

  const [deleteTodo] = useMutation(DELETE_TODO, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      alert(`Failed to delete todo: ${error.message}`);
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (!user) {
      alert('Please sign in to create todos');
      return;
    }

    await createTodo({
      variables: {
        input: {
          title: newTitle,
          description: newDescription || undefined,
        },
      },
    });
  };

  const handleToggle = async (todo: Todo) => {
    if (!user) {
      alert('Please sign in to update todos');
      return;
    }

    await updateTodo({
      variables: {
        id: todo.id,
        input: {
          completed: !todo.completed,
        },
      },
    });
  };

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const handleUpdate = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to update todos');
      return;
    }

    await updateTodo({
      variables: {
        id,
        input: {
          title: editTitle,
          description: editDescription || undefined,
        },
      },
    });
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      alert('Please sign in to delete todos');
      return;
    }

    if (!confirm('Are you sure you want to delete this todo?')) return;

    await deleteTodo({
      variables: { id },
    });
  };

  // Test function: Send authenticated request without token (for debugging)
  const handleTestUnauthorized = async () => {
    console.log('🔍 Testing unauthorized request...');
    console.log('Current user:', user ? 'Logged in' : 'Not logged in');

    try {
      await createTodo({
        variables: {
          input: {
            title: 'Unauthorized Test',
            description: 'This request should fail with 401',
          },
        },
      });
      console.log('✅ Request succeeded (unexpected!)');
    } catch (error: any) {
      console.log('❌ Request failed (expected):', error.message);
      console.log('Error details:', error);
      alert(`Expected error occurred!\n\nError: ${error.message}\n\nCheck the Network tab in DevTools to see the 401 response.`);
    }
  };

  if (loading) return <div className="loading">Loading todos...</div>;
  if (error) return <div className="error">Error loading todos: {error.message}</div>;

  const todos: Todo[] = data?.todos || [];

  return (
    <div className="todo-list">
      <h2>Todo List</h2>

      {/* Debug Section: Test unauthorized request */}
      {!user && (
        <div className="debug-section" style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>🔍 Debug Mode</h3>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
            Test authentication error by sending a request without credentials.
          </p>
          <button
            onClick={handleTestUnauthorized}
            className="btn"
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Test Unauthorized Request (Check Network Tab)
          </button>
        </div>
      )}

      {user && (
        <form onSubmit={handleCreate} className="todo-form">
          <h3>Create New Todo</h3>
          <input
            type="text"
            placeholder="Title *"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Add Todo
          </button>
        </form>
      )}

      <div className="todos">
        {todos.length === 0 ? (
          <p className="empty-message">No todos yet. Create one!</p>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editingId === todo.id ? (
                <form onSubmit={(e) => handleUpdate(e, todo.id)} className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <div className="edit-actions">
                    <button type="submit" className="btn btn-success">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                      disabled={!user}
                    />
                    <div className="todo-text">
                      <h4>{todo.title}</h4>
                      {todo.description && <p>{todo.description}</p>}
                    </div>
                  </div>
                  {user && (
                    <div className="todo-actions">
                      <button onClick={() => handleEdit(todo)} className="btn btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(todo.id)} className="btn btn-delete">
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
