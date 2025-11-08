const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datetime: { type: Date, required: true },
  recordingUrl: { type: String },
  files: [
    {
      filename: String,
      url: String,
      size: Number,
      mimeType: String,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Lesson', LessonSchema);
