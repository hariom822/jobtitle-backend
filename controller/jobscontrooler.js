const jobmodel = require('../model/jobsmodel');

// exports.addjob = async (req, res) => {
//     try {
//         const job = new jobmodel(req.body);
//         console.log(">>>req.body", req.body)
//         console.log(">>>job", job)
        
//         await job.save();
//        return res.status(201).json(job);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };
exports.addjob = async (req, res) => {
    try {

        const {
            title,
            description,
            location,
            salary,
            jobtype,
            experience,
            companyid
        } = req.body;

        // required validation
        if (!title || !description || !location || !salary || !jobtype || !experience || !companyid) {
            return res.status(400).json({
                message: "Required fields missing"
            });
        }

        const job = new jobmodel(req.body);

        await job.save();

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.alljob = async (req, res) => {
    try {

        const { location, jobtype } = req.query;

        let filter = {};

        if (location) filter.location = location;
        if (jobtype) filter.jobtype = jobtype;

        const jobs = await jobmodel
            .find(filter)
            .populate('companyid');

        res.json(jobs);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.onejob = async (req, res) => {
    try {
        const job = await jobmodel.findById(req.params.id).populate('companyid');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMyJobs = async (req, res) => {
    try {
        console.log(">>>req.params.id", req.params.id)
        const jobs = await jobmodel.find({ companyid: req.params.id }).populate('companyid');
        console.log(">>>jobs", jobs)
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// exports.updatejob = async (req, res) => {
//     try {
//         const job = await jobmodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!job) return res.status(404).json({ message: 'Job not found' });
//         res.json(job);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };
exports.updatejob = async (req, res) => {
    try {

        const job = await jobmodel.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json({
            message: "Job updated",
            job
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deletejob = async (req, res) => {
    try {
        const job = await jobmodel.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};