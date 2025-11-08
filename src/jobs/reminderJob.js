const cron = require('node-cron');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const mailer = require('../utils/mailer');

// Runs every hour and sends reminders for lessons happening in the next 24 hours
module.exports = function startReminderJob() {
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const next24 = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const lessons = await Lesson.find({ datetime: { $gte: now, $lte: next24 } }).populate('teacher');
      for (const lesson of lessons) {
        // In a real system we would have enrolled students; here we email the teacher as an example
        const to = lesson.teacher && lesson.teacher.email ? lesson.teacher.email : process.env.SMTP_TEST_TO;
        if (!to) continue;
        const subject = `Reminder: upcoming lesson "${lesson.title}"`;
        const text = `Dear ${lesson.teacher.name || 'Teacher'},\n\nYou have a lesson scheduled at ${lesson.datetime}.\n\nTitle: ${lesson.title}\n\nRegards`;
        await mailer.sendMail({ to, subject, text });
      }
    } catch (err) {
      console.error('Reminder job failed', err);
    }
  });
};
