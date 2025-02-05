const AppDataSource = require("../config/database");
const Likes = require("../models/likes/likes");
const Mentoring = require("../models/mentoring/mentoring");

const mentoringRepository = AppDataSource.getRepository(Mentoring);
const likesRepository = AppDataSource.getRepository(Likes);

const mentoringSelectColumns = [
    'mentoring.mentoring_id AS mentoring_mentoring_id',
    'mentoring.mentoring_date AS mentoring_mentoring_date',
    'mentoring.modality AS mentoring_modality',
    'mentoring.matter AS mentoring_matter',
    'COUNT(likes.mentoring_id) AS mentoring_like_count',
    `EXISTS (
        SELECT 1 FROM likes 
        WHERE likes.mentoring_id = mentoring.mentoring_id 
        AND likes.student_id = :user_id
    ) AS user_has_liked`,
    'teacher.teacher_id AS teacher_teacher_id',
    'teacher.personal_id AS teacher_personal_id',
    'teacher.phone AS teacher_phone',
    'teacher.is_mentored AS teacher_is_mentored',
    'teacher.bio AS teacher_bio',
    'user_account.user_id AS user_account_user_id',
    'user_account.user_type AS user_account_user_type',
    'user_account.name AS user_account_name',
    'user_account.email AS user_account_email',
    'user_account.password AS user_account_password',
];
  
function buildMentoringQuery(user_id) {
    return mentoringRepository
        .createQueryBuilder('mentoring')
        .select(mentoringSelectColumns)
        .leftJoin('mentoring.teacher', 'teacher')
        .leftJoin('teacher.user_account', 'user_account')
        .leftJoin('likes', 'likes', 'likes.mentoring_id = mentoring.mentoring_id')
        .setParameter('user_id', user_id || null);
}
  
function formatMentoringData(rawResults) {
    if (!rawResults || rawResults.length === 0) return null;

    const mentoringMap = new Map();

    rawResults.forEach(row => {
        const mentoringid = row.mentoring_mentoring_id;

        if (!mentoringMap.has(mentoringid)) {
        mentoringMap.set(mentoringid, {
            mentoring_id: mentoringid,
            teacher_id: row.mentoring_teacher_id,
            mentoring_date: row.mentoring_mentoring_date,
            modality: row.mentoring_modality,
            matter: row.mentoring_matter,
            likes: row.mentoring_like_count,
            has_liked: row.user_has_liked,
            teacher: {
            teacher_id: row.teacher_teacher_id,
            personal_id: row.teacher_personal_id,
            phone: row.teacher_phone,
            is_mentored: row.teacher_is_mentored,
            bio: row.teacher_bio,
            user_account: {
                user_id: row.user_account_user_id,
                user_type: row.user_account_user_type,
                name: row.user_account_name,
                email: row.user_account_email,
                password: row.user_account_password
            },
            },
        });
        }

    });
    
    return [...mentoringMap.values()];
}  

module.exports = {
    async getAllMentoring(page, limit, user_id) {
        const offset = (page - 1) * limit;

        const totalCount = await mentoringRepository
            .createQueryBuilder('mentoring')
            .getCount();
            
        const rawResults = await buildMentoringQuery(user_id)
            .groupBy("mentoring.mentoring_id, teacher.teacher_id, user_account.user_id")
            .limit(limit)
            .offset(offset)
            .getRawMany();

        return {
            data: formatMentoringData(rawResults) || [],
            meta: {
                page: page,
                pageIndex: page - 1,
                perPage: limit,
                totalCount: totalCount
            }
        };
    },
    async getMentoringById(id, user_id) {
        const rawResults = await buildMentoringQuery(user_id)
            .where('mentoring.mentoring_id = :id', { id })
            .groupBy("mentoring.mentoring_id, teacher.teacher_id, user_account.user_id")
            .getRawMany();

        return formatMentoringData(rawResults);
    },
    async createMentoring(mentoringData) {
        return mentoringRepository.save(mentoringData);
    },
    async updateMentoring(id, mentoringData) {
        return mentoringRepository.update({ mentoring_id: id}, mentoringData);
    }, 
    async deleteMentoring(id) {
        return mentoringRepository.delete(id);
    },
    async addLikeMentoring(likesData) {
        return likesRepository.save({
            mentoring: { mentoring_id: likesData.mentoring_id },
            student: { student_id: likesData.student_id }
        });  
    },
    async removeLikeMentoring(likesData) {
        return likesRepository.delete({
            mentoring: { mentoring_id: likesData.mentoring_id },
            student: { student_id: likesData.student_id }
        });
    },
    async countLikesMentoring(id) {
        const result = await likesRepository.createQueryBuilder('likes')
            .select("COUNT(*) AS likes_count")
            .where('likes.mentoring_id = :id', { id })
            .getRawOne();

        return result.likes_count;
    },
    async verifyLikeMentoring(likesData) {
        return likesRepository.findOne({
            where: {
                mentoring: { mentoring_id: likesData.mentoring_id },
                student: { student_id: likesData.student_id }
            }
        });
    }
}