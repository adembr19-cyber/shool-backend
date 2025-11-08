const School = require('../models/School');

exports.getSchool = async (req, res, next) => {
  try {
    let school = await School.findOne();
    if (!school) {
      // return empty default
      return res.json({ name: '', address: '', contactEmail: '', info: '' });
    }
    res.json(school);
  } catch (err) { next(err); }
};

exports.updateSchool = async (req, res, next) => {
  try {
    let school = await School.findOne();
    if (!school) {
      school = new School(req.body);
    } else {
      Object.assign(school, req.body);
    }
    await school.save();
    res.json(school);
  } catch (err) { next(err); }
};
