const jobmodel = require('../model/jobsmodel');

const addjob = async (req, res) => {
    try {
        const job = new jobmodel(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const alljob = async (req, res) => {
    try {
        const jobs = await jobmodel.find().populate('companyid');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const onejob = async (req, res) => {
    try {
        const job = await jobmodel.findById(req.params.id).populate('companyid');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatejob = async (req, res) => {
    try {
        const job = await jobmodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deletejob = async (req, res) => {
    try {
        const job = await jobmodel.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addjob, alljob, onejob, updatejob, deletejob };