const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const jobController = require("../controllers/job.controller");

router.get('/', authenticate, jobController.getAllJobs);
router.get('/:id', authenticate, jobController.getJobById);
router.post('/', authenticate, authorize('Teacher'), jobController.createJob);
router.put('/:id', authenticate, authorize('Teacher'), jobController.updateJob);
router.delete('/:id', authenticate, authorize('Teacher'), jobController.deleteJob);

module.exports = router;