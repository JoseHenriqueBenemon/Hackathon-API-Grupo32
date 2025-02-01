const AppDataSource = require("../config/database");
const Mentoring = require("../models/mentoring/mentoring");

const mentoringRepository = AppDataSource.getRepository(Mentoring);

module.exports = {
    async getAllMentoring() {
        return mentoringRepository.find({ relations: ['teacher'] });
    },
    async getMentoringById(id) {
        return mentoringRepository.findOne({ where: { mentoring_id: id}, relations: ['teacher'] });
    },
    async createMentoring(mentoringData) {
        return mentoringRepository.save(mentoringData);
    },
    async updateMentoring(id, mentoringData) {
        return mentoringRepository.save({ where: { mentoring_id: id}, mentoringData });
    }, 
    async deleteMentoring(id) {
        return mentoringRepository.delete(id);
    },
    async addLikeMentoring(id) {
        return true;
    },
    async removeLikeMentoring(id) {
        return true;
    }
}