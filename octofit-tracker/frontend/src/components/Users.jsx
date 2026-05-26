import { useEffect, useState } from 'react';

const getUsersEndpoint = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  return codespaceName
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';
};

const toCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
};

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch(getUsersEndpoint());
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        const payload = await response.json();
        setUsers(toCollection(payload));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <article>
      <h2>Users</h2>
      {loading && <p>Loading users...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ul>
          {users.map((user) => (
            <li key={user._id || user.id || user.email}>{user.name || user.email || 'Unknown user'}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default Users;
