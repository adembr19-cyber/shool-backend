const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');

// Create lesson (admin or teacher)
router.post('/', auth, role(['admin','teacher']), upload.array('files', 6), lessonController.createLesson);
// List lessons (any authenticated user)
router.get('/', auth, lessonController.listLessons);
// Delete lesson (admin or lesson's teacher)
router.delete('/:id', auth, lessonController.deleteLesson);

module.exports = router;
