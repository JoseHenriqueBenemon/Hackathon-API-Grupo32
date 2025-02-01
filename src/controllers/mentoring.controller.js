const mentoringService = require("../services/mentoring.service");

module.exports = {
  getMentoring: mentoringService.getMentoring,
  getMentoringById: mentoringService.getMentoringById,
  createMentoring: mentoringService.createMentoring,
  updateMentoring: mentoringService.updateMentoring,
  deleteMentoring: mentoringService.deleteMentoring,
  addLikeMentoring: mentoringService.addLikeMentoring,
  removeLikeMentoring: mentoringService.removeLikeMentoring,
};