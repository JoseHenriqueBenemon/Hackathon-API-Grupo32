const { z } = require("zod");

const mentoringSchema = z.object({
    teacher_id: z.coerce.number().min(1, "O id do professor não é válido!").optional(),
    mentoring_date: z.string().datetime({ offset: true }),
    modality: z.string(),
    matter: z.string(),
});

const getMentoringSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),  
    limit: z.coerce.number().int().min(1).max(100).default(10), 
});

module.exports = { mentoringSchema, getMentoringSchema };