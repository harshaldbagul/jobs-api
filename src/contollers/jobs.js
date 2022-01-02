const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')


const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user._id });
    res.status(StatusCodes.OK).send({ jobs });
}

const getJob = async (req, res) => {
    const job = await Job.findOne({ createdBy: req.user._id, _id: req.params.id });
    res.status(StatusCodes.OK).send({ job });
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user._id;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).send({ job });
}

const updateJob = async (req, res) => {
    const job = await Job.updateOne({ createdBy: req.user._id, _id: req.params.id }, req.body);
    res.status(StatusCodes.OK).send({ job });
}

const deleteJob = async (req, res) => {
    const job = await Job.findOneAndDelete({ createdBy: req.user._id, _id: req.params.id });
    res.status(StatusCodes.OK).send({ job });
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
};