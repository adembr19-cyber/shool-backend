const multer = require('multer');

// Use memory storage; storage handler will decide where to persist
const storage = multer.memoryStorage();

// Accept only common document/video types
const fileFilter = (req, file, cb) => {
	const allowed = [ 'application/pdf', 'video/mp4', 'video/mpeg', 'video/quicktime', 'image/jpeg', 'image/png' ];
	if (allowed.includes(file.mimetype)) cb(null, true);
	else cb(new Error('Invalid file type'), false);
};

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024, files: 10 }, fileFilter });

module.exports = upload;
