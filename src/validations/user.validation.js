const { z } = require('zod');

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const teacherSchema = userSchema.extend({
  personal_id: z.string().min(11).max(14),
  phone: z.string().min(10).max(20),
  is_mentored: z.boolean().optional(),
  bio: z.string(),
});

const studentSchema = userSchema;

module.exports = { teacherSchema, studentSchema };