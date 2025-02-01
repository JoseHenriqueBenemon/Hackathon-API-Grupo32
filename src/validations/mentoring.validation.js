const { z } = require("zod");

const mentoringSchema = z.object({
    teacher_id: z.coerce.number().min(1, "O id do professor não é válido!").optional(),
    mentoring_date: z.string().datetime({ offset: true }),
    modality: z.string(),
    matter: z.string(),
});

module.exports = { mentoringSchema };