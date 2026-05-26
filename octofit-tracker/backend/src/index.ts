import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { User } from './models/User';

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit';
mongoose.set('strictQuery', true);

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected to', mongoUri))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
});

const port = Number(process.env.PORT || 8000);
app.listen(port, () => {
  console.log(`Backend listening on http://0.0.0.0:${port}`);
});
