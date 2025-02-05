const mentoringRepository = require("../repositories/mentoring.repository");
const userRepository = require("../repositories/user.repository");
const { mentoringSchema, getMentoringSchema } = require("../validations/mentoring.validation");

module.exports = {
  async getMentoring(req, res) {
    try {
      const { page, limit } = getMentoringSchema.parse(req.query);
      const obj = await mentoringRepository.getAllMentoring(page, limit, req.user.user_id);
      res.status(200).json(obj);
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async getMentoringById(req, res) {
    try {
      const { id } = req.params;
      const mentoring = await mentoringRepository.getMentoringById(id, req.user.user_id);
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

        const [teacher] = await userRepository.getTeacherById(mentoringData.teacher_id);
        if(!teacher) return res.status(404).send("Este usuário não é um professor, tente novamente!");
        
        if(teacher){
          if(!teacher.is_mentored) return res.status(401).send("Este professor não pode ter mentorias! Altere o perfil!");
        }
        
        const mentoring = await mentoringRepository.createMentoring(mentoringData);

        res.status(201).json(mentoring);
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async updateMentoring(req, res) {
    try {
      const { id } = req.params;

      const mentoring = await mentoringRepository.getMentoringById(id);
      if (!mentoring) return res.status(404).send("Mentoria não encontrada!");

      const mentoringData = mentoringSchema.partial().parse(req.body);

      await mentoringRepository.updateMentoring(id, mentoringData);
      res.status(200).send("Mentoria alterada com sucesso!");
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async deleteMentoring(req, res) {
    try {
      const { id } = req.params;

      const mentoring = await mentoringRepository.getMentoringById(id);
      if (!mentoring) return res.status(404).send("Mentoria não encontrada!");

      await mentoringRepository.deleteMentoring(id);
      res.status(200).send("Mentoria deletada com sucesso!");
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async addLikeMentoring(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.user_id;

      const mentoring = await mentoringRepository.getMentoringById(id);
      if (!mentoring) return res.status(404).send("Mentoria não encontrada!");

      const student = await userRepository.getStudentById(user_id);
      if (!student) return res.status(403).send("O usuário logado não é um aluno!");

      const likesData = {
        mentoring_id: id,
        student_id: user_id
      };

      const existingLike = await mentoringRepository.verifyLikeMentoring(likesData);

      if (existingLike) {
          return res.status(400).send("Você já curtiu essa mentoria!");
      }

      await mentoringRepository.addLikeMentoring(likesData);
      res.status(204).send();
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async removeLikeMentoring(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.user_id;

      const mentoring = await mentoringRepository.getMentoringById(id);
      if (!mentoring) return res.status(404).send("Mentoria não encontrada!");

      const student = await userRepository.getStudentById(user_id);
      if (!student) return res.status(403).send("O usuário logado não é um aluno!");

      const likesData = {
        mentoring_id: id,
        student_id: user_id
      };

      const existingLike = await mentoringRepository.verifyLikeMentoring(likesData);
      
      if (!existingLike) {
          return res.status(400).send("Você ainda não curtiu essa mentoria!");
      }

      await mentoringRepository.removeLikeMentoring(likesData);

      res.status(204).send();
    } catch (err) {
      res.status(400).send(err.errors || err.message);
    }
  },
  async countLikesMentoring(req, res) {
    try {
      const { id } = req.params;

      const mentoring = await mentoringRepository.getMentoringById(id);
      if (!mentoring) return res.status(404).send("Mentoria não encontrada!");

      const likes = await mentoringRepository.countLikesMentoring(id);
      res.status(200).json({ likes: likes});
    } catch (err) {
      res.status(400).send(err.errors || err.message)
    }
  }
};
