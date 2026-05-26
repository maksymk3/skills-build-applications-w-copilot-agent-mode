import { useEffect, useState } from 'react';

const getActivitiesEndpoint = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  return codespaceName
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';
};

const toCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
};

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await fetch(getActivitiesEndpoint());
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        const payload = await response.json();
        setActivities(toCollection(payload));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  return (
    <article>
      <h2>Activities</h2>
      {loading && <p>Loading activities...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ul>
          {activities.map((activity) => (
            <li key={activity._id || activity.id || `${activity.userId}-${activity.createdAt}`}>
              {activity.type || 'activity'}
              {typeof activity.duration === 'number' ? ` - ${activity.duration} min` : ''}
              {typeof activity.calories === 'number' ? ` - ${activity.calories} cal` : ''}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default Activities;
