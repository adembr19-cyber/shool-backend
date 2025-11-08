const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const STORAGE = process.env.STORAGE || 'local';

if (STORAGE === 's3') {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  var s3 = new AWS.S3();
}

module.exports.saveFile = async function(file) {
  if (STORAGE === 's3') {
    const Key = `${Date.now()}-${file.originalname}`;
    const params = { Bucket: process.env.AWS_S3_BUCKET, Key, Body: file.buffer, ContentType: file.mimetype };
    const data = await s3.upload(params).promise();
    return data.Location;
  }

  // Local storage
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const filename = `${Date.now()}-${file.originalname}`.replace(/\s+/g, '_');
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, file.buffer);
  // Return relative URL path
  return `/uploads/${filename}`;
};
