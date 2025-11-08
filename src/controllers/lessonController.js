const Lesson = require('../models/Lesson');
const storage = require('../utils/storage');

exports.createLesson = async (req, res, next) => {
  try {
    const { title, description, datetime } = req.body;
    if (!title || !datetime) return res.status(400).json({ message: 'title and datetime required' });

    // Teacher: use their own id; Admin can set teacher via body
    const teacherId = req.user.role === 'teacher' ? req.user.id : (req.body.teacher || req.user.id);

    const filesMeta = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const url = await storage.saveFile(file);
        filesMeta.push({ filename: file.originalname, url, size: file.size, mimeType: file.mimetype });
      }
    }

    const lesson = new Lesson({ title, description, teacher: teacherId, datetime: new Date(datetime), recordingUrl: req.body.recordingUrl, files: filesMeta });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (err) { next(err); }
};

exports.listLessons = async (req, res, next) => {
  try {
    // Pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.teacher) filter.teacher = req.query.teacher;
    if (req.query.from || req.query.to) filter.datetime = {};
    if (req.query.from) filter.datetime.$gte = new Date(req.query.from);
    if (req.query.to) filter.datetime.$lte = new Date(req.query.to);

    const [total, lessons] = await Promise.all([
      Lesson.countDocuments(filter),
      Lesson.find(filter).populate('teacher', 'name email').sort({ datetime: -1 }).skip(skip).limit(limit)
    ]);

    res.json({ total, page, limit, data: lessons });
  } catch (err) { next(err); }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    // Allow admin or the teacher who owns it
    if (req.user.role !== 'admin' && lesson.teacher.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await lesson.remove();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
