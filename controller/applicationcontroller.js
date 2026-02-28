const application = require('../model/Applcationmodel');

const addapplication = async (req, res) => {
    try {
        const { userId, jobId, resume, coverLetter } = req.body;
        const newApplication = new application({
            userId,
            jobId,
            resume,
            coverLetter
        });
        await newApplication.save();
        res.status(201).json({ message: 'Application added successfully', application: newApplication });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const allapplication = async (req, res) => {
    try {
        const applications = await application.find().populate('userId').populate('jobId');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const oneapplication = async (req, res) => {
    try {
        const app = await application.findById(req.params.id).populate('userId').populate('jobId');
        if (!app) return res.status(404).json({ message: 'Application not found' });
        res.json(app);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateapplication = async (req, res) => {
    try {
        const { userId, jobId, status, resume, coverLetter } = req.body;
        const updatedApp = await application.findByIdAndUpdate(
            req.params.id,
            { userId, jobId, status, resume, coverLetter },
            { new: true }
        ).populate('userId').populate('jobId');
        if (!updatedApp) return res.status(404).json({ message: 'Application not found' });
        res.json(updatedApp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteapplication = async (req, res) => {
    try {
        const deletedApp = await application.findByIdAndDelete(req.params.id);
        if (!deletedApp) return res.status(404).json({ message: 'Application not found' });
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addapplication, allapplication, oneapplication, updateapplication, deleteapplication };