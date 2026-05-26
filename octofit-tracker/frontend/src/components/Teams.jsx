import { useEffect, useState } from 'react';

const getTeamsEndpoint = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  return codespaceName
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';
};

const toCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
};

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await fetch(getTeamsEndpoint());
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        const payload = await response.json();
        setTeams(toCollection(payload));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load teams');
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  return (
    <article>
      <h2>Teams</h2>
      {loading && <p>Loading teams...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ul>
          {teams.map((team) => (
            <li key={team._id || team.id || team.name}>
              {team.name || 'Unnamed team'}
              {typeof team.score === 'number' ? ` (score: ${team.score})` : ''}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default Teams;
