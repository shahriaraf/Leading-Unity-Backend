const mongoose = require('mongoose');

const appSettingsSchema = mongoose.Schema({
  isStudentRegistrationOpen: { type: Boolean, default: false },
});

const AppSettings = mongoose.model('AppSettings', appSettingsSchema);
module.exports = AppSettings;