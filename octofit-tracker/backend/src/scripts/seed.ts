import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/User';
import { Team } from '../models/Team';
import { Activity } from '../models/Activity';
import { Workout } from '../models/Workout';

const seed = async (): Promise<void> => {
  // Seed the octofit_db database with test data
  console.log('Seed the octofit_db database with test data');

  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const users = await User.insertMany([
    { name: 'Ava Reed', email: 'ava.reed@example.com' },
    { name: 'Liam Chen', email: 'liam.chen@example.com' },
    { name: 'Noah Ortiz', email: 'noah.ortiz@example.com' },
  ]);

  const teams = await Team.insertMany([
    { name: 'Octo Sprinters', members: users.map((user) => user.name), score: 120 },
    { name: 'Pulse Crew', members: [users[0].name, users[2].name], score: 95 },
  ]);

  await Activity.insertMany([
    {
      userId: users[0]._id.toString(),
      teamId: teams[0]._id,
      type: 'run',
      duration: 35,
      calories: 320,
    },
    {
      userId: users[1]._id.toString(),
      teamId: teams[0]._id,
      type: 'cycling',
      duration: 45,
      calories: 420,
    },
    {
      userId: users[2]._id.toString(),
      teamId: teams[1]._id,
      type: 'yoga',
      duration: 30,
      calories: 180,
    },
  ]);

  await Workout.insertMany([
    {
      name: 'Morning Momentum',
      description: 'A steady cardio starter to kick off the day.',
      durationMinutes: 25,
      intensity: 'medium',
    },
    {
      name: 'Power Intervals',
      description: 'Short high-intensity intervals with active recovery.',
      durationMinutes: 30,
      intensity: 'high',
    },
    {
      name: 'Recovery Flow',
      description: 'Mobility-focused cool-down routine.',
      durationMinutes: 20,
      intensity: 'low',
    },
  ]);

  console.log('Seed complete');
  await disconnectDatabase();
};

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await disconnectDatabase();
  process.exit(1);
});
