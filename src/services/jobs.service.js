const jobsRepository = require('../repositories/jobs.repository');
const userRepository = require('../repositories/user.repository');
const { getJobsSchema, jobSchema } = require('../validations/jobs.validation');

module.exports = { 
    async getAllJobs(req, res) {
        try {
            const { page, limit } = getJobsSchema.parse(req.query);
            const obj = await jobsRepository.getAllJobs(page, limit);
            res.status(200).send(obj);
        } catch (err) {
            res.status(400).send(err.errors || err.message);
        }
    },
    async getJobById(req, res) {
        try {
            const { id } = req.params;

            const job = await jobsRepository.getJobById(id);
            if (!job) return res.status(404).send("Vaga não encontrada!");

            res.status(200).send(job);
        } catch (err) {
            res.status(400).send(err.errors || err.message);
        }
    }, 
    async createJob(req, res) {
        try {
            const jobData = jobSchema.parse(req.body);
            jobData.teacher_id = jobData.teacher_id || req.user.user_id;
    
            const teacher = await userRepository.getTeacherById(jobData.teacher_id);
            if(!teacher) return res.status(404).send("Este usuário não é um professor, tente novamente!");
            
            const job = await jobsRepository.createJob(jobData);
            res.status(201).send(job);  
        } catch (err) {
            res.status(400).send(err.errors || err.message);
        }
    },
    async updateJob(req, res) {
        try {
            const { id } = req.params;
            const jobData = jobSchema.partial().parse(req.body);

            const teacher = await userRepository.getTeacherById(req.user.user_id);
            if(!teacher) return res.status(404).send("Este usuário não é um professor, tente novamente!");

            const job = await jobsRepository.getJobById(id);
            if (!job) res.status(404).send("Vaga não encontrada!");
            
            if (jobData.teacher_id === undefined) {
                jobData.teacher_id = req.user.user_id;
            }
        
            const filteredJobData = Object.fromEntries(
                Object.entries(jobData).filter(([_, value]) => value !== undefined)
            );
    
            if (Object.keys(filteredJobData).length === 0) {
                return res.status(400).send("Nenhuma informação foi alterada!");
            }
            
            await jobsRepository.updateJob(id, filteredJobData);
            res.status(200).send("A vaga foi atualizada com sucesso!");

        } catch (err) {
            res.status(400).send(err.errors || err.message);
        }
    }, 
    async deleteJob(req, res) {
        try {
            const { id } = req.params;
            
            const job = await jobsRepository.getJobById(id);
            if (!job) res.status(404).send("Vaga não encontrada!");
            
            await jobsRepository.deleteJob(id);

            res.status(204).send();
        } catch (err) { 
            res.status(400).send(err.errors || err.message);
        }
    }
}