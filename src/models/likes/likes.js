const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Likes",
    tableName: "likes",
    columns: {
        mentoring_id: {
            type: 'int',
            primary: true,
        },
        student_id: {
            type: "int",
            primary: true,
        },
    },
    relations: {
        mentoring: {
            target: 'Mentoring',
            type: 'many-to-one', 
            joinColumn: {
                name: "mentoring_id",
                referencedColumnName: "mentoring_id"
            }
        },
        student: {
            target: 'Student',
            type: 'many-to-one', 
            joinColumn: {
                name: "student_id",
                referencedColumnName: "student_id"
            }
        }
    },
});
