const AppSettings = require('../models/appSettingsModel');

const getSettings = async (req, res) => {
    let settings = await AppSettings.findOne();
    if(!settings) { // If no settings doc exists, create one
        settings = await AppSettings.create({ isStudentRegistrationOpen: false });
    }
    res.json(settings);
};

const toggleRegistration = async (req, res) => {
    let settings = await AppSettings.findOne();
    if (settings) {
        settings.isStudentRegistrationOpen = !settings.isStudentRegistrationOpen;
        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } else { // In case it was never created
        const newSettings = await AppSettings.create({ isStudentRegistrationOpen: true });
        res.json(newSettings);
    }
};

module.exports = { getSettings, toggleRegistration };