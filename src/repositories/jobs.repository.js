const AppDataSource = require('../config/database');
const Jobs = require('../models/job/jobs');

const jobsRepository = AppDataSource.getRepository(Jobs);

module.exports = {
    async getAllJobs(page, limit) {
        const offset = (page - 1) * limit;

        const totalCount = await jobsRepository.count();

        const jobs = await jobsRepository.find({
            relations: ['teacher', 'teacher.user_account'],
            skip: offset,
            take: limit
        });

        return {
            data: jobs,
            meta: {
                page: page,
                pageIndex: page - 1,
                perPage: limit,
                totalCount: totalCount
            }
        };    
    },
    async getJobById(id) {
        return await jobsRepository.findOne({ where: {job_id: id}, relations: ['teacher', 'teacher.user_account']});
    },
    async createJob(jobData) {
        return await jobsRepository.save(jobData);
    },
    async updateJob(id, jobData) {
        return jobsRepository.update({ job_id: id }, jobData);
    },
    async deleteJob(id) {
        return await jobsRepository.delete(id);
    },
}