const mentoringRepository = require("../repositories/mentoring.repository");
const userRepository = require("../repositories/user.repository");
const { mentoringSchema } = require("../validations/mentoring.validation");

module.exports = {
  async getMentoring(_, res) {
    try {
      const mentoring = await mentoringRepository.getAllMentoring();
      res.status(200).json(mentoring);
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async getMentoringById(req, res) {
    try {
      const { id } = req.params;
      const mentoring = await mentoringRepository.getMentoringById(id);
      if (!mentoring) return res.status(404).send('Mentoria não encontrada!');
      res.status(200).json(mentoring);
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async createMentoring(req, res) {
    try {
        const mentoringData = mentoringSchema.parse(req.body);
        mentoringData.teacher_id = mentoringData.teacher_id || req.user.user_id;

        const teacher = await userRepository.getTeacherById(mentoringData.teacher_id);
        if(!teacher) return res.status(404).send("Este usuário não é um professor, tente novamente!");
        
        const mentoring = await mentoringRepository.createMentoring(mentoringData);

        res.status(201).json(mentoring);
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async updateMentoring(_, res) {
    try {
        return res.status(204).json();
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async deleteMentoring(_, res) {
    try {
        return res.status(204).json();
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async addLikeMentoring(_, res) {
    try {
        return res.status(204).json();
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async removeLikeMentoring(_, res) {
    try {
        return res.status(204).json();
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
};
