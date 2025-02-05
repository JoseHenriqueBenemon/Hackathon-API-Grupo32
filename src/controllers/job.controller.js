const jobService = require('../services/jobs.service');

module.exports = {
  getAllJobs: jobService.getAllJobs,
  getJobById: jobService.getJobById,
  createJob: jobService.createJob,
  updateJob: jobService.updateJob,
  deleteJob: jobService.deleteJob,
};