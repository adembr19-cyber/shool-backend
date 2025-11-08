require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // Start background jobs
    try {
      const startReminderJob = require('./jobs/reminderJob');
      startReminderJob();
      console.log('Reminder job scheduled');
    } catch (err) {
      console.warn('Could not start reminder job', err.message);
    }
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
