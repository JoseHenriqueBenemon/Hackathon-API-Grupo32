const express = require('express');
const router = express.Router();
const { authenticate, authorize, authorizeStudentOrSelf } = require('../middlewares/auth.middleware');
const mentoringController = require("../controllers/mentoring.controller");

router.get('/', authenticate, mentoringController.getMentoring);
router.get('/:id', authenticate, mentoringController.getMentoringById);
router.get('/:id/like', authenticate, mentoringController.addLikeMentoring);
router.get('/:id/dislike', authenticate, mentoringController.removeLikeMentoring);
router.get('/:id/count', authenticate, mentoringController.countLikesMentoring)
router.post('/', authenticate, authorize('Teacher'), mentoringController.createMentoring);
router.put('/:id', authenticate, authorize('Teacher'), authorizeStudentOrSelf, mentoringController.updateMentoring);
router.delete('/:id', authenticate, authorize('Teacher'), mentoringController.deleteMentoring);

module.exports = router;