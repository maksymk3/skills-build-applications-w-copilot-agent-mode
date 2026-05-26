import express from 'express';
import cors from 'cors';
import { User } from './models/User';
import { Team } from './models/Team';
import { Activity } from './models/Activity';
import { Workout } from './models/Workout';
import { connectDatabase } from './config/database';

const app = express();
app.use(cors());
app.use(express.json());

const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const apiUrl =
  process.env.API_URL ||
  (codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`);

connectDatabase().catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', apiUrl });
});

app.get('/api/config', (_req, res) => {
  res.json({ apiUrl, port, codespaceName: codespaceName || null });
});

app.get('/api/users/', async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to load users' });
  }
});

app.post('/api/users/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
});

app.get('/api/teams/', async (_req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to load teams' });
  }
});

app.post('/api/teams/', async (req, res) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
});

app.get('/api/activities/', async (_req, res) => {
  try {
    const activities = await Activity.find().populate('teamId');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to load activities' });
  }
});

app.post('/api/activities/', async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
});

app.get('/api/workouts/', async (_req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to load workouts' });
  }
});

app.post('/api/workouts/', async (req, res) => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
});

app.get('/api/leaderboard/', async (_req, res) => {
  try {
    const leaderboard = await Activity.aggregate([
      {
        $group: {
          _id: '$teamId',
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$calories' },
          activityCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: '_id',
          foreignField: '_id',
          as: 'team',
        },
      },
      { $unwind: '$team' },
      {
        $project: {
          teamId: '$_id',
          teamName: '$team.name',
          totalDuration: 1,
          totalCalories: 1,
          activityCount: 1,
        },
      },
      { $sort: { totalCalories: -1, totalDuration: -1 } },
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to build leaderboard' });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on http://0.0.0.0:${port}`);
  console.log(`Configured API URL: ${apiUrl}`);
});
