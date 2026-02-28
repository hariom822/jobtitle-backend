const companiemodel = require('../model/companiymodel');

exports.addcompanie = async (req, res) => {
    try {
        const { companiename, email, phone, password, companydescription, companyaddress } = req.body;
        if (!companiename || !email) {
            return res.status(400).json({ error: 'Companie name and email are required' });
        }
        const newCompanie = new companiemodel({
            companiename,
            email,
            phone,
            password,
            companydescription,
            companyaddress
        });
        const savedCompanie = await newCompanie.save();
        res.status(201).json(savedCompanie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add companie' });
    }
};

exports.allcompanie = async (req, res) => {
    try {
        const companies = await companiemodel.find();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch companies' });
    }
};
exports.onecompanie = async (req, res) => {
    try {
        const companie = await companiemodel.findById(req.params.id);   
        if (!companie) {
            return res.status(404).json({ error: 'Companie not found' });
        }
        res.status(200).json(companie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch companie' });
    }
};
exports.updatecompanie = async (req, res) => {
    try {
        const updatedCompanie = await companiemodel.findByIdAndUpdate
            (req.params.id, req.body
                , { new: true });
        if (!updatedCompanie) {
            return res.status(404).json({ error: 'Companie not found' });
        }
        res.status(200).json(updatedCompanie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update companie' });
    }
};
exports.deletecompanie = async (req, res) => {
    try {
        const deletedCompanie = await companiemodel.findByIdAndDelete(req.params.id);
        if (!deletedCompanie) {
            return res.status(404).json({ error: 'Companie not found' });
        }
        res.status(200).json({ message: 'Companie deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete companie' });
    }
};
