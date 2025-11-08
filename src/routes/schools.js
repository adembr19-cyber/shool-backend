const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// View school info (any authenticated user)
router.get('/', auth, schoolController.getSchool);
// Edit school info (admin only)
router.put('/', auth, role(['admin']), schoolController.updateSchool);
module.exports = router;
