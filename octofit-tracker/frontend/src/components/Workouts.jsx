import { useEffect, useState } from 'react';

const getWorkoutsEndpoint = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  return codespaceName
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';
};

const toCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
};

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const response = await fetch(getWorkoutsEndpoint());
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        const payload = await response.json();
        setWorkouts(toCollection(payload));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  return (
    <article>
      <h2>Workouts</h2>
      {loading && <p>Loading workouts...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ul>
          {workouts.map((workout) => (
            <li key={workout._id || workout.id || workout.name}>
              {workout.name || 'Unnamed workout'}
              {typeof workout.durationMinutes === 'number' ? ` - ${workout.durationMinutes} min` : ''}
              {workout.intensity ? ` - ${workout.intensity}` : ''}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default Workouts;
