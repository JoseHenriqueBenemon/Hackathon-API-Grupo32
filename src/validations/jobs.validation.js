const { z } = require('zod');

const jobSchema = z.object({
    title: z.string().min(1, "A vaga deve ter um título.").max(100, "O título não pode ultrapasar 100 caracteres."),
    company: z.string().min(1, "A vaga tem que ter uma empresa responsável!").max("A empresa não pode ultrapassar 100 caracteres."),
    job_type: z.string().min(1, "A vaga precisa ter um tipo. Exemplo: concurso público, jovem aprendiz etc.").max(50, "O tipo da vaga não pode ultrapassar 50 caracteres."),
    modality: z.string().min(1, "A vaga deve ter uma modalidade. Exemplo: Presencial").max(50, "A modalidade não pode ultrapassar 50 caracteres."),
    publication_date: z.string().datetime({ offset: true }),
    link: z.string().min(1, "A vaga precisa ter um link para ser redirecionada."),
    quantity: z.coerce.number().min(1, "A vaga precisa ter pelo menos 1 vaga disponível."),
    url_image: z.string().min(1, "A vaga precisa de uma imagem. Pode ser a imagem da empresa."),
    teacher_id: z.coerce.number().min(1, "O id do professor não é válido!").optional(),
})

const getJobsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),  
    limit: z.coerce.number().int().min(1).max(100).default(10), 
});

module.exports = { getJobsSchema, jobSchema }
