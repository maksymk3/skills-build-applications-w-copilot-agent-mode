import { useEffect, useState } from 'react';

const getLeaderboardEndpoint = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  return codespaceName
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';
};

const toCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
};

function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const response = await fetch(getLeaderboardEndpoint());
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        const payload = await response.json();
        setRows(toCollection(payload));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  return (
    <article>
      <h2>Leaderboard</h2>
      {loading && <p>Loading leaderboard...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ol>
          {rows.map((row) => (
            <li key={row.teamId || row._id || row.teamName}>
              {row.teamName || 'Unknown team'}
              {typeof row.totalCalories === 'number' ? ` - ${row.totalCalories} cal` : ''}
              {typeof row.totalDuration === 'number' ? ` - ${row.totalDuration} min` : ''}
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

export default Leaderboard;
