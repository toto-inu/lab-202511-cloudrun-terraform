import { signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useState, useEffect } from 'react';

interface AuthProps {
  onAuthChange: (user: User | null) => void;
}

export function Auth({ onAuthChange }: AuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      onAuthChange(user);
    });

    return () => unsubscribe();
  }, [onAuthChange]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to login. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return <div className="auth-container">Loading...</div>;
  }

  return (
    <div className="auth-container">
      {user ? (
        <div className="user-info">
          <img src={user.photoURL || ''} alt="User avatar" className="avatar" />
          <span className="user-name">{user.displayName}</span>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="btn btn-primary">
          Sign in with Google
        </button>
      )}
    </div>
  );
}
